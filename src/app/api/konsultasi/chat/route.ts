import { z } from "zod";
import type OpenAI from "openai";
import type { SupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import { openai } from "@/lib/openai";
import { supabaseAdmin } from "@/lib/supabase";
import { contextBlock, retrieve, toCitations } from "@/lib/rag";
import { planById, formatIDR } from "@/lib/plans";
import type { ChatAction, ChatErrorBody, Lead } from "@/lib/consultation";

export const runtime = "nodejs";

// ---- Request validation ---------------------------------------------------

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(254)
  .regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Email tidak valid");

const bodySchema = z.object({
  lead: z.object({
    name: z.string().trim().min(1).max(200),
    email,
    // Keep in sync with INDUSTRIES in src/lib/consultation.ts and the CHECK
    // constraint in migration 0007.
    industry: z.enum([
      "ecommerce",
      "hukum",
      "kesehatan",
      "keuangan",
      "pendidikan",
      "lainnya",
    ]),
    needs: z.string().max(4000).default(""),
  }),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(8000),
      }),
    )
    .min(1)
    .max(50),
});

// ---- Rate limiting (per-instance, best effort) ---------------------------

const WINDOW_MS = 10 * 60_000;
const MAX_HITS = 20;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
  }
  const rec = hits.get(key);
  if (!rec || now > rec.resetAt) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_HITS;
}

function clientIp(request: Request): string | null {
  const fwd = request.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
  return ip && /^[0-9a-f.:]+$/i.test(ip) ? ip : null;
}

// ---- Tools (function calling) --------------------------------------------
//
// Each tool both answers the model (the `content` fed back as the tool
// result) and, optionally, produces a ChatAction streamed to the client as an
// `action` frame for it to render as a card. DB writes are best-effort: a
// failure degrades to "the model still gets an answer" rather than breaking
// the turn.

type ToolCtx = {
  supabase: SupabaseClient | null;
  leadId: string | null;
  lead: Lead;
};

type ToolResult = { content: string; action?: ChatAction };

const TOOLS: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "build_estimate",
      description:
        "Buat draf estimasi harga untuk paket BYouAI yang relevan dan kembalikan tautan ke generator invoice yang sudah terisi. Panggil hanya saat pengguna eksplisit meminta estimasi/harga/biaya dan paket yang relevan (pilot/growth/enterprise) sudah cukup jelas dari percakapan.",
      parameters: {
        type: "object",
        properties: {
          plan: {
            type: "string",
            enum: ["pilot", "growth", "enterprise"],
            description: "Paket yang paling sesuai kebutuhan pengguna.",
          },
          notes: {
            type: "string",
            description: "Ringkasan singkat kebutuhan untuk dicantumkan di draf invoice (opsional).",
          },
        },
        required: ["plan"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "request_consultation_call",
      description:
        "Catat bahwa pengguna ingin dihubungi / dijadwalkan konsultasi dengan tim BYouAI. Panggil hanya saat pengguna eksplisit minta dihubungi, ditelepon, atau dijadwalkan — bukan untuk setiap pertanyaan umum.",
      parameters: {
        type: "object",
        properties: {
          preferred_time: {
            type: "string",
            description: "Waktu yang disebutkan pengguna, apa adanya (opsional).",
          },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "save_requirement_notes",
      description:
        "Simpan ringkasan kebutuhan pengguna yang sudah lebih jelas/spesifik dari catatan awal, supaya tim follow-up punya konteks lengkap. Panggil setelah percakapan menghasilkan detail yang nyata (alur kerja, sumber data, skala) — bukan untuk basa-basi.",
      parameters: {
        type: "object",
        properties: {
          summary: {
            type: "string",
            description: "Ringkasan kebutuhan, 1–3 kalimat, Bahasa Indonesia.",
          },
        },
        required: ["summary"],
        additionalProperties: false,
      },
    },
  },
];

async function toolBuildEstimate(args: unknown, ctx: ToolCtx): Promise<ToolResult> {
  const parsed = z
    .object({
      plan: z.enum(["pilot", "growth", "enterprise"]),
      notes: z.string().max(500).optional(),
    })
    .safeParse(args);
  if (!parsed.success) return { content: "Argumen tidak valid untuk build_estimate." };

  const plan = planById(parsed.data.plan);
  if (!plan) return { content: "Paket tidak ditemukan." };

  const params = new URLSearchParams({ plan: plan.id });
  if (ctx.lead.name) params.set("to", ctx.lead.name);
  if (ctx.lead.email) params.set("email", ctx.lead.email);
  if (parsed.data.notes) params.set("notes", parsed.data.notes);
  const url = `/invoice?${params.toString()}`;

  if (ctx.supabase && ctx.leadId) {
    await ctx.supabase
      .from("consultation_leads")
      .update({ desired_plan: plan.id })
      .eq("id", ctx.leadId);
  }

  return {
    content: `Draf estimasi dibuat: paket ${plan.name}, mulai ${formatIDR(plan.priceFrom)}. Tautan: ${url}`,
    action: {
      kind: "estimate",
      plan: plan.id,
      planName: plan.name,
      priceFrom: plan.priceFrom,
      url,
    },
  };
}

async function toolRequestConsultation(args: unknown, ctx: ToolCtx): Promise<ToolResult> {
  const parsed = z
    .object({ preferred_time: z.string().max(200).optional() })
    .safeParse(args);
  const preferredTime = parsed.success ? parsed.data.preferred_time : undefined;

  if (ctx.supabase && ctx.leadId) {
    await ctx.supabase
      .from("consultation_leads")
      .update({
        meeting_requested_at: new Date().toISOString(),
        meeting_preferred_time: preferredTime ?? null,
      })
      .eq("id", ctx.leadId);
  }

  return {
    content: "Permintaan konsultasi dicatat. Tim BYouAI akan menghubungi lewat email.",
    action: { kind: "meeting_requested", preferredTime },
  };
}

async function toolSaveNotes(args: unknown, ctx: ToolCtx): Promise<ToolResult> {
  const parsed = z.object({ summary: z.string().min(1).max(1000) }).safeParse(args);
  if (!parsed.success) return { content: "Argumen tidak valid untuk save_requirement_notes." };

  const summary = parsed.data.summary.trim();
  if (ctx.supabase && ctx.leadId) {
    const combined = (ctx.lead.needs ? `${ctx.lead.needs}\n${summary}` : summary).slice(
      0,
      4000,
    );
    await ctx.supabase
      .from("consultation_leads")
      .update({ needs: combined })
      .eq("id", ctx.leadId);
  }

  return { content: "Ringkasan kebutuhan tersimpan.", action: { kind: "notes_saved", summary } };
}

const TOOL_HANDLERS: Record<string, (args: unknown, ctx: ToolCtx) => Promise<ToolResult>> = {
  build_estimate: toolBuildEstimate,
  request_consultation_call: toolRequestConsultation,
  save_requirement_notes: toolSaveNotes,
};

// ---- Prompt -------------------------------------------------------------

const SYSTEM_PROMPT = `Kamu adalah asisten konsultasi BYouAI — perusahaan yang membangun asisten & agent AI berbasis RAG di atas data internal klien (e-commerce, firma hukum, klinik, dan industri lain).

Tugasmu: bantu calon klien memahami cakupan solusi, kesiapan data, timeline, dan estimasi biaya, lalu dorong mereka menjadwalkan konsultasi atau membuat estimasi paket.

Aturan:
- Jawab dalam bahasa yang dipakai pengguna (default Bahasa Indonesia), ringkas, konkret, ramah dan tidak bertele-tele.
- Gunakan KONTEKS di bawah sebagai sumber kebenaran tentang produk, paket, harga, dan kebijakan. Jangan mengarang angka harga atau fitur yang tidak ada di konteks.
- Jika sebuah klaim berasal dari konteks, tambahkan penanda sitasi seperti [1], [2] sesuai nomor sumber.
- Jika informasi tidak ada di konteks dan kamu tidak yakin, katakan belum tahu dan tawarkan untuk menghubungkan dengan tim (halo@byouai.com) atau menjadwalkan konsultasi.
- Kamu punya tiga aksi (tools): build_estimate, request_consultation_call, save_requirement_notes. Panggil hanya saat pengguna benar-benar memintanya atau percakapan jelas mengarah ke sana — jangan memanggil tool tanpa alasan atau lebih dari sekali untuk hal yang sama. Setelah tool berjalan, tutup dengan kalimat singkat yang menegaskan hasilnya.
- Jangan memberi nasihat hukum, medis, atau finansial spesifik; fokus pada bagaimana AI BYouAI membantu alur kerja tersebut.`;

function buildSystem(context: string, lead: z.infer<typeof bodySchema>["lead"]) {
  const profile = `PROFIL PENANYA:\n- Nama/perusahaan: ${lead.name}\n- Industri: ${lead.industry}\n- Kebutuhan awal: ${lead.needs || "(belum diisi)"}`;
  const ctx = context
    ? `KONTEKS (sumber pengetahuan BYouAI):\n${context}`
    : "KONTEKS: (tidak ada hasil retrieval yang relevan — jawab hati-hati, jangan mengarang.)";
  return `${SYSTEM_PROMPT}\n\n${profile}\n\n${ctx}`;
}

// ---- SSE helpers ----------------------------------------------------------

const encoder = new TextEncoder();

function sse(event: string, data: unknown): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function errorJson(body: ChatErrorBody, status: number): Response {
  return Response.json(body, { status });
}

// ---- Handler ----------------------------------------------------------

const MAX_TOOL_ROUNDS = 3; // last round always runs without tools, to force a final answer

export async function POST(request: Request): Promise<Response> {
  const ip = clientIp(request);
  if (rateLimited(ip ?? "unknown")) {
    return errorJson({ error: "Terlalu banyak pesan. Coba lagi beberapa menit lagi." }, 429);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorJson({ error: "Body JSON tidak valid." }, 400);
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return errorJson(
      { error: "Payload tidak valid.", issues: parsed.error.issues },
      422,
    );
  }
  const { lead, messages } = parsed.data;

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return errorJson({ error: "Butuh minimal satu pesan dari pengguna." }, 422);
  }

  // Retrieval is best-effort: retrieve() already swallows its own errors.
  const chunks = await retrieve(lastUser.content, { matchCount: 5, minSimilarity: 0.3 });
  const citations = toCitations(chunks);

  const history: OpenAI.Chat.ChatCompletionMessageParam[] = messages
    .slice(-12)
    .map((m) =>
      m.role === "user"
        ? { role: "user", content: m.content }
        : { role: "assistant", content: m.content },
    );
  const convo: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: buildSystem(contextBlock(chunks), lead) },
    ...history,
  ];

  const userAgent = request.headers.get("user-agent");

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // supabaseAdmin() throws synchronously when Supabase env is missing —
      // never let that (or any other DB hiccup) crash the stream. The chat
      // still works without persistence; every use below is null-guarded.
      let supabase: SupabaseClient | null = null;
      let leadId: string | null = null;
      try {
        supabase = supabaseAdmin();
        const { data: leadRow, error: leadErr } = await supabase
          .from("consultation_leads")
          .upsert(
            {
              email: lead.email,
              name: lead.name,
              industry: lead.industry,
              needs: lead.needs,
              request_ip: ip,
              user_agent: userAgent,
            },
            { onConflict: "email" },
          )
          .select("id")
          .single();
        if (leadErr) throw leadErr;
        leadId = leadRow?.id ?? null;
        if (leadId) {
          await supabase
            .from("consultation_messages")
            .insert({ lead_id: leadId, role: "user", content: lastUser.content });
        }
      } catch (err) {
        console.error("[konsultasi] lead upsert failed:", err);
      }

      const ctx: ToolCtx = { supabase, leadId, lead };
      const actions: ChatAction[] = [];
      let finalContent = "";

      try {
        controller.enqueue(sse("citations", citations));

        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
          const allowTools = round < MAX_TOOL_ROUNDS - 1;
          const completion = await openai().chat.completions.create({
            model: env.chatModel,
            temperature: 0.3,
            max_completion_tokens: 700,
            messages: convo,
            stream: true,
            ...(allowTools ? { tools: TOOLS, tool_choice: "auto" as const } : {}),
          });

          let roundContent = "";
          const toolCallAcc = new Map<
            number,
            { id: string; name: string; arguments: string }
          >();

          for await (const chunk of completion) {
            const delta = chunk.choices[0]?.delta;
            if (delta?.content) {
              roundContent += delta.content;
              controller.enqueue(sse("token", delta.content));
            }
            if (delta?.tool_calls) {
              for (const tc of delta.tool_calls) {
                const acc = toolCallAcc.get(tc.index) ?? { id: "", name: "", arguments: "" };
                if (tc.id) acc.id = tc.id;
                if (tc.function?.name) acc.name += tc.function.name;
                if (tc.function?.arguments) acc.arguments += tc.function.arguments;
                toolCallAcc.set(tc.index, acc);
              }
            }
          }

          finalContent += roundContent;

          if (toolCallAcc.size === 0) break; // model gave its final answer this round

          const toolCalls = [...toolCallAcc.values()];
          convo.push({
            role: "assistant",
            content: roundContent || null,
            tool_calls: toolCalls.map((tc) => ({
              id: tc.id,
              type: "function",
              function: { name: tc.name, arguments: tc.arguments || "{}" },
            })),
          });

          for (const tc of toolCalls) {
            const handler = TOOL_HANDLERS[tc.name];
            let args: unknown = {};
            try {
              args = tc.arguments ? JSON.parse(tc.arguments) : {};
            } catch {
              // Malformed arguments: fall through with {} and let the handler reject it.
            }

            let result: ToolResult;
            if (!handler) {
              result = { content: `Tool ${tc.name} tidak dikenal.` };
            } else {
              try {
                result = await handler(args, ctx);
              } catch (err) {
                console.error(`[konsultasi] tool ${tc.name} failed:`, err);
                result = { content: "Terjadi kesalahan saat menjalankan aksi ini." };
              }
            }

            if (result.action) {
              actions.push(result.action);
              controller.enqueue(sse("action", result.action));
            }
            convo.push({ role: "tool", tool_call_id: tc.id, content: result.content });
          }
        }

        if (!finalContent.trim()) {
          const fallback = "Baik, dicatat. Ada lagi yang bisa saya bantu?";
          finalContent = fallback;
          controller.enqueue(sse("token", fallback));
        }

        if (supabase && leadId) {
          try {
            await supabase.from("consultation_messages").insert({
              lead_id: leadId,
              role: "assistant",
              content: finalContent,
              citations,
              actions,
            });
          } catch (err) {
            console.error("[konsultasi] assistant message persist failed:", err);
          }
        }

        controller.enqueue(sse("done", {}));
      } catch (err) {
        console.error("[konsultasi] generation failed:", err);
        controller.enqueue(
          sse("error", { message: "Asisten sedang tidak tersedia. Coba lagi sebentar." }),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

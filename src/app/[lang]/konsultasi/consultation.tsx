"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Container, Kicker } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatIDR } from "@/lib/plans";
import {
  INDUSTRIES,
  industryLabel,
  type ChatAction,
  type ChatMessage,
  type Citation,
  type Industry,
  type Lead,
} from "@/lib/consultation";
import type { Dictionary } from "@/dictionaries/id";

const fieldCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-ink/30";

type Phase = "intake" | "chat";

type UiMessage = ChatMessage & {
  id: string;
  citations?: Citation[];
  actions?: ChatAction[];
};

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

/**
 * Parse the `text/event-stream` body of POST /api/konsultasi/chat. Frame
 * shape is documented in src/lib/consultation.ts, next to ChatAction.
 */
async function readSse(
  body: ReadableStream<Uint8Array>,
  handlers: {
    onCitations: (c: Citation[]) => void;
    onToken: (t: string) => void;
    onAction: (a: ChatAction) => void;
    onError: (message: string) => void;
  },
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let sep: number;
    while ((sep = buffer.indexOf("\n\n")) !== -1) {
      const frame = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);

      let event = "message";
      let data = "";
      for (const line of frame.split("\n")) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) data += line.slice(5).trim();
      }
      if (!data) continue;

      let payload: unknown;
      try {
        payload = JSON.parse(data);
      } catch {
        continue;
      }

      if (event === "citations") handlers.onCitations(payload as Citation[]);
      else if (event === "token") handlers.onToken(payload as string);
      else if (event === "action") handlers.onAction(payload as ChatAction);
      else if (event === "error")
        handlers.onError((payload as { message: string }).message);
    }
  }
}

export function Consultation({
  dict,
  initialIndustry,
}: {
  dict: Dictionary["konsultasi"];
  initialIndustry?: Industry;
}) {
  const [phase, setPhase] = useState<Phase>("intake");
  const [lead, setLead] = useState<Lead>({
    name: "",
    email: "",
    industry: initialIndustry ?? "ecommerce",
    needs: "",
  });
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Keep the transcript pinned to the newest message.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  // Don't leave a fetch running against an unmounted page.
  useEffect(() => () => abortRef.current?.abort(), []);

  const setLeadField = <K extends keyof Lead>(key: K, value: Lead[K]) =>
    setLead((l) => ({ ...l, [key]: value }));

  const patchMessage = (id: string, patch: (m: UiMessage) => UiMessage) =>
    setMessages((m) => m.map((msg) => (msg.id === id ? patch(msg) : msg)));

  const startChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead.name.trim() || !lead.email.trim()) return;
    const firstName = lead.name.trim().split(/\s+/)[0];
    const greeting: UiMessage = {
      id: uid(),
      role: "assistant",
      content:
        `Halo ${firstName}, saya asisten BYouAI. ` +
        `Anda dari ${industryLabel(lead.industry).toLowerCase()} — ` +
        (lead.needs.trim()
          ? `soal "${lead.needs.trim()}", ceritakan lebih detail ya.`
          : `ceritakan alur kerja atau pertanyaan yang ingin dibantu AI.`),
    };
    setMessages([greeting]);
    setError(null);
    setPhase("chat");
    setTimeout(() => composerRef.current?.focus(), 0);
  };

  const send = async () => {
    const text = draft.trim();
    if (!text || pending) return;
    setError(null);

    const userMsg: UiMessage = { id: uid(), role: "user", content: text };
    const history = [...messages, userMsg];
    const assistantMsg: UiMessage = {
      id: uid(),
      role: "assistant",
      content: "",
      citations: [],
      actions: [],
    };
    setMessages([...history, assistantMsg]);
    setDraft("");
    setPending(true);
    setStreamingId(assistantMsg.id);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/konsultasi/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lead,
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      await readSse(res.body, {
        onCitations: (c) =>
          patchMessage(assistantMsg.id, (m) => ({ ...m, citations: c })),
        onToken: (t) =>
          patchMessage(assistantMsg.id, (m) => ({ ...m, content: m.content + t })),
        onAction: (a) =>
          patchMessage(assistantMsg.id, (m) => ({
            ...m,
            actions: [...(m.actions ?? []), a],
          })),
        onError: (message) => setError(message),
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Gagal mengirim pesan. Coba lagi sebentar.",
      );
    } finally {
      setPending(false);
      setStreamingId(null);
      abortRef.current = null;
    }
  };

  const onComposerKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  return (
    <section className="py-14 md:py-20">
      <Container>
        <div className="max-w-2xl">
          <Kicker>{dict.kicker}</Kicker>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-[2.6rem] md:leading-[1.12]">
            {dict.titleBefore}{" "}
            <span className="font-serif font-normal italic text-accent-strong">
              {dict.titleEmphasis}
            </span>{" "}
            {dict.titleAfter}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
            {dict.lead}
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-8">
          {/* ---- Left: intake form / lead summary ---- */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {phase === "intake" ? (
              <form
                onSubmit={startChat}
                className="space-y-4 rounded-2xl border border-line bg-surface p-5 md:p-6"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Data singkat
                </p>
                <Field label="Nama / perusahaan">
                  <input
                    required
                    value={lead.name}
                    onChange={(e) => setLeadField("name", e.target.value)}
                    className={fieldCls}
                  />
                </Field>
                <Field label="Email">
                  <input
                    required
                    type="email"
                    value={lead.email}
                    onChange={(e) => setLeadField("email", e.target.value)}
                    className={fieldCls}
                  />
                </Field>
                <Field label="Industri">
                  <select
                    value={lead.industry}
                    onChange={(e) =>
                      setLeadField("industry", e.target.value as Industry)
                    }
                    className={fieldCls}
                  >
                    {INDUSTRIES.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Kebutuhan singkat (opsional)">
                  <textarea
                    rows={3}
                    value={lead.needs}
                    onChange={(e) => setLeadField("needs", e.target.value)}
                    className={cn(fieldCls, "resize-y")}
                    placeholder="Mis. asisten untuk tim CS yang jawab dari katalog & kebijakan retur"
                  />
                </Field>
                <button
                  type="submit"
                  className="w-full rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-[filter] hover:brightness-[1.06]"
                >
                  Mulai konsultasi
                </button>
                <p className="text-xs leading-relaxed text-muted">
                  Dengan memulai, Anda setuju percakapan dan kontak ini kami
                  simpan untuk menindaklanjuti kebutuhan Anda. Lihat{" "}
                  <Link
                    href="/privasi"
                    className="underline underline-offset-2 hover:text-ink"
                  >
                    Kebijakan Privasi
                  </Link>
                  .
                </p>
              </form>
            ) : (
              <div className="rounded-2xl border border-line bg-surface p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    Peserta
                  </p>
                  <button
                    type="button"
                    onClick={() => setPhase("intake")}
                    className="text-xs text-muted underline underline-offset-2 hover:text-ink"
                  >
                    Ubah
                  </button>
                </div>
                <dl className="mt-3 space-y-2.5 text-sm">
                  <SummaryRow k="Nama / perusahaan" v={lead.name} />
                  <SummaryRow k="Email" v={lead.email} />
                  <SummaryRow k="Industri" v={industryLabel(lead.industry)} />
                  {lead.needs.trim() ? (
                    <SummaryRow k="Kebutuhan" v={lead.needs} multiline />
                  ) : null}
                </dl>
              </div>
            )}
          </div>

          {/* ---- Right: chat ---- */}
          <div className="flex min-h-[30rem] flex-col overflow-hidden rounded-2xl border border-line bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 md:px-5">
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/12 font-mono text-xs text-accent-strong">
                  AI
                </span>
                <span className="text-sm font-medium">Asisten BYouAI</span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-wide text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                RAG
              </span>
            </div>

            <div
              ref={listRef}
              className="flex-1 space-y-4 overflow-y-auto px-4 py-5 md:px-5"
              style={{ maxHeight: "60vh" }}
            >
              {phase === "intake" ? (
                <div className="grid h-full min-h-[16rem] place-items-center px-6 text-center">
                  <p className="max-w-xs text-sm text-muted">
                    Isi data singkat di samping, lalu mulai konsultasi untuk
                    berbicara dengan asisten.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((m) => {
                    const isStreaming = m.id === streamingId;
                    const empty = m.content === "" && !m.actions?.length;
                    return (
                      <div key={m.id} className="space-y-1.5">
                        {isStreaming && empty ? (
                          <Typing />
                        ) : m.content ? (
                          <Bubble role={m.role}>
                            {m.content}
                            {isStreaming ? <Cursor /> : null}
                          </Bubble>
                        ) : null}
                        {m.actions?.map((a, i) => (
                          <ActionCard key={i} action={a} />
                        ))}
                        {m.role === "assistant" && m.citations?.length ? (
                          <Sources items={m.citations} />
                        ) : null}
                      </div>
                    );
                  })}
                  {error ? (
                    <p className="text-center text-xs text-red-500">{error}</p>
                  ) : null}
                </>
              )}
            </div>

            <div className="border-t border-line p-3 md:p-4">
              <div className="flex items-end gap-2">
                <textarea
                  ref={composerRef}
                  rows={2}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onComposerKey}
                  disabled={phase === "intake"}
                  placeholder={
                    phase === "intake"
                      ? "Mulai konsultasi dulu…"
                      : "Tulis pesan… (Enter kirim, Shift+Enter baris baru)"
                  }
                  className={cn(
                    fieldCls,
                    "resize-none disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                />
                <button
                  type="button"
                  onClick={() => void send()}
                  disabled={phase === "intake" || pending || !draft.trim()}
                  className="rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition-[filter] hover:brightness-[1.06] disabled:opacity-40"
                >
                  Kirim
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

function SummaryRow({
  k,
  v,
  multiline = false,
}: {
  k: string;
  v: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-muted">{k}</dt>
      <dd className={cn("mt-0.5 text-ink", multiline && "whitespace-pre-line")}>
        {v}
      </dd>
    </div>
  );
}

function Bubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser ? "bg-accent text-accent-fg" : "bg-surface-2 text-ink",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Blinking caret appended to the bubble currently being streamed into. */
function Cursor() {
  return (
    <span className="ml-0.5 inline-block h-3.5 w-1.5 -mb-0.5 animate-pulse bg-current align-middle" />
  );
}

/** Card rendered for a completed tool call (build_estimate, etc). */
function ActionCard({ action }: { action: ChatAction }) {
  if (action.kind === "estimate") {
    return (
      <div className="max-w-[85%] rounded-xl border border-line bg-surface p-3.5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent-strong">
          Estimasi paket
        </p>
        <p className="mt-1 text-sm">
          {action.planName} — mulai{" "}
          <span className="font-mono">{formatIDR(action.priceFrom)}</span>
        </p>
        <a
          href={action.url}
          className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-accent-strong underline underline-offset-2 hover:text-ink"
        >
          Buka draf estimasi →
        </a>
      </div>
    );
  }
  if (action.kind === "meeting_requested") {
    return (
      <div className="max-w-[85%] rounded-xl border border-line bg-surface p-3.5 text-sm leading-relaxed">
        <span className="text-accent-strong">✓</span> Permintaan konsultasi
        dicatat{action.preferredTime ? ` — ${action.preferredTime}` : ""}. Tim
        kami akan menghubungi lewat email.
      </div>
    );
  }
  return (
    <div className="max-w-[85%] rounded-xl border border-line bg-surface p-3.5 text-sm leading-relaxed">
      <span className="text-accent-strong">✓</span> Kebutuhan tersimpan:{" "}
      {action.summary}
    </div>
  );
}

function Sources({ items }: { items: Citation[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 pl-1">
      <span className="text-[0.7rem] uppercase tracking-wide text-muted">
        Sumber:
      </span>
      {items.map((c, i) => (
        <a
          key={i}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-line px-2 py-0.5 text-[0.7rem] text-muted transition-colors hover:border-ink/25 hover:text-ink"
        >
          {c.title}
        </a>
      ))}
    </div>
  );
}

function Typing() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 rounded-2xl bg-surface-2 px-3.5 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

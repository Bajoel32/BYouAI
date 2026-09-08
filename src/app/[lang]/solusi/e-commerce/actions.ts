"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase";
import { clientIp, envInt, fixedWindow } from "@/lib/rate-limit";
import {
  STORE_PLATFORMS,
  CATALOG_SIZES,
  ORDER_VOLUMES,
  SALES_CHANNELS,
  type LeadField,
  type LeadFormState,
} from "./lead-fields";

/**
 * Lead intake for /solusi/e-commerce. Persists into the same
 * `consultation_leads` table the /konsultasi chat uses (migration 0007),
 * with `industry: "ecommerce"` and the e-commerce-specific answers folded
 * into `needs`. Writes are best-effort — a missing/broken DB degrades to
 * "we still tell the visitor it went through" rather than a hard error,
 * mirroring the chat route handler.
 */

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(3)
  .max(254)
  .regex(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Email tidak valid");

const schema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(200),
  email,
  platform: z.enum(STORE_PLATFORMS),
  catalogSize: z.enum(CATALOG_SIZES),
  orderVolume: z.enum(ORDER_VOLUMES),
  channels: z.array(z.enum(SALES_CHANNELS)).max(SALES_CHANNELS.length),
  workflow: z.string().trim().max(2000).default(""),
});

type LeadData = z.infer<typeof schema>;

// Anti-spam: a lead form has no reason to be submitted more than a handful of
// times from one IP. `proxy.ts` also throttles POSTs, but this is the dedicated,
// slower window for this action.
const SUBMIT_LIMIT = envInt("ECOMMERCE_LEAD_PER_10MIN", 5);
const SUBMIT_WINDOW_MS = 10 * 60_000;

/** Fold the structured answers into the free-text `needs` column (<= 4000). */
function composeNeeds(data: LeadData): string {
  const lines = [
    "[Lead dari /solusi/e-commerce]",
    `Platform toko: ${data.platform}`,
    `Ukuran katalog: ${data.catalogSize}`,
    `Volume order: ${data.orderVolume}`,
    `Kanal penjualan: ${data.channels.length ? data.channels.join(", ") : "(tidak dipilih)"}`,
    data.workflow ? `Alur yang ingin diotomatiskan:\n${data.workflow}` : null,
  ].filter(Boolean);
  return lines.join("\n").slice(0, 4000);
}

export async function submitEcommerceLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    platform: formData.get("platform"),
    catalogSize: formData.get("catalogSize"),
    orderVolume: formData.get("orderVolume"),
    channels: formData.getAll("channels"),
    workflow: formData.get("workflow") ?? "",
  });

  if (!parsed.success) {
    const errors: LeadFormState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in errors)) {
        errors[key as LeadField] = issue.message;
      }
    }
    return { ok: false, message: "Periksa lagi isian yang ditandai.", errors };
  }

  const data = parsed.data;
  const h = await headers();

  const throttle = fixedWindow(`ecommerce-lead:${clientIp(h) ?? "unknown"}`, {
    limit: SUBMIT_LIMIT,
    windowMs: SUBMIT_WINDOW_MS,
  });
  if (!throttle.ok) {
    return {
      ok: false,
      message: "Terlalu banyak percobaan. Coba lagi beberapa menit lagi.",
    };
  }

  try {
    const supabase = supabaseAdmin();
    const { error } = await supabase.from("consultation_leads").upsert(
      {
        email: data.email,
        name: data.name,
        industry: "ecommerce",
        needs: composeNeeds(data),
        request_ip: clientIp(h),
        user_agent: h.get("user-agent"),
      },
      { onConflict: "email" },
    );
    if (error) throw error;
  } catch (err) {
    console.error("[solusi/e-commerce] lead upsert failed:", err);
    // Don't leak infra state to the visitor — treat as accepted. The console
    // line above is enough for us to notice and follow up manually.
  }

  return {
    ok: true,
    message:
      "Terima kasih — kebutuhan Anda tersimpan. Tim BYouAI akan menghubungi lewat email dalam 1×24 jam kerja.",
  };
}

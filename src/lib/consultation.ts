/**
 * Shared contract for the /konsultasi assistant. The chat UI
 * (app/konsultasi/consultation.tsx) and the route handler
 * (app/api/konsultasi/chat/route.ts) both import from here so the
 * request/response shape lives in one place.
 *
 * Backend: OpenAI (chat + embeddings, streamed, with tool calling) + Supabase
 * (pgvector RAG, lead & transcript storage). See src/lib/env.ts, openai.ts,
 * supabase.ts, rag.ts, knowledge.mts, migrations 0006–0010, and
 * `npm run ingest`.
 *
 * POST /api/konsultasi/chat takes a JSON body of `{ lead, messages }` and,
 * once the request passes validation, always responds 200 `text/event-stream`
 * — even for a
 * mid-generation failure, which arrives as an `error` frame rather than an
 * HTTP error status (headers are already flushed by then). Frames:
 *
 *   event: citations   data: Citation[]      — once, before any tokens
 *   event: token        data: string          — an assistant text chunk (JSON string)
 *   event: action        data: ChatAction      — a completed tool call, client-renderable
 *   event: error          data: { message }    — generation failed; stream ends after this
 *   event: done            data: {}            — stream complete
 */

import type { PlanId } from "@/lib/plans";

export type Industry =
  | "ecommerce"
  | "hukum"
  | "kesehatan"
  | "keuangan"
  | "pendidikan"
  | "lainnya";

export const INDUSTRIES: { id: Industry; label: string }[] = [
  { id: "ecommerce", label: "E-commerce & ritel" },
  { id: "hukum", label: "Firma hukum" },
  { id: "kesehatan", label: "Klinik & praktik dokter" },
  { id: "keuangan", label: "Keuangan & asuransi" },
  { id: "pendidikan", label: "Pendidikan" },
  { id: "lainnya", label: "Industri lain" },
];

export const industryLabel = (id: string): string =>
  INDUSTRIES.find((i) => i.id === id)?.label ?? "bisnis Anda";

/** Type guard for the `?industri=` query param on `/konsultasi`. */
export const isIndustry = (value: unknown): value is Industry =>
  typeof value === "string" && INDUSTRIES.some((i) => i.id === value);

export type Lead = {
  name: string;
  email: string;
  industry: Industry;
  needs: string;
};

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type Citation = {
  title: string;
  url: string;
};

/** A completed tool call, rendered by the client as an action card. */
export type ChatAction =
  | {
      kind: "estimate";
      plan: PlanId;
      planName: string;
      priceFrom: number;
      /** /invoice?... deep link, pre-filled from the lead + tool args. */
      url: string;
    }
  | {
      kind: "meeting_requested";
      preferredTime?: string;
    }
  | {
      kind: "notes_saved";
      summary: string;
    };

/** Body of a pre-stream error response (validation, rate limit, bad JSON). */
export type ChatErrorBody = {
  error: string;
  issues?: unknown;
};

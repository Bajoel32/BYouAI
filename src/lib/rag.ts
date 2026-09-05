import { env } from "@/lib/env";
import { openai } from "@/lib/openai";
import { supabaseAdmin } from "@/lib/supabase";
import type { Citation } from "@/lib/consultation";

export type RetrievedChunk = {
  title: string;
  url: string | null;
  content: string;
  similarity: number;
};

/** Embed a single string with the configured embedding model. */
async function embed(text: string): Promise<number[]> {
  const res = await openai().embeddings.create({
    model: env.embeddingModel,
    input: text.replace(/\s+/g, " ").trim().slice(0, 8000),
  });
  return res.data[0].embedding;
}

/**
 * Cosine-similarity search over knowledge_docs via the match_knowledge_docs
 * RPC. Returns [] on any failure so the assistant degrades to an un-grounded
 * answer rather than erroring the whole request.
 */
export async function retrieve(
  query: string,
  { matchCount = 5, minSimilarity = 0.3 }: {
    matchCount?: number;
    minSimilarity?: number;
  } = {},
): Promise<RetrievedChunk[]> {
  try {
    const queryEmbedding = await embed(query);
    const { data, error } = await supabaseAdmin().rpc("match_knowledge_docs", {
      query_embedding: queryEmbedding,
      match_count: matchCount,
      min_similarity: minSimilarity,
    });
    if (error) {
      console.error("[rag] match_knowledge_docs failed:", error.message);
      return [];
    }
    return (data ?? []) as RetrievedChunk[];
  } catch (err) {
    console.error("[rag] retrieve failed:", err);
    return [];
  }
}

/** Numbered context block for the system prompt. Empty string when nothing hit. */
export function contextBlock(chunks: RetrievedChunk[]): string {
  return chunks
    .map((c, i) => `[${i + 1}] ${c.title}\n${c.content}`)
    .join("\n\n");
}

/** Dedupe retrieved chunks into citations for the client. */
export function toCitations(chunks: RetrievedChunk[]): Citation[] {
  const seen = new Set<string>();
  const out: Citation[] = [];
  for (const c of chunks) {
    const url = c.url || "https://byouai.com";
    if (seen.has(url)) continue;
    seen.add(url);
    out.push({ title: c.title, url });
  }
  return out;
}

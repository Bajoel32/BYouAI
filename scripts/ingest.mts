/**
 * Embed src/lib/knowledge.mts into the `knowledge_docs` table.
 *
 *   node --env-file=.env.local scripts/ingest.mts
 *   # or: npm run ingest
 *
 * Idempotent: rows are upserted on (source, slug), so editing a chunk and
 * re-running replaces its embedding in place. Run after any edit to
 * src/lib/knowledge.mts, and after changing OPENAI_EMBEDDING_MODEL (which also
 * needs a new migration for the vector column width).
 */
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { KNOWLEDGE } from "../src/lib/knowledge.mts";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY } = process.env;
const EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENAI_API_KEY) {
  console.error(
    "Missing env. Need SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY.\n" +
      "Run with: node --env-file=.env.local scripts/ingest.mts",
  );
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const inputs = KNOWLEDGE.map((k) =>
  `${k.title}\n${k.content}`.replace(/\s+/g, " ").trim(),
);

console.log(`Embedding ${KNOWLEDGE.length} chunks with ${EMBEDDING_MODEL}…`);
const embedding = await openai.embeddings.create({
  model: EMBEDDING_MODEL,
  input: inputs,
});

const rows = KNOWLEDGE.map((k, i) => ({
  source: k.source,
  slug: k.slug,
  title: k.title,
  url: k.url ?? null,
  content: k.content,
  embedding: embedding.data[i].embedding,
}));

const { error } = await supabase
  .from("knowledge_docs")
  .upsert(rows, { onConflict: "source,slug" });

if (error) {
  console.error("Upsert failed:", error.message);
  process.exit(1);
}

console.log(`Ingested ${rows.length} chunks into knowledge_docs.`);

/**
 * Server-side environment. Only ever imported from route handlers and the
 * modules they pull in (Supabase / OpenAI clients) — never from a Client
 * Component. Access every secret through here so a missing var fails loudly at
 * first use with a clear message instead of an opaque client error.
 */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

export const env = {
  get supabaseUrl() {
    return required("SUPABASE_URL");
  },
  get supabaseServiceRoleKey() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  get openaiApiKey() {
    return required("OPENAI_API_KEY");
  },
  /** Chat model for the consultation assistant. Override per environment. */
  get chatModel() {
    return process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";
  },
  /** Must match the vector(N) width in migration 0009. */
  get embeddingModel() {
    return process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
  },
};

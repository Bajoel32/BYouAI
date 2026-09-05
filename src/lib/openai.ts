import OpenAI from "openai";
import { env } from "@/lib/env";

/** Shared OpenAI client. Lazily created so env is only required on first use. */
let client: OpenAI | null = null;

export function openai(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: env.openaiApiKey });
  }
  return client;
}

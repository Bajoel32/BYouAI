import OpenAI from "openai";
import { env } from "@/lib/env";

/** Shared OpenAI client. Lazily created so env is only required on first use. */
let client: OpenAI | null = null;

export function openai(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: env.openaiApiKey,
      // SDK defaults (10 min timeout, 2 retries) are far too generous for a
      // public endpoint: a slow upstream would tie up a streaming response and,
      // with retries, multiply spend under load. Keep it tight — the chat route
      // also sets `maxDuration = 30`.
      timeout: 25_000,
      maxRetries: 1,
    });
  }
  return client;
}

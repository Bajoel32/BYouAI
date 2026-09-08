/**
 * In-memory abuse guards shared by `proxy.ts` and the /konsultasi chat route.
 *
 * No dependencies and no shared store: every counter lives in this module's
 * scope, so it is per-process and resets on redeploy. That is enough to blunt
 * casual floods and runaway OpenAI spend on a single-instance deploy. Horizontal
 * scaling, or a determined attacker, needs an edge WAF / shared store — see
 * SECURITY.md.
 *
 * A previous version of this project had a `src/lib/rate-limit.ts` that was
 * removed with the clinic-dokter routes (see RECOVERY-NOTES.md); this is a
 * fresh, smaller implementation.
 */

// ---- Per-key fixed window ----------------------------------------------------

export type RateResult = {
  ok: boolean;
  /** Requests left in the current window (0 when blocked). */
  remaining: number;
  /** Seconds until the window resets — send as the `Retry-After` header. */
  retryAfterSec: number;
};

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const SWEEP_AT = 10_000;

/**
 * Fixed-window counter keyed by an arbitrary string (typically `ip` or
 * `ip:scope`). Buckets are swept lazily once the map grows past `SWEEP_AT` so a
 * flood of unique keys cannot grow memory without bound.
 */
export function fixedWindow(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): RateResult {
  const now = Date.now();

  if (buckets.size > SWEEP_AT) {
    for (const [k, b] of buckets) if (now > b.resetAt) buckets.delete(k);
  }

  let b = buckets.get(key);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
  }
  b.count += 1;

  const retryAfterSec = Math.max(1, Math.ceil((b.resetAt - now) / 1000));
  return b.count > limit
    ? { ok: false, remaining: 0, retryAfterSec }
    : { ok: true, remaining: limit - b.count, retryAfterSec };
}

// ---- Process-wide gate (not keyed by IP) -----------------------------------

/**
 * A ceiling on how much expensive work (OpenAI calls) the whole process will do,
 * regardless of which IP asks. This is the backstop for the fact that per-IP
 * limits sit on a spoofable `x-forwarded-for` — rotating that header defeats
 * `fixedWindow`, but every accepted request still passes through here.
 */
const gate: { recent: number[]; inFlight: number } = { recent: [], inFlight: 0 };

export type GateResult =
  | { ok: true; release: () => void }
  | { ok: false; reason: "rate" | "concurrency"; retryAfterSec: number };

export function acquireGlobalSlot({
  maxPerMin,
  maxConcurrent,
}: {
  maxPerMin: number;
  maxConcurrent: number;
}): GateResult {
  const now = Date.now();
  const cutoff = now - 60_000;
  while (gate.recent.length && gate.recent[0] < cutoff) gate.recent.shift();

  if (gate.inFlight >= maxConcurrent) {
    return { ok: false, reason: "concurrency", retryAfterSec: 5 };
  }
  if (gate.recent.length >= maxPerMin) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((gate.recent[0] + 60_000 - now) / 1000),
    );
    return { ok: false, reason: "rate", retryAfterSec };
  }

  gate.recent.push(now);
  gate.inFlight += 1;
  let released = false;
  return {
    ok: true,
    release() {
      if (released) return;
      released = true;
      gate.inFlight = Math.max(0, gate.inFlight - 1);
    },
  };
}

// ---- Client IP ------------------------------------------------------------

/**
 * Best-effort client IP from proxy headers.
 *
 * NOTE: `x-forwarded-for` / `x-real-ip` are trivially spoofable unless a trusted
 * proxy in front rewrites them. Per-IP limits built on this can be bypassed by
 * rotating the header; `acquireGlobalSlot` is the guard that does not trust it.
 */
export function clientIp(headers: Headers): string | null {
  const fwd = headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || headers.get("x-real-ip");
  return ip && /^[0-9a-f.:]+$/i.test(ip) ? ip : null;
}

// ---- Env-tunable knobs ----------------------------------------------------

/** Parse a positive integer from env, falling back to `fallback`. */
export function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  const n = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

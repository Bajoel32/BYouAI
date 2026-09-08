/**
 * Edge guard rails for every request that reaches the app.
 *
 * `middleware.ts` was renamed to `proxy.ts` in Next.js 16
 * (node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
 * Proxy runs on the Node.js runtime, before routes render, so it is the one
 * choke point where we can throttle and reject abusive traffic — page floods,
 * form spam, and cross-site POSTs to the OpenAI-backed chat route — before any
 * expensive work happens.
 *
 * What this does NOT do: stop volumetric (L3/L4) DDoS. That needs a CDN/WAF in
 * front of the origin (Cloudflare, Vercel, Nginx `limit_req`). See SECURITY.md.
 *
 * Every threshold is a named constant with a `process.env` override so it can be
 * tuned per environment without a code change.
 */

import { NextResponse, type NextRequest } from "next/server";
import { clientIp, envInt, fixedWindow } from "@/lib/rate-limit";
import { DEFAULT_LOCALE, LOCALE_COOKIE } from "@/lib/i18n";

// ---- Tunables -----------------------------------------------------------------

/** All matched routes, per IP. */
const GENERAL_LIMIT = envInt("RL_GENERAL_PER_MIN", 60);
/** `/api/*` and any POST (Server Actions included), per IP. Stricter. */
const SENSITIVE_LIMIT = envInt("RL_SENSITIVE_PER_MIN", 12);
const WINDOW_MS = 60_000;
/** Reject `/api/*` requests whose declared body is larger than this. */
const API_MAX_BODY_BYTES = envInt("API_MAX_BODY_BYTES", 1_048_576); // 1 MiB

const ALLOWED_METHODS = new Set(["GET", "HEAD", "POST", "OPTIONS"]);

// ---- Helpers ---------------------------------------------------------------

function tooMany(retryAfterSec: number): NextResponse {
  return NextResponse.json(
    { error: "Terlalu banyak permintaan. Coba lagi sebentar." },
    { status: 429, headers: { "Retry-After": String(retryAfterSec) } },
  );
}

/**
 * Locale routing. Indonesian (the default) is served without a URL prefix;
 * English lives under `/en`. Every page route lives under `app/[lang]`, so:
 *
 *   - `/en` and `/en/*`  → pass through, matches `[lang]=en`
 *   - `/id` and `/id/*`  → redirect to the bare form (no duplicate URLs)
 *   - anything else       → rewritten to `/id/...` (visible URL is unchanged)
 *
 * A visitor who picked English before (the `NEXT_LOCALE` cookie, set by the
 * language switcher) is redirected from a bare path to its `/en` equivalent.
 * Without that cookie there is no `Accept-Language` sniffing — Indonesian is
 * simply the default.
 */
function resolveLocale(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl;
  const segment = pathname.split("/")[1];

  if (segment === "en") return undefined;

  if (segment === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(DEFAULT_LOCALE.length + 1) || "/";
    return NextResponse.redirect(url);
  }

  if (request.cookies.get(LOCALE_COOKIE)?.value === "en") {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

/**
 * True when a state-changing request clearly comes from another site. Browsers
 * send `Origin` on every POST and `Sec-Fetch-Site` on every request; a
 * first-party `fetch` is `same-origin`. Non-browser clients (curl, bots) send
 * neither and are treated as cross-site here — intentional for endpoints that
 * only the site's own UI calls.
 */
function isCrossSite(request: NextRequest): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site");
  if (secFetchSite) return !["same-origin", "same-site", "none"].includes(secFetchSite);

  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host !== request.nextUrl.host;
  } catch {
    return true;
  }
}

// ---- Proxy ---------------------------------------------------------------

export function proxy(request: NextRequest): NextResponse {
  const { method } = request;
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");

  // 1. Method allow-list — drop TRACE/PUT/DELETE/etc. outright.
  if (!ALLOWED_METHODS.has(method)) {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  const ip = clientIp(request.headers) ?? "unknown";

  // 2. General per-IP rate limit across everything matched.
  const general = fixedWindow(`g:${ip}`, { limit: GENERAL_LIMIT, windowMs: WINDOW_MS });
  if (!general.ok) return tooMany(general.retryAfterSec);

  // 3. Stricter bucket for API routes and any write (Server Actions POST to
  //    their own page route, so this covers them too).
  if (isApi || method === "POST") {
    const sensitive = fixedWindow(`s:${ip}`, {
      limit: SENSITIVE_LIMIT,
      windowMs: WINDOW_MS,
    });
    if (!sensitive.ok) return tooMany(sensitive.retryAfterSec);
  }

  // 4. CSRF-style origin check for writes to /api/* (Server Actions already get
  //    Next's own same-origin check; the chat route does not).
  if (isApi && (method === "POST" || method === "OPTIONS")) {
    if (isCrossSite(request)) {
      return NextResponse.json({ error: "Cross-site request blocked" }, { status: 403 });
    }
  }

  // 5. Body-size guard for /api/* — reject before the body is read.
  if (isApi && method === "POST") {
    const declared = Number(request.headers.get("content-length") ?? "0");
    if (Number.isFinite(declared) && declared > API_MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }
  }

  // 6. Locale routing for page requests (never /api/*).
  if (!isApi) {
    const localeResponse = resolveLocale(request);
    if (localeResponse) return localeResponse;
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Run on everything except Next internals, the favicon, metadata files, and
   * anything that looks like a static asset. API routes are deliberately
   * included.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|icon.svg|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2|ttf|otf|css|js|map|txt|xml)$).*)",
  ],
};

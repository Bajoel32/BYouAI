import type { NextConfig } from "next";

/**
 * Security response headers, applied to every route.
 *
 * The CSP is intentionally static (no per-request nonce): this is a mostly
 * static marketing site and a nonce would force every page into dynamic
 * rendering. That means `script-src`/`style-src` keep `'unsafe-inline'` — Next's
 * bootstrap inline scripts and the `noFlash` theme script in the root layout
 * need it, and `next/font` injects an inline <style>. If we ever need a strict
 * script-src, move the CSP into `proxy.ts` with a nonce + `'strict-dynamic'`.
 *
 * `connect-src`/`script-src` are loosened in development only, where React uses
 * `eval` for the error overlay and HMR runs over a websocket.
 */
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // `microphone=(self)` keeps the /solusi/klinik-dokter voice demo working.
    value: "microphone=(self), camera=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

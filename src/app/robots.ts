import type { MetadataRoute } from "next";

/**
 * Generated `robots.txt`. Keeps crawlers on the marketing pages and off the
 * JSON API, the client-only invoice tool, and the consultation chat surface —
 * none of which are useful to index and all of which are cheaper not to have
 * bots hammering.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/invoice",
        "/konsultasi",
        "/en/invoice",
        "/en/konsultasi",
      ],
    },
  };
}

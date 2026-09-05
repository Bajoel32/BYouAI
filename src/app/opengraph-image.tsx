import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "BYouAI — AI kustom berbasis RAG untuk bisnis Anda";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand fonts, read from disk at build time (this route is prerendered). Satori
// (next/og) supports ttf/otf/woff — not woff2 — so these are woff v1 subsets.
const fonts = [
  ["Inter", 400, "Inter-Regular.woff"],
  ["Inter", 600, "Inter-SemiBold.woff"],
  ["JetBrains Mono", 400, "JetBrainsMono-Regular.woff"],
] as const;

async function loadFonts() {
  return Promise.all(
    fonts.map(async ([name, weight, file]) => ({
      name,
      weight,
      style: "normal" as const,
      data: await readFile(join(process.cwd(), "src/app/_og", file)),
    })),
  );
}

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0B0D",
          padding: 80,
          color: "#F4F3F1",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#00C48C",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#05140F",
              fontSize: 42,
              fontWeight: 600,
            }}
          >
            B
          </div>
          <div style={{ fontSize: 30, fontWeight: 600 }}>BYouAI</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 62,
              fontWeight: 600,
              lineHeight: 1.1,
              maxWidth: 920,
            }}
          >
            AI yang paham domain bisnis Anda.
          </div>
          <div
            style={{
              fontSize: 27,
              fontWeight: 400,
              color: "rgba(244,243,241,0.6)",
              maxWidth: 820,
            }}
          >
            Asisten & agent AI berbasis RAG di atas data Anda sendiri — akurat,
            tersitasi, siap produksi.
          </div>
        </div>

        <div
          style={{
            fontSize: 22,
            color: "rgba(244,243,241,0.45)",
            fontFamily: "JetBrains Mono",
          }}
        >
          E-commerce · Firma Hukum · Klinik & Dokter · dan lainnya
        </div>
      </div>
    ),
    { ...size, fonts: await loadFonts() },
  );
}

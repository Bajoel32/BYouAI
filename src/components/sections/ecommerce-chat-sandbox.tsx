"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Circle,
  FileText,
  Package,
  Sparkles,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { RagSandbox, type RagSandboxConfig } from "./rag-sandbox";

/**
 * Sandbox simulasi agent RAG untuk halaman /solusi/e-commerce.
 *
 * Skenario + widget produk/tracking/retur khusus e-commerce; seluruh mesin
 * chat + RAG inspector dipakai bersama dari `./rag-sandbox`. BUKAN produk
 * sungguhan — tidak ada panggilan model atau jaringan.
 */

const CONFIG: RagSandboxConfig = {
  accent: "emerald",
  header: {
    icon: Sparkles,
    title: "Agent E-commerce · Sandbox",
    subtitle: "Simulasi RAG — data toko contoh",
  },
  greeting:
    "Halo! Saya asisten toko BYouAI. Pilih salah satu skenario di bawah — saya jawab dari data toko, lengkap dengan sumber dan status guardrail-nya.",
  inputPlaceholder: "Tanya apa saja, atau pilih skenario…",
  inspectorTitle: "RAG Inspector",
  idleHint:
    "Pilih skenario untuk melihat langkah retrieval, skor kecocokan vektor, status guardrail, dan panggilan API secara real-time.",
  labels: { matchScore: "Accuracy", apiTrigger: "Action trigger" },
  citationLabel: "Data tersitasi",
  fallbackReply:
    "Ini sandbox demo dengan data toko contoh — coba salah satu **skenario** di atas untuk melihat alur RAG lengkapnya.",
  renderWidget: (widget) =>
    widget === "product" ? (
      <ProductCard />
    ) : widget === "tracking" ? (
      <TrackingWidget />
    ) : widget === "return" ? (
      <ReturnPolicyCard />
    ) : null,
  scenarios: [
    {
      id: "stok",
      label: "Cek Stok & Katalog",
      icon: Package,
      userMessage: "Sepatu Lari Velocity ukuran 42 masih ada? Harganya berapa?",
      steps: [
        "Embedding kueri (id-ID) · 1536 dim",
        "Hybrid search → shopify_inventory_v2.json",
        "3 chunk cocok · skor tertinggi 0.984",
        "Guardrail: klaim stok & harga dikunci ke katalog",
        "Tool call: GET /api/v1/inventory?sku=VLC-RUN-42",
        "Sintesis jawaban · 132 token",
      ],
      inspector: {
        source: "shopify_inventory_v2.json",
        latencyMs: 118,
        matchScore: "Match 98.4%",
        apiCall: "GET /api/v1/inventory?sku=VLC-RUN-42",
        chunks: [
          { file: "shopify_inventory_v2.json#VLC-RUN-42", score: 0.984 },
          { file: "shopify_inventory_v2.json#VLC-RUN", score: 0.913 },
          { file: "katalog_deskripsi.md#velocity", score: 0.802 },
        ],
      },
      ai: {
        text: "Ya, **Sepatu Lari Velocity — Ukuran 42** tersedia. Stok saat ini **7 pasang** di gudang Jakarta, harga **Rp 899.000** sudah termasuk PPN. Warna ready: Hitam dan Abu Karbon. Estimasi kirim 1–2 hari untuk Jabodetabek.",
        citations: [
          { label: "shopify_inventory_v2.json", sub: "sync #4821" },
        ],
        guardrails: ["Policy Compliant"],
        widget: "product",
      },
    },
    {
      id: "lacak",
      label: "Lacak Paket #INV-88310",
      icon: Truck,
      userMessage: "Tolong lacak pesanan saya #INV-88310",
      steps: [
        "Ekstraksi entitas · order_id = INV-88310",
        "Route: data transaksional → orders_service (non-vektor)",
        "Guardrail: alamat & telepon pelanggan diredaksi",
        "Tool call: GET /api/v1/orders/INV-88310",
        "Tool call: GET /api/v1/shipments/JT9920038812",
        "Sintesis jawaban · 104 token",
      ],
      inspector: {
        source: "orders_service (realtime)",
        latencyMs: 96,
        matchScore: "Exact match",
        apiCall: "GET /api/v1/orders/INV-88310",
        chunks: [
          { file: "orders_service/INV-88310", score: 1 },
          { file: "shipments/JT9920038812", score: 1 },
        ],
      },
      ai: {
        text: "Pesanan **#INV-88310** sedang dalam perjalanan via **J&T Express** (resi JT9920038812). Posisi terakhir: **Hub Bekasi, 5 Sep 08:14**. Estimasi tiba **besok, 6 Sep** ke alamat berakhiran ••••Jatibening. Mau saya kirim notifikasi saat kurir berangkat?",
        citations: [{ label: "orders_service", sub: "J&T webhook" }],
        guardrails: ["PII Redacted"],
        widget: "tracking",
      },
    },
    {
      id: "retur",
      label: "Ajukan Retur",
      icon: FileText,
      userMessage: "Barang yang datang tidak sesuai, saya mau retur. Masih bisa?",
      steps: [
        "Embedding kueri · intent = return_request",
        "Vector search → kebijakan_retur.pdf (v2.1)",
        "2 chunk cocok · Pasal 3.1 & 3.2",
        "Cross-check window retur ↔ orders_service",
        "Guardrail: jawaban dibatasi teks kebijakan",
        "Tool call: POST /api/v1/returns { order: INV-88310, draft }",
      ],
      inspector: {
        source: "kebijakan_retur.pdf",
        latencyMs: 142,
        matchScore: "Match 97.1%",
        apiCall: "POST /api/v1/returns/draft",
        chunks: [
          { file: "kebijakan_retur.pdf#pasal-3.2", score: 0.971 },
          { file: "kebijakan_retur.pdf#pasal-3.1", score: 0.944 },
          { file: "faq_retur.md#barang-rusak", score: 0.861 },
        ],
      },
      ai: {
        text: "Bisa. Menurut **Kebijakan Retur v2.1**, retur diterima dalam **7 hari** sejak paket sampai, untuk barang belum dipakai dengan label utuh. Karena alasannya barang tidak sesuai, **ongkir retur ditanggung toko**. Pesanan #INV-88310 sampai 3 hari lalu — jadi masih dalam masa retur. Saya bisa buatkan draft returnya sekarang.",
        citations: [{ label: "kebijakan_retur.pdf", sub: "v2.1" }],
        guardrails: ["Policy Compliant"],
        widget: "return",
      },
    },
  ],
};

export function EcommerceChatSandbox() {
  return <RagSandbox config={CONFIG} />;
}

// ---- E-commerce widgets ---------------------------------------------

function ProductCard() {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="flex gap-3 p-3">
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-zinc-800 text-emerald-400">
          <Package className="h-7 w-7" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-zinc-100">
            Sepatu Lari Velocity
          </p>
          <p className="text-xs text-zinc-500">Ukuran 42 · Hitam / Abu Karbon</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-sm font-semibold text-emerald-400">
              Rp 899.000
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
              Stok 7
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 border-t border-zinc-800 bg-zinc-900/60 px-3 py-2 text-[11px] text-zinc-500">
        <span className="grid h-3.5 w-3.5 place-items-center rounded-sm bg-[#95BF47] text-[8px] font-bold text-white">
          S
        </span>
        Shopify · Synced 2m ago
      </div>
    </div>
  );
}

const TRACKING_STEPS = [
  {
    label: "Paket dibuat",
    at: "4 Sep · 19:40",
    place: "Gudang Jakarta, Cakung",
    state: "done",
  },
  {
    label: "Diserahkan ke kurir",
    at: "5 Sep · 06:02",
    place: "Drop point Jakarta Timur",
    state: "done",
  },
  {
    label: "Transit",
    at: "5 Sep · 08:14",
    place: "Hub Bekasi — sedang disortir",
    state: "active",
  },
  {
    label: "Pengantaran",
    at: "Estimasi 6 Sep",
    place: "Kurir menuju alamat tujuan",
    state: "pending",
  },
  {
    label: "Terkirim",
    at: "—",
    place: "Alamat berakhiran ••••Jatibening",
    state: "pending",
  },
] as const;

function TrackingWidget() {
  const [open, setOpen] = useState<number | null>(2);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-200">
          <Truck className="h-3.5 w-3.5 text-emerald-400" />
          J&amp;T Express
        </span>
        <span className="font-mono text-[11px] text-zinc-500">JT9920038812</span>
      </div>
      <ol>
        {TRACKING_STEPS.map((s, i) => {
          const isOpen = open === i;
          return (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1.5 text-left transition-colors hover:bg-zinc-800/60"
              >
                <span className="grid h-4 w-4 shrink-0 place-items-center">
                  {s.state === "done" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : s.state === "active" ? (
                    <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-zinc-700" />
                  )}
                </span>
                <span className="flex-1">
                  <span
                    className={cn(
                      "block text-xs font-medium",
                      s.state === "pending" ? "text-zinc-500" : "text-zinc-200",
                    )}
                  >
                    {s.label}
                  </span>
                  <span className="block text-[11px] text-zinc-600">{s.at}</span>
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 text-zinc-600 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              {isOpen ? (
                <p className="mb-1 ml-8 rounded-md bg-zinc-800/50 px-2.5 py-1.5 text-[11px] text-zinc-400">
                  {s.place}
                </p>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ReturnPolicyCard() {
  const [started, setStarted] = useState(false);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
      <div className="flex items-start gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-400">
          <FileText className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-zinc-200">
            Kebijakan Retur v2.1
          </p>
          <p className="text-[11px] text-zinc-500">
            kebijakan_retur.pdf · berlaku 1 Jul 2025
          </p>
        </div>
      </div>
      <blockquote className="mt-2.5 border-l-2 border-emerald-500/40 bg-zinc-800/40 px-3 py-2 text-[11px] leading-relaxed text-zinc-400">
        <span className="font-mono text-emerald-400/80">Pasal 3.2 — </span>
        Barang tidak sesuai deskripsi: biaya pengiriman kembali menjadi tanggung
        jawab penjual. Pengembalian dana diproses 3–5 hari kerja setelah barang
        lolos QC.
      </blockquote>
      <button
        type="button"
        onClick={() => setStarted(true)}
        disabled={started}
        className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-emerald-950 transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {started ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Permintaan retur dibuat
          </>
        ) : (
          <>
            Mulai Retur
            <ArrowRight className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </div>
  );
}

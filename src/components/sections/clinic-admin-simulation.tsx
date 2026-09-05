"use client";

import {
  Activity,
  BadgeCheck,
  Calendar,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Receipt,
  ShieldCheck,
  Stethoscope,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { RagSandbox, type RagSandboxConfig } from "./rag-sandbox";

/**
 * Simulasi asisten administrasi klinik untuk halaman /solusi/klinik-dokter.
 *
 * FOKUS: otomasi administrasi & operasional (jadwal, kuota, cover asuransi,
 * tarif, SOP) — BUKAN diagnosa. Skenario + widget khusus klinik; mesin chat +
 * RAG inspector dipakai bersama dari `./rag-sandbox`. Guardrail: pertanyaan
 * yang terdeteksi klinis ditolak dan dieskalasi (lihat `looksClinical`).
 * BUKAN produk sungguhan — tidak ada panggilan model atau jaringan.
 */

const BOTH_GUARDRAILS = [
  "Pure Administrative Scope (Non-Clinical)",
  "PII Redacted",
];

const FALLBACK =
  "Ini simulasi dengan data klinik contoh — coba salah satu **skenario administrasi** di atas untuk melihat alur RAG operasionalnya.";

/** Route obviously-clinical questions to the escalation guardrail. */
function looksClinical(q: string): boolean {
  return /diagnos|gejala|obat apa|dosis|resep|mg\b|kenapa .*(demam|sakit|nyeri|batuk)|apakah (saya|anak|ibu|bapak).*(kena|menderita|hamil)|kanker|tumor|infeksi|tekanan darah saya|hasil lab saya|nyeri dada|sesak nap|penyakit apa/i.test(
    q,
  );
}

const CONFIG: RagSandboxConfig = {
  accent: "teal",
  header: {
    icon: Stethoscope,
    title: "Asisten Admin Klinik · Sandbox",
    subtitle: "Otomasi administrasi & operasional — non-klinis",
  },
  greeting:
    "Halo! Saya asisten administrasi klinik BYouAI — untuk jadwal, kuota, cover asuransi, tarif, dan SOP. Pilih skenario di bawah. Pertanyaan medis/diagnosa otomatis saya teruskan ke dokter spesialis.",
  inputPlaceholder: "Tanya soal admin klinik, atau pilih skenario…",
  inspectorTitle: "RAG & Admin Inspector",
  idleHint:
    "Pilih skenario untuk melihat sumber knowledge base, skor kecocokan, pemicu API HIS/SIMRS, dan status guardrail secara real-time.",
  labels: { matchScore: "Match score", apiTrigger: "HIS / SIMRS API trigger" },
  fallbackReply: FALLBACK,
  classifyFreeText: (q) =>
    looksClinical(q)
      ? {
          kind: "blocked",
          text: "Maaf, saya asisten **administrasi** klinik dan tidak menjawab pertanyaan medis atau diagnosa. Pertanyaan ini saya teruskan ke **dokter spesialis terkait**. Untuk keadaan mendesak, hubungi IGD di (021) 500-1234.",
          badge: "Diteruskan ke dokter spesialis",
          inspectorTitle: "Guardrail aktif — pertanyaan klinis ditolak",
          steps: [
            "Klasifikasi intent · terdeteksi: pertanyaan klinis/diagnosa",
            "Guardrail: di luar cakupan administratif — DITOLAK",
            "Eskalasi: route ke antrean dokter spesialis",
          ],
        }
      : { kind: "reply", text: FALLBACK },
  inspectorFooter: <GuardrailNotice />,
  renderWidget: (widget) =>
    widget === "schedule" ? (
      <ScheduleWidget />
    ) : widget === "insurance" ? (
      <InsuranceWidget />
    ) : widget === "mcu" ? (
      <McuWidget />
    ) : null,
  scenarios: [
    {
      id: "jadwal",
      label: "Jadwal & Kuota Dokter",
      icon: CalendarClock,
      userMessage:
        "Jadwal dr. Hendra Spesialis Anak hari ini & apakah kuota BPJS masih ada?",
      steps: [
        "Ekstraksi entitas · dokter='Hendra', spesialisasi='Anak', tanggal=hari ini",
        "Resolve dokter → DOC-8812 (dr. Hendra Wijaya, Sp.A)",
        "Query jadwal & kuota → database_jadwal_his.db",
        "Guardrail: cakupan administratif, non-klinis",
        "HIS API: GET /api/v1/his/doctor-schedule?id=DOC-8812",
        "HIS API: GET /api/v1/his/quota?doctor=DOC-8812&date=2026-09-06",
        "Sintesis jawaban · 118 token",
      ],
      inspector: {
        source: "database_jadwal_his.db",
        latencyMs: 108,
        matchScore: "99.1%",
        apiCall: "GET /api/v1/his/doctor-schedule?id=DOC-8812",
        chunks: [
          { file: "database_jadwal_his.db · doctors/DOC-8812", score: 0.991 },
          { file: "database_jadwal_his.db · quota/2026-09-06", score: 0.977 },
          { file: "SOP_Pendaftaran_v4.pdf#online", score: 0.802 },
        ],
      },
      ai: {
        text: "**dr. Hendra Wijaya, Sp.A** praktik hari ini **Sabtu, 6 Sep** di Poli Anak, sesi **08.00–12.00** (Ruang 3). Sisa kuota registrasi: **Umum 6 dari 20**, **BPJS 0 dari 15 — penuh**. Slot BPJS berikutnya **Senin, 8 Sep** sesi pagi. Tautan pendaftaran online ada di bawah.",
        citations: [
          { label: "database_jadwal_his.db" },
          { label: "SOP_Pendaftaran_v4.pdf" },
        ],
        guardrails: BOTH_GUARDRAILS,
        widget: "schedule",
      },
    },
    {
      id: "asuransi",
      label: "Cek Cover Asuransi & Syarat",
      icon: ShieldCheck,
      userMessage:
        "Apakah tindakan katarak di-cover Asuransi Prudential kelas 1?",
      steps: [
        "Embedding kueri · intent=insurance_coverage_check",
        "Vector search → tabel_cover_asuransi_v2.pdf",
        "3 chunk cocok · 'katarak', 'Prudential', 'kelas 1'",
        "Retrieve SOP klaim → SOP_Klaim_Asuransi_v3.pdf",
        "Guardrail: administratif — tidak menilai indikasi medis",
        "HIS API: POST /api/v1/his/preauth/check",
        "Sintesis jawaban · 176 token",
      ],
      inspector: {
        source: "tabel_cover_asuransi_v2.pdf",
        latencyMs: 142,
        matchScore: "97.6%",
        apiCall: "POST /api/v1/his/preauth/check",
        chunks: [
          { file: "tabel_cover_asuransi_v2.pdf#prudential-hs", score: 0.976 },
          { file: "tabel_cover_asuransi_v2.pdf#bedah-mata", score: 0.941 },
          { file: "SOP_Klaim_Asuransi_v3.pdf#pra-otorisasi", score: 0.9 },
        ],
      },
      ai: {
        text: "Untuk **PRUHospital & Surgical, Kelas 1**, tindakan **fakoemulsifikasi katarak** termasuk manfaat pembedahan **dengan pra-otorisasi**; batas kamar mengikuti plan kelas 1. **Dokumen klaim wajib**: kartu peserta + KTP, surat indikasi dari dokter mata, hasil biometri/USG mata, estimasi biaya dari RS, dan formulir klaim bertanda tangan. **Alur pra-otorisasi**: RS mengajukan ≥ 3 hari kerja sebelum tindakan → surat penjaminan terbit → tindakan → klaim akhir. Lensa premium (multifokal) umumnya **ekses biaya**, di luar tanggungan polis.",
        citations: [
          { label: "tabel_cover_asuransi_v2.pdf" },
          { label: "SOP_Klaim_Asuransi_v3.pdf" },
        ],
        guardrails: BOTH_GUARDRAILS,
        widget: "insurance",
      },
    },
    {
      id: "mcu",
      label: "Estimasi Biaya MCU & SOP",
      icon: Receipt,
      userMessage:
        "Berapa paket MCU Executive dan apa saja syarat puasa sebelum tes?",
      steps: [
        "Ekstraksi entitas · paket='MCU Executive'",
        "Lookup tarif → Tarif_Tindakan_2026.json",
        "Retrieve SOP puasa → SOP_Persiapan_MCU_v2.pdf",
        "Guardrail: administratif & edukasi prosedur, non-diagnosa",
        "HIS API: GET /api/v1/his/tariff?package=MCU-EXEC-2026",
        "Sintesis jawaban · 205 token",
      ],
      inspector: {
        source: "Tarif_Tindakan_2026.json",
        latencyMs: 96,
        matchScore: "98.9%",
        apiCall: "GET /api/v1/his/tariff?package=MCU-EXEC-2026",
        chunks: [
          { file: "Tarif_Tindakan_2026.json#MCU-EXEC-2026", score: 0.989 },
          { file: "SOP_Persiapan_MCU_v2.pdf#puasa", score: 0.953 },
          { file: "SOP_Persiapan_MCU_v2.pdf#persiapan-umum", score: 0.877 },
        ],
      },
      ai: {
        text: "**Paket MCU Executive: Rp 2.750.000** (tarif 2026, di luar konsultasi spesialis tambahan). **Cakupan**: pemeriksaan fisik lengkap, lab darah & urin lengkap, profil lipid, gula darah puasa + HbA1c, fungsi hati & ginjal, EKG istirahat, treadmill test, rontgen toraks, USG abdomen, spirometri, tes buta warna & visus. **SOP persiapan**: puasa **10–12 jam** (boleh air putih); hindari makanan berlemak 24 jam sebelumnya; obat rutin tetap diminum dengan sedikit air kecuali ada instruksi lain; bawa hasil MCU sebelumnya bila ada; alokasikan **± 3 jam** di lokasi.",
        citations: [
          { label: "Tarif_Tindakan_2026.json" },
          { label: "SOP_Persiapan_MCU_v2.pdf" },
        ],
        guardrails: BOTH_GUARDRAILS,
        widget: "mcu",
      },
    },
  ],
};

export function ClinicAdminSimulation() {
  return <RagSandbox config={CONFIG} />;
}

// ---- Clinic widgets ----------------------------------------------

function QuotaBar({
  label,
  used,
  total,
  full,
}: {
  label: string;
  used: number;
  total: number;
  full?: boolean;
}) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-zinc-400">{label}</span>
        <span className={cn("font-mono", full ? "text-rose-300" : "text-zinc-300")}>
          {total - used}/{total} sisa
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className={cn("h-full rounded-full", full ? "bg-rose-500/70" : "bg-teal-400")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function ScheduleWidget() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-500/10 text-teal-300">
          <UserCheck className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-100">dr. Hendra Wijaya, Sp.A</p>
          <p className="text-[11px] text-zinc-500">Poli Anak · Ruang 3 · DOC-8812</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-2 py-0.5 text-[11px] font-medium text-teal-300">
          <Calendar className="h-3 w-3" />
          Sab, 6 Sep
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-zinc-800/50 px-2.5 py-1.5 text-[11px] text-zinc-300">
        <CalendarClock className="h-3.5 w-3.5 text-teal-300" />
        Sesi praktik <span className="font-medium text-zinc-100">08.00 – 12.00</span>
      </div>

      <div className="mt-3 space-y-2.5">
        <QuotaBar label="Kuota Umum" used={14} total={20} />
        <QuotaBar label="Kuota BPJS" used={15} total={15} full />
      </div>

      <button
        type="button"
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-200 transition-colors hover:bg-teal-500/15"
      >
        <Calendar className="h-3.5 w-3.5" />
        Buka pendaftaran online
      </button>
    </div>
  );
}

const CLAIM_DOCS = [
  "Kartu peserta + KTP",
  "Surat indikasi dokter mata",
  "Hasil biometri / USG mata",
  "Estimasi biaya dari RS",
  "Formulir klaim bertanda tangan",
];

const PREAUTH_FLOW = [
  "RS ajukan pra-otorisasi (≥ 3 hari kerja)",
  "Surat penjaminan terbit",
  "Tindakan dilakukan",
  "Klaim akhir + pelunasan ekses",
];

function InsuranceWidget() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-100">
          <ShieldCheck className="h-3.5 w-3.5 text-teal-300" />
          PRUHospital &amp; Surgical — Kelas 1
        </span>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          Cover · perlu pra-otorisasi
        </span>
      </div>

      <p className="mt-2.5 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        Dokumen klaim wajib
      </p>
      <ul className="mt-1.5 space-y-1">
        {CLAIM_DOCS.map((d) => (
          <li key={d} className="flex items-start gap-2 text-[12px] text-zinc-300">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-300" />
            {d}
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-zinc-500">
        Alur pra-otorisasi
      </p>
      <ol className="mt-1.5 space-y-1">
        {PREAUTH_FLOW.map((step, i) => (
          <li key={step} className="flex items-start gap-2 text-[12px] text-zinc-400">
            <span className="mt-px grid h-4 w-4 shrink-0 place-items-center rounded-full bg-zinc-800 font-mono text-[9px] text-teal-300">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

const MCU_ITEMS = [
  "Pemeriksaan fisik lengkap",
  "Lab darah & urin lengkap",
  "Profil lipid",
  "Gula darah puasa + HbA1c",
  "Fungsi hati & ginjal",
  "EKG istirahat",
  "Treadmill test",
  "Rontgen toraks",
  "USG abdomen",
  "Spirometri",
  "Tes buta warna & visus",
];

const FASTING_SOP = [
  "Puasa 10–12 jam sebelum tes (boleh air putih)",
  "Hindari makanan berlemak 24 jam sebelumnya",
  "Obat rutin tetap diminum dengan sedikit air, kecuali ada instruksi lain",
  "Bawa hasil MCU sebelumnya bila ada · alokasikan ± 3 jam",
];

function McuWidget() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-[11px] text-zinc-500">Paket MCU Executive · 2026</p>
          <p className="text-lg font-semibold text-teal-300">Rp 2.750.000</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-800 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
          <Receipt className="h-3 w-3" />
          MCU-EXEC-2026
        </span>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1">
        {MCU_ITEMS.map((it) => (
          <span
            key={it}
            className="rounded-md border border-zinc-800 bg-zinc-800/40 px-1.5 py-0.5 text-[10px] text-zinc-400"
          >
            {it}
          </span>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-teal-500/25 bg-teal-500/[0.06] p-2.5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-teal-200">
          <ClipboardList className="h-3.5 w-3.5" />
          SOP persiapan puasa 10 jam
        </p>
        <ul className="mt-1.5 space-y-1">
          {FASTING_SOP.map((s) => (
            <li key={s} className="flex items-start gap-2 text-[12px] text-zinc-300">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-300" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function GuardrailNotice() {
  return (
    <div className="mt-auto rounded-lg border border-zinc-800 bg-zinc-900/40 p-2.5">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
        <Activity className="h-3 w-3 text-teal-300" />
        Active guardrail
      </p>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
        Sistem otomatis <span className="text-zinc-300">menolak dan mengeskalasi</span>{" "}
        pertanyaan medis/diagnosa ke dokter spesialis. Cakupan asisten dibatasi pada
        administrasi & operasional klinik.
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="inline-flex items-center gap-1 rounded border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-300">
          <BadgeCheck className="h-3 w-3" />
          Non-Clinical Scope
        </span>
        <span className="inline-flex items-center gap-1 rounded border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-300">
          <BadgeCheck className="h-3 w-3" />
          PII Redacted
        </span>
      </div>
    </div>
  );
}

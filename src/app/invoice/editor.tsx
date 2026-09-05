"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { cn } from "@/lib/cn";
import { planById } from "@/lib/plans";

type Currency = "IDR" | "USD" | "EUR";

type LineItem = {
  id: string;
  description: string;
  qty: number;
  unitPrice: number;
};

type InvoiceData = {
  currency: Currency;
  number: string;
  issueDate: string; // yyyy-mm-dd
  dueDate: string;
  fromName: string;
  fromDetails: string;
  toName: string;
  toDetails: string;
  items: LineItem[];
  taxRate: number; // percent
  discount: number; // absolute, in currency
  notes: string;
};

const DRAFT_KEY = "byouai-invoice-draft";

function isoDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function addDays(iso: string, n: number) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  d.setDate(d.getDate() + n);
  return isoDate(d);
}

function uid() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function makeDefaults(): InvoiceData {
  const issue = isoDate();
  return {
    currency: "IDR",
    number: `INV-${new Date().getFullYear()}-0001`,
    issueDate: issue,
    dueDate: addDays(issue, 14),
    fromName: "BYouAI",
    fromDetails: "Jakarta, Indonesia\nhalo@byouai.com",
    toName: "",
    toDetails: "",
    items: [{ id: uid(), description: "", qty: 1, unitPrice: 0 }],
    taxRate: 11,
    discount: 0,
    notes:
      "Pembayaran ke rekening BCA 0000000000 a.n. BYouAI.\nCantumkan nomor invoice pada berita transfer.",
  };
}

function loadDraft(): InvoiceData {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<InvoiceData>;
      if (parsed && Array.isArray(parsed.items)) {
        return {
          ...makeDefaults(),
          ...parsed,
          items: parsed.items as LineItem[],
        };
      }
    }
  } catch {
    /* fall through to defaults */
  }
  return makeDefaults();
}

/**
 * Initial state. Arriving from a package CTA (`/invoice?plan=growth&to=…&email=…`)
 * seeds a fresh quote priced for that plan; otherwise the saved draft is used.
 */
function initialData(): InvoiceData {
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const plan = planById(params.get("plan"));
  if (!plan) return loadDraft();

  const base = makeDefaults();
  const extraNotes = params.get("notes")?.trim();
  return {
    ...base,
    toName: params.get("to")?.trim() || "",
    toDetails: params.get("email")?.trim() || "",
    items: [
      { id: uid(), description: plan.summary, qty: 1, unitPrice: plan.priceFrom },
    ],
    notes: extraNotes ? `${extraNotes}\n\n${base.notes}` : base.notes,
  };
}

const inputCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-ink/30";

export default function InvoiceEditor() {
  const [data, setData] = useState<InvoiceData>(initialData);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    } catch {
      /* storage blocked — draft just won't persist */
    }
  }, [data]);

  // Drop the ?plan=… query once it has seeded the state, so a later reload
  // restores the saved draft instead of re-seeding and discarding edits.
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const set = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) =>
    setData((d) => ({ ...d, [key]: value }) as InvoiceData);

  const setItem = (id: string, patch: Partial<LineItem>) =>
    setData((d) => ({
      ...d,
      items: d.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  const addItem = () =>
    setData((d) => ({
      ...d,
      items: [...d.items, { id: uid(), description: "", qty: 1, unitPrice: 0 }],
    }));

  const removeItem = (id: string) =>
    setData((d) =>
      d.items.length > 1
        ? { ...d, items: d.items.filter((it) => it.id !== id) }
        : d,
    );

  const reset = () => {
    if (confirm("Hapus draf ini dan mulai baru?")) setData(makeDefaults());
  };

  const lineTotal = (it: LineItem) =>
    (Number(it.qty) || 0) * (Number(it.unitPrice) || 0);
  const subtotal = data.items.reduce((s, it) => s + lineTotal(it), 0);
  const discount = Math.min(Math.max(Number(data.discount) || 0, 0), subtotal);
  const taxable = subtotal - discount;
  const tax = taxable * ((Number(data.taxRate) || 0) / 100);
  const total = taxable + tax;

  const money = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: data.currency,
      minimumFractionDigits: data.currency === "IDR" ? 0 : 2,
      maximumFractionDigits: data.currency === "IDR" ? 0 : 2,
    }).format(Number.isFinite(n) ? n : 0);

  const longDate = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    return Number.isNaN(d.getTime())
      ? "—"
      : new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(d);
  };

  return (
    <div className="min-h-dvh bg-bg">
      <header className="no-print border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-md transition-opacity hover:opacity-70"
              aria-label="Kembali ke beranda BYouAI"
            >
              <LogoMark className="h-7 w-7" />
              <span className="font-semibold tracking-tight">Invoice</span>
            </Link>
            <span className="font-mono text-xs text-muted">internal</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-line px-4 py-2 text-sm transition-colors hover:bg-surface-2"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg transition-[filter] hover:brightness-[1.06]"
            >
              Cetak / Simpan PDF
            </button>
          </div>
        </div>
      </header>

      <div className="invoice-grid mx-auto grid max-w-6xl gap-8 px-6 py-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
        {/* ---- Editor ---- */}
        <form
          className="no-print space-y-7"
          onSubmit={(e) => e.preventDefault()}
        >
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Detail invoice
            </legend>
            <Field label="Nomor">
              <input
                className={inputCls}
                value={data.number}
                onChange={(e) => set("number", e.target.value)}
              />
            </Field>
            <Field label="Mata uang">
              <select
                className={inputCls}
                value={data.currency}
                onChange={(e) => set("currency", e.target.value as Currency)}
              >
                <option value="IDR">IDR — Rupiah</option>
                <option value="USD">USD — Dolar AS</option>
                <option value="EUR">EUR — Euro</option>
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Tanggal terbit">
                <input
                  type="date"
                  className={inputCls}
                  value={data.issueDate}
                  onChange={(e) => set("issueDate", e.target.value)}
                />
              </Field>
              <Field label="Jatuh tempo">
                <input
                  type="date"
                  className={inputCls}
                  value={data.dueDate}
                  onChange={(e) => set("dueDate", e.target.value)}
                />
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Dari
            </legend>
            <Field label="Nama">
              <input
                className={inputCls}
                value={data.fromName}
                onChange={(e) => set("fromName", e.target.value)}
              />
            </Field>
            <Field label="Detail (alamat, email, NPWP)">
              <textarea
                rows={3}
                className={cn(inputCls, "resize-y")}
                value={data.fromDetails}
                onChange={(e) => set("fromDetails", e.target.value)}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Untuk (klien)
            </legend>
            <Field label="Nama / perusahaan">
              <input
                className={inputCls}
                value={data.toName}
                onChange={(e) => set("toName", e.target.value)}
              />
            </Field>
            <Field label="Detail (alamat, PIC, email)">
              <textarea
                rows={3}
                className={cn(inputCls, "resize-y")}
                value={data.toDetails}
                onChange={(e) => set("toDetails", e.target.value)}
              />
            </Field>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Item
            </legend>
            {data.items.map((it, i) => (
              <div
                key={it.id}
                className="rounded-lg border border-line bg-surface p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">Item {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeItem(it.id)}
                    disabled={data.items.length === 1}
                    className="text-xs text-muted transition-colors hover:text-ink disabled:opacity-40"
                  >
                    Hapus
                  </button>
                </div>
                <input
                  className={cn(inputCls, "mt-2")}
                  placeholder="Deskripsi"
                  value={it.description}
                  onChange={(e) =>
                    setItem(it.id, { description: e.target.value })
                  }
                />
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <label className="block">
                    <span className="mb-1 block text-[0.7rem] text-muted">
                      Qty
                    </span>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      inputMode="decimal"
                      className={inputCls}
                      value={it.qty}
                      onChange={(e) =>
                        setItem(it.id, { qty: e.target.valueAsNumber || 0 })
                      }
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-[0.7rem] text-muted">
                      Harga satuan
                    </span>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      inputMode="decimal"
                      className={inputCls}
                      value={it.unitPrice}
                      onChange={(e) =>
                        setItem(it.id, {
                          unitPrice: e.target.valueAsNumber || 0,
                        })
                      }
                    />
                  </label>
                </div>
                <div className="mt-2 text-right text-xs text-muted">
                  Jumlah:{" "}
                  <span className="font-mono text-ink">
                    {money(lineTotal(it))}
                  </span>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItem}
              className="w-full rounded-lg border border-dashed border-line py-2 text-sm text-muted transition-colors hover:border-ink/30 hover:text-ink"
            >
              + Tambah item
            </button>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Pajak &amp; diskon
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <Field label={`Diskon (${data.currency})`}>
                <input
                  type="number"
                  min={0}
                  step="any"
                  inputMode="decimal"
                  className={inputCls}
                  value={data.discount}
                  onChange={(e) => set("discount", e.target.valueAsNumber || 0)}
                />
              </Field>
              <Field label="PPN (%)">
                <input
                  type="number"
                  min={0}
                  step="any"
                  inputMode="decimal"
                  className={inputCls}
                  value={data.taxRate}
                  onChange={(e) => set("taxRate", e.target.valueAsNumber || 0)}
                />
              </Field>
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Catatan
            </legend>
            <textarea
              rows={3}
              className={cn(inputCls, "resize-y")}
              value={data.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </fieldset>

          <p className="text-xs leading-relaxed text-muted">
            Draf tersimpan otomatis di browser ini. Tidak ada data yang dikirim
            ke server. Untuk PDF: tombol Cetak → tujuan &ldquo;Simpan sebagai
            PDF&rdquo;.
          </p>
        </form>

        {/* ---- Preview ---- */}
        <div className="invoice-preview lg:sticky lg:top-8 lg:self-start">
          <div className="invoice-sheet mx-auto max-w-[820px] rounded-xl border border-[#e6e2db] bg-white p-8 text-[#14120f] shadow-soft md:p-12">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-center gap-3">
                <LogoMark className="h-10 w-10" />
                <span className="text-lg font-semibold tracking-tight">
                  BYouAI
                </span>
              </div>
              <div className="text-right">
                <div className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[#6b655c]">
                  Invoice
                </div>
                <div className="mt-1 font-mono text-sm">
                  {data.number || "—"}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="text-[0.7rem] uppercase tracking-wide text-[#6b655c]">
                  Dari
                </div>
                <div className="mt-1 font-medium">{data.fromName || "—"}</div>
                <p className="mt-1 whitespace-pre-line text-[#6b655c]">
                  {data.fromDetails}
                </p>
              </div>
              <div>
                <div className="text-[0.7rem] uppercase tracking-wide text-[#6b655c]">
                  Untuk
                </div>
                <div className="mt-1 font-medium">{data.toName || "—"}</div>
                <p className="mt-1 whitespace-pre-line text-[#6b655c]">
                  {data.toDetails}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-10 text-sm">
              <div>
                <div className="text-[0.7rem] uppercase tracking-wide text-[#6b655c]">
                  Tanggal terbit
                </div>
                <div className="mt-1">{longDate(data.issueDate)}</div>
              </div>
              <div>
                <div className="text-[0.7rem] uppercase tracking-wide text-[#6b655c]">
                  Jatuh tempo
                </div>
                <div className="mt-1">{longDate(data.dueDate)}</div>
              </div>
            </div>

            <table className="mt-8 w-full table-fixed border-collapse text-sm">
              <colgroup>
                <col />
                <col className="w-10" />
                <col className="w-32" />
                <col className="w-32" />
              </colgroup>
              <thead>
                <tr className="border-b border-[#e6e2db] text-left text-[0.7rem] uppercase tracking-wide text-[#6b655c]">
                  <th className="pb-2 pr-3 font-medium">Deskripsi</th>
                  <th className="pb-2 text-right font-medium">Qty</th>
                  <th className="pb-2 text-right font-medium">Harga</th>
                  <th className="pb-2 text-right font-medium">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((it) => (
                  <tr
                    key={it.id}
                    className="border-b border-[#f0ece5] align-top"
                  >
                    <td className="py-2 pr-3 break-words">
                      {it.description || (
                        <span className="text-[#b8b2a8]">—</span>
                      )}
                    </td>
                    <td className="py-2 pl-2 text-right font-mono tabular-nums">
                      {it.qty || 0}
                    </td>
                    <td className="py-2 pl-2 text-right font-mono tabular-nums whitespace-nowrap">
                      {money(it.unitPrice || 0)}
                    </td>
                    <td className="py-2 pl-2 text-right font-mono tabular-nums whitespace-nowrap">
                      {money(lineTotal(it))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex justify-end">
              <dl className="w-full max-w-xs space-y-1.5 text-sm">
                <TotalRow k="Subtotal" v={money(subtotal)} />
                {discount > 0 ? (
                  <TotalRow k="Diskon" v={`- ${money(discount)}`} />
                ) : null}
                <TotalRow k={`PPN ${data.taxRate || 0}%`} v={money(tax)} />
                <div className="flex items-center justify-between border-t border-[#e6e2db] pt-2 text-base font-semibold">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">{money(total)}</span>
                </div>
              </dl>
            </div>

            {data.notes.trim() ? (
              <div className="mt-8 border-t border-[#e6e2db] pt-4 text-sm">
                <div className="text-[0.7rem] uppercase tracking-wide text-[#6b655c]">
                  Catatan
                </div>
                <p className="mt-1 whitespace-pre-line text-[#6b655c]">
                  {data.notes}
                </p>
              </div>
            ) : null}

            <p className="mt-10 text-center font-mono text-[0.7rem] text-[#b8b2a8]">
              byouai.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

function TotalRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between text-[#6b655c]">
      <span>{k}</span>
      <span className="font-mono tabular-nums text-[#14120f]">{v}</span>
    </div>
  );
}

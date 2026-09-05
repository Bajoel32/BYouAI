"use client";

import { useActionState, useId } from "react";
import { cn } from "@/lib/cn";
import { submitEcommerceLead } from "./actions";
import {
  STORE_PLATFORMS,
  CATALOG_SIZES,
  ORDER_VOLUMES,
  SALES_CHANNELS,
  type LeadFormState,
} from "./lead-fields";

const fieldCls =
  "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-ink/30";

const INITIAL: LeadFormState = { ok: false, message: "" };

export function LeadForm() {
  const [state, formAction, pending] = useActionState(
    submitEcommerceLead,
    INITIAL,
  );
  const formId = useId();

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-strong">
          Terkirim
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-line bg-surface p-6 md:p-8"
      noValidate
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Ceritakan toko Anda
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Kami pakai ini untuk menyiapkan rancangan agent e-commerce yang sesuai
          data dan alur kerja Anda.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nama / perusahaan"
          htmlFor={`${formId}-name`}
          error={state.errors?.name}
        >
          <input
            id={`${formId}-name`}
            name="name"
            required
            maxLength={200}
            className={fieldCls}
          />
        </Field>
        <Field
          label="Email kerja"
          htmlFor={`${formId}-email`}
          error={state.errors?.email}
        >
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            required
            maxLength={254}
            className={fieldCls}
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Platform toko"
          htmlFor={`${formId}-platform`}
          error={state.errors?.platform}
        >
          <select
            id={`${formId}-platform`}
            name="platform"
            defaultValue={STORE_PLATFORMS[0]}
            className={fieldCls}
          >
            {STORE_PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Ukuran katalog"
          htmlFor={`${formId}-catalog`}
          error={state.errors?.catalogSize}
        >
          <select
            id={`${formId}-catalog`}
            name="catalogSize"
            defaultValue={CATALOG_SIZES[1]}
            className={fieldCls}
          >
            {CATALOG_SIZES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label="Volume order"
        htmlFor={`${formId}-orders`}
        error={state.errors?.orderVolume}
      >
        <select
          id={`${formId}-orders`}
          name="orderVolume"
          defaultValue={ORDER_VOLUMES[1]}
          className={fieldCls}
        >
          {ORDER_VOLUMES.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </Field>

      <fieldset>
        <legend className="mb-2 block text-xs font-medium text-muted">
          Kanal penjualan aktif
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {SALES_CHANNELS.map((ch) => (
            <label
              key={ch}
              className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink transition-colors hover:border-ink/20"
            >
              <input
                type="checkbox"
                name="channels"
                value={ch}
                className="h-4 w-4 accent-accent"
              />
              {ch}
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        label="Alur yang ingin diotomatiskan (opsional)"
        htmlFor={`${formId}-workflow`}
        error={state.errors?.workflow}
      >
        <textarea
          id={`${formId}-workflow`}
          name="workflow"
          rows={4}
          maxLength={2000}
          className={cn(fieldCls, "resize-y")}
          placeholder="Mis. jawab pertanyaan stok & resi, rekomendasi produk dari katalog, tangani retur, eskalasi ke tim CS saat kompleks."
        />
      </Field>

      {state.message && !state.ok ? (
        <p className="text-sm text-red-500" aria-live="polite">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-[filter] hover:brightness-[1.06] disabled:opacity-50"
      >
        {pending ? "Mengirim…" : "Kirim kebutuhan"}
      </button>

      <p className="text-xs leading-relaxed text-muted">
        Dengan mengirim, Anda setuju kontak dan jawaban ini kami simpan untuk
        menindaklanjuti kebutuhan Anda. Lihat{" "}
        <a
          href="/privasi"
          className="underline underline-offset-2 hover:text-ink"
        >
          Kebijakan Privasi
        </a>
        .
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1 block text-xs font-medium text-muted">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-red-500">{error}</span>
      ) : null}
    </label>
  );
}

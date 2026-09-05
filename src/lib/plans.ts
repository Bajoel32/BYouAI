/**
 * Single source of truth for the three packages. Used by the pricing section,
 * the #kontak form, and the /invoice generator (via ?plan=). Prices are
 * starting estimates in IDR — change them here only.
 */

export type PlanId = "pilot" | "growth" | "enterprise";

export type Plan = {
  id: PlanId;
  name: string;
  priceFrom: number; // IDR
  /** Used verbatim as the invoice line-item description. */
  summary: string;
};

const PLANS: Plan[] = [
  {
    id: "pilot",
    name: "Pilot",
    priceFrom: 25_000_000,
    summary:
      "Paket Pilot — 1 use-case terbatas, hingga 3 sumber data, evaluasi akurasi awal (2–3 minggu)",
  },
  {
    id: "growth",
    name: "Growth",
    priceFrom: 75_000_000,
    summary:
      "Paket Growth — satu use-case siap produksi: integrasi data & channel penuh, guardrails, dashboard observability, SLA",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceFrom: 150_000_000,
    summary:
      "Paket Enterprise — multi use-case, deployment on-prem/VPC, SSO/RBAC/audit log, solutions engineer khusus",
  },
];

export const planById = (id?: string | null): Plan | undefined =>
  PLANS.find((p) => p.id === id);

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

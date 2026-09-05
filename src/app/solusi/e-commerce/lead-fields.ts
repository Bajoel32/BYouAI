/**
 * Field options + form-state shape for the /solusi/e-commerce lead form.
 * Kept in a plain module (no "use server") so both the client form and the
 * Server Action can import it — a "use server" file may only export async
 * functions.
 */

export const STORE_PLATFORMS = [
  "Shopify",
  "WooCommerce",
  "Tokopedia",
  "Shopee",
  "Custom / in-house",
  "Lainnya",
] as const;

export const CATALOG_SIZES = [
  "< 100 produk",
  "100–1.000 produk",
  "1.000–10.000 produk",
  "> 10.000 produk",
] as const;

export const ORDER_VOLUMES = [
  "< 500 order / bulan",
  "500–5.000 order / bulan",
  "5.000–50.000 order / bulan",
  "> 50.000 order / bulan",
] as const;

export const SALES_CHANNELS = [
  "Website sendiri",
  "WhatsApp",
  "Instagram / DM",
  "Tokopedia",
  "Shopee",
  "TikTok Shop",
] as const;

export type LeadField =
  | "name"
  | "email"
  | "platform"
  | "catalogSize"
  | "orderVolume"
  | "channels"
  | "workflow";

export type LeadFormState = {
  ok: boolean;
  message: string;
  /** Field-level messages, keyed by input name. */
  errors?: Partial<Record<LeadField, string>>;
};

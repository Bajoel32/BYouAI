"use client";

import dynamic from "next/dynamic";

// Client-only: the editor reads its initial state from localStorage, so there
// is nothing meaningful to server-render and no hydration boundary to worry
// about.
const InvoiceEditor = dynamic(() => import("./editor"), {
  ssr: false,
  loading: () => (
    <main className="grid min-h-dvh place-items-center text-sm text-muted">
      Memuat…
    </main>
  ),
});

export default function InvoicePage() {
  return <InvoiceEditor />;
}

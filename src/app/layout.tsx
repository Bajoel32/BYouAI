import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-src",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-src",
  display: "swap",
});

const SITE = "https://byouai.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "BYouAI — AI kustom berbasis RAG untuk bisnis Anda",
    template: "%s · BYouAI",
  },
  description:
    "BYouAI membangun asisten dan agent AI berbasis RAG di atas data Anda sendiri — untuk e-commerce, firma hukum, praktik dokter, dan industri lain. Akurat, tersitasi, siap produksi.",
  keywords: [
    "AI kustom",
    "RAG",
    "retrieval augmented generation",
    "AI agent",
    "chatbot perusahaan",
    "AI untuk bisnis",
    "AI e-commerce",
    "AI firma hukum",
  ],
  authors: [{ name: "BYouAI" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE,
    siteName: "BYouAI",
    title: "BYouAI — AI kustom berbasis RAG",
    description:
      "Asisten & agent AI di atas data Anda sendiri. Akurat, tersitasi, siap produksi.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BYouAI — AI kustom berbasis RAG",
    description: "Asisten & agent AI di atas data Anda sendiri.",
  },
  // The <link rel="icon"> is generated automatically from src/app/icon.svg.
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0d" },
  ],
};

// Applies the saved theme before paint to avoid a flash of the wrong palette.
// Kept as a raw synchronous inline script (not next/script) so it runs before
// the body renders; next/script defers inline scripts past first paint. Placed
// as the first child of <body> to avoid a manual <head> in the root layout.
const noFlash = `try{var t=localStorage.getItem('byouai-theme');if(t==='light'||t==='dark'){document.documentElement.dataset.theme=t}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${serif.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh bg-bg text-ink font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
        <a
          href="#konten"
          className="sr-only rounded-md focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
        >
          Lewati ke konten
        </a>
        {children}
      </body>
    </html>
  );
}

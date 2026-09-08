import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { getDictionary, getLocale } from "@/dictionaries";
import { DEFAULT_LOCALE, LOCALES, OG_LOCALE } from "@/lib/i18n";
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

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ lang: locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary();
  const m = dict.meta;

  // Indonesian is served at the root; English is prefixed with /en.
  // NOTE: per-page canonical / hreflang alternates still need per-route wiring
  // (the layout only knows the locale root), so they are intentionally omitted
  // here rather than pointing every page at its locale home.
  const localeRoot = locale === DEFAULT_LOCALE ? "/" : `/${locale}`;

  return {
    metadataBase: new URL(SITE),
    title: {
      default: m.titleDefault,
      template: m.titleTemplate,
    },
    description: m.description,
    keywords: m.keywords,
    authors: [{ name: "BYouAI" }],
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      url: localeRoot,
      siteName: "BYouAI",
      title: m.ogTitle,
      description: m.ogDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: m.twitterTitle,
      description: m.twitterDescription,
    },
    // The <link rel="icon"> is generated automatically from src/app/icon.svg.
  };
}

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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const dict = await getDictionary();

  return (
    <html
      lang={locale}
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
          {dict.common.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}

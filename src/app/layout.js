import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";

import "./globals.css";

import { site } from "@/data/site";
import { getSiteUrl, buildPersonJsonLd } from "@/lib/seo";
import { themeInitScript } from "@/hooks/useTheme";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { RevealRuntime } from "@/components/motion/RevealRuntime";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ResumeViewer } from "@/components/resume/ResumeViewer";
import { ComposeDialog } from "@/components/contact/ComposeDialog";
import { Cursor } from "@/components/motion/Cursor";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { SpotlightRuntime } from "@/components/motion/SpotlightRuntime";
import { IntroCurtain } from "@/components/motion/IntroCurtain";
import { RouteMemory } from "@/components/motion/RouteMemory";

/* Variable fonts, self-hosted by next/font — no external request, no layout
   shift, and the `display: swap` fallback is metric-matched automatically.
 *
 * Three families, each with a job. Fraunces is the voice: a soft Old Style
 * serif whose optical-size axis (`opsz`, loaded below) redraws the letters for
 * the size they are set at — hairline-delicate at 9rem, sturdy at 1.25rem —
 * and whose italic carries the vermilion emphasis. Geist keeps body copy,
 * where character is a liability. JetBrains Mono is the technical texture —
 * section numbers, coordinates, metadata, labels. */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: site.seo.title,
    template: site.seo.titleTemplate,
  },
  description: site.seo.description,
  keywords: site.seo.keywords,
  authors: [{ name: site.name }],
  creator: site.name,
  ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    type: "website",
    title: site.seo.title,
    description: site.seo.description,
    siteName: site.seo.title,
    locale: "en_US",
    ...(siteUrl ? { url: siteUrl } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  /* A single value, matching --bg in the default theme.
   *
   * Not keyed to prefers-color-scheme any more: the site now renders light for
   * everyone on a first visit regardless of OS preference, so a dark entry here
   * would tint the browser chrome black around a white page. A returning
   * visitor who chose dark gets light chrome for one paint, which is the
   * cheaper of the two mismatches — static metadata cannot read localStorage. */
  themeColor: "#f9ebd7",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      /* The stylesheet sets `scroll-behavior: smooth` for in-page jumps. This
         tells Next to suspend it during route changes (opt-in since Next 16),
         or a new page would animate from the old page's position on touch. */
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${fraunces.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Applies the stored theme during HTML parsing, before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(buildPersonJsonLd()),
          }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-text">
        <MotionProvider>
          {/* The whole scroll-reveal system: one observer for the document. */}
          <RevealRuntime />
          <SmoothScroll />
          <RouteMemory />
          <SpotlightRuntime />
          <SkipLink />
          <IntroCurtain />
          {/* Reading progress across the top, and the paper grain over
              everything. Both are CSS only (see globals.css). */}
          <div aria-hidden="true" className="page-progress" />
          <div aria-hidden="true" className="paper-grain" />
          <Nav />
          {/* Raised over the footer, which waits underneath and is uncovered
              as the page scrolls away (`footer-reveal` in globals.css). */}
          <main id="main" className="page-sheet flex-1">
            {children}
            <div aria-hidden="true" className="sheet-end" />
          </main>
          <Footer />
          <CommandPalette />
          <ResumeViewer />
          <ComposeDialog />
          <Cursor />
        </MotionProvider>
      </body>
    </html>
  );
}

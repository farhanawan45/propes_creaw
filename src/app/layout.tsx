import type { Metadata, Viewport } from "next";
import { Inter_Tight, Geist, Geist_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { site } from "@/content/site";
import { LenisProvider } from "@/context/LenisContext";
import { MenuProvider } from "@/context/MenuContext";
import GrainOverlay from "@/components/ui/GrainOverlay";
import CursorTrail from "@/components/ui/CursorTrail";
import ScrollProgress from "@/components/ui/ScrollProgress";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import Preloader from "@/components/preloader/Preloader";

const interTight = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.meta.title,
    template: `%s | ${site.name}`,
  },
  description: site.meta.description,
  keywords: [...site.meta.keywords],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_NZ",
    url: site.url,
    siteName: site.name,
    title: site.meta.title,
    description: site.meta.description,
    images: [
      {
        url: site.meta.ogImage,
        width: 1200,
        height: 630,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.title,
    description: site.meta.description,
    images: [site.meta.ogImage],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#04163F",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${geist.variable} ${geistMono.variable} h-full scroll-smooth antialiased preload-lock`}
    >
      <head>
        <link rel="preload" href={site.hero.video.mp4[0]} as="video" type="video/mp4" />
      </head>
      <body className="min-h-full flex flex-col bg-pounamu-night text-ivory font-body">
        <MotionConfig reducedMotion="user">
          <MenuProvider>
            <Preloader />
            <LenisProvider>
              <GrainOverlay />
              <CursorTrail />
              <ScrollProgress />
              {children}
              <WhatsAppButton />
            </LenisProvider>
          </MenuProvider>
        </MotionConfig>
      </body>
    </html>
  );
}

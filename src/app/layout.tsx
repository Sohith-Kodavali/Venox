import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE_URL = "https://vexonsol.com";
const SITE_TITLE =
  "Vexon Solutions Inc — Technology & Digital Engineering Partner";
const SITE_DESCRIPTION =
  "Software engineering, AI, data and cloud capabilities delivered as one engineering partner. From discovery through production, built for scale. United States and India delivery.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Vexon Solutions",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Vexon Solutions",
  authors: [{ name: "Vexon Solutions Inc" }],
  keywords: [
    "software engineering",
    "AI engineering",
    "cloud engineering",
    "data engineering",
    "DevOps",
    "digital transformation",
    "engineering partner",
    "custom software development",
    "India offshore engineering",
  ],
  category: "Technology",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Vexon Solutions",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050704",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
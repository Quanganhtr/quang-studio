import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/lib/ThemeContext";
import ScrollReset from "@/components/ui/ScrollReset";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ViewportHeight from "@/components/ui/ViewportHeight";
import FastScrollToast from "@/components/ui/FastScrollToast";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#e6fe7f",
};

const BASE_URL = "https://quang.studio";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Quang Studio",
  description: "Product Designer specializing in Web3 — and open to anything creative worth building.",
  openGraph: {
    title: "Quang Studio",
    description: "Product Designer specializing in Web3 — and open to anything creative worth building.",
    url: BASE_URL,
    siteName: "Quang Studio",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Quang Studio" }],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quang Studio",
    description: "Product Designer specializing in Web3 — and open to anything creative worth building.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ViewportHeight />
        <LoadingScreen />
        <ScrollReset />
        <FastScrollToast />
        <ThemeProvider>{children}</ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

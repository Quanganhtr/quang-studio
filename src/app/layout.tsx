import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/lib/ThemeContext";
import ScrollReset from "@/components/ui/ScrollReset";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ViewportHeight from "@/components/ui/ViewportHeight";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "Quang Studio",
  description: "Product Designer Portfolio",
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

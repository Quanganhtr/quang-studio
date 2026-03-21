import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/ThemeContext";
import ScrollReset from "@/components/ui/ScrollReset";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quang Studio",
  description: "Product Designer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ScrollReset />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

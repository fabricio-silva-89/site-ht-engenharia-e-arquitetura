import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { buildMetadata } from "@/lib/utils/seo";
import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = buildMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${playfair.variable} antialiased`}>
        <Header />
        <main className="min-h-screen pt-[73px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

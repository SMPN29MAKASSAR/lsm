import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SKPD - Sistem Kendali Pembelajaran Daring Terpadu",
  description: "Portal SKPD Dinas Pendidikan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.className} antialiased min-h-screen flex flex-col relative overflow-x-hidden`}>
        {children}
        <Analytics />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}

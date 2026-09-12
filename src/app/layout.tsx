import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
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
      </body>
    </html>
  );
}

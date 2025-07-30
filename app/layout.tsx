import "./globals.css";
import "@uploadthing/react/styles.css";

import { Inter } from "next/font/google";

import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";

import type { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MKP CRM",
  description: "CRM for mkp",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}

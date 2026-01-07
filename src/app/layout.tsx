import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logbook Komisi Treatment - OREA 85",
  description: "Aplikasi management system for treatment commissions by OREA 85. Built with Next.js, TypeScript, and Tailwind CSS.",
  keywords: ["OREA 85", "Komisi Treatment", "Next.js", "TypeScript", "Tailwind CSS", "React", "Treatment Management"],
  authors: [{ name: "OREA 85" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Logbook Komisi Treatment - OREA 85",
    description: "Aplikasi management system for treatment commissions by OREA 85",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Logbook Komisi Treatment - OREA 85",
    description: "Aplikasi management system for treatment commissions by OREA 85",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id-ID" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Komisi Treatment" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
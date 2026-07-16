import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VitalMama | Autonomous Triage & Maternal Care Architecture",
  description: "A secure, low-bandwidth, and localized digital platform providing critical maternal triage, interactive IVR workflows, and USSD-based healthcare delivery for low-resource environments.",
  keywords: ["maternal health", "USSD triage", "IVR healthcare", "vitalmama", "digital health Africa"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col bg-[#FAFAF7] text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
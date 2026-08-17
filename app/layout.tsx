import type { Metadata, Viewport } from "next";
import { Cinzel, Outfit } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lembah Bayang: Werewolf Chronicles — Web Game & Companion",
  description:
    "Game deduksi sosial misteri Werewolf multipemain modern dengan bot AI, kartu ilustrasi gothic tarot, dan moderator otomatis.",
  keywords: ["lembah bayang", "werewolf chronicles", "werewolf online", "board game indonesia", "auto-moderator"],
  authors: [{ name: "Lembah Bayang Studio" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${cinzel.variable} ${outfit.variable} dark`}>
      <body className="min-h-screen bg-stone-950 text-stone-100 font-sans antialiased selection:bg-amber-500 selection:text-stone-950 relative overflow-x-hidden">
        {/* Atmospheric Gothic Village Background Wallpaper */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/bg/village_bg.jpg"
            alt="Spooky Gothic Village Atmosphere"
            className="w-full h-full object-cover object-center opacity-65 filter brightness-95 contrast-115"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/30 via-transparent to-stone-950/50" />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col justify-between">
          {children}
        </div>
      </body>
    </html>
  );
}

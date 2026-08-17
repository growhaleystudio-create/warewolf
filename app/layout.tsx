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
  title: "Werewolf Desa — Companion & Auto-Moderator Papan Permainan",
  description:
    "Aplikasi moderator otomatis permainan kartu Werewolf satu-layar (pass & play) tanpa perlu koneksi internet atau pemain yang berkorban jadi narator.",
  keywords: ["werewolf", "board game", "auto-moderator", "pass and play", "werewolf indonesia"],
  authors: [{ name: "Werewolf Team" }],
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
            className="w-full h-full object-cover object-center opacity-30 scale-105 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/90 via-stone-950/70 to-stone-950/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-stone-950/40 to-stone-950/90" />
        </div>

        <div className="relative z-10 min-h-screen flex flex-col justify-between">
          {children}
        </div>
      </body>
    </html>
  );
}

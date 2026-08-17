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
      <body className="min-h-screen bg-stone-950 text-stone-100 font-sans antialiased selection:bg-amber-500 selection:text-stone-950">
        {children}
      </body>
    </html>
  );
}

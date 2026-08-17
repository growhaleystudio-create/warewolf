# Werewolf Desa — Online Multiplayer & Companion Web App

Aplikasi web deduksi sosial Werewolf dengan sistem **Multiplayer Multi-Perangkat (Room Code)** dan **Mode Bot AI Simulasi**, berbasis Next.js App Router, React, TypeScript, Tailwind CSS, dan Web Audio API.

## ✨ Fitur Utama
- **Multiplayer Multi-Perangkat (Room System):** Setiap pemain bergabung menggunakan HP/laptop masing-masing dengan Kode Ruangan & Nama untuk melihat peran rahasia privat dan melakukan aksi mandiri.
- **Mode Bot AI (Solo Testing):** Host dapat menambahkan bot AI (`[Bot] Arthur`, `[Bot] Luna`, dll.) dengan 1 klik untuk langsung bermain dan menguji game sendirian.
- **Ensiklopedia & Panduan Peran:** Modal panduan interaktif memuat lore, kekuatan malam, tips strategi, dan cara menang untuk 8 peran lengkap (Serigala, Warga Desa, Peramal, Dokter, Bodyguard, Penyihir, Pemburu, dan Orang Gila / Jester).
- **Web Audio API Procedural Synthesizer:** Efek suara jangkrik malam, petikan pedesaan siang, lonceng balai desa, detak jantung dramatis, dan fanfare kemenangan tanpa aset eksternal.
- **Anti-Cheat Server Sanitization:** Data peran pemain lain disaring oleh API server sehingga aman dari inspect element.

## 🚀 Menjalankan Aplikasi

### 1. Mode Development
```bash
npm run dev
```
Buka browser di `http://localhost:3000`.

### 2. Menjalankan Unit Test (Vitest)
```bash
npm test
```

### 3. Build Produksi (Next.js)
```bash
npm run build
```

## 📜 Lisensi
MIT License

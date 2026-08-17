# Werewolf Board Game — Desain

**Tanggal:** 2026-08-17
**Status:** Disetujui

## Ringkasan

Game Werewolf sebagai moderator otomatis untuk grup nyata bermain di satu layar bersama. Bukan multiplayer realtime — seluruh game berjalan di satu perangkat (laptop/tablet yang dioper secara bergiliran). Pemain asli, menentukan target/aksi di layar bersama dengan mekanisme "pejam mata + call peran". Bahasa Indonesia. Deploy sebagai static site di Vercel.

## Tujuan & Batasan

- Grup nyata yang duduk bersama mengelilingi satu layar.
- Tidak ada backend / WebSocket / realtime. Semua state di client.
- Timer otomatis untuk fase malam dan siang.
- Visual sederhana bergaya pedesaan (sketsa inline SVG), bukan neon.
- Layar gelap saat malam, terang saat siang (transisi gradien Perlahan).
- Teknologi: Next.js (App Router) + React + TypeScript + Tailwind, static export, audio via Web Audio API.

## Peran & Kemampuan

| Peran | Kemampuan |
|-------|-----------|
| Serigala / Werewolf | Membunuh 1 pemain tiap malam |
| Warga Desa / Villager | Tanpa kekuatan, voting saja |
| Peramal / Seer | Cek 1 pemain tiap malam (serigala/bukan) |
| Dokter | Sembuhkan/save 1 pemain tiap malam |
| Pemburu / Hunter | Jika mati (malam atau digantung), menembak 1 pemain |
| Penyihir / Witch | 1× ramuan penyembuh & 1× racun (sekali pakai, kapan pun) |
| Bodyguard | Melindungi 1 pemain tiap malam |
| Orang Gila / Jester | Menang khusus jika dirinya digantung di siang hari |

## Alur Game

### Setup
- Pemain memilih jumlah pemain (5-16) lewat slider.
- Menyetel pilihan peran yang diinginkan (toggle), termasuk persentase serigala (~25%).
- Pengaturan durasi timer: diskusi siang (default 3 menit), aksi malam (default 15 detik), dsb.
- Bot auto-balance distribusi peran bila jumlah pemain kurang.
- Pembagian kartu: tiap pemain bergiliran mengoper layar, melihat kartu peran rahasia, menekan "Selesai"; layar blank di antara agar tidak terlihat pemain lain.

### Fase Malam (layar gelap)
- Bot memanggil peran satu-satu dengan countdown:
  - Werewolves → pilih 1 korban
  - Peramal → ketuk 1 pemain untuk info
  - Dokter → pilih 1 pemain untuk disembuhkan
  - Bodyguard → pilih 1 pemain untuk dilindungi
  - Penyihir → gunakan penyembuhan/racun (maksimal 1× masing-masing)
  - Pemburu → tidak ada aksi malam
- Pemain yang perannya dipanggil membuka mata dan menentukan pilihan di layar.
- Bot menghitung hasil (membunuh vs penyembuhan/perlindungan/racun penyihir) lalu mengumumkan korban.

### Fase Siang (layar terang)
- Diskusi bebas dengan timer.
- Voting terbuka: tiap pemain bergiliran maju ke layar memilih korban (tanpa menampilkan nama pemilih di publik); suara terbanyak digantung.
- Seri → tidak ada yang digantung.
- Pemburu mati → menembak 1 pemain.

### Kondisi Menang
- Desa menang: semua serigala mati.
- Serigala menang: jumlah serigala ≥ jumlah desa.
- Jester menang: dirinya digantung (pemenang khusus).

## Struktur UI

Layar utama:
1. **SetupScreen** — slider 5-16, toggle peran, durasi timer
2. **RoleDealScreen** — kartu peran rahasia bergiliran + tombol "Selesai"
3. **NightPhaseScreen** — gelap, bulan/bintang, call peran, countdown
4. **DayPhaseScreen** — terang, daftar pemain hidup, timer diskusi, tombol "Mulai Voting"
5. **VotingScreen** — pilih korban bergiliran, tally, suara terbanyak digantung
6. **ResultScreen** — pengumuman korban malam / hasil
7. **WinnerScreen** — hasil akhir + tombol "Main Lagi"

Visual: palet hangat (krem, cokelat, hijau rumput, oranye senja); ilustrasi peran inline SVG gaya sketsa; transisi malam/siang gradien perlahan; font display serif + body sans. Semua teks bahasa Indonesia.

## Audio (Web Audio API, sintesis murni)

- Day: loop arpeggio santai bernuansa pedesaan.
- Night: jangkrik + senar rendah tenang.
- Efek titilk saat mengetuk pilihan.
- Lonceng desa saat timer habis.
- Detak dramatis saat reveal korban, fanfare kecil saat menang.
- Tombol mute; jika audio tidak tersedia game tetap berjalan.

## Arsitektur

```
werewolf-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── SetupScreen.tsx | RoleDealScreen.tsx | NightPhaseScreen.tsx
│   ├── DayPhaseScreen.tsx | VotingScreen.tsx | ResultScreen.tsx | WinnerScreen.tsx
│   ├── Timer.tsx | PlayerList.tsx
│   └── illustrations/ (WerewolfIcon, VillagerIcon, SeerIcon, DoctorIcon, HunterIcon, WitchIcon, BodyguardIcon, JesterIcon)
├── lib/
│   ├── gameReducer.ts   # state machine fase + transisi
│   ├── roles.ts         # def peran, logika damage/save/win-check
│   ├── audio.ts         # engine Web Audio API
│   └── types.ts
```

State machine (context + reducer): `SETUP → DEAL → NIGHT → DAY_DISCUSSION → VOTING → RESULT → (NIGHT ulang | WINNER)`. Setiap transisi disimpan ke localStorage; restore otomatis saat reload. Reducer menangani urutan aktor malam: werewolves pilih → seer cek → doctor/bodyguard → witch → hitung kematian.

## Error Handling

- Audio tidak tersedia → game berjalan diam (mute otomatis).
- Reload mid-fase → restore dari localStorage, lanjut fase yang sama.
- Reset penuh via tombol "Main Lagi" / pengaturan "coba lagi".

## Testing

Vitest untuk unit test logika reducer: damage/save/witch/hunter, win-check, voting seri, dan kasus sudut.
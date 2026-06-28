# Tuntas

Aplikasi **Todo List** berbentuk **Single Page Application (SPA)** yang dibangun dengan **React** dan **Tailwind CSS**. Dibuat untuk memenuhi tugas praktikum mata kuliah **Pemrograman Web** (Modern Styling, React Fundamentals, dan Interactivity with Hooks).

Desainnya sengaja dibuat tenang dan presisi seperti perkakas produktivitas profesional (mis. Linear, Things): netral monokrom, garis pembatas tipis, dan tipografi yang rapi. Warna hanya dipakai untuk **makna** — bukan dekorasi:

- **Hijau** menandai progres dan tugas yang selesai.
- **Merah** menandai prioritas tinggi dan tugas yang terlambat.
- **Amber** menandai prioritas sedang dan tenggat hari ini.
- **Netral (zinc)** untuk seluruh elemen antarmuka lainnya.

---

## Fitur

### Wajib

- **Tambah tugas** — kolom input untuk membuat tugas baru.
- **Hapus tugas** — tombol hapus pada setiap item (dengan opsi _undo_).
- **Edit tugas** — pengeditan _inline_ langsung di barisnya (teks dan tenggat).
- **Tandai selesai** — _checkbox_ kustom; teks otomatis dicoret saat selesai.
- **Penghitung** — jumlah tugas yang **belum selesai** diperbarui secara langsung.

### Tambahan

- **Command Palette (`⌘K` / `Ctrl+K`)** — jendela perintah cepat untuk menambah tugas, berganti filter, mengganti tema, menghapus tugas selesai, sekaligus **mencari tugas** dan menandainya selesai langsung dari sana. Sepenuhnya dapat dinavigasi dengan keyboard.
- **Tenggat waktu** — tenggat opsional per tugas dengan indikator relatif: _Terlambat_, _Hari ini_, _Besok_, _N hari lagi_, atau tanggal singkat — diberi warna sesuai tingkat urgensi.
- **Prioritas** — tiga tingkat (Rendah / Sedang / Tinggi). Klik ikon bendera pada tugas untuk menggantinya secara cepat.
- **Undo hapus** — menghapus satu tugas maupun seluruh tugas selesai memunculkan _toast_ "Urungkan" selama 5 detik.
- **Pintasan keyboard** — `⌘K` membuka palette, `/` memfokuskan kolom tambah, `Esc` menutup, panah & `Enter` di dalam palette.
- **Filter** — Semua / Aktif / Selesai, lengkap dengan jumlahnya. Tugas yang selesai otomatis turun ke bawah pada tampilan "Semua".
- **Mode gelap** — peralihan terang/gelap yang mulus dan tersimpan; mengikuti preferensi sistem pada kunjungan pertama.
- **Bilah progres** — indikator tipis untuk porsi tugas yang selesai.
- **Aksi massal** — tandai semua selesai / batalkan semua, dan hapus tugas selesai.
- **Penyimpanan otomatis** — seluruh data tersimpan di `localStorage`, tetap ada setelah peramban ditutup.
- **Responsif** — tata letak menyesuaikan diri dari ponsel hingga desktop.
- **Animasi halus** — transisi yang menghormati preferensi `prefers-reduced-motion`.

---

## Pintasan Keyboard

| Pintasan          | Aksi                                  |
| ----------------- | ------------------------------------- |
| `⌘K` / `Ctrl+K`   | Buka / tutup command palette          |
| `/`               | Fokus ke kolom tambah tugas           |
| `Esc`             | Tutup palette / batalkan pengeditan   |
| `↑` `↓`           | Navigasi hasil di dalam palette       |
| `Enter`           | Jalankan perintah / simpan pengeditan |

---

## Teknologi

| Kategori     | Teknologi                          |
| ------------ | ---------------------------------- |
| Framework    | React 19                           |
| Build tool   | Vite 6                             |
| Styling      | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Ikon         | `lucide-react`                     |
| Tipografi    | Geist & Geist Mono (Google Fonts)  |
| Bahasa       | JavaScript (JSX)                   |

---

## Struktur Proyek

```
tuntas/
├── public/
│   └── favicon.svg            # Logomark monokrom (adaptif terang/gelap)
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Wordmark + pemicu palette + toggle tema
│   │   ├── ThemeToggle.jsx    # Peralih terang/gelap
│   │   ├── Overview.jsx       # Ringkasan & bilah progres
│   │   ├── TodoForm.jsx       # Input + prioritas + tenggat
│   │   ├── TodoFilter.jsx     # Tab filter (Semua/Aktif/Selesai)
│   │   ├── TodoList.jsx       # Daftar item
│   │   ├── TodoItem.jsx       # Satu baris tugas + semua interaksinya
│   │   ├── EmptyState.jsx     # Tampilan kosong per filter
│   │   ├── Footer.jsx         # Aksi massal
│   │   ├── CommandPalette.jsx # Jendela perintah cepat (⌘K)
│   │   └── Toast.jsx          # Notifikasi undo
│   ├── hooks/
│   │   └── useLocalStorage.js # Custom hook penyimpanan (useState + useEffect)
│   ├── constants.js           # Konfigurasi prioritas & filter
│   ├── App.jsx                # Komponen utama & seluruh state
│   ├── main.jsx               # Titik masuk React
│   └── index.css              # Import Tailwind, font, & animasi
├── index.html
├── package.json
└── vite.config.js
```

Data mengalir satu arah lewat **props**: `App` memegang seluruh _state_ dan meneruskan data serta _handler_ ke `Header`, `Overview`, `TodoForm`, `TodoFilter`, `TodoList` → `TodoItem`, `Footer`, `CommandPalette`, dan `Toast`.

---

## Menjalankan

**Prasyarat:** Node.js 18+ dan npm.

```bash
# 1. Pasang dependensi
npm install

# 2. Jalankan mode pengembangan
npm run dev

# 3. Build untuk produksi
npm run build

# 4. Pratinjau hasil build
npm run preview
```

Setelah `npm run dev`, buka URL yang ditampilkan di terminal (biasanya `http://localhost:5173`).

---

## Catatan Teknis

- **Tailwind utility-only.** Seluruh _styling_ memakai _utility class_ Tailwind; tidak ada CSS biasa untuk menata elemen maupun _inline style_. Berkas `index.css` hanya berisi `@import "tailwindcss"`, definisi font, dan _keyframes_ animasi.
- **Mode gelap berbasis class.** Diaktifkan lewat `.dark` pada elemen `<html>`, dipasang dari React, dan kompatibel dengan Tailwind v4 melalui `@custom-variant`.
- **Bilah progres tanpa inline style.** Memakai elemen `<progress>` bawaan yang ditata melalui _variant_ pseudo-element (`[&::-webkit-progress-value]:…`) agar tetap mematuhi aturan _utility-only_.
- **Penyimpanan tangguh.** Hook `usePersistentState` membungkus akses `localStorage` dengan `try/catch` sehingga aman bila penyimpanan tidak tersedia.

---

## Pemenuhan Syarat Tugas

| Syarat                                                | Status |
| ----------------------------------------------------- | ------ |
| Single Page Application dengan React                  | ✅     |
| Minimal 3 komponen terpisah, data via props           | ✅ (12 komponen) |
| Styling penuh dengan Tailwind CSS (tanpa CSS biasa)   | ✅     |
| Responsif (mobile & desktop)                          | ✅     |
| Variasi warna, spasi, dan tipografi                   | ✅     |
| `useState` untuk daftar & input                       | ✅     |
| `useEffect` (mis. memperbarui `document.title`)       | ✅     |
| Tambah, hapus, edit, tandai selesai (coret), counter  | ✅     |

---

## Penulis

- **Nama** : Muhammad Zacky Amaazid
- **NPM** : 223510574
- **Program Studi** : Teknik Informatika — Universitas Islam Riau (UIR)
- **Mata Kuliah** : Pemrograman Web

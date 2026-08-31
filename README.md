# Website Resmi SMPN 6 Banjarmasin

Website profil sekolah SMP Negeri 6 Banjarmasin (Sekolah Dahlia), dibangun dengan React + Vite + Firebase.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** — styling
- **Firebase** (Firestore) — database konten
- **TipTap** — rich text editor di panel admin
- **React Router** — client-side routing

## Halaman

| Halaman | Path |
|---|---|
| Beranda | `/` |
| Profil Sekolah | `/profil` |
| Akademik | `/akademik` |
| Kesiswaan | `/kesiswaan` |
| Prestasi | `/prestasi` |
| Berita | `/berita` |
| Admin | `/admin` |

## Menjalankan Lokal

```bash
# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

Buka `http://localhost:5173`

## Build & Deploy

```bash
# Build production
npm run build

# Deploy ke Firebase Hosting
firebase deploy --only hosting
```

## Struktur Folder

```
src/
├── components/     # Navbar, Footer, RichEditor, dll
├── hooks/          # useFirestore (data fetching)
├── pages/          # Halaman publik & admin
├── types/          # TypeScript types
└── assets/         # Gambar & logo
```

## Fitur Admin

- Kelola berita & pengumuman
- Kelola data ekskul & prestasi
- Edit profil sekolah
- Statistik sekolah
- Rich text editor untuk isi berita

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

## Aturan Firestore

Setiap koleksi baru harus didaftarkan di **Firebase Console → Firestore Database → Rules**.
Kalau belum, koleksinya tidak akan bisa dibaca website (error `permission-denied` di konsol browser).

Koleksi `halaman` (fitur Halaman & Tab) memerlukan aturan berikut:

```
match /halaman/{id} {
  allow read: if resource.data.published == true || request.auth != null;
  allow write: if request.auth != null;
}
```

Artinya: pengunjung hanya bisa membaca halaman yang sudah diterbitkan, sedangkan
admin yang sudah login bisa membaca draft sekaligus menambah, mengubah, dan menghapus.

Halaman Akademik memakai dokumen `settings/akademik`, jadi ikut aturan `settings`
yang sudah ada — tidak perlu tambahan.

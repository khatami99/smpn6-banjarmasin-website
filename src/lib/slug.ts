/** Alamat yang sudah dipakai halaman bawaan — tidak boleh dipakai halaman kustom. */
export const SLUG_TERPAKAI = [
  'admin', 'profil', 'akademik', 'kesiswaan', 'prestasi',
  'berita', 'galeri', 'ekskul', 'assets', 'api',
]

/** Ubah judul menjadi alamat URL: "Fasilitas Sekolah" -> "fasilitas-sekolah" */
export function buatSlug(teks: string): string {
  return teks
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // buang aksen
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

/** Mengembalikan pesan error, atau null kalau slug boleh dipakai. */
export function cekSlug(slug: string, slugLain: string[]): string | null {
  if (!slug) return 'Alamat halaman tidak boleh kosong.'
  if (!/^[a-z0-9-]+$/.test(slug)) return 'Alamat hanya boleh huruf kecil, angka, dan tanda hubung.'
  if (SLUG_TERPAKAI.includes(slug)) return `"${slug}" sudah dipakai halaman bawaan. Pilih alamat lain.`
  if (slugLain.includes(slug)) return `"${slug}" sudah dipakai halaman kustom lain.`
  return null
}

export interface SchoolStats {
  siswa: number
  guru: number
  staf: number
  kelas: number
  ekskul: number
  tahunBerdiri: number
  akreditasi: string
}

export interface SchoolProfile {
  nama: string
  npsn: string
  alamat: string
  kelurahan: string
  kecamatan: string
  kota: string
  provinsi: string
  kodePos: string
  telepon: string
  email: string
  website: string
  kepalaSekolah: string
  nip: string
  statusSekolah: string
  bentukPendidikan: string
  visi: string
  misi: string[]
  tujuan: string
  sejarah: string
}

export interface NewsItem {
  id?: string
  judul: string
  isi: string
  ringkasan: string
  kategori: 'Kegiatan' | 'Prestasi' | 'Akademik' | 'PPDB' | 'Pengumuman'
  tanggal: string // ISO date string
  penulis: string
  published: boolean
  foto?: string
  createdAt?: string
}

export interface GaleriItem {
  id?: string
  judul: string
  deskripsi?: string
  url: string
  tanggal: string
  createdAt?: string
}

export interface Ekskul {
  id?: string
  nama: string
  deskripsi: string
  jadwal: string
  pembina: string
  emoji: string
  kategori: 'Olahraga' | 'Seni' | 'Akademik' | 'Pramuka' | 'Lainnya'
  aktif: boolean
}

export interface Prestasi {
  id?: string
  judul: string
  pemenang: string
  kelas: string
  tingkat: 'Sekolah' | 'Kota' | 'Provinsi' | 'Nasional' | 'Internasional'
  tahun: number
  bidang: string
  peringkat: string
  createdAt?: string
}

export interface QuickLink {
  label: string
  href: string
  external?: boolean
}

export interface Announcement {
  id?: string
  teks: string
  link?: string
  linkLabel?: string
  aktif: boolean
}

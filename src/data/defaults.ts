import type { SchoolStats, SchoolProfile, NewsItem, Ekskul, Prestasi, AkademikData, KesiswaanData } from '../types'

export const defaultStats: SchoolStats = {
  siswa: 1247,
  guru: 84,
  staf: 22,
  kelas: 36,
  ekskul: 18,
  tahunBerdiri: 1981,
  akreditasi: 'A',
}

export const defaultProfile: SchoolProfile = {
  nama: 'SMP Negeri 6 Banjarmasin',
  npsn: '30304306',
  alamat: 'Jl. Dahlia No. 1',
  kelurahan: 'Pekapuran Raya',
  kecamatan: 'Banjarmasin Timur',
  kota: 'Banjarmasin',
  provinsi: 'Kalimantan Selatan',
  kodePos: '70232',
  telepon: '(0511) 123-4567',
  email: 'smpn6bjm@disdik.banjarmasinkota.go.id',
  website: 'https://smpn6banjarmasin.sch.id',
  kepalaSekolah: 'Drs. H. Ahmad Fauzi, M.Pd.',
  nip: '196801011994031005',
  statusSekolah: 'Negeri',
  bentukPendidikan: 'SMP',
  visi: 'Terwujudnya peserta didik yang beriman, berakhlak mulia, berprestasi, berbudaya, dan berwawasan lingkungan.',
  misi: [
    'Meningkatkan penghayatan dan pengamalan nilai-nilai keagamaan dalam kehidupan sehari-hari.',
    'Mengembangkan proses pembelajaran yang efektif, inovatif, dan menyenangkan.',
    'Meningkatkan prestasi akademik dan non-akademik secara berkelanjutan.',
    'Menumbuhkan rasa cinta budaya daerah dan nasional.',
    'Mewujudkan lingkungan sekolah yang bersih, hijau, dan nyaman.',
  ],
  tujuan: 'Menghasilkan lulusan yang berkualitas, berkarakter Pancasila, dan siap melanjutkan ke jenjang pendidikan yang lebih tinggi.',
  sejarah: 'SMP Negeri 6 Banjarmasin berdiri sejak tahun 1981 di Jl. Dahlia No. 1, Banjarmasin Timur. Dikenal sebagai "Sekolah Dahlia", sekolah ini telah mencetak ribuan alumni yang berkontribusi di berbagai bidang. Sejak berdiri, sekolah ini terus berkembang dan meraih akreditasi A dari Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M).',
}

export const defaultNews: NewsItem[] = [
  {
    judul: 'Upacara Peringatan HUT Kemerdekaan RI ke-81 di Lingkungan Sekolah',
    isi: 'Seluruh warga SMPN 6 mengikuti upacara bendera dengan hikmat pada 17 Agustus 2026. Hadir pula perwakilan dari Dinas Pendidikan Kota Banjarmasin. Upacara berlangsung dengan tertib dan penuh semangat nasionalisme.',
    ringkasan: 'Seluruh warga SMPN 6 mengikuti upacara bendera dengan hikmat. Hadir pula perwakilan dari Dinas Pendidikan Kota Banjarmasin.',
    kategori: 'Kegiatan',
    tanggal: '2026-08-18',
    penulis: 'Tim Humas',
    published: true,
  },
  {
    judul: 'Siswa SMPN 6 Raih Juara 1 OSN Matematika Tingkat Provinsi Kalsel',
    isi: 'Fadhil Rahmat, siswa kelas IX-A, berhasil meraih medali emas pada Olimpiade Sains Nasional tingkat Provinsi Kalimantan Selatan. Ia akan mewakili Kalimantan Selatan pada OSN tingkat nasional yang akan diselenggarakan Oktober mendatang.',
    ringkasan: 'Fadhil Rahmat berhasil meraih medali emas dan akan mewakili Kalimantan Selatan pada OSN Oktober mendatang.',
    kategori: 'Prestasi',
    tanggal: '2026-08-10',
    penulis: 'Tim Humas',
    published: true,
  },
  {
    judul: 'Jadwal Penilaian Tengah Semester Ganjil 2026/2027 Telah Ditetapkan',
    isi: 'PTS (Penilaian Tengah Semester) Ganjil Tahun Ajaran 2026/2027 diselenggarakan pada 15–20 September 2026. Siswa dapat mengunduh jadwal lengkap melalui menu Akademik atau portal siswa.',
    ringkasan: 'PTS diselenggarakan 15–20 September 2026. Unduh jadwal lengkap melalui menu Akademik atau portal siswa.',
    kategori: 'Akademik',
    tanggal: '2026-08-02',
    penulis: 'Bagian Akademik',
    published: true,
  },
]

export const defaultEkskul: Ekskul[] = [
  { nama: 'Basket', deskripsi: 'Latihan rutin Selasa & Kamis, lapangan indoor sekolah', jadwal: 'Selasa & Kamis, 14.00–16.00', pembina: 'Bpk. Rudi Hartono', emoji: '🏀', kategori: 'Olahraga', aktif: true },
  { nama: 'Seni Lukis', deskripsi: 'Eksplorasi teknik melukis tradisional dan kontemporer', jadwal: 'Rabu, 14.00–16.00', pembina: 'Ibu Sari Dewi', emoji: '🎨', kategori: 'Seni', aktif: true },
  { nama: 'KIR / Sains', deskripsi: 'Karya ilmiah remaja dan persiapan olimpiade sains', jadwal: 'Jumat, 14.00–16.00', pembina: 'Bpk. Hendra S.', emoji: '🔬', kategori: 'Akademik', aktif: true },
  { nama: 'Paskibraka', deskripsi: 'Baris-berbaris dan pembawa bendera upacara nasional', jadwal: 'Sabtu, 07.00–09.00', pembina: 'Ibu Maya Putri', emoji: '🥁', kategori: 'Lainnya', aktif: true },
  { nama: 'Pramuka', deskripsi: 'Gerakan pramuka penggalang, kemah dan kegiatan alam', jadwal: 'Jumat, 14.00–16.00', pembina: 'Bpk. Suyono', emoji: '⛺', kategori: 'Pramuka', aktif: true },
  { nama: 'Futsal', deskripsi: 'Pertandingan dan latihan teknik futsal', jadwal: 'Senin & Rabu, 14.00–16.00', pembina: 'Bpk. Arif Rahman', emoji: '⚽', kategori: 'Olahraga', aktif: true },
  { nama: 'Paduan Suara', deskripsi: 'Latihan vokal dan harmoni untuk berbagai acara', jadwal: 'Kamis, 14.00–16.00', pembina: 'Ibu Rina Sari', emoji: '🎵', kategori: 'Seni', aktif: true },
  { nama: 'English Club', deskripsi: 'Percakapan, debat, dan persiapan kompetisi bahasa Inggris', jadwal: 'Selasa, 14.00–15.30', pembina: 'Ibu Dian Purnama', emoji: '🌏', kategori: 'Akademik', aktif: true },
]

export const defaultPrestasi: Prestasi[] = [
  { judul: 'Juara 1 OSN Matematika', pemenang: 'Fadhil Rahmat', kelas: 'IX-A', tingkat: 'Provinsi', tahun: 2026, bidang: 'Akademik', peringkat: 'Juara 1' },
  { judul: 'Juara Umum O2SN Cabang Atletik & Renang', pemenang: 'Tim Olahraga SMPN 6', kelas: '-', tingkat: 'Kota', tahun: 2025, bidang: 'Olahraga', peringkat: 'Juara Umum' },
  { judul: 'Finalis Lomba Karya Ilmiah Remaja Bidang Lingkungan Hidup', pemenang: 'Tim KIR SMPN 6 Banjarmasin', kelas: '-', tingkat: 'Nasional', tahun: 2025, bidang: 'Akademik', peringkat: 'Finalis' },
  { judul: 'Juara 2 Lomba Paduan Suara Tingkat Kota', pemenang: 'Paduan Suara SMPN 6', kelas: '-', tingkat: 'Kota', tahun: 2025, bidang: 'Seni', peringkat: 'Juara 2' },
]

export const defaultAkademik: AkademikData = {
  pengantar: 'SMPN 6 Banjarmasin mengimplementasikan Kurikulum Merdeka sesuai kebijakan Kemendikbudristek. Pembelajaran berpusat pada peserta didik dengan pendekatan diferensiasi.',
  mapel: [
    { nama: 'Pendidikan Agama & Budi Pekerti', jam: 3 },
    { nama: 'Pendidikan Pancasila', jam: 3 },
    { nama: 'Bahasa Indonesia', jam: 6 },
    { nama: 'Matematika', jam: 5 },
    { nama: 'Ilmu Pengetahuan Alam (IPA)', jam: 5 },
    { nama: 'Ilmu Pengetahuan Sosial (IPS)', jam: 4 },
    { nama: 'Bahasa Inggris', jam: 4 },
    { nama: 'Pendidikan Jasmani & Kesehatan', jam: 3 },
    { nama: 'Informatika', jam: 2 },
    { nama: 'Seni Budaya', jam: 3 },
    { nama: 'Prakarya', jam: 2 },
    { nama: 'Bimbingan Konseling', jam: 1 },
  ],
  judulKalender: 'Kalender Akademik 2026/2027',
  kalender: [
    { bulan: 'Jul 2026', kegiatan: 'Awal Tahun Ajaran 2026/2027 · Masa Orientasi Peserta Didik (MOPD)' },
    { bulan: 'Agt 2026', kegiatan: 'HUT Kemerdekaan RI · Asesmen Awal Pembelajaran' },
    { bulan: 'Sep 2026', kegiatan: 'Penilaian Tengah Semester (PTS) Ganjil · 15–20 September' },
    { bulan: 'Okt 2026', kegiatan: 'Ujian Praktik · Pekan Olahraga Sekolah' },
    { bulan: 'Nov 2026', kegiatan: 'Penilaian Akhir Semester (PAS) Ganjil · Rapor semester 1' },
    { bulan: 'Des 2026', kegiatan: 'Libur Semester Ganjil · 20 Des – 2 Jan 2027' },
    { bulan: 'Jan 2027', kegiatan: 'Awal Semester Genap' },
    { bulan: 'Mar 2027', kegiatan: 'PTS Semester Genap' },
    { bulan: 'Apr 2027', kegiatan: 'Asesmen Sumatif Akhir Jenjang (ASAJ) Kelas IX' },
    { bulan: 'Mei 2027', kegiatan: 'PAS Semester Genap · Pengumuman kelulusan kelas IX' },
    { bulan: 'Jun 2027', kegiatan: 'Perpisahan Kelas IX · Pembagian rapor · Libur kenaikan kelas' },
  ],
  info: [
    { label: 'Kurikulum', nilai: 'Kurikulum Merdeka' },
    { label: 'Jam Belajar', nilai: 'Senin–Jumat 07.00–14.00 WITA' },
    { label: 'Jumlah Kelas', nilai: '36 rombel (12 per tingkat)' },
    { label: 'Bahasa Pengantar', nilai: 'Bahasa Indonesia' },
  ],
  programUnggulan: [
    'Olimpiade Sains Nasional (OSN)',
    'Olimpiade Olahraga Siswa (O2SN)',
    'Festival & Lomba Seni Siswa (FLS2N)',
    'Karya Ilmiah Remaja (KIR)',
    'Adiwiyata (Sekolah Ramah Lingkungan)',
  ],
  linkKalenderPdf: '',
}

export const defaultKesiswaan: KesiswaanData = {
  osisJudul: 'OSIS SMPN 6 Banjarmasin',
  osisTeks: [
    'Organisasi Intra Sekolah (OSIS) merupakan wadah pengembangan kepemimpinan, kreativitas, dan kepedulian sosial siswa. OSIS berperan aktif dalam perencanaan dan pelaksanaan kegiatan sekolah.',
    'Pemilihan Ketua OSIS dilakukan secara demokratis setiap tahun ajaran baru, melibatkan seluruh siswa dalam proses pemungutan suara.',
  ].join('\n'),
  programJudul: 'Program OSIS 2026/2027',
  program: [
    'Masa Orientasi Peserta Didik (MOPD)',
    'Peringatan Hari Besar Nasional',
    'Pentas Seni & Kreativitas Siswa',
    'Bakti Sosial Lingkungan Sekolah',
    'Pekan Olahraga & Seni Antar Kelas',
    'Kemah Pramuka Penggalang',
  ],
  tataTertibJudul: 'Tata Tertib Siswa',
  tataTertibTeks: 'Setiap siswa wajib mematuhi tata tertib sekolah demi terciptanya lingkungan belajar yang kondusif, aman, dan nyaman bagi seluruh warga sekolah.',
  tataTertibPdf: '',
}

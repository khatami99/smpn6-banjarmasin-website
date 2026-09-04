import { usePageMeta } from '../hooks/usePageMeta'

export default function Akademik() {
  usePageMeta(
    'Akademik',
    'Kurikulum Merdeka, struktur mata pelajaran, dan kalender akademik SMPN 6 Banjarmasin.',
  )

  const MAPEL = [
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
  ]

  const KALENDER = [
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
  ]

  return (
    <>
      <div className="bg-ink px-6 md:px-12 py-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-white/30 mb-2">Program Pembelajaran</div>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-normal">Akademik</h1>
          <p className="text-white/50 text-[15px] mt-3 max-w-xl">
            Kurikulum, struktur pembelajaran, dan kalender akademik SMPN 6 Banjarmasin.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid md:grid-cols-[1fr_300px] gap-12">
        <div className="space-y-12">

          {/* Kurikulum */}
          <section>
            <div className="eyebrow mb-2">Struktur Kurikulum</div>
            <h2 className="font-serif text-2xl text-ink mb-6">Mata Pelajaran</h2>
            <p className="text-ink-3 text-[15px] mb-5 leading-relaxed">
              SMPN 6 Banjarmasin mengimplementasikan Kurikulum Merdeka sesuai kebijakan Kemendikbudristek.
              Pembelajaran berpusat pada peserta didik dengan pendekatan diferensiasi.
            </p>
            <div className="border border-border">
              <div className="grid grid-cols-[1fr_80px] bg-surface border-b border-border text-[11px] font-bold tracking-widest uppercase text-ink-4">
                <div className="px-4 py-2.5">Mata Pelajaran</div>
                <div className="px-4 py-2.5 text-right">JP/Minggu</div>
              </div>
              <div className="divide-y divide-border">
                {MAPEL.map(m => (
                  <div key={m.nama} className="grid grid-cols-[1fr_80px] text-[14px] hover:bg-off-white transition-colors">
                    <div className="px-4 py-3 text-ink">{m.nama}</div>
                    <div className="px-4 py-3 text-ink-3 text-right">{m.jam}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Kalender */}
          <section id="kalender">
            <div className="eyebrow mb-2">Jadwal Kegiatan</div>
            <h2 className="font-serif text-2xl text-ink mb-6">Kalender Akademik 2026/2027</h2>
            <div className="border border-border divide-y divide-border">
              {KALENDER.map((k, i) => (
                <div key={i} className="grid grid-cols-[100px_1fr] text-[14px] hover:bg-off-white transition-colors">
                  <div className="px-4 py-3.5 font-semibold text-ink bg-surface border-r border-border">{k.bulan}</div>
                  <div className="px-4 py-3.5 text-ink-3">{k.kegiatan}</div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <div className="bg-ink p-6">
            <div className="eyebrow text-white/30 mb-4">Info Penting</div>
            <div className="space-y-4">
              {[
                { label: 'Kurikulum', val: 'Kurikulum Merdeka' },
                { label: 'Jam Belajar', val: 'Senin–Jumat 07.00–14.00 WITA' },
                { label: 'Jumlah Kelas', val: '36 rombel (12 per tingkat)' },
                { label: 'Bahasa Pengantar', val: 'Bahasa Indonesia' },
              ].map(i => (
                <div key={i.label} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                  <div className="text-[11px] text-white/30 uppercase tracking-wide mb-1">{i.label}</div>
                  <div className="text-[14px] text-white">{i.val}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-border p-5">
            <div className="eyebrow mb-3">Program Unggulan</div>
            <ul className="space-y-2.5">
              {[
                'Olimpiade Sains Nasional (OSN)',
                'Olimpiade Olahraga Siswa (O2SN)',
                'Festival & Lomba Seni Siswa (FLS2N)',
                'Karya Ilmiah Remaja (KIR)',
                'Adiwiyata (Sekolah Ramah Lingkungan)',
              ].map(p => (
                <li key={p} className="flex items-start gap-2.5 text-[13px] text-ink-3">
                  <span className="w-1.5 h-1.5 bg-yellow border border-ink flex-shrink-0 mt-1.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-yellow-bg border border-yellow/30 p-5">
            <div className="eyebrow mb-2">Download</div>
            <p className="text-[13px] text-ink-3 mb-3">Kalender akademik lengkap tersedia dalam format PDF.</p>
            <a href="#" className="btn-black text-sm w-full justify-center">
              Unduh Kalender Akademik
            </a>
          </div>
        </aside>
      </div>
    </>
  )
}

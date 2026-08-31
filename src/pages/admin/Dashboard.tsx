import { Link } from 'react-router-dom'
import { useStats, useNews, useEkskul, usePrestasi, useSeedData } from '../../hooks/useFirestore'
import { useState } from 'react'

export default function Dashboard() {
  const { stats } = useStats()
  const { news } = useNews(false)
  const { ekskul } = useEkskul(false)
  const { prestasi } = usePrestasi()
  const { seedAll } = useSeedData()
  const [seeding, setSeeding] = useState(false)
  const [seeded, setSeeded] = useState(false)

  const handleSeed = async () => {
    if (!confirm('Ini akan mengisi database dengan data contoh. Lanjutkan?')) return
    setSeeding(true)
    try {
      await seedAll()
      setSeeded(true)
    } catch (e) {
      alert('Gagal mengisi data. Cek konsol browser.')
      console.error(e)
    } finally {
      setSeeding(false)
    }
  }

  const CARDS = [
    { label: 'Total Berita', val: news.length, sub: `${news.filter(n => n.published).length} dipublikasi`, to: '/admin/berita', color: 'bg-white' },
    { label: 'Ekskul', val: ekskul.length, sub: `${ekskul.filter(e => e.aktif).length} aktif`, to: '/admin/ekskul', color: 'bg-white' },
    { label: 'Prestasi', val: prestasi.length, sub: 'total data', to: '/admin/prestasi', color: 'bg-white' },
    { label: 'Siswa', val: stats.siswa.toLocaleString('id-ID'), sub: 'siswa aktif', to: '/admin/statistik', color: 'bg-yellow' },
  ]

  const MENU = [
    { label: 'Edit Statistik Sekolah', desc: 'Jumlah siswa, guru, kelas, akreditasi', to: '/admin/statistik', icon: '📊' },
    { label: 'Edit Profil Sekolah', desc: 'Identitas, visi misi, kontak sekolah', to: '/admin/profil', icon: '🏫' },
    { label: 'Kelola Berita', desc: 'Tambah, edit, hapus berita & pengumuman', to: '/admin/berita', icon: '📰' },
    { label: 'Pengumuman Banner', desc: 'Teks pengumuman di strip halaman utama', to: '/admin/pengumuman', icon: '📢' },
    { label: 'Kelola Ekskul', desc: 'Data ekstrakurikuler dan jadwal', to: '/admin/ekskul', icon: '⚽' },
    { label: 'Kelola Prestasi', desc: 'Data pencapaian dan penghargaan', to: '/admin/prestasi', icon: '🏆' },
  ]

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-ink">Selamat datang</h1>
        <p className="text-ink-4 text-[14px] mt-1">Panel admin website SMPN 6 Banjarmasin</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {CARDS.map(c => (
          <Link key={c.label} to={c.to}
            className={`${c.color} border border-border p-5 hover:border-ink transition-colors no-underline`}>
            <div className="font-serif text-3xl text-ink leading-none mb-1">{c.val}</div>
            <div className="text-[12px] font-semibold text-ink">{c.label}</div>
            <div className="text-[11px] text-ink-4 mt-0.5">{c.sub}</div>
          </Link>
        ))}
      </div>

      {/* Menu kelola */}
      <div className="mb-8">
        <h2 className="font-serif text-xl text-ink mb-4">Kelola Konten</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {MENU.map(m => (
            <Link key={m.to} to={m.to}
              className="flex items-center gap-4 bg-white border border-border p-5 hover:border-ink transition-colors no-underline group">
              <span className="text-2xl">{m.icon}</span>
              <div>
                <div className="text-[14px] font-semibold text-ink group-hover:underline">{m.label}</div>
                <div className="text-[12px] text-ink-4 mt-0.5">{m.desc}</div>
              </div>
              <span className="ml-auto text-ink-4 group-hover:text-ink">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Seed data section */}
      {(news.length === 0 || seeded) && (
        <div className="bg-yellow-bg border border-yellow/40 p-6">
          <div className="text-[13px] font-semibold text-ink mb-1">
            {seeded ? '✅ Data contoh berhasil diisi!' : '⚠️ Database masih kosong'}
          </div>
          <p className="text-[13px] text-ink-3 mb-4">
            {seeded
              ? 'Data contoh sudah diisi. Anda bisa mulai mengedit sesuai kebutuhan.'
              : 'Isi database dengan data contoh untuk melihat tampilan website secara langsung.'
            }
          </p>
          {!seeded && (
            <button onClick={handleSeed} disabled={seeding}
              className="btn-black disabled:opacity-50">
              {seeding ? 'Mengisi data...' : 'Isi Data Contoh'}
            </button>
          )}
        </div>
      )}

      {/* View site link */}
      <div className="mt-6 pt-6 border-t border-border">
        <a href="/" target="_blank"
          className="inline-flex items-center gap-2 text-[13px] text-ink-4 hover:text-ink transition-colors">
          Lihat website publik
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" x2="21" y1="14" y2="3"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

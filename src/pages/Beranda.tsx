import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStats, useNews, useEkskul, usePrestasi, useAnnouncement, useGaleri } from '../hooks/useFirestore'
import { usePageMeta } from '../hooks/usePageMeta'
import type { NewsItem, Ekskul, Prestasi } from '../types'

function formatDate(iso: string) {
  const d = new Date(iso)
  return {
    day: d.getDate(),
    month: d.toLocaleString('id-ID', { month: 'short' }),
  }
}

const KATEGORI_COLOR: Record<string, string> = {
  Kegiatan: 'bg-blue-50 text-blue-700',
  Prestasi: 'bg-green/10 text-green',
  Akademik: 'bg-yellow-bg text-ink-2',
  PPDB: 'bg-ink/5 text-ink-2',
  Pengumuman: 'bg-surface text-ink-3',
}

const TINGKAT_COLOR: Record<string, string> = {
  Internasional: 'bg-yellow text-ink',
  Nasional: 'bg-ink text-yellow',
  Provinsi: 'bg-ink text-white',
  Kota: 'bg-surface text-ink',
  Sekolah: 'bg-border text-ink-3',
}

export default function Beranda() {
  const { stats } = useStats()
  const { news } = useNews(true)
  const { ekskul } = useEkskul(true)
  const { prestasi } = usePrestasi()
  const { announcement } = useAnnouncement()
  const { galeri } = useGaleri()

  usePageMeta(
    undefined,
    'Website resmi SMP Negeri 6 Banjarmasin (SMPN 6 Dahlia) — profil sekolah, berita, prestasi siswa, ekstrakurikuler, dan informasi akademik.',
  )

  const heroImages = useMemo(() => {
    const combined = galeri.map(g => g.url)
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]]
    }
    return combined.slice(0, 10)
  }, [galeri])

  const [heroIndex, setHeroIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (heroImages.length < 2) return
    const id = setInterval(() => {
      setPrevIndex(heroIndex)
      setFading(true)
      setTimeout(() => {
        setHeroIndex(i => (i + 1) % heroImages.length)
        setFading(false)
        setPrevIndex(null)
      }, 1000)
    }, 5000)
    return () => clearInterval(id)
  }, [heroIndex, heroImages.length])

  const displayNews = news.slice(0, 4)
  const displayEkskul = ekskul.slice(0, 6)
  const displayPrestasi = prestasi.slice(0, 3)

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="grid md:grid-cols-[1fr_360px] min-h-[88vh] border-b border-border">
        {/* Left */}
        <div className="flex flex-col justify-center px-6 md:px-12 py-20 border-r border-border relative overflow-hidden">
          {/* Slideshow background */}
          {prevIndex !== null && (
            <img
              key={`prev-${prevIndex}`}
              src={heroImages[prevIndex]}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
              style={{ opacity: fading ? 0 : 1, transition: 'opacity 1s ease-in-out', zIndex: 0 }}
            />
          )}
          {heroImages.length > 0 && <img
            key={`curr-${heroIndex}`}
            src={heroImages[heroIndex]}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            style={{
              opacity: fading ? 1 : 1,
              animation: 'kenburns 6s ease-out forwards',
              zIndex: 1,
            }}
          />}
          {/* Overlay */}
          <div className="absolute inset-0 bg-white/75 z-10" />

          {/* Content */}
          <div className="relative z-20">
          <div className="flex items-center gap-2.5 mb-7">
            <div className="w-2 h-2 bg-yellow border-[1.5px] border-ink flex-shrink-0" />
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink-3">
              Sekolah Negeri · Banjarmasin · Kalsel
            </span>
          </div>

          <h1 className="font-serif text-[clamp(44px,5.5vw,68px)] font-normal leading-[1.05] text-ink mb-8">
            Selamat Datang di{' '}
            <span className="italic bg-yellow px-1.5">SMP Negeri 6</span>{' '}
            Banjarmasin
          </h1>

          <p className="text-[15px] text-ink-3 leading-[1.75] max-w-[440px] mb-11 pl-4 border-l-[3px] border-ink">
            SMPN 6 Dahlia — membangun generasi unggul, berkarakter, dan berprestasi
            di jantung Kota Banjarmasin sejak 1981.
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link to="/profil" className="btn-black">
              Profil Sekolah
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/berita" className="btn-outline">Berita & Pengumuman</Link>
          </div>
          </div>
        </div>

        {/* Right – dark panel */}
        <div className="bg-ink flex flex-col">
          <div className="flex-1 flex items-center justify-center relative overflow-hidden px-8 py-10">
            {/* Logo background */}
            <img
              src="/Logo SMPN 6 Banjarmasin.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain opacity-[0.07] select-none pointer-events-none scale-75"
            />
            {/* Akreditasi badge */}
            <div className="relative z-10 text-center">
              <div className="inline-flex flex-col items-center justify-center w-[110px] h-[110px] border-2 border-yellow mb-4">
                <span className="font-serif text-[56px] text-yellow leading-none">
                  {stats.akreditasi}
                </span>
                <span className="text-[10px] text-white/40 tracking-[0.1em] uppercase">Akreditasi</span>
              </div>
              <p className="text-[13px] text-white font-medium">Akreditasi BAN-S/M</p>
              <p className="text-[12px] text-white/50 mt-1">Predikat Unggul</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="border-t border-white/10 grid grid-cols-2">
            {[
              { n: stats.siswa.toLocaleString('id-ID'), l: 'Siswa aktif' },
              { n: stats.guru, l: 'Pendidik' },
              { n: stats.kelas, l: 'Rombel' },
              { n: `${new Date().getFullYear() - stats.tahunBerdiri}+`, l: 'Tahun berdiri' },
            ].map((s, i) => (
              <div key={i}
                className={`px-6 py-5 ${i % 2 === 0 ? 'border-r' : ''} ${i >= 2 ? 'border-t' : ''} border-white/10`}>
                <div className="font-serif text-2xl text-white leading-none mb-1">
                  {s.n}
                </div>
                <div className="text-[11px] text-white/40">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ANNOUNCEMENT STRIP ──────────────────────────────── */}
      {announcement?.aktif && (
        <div className="bg-yellow border-b border-border px-6 md:px-12 py-2.5 flex items-center gap-4">
          <span className="text-[10px] font-bold tracking-widest uppercase text-ink/60 bg-ink/10 px-2 py-0.5 flex-shrink-0">
            Info
          </span>
          <span className="text-[13px] text-ink font-medium flex-1">{announcement.teks}</span>
          {announcement.link && (
            <a href={announcement.link}
              className="text-[13px] font-semibold text-ink flex-shrink-0 hover:underline">
              {announcement.linkLabel ?? 'Lihat detail'} →
            </a>
          )}
        </div>
      )}

      {/* ─── NEWS + SIDEBAR ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid md:grid-cols-[1fr_300px] gap-10">
        {/* Main - News */}
        <div>
          <div className="eyebrow">Berita &amp; Pengumuman</div>
          <div className="divide-y divide-border border-t border-border mt-4">
            {displayNews.map((item: NewsItem) => {
              const { day, month } = formatDate(item.tanggal)
              return (
                <Link key={item.id} to={`/berita/${item.id}`}
                  className="flex gap-5 py-5 group no-underline">
                  <div className="flex-shrink-0 text-center w-10">
                    <div className="font-serif text-2xl text-ink leading-none">{day}</div>
                    <div className="text-[11px] text-ink-4 uppercase tracking-wide">{month}</div>
                  </div>
                  <div>
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 mb-2 tracking-wide
                      ${KATEGORI_COLOR[item.kategori] ?? 'bg-surface text-ink-3'}`}>
                      {item.kategori}
                    </span>
                    <div className="text-[15px] font-semibold text-ink group-hover:underline leading-snug mb-1">
                      {item.judul}
                    </div>
                    <div className="text-[13px] text-ink-4 leading-relaxed line-clamp-2">
                      {item.ringkasan}
                    </div>
                  </div>
                </Link>
              )
            })}
            {displayNews.length === 0 && (
              <p className="py-8 text-ink-4 text-sm">Belum ada berita.</p>
            )}
          </div>
          <Link to="/berita"
            className="inline-flex items-center gap-2 mt-4 text-[13px] font-semibold text-ink hover:underline no-underline">
            Lihat semua berita →
          </Link>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Quick links */}
          <div className="border border-border">
            <div className="px-5 py-3 border-b border-border bg-surface">
              <span className="text-[11px] font-bold tracking-widest uppercase text-ink-3">Akses Cepat</span>
            </div>
            <div className="divide-y divide-border">
              {[
                { label: 'Kalender Akademik', to: '/akademik#kalender' },
                { label: 'Daftar Prestasi', to: '/prestasi' },
                { label: 'Galeri Foto', to: '/galeri' },
                { label: 'Ekstrakurikuler', to: '/ekskul' },
                { label: 'Kontak Sekolah', to: '/profil#kontak' },
              ].map(l => (
                <Link key={l.label} to={l.to}
                  className="flex items-center justify-between px-5 py-3 text-[13px] text-ink-3 hover:bg-surface hover:text-ink transition-colors no-underline">
                  <span>{l.label}</span>
                  <span className="text-ink-4">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats 2x2 */}
          <div className="border border-border">
            <div className="px-5 py-3 border-b border-border bg-surface">
              <span className="text-[11px] font-bold tracking-widest uppercase text-ink-3">Dalam Angka</span>
            </div>
            <div className="grid grid-cols-2">
              {[
                { n: stats.siswa.toLocaleString('id-ID'), l: 'Siswa aktif', dark: false },
                { n: stats.guru, l: 'Pendidik', dark: false },
                { n: `${new Date().getFullYear() - stats.tahunBerdiri}`, l: 'Tahun berdiri', dark: true },
                { n: stats.akreditasi, l: 'Akreditasi', dark: true },
              ].map((s, i) => (
                <div key={i}
                  className={`px-5 py-4 ${i % 2 === 0 ? 'border-r' : ''} ${i >= 2 ? 'border-t' : ''} border-border
                    ${s.dark ? 'bg-ink' : 'bg-yellow'}`}>
                  <div className={`font-serif text-2xl leading-none mb-1 ${s.dark ? 'text-white' : 'text-ink'}`}>
                    {s.n}
                  </div>
                  <div className={`text-[11px] ${s.dark ? 'text-white/50' : 'text-ink/60'}`}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tentang */}
          <div className="border border-border p-5">
            <div className="text-[11px] font-bold tracking-widest uppercase text-ink-3 mb-3">Tentang Sekolah</div>
            <p className="text-[13px] text-ink-4 leading-relaxed mb-3">
              Berdiri sejak 1981 di Jl. Dahlia, Banjarmasin. Salah satu sekolah negeri unggulan
              di Kalimantan Selatan dengan rekam jejak prestasi panjang.
            </p>
            <Link to="/profil" className="text-[13px] font-semibold text-ink hover:underline no-underline">
              Baca profil lengkap →
            </Link>
          </div>
        </aside>
      </div>

      {/* ─── EKSKUL ──────────────────────────────────────────── */}
      <section className="bg-surface border-t border-b border-border px-6 md:px-12 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="eyebrow text-ink-4">Kegiatan Siswa</div>
              <h2 className="font-serif text-3xl text-ink">Ekstrakurikuler</h2>
              <p className="text-ink-4 text-sm mt-1">Mengembangkan bakat dan minat di luar kelas</p>
            </div>
            <Link to="/ekskul"
              className="text-[13px] font-semibold text-ink hover:underline no-underline hidden md:block">
              Lihat semua →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {displayEkskul.map((e: Ekskul) => (
              <div key={e.id}
                className="bg-white border border-border p-4 hover:border-ink transition-colors cursor-pointer group">
                <span className="text-2xl mb-3 block">{e.emoji}</span>
                <div className="text-[13px] font-semibold text-ink mb-1 group-hover:underline">{e.nama}</div>
                <div className="text-[11px] text-ink-4 leading-relaxed">{e.deskripsi}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRESTASI ────────────────────────────────────────── */}
      <section className="bg-ink px-6 md:px-12 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-white/30 mb-2">Kebanggaan Sekolah</div>
          <h2 className="font-serif text-3xl text-white mb-8">Prestasi Terkini</h2>

          <div className="grid md:grid-cols-3 gap-4">
            {displayPrestasi.map((p: Prestasi) => (
              <div key={p.id} className="border border-white/10 p-6 hover:border-yellow/40 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 tracking-wide
                    ${TINGKAT_COLOR[p.tingkat] ?? 'bg-surface text-ink'}`}>
                    {p.tingkat}
                  </span>
                  <span className="text-[11px] text-white/30">{p.tahun}</span>
                </div>
                <div className="text-[15px] font-semibold text-white leading-snug mb-2">{p.judul}</div>
                <div className="text-[12px] text-white/40">{p.pemenang}</div>
              </div>
            ))}
            {displayPrestasi.length === 0 && (
              <p className="text-white/30 text-sm col-span-3">Belum ada data prestasi.</p>
            )}
          </div>

          <Link to="/prestasi"
            className="inline-flex items-center gap-2 mt-8 text-[13px] font-semibold text-yellow hover:underline no-underline">
            Lihat semua prestasi →
          </Link>
        </div>
      </section>

      {/* ─── KONTAK STRIP ────────────────────────────────────── */}
      <div className="bg-yellow border-t border-border px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-serif text-2xl text-ink">Ada pertanyaan tentang SMPN 6?</div>
          <div className="text-[14px] text-ink-3 mt-1">Tim sekolah siap membantu — hari kerja pukul 07.00–15.00 WITA</div>
        </div>
        <Link to="/profil#kontak" className="btn-black flex-shrink-0">
          Hubungi Kami
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </>
  )
}

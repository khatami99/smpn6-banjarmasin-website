import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/10 pb-10">
          {/* Brand col */}
          <div>
            <div className="font-serif text-2xl text-white mb-1">
              SMPN 6 <span className="text-yellow">Banjarmasin</span>
            </div>
            <p className="text-[13px] text-white/50 leading-relaxed mt-3">
              Jl. Dahlia No. 1, Banjarmasin<br />
              Kalimantan Selatan 70232<br /><br />
              (0511) 123-4567<br />
              smpn6bjm@disdik.banjarmasinkota.go.id
            </p>
          </div>

          {/* Sekolah */}
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-white/30 mb-4">Sekolah</div>
            <ul className="space-y-2.5">
              {[
                { label: 'Profil Sekolah', to: '/profil' },
                { label: 'Visi & Misi', to: '/profil#visi-misi' },
                { label: 'Struktur Organisasi', to: '/profil#struktur' },
                { label: 'Fasilitas', to: '/profil#fasilitas' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[13px] text-white/50 hover:text-white transition-colors no-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-white/30 mb-4">Layanan</div>
            <ul className="space-y-2.5">
              {[
                { label: 'PPDB Online', href: '#' },
                { label: 'Portal Siswa', href: '#' },
                { label: 'Portal Guru', href: '#' },
                { label: 'Perpustakaan', href: '#' },
              ].map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-[13px] text-white/50 hover:text-white transition-colors no-underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Informasi */}
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-white/30 mb-4">Informasi</div>
            <ul className="space-y-2.5">
              {[
                { label: 'Berita Sekolah', to: '/berita' },
                { label: 'Kalender Akademik', to: '/akademik' },
                { label: 'Ekstrakurikuler', to: '/kesiswaan' },
                { label: 'Prestasi', to: '/prestasi' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-[13px] text-white/50 hover:text-white transition-colors no-underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-6 gap-3">
          <p className="text-[12px] text-white/30">
            © {year} SMPN 6 Banjarmasin · Dinas Pendidikan Kota Banjarmasin
          </p>
          <p className="text-[12px] text-white/20">Website resmi sekolah</p>
        </div>
      </div>
    </footer>
  )
}

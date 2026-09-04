import { Link } from 'react-router-dom'
import { useProfile } from '../hooks/useFirestore'

export default function Footer() {
  const year = new Date().getFullYear()
  const { profile } = useProfile()

  return (
    <footer className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/10 pb-10">
          {/* Brand col */}
          <div>
            <div className="font-serif text-2xl text-white mb-1">
              SMPN 6 <span className="text-yellow">Banjarmasin</span>
            </div>
            {/* Data diambil dari Panel Admin → Profil Sekolah */}
            <address className="text-[13px] text-white/50 leading-relaxed mt-3 not-italic">
              {profile.alamat}, {profile.kecamatan}<br />
              {profile.kota}, {profile.provinsi} {profile.kodePos}<br /><br />
              <a href={`tel:${profile.telepon.replace(/[^\d+]/g, '')}`}
                className="hover:text-white transition-colors no-underline">
                {profile.telepon}
              </a><br />
              <a href={`mailto:${profile.email}`}
                className="hover:text-white transition-colors no-underline break-all">
                {profile.email}
              </a>
            </address>
          </div>

          {/* Sekolah */}
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-white/30 mb-4">Sekolah</div>
            <ul className="space-y-2.5">
              {[
                { label: 'Profil Sekolah', to: '/profil' },
                { label: 'Visi & Misi', to: '/profil#visi-misi' },
                { label: 'Sejarah Sekolah', to: '/profil#sejarah' },
                { label: 'Kontak Kami', to: '/profil#kontak' },
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
                { label: 'Kalender Akademik', to: '/akademik#kalender' },
                { label: 'Ekstrakurikuler', to: '/kesiswaan' },
                { label: 'Galeri Foto', to: '/galeri' },
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

        <div className="flex flex-col md:flex-row items-center justify-between pt-6 gap-4">
          <p className="text-[12px] text-white/30">
            © {year} SMPN 6 Banjarmasin · Dinas Pendidikan Kota Banjarmasin
          </p>

          {/* Sosmed — tambahkan entri baru di sini kalau sekolah punya akun lain */}
          <div className="flex items-center gap-3">
            {[
              {
                label: 'Instagram',
                href: 'https://www.instagram.com/smpn6banjarmasin/',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.2 4.8 1.7 5 5 .1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.2 3.3-1.7 4.8-5 5-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.2-4.8-1.7-5-5C2.1 15.7 2 15.3 2 12c0-3.2 0-3.6.1-4.8.2-3.3 1.7-4.8 5-5 1.3-.1 1.6-.1 4.9-.1zm0-2.2C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/>
                  </svg>
                ),
              },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                title={`${s.label} SMPN 6 Banjarmasin`}
                aria-label={`${s.label} SMPN 6 Banjarmasin`}
                className="text-white/30 hover:text-white transition-colors">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

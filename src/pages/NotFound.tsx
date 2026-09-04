import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFound() {
  usePageMeta('Halaman Tidak Ditemukan', 'Halaman yang Anda cari tidak tersedia di website SMPN 6 Banjarmasin.')

  return (
    <div className="max-w-2xl mx-auto px-6 md:px-12 py-24 text-center">
      <div className="font-serif text-[80px] leading-none text-ink mb-2">404</div>
      <div className="inline-block bg-yellow px-2 mb-6">
        <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-ink">Halaman tidak ditemukan</span>
      </div>

      <h1 className="font-serif text-3xl text-ink mb-3">Maaf, halaman ini tidak ada</h1>
      <p className="text-[15px] text-ink-3 leading-relaxed mb-9 max-w-md mx-auto">
        Alamat yang Anda tuju mungkin salah ketik, sudah dipindahkan, atau memang tidak pernah ada.
      </p>

      <div className="flex gap-3 justify-center flex-wrap">
        <Link to="/" className="btn-black">Kembali ke Beranda</Link>
        <Link to="/berita" className="btn-outline">Lihat Berita</Link>
      </div>

      <div className="mt-12 pt-8 border-t border-border">
        <div className="eyebrow text-ink-4 mb-4">Mungkin Anda mencari</div>
        <div className="flex gap-x-6 gap-y-2 justify-center flex-wrap text-[13px]">
          {[
            { label: 'Profil Sekolah', to: '/profil' },
            { label: 'Akademik', to: '/akademik' },
            { label: 'Kesiswaan', to: '/kesiswaan' },
            { label: 'Prestasi', to: '/prestasi' },
            { label: 'Galeri', to: '/galeri' },
          ].map(l => (
            <Link key={l.to} to={l.to} className="text-ink-3 hover:text-ink no-underline hover:underline">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

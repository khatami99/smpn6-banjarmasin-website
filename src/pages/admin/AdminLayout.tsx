import { useState, useEffect, useRef, Suspense } from 'react'
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const NAV = [
  { label: 'Dashboard', to: '/admin', icon: '⊞', exact: true },
  { label: 'Statistik', to: '/admin/statistik', icon: '📊' },
  { label: 'Profil Sekolah', to: '/admin/profil', icon: '🏫' },
  { label: 'Akademik', to: '/admin/akademik', icon: '📚' },
  { label: 'Berita', to: '/admin/berita', icon: '📰' },
  { label: 'Pengumuman', to: '/admin/pengumuman', icon: '📢' },
  { label: 'Ekskul', to: '/admin/ekskul', icon: '⚽' },
  { label: 'Prestasi', to: '/admin/prestasi', icon: '🏆' },
  { label: 'Galeri', to: '/admin/galeri', icon: '🖼️' },
  { label: 'Halaman & Tab', to: '/admin/halaman', icon: '📄' },
]

/** Tombol akun di pojok kanan atas beserta menu turunnya. */
function MenuAkun({ email, onLogout }: { email: string; onLogout: () => void }) {
  const [buka, setBuka] = useState(false)
  const wadah = useRef<HTMLDivElement>(null)

  // Tutup saat mengeklik di luar menu atau menekan Esc
  useEffect(() => {
    if (!buka) return
    const klikLuar = (e: MouseEvent) => {
      if (wadah.current && !wadah.current.contains(e.target as Node)) setBuka(false)
    }
    const tekanEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setBuka(false) }
    document.addEventListener('mousedown', klikLuar)
    document.addEventListener('keydown', tekanEsc)
    return () => {
      document.removeEventListener('mousedown', klikLuar)
      document.removeEventListener('keydown', tekanEsc)
    }
  }, [buka])

  const inisial = (email[0] ?? '?').toUpperCase()

  return (
    <div className="relative" ref={wadah}>
      <button
        onClick={() => setBuka(o => !o)}
        aria-haspopup="menu"
        aria-expanded={buka}
        className={`flex items-center gap-2.5 pl-1.5 pr-2 py-1.5 border transition-colors
          ${buka ? 'border-ink bg-surface' : 'border-transparent hover:border-border hover:bg-surface'}`}
      >
        <span className="w-8 h-8 flex-shrink-0 bg-ink text-yellow flex items-center justify-center text-[13px] font-semibold">
          {inisial}
        </span>
        <span className="hidden sm:block text-[13px] text-ink-3 max-w-[180px] truncate">{email}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`flex-shrink-0 text-ink-4 transition-transform ${buka ? 'rotate-180' : ''}`}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {buka && (
        <div role="menu"
          className="absolute right-0 top-full mt-1 w-64 bg-white border border-border shadow-lg z-50">
          <div className="px-4 py-3 border-b border-border">
            <div className="text-[11px] text-ink-4 uppercase tracking-wide">Masuk sebagai</div>
            <div className="text-[13px] text-ink font-medium break-all mt-0.5">{email}</div>
          </div>

          <a href="/" target="_blank" rel="noreferrer" role="menuitem"
            onClick={() => setBuka(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-ink-3 hover:bg-off-white hover:text-ink transition-colors no-underline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" />
            </svg>
            Lihat website publik
          </a>

          <button onClick={onLogout} role="menuitem"
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] text-red-600 hover:bg-red-50 transition-colors border-t border-border">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            Keluar
          </button>
        </div>
      )}
    </div>
  )
}

export default function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-ink-4 text-sm">Memuat...</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname.startsWith(to)

  const judulHalaman = NAV.find(n => isActive(n.to, n.exact) && n.to !== '/admin')?.label ?? 'Dashboard'

  return (
    <div className="min-h-screen bg-off-white flex">
      {/* Sidebar overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-ink/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-60 bg-ink flex flex-col
        transition-transform md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 flex-shrink-0 overflow-hidden">
              <img src="/Logo SMPN 6 Banjarmasin.png" alt="Logo SMPN 6 Banjarmasin" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-[13px] font-semibold text-white">SMPN 6 BJM</div>
              <div className="text-[10px] text-white/30">Panel Admin</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(n => (
            <Link key={n.to} to={n.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium transition-colors no-underline rounded-sm
                ${isActive(n.to, n.exact)
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}>
              <span className="text-base">{n.icon}</span>
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar: hamburger di kiri (mobile), menu akun di kanan */}
        <header className="bg-white border-b border-border px-4 md:px-6 py-2.5 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1 text-ink flex-shrink-0" aria-label="Buka menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-[13px] font-semibold text-ink truncate">{judulHalaman}</span>
          </div>

          <MenuAkun email={user.email ?? '—'} onLogout={logout} />
        </header>

        <main className="flex-1 overflow-auto">
          {/* Sidebar tetap terlihat saat halaman admin lain sedang dimuat */}
          <Suspense fallback={<div className="p-10 text-ink-4 text-sm">Memuat…</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

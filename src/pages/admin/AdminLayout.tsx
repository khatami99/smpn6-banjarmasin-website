import { useState, Suspense } from 'react'
import { Link, useLocation, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const NAV = [
  { label: 'Dashboard', to: '/admin', icon: '⊞', exact: true },
  { label: 'Statistik', to: '/admin/statistik', icon: '📊' },
  { label: 'Profil Sekolah', to: '/admin/profil', icon: '🏫' },
  { label: 'Berita', to: '/admin/berita', icon: '📰' },
  { label: 'Pengumuman', to: '/admin/pengumuman', icon: '📢' },
  { label: 'Ekskul', to: '/admin/ekskul', icon: '⚽' },
  { label: 'Prestasi', to: '/admin/prestasi', icon: '🏆' },
  { label: 'Galeri', to: '/admin/galeri', icon: '🖼️' },
]

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

        {/* User info + logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="px-3 mb-2">
            <div className="text-[11px] text-white/30">Masuk sebagai</div>
            <div className="text-[12px] text-white/70 truncate">{user.email}</div>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 text-[12px] text-white/40 hover:text-white transition-colors">
            <span>→</span> Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="md:hidden bg-ink px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-white p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <span className="text-white font-semibold text-sm">Admin Panel</span>
          <button onClick={logout} className="text-white/50 text-xs hover:text-white">Keluar</button>
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

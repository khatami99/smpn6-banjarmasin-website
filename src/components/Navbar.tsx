import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Beranda', to: '/' },
  { label: 'Profil', to: '/profil' },
  { label: 'Akademik', to: '/akademik' },
  { label: 'Kesiswaan', to: '/kesiswaan' },
  { label: 'Prestasi', to: '/prestasi' },
  { label: 'Berita', to: '/berita' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <>
{/* Main Nav */}
      <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-[0_1px_0_#E0E0DC]">
        <div className="flex items-center justify-between px-6 md:px-12">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3.5 py-3.5 no-underline">
            <div className="w-9 h-9 flex-shrink-0 overflow-hidden">
              <img src="/Logo SMPN 6 Banjarmasin.png" alt="Logo SMPN 6 Banjarmasin" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-sm font-semibold text-ink leading-none">SMPN 6 Banjarmasin</div>
              <div className="text-[11px] text-ink-4 tracking-wide mt-0.5">Dahlia</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-4 py-2 text-[13px] font-medium transition-colors no-underline
                  ${pathname === l.to ? 'text-ink font-semibold' : 'text-ink-3 hover:text-ink'}`}>
                {l.label}
              </Link>
            ))}
            <Link to="/admin"
              className="ml-2 px-4 py-2 bg-ink text-yellow text-[13px] font-semibold 
                         hover:bg-ink-2 transition-colors no-underline">
              Admin
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-ink"
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open
                ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>
                : <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t border-border bg-white px-6 py-3 flex flex-col gap-1">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to}
                onClick={() => setOpen(false)}
                className={`px-3 py-2.5 text-sm font-medium no-underline transition-colors rounded
                  ${pathname === l.to ? 'bg-surface text-ink font-semibold' : 'text-ink-3 hover:text-ink'}`}>
                {l.label}
              </Link>
            ))}
            <Link to="/admin"
              onClick={() => setOpen(false)}
              className="mt-2 px-3 py-2.5 bg-ink text-yellow text-sm font-semibold text-center no-underline">
              Admin Panel
            </Link>
          </div>
        )}
      </nav>
    </>
  )
}

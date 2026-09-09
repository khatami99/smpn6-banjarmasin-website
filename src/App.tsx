import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import NotFound from './pages/NotFound'
import Beranda from './pages/Beranda'
import Profil from './pages/Profil'
import Akademik from './pages/Akademik'
import Kesiswaan from './pages/Kesiswaan'
import PrestasiPage from './pages/Prestasi'
import { BeritaList, BeritaDetail } from './pages/Berita'
import Galeri from './pages/Galeri'
import HalamanKustom from './pages/HalamanKustom'

// Panel admin dimuat terpisah: pengunjung biasa tidak perlu ikut mengunduh
// Firebase Auth maupun editor teks yang hanya dipakai staf sekolah.
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminStatistik = lazy(() => import('./pages/admin/AdminStatistik'))
const AdminProfil = lazy(() => import('./pages/admin/AdminProfil'))
const AdminBerita = lazy(() => import('./pages/admin/AdminBerita'))
const AdminPengumuman = lazy(() => import('./pages/admin/AdminPengumuman'))
const AdminEkskul = lazy(() => import('./pages/admin/AdminEkskul'))
const AdminPrestasi = lazy(() => import('./pages/admin/AdminPrestasi'))
const AdminGaleri = lazy(() => import('./pages/admin/AdminGaleri'))
const AdminHalaman = lazy(() => import('./pages/admin/AdminHalaman'))
const AdminAkademik = lazy(() => import('./pages/admin/AdminAkademik'))

function MemuatPanel() {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <div className="text-ink-4 text-sm">Memuat panel admin…</div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Beranda />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/akademik" element={<Akademik />} />
          <Route path="/kesiswaan" element={<Kesiswaan />} />
          <Route path="/prestasi" element={<PrestasiPage />} />
          <Route path="/berita" element={<BeritaList />} />
          <Route path="/berita/:id" element={<BeritaDetail />} />
          <Route path="/galeri" element={<Galeri />} />
          {/* Halaman buatan admin. Rute statis di atas tetap diprioritaskan React Router. */}
          <Route path="/:slug" element={<HalamanKustom />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login"
          element={<Suspense fallback={<MemuatPanel />}><Login /></Suspense>} />
        <Route path="/admin"
          element={<Suspense fallback={<MemuatPanel />}><AdminLayout /></Suspense>}>
          <Route index element={<Dashboard />} />
          <Route path="statistik" element={<AdminStatistik />} />
          <Route path="profil" element={<AdminProfil />} />
          <Route path="berita" element={<AdminBerita />} />
          <Route path="pengumuman" element={<AdminPengumuman />} />
          <Route path="ekskul" element={<AdminEkskul />} />
          <Route path="prestasi" element={<AdminPrestasi />} />
          <Route path="galeri" element={<AdminGaleri />} />
          <Route path="halaman" element={<AdminHalaman />} />
          <Route path="akademik" element={<AdminAkademik />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

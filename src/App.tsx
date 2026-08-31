import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Beranda from './pages/Beranda'
import Profil from './pages/Profil'
import Akademik from './pages/Akademik'
import Kesiswaan from './pages/Kesiswaan'
import PrestasiPage from './pages/Prestasi'
import { BeritaList, BeritaDetail } from './pages/Berita'
import AdminLayout from './pages/admin/AdminLayout'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import AdminStatistik from './pages/admin/AdminStatistik'
import AdminProfil from './pages/admin/AdminProfil'
import AdminBerita from './pages/admin/AdminBerita'
import AdminPengumuman from './pages/admin/AdminPengumuman'
import AdminEkskul from './pages/admin/AdminEkskul'
import AdminPrestasi from './pages/admin/AdminPrestasi'
import AdminGaleri from './pages/admin/AdminGaleri'
import Galeri from './pages/Galeri'

export default function App() {
  return (
    <BrowserRouter>
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
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="statistik" element={<AdminStatistik />} />
          <Route path="profil" element={<AdminProfil />} />
          <Route path="berita" element={<AdminBerita />} />
          <Route path="pengumuman" element={<AdminPengumuman />} />
          <Route path="ekskul" element={<AdminEkskul />} />
          <Route path="prestasi" element={<AdminPrestasi />} />
          <Route path="galeri" element={<AdminGaleri />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

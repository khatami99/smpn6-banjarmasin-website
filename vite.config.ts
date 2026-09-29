import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://smpn6banjarmasin.sch.id',
      dynamicRoutes: [
        '/',
        '/profil',
        '/akademik',
        '/kesiswaan',
        '/ekskul',
        '/prestasi',
        '/berita',
        '/galeri',
      ],
      // route /admin dikecualikan otomatis karena tidak masuk list
    }),
  ],
})
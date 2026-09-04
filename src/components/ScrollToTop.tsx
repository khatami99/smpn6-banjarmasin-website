import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const RETRY_INTERVAL = 100
const MAX_RETRY = 20 // ~2 detik
const NAV_OFFSET = 80 // tinggi navbar sticky

/**
 * Menggulir halaman ke atas setiap kali pindah rute.
 * Kalau URL punya hash (mis. /profil#kontak), lompat ke section tersebut —
 * dicoba berulang karena section-nya baru muncul setelah data Firestore termuat.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      // 'instant' wajib: html { scroll-behavior: smooth } membuat scroll halus
      // yang langsung dibatalkan saat React me-render halaman baru.
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }

    const id = hash.slice(1)
    let tries = 0
    let timer = 0

    const tryScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        // Hitung posisi manual: scrollIntoView({behavior:'smooth'}) ikut dibatalkan
        // oleh render React, dan offset-nya tidak memperhitungkan navbar sticky.
        const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
        window.scrollTo({ top: Math.max(top, 0), left: 0, behavior: 'instant' })
        return
      }
      if (++tries < MAX_RETRY) timer = window.setTimeout(tryScroll, RETRY_INTERVAL)
    }

    tryScroll()
    return () => window.clearTimeout(timer)
  }, [pathname, hash])

  return null
}

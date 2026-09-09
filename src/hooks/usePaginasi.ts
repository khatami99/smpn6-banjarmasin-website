import { useEffect, useRef, useState } from 'react'

/**
 * Memotong daftar panjang menjadi beberapa halaman.
 *
 * Paginasi hanya aktif ketika jumlah data melewati `perHalaman`, jadi daftar
 * yang masih pendek tetap tampil utuh tanpa kontrol tambahan.
 *
 * `anchor` dipasang pada elemen pembuka daftar; tampilan digulirkan ke sana
 * setiap pindah halaman agar pembaca tidak perlu menggulir naik sendiri.
 */
export function usePaginasi<T>(daftar: T[], perHalaman: number) {
  const [halaman, setHalaman] = useState(1)
  const [tampilSemua, setTampilSemua] = useState(false)
  const anchor = useRef<HTMLDivElement>(null)

  const total = daftar.length
  const berpaginasi = !tampilSemua && total > perHalaman
  const totalHalaman = berpaginasi ? Math.ceil(total / perHalaman) : 1

  // Jaga agar halaman aktif tidak melewati batas saat data berkurang
  useEffect(() => {
    setHalaman(h => Math.min(h, Math.max(1, totalHalaman)))
  }, [totalHalaman])

  const tampil = berpaginasi
    ? daftar.slice((halaman - 1) * perHalaman, halaman * perHalaman)
    : daftar

  const gantiHalaman = (n: number) => {
    setHalaman(n)
    anchor.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }

  /** Dipanggil saat filter berubah, supaya tidak terdampar di halaman kosong. */
  const kembaliKeAwal = () => setHalaman(1)

  const tampilkanSemua = () => { setTampilSemua(true); setHalaman(1) }

  return {
    halaman, totalHalaman, total, tampil, anchor,
    gantiHalaman, tampilkanSemua, kembaliKeAwal,
  }
}

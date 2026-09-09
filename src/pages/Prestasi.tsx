import { useCallback, useEffect, useState } from 'react'
import { usePrestasi } from '../hooks/useFirestore'
import { usePageMeta } from '../hooks/usePageMeta'
import SafeImage from '../components/SafeImage'
import Paginasi from '../components/Paginasi'
import { usePaginasi } from '../hooks/usePaginasi'
import type { Prestasi } from '../types'

const PRESTASI_PER_HALAMAN = 12

const TINGKAT_ORDER = ['Internasional', 'Nasional', 'Provinsi', 'Kota', 'Sekolah']

const TINGKAT_STYLE: Record<string, string> = {
  Internasional: 'bg-yellow text-ink',
  Nasional: 'bg-ink text-yellow',
  Provinsi: 'bg-ink text-white',
  Kota: 'bg-surface text-ink border border-border',
  Sekolah: 'bg-off-white text-ink-3 border border-border',
}

export default function PrestasiPage() {
  const { prestasi, loading } = usePrestasi()
  const [filter, setFilter] = useState<string>('Semua')
  const [tahunFilter, setTahunFilter] = useState<string>('Semua')
  const [indeks, setIndeks] = useState<number | null>(null)

  usePageMeta(
    'Prestasi',
    'Rekam jejak prestasi akademik, olahraga, dan seni siswa SMPN 6 Banjarmasin dari tingkat kota hingga nasional.',
  )

  const tahunList = ['Semua', ...Array.from(new Set(prestasi.map(p => String(p.tahun)))).sort((a, b) => +b - +a)]
  const tingkatList = ['Semua', ...TINGKAT_ORDER.filter(t => prestasi.some(p => p.tingkat === t))]

  const filtered = prestasi.filter(p => {
    const okTingkat = filter === 'Semua' || p.tingkat === filter
    const okTahun = tahunFilter === 'Semua' || String(p.tahun) === tahunFilter
    return okTingkat && okTahun
  })

  // Potong dulu, baru dikelompokkan, supaya judul tahun ikut per halaman
  const pg = usePaginasi(filtered, PRESTASI_PER_HALAMAN)

  const byYear = pg.tampil.reduce((acc, p) => {
    const y = String(p.tahun)
    if (!acc[y]) acc[y] = []
    acc[y].push(p)
    return acc
  }, {} as Record<string, Prestasi[]>)

  const years = Object.keys(byYear).sort((a, b) => +b - +a)

  // Panel detail menelusuri seluruh hasil filter, bukan hanya halaman aktif
  const urut = filtered
  const terpilih = indeks === null ? null : urut[indeks]

  const tutup = useCallback(() => setIndeks(null), [])
  const sebelum = useCallback(
    () => setIndeks(i => (i === null ? null : (i - 1 + urut.length) % urut.length)),
    [urut.length],
  )
  const sesudah = useCallback(
    () => setIndeks(i => (i === null ? null : (i + 1) % urut.length)),
    [urut.length],
  )

  useEffect(() => {
    if (indeks === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') tutup()
      else if (e.key === 'ArrowLeft') sebelum()
      else if (e.key === 'ArrowRight') sesudah()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [indeks, tutup, sebelum, sesudah])

  useEffect(() => {
    if (indeks === null) return
    const sebelumnya = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = sebelumnya }
  }, [indeks])

  const gantiFilter = (fn: () => void) => { fn(); setIndeks(null); pg.kembaliKeAwal() }

  return (
    <>
      <div className="bg-ink px-6 md:px-12 py-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-white/30 mb-2">Capaian Sekolah</div>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-normal">Prestasi</h1>
          <p className="text-white/50 text-[15px] mt-3 max-w-xl">
            Rekam jejak prestasi akademik, olahraga, dan seni SMPN 6 Banjarmasin.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-border bg-off-white px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 items-center">
          <span className="text-[12px] font-semibold text-ink-4 uppercase tracking-wide">Tingkat:</span>
          {tingkatList.map(t => (
            <button key={t} onClick={() => gantiFilter(() => setFilter(t))}
              className={`px-3 py-1 text-[12px] font-medium transition-colors border
                ${filter === t ? 'bg-ink text-white border-ink' : 'bg-white text-ink-3 border-border hover:border-ink-3'}`}>
              {t}
            </button>
          ))}
          <span className="ml-4 text-[12px] font-semibold text-ink-4 uppercase tracking-wide">Tahun:</span>
          {tahunList.map(t => (
            <button key={t} onClick={() => gantiFilter(() => setTahunFilter(t))}
              className={`px-3 py-1 text-[12px] font-medium transition-colors border
                ${tahunFilter === t ? 'bg-ink text-white border-ink' : 'bg-white text-ink-3 border-border hover:border-ink-3'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12" ref={pg.anchor}>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 bg-surface animate-pulse" />
            ))}
          </div>
        ) : years.length === 0 ? (
          <p className="text-ink-4 text-center py-16">Belum ada data prestasi.</p>
        ) : (
          <div className="space-y-10">
            {years.map(year => (
              <div key={year}>
                <div className="flex items-center gap-4 mb-5">
                  <span className="font-serif text-2xl text-ink">{year}</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {byYear[year].map((p: Prestasi) => (
                    <button key={p.id}
                      onClick={() => setIndeks(urut.findIndex(x => x.id === p.id))}
                      aria-label={`Lihat detail ${p.judul}`}
                      className="border border-border hover:border-ink transition-colors overflow-hidden
                                 flex flex-col text-left group focus:outline-none focus:ring-2 focus:ring-ink">
                      {/* Area gambar selalu ada agar tinggi kartu seragam */}
                      <div className="relative h-40 bg-surface overflow-hidden flex-shrink-0">
                        {p.foto ? (
                          <SafeImage src={p.foto} alt={p.judul}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">🏆</div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <span className={`text-[10px] font-bold px-2 py-0.5 tracking-wide
                            ${TINGKAT_STYLE[p.tingkat] ?? 'bg-surface text-ink'}`}>
                            {p.tingkat}
                          </span>
                          <span className="text-[11px] text-ink-4">{p.peringkat}</span>
                        </div>
                        <div className="text-[14px] font-semibold text-ink leading-snug mb-2 group-hover:underline">
                          {p.judul}
                        </div>
                        <div className="text-[12px] text-ink-4">{p.pemenang}
                          {p.kelas && p.kelas !== '-' && <span> · Kelas {p.kelas}</span>}
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-[10px] bg-surface text-ink-3 px-1.5 py-0.5">{p.bidang}</span>
                          <span className="text-[11px] font-semibold text-ink-3 group-hover:text-ink">
                            Lihat detail →
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <Paginasi
          halaman={pg.halaman}
          totalHalaman={pg.totalHalaman}
          onGanti={pg.gantiHalaman}
          totalItem={pg.total}
          onTampilkanSemua={pg.tampilkanSemua}
        />
      </div>

      {/* Panel detail */}
      {terpilih && (
        <div className="fixed inset-0 bg-ink/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={tutup} role="dialog" aria-modal="true" aria-label={terpilih.judul}>
          <div className="relative bg-white w-full max-w-2xl my-auto" onClick={ev => ev.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <span className="text-[12px] text-ink-4">{(indeks ?? 0) + 1} / {urut.length}</span>
              <button onClick={tutup} className="text-[13px] text-ink-4 hover:text-ink">
                ✕ Tutup <span className="text-ink-4/60">(Esc)</span>
              </button>
            </div>

            {terpilih.foto && (
              <SafeImage src={terpilih.foto} alt={terpilih.judul}
                className="w-full max-h-[45vh] object-cover" />
            )}

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`text-[10px] font-bold px-2 py-0.5 tracking-wide
                  ${TINGKAT_STYLE[terpilih.tingkat] ?? 'bg-surface text-ink'}`}>
                  {terpilih.tingkat}
                </span>
                <span className="text-[11px] text-ink-4">{terpilih.tahun}</span>
              </div>

              <h2 className="font-serif text-2xl text-ink leading-tight mb-4">{terpilih.judul}</h2>

              {terpilih.deskripsi && (
                <p className="text-[15px] text-ink-3 leading-[1.8] mb-6">{terpilih.deskripsi}</p>
              )}

              <div className="border border-border divide-y divide-border text-[14px]">
                {[
                  ['Peringkat', terpilih.peringkat],
                  ['Pemenang', terpilih.pemenang],
                  ['Kelas', terpilih.kelas && terpilih.kelas !== '-' ? terpilih.kelas : null],
                  ['Bidang', terpilih.bidang],
                ].filter(([, isi]) => isi).map(([label, isi]) => (
                  <div key={label} className="grid grid-cols-1 sm:grid-cols-[120px_1fr]">
                    <div className="px-4 pt-3 pb-1 sm:py-3 sm:bg-surface text-ink-3 font-medium
                      text-[11px] sm:text-[14px] uppercase sm:normal-case tracking-wide sm:tracking-normal">
                      {label}
                    </div>
                    <div className="px-4 pb-3 sm:py-3 text-ink break-words">{isi}</div>
                  </div>
                ))}
              </div>

              {urut.length > 1 && (
                <div className="flex items-center justify-between gap-3 mt-6 pt-5 border-t border-border">
                  <button onClick={sebelum} className="btn-outline text-[13px] py-2">← Sebelumnya</button>
                  <button onClick={sesudah} className="btn-outline text-[13px] py-2">Berikutnya →</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

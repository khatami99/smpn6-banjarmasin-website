import { useCallback, useEffect, useState } from 'react'
import { useEkskul } from '../hooks/useFirestore'
import { usePageMeta } from '../hooks/usePageMeta'
import SafeImage from '../components/SafeImage'
import type { Ekskul } from '../types'

const KAT_COLORS: Record<string, string> = {
  Olahraga: 'bg-blue-50 text-blue-700',
  Seni: 'bg-pink-50 text-pink-700',
  Akademik: 'bg-yellow-bg text-ink-2',
  Pramuka: 'bg-green/10 text-green',
  Lainnya: 'bg-surface text-ink-3',
}

const URUTAN_KAT = ['Olahraga', 'Seni', 'Akademik', 'Pramuka', 'Lainnya']

export default function EkskulPage() {
  const { ekskul, loading } = useEkskul(false)
  const [kategori, setKategori] = useState('Semua')
  const [indeks, setIndeks] = useState<number | null>(null)

  usePageMeta(
    'Ekstrakurikuler',
    'Daftar lengkap ekstrakurikuler SMPN 6 Banjarmasin — olahraga, seni, akademik, dan kepramukaan beserta jadwal dan pembinanya.',
  )

  const aktif = ekskul.filter(e => e.aktif)
  const daftarKat = ['Semua', ...URUTAN_KAT.filter(k => aktif.some(e => e.kategori === k))]
  const tampil = kategori === 'Semua' ? aktif : aktif.filter(e => e.kategori === kategori)

  const terpilih = indeks === null ? null : tampil[indeks]

  const tutup = useCallback(() => setIndeks(null), [])
  const sebelum = useCallback(
    () => setIndeks(i => (i === null ? null : (i - 1 + tampil.length) % tampil.length)),
    [tampil.length],
  )
  const sesudah = useCallback(
    () => setIndeks(i => (i === null ? null : (i + 1) % tampil.length)),
    [tampil.length],
  )

  // Esc menutup, panah untuk pindah ekskul
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

  // Kunci scroll halaman di belakang panel detail
  useEffect(() => {
    if (indeks === null) return
    const sebelumnya = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = sebelumnya }
  }, [indeks])

  return (
    <>
      <div className="bg-ink px-6 md:px-12 py-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-white/30 mb-2">Pengembangan Bakat</div>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-normal">Ekstrakurikuler</h1>
          <p className="text-white/50 text-[15px] mt-3 max-w-xl">
            {aktif.length > 0
              ? `${aktif.length} kegiatan ekstrakurikuler tersedia bagi siswa SMPN 6 Banjarmasin.`
              : 'Kegiatan ekstrakurikuler SMPN 6 Banjarmasin.'}
          </p>
        </div>
      </div>

      {/* Filter kategori */}
      {daftarKat.length > 2 && (
        <div className="border-b border-border bg-off-white px-6 md:px-12 py-4">
          <div className="max-w-7xl mx-auto flex flex-wrap gap-2 items-center">
            <span className="text-[12px] font-semibold text-ink-4 uppercase tracking-wide mr-1">Kategori:</span>
            {daftarKat.map(k => (
              <button key={k} onClick={() => { setKategori(k); setIndeks(null) }}
                className={`px-3 py-1 text-[12px] font-medium border transition-colors
                  ${kategori === k ? 'bg-ink text-white border-ink' : 'bg-white text-ink-3 border-border hover:border-ink'}`}>
                {k}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-surface animate-pulse" />
            ))}
          </div>
        ) : tampil.length === 0 ? (
          <p className="text-ink-4 text-center py-16">Belum ada ekstrakurikuler pada kategori ini.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tampil.map((e: Ekskul, i) => (
              <button key={e.id} onClick={() => setIndeks(i)}
                aria-label={`Lihat detail ${e.nama}`}
                className="border border-border hover:border-ink transition-colors overflow-hidden
                           flex flex-col text-left group focus:outline-none focus:ring-2 focus:ring-ink">
                <div className="relative aspect-[4/3] bg-surface overflow-hidden flex-shrink-0">
                  {e.foto ? (
                    <>
                      <SafeImage src={e.foto} alt={e.nama}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className="absolute left-3 bottom-3 w-9 h-9 bg-white border border-border
                                       flex items-center justify-center text-lg shadow-sm">
                        {e.emoji}
                      </span>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">{e.emoji}</div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[14px] font-semibold text-ink group-hover:underline">{e.nama}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 flex-shrink-0
                      ${KAT_COLORS[e.kategori] ?? 'bg-surface text-ink-3'}`}>
                      {e.kategori}
                    </span>
                  </div>
                  <p className="text-[12px] text-ink-4 leading-relaxed line-clamp-2 flex-1">{e.deskripsi}</p>
                  <span className="text-[11px] font-semibold text-ink-3 mt-3 group-hover:text-ink">
                    Lihat detail →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Panel detail */}
      {terpilih && (
        <div className="fixed inset-0 bg-ink/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={tutup} role="dialog" aria-modal="true" aria-label={terpilih.nama}>
          <div className="relative bg-white w-full max-w-2xl my-auto" onClick={ev => ev.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <span className="text-[12px] text-ink-4">{(indeks ?? 0) + 1} / {tampil.length}</span>
              <button onClick={tutup} className="text-[13px] text-ink-4 hover:text-ink">
                ✕ Tutup <span className="text-ink-4/60">(Esc)</span>
              </button>
            </div>

            {terpilih.foto && (
              <SafeImage src={terpilih.foto} alt={terpilih.nama}
                className="w-full max-h-[45vh] object-cover" />
            )}

            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="w-14 h-14 flex-shrink-0 bg-surface border border-border
                                 flex items-center justify-center text-3xl">
                  {terpilih.emoji}
                </span>
                <div className="min-w-0">
                  <h2 className="font-serif text-2xl text-ink leading-tight">{terpilih.nama}</h2>
                  <span className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5
                    ${KAT_COLORS[terpilih.kategori] ?? 'bg-surface text-ink-3'}`}>
                    {terpilih.kategori}
                  </span>
                </div>
              </div>

              {terpilih.deskripsi && (
                <p className="text-[15px] text-ink-3 leading-[1.8] mb-6">{terpilih.deskripsi}</p>
              )}

              <div className="border border-border divide-y divide-border text-[14px]">
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr]">
                  <div className="px-4 pt-3 pb-1 sm:py-3 sm:bg-surface text-ink-3 font-medium
                    text-[11px] sm:text-[14px] uppercase sm:normal-case tracking-wide sm:tracking-normal">
                    Jadwal
                  </div>
                  <div className="px-4 pb-3 sm:py-3 text-ink">{terpilih.jadwal || '—'}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr]">
                  <div className="px-4 pt-3 pb-1 sm:py-3 sm:bg-surface text-ink-3 font-medium
                    text-[11px] sm:text-[14px] uppercase sm:normal-case tracking-wide sm:tracking-normal">
                    Pembina
                  </div>
                  <div className="px-4 pb-3 sm:py-3 text-ink">{terpilih.pembina || '—'}</div>
                </div>
              </div>

              {tampil.length > 1 && (
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

import { useCallback, useEffect, useState } from 'react'
import { useGaleri } from '../hooks/useFirestore'
import { usePageMeta } from '../hooks/usePageMeta'
import SafeImage from '../components/SafeImage'

export default function Galeri() {
  const { galeri, loading } = useGaleri()
  const [index, setIndex] = useState<number | null>(null)

  usePageMeta(
    'Galeri Foto',
    'Dokumentasi kegiatan, upacara, dan momen kebersamaan di SMPN 6 Banjarmasin.',
  )

  const selected = index === null ? null : galeri[index]

  const close = useCallback(() => setIndex(null), [])
  const prev = useCallback(
    () => setIndex(i => (i === null ? null : (i - 1 + galeri.length) % galeri.length)),
    [galeri.length],
  )
  const next = useCallback(
    () => setIndex(i => (i === null ? null : (i + 1) % galeri.length)),
    [galeri.length],
  )

  // Keyboard: Esc menutup, panah untuk pindah foto
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, close, prev, next])

  // Kunci scroll halaman di belakang lightbox
  useEffect(() => {
    if (index === null) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [index])

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
      <div className="eyebrow">Galeri Foto</div>
      <h1 className="section-title mb-10">Dokumentasi Kegiatan</h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-surface animate-pulse" />
          ))}
        </div>
      ) : galeri.length === 0 ? (
        <div className="border border-border p-16 text-center text-ink-4">
          Belum ada foto di galeri.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {galeri.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setIndex(i)}
              aria-label={`Lihat foto: ${item.judul}`}
              className="group relative aspect-square overflow-hidden bg-surface focus:outline-none focus:ring-2 focus:ring-ink"
            >
              <SafeImage
                src={item.url}
                alt={item.judul}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors duration-300 flex items-end">
                <div className="w-full px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-[13px] font-medium line-clamp-1 text-left">{item.judul}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-ink/95 z-50 flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={selected.judul}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/40 text-[12px]">
                {(index ?? 0) + 1} / {galeri.length}
              </span>
              <button onClick={close} className="text-white/60 hover:text-white text-[13px]">
                ✕ Tutup <span className="text-white/30">(Esc)</span>
              </button>
            </div>

            <img
              src={selected.url}
              alt={selected.judul}
              className="w-full max-h-[76vh] object-contain"
            />

            <div className="mt-3 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-white font-medium">{selected.judul}</p>
                {selected.deskripsi && (
                  <p className="text-white/50 text-[13px] mt-1">{selected.deskripsi}</p>
                )}
              </div>

              {galeri.length > 1 && (
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={prev} aria-label="Foto sebelumnya"
                    className="w-9 h-9 border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-colors">
                    ←
                  </button>
                  <button onClick={next} aria-label="Foto berikutnya"
                    className="w-9 h-9 border border-white/20 text-white/60 hover:text-white hover:border-white/50 transition-colors">
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

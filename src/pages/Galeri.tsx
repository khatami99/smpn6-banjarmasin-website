import { useState } from 'react'
import { useGaleri } from '../hooks/useFirestore'
import type { GaleriItem } from '../types'

export default function Galeri() {
  const { galeri, loading } = useGaleri()
  const [selected, setSelected] = useState<GaleriItem | null>(null)

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
          {galeri.map(item => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className="group relative aspect-square overflow-hidden bg-surface focus:outline-none"
            >
              <img
                src={item.url}
                alt={item.judul}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors duration-300 flex items-end">
                <div className="w-full px-3 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-[13px] font-medium line-clamp-1">{item.judul}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-ink/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-10 right-0 text-white/60 hover:text-white text-[13px]"
            >
              ✕ Tutup
            </button>
            <img
              src={selected.url}
              alt={selected.judul}
              className="w-full max-h-[80vh] object-contain"
            />
            <div className="mt-3">
              <p className="text-white font-medium">{selected.judul}</p>
              {selected.deskripsi && (
                <p className="text-white/50 text-[13px] mt-1">{selected.deskripsi}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

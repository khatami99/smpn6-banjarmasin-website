import { useParams } from 'react-router-dom'
import { useHalaman } from '../hooks/useFirestore'
import { usePageMeta } from '../hooks/usePageMeta'
import NotFound from './NotFound'

/** Menampilkan halaman informasi yang dibuat admin lewat panel. */
export default function HalamanKustom() {
  const { slug } = useParams<{ slug: string }>()
  const { halaman, loading } = useHalaman(true)

  const item = halaman.find(h => h.slug === slug)

  usePageMeta(item?.judul, item?.ringkasan)

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-20 space-y-4">
        <div className="h-9 bg-surface animate-pulse w-2/3" />
        <div className="h-4 bg-surface animate-pulse w-1/2" />
        <div className="h-64 bg-surface animate-pulse mt-8" />
      </div>
    )
  }

  if (!item) return <NotFound />

  return (
    <>
      <div className="bg-ink px-6 md:px-12 py-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          {item.eyebrow && (
            <div className="eyebrow text-white/30 mb-2">{item.eyebrow}</div>
          )}
          <h1 className="font-serif text-4xl md:text-5xl text-white font-normal">{item.judul}</h1>
          {item.ringkasan && (
            <p className="text-white/50 text-[15px] mt-3 max-w-xl">{item.ringkasan}</p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-14">
        {item.isi?.trim()
          ? <div className="prose-custom" dangerouslySetInnerHTML={{ __html: item.isi }} />
          : <p className="text-ink-4">Isi halaman ini belum ditulis.</p>}
      </div>
    </>
  )
}

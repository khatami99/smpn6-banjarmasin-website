import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useNews } from '../hooks/useFirestore'
import { usePageMeta } from '../hooks/usePageMeta'
import SafeImage from '../components/SafeImage'
import type { NewsItem } from '../types'

const KATEGORI_COLOR: Record<string, string> = {
  Kegiatan: 'bg-blue-50 text-blue-700',
  Prestasi: 'bg-green/10 text-green',
  Akademik: 'bg-yellow-bg text-ink-2',
  PPDB: 'bg-ink/5 text-ink-2',
  Pengumuman: 'bg-surface text-ink-3',
}

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return {
    day: d.getDate(),
    month: d.toLocaleString('id-ID', { month: 'short' }),
    year: d.getFullYear(),
  }
}

/** Berita lama disimpan sebagai teks biasa, yang baru sebagai HTML dari editor. */
function isHtml(text: string) {
  return /<(p|div|h[1-6]|ul|ol|li|br|strong|em|u|blockquote)\b[^>]*>/i.test(text)
}

// ─── BERITA LIST ──────────────────────────────────────────────
export function BeritaList() {
  const { news, loading } = useNews(true)
  const [kategori, setKategori] = useState('Semua')

  usePageMeta(
    'Berita & Pengumuman',
    'Kabar terbaru dari SMPN 6 Banjarmasin — kegiatan sekolah, prestasi siswa, PPDB, dan pengumuman penting.',
  )

  const allKat = ['Semua', 'Kegiatan', 'Prestasi', 'Akademik', 'PPDB', 'Pengumuman']
  const filtered = kategori === 'Semua' ? news : news.filter(n => n.kategori === kategori)

  return (
    <>
      <div className="bg-ink px-6 md:px-12 py-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-white/30 mb-2">Informasi Terkini</div>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-normal">Berita &amp; Pengumuman</h1>
          <p className="text-white/50 text-[15px] mt-3 max-w-xl">
            Kabar terbaru dari SMPN 6 Banjarmasin — kegiatan, prestasi, dan informasi penting sekolah.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="border-b border-border bg-off-white px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2">
          {allKat.map(k => (
            <button key={k} onClick={() => setKategori(k)}
              className={`px-3 py-1 text-[12px] font-medium border transition-colors
                ${kategori === k ? 'bg-ink text-white border-ink' : 'bg-white text-ink-3 border-border hover:border-ink'}`}>
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {loading ? (
          <div className="space-y-5">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 bg-surface animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-ink-4 text-center py-16">Belum ada berita dalam kategori ini.</p>
        ) : (
          <div className="divide-y divide-border border-t border-border">
            {filtered.map((item: NewsItem) => {
              const { day, month, year } = formatDate(item.tanggal)
              return (
                <Link key={item.id} to={`/berita/${item.id}`}
                  className="flex gap-6 py-6 group no-underline">
                  <div className="flex-shrink-0 text-center w-12">
                    <div className="font-serif text-3xl text-ink leading-none">{day}</div>
                    <div className="text-[11px] text-ink-4 uppercase tracking-wide">{month}</div>
                    <div className="text-[11px] text-ink-4">{year}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 mb-2 tracking-wide
                      ${KATEGORI_COLOR[item.kategori] ?? 'bg-surface text-ink-3'}`}>
                      {item.kategori}
                    </span>
                    <div className="text-[16px] font-semibold text-ink group-hover:underline leading-snug mb-1.5">
                      {item.judul}
                    </div>
                    <div className="text-[13px] text-ink-4 leading-relaxed line-clamp-2">{item.ringkasan}</div>
                    <div className="text-[12px] text-ink-4 mt-2">Oleh {item.penulis}</div>
                  </div>
                  {item.foto && (
                    <div className="flex-shrink-0 hidden sm:block w-32 md:w-40 self-start">
                      <SafeImage src={item.foto} alt={item.judul}
                        className="w-full aspect-[4/3] object-cover" />
                    </div>
                  )}
                  <div className="flex-shrink-0 self-center hidden md:block">
                    <span className="text-ink-4 group-hover:text-ink transition-colors text-xl">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

// ─── BERITA DETAIL ────────────────────────────────────────────
export function BeritaDetail() {
  const { id } = useParams<{ id: string }>()
  const { news, loading } = useNews(true)

  const item = news.find(n => n.id === id)
  const lainnya = news.filter(n => n.id !== id).slice(0, 3)

  usePageMeta(item?.judul, item?.ringkasan)

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-20">
        <div className="space-y-4">
          <div className="h-8 bg-surface animate-pulse w-3/4" />
          <div className="h-4 bg-surface animate-pulse w-1/2" />
          <div className="h-64 bg-surface animate-pulse mt-8" />
        </div>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-20 text-center">
        <p className="font-serif text-2xl text-ink mb-3">Berita tidak ditemukan</p>
        <Link to="/berita" className="btn-black">← Kembali ke Berita</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid md:grid-cols-[1fr_280px] gap-12">
      {/* Article */}
      <article>
        <Link to="/berita" className="inline-flex items-center gap-1.5 text-[12px] text-ink-4 hover:text-ink mb-6 no-underline">
          ← Kembali ke Berita
        </Link>

        <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 mb-4 tracking-wide
          ${KATEGORI_COLOR[item.kategori] ?? 'bg-surface text-ink-3'}`}>
          {item.kategori}
        </span>

        <h1 className="font-serif text-3xl md:text-4xl text-ink leading-tight mb-4">{item.judul}</h1>

        <div className="flex items-center gap-3 text-[13px] text-ink-4 mb-8 pb-8 border-b border-border">
          <span>{formatDateLong(item.tanggal)}</span>
          <span>·</span>
          <span>{item.penulis}</span>
        </div>

        {item.foto && (
          <figure className="mb-8">
            <SafeImage src={item.foto} alt={item.judul}
              className="w-full max-h-[460px] object-cover border border-border" />
          </figure>
        )}

        {isHtml(item.isi) ? (
          // Isi dari editor teks admin — sudah berupa HTML.
          <div className="prose-custom" dangerouslySetInnerHTML={{ __html: item.isi }} />
        ) : (
          // Berita lama: teks biasa yang dipisah baris baru.
          <div className="prose-custom">
            {item.isi.split('\n').map((para, i) => (
              para.trim() ? <p key={i}>{para}</p> : null
            ))}
          </div>
        )}
      </article>

      {/* Sidebar - berita lainnya */}
      <aside>
        <div className="border border-border">
          <div className="px-5 py-3 bg-surface border-b border-border">
            <span className="text-[11px] font-bold tracking-widest uppercase text-ink-3">Berita Lainnya</span>
          </div>
          <div className="divide-y divide-border">
            {lainnya.map((n: NewsItem) => {
              const { day, month } = formatDate(n.tanggal)
              return (
                <Link key={n.id} to={`/berita/${n.id}`}
                  className="flex gap-3 p-4 hover:bg-off-white transition-colors no-underline group">
                  <div className="flex-shrink-0 text-center w-8">
                    <div className="font-serif text-lg text-ink leading-none">{day}</div>
                    <div className="text-[10px] text-ink-4 uppercase">{month}</div>
                  </div>
                  <div className="text-[13px] text-ink-3 leading-snug group-hover:text-ink transition-colors">
                    {n.judul}
                  </div>
                </Link>
              )
            })}
          </div>
          <div className="p-4 border-t border-border">
            <Link to="/berita" className="text-[12px] font-semibold text-ink hover:underline no-underline">
              Lihat semua berita →
            </Link>
          </div>
        </div>
      </aside>
    </div>
  )
}

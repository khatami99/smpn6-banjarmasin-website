import { useState } from 'react'
import { usePrestasi } from '../hooks/useFirestore'
import type { Prestasi } from '../types'

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

  const tahunList = ['Semua', ...Array.from(new Set(prestasi.map(p => String(p.tahun)))).sort((a, b) => +b - +a)]
  const tingkatList = ['Semua', ...TINGKAT_ORDER.filter(t => prestasi.some(p => p.tingkat === t))]

  const filtered = prestasi.filter(p => {
    const okTingkat = filter === 'Semua' || p.tingkat === filter
    const okTahun = tahunFilter === 'Semua' || String(p.tahun) === tahunFilter
    return okTingkat && okTahun
  })

  // Group by year
  const byYear = filtered.reduce((acc, p) => {
    const y = String(p.tahun)
    if (!acc[y]) acc[y] = []
    acc[y].push(p)
    return acc
  }, {} as Record<string, Prestasi[]>)

  const years = Object.keys(byYear).sort((a, b) => +b - +a)

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
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1 text-[12px] font-medium transition-colors border
                ${filter === t ? 'bg-ink text-white border-ink' : 'bg-white text-ink-3 border-border hover:border-ink-3'}`}>
              {t}
            </button>
          ))}
          <span className="ml-4 text-[12px] font-semibold text-ink-4 uppercase tracking-wide">Tahun:</span>
          {tahunList.map(t => (
            <button key={t} onClick={() => setTahunFilter(t)}
              className={`px-3 py-1 text-[12px] font-medium transition-colors border
                ${tahunFilter === t ? 'bg-ink text-white border-ink' : 'bg-white text-ink-3 border-border hover:border-ink-3'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
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
                    <div key={p.id} className="border border-border p-5 hover:border-ink transition-colors">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 tracking-wide
                          ${TINGKAT_STYLE[p.tingkat] ?? 'bg-surface text-ink'}`}>
                          {p.tingkat}
                        </span>
                        <span className="text-[11px] text-ink-4">{p.peringkat}</span>
                      </div>
                      <div className="text-[14px] font-semibold text-ink leading-snug mb-2">{p.judul}</div>
                      <div className="text-[12px] text-ink-4">{p.pemenang}
                        {p.kelas && p.kelas !== '-' && <span> · Kelas {p.kelas}</span>}
                      </div>
                      <div className="mt-2">
                        <span className="text-[10px] bg-surface text-ink-3 px-1.5 py-0.5">{p.bidang}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

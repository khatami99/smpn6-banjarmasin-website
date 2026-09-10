import { Link } from 'react-router-dom'
import SafeImage from '../components/SafeImage'
import { useEkskul, useKesiswaan } from '../hooks/useFirestore'
import { usePageMeta } from '../hooks/usePageMeta'
import type { Ekskul } from '../types'

const KAT_COLORS: Record<string, string> = {
  Olahraga: 'bg-blue-50 text-blue-700',
  Seni: 'bg-pink-50 text-pink-700',
  Akademik: 'bg-yellow-bg text-ink-2',
  Pramuka: 'bg-green/10 text-green',
  Lainnya: 'bg-surface text-ink-3',
}

export default function Kesiswaan() {
  const { ekskul, loading } = useEkskul(false)
  const { kesiswaan } = useKesiswaan()

  usePageMeta(
    'Kesiswaan',
    'OSIS, ekstrakurikuler, dan tata tertib siswa SMPN 6 Banjarmasin.',
  )

  const aktif = ekskul.filter(e => e.aktif)
  return (
    <>
      <div className="bg-ink px-6 md:px-12 py-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-white/30 mb-2">Kegiatan Siswa</div>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-normal">Kesiswaan</h1>
          <p className="text-white/50 text-[15px] mt-3 max-w-xl">
            Wadah pengembangan diri siswa melalui organisasi, ekstrakurikuler, dan kegiatan sekolah.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">

        {/* OSIS Info */}
        <section className="mb-14 grid md:grid-cols-2 gap-8">
          <div>
            <div className="eyebrow mb-2">Organisasi Sekolah</div>
            <h2 className="font-serif text-2xl text-ink mb-4">{kesiswaan.osisJudul}</h2>
            {/* Tiap baris pada isian admin menjadi satu paragraf */}
            {kesiswaan.osisTeks.split(/\r?\n/).filter(t => t.trim()).map((paragraf, i) => (
              <p key={i} className="text-ink-3 text-[15px] leading-[1.8] mb-4 last:mb-0">{paragraf}</p>
            ))}
          </div>
          <div className="bg-surface border border-border p-6">
            <div className="eyebrow mb-4">{kesiswaan.programJudul}</div>
            <ul className="space-y-3">
              {kesiswaan.program.map(p => (
                <li key={p} className="flex items-start gap-2.5 text-[13px] text-ink-3">
                  <span className="w-1.5 h-1.5 bg-yellow border border-ink flex-shrink-0 mt-1.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Ekskul */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <div className="eyebrow mb-2">Pilihan Kegiatan</div>
              <h2 className="font-serif text-2xl text-ink mb-2">Ekstrakurikuler</h2>
              <p className="text-ink-4 text-[14px]">
                {aktif.length} ekskul aktif tersedia untuk pengembangan bakat siswa
              </p>
            </div>
            <Link to="/ekskul"
              className="text-[13px] font-semibold text-ink hover:underline no-underline hidden md:block flex-shrink-0">
              Lihat semua →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-36 bg-surface animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {aktif.slice(0, 8).map((e: Ekskul) => (
                <div key={e.id}
                  className="border border-border hover:border-ink transition-colors group overflow-hidden flex flex-col">
                  {/* Area gambar selalu ada agar tinggi semua kartu seragam.
                      Emoji tetap tampil: besar saat belum ada foto, jadi
                      lencana kecil di sudut foto saat sudah ada. */}
                  <div className="relative aspect-[4/3] bg-surface overflow-hidden flex-shrink-0">
                    {e.foto ? (
                      <>
                        <SafeImage src={e.foto} alt={e.nama} className="w-full h-full object-cover" />
                        <span className="absolute left-3 bottom-3 w-9 h-9 bg-white border border-border
                                         flex items-center justify-center text-lg shadow-sm">
                          {e.emoji}
                        </span>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">
                        {e.emoji}
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="text-[14px] font-semibold text-ink">{e.nama}</div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 flex-shrink-0
                      ${KAT_COLORS[e.kategori] ?? 'bg-surface text-ink-3'}`}>
                      {e.kategori}
                    </span>
                  </div>
                  <p className="text-[12px] text-ink-4 leading-relaxed mb-3">{e.deskripsi}</p>
                  <div className="space-y-1">
                    <div className="text-[11px] text-ink-4">
                      <span className="font-medium text-ink-3">Jadwal:</span> {e.jadwal}
                    </div>
                    <div className="text-[11px] text-ink-4">
                      <span className="font-medium text-ink-3">Pembina:</span> {e.pembina}
                    </div>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {aktif.length > 8 && (
            <div className="mt-8 text-center">
              <Link to="/ekskul" className="btn-outline">
                Lihat semua {aktif.length} ekstrakurikuler →
              </Link>
            </div>
          )}
        </section>

        {/* Tata Tertib highlight */}
        <section className="mt-14 bg-ink p-8 md:p-10">
          <div className="max-w-2xl">
            <div className="eyebrow text-white/30 mb-2">Peraturan Sekolah</div>
            <h2 className="font-serif text-2xl text-white mb-4">{kesiswaan.tataTertibJudul}</h2>
            <p className="text-white/60 text-[15px] leading-[1.8] mb-6">
              {kesiswaan.tataTertibTeks}
            </p>
            {/* Tombol unduh hanya muncul kalau tautannya sudah diisi admin */}
            {kesiswaan.tataTertibPdf && (
              <a href={kesiswaan.tataTertibPdf} target="_blank" rel="noreferrer" className="btn-black">
                Unduh Buku Tata Tertib (PDF)
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" x2="12" y1="15" y2="3"/>
                </svg>
              </a>
            )}
          </div>
        </section>

      </div>
    </>
  )
}

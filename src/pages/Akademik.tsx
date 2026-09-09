import { useEffect, useRef, useState } from 'react'
import Paginasi from '../components/Paginasi'
import { useAkademik } from '../hooks/useFirestore'
import { usePageMeta } from '../hooks/usePageMeta'

// Agenda per halaman. Paginasi baru muncul kalau jumlahnya melewati ini,
// jadi kalender pendek tetap tampil utuh tanpa kontrol tambahan.
const AGENDA_PER_HALAMAN = 12

export default function Akademik() {
  const { akademik, loading } = useAkademik()
  const [halaman, setHalaman] = useState(1)
  const [tampilSemua, setTampilSemua] = useState(false)
  const kepalaKalender = useRef<HTMLDivElement>(null)

  usePageMeta(
    'Akademik',
    'Kurikulum Merdeka, struktur mata pelajaran, dan kalender akademik SMPN 6 Banjarmasin.',
  )

  const totalAgenda = akademik.kalender.length
  const berpaginasi = !tampilSemua && totalAgenda > AGENDA_PER_HALAMAN
  const totalHalaman = berpaginasi ? Math.ceil(totalAgenda / AGENDA_PER_HALAMAN) : 1

  // Jaga agar halaman aktif tidak melewati batas saat admin menghapus agenda
  useEffect(() => {
    setHalaman(h => Math.min(h, Math.max(1, totalHalaman)))
  }, [totalHalaman])

  const agendaTampil = berpaginasi
    ? akademik.kalender.slice((halaman - 1) * AGENDA_PER_HALAMAN, halaman * AGENDA_PER_HALAMAN)
    : akademik.kalender

  const gantiHalaman = (n: number) => {
    setHalaman(n)
    kepalaKalender.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }

  return (
    <>
      <div className="bg-ink px-6 md:px-12 py-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-white/30 mb-2">Program Pembelajaran</div>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-normal">Akademik</h1>
          <p className="text-white/50 text-[15px] mt-3 max-w-xl">
            Kurikulum, struktur pembelajaran, dan kalender akademik SMPN 6 Banjarmasin.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14 grid md:grid-cols-[1fr_300px] gap-12">
        <div className="space-y-12">

          {/* Kurikulum */}
          <section>
            <div className="eyebrow mb-2">Struktur Kurikulum</div>
            <h2 className="font-serif text-2xl text-ink mb-6">Mata Pelajaran</h2>
            {akademik.pengantar && (
              <p className="text-ink-3 text-[15px] mb-5 leading-relaxed">{akademik.pengantar}</p>
            )}

            {loading ? (
              <div className="h-64 bg-surface animate-pulse" />
            ) : akademik.mapel.length === 0 ? (
              <p className="text-ink-4 text-sm border border-border p-6">Data mata pelajaran belum diisi.</p>
            ) : (
              <div className="border border-border">
                {/* Lebar kolom kanan harus muat label "JP/Minggu" (±88px)
                    beserta padding-nya, kalau tidak teksnya keluar dari tabel. */}
                <div className="grid grid-cols-[1fr_76px] sm:grid-cols-[1fr_124px] bg-surface border-b border-border text-[11px] font-bold tracking-wide uppercase text-ink-4">
                  <div className="px-4 py-2.5">Mata Pelajaran</div>
                  <div className="px-3 sm:px-4 py-2.5 text-right whitespace-nowrap">
                    <span className="sm:hidden">JP</span>
                    <span className="hidden sm:inline">JP/Minggu</span>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {akademik.mapel.map((m, i) => (
                    <div key={`${m.nama}-${i}`}
                      className="grid grid-cols-[1fr_76px] sm:grid-cols-[1fr_124px] text-[14px] hover:bg-off-white transition-colors">
                      <div className="px-4 py-3 text-ink">{m.nama}</div>
                      <div className="px-3 sm:px-4 py-3 text-ink-3 text-right">{m.jam}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Kalender */}
          <section id="kalender" ref={kepalaKalender} className="scroll-mt-24">
            <div className="eyebrow mb-2">Jadwal Kegiatan</div>
            <h2 className="font-serif text-2xl text-ink mb-6">{akademik.judulKalender}</h2>
            {loading ? (
              <div className="h-64 bg-surface animate-pulse" />
            ) : akademik.kalender.length === 0 ? (
              <p className="text-ink-4 text-sm border border-border p-6">Kalender akademik belum diisi.</p>
            ) : (
              <div className="border border-border divide-y divide-border">
                {agendaTampil.map((k, i) => (
                  // Di layar kecil ditumpuk agar kolom bulan tidak menggencet teks
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-[100px_1fr] text-[14px] hover:bg-off-white transition-colors">
                    <div className="px-4 pt-3 pb-1 sm:py-3.5 font-semibold text-ink sm:bg-surface sm:border-r border-border
                      text-[12px] sm:text-[14px]">
                      {k.bulan}
                    </div>
                    <div className="px-4 pb-3 sm:py-3.5 text-ink-3">{k.kegiatan}</div>
                  </div>
                ))}
              </div>
            )}

            <Paginasi
              halaman={halaman}
              totalHalaman={totalHalaman}
              onGanti={gantiHalaman}
              totalItem={totalAgenda}
              onTampilkanSemua={() => { setTampilSemua(true); setHalaman(1) }}
            />
          </section>

        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          {akademik.info.length > 0 && (
            <div className="bg-ink p-6">
              <div className="eyebrow text-white/30 mb-4">Info Penting</div>
              <div className="space-y-4">
                {akademik.info.map((i, idx) => (
                  <div key={idx} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <div className="text-[11px] text-white/30 uppercase tracking-wide mb-1">{i.label}</div>
                    <div className="text-[14px] text-white">{i.nilai}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {akademik.programUnggulan.length > 0 && (
            <div className="border border-border p-5">
              <div className="eyebrow mb-3">Program Unggulan</div>
              <ul className="space-y-2.5">
                {akademik.programUnggulan.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-ink-3">
                    <span className="w-1.5 h-1.5 bg-yellow border border-ink flex-shrink-0 mt-1.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tombol unduh hanya muncul kalau tautannya sudah diisi admin */}
          {akademik.linkKalenderPdf && (
            <div className="bg-yellow-bg border border-yellow/30 p-5">
              <div className="eyebrow mb-2">Download</div>
              <p className="text-[13px] text-ink-3 mb-3">Kalender akademik lengkap tersedia dalam format PDF.</p>
              <a href={akademik.linkKalenderPdf} target="_blank" rel="noreferrer"
                className="btn-black text-sm w-full justify-center">
                Unduh Kalender Akademik
              </a>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}

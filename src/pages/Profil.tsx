import { useProfile, useStats } from '../hooks/useFirestore'

export default function Profil() {
  const { profile } = useProfile()
  const { stats } = useStats()

  return (
    <>
      {/* Page header */}
      <div className="bg-ink px-6 md:px-12 py-14 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="eyebrow text-white/30 mb-2">Mengenal Kami</div>
          <h1 className="font-serif text-4xl md:text-5xl text-white font-normal">Profil Sekolah</h1>
          <p className="text-white/50 text-[15px] mt-3 max-w-xl">
            Mengenal lebih dekat SMP Negeri 6 Banjarmasin — sejarah, visi, dan komitmen kami.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        <div className="grid md:grid-cols-[1fr_280px] gap-12">
          {/* Main content */}
          <div className="space-y-12">

            {/* Identitas */}
            <section>
              <div className="eyebrow mb-4">Identitas Sekolah</div>
              <div className="border border-border divide-y divide-border">
                {[
                  ['Nama Sekolah', profile.nama],
                  ['NPSN', profile.npsn],
                  ['Bentuk Pendidikan', profile.bentukPendidikan],
                  ['Status Sekolah', profile.statusSekolah],
                  ['Alamat', `${profile.alamat}, ${profile.kelurahan}, ${profile.kecamatan}`],
                  ['Kota / Provinsi', `${profile.kota}, ${profile.provinsi} ${profile.kodePos}`],
                  ['Telepon', profile.telepon],
                  ['Email', profile.email],
                  ['Kepala Sekolah', profile.kepalaSekolah],
                  ['NIP', profile.nip],
                  ['Akreditasi', `${stats.akreditasi} (Unggul)`],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[200px_1fr] text-sm">
                    <div className="px-4 py-3 bg-surface text-ink-3 font-medium">{k}</div>
                    <div className="px-4 py-3 text-ink">{v}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Sejarah */}
            <section id="sejarah">
              <div className="eyebrow mb-4">Sejarah</div>
              <h2 className="font-serif text-2xl text-ink mb-4">Sejarah Singkat</h2>
              <div className="prose max-w-none">
                <p className="text-ink-3 leading-[1.8] text-[15px]">{profile.sejarah}</p>
              </div>
            </section>

            {/* Visi Misi */}
            <section id="visi-misi">
              <div className="eyebrow mb-4">Arah Sekolah</div>
              <h2 className="font-serif text-2xl text-ink mb-6">Visi &amp; Misi</h2>

              <div className="bg-ink p-6 mb-6">
                <div className="text-[11px] font-bold tracking-widest uppercase text-white/30 mb-3">Visi</div>
                <p className="font-serif text-xl text-white leading-relaxed italic">{profile.visi}</p>
              </div>

              <div className="border border-border p-6">
                <div className="eyebrow mb-4 text-ink-4">Misi</div>
                <ol className="space-y-3">
                  {profile.misi.map((m, i) => (
                    <li key={i} className="flex gap-4 text-[15px] text-ink-3 leading-relaxed">
                      <span className="font-serif text-xl text-yellow bg-ink w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {m}
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* Tujuan */}
            <section>
              <div className="eyebrow mb-4">Tujuan</div>
              <div className="bg-yellow-bg border border-yellow/30 p-6">
                <p className="text-[15px] text-ink leading-[1.8]">{profile.tujuan}</p>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Stats */}
            <div className="bg-ink p-6">
              <div className="eyebrow text-white/30 mb-5">Sekolah dalam Angka</div>
              <div className="space-y-4">
                {[
                  { n: stats.siswa.toLocaleString('id-ID'), l: 'Siswa Aktif' },
                  { n: stats.guru, l: 'Tenaga Pendidik' },
                  { n: stats.staf, l: 'Tenaga Kependidikan' },
                  { n: stats.kelas, l: 'Rombongan Belajar' },
                  { n: stats.ekskul, l: 'Ekstrakurikuler' },
                ].map(s => (
                  <div key={s.l} className="flex items-center justify-between border-b border-white/10 pb-3 last:border-0 last:pb-0">
                    <span className="text-[13px] text-white/50">{s.l}</span>
                    <span className="font-serif text-xl text-yellow">{s.n}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kontak */}
            <div id="kontak" className="border border-border p-5">
              <div className="eyebrow mb-4">Hubungi Kami</div>
              <div className="space-y-3 text-[13px] text-ink-3">
                <div>
                  <div className="font-semibold text-ink text-xs uppercase tracking-wide mb-1">Alamat</div>
                  <p>{profile.alamat}, {profile.kecamatan}, {profile.kota}</p>
                </div>
                <div>
                  <div className="font-semibold text-ink text-xs uppercase tracking-wide mb-1">Telepon</div>
                  <p>{profile.telepon}</p>
                </div>
                <div>
                  <div className="font-semibold text-ink text-xs uppercase tracking-wide mb-1">Email</div>
                  <p className="break-all">{profile.email}</p>
                </div>
                <div className="pt-1">
                  <div className="font-semibold text-ink text-xs uppercase tracking-wide mb-1">Jam Operasional</div>
                  <p>Senin–Jumat: 07.00–15.00 WITA</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

import { useState, useEffect, type FormEvent, type ReactNode } from 'react'
import { useAkademik } from '../../hooks/useFirestore'
import { kapitalJudul } from '../../lib/teks'
import type { AkademikData } from '../../types'

// Sengaja tanpa lebar: kalau kelas dasar memuat w-full, penimpaan seperti
// w-20 akan kalah karena Tailwind menaruh w-full lebih belakang di CSS.
const FIELD = 'border border-border px-3 py-2 text-[14px] text-ink focus:outline-none focus:border-ink'
const INPUT = `${FIELD} w-full`
const FIELD_ISI = `${FIELD} flex-1 min-w-0`

function LabelKolom({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-semibold text-ink-4 uppercase tracking-wide">{children}</div>
  )
}

function Kotak({ judul, desc, children }: { judul: string; desc?: string; children: ReactNode }) {
  return (
    <div className="border border-border p-5 space-y-3">
      <div className="border-b border-border pb-3">
        <div className="text-[11px] font-bold tracking-widest uppercase text-ink-4">{judul}</div>
        {desc && <p className="text-[12px] text-ink-4 mt-1 normal-case tracking-normal">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

/** Tombol tambah / hapus baris untuk daftar yang bisa diubah panjangnya. */
function BarisAksi({ onHapus }: { onHapus: () => void }) {
  return (
    <button type="button" onClick={onHapus} title="Hapus baris"
      className="flex-shrink-0 w-8 h-[38px] border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
      ×
    </button>
  )
}

export default function AdminAkademik() {
  const { akademik, loading, updateAkademik } = useAkademik()
  const [form, setForm] = useState<AkademikData>(akademik)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Jangan timpa isian yang sedang diketik saat snapshot realtime datang
  useEffect(() => {
    if (!dirty) setForm(akademik)
  }, [akademik, dirty])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const ubah = <K extends keyof AkademikData>(key: K, nilai: AkademikData[K]) => {
    setDirty(true)
    setForm(p => ({ ...p, [key]: nilai }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Buang baris kosong supaya tidak tampil sebagai baris hampa di website
      await updateAkademik({
        ...form,
        mapel: form.mapel.filter(m => m.nama.trim()),
        kalender: form.kalender.filter(k => k.bulan.trim() || k.kegiatan.trim()),
        info: form.info.filter(i => i.label.trim() || i.nilai.trim()),
        programUnggulan: form.programUnggulan.filter(p => p.trim()),
      })
      setDirty(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { alert('Gagal menyimpan. Coba lagi.') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="p-10 text-ink-4">Memuat...</div>

  return (
    <div className="p-6 md:p-10 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-ink">Halaman Akademik</h1>
        <p className="text-ink-4 text-[13px] mt-1">
          Semua isi halaman Akademik diatur di sini — mata pelajaran, kalender, dan info sidebar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <Kotak judul="Paragraf Pembuka">
          <textarea className={`${INPUT} resize-y`} rows={3} value={form.pengantar}
            onChange={e => ubah('pengantar', e.target.value)}
            placeholder="Kalimat pengantar di atas tabel mata pelajaran." />
        </Kotak>

        {/* Mata pelajaran */}
        <Kotak judul="Mata Pelajaran" desc="JP = jam pelajaran per minggu.">
          <div className="flex gap-2 px-1">
            <LabelKolom>Nama mata pelajaran</LabelKolom>
            <div className="ml-auto flex gap-2">
              <LabelKolom>JP</LabelKolom>
              <span className="w-8" />
            </div>
          </div>
          <div className="space-y-2">
            {form.mapel.map((m, i) => (
              <div key={i} className="flex gap-2">
                <input className={FIELD_ISI} value={m.nama} autoCapitalize="words" placeholder="Nama mata pelajaran"
                  onChange={e => {
                    const baru = [...form.mapel]; baru[i] = { ...baru[i], nama: e.target.value }
                    ubah('mapel', baru)
                  }}
                  onBlur={() => {
                    const baru = [...form.mapel]; baru[i] = { ...baru[i], nama: kapitalJudul(baru[i].nama) }
                    ubah('mapel', baru)
                  }} />
                <input type="number" min={0} className={`${FIELD} w-20 flex-shrink-0`} value={m.jam}
                  onChange={e => {
                    const baru = [...form.mapel]; baru[i] = { ...baru[i], jam: Number(e.target.value) }
                    ubah('mapel', baru)
                  }} />
                <BarisAksi onHapus={() => ubah('mapel', form.mapel.filter((_, x) => x !== i))} />
              </div>
            ))}
          </div>
          <button type="button" className="btn-outline text-[13px] py-2"
            onClick={() => ubah('mapel', [...form.mapel, { nama: '', jam: 2 }])}>
            + Tambah Mata Pelajaran
          </button>
        </Kotak>

        {/* Kalender */}
        <Kotak judul="Kalender Akademik">
          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
              Judul Kalender
            </label>
            <input className={INPUT} value={form.judulKalender} autoCapitalize="words"
              onChange={e => ubah('judulKalender', e.target.value)}
              onBlur={() => ubah('judulKalender', kapitalJudul(form.judulKalender))}
              placeholder="Kalender Akademik 2026/2027" />
          </div>

          <div className="flex gap-2 px-1 pt-2">
            <span className="w-28 flex-shrink-0"><LabelKolom>Bulan</LabelKolom></span>
            <LabelKolom>Kegiatan</LabelKolom>
          </div>
          <div className="space-y-2">
            {form.kalender.map((k, i) => (
              <div key={i} className="flex gap-2">
                <input className={`${FIELD} w-28 flex-shrink-0`} value={k.bulan} placeholder="Jul 2026"
                  onChange={e => {
                    const baru = [...form.kalender]; baru[i] = { ...baru[i], bulan: e.target.value }
                    ubah('kalender', baru)
                  }} />
                <input className={FIELD_ISI} value={k.kegiatan} placeholder="Kegiatan pada bulan tersebut"
                  onChange={e => {
                    const baru = [...form.kalender]; baru[i] = { ...baru[i], kegiatan: e.target.value }
                    ubah('kalender', baru)
                  }} />
                <BarisAksi onHapus={() => ubah('kalender', form.kalender.filter((_, x) => x !== i))} />
              </div>
            ))}
          </div>
          <button type="button" className="btn-outline text-[13px] py-2"
            onClick={() => ubah('kalender', [...form.kalender, { bulan: '', kegiatan: '' }])}>
            + Tambah Agenda
          </button>
        </Kotak>

        {/* Info sidebar */}
        <Kotak judul="Info Penting" desc="Kotak hitam di sisi kanan halaman Akademik.">
          <div className="flex gap-2 px-1">
            <span className="w-40 flex-shrink-0"><LabelKolom>Label</LabelKolom></span>
            <LabelKolom>Isi</LabelKolom>
          </div>
          <div className="space-y-2">
            {form.info.map((it, i) => (
              <div key={i} className="flex gap-2">
                <input className={`${FIELD} w-40 flex-shrink-0`} value={it.label} autoCapitalize="words" placeholder="Kurikulum"
                  onChange={e => {
                    const baru = [...form.info]; baru[i] = { ...baru[i], label: e.target.value }
                    ubah('info', baru)
                  }}
                  onBlur={() => {
                    const baru = [...form.info]; baru[i] = { ...baru[i], label: kapitalJudul(baru[i].label) }
                    ubah('info', baru)
                  }} />
                <input className={FIELD_ISI} value={it.nilai} placeholder="Kurikulum Merdeka"
                  onChange={e => {
                    const baru = [...form.info]; baru[i] = { ...baru[i], nilai: e.target.value }
                    ubah('info', baru)
                  }} />
                <BarisAksi onHapus={() => ubah('info', form.info.filter((_, x) => x !== i))} />
              </div>
            ))}
          </div>
          <button type="button" className="btn-outline text-[13px] py-2"
            onClick={() => ubah('info', [...form.info, { label: '', nilai: '' }])}>
            + Tambah Info
          </button>
        </Kotak>

        {/* Program unggulan */}
        <Kotak judul="Program Unggulan">
          <div className="space-y-2">
            {form.programUnggulan.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input className={FIELD_ISI} value={p} autoCapitalize="words" placeholder="Nama program"
                  onChange={e => {
                    const baru = [...form.programUnggulan]; baru[i] = e.target.value
                    ubah('programUnggulan', baru)
                  }}
                  onBlur={() => {
                    const baru = [...form.programUnggulan]; baru[i] = kapitalJudul(baru[i])
                    ubah('programUnggulan', baru)
                  }} />
                <BarisAksi onHapus={() => ubah('programUnggulan', form.programUnggulan.filter((_, x) => x !== i))} />
              </div>
            ))}
          </div>
          <button type="button" className="btn-outline text-[13px] py-2"
            onClick={() => ubah('programUnggulan', [...form.programUnggulan, ''])}>
            + Tambah Program
          </button>
        </Kotak>

        <Kotak judul="Tautan Unduh Kalender (PDF)"
          desc="Kosongkan kalau belum ada — tombol unduhnya otomatis disembunyikan.">
          <input className={INPUT} value={form.linkKalenderPdf} placeholder="https://..."
            onChange={e => ubah('linkKalenderPdf', e.target.value)} />
        </Kotak>

        <div className="flex items-center gap-3 sticky bottom-0 bg-off-white py-4 border-t border-border">
          <button type="submit" disabled={saving} className="btn-black disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'Simpan Halaman Akademik'}
          </button>
          {saved && <span className="text-[13px] text-green font-medium">✓ Tersimpan!</span>}
          {dirty && !saved && (
            <span className="text-[13px] text-amber-700">Ada perubahan yang belum disimpan</span>
          )}
        </div>
      </form>
    </div>
  )
}

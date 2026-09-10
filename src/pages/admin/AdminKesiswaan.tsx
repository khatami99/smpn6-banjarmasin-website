import { useState, useEffect, type FormEvent, type ReactNode } from 'react'
import LinkDokumenField from '../../components/LinkDokumenField'
import { useKesiswaan } from '../../hooks/useFirestore'
import { kapitalJudul } from '../../lib/teks'
import type { KesiswaanData } from '../../types'

const FIELD = 'border border-border px-3 py-2 text-[14px] text-ink focus:outline-none focus:border-ink'
const INPUT = `${FIELD} w-full`
const FIELD_ISI = `${FIELD} flex-1 min-w-0`

function Kotak({ judul, desc, children }: { judul: string; desc?: string; children: ReactNode }) {
  return (
    <div className="border border-border p-5 space-y-3">
      <div className="border-b border-border pb-3">
        <div className="text-[11px] font-bold tracking-widest uppercase text-ink-4">{judul}</div>
        {desc && <p className="text-[12px] text-ink-4 mt-1">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

function Label({ children }: { children: ReactNode }) {
  return (
    <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
      {children}
    </label>
  )
}

function BarisAksi({ onHapus }: { onHapus: () => void }) {
  return (
    <button type="button" onClick={onHapus} title="Hapus baris"
      className="flex-shrink-0 w-8 h-[38px] border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
      ×
    </button>
  )
}

export default function AdminKesiswaan() {
  const { kesiswaan, loading, updateKesiswaan } = useKesiswaan()
  const [form, setForm] = useState<KesiswaanData>(kesiswaan)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Jangan timpa isian yang sedang diketik saat snapshot realtime datang
  useEffect(() => {
    if (!dirty) setForm(kesiswaan)
  }, [kesiswaan, dirty])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const ubah = <K extends keyof KesiswaanData>(key: K, nilai: KesiswaanData[K]) => {
    setDirty(true)
    setForm(p => ({ ...p, [key]: nilai }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateKesiswaan({
        ...form,
        // Pengaman: tombol simpan bisa ditekan tanpa keluar dari kolom dulu
        osisJudul: kapitalJudul(form.osisJudul),
        programJudul: kapitalJudul(form.programJudul),
        tataTertibJudul: kapitalJudul(form.tataTertibJudul),
        program: form.program.filter(p => p.trim()).map(kapitalJudul),
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
        <h1 className="font-serif text-2xl text-ink">Halaman Kesiswaan</h1>
        <p className="text-ink-4 text-[13px] mt-1">
          Keterangan OSIS, program kerja, dan tata tertib. Daftar ekskulnya diatur
          di menu Ekskul.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* OSIS */}
        <Kotak judul="Tentang OSIS">
          <div>
            <Label>Judul</Label>
            <input className={INPUT} value={form.osisJudul} autoCapitalize="words"
              onChange={e => ubah('osisJudul', e.target.value)}
              onBlur={() => ubah('osisJudul', kapitalJudul(form.osisJudul))}
              placeholder="OSIS SMPN 6 Banjarmasin" />
          </div>
          <div>
            <Label>
              Keterangan
              <span className="ml-1 font-normal text-ink-4 normal-case tracking-normal">
                (satu paragraf per baris — tekan Enter untuk paragraf baru)
              </span>
            </Label>
            <textarea className={`${INPUT} resize-y`} rows={6} value={form.osisTeks}
              onChange={e => ubah('osisTeks', e.target.value)} />
          </div>
        </Kotak>

        {/* Program kerja */}
        <Kotak judul="Program Kerja" desc="Tampil sebagai daftar berpoin di kotak abu sebelah kanan.">
          <div>
            <Label>Judul Kotak</Label>
            <input className={INPUT} value={form.programJudul} autoCapitalize="words"
              onChange={e => ubah('programJudul', e.target.value)}
              onBlur={() => ubah('programJudul', kapitalJudul(form.programJudul))}
              placeholder="Program OSIS 2026/2027" />
            <p className="text-[11px] text-ink-4 mt-1">
              Ingat mengganti tahunnya tiap tahun ajaran baru.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            {form.program.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input className={FIELD_ISI} value={p} placeholder="Nama program" autoCapitalize="words"
                  onChange={e => {
                    const baru = [...form.program]; baru[i] = e.target.value
                    ubah('program', baru)
                  }}
                  onBlur={() => {
                    const baru = [...form.program]; baru[i] = kapitalJudul(baru[i])
                    ubah('program', baru)
                  }} />
                <BarisAksi onHapus={() => ubah('program', form.program.filter((_, x) => x !== i))} />
              </div>
            ))}
          </div>
          <button type="button" className="btn-outline text-[13px] py-2"
            onClick={() => ubah('program', [...form.program, ''])}>
            + Tambah Program
          </button>
        </Kotak>

        {/* Tata tertib */}
        <Kotak judul="Tata Tertib" desc="Bagian berlatar hitam di bagian bawah halaman.">
          <div>
            <Label>Judul</Label>
            <input className={INPUT} value={form.tataTertibJudul} autoCapitalize="words"
              onChange={e => ubah('tataTertibJudul', e.target.value)}
              onBlur={() => ubah('tataTertibJudul', kapitalJudul(form.tataTertibJudul))}
              placeholder="Tata Tertib Siswa" />
          </div>
          <div>
            <Label>Keterangan</Label>
            <textarea className={`${INPUT} resize-y`} rows={3} value={form.tataTertibTeks}
              onChange={e => ubah('tataTertibTeks', e.target.value)} />
          </div>

          <LinkDokumenField
            label="Tautan Berkas Tata Tertib (PDF)"
            value={form.tataTertibPdf}
            onChange={url => ubah('tataTertibPdf', url)}
            keterangan={
              <p className="text-ink-4 pt-1">
                Kalau berkasnya direvisi, tidak perlu mengganti tautan di sini — cukup klik kanan
                berkas di Drive lalu pilih <em>Kelola versi</em> dan unggah yang baru.
              </p>
            }
          />
        </Kotak>

        <div className="flex items-center gap-3 sticky bottom-0 bg-off-white py-4 border-t border-border">
          <button type="submit" disabled={saving} className="btn-black disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'Simpan Halaman Kesiswaan'}
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

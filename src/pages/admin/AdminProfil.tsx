import { useState, useEffect, type FormEvent } from 'react'
import { useProfile } from '../../hooks/useFirestore'
import type { SchoolProfile } from '../../types'

function Field({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">{label}</label>
      {desc && <p className="text-[11px] text-ink-4 mb-1.5">{desc}</p>}
      {children}
    </div>
  )
}

const INPUT = "w-full border border-border px-3 py-2.5 text-[14px] text-ink focus:outline-none focus:border-ink transition-colors"
const TEXTAREA = `${INPUT} resize-y min-h-[80px]`

export default function AdminProfil() {
  const { profile, loading, updateProfile } = useProfile()
  const [form, setForm] = useState<SchoolProfile>(profile)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [misiText, setMisiText] = useState('')

  useEffect(() => {
    setForm(profile)
    setMisiText(profile.misi.join('\n'))
  }, [profile])

  const set = (key: keyof SchoolProfile) => (
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }))
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const misi = misiText.split('\n').map(m => m.trim()).filter(Boolean)
      await updateProfile({ ...form, misi })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('Gagal menyimpan. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-10 text-ink-4">Memuat...</div>

  return (
    <div className="p-6 md:p-10 max-w-2xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-ink">Profil Sekolah</h1>
        <p className="text-ink-4 text-[13px] mt-1">Identitas, kontak, dan visi misi sekolah.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Identitas */}
        <div className="border border-border p-5 space-y-4">
          <div className="text-[11px] font-bold tracking-widest uppercase text-ink-4 border-b border-border pb-3 mb-2">
            Identitas Sekolah
          </div>
          <Field label="Nama Sekolah">
            <input className={INPUT} value={form.nama} onChange={set('nama')} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="NPSN">
              <input className={INPUT} value={form.npsn} onChange={set('npsn')} />
            </Field>
            <Field label="Status">
              <input className={INPUT} value={form.statusSekolah} onChange={set('statusSekolah')} />
            </Field>
          </div>
          <Field label="Kepala Sekolah">
            <input className={INPUT} value={form.kepalaSekolah} onChange={set('kepalaSekolah')} />
          </Field>
          <Field label="NIP Kepala Sekolah">
            <input className={INPUT} value={form.nip} onChange={set('nip')} />
          </Field>
        </div>

        {/* Alamat & Kontak */}
        <div className="border border-border p-5 space-y-4">
          <div className="text-[11px] font-bold tracking-widest uppercase text-ink-4 border-b border-border pb-3 mb-2">
            Alamat &amp; Kontak
          </div>
          <Field label="Alamat (Jalan)">
            <input className={INPUT} value={form.alamat} onChange={set('alamat')} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Kelurahan">
              <input className={INPUT} value={form.kelurahan} onChange={set('kelurahan')} />
            </Field>
            <Field label="Kecamatan">
              <input className={INPUT} value={form.kecamatan} onChange={set('kecamatan')} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Kota">
              <input className={INPUT} value={form.kota} onChange={set('kota')} />
            </Field>
            <Field label="Kode Pos">
              <input className={INPUT} value={form.kodePos} onChange={set('kodePos')} />
            </Field>
          </div>
          <Field label="Telepon">
            <input className={INPUT} value={form.telepon} onChange={set('telepon')} />
          </Field>
          <Field label="Email">
            <input type="email" className={INPUT} value={form.email} onChange={set('email')} />
          </Field>
          <Field label="Website">
            <input type="url" className={INPUT} value={form.website} onChange={set('website')} />
          </Field>
        </div>

        {/* Visi Misi */}
        <div className="border border-border p-5 space-y-4">
          <div className="text-[11px] font-bold tracking-widest uppercase text-ink-4 border-b border-border pb-3 mb-2">
            Visi &amp; Misi
          </div>
          <Field label="Visi Sekolah">
            <textarea className={TEXTAREA} value={form.visi} onChange={set('visi')} rows={3} />
          </Field>
          <Field label="Misi Sekolah"
            desc="Tulis setiap misi di baris baru (Enter untuk misi berikutnya)">
            <textarea className={TEXTAREA} value={misiText}
              onChange={e => setMisiText(e.target.value)} rows={6} />
          </Field>
          <Field label="Tujuan Sekolah">
            <textarea className={TEXTAREA} value={form.tujuan} onChange={set('tujuan')} rows={3} />
          </Field>
          <Field label="Sejarah Singkat">
            <textarea className={TEXTAREA} value={form.sejarah} onChange={set('sejarah')} rows={5} />
          </Field>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-black disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
          </button>
          {saved && <span className="text-[13px] text-green font-medium">✓ Tersimpan!</span>}
        </div>
      </form>
    </div>
  )
}

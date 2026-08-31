import { useState, useEffect, type FormEvent } from 'react'
import { useAnnouncement } from '../../hooks/useFirestore'
import type { Announcement } from '../../types'

const INPUT = "w-full border border-border px-3 py-2.5 text-[14px] text-ink focus:outline-none focus:border-ink"

export default function AdminPengumuman() {
  const { announcement, updateAnnouncement } = useAnnouncement()
  const [form, setForm] = useState<Announcement>({
    teks: '', link: '', linkLabel: 'Lihat detail', aktif: true,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (announcement) setForm(announcement)
  }, [announcement])

  const set = (key: keyof Announcement) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateAnnouncement(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { alert('Gagal menyimpan.') }
    finally { setSaving(false) }
  }

  return (
    <div className="p-6 md:p-10 max-w-xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-ink">Pengumuman Banner</h1>
        <p className="text-ink-4 text-[13px] mt-1">
          Teks ini tampil sebagai banner kuning di bagian atas halaman beranda.
        </p>
      </div>

      {/* Preview */}
      {form.teks && (
        <div className="bg-yellow border border-border px-5 py-2.5 flex items-center gap-4 mb-6">
          <span className="text-[10px] font-bold tracking-widest uppercase text-ink/60 bg-ink/10 px-2 py-0.5 flex-shrink-0">
            Info
          </span>
          <span className="text-[13px] text-ink font-medium flex-1">{form.teks}</span>
          {form.link && (
            <span className="text-[13px] font-semibold text-ink flex-shrink-0">
              {form.linkLabel ?? 'Lihat detail'} →
            </span>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 border border-border p-6">
        <div>
          <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
            Teks Pengumuman
          </label>
          <textarea className={`${INPUT} resize-y`} value={form.teks} onChange={set('teks')} rows={3}
            placeholder="Contoh: PPDB 2026/2027 dibuka mulai 1 September. Daftar sekarang!" />
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
            Link (opsional)
          </label>
          <input className={INPUT} value={form.link ?? ''} onChange={set('link')}
            placeholder="https://... atau # jika tidak ada" />
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
            Label Tombol Link
          </label>
          <input className={INPUT} value={form.linkLabel ?? ''} onChange={set('linkLabel')}
            placeholder="Lihat detail" />
        </div>

        <div className="flex items-center gap-3 pt-1 border-t border-border">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.aktif}
              onChange={e => setForm(p => ({ ...p, aktif: e.target.checked }))}
              className="w-4 h-4 accent-ink" />
            <span className="text-[13px] font-medium text-ink">Tampilkan banner</span>
          </label>
          {!form.aktif && (
            <span className="text-[11px] text-ink-4">(banner disembunyikan)</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-black disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'Simpan Pengumuman'}
          </button>
          {saved && <span className="text-[13px] text-green font-medium">✓ Tersimpan!</span>}
        </div>
      </form>
    </div>
  )
}

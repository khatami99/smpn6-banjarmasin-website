import { useState, type FormEvent } from 'react'
import { useGaleri } from '../../hooks/useFirestore'
import type { GaleriItem } from '../../types'

const EMPTY: Omit<GaleriItem, 'id'> = {
  judul: '', url: '', deskripsi: '', tanggal: new Date().toISOString().split('T')[0],
}

const INPUT = "w-full border border-border px-3 py-2.5 text-[14px] text-ink focus:outline-none focus:border-ink"

export default function AdminGaleri() {
  const { galeri, loading, addGaleri, deleteGaleri } = useGaleri()
  const [mode, setMode] = useState<'list' | 'add'>('list')
  const [form, setForm] = useState<Omit<GaleriItem, 'id'>>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState('')

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(p => ({ ...p, [key]: e.target.value }))
      if (key === 'url') setPreview(e.target.value)
    }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await addGaleri(form)
      setForm(EMPTY)
      setPreview('')
      setMode('list')
    } catch { alert('Gagal menyimpan.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Hapus foto "${judul}"?`)) return
    await deleteGaleri(id)
  }

  if (mode === 'add') {
    return (
      <div className="p-6 md:p-10 max-w-2xl">
        <button onClick={() => setMode('list')}
          className="text-[12px] text-ink-4 hover:text-ink mb-6 flex items-center gap-1">
          ← Kembali
        </button>
        <h1 className="font-serif text-2xl text-ink mb-6">Tambah Foto</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Judul Foto</label>
            <input className={INPUT} value={form.judul} onChange={set('judul')} required />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
              URL Foto
            </label>
            <input className={INPUT} value={form.url} onChange={set('url')} placeholder="https://..." required />
            <div className="mt-2 bg-surface border border-border px-3 py-2.5 text-[12px] text-ink-3 space-y-1">
              <p className="font-semibold text-ink-2">Cara mendapatkan URL foto:</p>
              <p>1. Upload foto ke <a href="https://imgbb.com" target="_blank" rel="noreferrer" className="text-ink underline">ImgBB.com</a> (gratis, tanpa daftar)</p>
              <p>2. Setelah upload, klik foto → klik kanan gambar → <em>Copy image address</em></p>
              <p>3. Paste link tersebut di kolom di atas</p>
              <p className="text-ink-4">Atau gunakan <a href="https://cloudinary.com" target="_blank" rel="noreferrer" className="underline">Cloudinary</a> untuk kapasitas lebih besar.</p>
            </div>
          </div>

          {preview && (
            <div className="border border-border overflow-hidden">
              <img src={preview} alt="Preview" className="w-full max-h-60 object-cover"
                onError={() => setPreview('')} />
            </div>
          )}

          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
              Deskripsi
              <span className="ml-1 font-normal text-ink-4 normal-case tracking-normal">(opsional)</span>
            </label>
            <textarea className={`${INPUT} resize-y`} value={form.deskripsi} onChange={set('deskripsi')} rows={2} />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Tanggal</label>
            <input type="date" className={INPUT} value={form.tanggal} onChange={set('tanggal')} required />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-black disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan Foto'}
            </button>
            <button type="button" onClick={() => setMode('list')} className="btn-outline">Batal</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-ink">Kelola Galeri</h1>
          <p className="text-ink-4 text-[13px] mt-0.5">{galeri.length} foto</p>
        </div>
        <button onClick={() => setMode('add')} className="btn-black">+ Tambah Foto</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square bg-surface animate-pulse" />)}
        </div>
      ) : galeri.length === 0 ? (
        <div className="border border-border p-16 text-center">
          <p className="text-ink-4 mb-4">Belum ada foto.</p>
          <button onClick={() => setMode('add')} className="btn-black">Tambah Foto Pertama</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {galeri.map(item => (
            <div key={item.id} className="group relative aspect-square overflow-hidden bg-surface border border-border">
              <img src={item.url} alt={item.judul} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/60 transition-colors flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <p className="text-white text-[12px] font-medium px-2 text-center line-clamp-2">{item.judul}</p>
                <button
                  onClick={() => handleDelete(item.id!, item.judul)}
                  className="text-[11px] px-3 py-1 bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

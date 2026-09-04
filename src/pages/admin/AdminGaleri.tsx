import { useState, type FormEvent } from 'react'
import ImageUrlField from '../../components/ImageUrlField'
import SafeImage from '../../components/SafeImage'
import { useGaleri } from '../../hooks/useFirestore'
import type { GaleriItem } from '../../types'

const EMPTY: Omit<GaleriItem, 'id'> = {
  judul: '', url: '', deskripsi: '', tanggal: new Date().toISOString().split('T')[0],
}

const INPUT = "w-full border border-border px-3 py-2.5 text-[14px] text-ink focus:outline-none focus:border-ink"

export default function AdminGaleri() {
  const { galeri, loading, addGaleri, updateGaleri, deleteGaleri } = useGaleri()
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list')
  const [form, setForm] = useState<Omit<GaleriItem, 'id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [urlValid, setUrlValid] = useState(false)

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }))

  const openAdd = () => {
    setForm(EMPTY); setEditId(null); setUrlValid(false); setMode('add')
  }

  const openEdit = (item: GaleriItem) => {
    setForm({ judul: item.judul, url: item.url, deskripsi: item.deskripsi ?? '', tanggal: item.tanggal })
    setEditId(item.id!); setUrlValid(true); setMode('edit')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (mode === 'edit' && editId) await updateGaleri(editId, form)
      else await addGaleri(form)
      setForm(EMPTY)
      setMode('list')
    } catch { alert('Gagal menyimpan.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Hapus foto "${judul}"?`)) return
    await deleteGaleri(id)
  }

  if (mode !== 'list') {
    return (
      <div className="p-6 md:p-10 max-w-2xl">
        <button onClick={() => setMode('list')}
          className="text-[12px] text-ink-4 hover:text-ink mb-6 flex items-center gap-1">
          ← Kembali
        </button>
        <h1 className="font-serif text-2xl text-ink mb-6">
          {mode === 'add' ? 'Tambah Foto' : 'Edit Foto'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
              Judul Foto
            </label>
            <input className={INPUT} value={form.judul} onChange={set('judul')} required
              placeholder="Contoh: Upacara Hari Kemerdekaan 2026" />
          </div>

          <ImageUrlField
            label="URL Foto"
            required
            value={form.url}
            onChange={url => setForm(p => ({ ...p, url }))}
            onValidChange={setUrlValid}
          />

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
            <button type="submit" disabled={saving || !urlValid} className="btn-black disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan Foto'}
            </button>
            <button type="button" onClick={() => setMode('list')} className="btn-outline">Batal</button>
            {!urlValid && (
              <span className="text-[12px] text-ink-4">Masukkan URL foto yang valid dulu</span>
            )}
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
        <button onClick={openAdd} className="btn-black">+ Tambah Foto</button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square bg-surface animate-pulse" />)}
        </div>
      ) : galeri.length === 0 ? (
        <div className="border border-border p-16 text-center">
          <p className="text-ink-4 mb-4">Belum ada foto.</p>
          <button onClick={openAdd} className="btn-black">Tambah Foto Pertama</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {galeri.map(item => (
            <div key={item.id} className="group relative aspect-square overflow-hidden bg-surface border border-border">
              <SafeImage src={item.url} alt={item.judul} className="w-full h-full object-cover"
                fallbackLabel="URL foto rusak" />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/70 transition-colors flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <p className="text-white text-[12px] font-medium px-2 text-center line-clamp-2">{item.judul}</p>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(item)}
                    className="text-[11px] px-3 py-1 bg-white text-ink hover:bg-surface transition-colors">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id!, item.judul)}
                    className="text-[11px] px-3 py-1 bg-red-500 text-white hover:bg-red-600 transition-colors">
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

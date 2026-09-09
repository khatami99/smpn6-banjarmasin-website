import { useState, type FormEvent } from 'react'
import { useEkskul } from '../../hooks/useFirestore'
import { kapitalJudul, kapitalNama } from '../../lib/teks'
import type { Ekskul } from '../../types'

const EMPTY: Omit<Ekskul, 'id'> = {
  nama: '', deskripsi: '', jadwal: '', pembina: '', emoji: '⭐',
  kategori: 'Lainnya', aktif: true,
}

const KAT_LIST = ['Olahraga', 'Seni', 'Akademik', 'Pramuka', 'Lainnya'] as const
const INPUT = "w-full border border-border px-3 py-2.5 text-[14px] text-ink focus:outline-none focus:border-ink"

export default function AdminEkskul() {
  const { ekskul, loading, addEkskul, updateEkskul, deleteEkskul } = useEkskul(false)
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list')
  const [form, setForm] = useState<Omit<Ekskul, 'id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }))

  const openAdd = () => { setForm(EMPTY); setEditId(null); setMode('add') }
  const openEdit = (e: Ekskul) => {
    setForm({ nama: e.nama, deskripsi: e.deskripsi, jadwal: e.jadwal,
      pembina: e.pembina, emoji: e.emoji, kategori: e.kategori, aktif: e.aktif })
    setEditId(e.id!)
    setMode('edit')
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setSaving(true)
    // Pengaman: tombol simpan bisa ditekan tanpa keluar dari kolom dulu
    const data = { ...form, nama: kapitalJudul(form.nama), pembina: kapitalNama(form.pembina) }
    try {
      if (mode === 'add') await addEkskul(data)
      else if (editId) await updateEkskul(editId, data)
      setMode('list')
    } catch { alert('Gagal menyimpan.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus ekskul "${nama}"?`)) return
    await deleteEkskul(id)
  }

  const toggleAktif = async (e: Ekskul) => {
    await updateEkskul(e.id!, { aktif: !e.aktif })
  }

  if (mode !== 'list') {
    return (
      <div className="p-6 md:p-10 max-w-xl">
        <button onClick={() => setMode('list')} className="text-[12px] text-ink-4 hover:text-ink mb-6">
          ← Kembali
        </button>
        <h1 className="font-serif text-2xl text-ink mb-6">
          {mode === 'add' ? 'Tambah Ekskul' : 'Edit Ekskul'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Emoji</label>
              <input className={INPUT} value={form.emoji} onChange={set('emoji')} maxLength={4} />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Nama Ekskul</label>
              <input className={INPUT} value={form.nama} onChange={set('nama')} required autoCapitalize="words"
                onBlur={() => setForm(p => ({ ...p, nama: kapitalJudul(p.nama) }))} />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Kategori</label>
            <select className={INPUT} value={form.kategori}
              onChange={e => setForm(p => ({ ...p, kategori: e.target.value as Ekskul['kategori'] }))}>
              {KAT_LIST.map(k => <option key={k}>{k}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Deskripsi Singkat</label>
            <textarea className={`${INPUT} resize-y`} value={form.deskripsi} onChange={set('deskripsi')} rows={2} />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Jadwal Latihan</label>
            <input className={INPUT} value={form.jadwal} onChange={set('jadwal')}
              placeholder="Contoh: Selasa & Kamis, 14.00–16.00" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Nama Pembina</label>
            <input className={INPUT} value={form.pembina} onChange={set('pembina')} autoCapitalize="words"
              onBlur={() => setForm(p => ({ ...p, pembina: kapitalNama(p.pembina) }))} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input type="checkbox" checked={form.aktif}
              onChange={e => setForm(p => ({ ...p, aktif: e.target.checked }))} className="w-4 h-4 accent-ink" />
            <span className="text-[13px] font-medium text-ink">Ekskul aktif</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-black disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan'}
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
          <h1 className="font-serif text-2xl text-ink">Kelola Ekskul</h1>
          <p className="text-ink-4 text-[13px] mt-0.5">{ekskul.length} ekskul terdaftar</p>
        </div>
        <button onClick={openAdd} className="btn-black">+ Tambah Ekskul</button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 bg-surface animate-pulse" />)}
        </div>
      ) : ekskul.length === 0 ? (
        <div className="border border-border p-10 text-center">
          <p className="text-ink-4 mb-4">Belum ada data ekskul.</p>
          <button onClick={openAdd} className="btn-black">Tambah Ekskul</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {ekskul.map(e => (
            <div key={e.id}
              className={`border p-4 flex gap-3 ${e.aktif ? 'border-border' : 'border-border opacity-50'}`}>
              <span className="text-2xl flex-shrink-0">{e.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-ink">{e.nama}</span>
                  <span className="text-[10px] bg-surface text-ink-3 px-1.5 py-0.5">{e.kategori}</span>
                  {!e.aktif && <span className="text-[10px] bg-ink text-white px-1.5 py-0.5">Nonaktif</span>}
                </div>
                <div className="text-[12px] text-ink-4 mt-0.5">{e.jadwal} · {e.pembina}</div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => toggleAktif(e)}
                  className="text-[11px] px-2 py-1 border border-border hover:border-ink text-ink-3 hover:text-ink">
                  {e.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button onClick={() => openEdit(e)}
                  className="text-[11px] px-2 py-1 border border-border hover:border-ink text-ink-3 hover:text-ink">
                  Edit
                </button>
                <button onClick={() => handleDelete(e.id!, e.nama)}
                  className="text-[11px] px-2 py-1 border border-red-200 text-red-500 hover:bg-red-50">
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

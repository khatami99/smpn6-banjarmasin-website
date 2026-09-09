import { useState, type FormEvent } from 'react'
import ImageUrlField from '../../components/ImageUrlField'
import { usePrestasi } from '../../hooks/useFirestore'
import { kapitalJudul, kapitalNama } from '../../lib/teks'
import type { Prestasi } from '../../types'

const EMPTY: Omit<Prestasi, 'id'> = {
  judul: '', pemenang: '', kelas: '', tingkat: 'Kota',
  tahun: new Date().getFullYear(), bidang: '', peringkat: '', foto: '',
}

const TINGKAT_LIST = ['Sekolah', 'Kota', 'Provinsi', 'Nasional', 'Internasional'] as const
const BIDANG_LIST = ['Akademik', 'Olahraga', 'Seni', 'Pramuka', 'Lainnya']
const INPUT = "w-full border border-border px-3 py-2.5 text-[14px] text-ink focus:outline-none focus:border-ink"

const TINGKAT_STYLE: Record<string, string> = {
  Internasional: 'bg-yellow text-ink', Nasional: 'bg-ink text-yellow',
  Provinsi: 'bg-ink text-white', Kota: 'bg-surface text-ink border border-border',
  Sekolah: 'bg-off-white text-ink-3 border border-border',
}

export default function AdminPrestasi() {
  const { prestasi, loading, addPrestasi, updatePrestasi, deletePrestasi } = usePrestasi()
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list')
  const [form, setForm] = useState<Omit<Prestasi, 'id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [fotoValid, setFotoValid] = useState(true)

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [key]: key === 'tahun' ? Number(e.target.value) : e.target.value }))

  const openAdd = () => { setForm(EMPTY); setEditId(null); setFotoValid(true); setMode('add') }
  const openEdit = (p: Prestasi) => {
    setForm({ judul: p.judul, pemenang: p.pemenang, kelas: p.kelas,
      tingkat: p.tingkat, tahun: p.tahun, bidang: p.bidang, peringkat: p.peringkat, foto: p.foto ?? '' })
    setEditId(p.id!)
    setFotoValid(true)
    setMode('edit')
  }

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    setSaving(true)
    // Pengaman: tombol simpan bisa ditekan tanpa keluar dari kolom dulu
    const data = {
      ...form,
      judul: kapitalJudul(form.judul),
      peringkat: kapitalJudul(form.peringkat),
      pemenang: kapitalNama(form.pemenang),
    }
    try {
      if (mode === 'add') await addPrestasi(data)
      else if (editId) await updatePrestasi(editId, data)
      setMode('list')
    } catch { alert('Gagal menyimpan.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Hapus prestasi "${judul}"?`)) return
    await deletePrestasi(id)
  }

  if (mode !== 'list') {
    return (
      <div className="p-6 md:p-10 max-w-xl">
        <button onClick={() => setMode('list')} className="text-[12px] text-ink-4 hover:text-ink mb-6">
          ← Kembali
        </button>
        <h1 className="font-serif text-2xl text-ink mb-6">
          {mode === 'add' ? 'Tambah Prestasi' : 'Edit Prestasi'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Nama Prestasi / Penghargaan</label>
            <input className={INPUT} value={form.judul} onChange={set('judul')} required autoCapitalize="words"
              onBlur={() => setForm(p => ({ ...p, judul: kapitalJudul(p.judul) }))}
              placeholder="Contoh: Juara 1 OSN Matematika" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Tingkat</label>
              <select className={INPUT} value={form.tingkat}
                onChange={e => setForm(p => ({ ...p, tingkat: e.target.value as Prestasi['tingkat'] }))}>
                {TINGKAT_LIST.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Tahun</label>
              <input type="number" className={INPUT} value={form.tahun} onChange={set('tahun')}
                min="2000" max="2099" required />
            </div>
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Peringkat / Kategori</label>
            <input className={INPUT} value={form.peringkat} onChange={set('peringkat')} autoCapitalize="words"
              onBlur={() => setForm(p => ({ ...p, peringkat: kapitalJudul(p.peringkat) }))}
              placeholder="Contoh: Juara 1 / Medali Emas / Finalis" />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Nama Pemenang / Tim</label>
            <input className={INPUT} value={form.pemenang} onChange={set('pemenang')} required autoCapitalize="words"
              onBlur={() => setForm(p => ({ ...p, pemenang: kapitalNama(p.pemenang) }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Kelas (opsional)</label>
              <input className={INPUT} value={form.kelas} onChange={set('kelas')}
                placeholder="Contoh: IX-A atau -" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Bidang</label>
              <select className={INPUT} value={form.bidang}
                onChange={e => setForm(p => ({ ...p, bidang: e.target.value }))}>
                <option value="">-- Pilih --</option>
                {BIDANG_LIST.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
          </div>
          <ImageUrlField
            label="Foto Prestasi"
            value={form.foto ?? ''}
            onChange={url => setForm(p => ({ ...p, foto: url }))}
            onValidChange={setFotoValid}
          />

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving || !fotoValid} className="btn-black disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan Prestasi'}
            </button>
            <button type="button" onClick={() => setMode('list')} className="btn-outline">Batal</button>
            {!fotoValid && (
              <span className="text-[12px] text-red-600">Perbaiki URL foto dulu</span>
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
          <h1 className="font-serif text-2xl text-ink">Kelola Prestasi</h1>
          <p className="text-ink-4 text-[13px] mt-0.5">{prestasi.length} total prestasi</p>
        </div>
        <button onClick={openAdd} className="btn-black">+ Tambah Prestasi</button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-surface animate-pulse" />)}
        </div>
      ) : prestasi.length === 0 ? (
        <div className="border border-border p-10 text-center">
          <p className="text-ink-4 mb-4">Belum ada data prestasi.</p>
          <button onClick={openAdd} className="btn-black">Tambah Prestasi</button>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {prestasi.map(p => (
            <div key={p.id} className="flex items-start gap-4 p-4 hover:bg-off-white">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 ${TINGKAT_STYLE[p.tingkat]}`}>
                    {p.tingkat}
                  </span>
                  <span className="text-[11px] text-ink-4">{p.tahun} · {p.peringkat}</span>
                  <span className="text-[10px] bg-surface text-ink-3 px-1.5 py-0.5">{p.bidang}</span>
                </div>
                <div className="text-[14px] font-semibold text-ink">{p.judul}</div>
                <div className="text-[12px] text-ink-4">{p.pemenang}{p.kelas && p.kelas !== '-' ? ` · Kelas ${p.kelas}` : ''}</div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => openEdit(p)}
                  className="text-[12px] px-2.5 py-1 border border-border hover:border-ink text-ink-3 hover:text-ink">
                  Edit
                </button>
                <button onClick={() => handleDelete(p.id!, p.judul)}
                  className="text-[12px] px-2.5 py-1 border border-red-200 text-red-500 hover:bg-red-50">
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

import { useState, type FormEvent } from 'react'
import RichEditor from '../../components/RichEditor'
import ImageUrlField from '../../components/ImageUrlField'
import Paginasi from '../../components/Paginasi'
import { usePaginasi } from '../../hooks/usePaginasi'
import { useNews } from '../../hooks/useFirestore'
import { kapitalJudul, kapitalNama } from '../../lib/teks'
import type { NewsItem } from '../../types'

const EMPTY: Omit<NewsItem, 'id'> = {
  judul: '', isi: '', ringkasan: '', kategori: 'Kegiatan',
  tanggal: new Date().toISOString().split('T')[0], penulis: '', published: false, foto: '',
}

const BERITA_PER_HALAMAN = 15

const KATEGORI_LIST = ['Kegiatan', 'Prestasi', 'Akademik', 'PPDB', 'Pengumuman'] as const
const INPUT = "w-full border border-border px-3 py-2.5 text-[14px] text-ink focus:outline-none focus:border-ink"
const TEXTAREA = `${INPUT} resize-y`

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const KAT_COLOR: Record<string, string> = {
  Kegiatan: 'bg-blue-50 text-blue-700', Prestasi: 'bg-green/10 text-green',
  Akademik: 'bg-yellow-bg text-ink-2', PPDB: 'bg-ink/5 text-ink-2', Pengumuman: 'bg-surface text-ink-3',
}

export default function AdminBerita() {
  const { news, loading, addNews, updateNews, deleteNews } = useNews(false)
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list')
  const [form, setForm] = useState<Omit<NewsItem, 'id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [fotoValid, setFotoValid] = useState(true)
  const pg = usePaginasi(news, BERITA_PER_HALAMAN)

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }))

  const openAdd = () => { setForm(EMPTY); setEditId(null); setFotoValid(true); setMode('add') }
  const openEdit = (n: NewsItem) => {
    setForm({ judul: n.judul, isi: n.isi, ringkasan: n.ringkasan, kategori: n.kategori,
      tanggal: n.tanggal, penulis: n.penulis, published: n.published, foto: n.foto ?? '' })
    setEditId(n.id!)
    setFotoValid(true)
    setMode('edit')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // Pengaman: tombol simpan bisa ditekan tanpa keluar dari kolom dulu
    const data = { ...form, judul: kapitalJudul(form.judul), penulis: kapitalNama(form.penulis) }
    try {
      if (mode === 'add') await addNews(data)
      else if (editId) await updateNews(editId, data)
      setMode('list')
    } catch { alert('Gagal menyimpan.') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Hapus berita "${judul}"?`)) return
    await deleteNews(id)
  }

  const togglePublish = async (item: NewsItem) => {
    await updateNews(item.id!, { published: !item.published })
  }

  if (mode !== 'list') {
    return (
      <div className="p-6 md:p-10 max-w-2xl">
        <button onClick={() => setMode('list')}
          className="text-[12px] text-ink-4 hover:text-ink mb-6 flex items-center gap-1">
          ← Kembali
        </button>
        <h1 className="font-serif text-2xl text-ink mb-6">
          {mode === 'add' ? 'Tambah Berita Baru' : 'Edit Berita'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Judul</label>
            <input className={INPUT} value={form.judul} onChange={set('judul')} required autoCapitalize="words"
              onBlur={() => setForm(p => ({ ...p, judul: kapitalJudul(p.judul) }))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Kategori</label>
              <select className={INPUT} value={form.kategori}
                onChange={e => setForm(p => ({ ...p, kategori: e.target.value as NewsItem['kategori'] }))}>
                {KATEGORI_LIST.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Tanggal</label>
              <input type="date" className={INPUT} value={form.tanggal} onChange={set('tanggal')} required />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">Penulis</label>
            <input className={INPUT} value={form.penulis} onChange={set('penulis')} placeholder="Tim Humas" autoCapitalize="words"
              onBlur={() => setForm(p => ({ ...p, penulis: kapitalNama(p.penulis) }))} />
          </div>

          <ImageUrlField
            label="Foto Berita"
            value={form.foto ?? ''}
            onChange={url => setForm(p => ({ ...p, foto: url }))}
            onValidChange={setFotoValid}
          />

          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
              Ringkasan
              <span className="ml-1 font-normal text-ink-4 normal-case tracking-normal">(tampil di daftar berita)</span>
            </label>
            <textarea className={TEXTAREA} value={form.ringkasan} onChange={set('ringkasan')} rows={2} required />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
              Isi Berita
            </label>
            <RichEditor value={form.isi} onChange={html => setForm(p => ({ ...p, isi: html }))} />
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published}
                onChange={e => setForm(p => ({ ...p, published: e.target.checked }))}
                className="w-4 h-4 accent-ink" />
              <span className="text-[13px] font-medium text-ink">Publikasikan sekarang</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving || !fotoValid} className="btn-black disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan Berita'}
            </button>
            <button type="button" onClick={() => setMode('list')}
              className="btn-outline">Batal</button>
            {!fotoValid && (
              <span className="text-[12px] text-red-600">Perbaiki URL foto dulu</span>
            )}
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10" ref={pg.anchor}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-ink">Kelola Berita</h1>
          <p className="text-ink-4 text-[13px] mt-0.5">{news.length} total berita</p>
        </div>
        <button onClick={openAdd} className="btn-black">+ Tambah Berita</button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-surface animate-pulse" />)}
        </div>
      ) : news.length === 0 ? (
        <div className="border border-border p-10 text-center">
          <p className="text-ink-4 mb-4">Belum ada berita.</p>
          <button onClick={openAdd} className="btn-black">Tambah Berita Pertama</button>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {pg.tampil.map(n => (
            <div key={n.id} className="flex items-start gap-4 p-4 hover:bg-off-white transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 ${KAT_COLOR[n.kategori]}`}>
                    {n.kategori}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 font-semibold
                    ${n.published ? 'bg-green/10 text-green' : 'bg-surface text-ink-4'}`}>
                    {n.published ? 'Dipublikasi' : 'Draft'}
                  </span>
                </div>
                <div className="text-[14px] font-semibold text-ink truncate">{n.judul}</div>
                <div className="text-[12px] text-ink-4">{formatDate(n.tanggal)} · {n.penulis}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePublish(n)}
                  className="text-[12px] px-2.5 py-1 border border-border hover:border-ink text-ink-3 hover:text-ink transition-colors">
                  {n.published ? 'Jadikan Draft' : 'Publikasi'}
                </button>
                <button onClick={() => openEdit(n)}
                  className="text-[12px] px-2.5 py-1 border border-border hover:border-ink text-ink-3 hover:text-ink transition-colors">
                  Edit
                </button>
                <button onClick={() => handleDelete(n.id!, n.judul)}
                  className="text-[12px] px-2.5 py-1 border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Paginasi
        halaman={pg.halaman}
        totalHalaman={pg.totalHalaman}
        onGanti={pg.gantiHalaman}
        totalItem={pg.total}
        onTampilkanSemua={pg.tampilkanSemua}
      />
    </div>
  )
}

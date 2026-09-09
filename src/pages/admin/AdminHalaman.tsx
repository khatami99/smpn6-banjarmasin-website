import { useState, type FormEvent } from 'react'
import RichEditor from '../../components/RichEditor'
import { useHalaman } from '../../hooks/useFirestore'
import { buatSlug, cekSlug } from '../../lib/slug'
import { kapitalJudul } from '../../lib/teks'
import type { HalamanKustom } from '../../types'

const EMPTY: Omit<HalamanKustom, 'id'> = {
  judul: '', slug: '', eyebrow: '', ringkasan: '', isi: '',
  tampilDiMenu: true, published: false, urutan: 100,
}

const INPUT = 'w-full border border-border px-3 py-2.5 text-[14px] text-ink focus:outline-none focus:border-ink'

export default function AdminHalaman() {
  const { halaman, loading, gagalMuat, addHalaman, updateHalaman, deleteHalaman } = useHalaman(false)
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list')
  const [form, setForm] = useState<Omit<HalamanKustom, 'id'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [slugDisentuh, setSlugDisentuh] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorSimpan, setErrorSimpan] = useState<string | null>(null)

  // Slug halaman lain, untuk mendeteksi tabrakan alamat
  const slugLain = halaman.filter(h => h.id !== editId).map(h => h.slug)
  const errorSlug = mode === 'list' ? null : cekSlug(form.slug, slugLain)

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(p => ({ ...p, [key]: e.target.value }))

  // Selama admin belum mengubah slug sendiri, ikutkan otomatis dari judul
  const setJudul = (e: React.ChangeEvent<HTMLInputElement>) => {
    const judul = e.target.value
    setForm(p => ({ ...p, judul, slug: slugDisentuh ? p.slug : buatSlug(judul) }))
  }

  const openAdd = () => {
    const urutanBaru = halaman.length ? Math.max(...halaman.map(h => h.urutan ?? 0)) + 1 : 100
    setForm({ ...EMPTY, urutan: urutanBaru })
    setEditId(null); setSlugDisentuh(false); setMode('add')
  }

  const openEdit = (h: HalamanKustom) => {
    setForm({
      judul: h.judul, slug: h.slug, eyebrow: h.eyebrow ?? '', ringkasan: h.ringkasan ?? '',
      isi: h.isi ?? '', tampilDiMenu: h.tampilDiMenu, published: h.published, urutan: h.urutan ?? 100,
    })
    setEditId(h.id!); setSlugDisentuh(true); setMode('edit')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (errorSlug) return
    setSaving(true)
    setErrorSimpan(null)
    // Pengaman: tombol simpan bisa ditekan tanpa keluar dari kolom dulu
    const data = { ...form, judul: kapitalJudul(form.judul), eyebrow: kapitalJudul(form.eyebrow ?? '') }
    try {
      if (mode === 'edit' && editId) await updateHalaman(editId, data)
      else await addHalaman(data)
      setMode('list')
    } catch (err) {
      const kode = (err as { code?: string }).code
      setErrorSimpan(
        kode === 'permission-denied'
          ? 'IZIN_BELUM_DIPASANG'
          : `Gagal menyimpan. (${kode ?? 'kesalahan tidak dikenal'})`,
      )
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string, judul: string) => {
    if (!confirm(`Hapus halaman "${judul}"? Tindakan ini tidak bisa dibatalkan.`)) return
    await deleteHalaman(id)
  }

  const togglePublish = async (h: HalamanKustom) => {
    await updateHalaman(h.id!, { published: !h.published })
  }

  const toggleMenu = async (h: HalamanKustom) => {
    await updateHalaman(h.id!, { tampilDiMenu: !h.tampilDiMenu })
  }

  // ── Form tambah / edit ────────────────────────────────────
  if (mode !== 'list') {
    return (
      <div className="p-6 md:p-10 max-w-2xl">
        <button onClick={() => setMode('list')}
          className="text-[12px] text-ink-4 hover:text-ink mb-6 flex items-center gap-1">
          ← Kembali
        </button>
        <h1 className="font-serif text-2xl text-ink mb-1">
          {mode === 'add' ? 'Buat Halaman Baru' : 'Edit Halaman'}
        </h1>
        <p className="text-ink-4 text-[13px] mb-6">
          Halaman ini akan muncul sebagai tab baru di menu website.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
              Judul Halaman
            </label>
            <input className={INPUT} value={form.judul} onChange={setJudul} required autoCapitalize="words"
              onBlur={() => setForm(p => ({ ...p, judul: kapitalJudul(p.judul) }))}
              placeholder="Contoh: Fasilitas Sekolah" />
            <p className="text-[11px] text-ink-4 mt-1">Teks ini yang tampil di menu navigasi.</p>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
              Alamat Halaman
            </label>
            <div className="flex items-center border border-border focus-within:border-ink">
              <span className="pl-3 text-[13px] text-ink-4 select-none whitespace-nowrap">/</span>
              <input
                className="flex-1 px-1 py-2.5 text-[14px] text-ink focus:outline-none min-w-0"
                value={form.slug}
                onChange={e => { setSlugDisentuh(true); setForm(p => ({ ...p, slug: buatSlug(e.target.value) })) }}
                required
              />
            </div>
            {errorSlug
              ? <p className="text-[12px] text-red-600 mt-1">{errorSlug}</p>
              : <p className="text-[11px] text-ink-4 mt-1">Terisi otomatis dari judul. Boleh diubah.</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
                Label Kecil <span className="font-normal text-ink-4 normal-case tracking-normal">(opsional)</span>
              </label>
              <input className={INPUT} value={form.eyebrow ?? ''} onChange={set('eyebrow')} autoCapitalize="words"
                onBlur={() => setForm(p => ({ ...p, eyebrow: kapitalJudul(p.eyebrow ?? '') }))}
                placeholder="Contoh: Sarana & Prasarana" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
                Urutan di Menu
              </label>
              <input type="number" className={INPUT} value={form.urutan} min={0}
                onChange={e => setForm(p => ({ ...p, urutan: Number(e.target.value) }))} />
              <p className="text-[11px] text-ink-4 mt-1">Angka kecil tampil lebih dulu.</p>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
              Ringkasan <span className="font-normal text-ink-4 normal-case tracking-normal">(opsional)</span>
            </label>
            <textarea className={`${INPUT} resize-y`} value={form.ringkasan ?? ''} onChange={set('ringkasan')} rows={2}
              placeholder="Kalimat pendek di bawah judul halaman." />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
              Isi Halaman
            </label>
            <RichEditor value={form.isi} onChange={html => setForm(p => ({ ...p, isi: html }))} />
          </div>

          <div className="space-y-2.5 pt-3 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.published} className="w-4 h-4 accent-ink"
                onChange={e => setForm(p => ({ ...p, published: e.target.checked }))} />
              <span className="text-[13px] font-medium text-ink">Terbitkan halaman</span>
              <span className="text-[11px] text-ink-4">(kalau dimatikan, halaman jadi draft)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.tampilDiMenu} className="w-4 h-4 accent-ink"
                onChange={e => setForm(p => ({ ...p, tampilDiMenu: e.target.checked }))} />
              <span className="text-[13px] font-medium text-ink">Tampilkan sebagai tab di menu</span>
            </label>
          </div>

          {errorSimpan === 'IZIN_BELUM_DIPASANG' ? (
            <div className="border border-red-200 bg-red-50 p-4 text-[13px] text-red-800 space-y-2">
              <p className="font-semibold">Belum bisa menyimpan: izin database belum dipasang.</p>
              <p className="text-red-700">
                Koleksi <code className="font-mono">halaman</code> belum didaftarkan pada aturan
                Firestore, jadi penyimpanan ditolak server. Ini pengaturan satu kali.
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-red-700">
                <li>
                  Buka{' '}
                  <a className="underline font-medium" target="_blank" rel="noreferrer"
                    href="https://console.firebase.google.com/project/smpn6-banjarmasin/firestore/rules">
                    Firebase Console → Firestore → Rules
                  </a>
                </li>
                <li>Tempelkan blok aturan untuk <code className="font-mono">halaman</code> (lihat README)</li>
                <li>Klik <strong>Publish</strong>, lalu simpan halaman ini lagi</li>
              </ol>
            </div>
          ) : errorSimpan ? (
            <div className="border border-red-200 bg-red-50 p-3 text-[13px] text-red-700">{errorSimpan}</div>
          ) : null}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving || !!errorSlug} className="btn-black disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan Halaman'}
            </button>
            <button type="button" onClick={() => setMode('list')} className="btn-outline">Batal</button>
          </div>
        </form>
      </div>
    )
  }

  // ── Daftar halaman ────────────────────────────────────────
  return (
    <div className="p-6 md:p-10">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl text-ink">Halaman &amp; Tab</h1>
          <p className="text-ink-4 text-[13px] mt-0.5">
            Buat halaman informasi sendiri — otomatis jadi tab baru di menu website.
          </p>
        </div>
        <button onClick={openAdd} className="btn-black flex-shrink-0">+ Buat Halaman</button>
      </div>

      {gagalMuat && (
        <div className="border border-amber-300 bg-amber-50 p-4 mb-5 text-[13px] text-amber-900 flex items-start justify-between gap-4">
          <span>
            <strong>Daftar halaman gagal dimuat dari server.</strong>{' '}
            Sedang dicoba menyambung ulang otomatis — daftar di bawah mungkin belum terbaru.
          </span>
          <button onClick={() => window.location.reload()}
            className="flex-shrink-0 px-3 py-1 border border-amber-400 hover:bg-amber-100 transition-colors">
            Muat ulang
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 bg-surface animate-pulse" />)}
        </div>
      ) : halaman.length === 0 ? (
        <div className="border border-border p-10 text-center">
          <p className="text-ink-4 mb-1">Belum ada halaman tambahan.</p>
          <p className="text-ink-4 text-[13px] mb-5">
            Contoh yang biasa dibuat: Fasilitas, Struktur Organisasi, Data Guru, PPDB, Kontak.
          </p>
          <button onClick={openAdd} className="btn-black">Buat Halaman Pertama</button>
        </div>
      ) : (
        <div className="border border-border divide-y divide-border">
          {halaman.map(h => (
            <div key={h.id} className="flex items-start gap-4 p-4 hover:bg-off-white transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[10px] px-1.5 py-0.5 font-semibold
                    ${h.published ? 'bg-green/10 text-green' : 'bg-surface text-ink-4'}`}>
                    {h.published ? 'Terbit' : 'Draft'}
                  </span>
                  {h.tampilDiMenu
                    ? <span className="text-[10px] px-1.5 py-0.5 bg-yellow-bg text-ink-2 font-semibold">Di menu</span>
                    : <span className="text-[10px] px-1.5 py-0.5 bg-surface text-ink-4">Tidak di menu</span>}
                  <span className="text-[11px] text-ink-4">urutan {h.urutan}</span>
                </div>
                <div className="text-[14px] font-semibold text-ink truncate">{h.judul}</div>
                <div className="text-[12px] text-ink-4 truncate">/{h.slug}</div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                <button onClick={() => togglePublish(h)}
                  className="text-[12px] px-2.5 py-1 border border-border hover:border-ink text-ink-3 hover:text-ink transition-colors">
                  {h.published ? 'Jadikan Draft' : 'Terbitkan'}
                </button>
                <button onClick={() => toggleMenu(h)}
                  className="text-[12px] px-2.5 py-1 border border-border hover:border-ink text-ink-3 hover:text-ink transition-colors">
                  {h.tampilDiMenu ? 'Sembunyikan dari menu' : 'Tampilkan di menu'}
                </button>
                <button onClick={() => openEdit(h)}
                  className="text-[12px] px-2.5 py-1 border border-border hover:border-ink text-ink-3 hover:text-ink transition-colors">
                  Edit
                </button>
                <button onClick={() => handleDelete(h.id!, h.judul)}
                  className="text-[12px] px-2.5 py-1 border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
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

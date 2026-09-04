import { useState, useEffect, type FormEvent } from 'react'
import { useStats } from '../../hooks/useFirestore'
import type { SchoolStats } from '../../types'

export default function AdminStatistik() {
  const { stats, loading, updateStats } = useStats()
  const [form, setForm] = useState<SchoolStats>(stats)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [dirty, setDirty] = useState(false)

  // Tanpa penjaga `dirty`, snapshot realtime menimpa isian yang sedang diketik.
  useEffect(() => {
    if (!dirty) setForm(stats)
  }, [stats, dirty])

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateStats(form)
      setDirty(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      alert('Gagal menyimpan. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const FIELDS: { key: keyof SchoolStats; label: string; desc?: string; type?: string }[] = [
    { key: 'siswa', label: 'Jumlah Siswa', desc: 'Total siswa aktif saat ini', type: 'number' },
    { key: 'guru', label: 'Jumlah Guru / Pendidik', type: 'number' },
    { key: 'staf', label: 'Jumlah Tenaga Kependidikan', type: 'number' },
    { key: 'kelas', label: 'Jumlah Rombel (Kelas)', type: 'number' },
    { key: 'ekskul', label: 'Jumlah Ekstrakurikuler', type: 'number' },
    { key: 'tahunBerdiri', label: 'Tahun Berdiri', desc: 'Contoh: 1981', type: 'number' },
    { key: 'akreditasi', label: 'Akreditasi', desc: 'Contoh: A' },
  ]

  if (loading) return <div className="p-10 text-ink-4">Memuat...</div>

  return (
    <div className="p-6 md:p-10 max-w-xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-ink">Statistik Sekolah</h1>
        <p className="text-ink-4 text-[13px] mt-1">Data ini tampil di beranda dan profil sekolah.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {FIELDS.map(f => (
          <div key={f.key}>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
              {f.label}
            </label>
            {f.desc && <p className="text-[11px] text-ink-4 mb-1.5">{f.desc}</p>}
            <input
              type={f.type ?? 'text'}
              value={form[f.key]}
              min={f.type === 'number' ? 0 : undefined}
              required
              onChange={e => {
                setDirty(true)
                setForm(prev => ({
                  ...prev,
                  [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value
                }))
              }}
              className="w-full border border-border px-3 py-2.5 text-[14px] text-ink
                         focus:outline-none focus:border-ink transition-colors"
            />
          </div>
        ))}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="btn-black disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          {saved && (
            <span className="text-[13px] text-green font-medium">✓ Tersimpan!</span>
          )}
          {dirty && !saved && (
            <span className="text-[13px] text-amber-700">Ada perubahan yang belum disimpan</span>
          )}
        </div>
      </form>
    </div>
  )
}

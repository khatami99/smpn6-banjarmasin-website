import { useEffect, useRef, useState } from 'react'

/**
 * Daftar emoji dipilih yang dukungannya luas di Windows, Android, dan iOS.
 * Emoji gabungan (mis. ⛹️‍♀️) sengaja dihindari karena sering gagal tampil
 * dan berubah jadi kotak kosong di sebagian perangkat.
 */
const KELOMPOK: { nama: string; daftar: string[] }[] = [
  {
    nama: 'Olahraga',
    daftar: ['⚽', '🏀', '🏐', '🏸', '🎾', '🏓', '⚾', '🏑', '🥅', '🥋', '🥊',
      '🏊', '🏃', '🚴', '🧗', '🏋', '🤸', '🏹', '🛹', '🥇', '🏆', '🎯'],
  },
  {
    nama: 'Seni & Musik',
    daftar: ['🎨', '🖌', '🖼', '🎭', '🎵', '🎶', '🎤', '🎸', '🎹', '🥁', '🎻',
      '🎺', '🎷', '🪕', '💃', '🕺', '📸', '🎬', '🎪', '✂', '🧵'],
  },
  {
    nama: 'Akademik',
    daftar: ['🔬', '🧪', '🧫', '🧬', '🔭', '🧮', '📐', '📏', '📚', '📖', '📝',
      '✍', '💻', '🖥', '🌐', '🤖', '📊', '🧠', '🗣', '💡', '🏅'],
  },
  {
    nama: 'Pramuka & Alam',
    daftar: ['⛺', '🏕', '🧭', '🔦', '🎒', '🥾', '🗺', '🔥', '🌱', '🌳', '🌍',
      '♻', '🦅', '⚜', '🚩'],
  },
  {
    nama: 'Keagamaan',
    daftar: ['🕌', '🕋', '📿', '☪', '🤲', '📗', '🌙', '⛪', '🛐'],
  },
  {
    nama: 'Kesehatan & Sosial',
    daftar: ['⛑', '🩺', '🩹', '💊', '🚑', '❤', '🤝', '🙌', '🍎', '🥗'],
  },
  {
    nama: 'Umum',
    daftar: ['⭐', '🌟', '✨', '🎓', '🏫', '📣', '🗳', '👥', '🧑‍🍳', '🍳',
      '🚗', '🧹', '📅', '🔔', '🏳', '🇮🇩'],
  },
]

interface Props {
  value: string
  onChange: (emoji: string) => void
}

export default function EmojiPicker({ value, onChange }: Props) {
  const [buka, setBuka] = useState(false)
  const [cari, setCari] = useState('')
  const wadah = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!buka) return
    const klikLuar = (e: MouseEvent) => {
      if (wadah.current && !wadah.current.contains(e.target as Node)) setBuka(false)
    }
    const tekanEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setBuka(false) }
    document.addEventListener('mousedown', klikLuar)
    document.addEventListener('keydown', tekanEsc)
    return () => {
      document.removeEventListener('mousedown', klikLuar)
      document.removeEventListener('keydown', tekanEsc)
    }
  }, [buka])

  const kunci = cari.trim().toLowerCase()
  const kelompokTampil = kunci
    ? KELOMPOK.filter(k => k.nama.toLowerCase().includes(kunci))
    : KELOMPOK

  const pilih = (emoji: string) => {
    onChange(emoji)
    setBuka(false)
    setCari('')
  }

  return (
    <div className="relative" ref={wadah}>
      <button
        type="button"
        onClick={() => setBuka(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={buka}
        title="Pilih ikon ekskul"
        className={`w-full h-[42px] flex items-center justify-center gap-1 border transition-colors
          ${buka ? 'border-ink bg-surface' : 'border-border hover:border-ink-3'}`}
      >
        <span className="text-xl leading-none">{value || '⭐'}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`text-ink-4 transition-transform ${buka ? 'rotate-180' : ''}`}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {buka && (
        <div className="absolute left-0 top-full mt-1 w-[300px] max-h-[320px] overflow-y-auto
                        bg-white border border-border shadow-lg z-50">
          <div className="sticky top-0 bg-white border-b border-border p-2">
            <input
              autoFocus
              value={cari}
              onChange={e => setCari(e.target.value)}
              placeholder="Cari kategori: olahraga, seni…"
              className="w-full border border-border px-2.5 py-1.5 text-[13px] focus:outline-none focus:border-ink"
            />
          </div>

          {kelompokTampil.length === 0 ? (
            <p className="px-3 py-4 text-[12px] text-ink-4">Kategori tidak ditemukan.</p>
          ) : kelompokTampil.map(k => (
            <div key={k.nama} className="px-2 py-2">
              <div className="text-[10px] font-bold uppercase tracking-wide text-ink-4 px-1 mb-1.5">
                {k.nama}
              </div>
              <div className="grid grid-cols-8 gap-0.5">
                {k.daftar.map(em => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => pilih(em)}
                    title={em}
                    className={`h-8 text-lg leading-none flex items-center justify-center transition-colors
                      ${value === em ? 'bg-ink text-white' : 'hover:bg-surface'}`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="sticky bottom-0 bg-white border-t border-border p-2 flex items-center gap-2">
            <span className="text-[11px] text-ink-4 flex-shrink-0">Atau ketik:</span>
            <input
              value={value}
              onChange={e => onChange(e.target.value)}
              maxLength={4}
              className="w-14 border border-border px-2 py-1 text-center text-[15px] focus:outline-none focus:border-ink"
            />
          </div>
        </div>
      )}
    </div>
  )
}

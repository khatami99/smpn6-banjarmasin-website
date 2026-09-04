import { useEffect, useRef, useState } from 'react'

const INPUT = 'w-full border px-3 py-2.5 text-[14px] text-ink focus:outline-none transition-colors'

type Status = 'idle' | 'checking' | 'ok' | 'error'

/** Coba muat URL sebagai gambar. Resolve false kalau gagal / lewat 10 detik. */
function checkImage(url: string): Promise<{ ok: boolean; w: number; h: number }> {
  return new Promise(resolve => {
    const img = new Image()
    let settled = false
    const finish = (ok: boolean, w = 0, h = 0) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      resolve({ ok, w, h })
    }
    const timer = setTimeout(() => finish(false), 10000)
    img.onload = () => finish(true, img.naturalWidth, img.naturalHeight)
    img.onerror = () => finish(false)
    img.src = url
  })
}

interface Props {
  value: string
  onChange: (url: string) => void
  /** Dipanggil tiap status berubah: true kalau URL boleh disimpan */
  onValidChange?: (valid: boolean) => void
  label?: string
  required?: boolean
}

/**
 * Input URL gambar dengan pengecekan langsung: memuat gambarnya di latar
 * belakang lalu menampilkan pratinjau, ukuran, atau pesan error.
 */
export default function ImageUrlField({
  value, onChange, onValidChange, label = 'URL Foto', required = false,
}: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)

  // simpan callback di ref supaya tidak memicu ulang effect pengecekan
  const notify = useRef(onValidChange)
  useEffect(() => { notify.current = onValidChange })

  // token untuk membuang hasil pengecekan yang sudah basi
  const runId = useRef(0)

  useEffect(() => {
    const url = value.trim()
    const id = ++runId.current

    if (!url) {
      setStatus('idle')
      setDims(null)
      notify.current?.(!required)
      return
    }

    setStatus('checking')
    notify.current?.(false)

    const t = setTimeout(async () => {
      const r = await checkImage(url)
      if (id !== runId.current) return
      setStatus(r.ok ? 'ok' : 'error')
      setDims(r.ok ? { w: r.w, h: r.h } : null)
      notify.current?.(r.ok)
    }, 600)

    return () => clearTimeout(t)
  }, [value, required])

  const borderClass =
    status === 'error' ? 'border-red-400 focus:border-red-500'
      : status === 'ok' ? 'border-green/50 focus:border-green'
        : 'border-border focus:border-ink'

  const tooSmall = dims !== null && (dims.w < 500 || dims.h < 500)

  return (
    <div>
      <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
        {label}
        {!required && (
          <span className="ml-1 font-normal text-ink-4 normal-case tracking-normal">(opsional)</span>
        )}
      </label>

      <input
        className={`${INPUT} ${borderClass}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="https://i.ibb.co.com/xxxxx/foto.jpg"
        required={required}
      />

      {/* Status */}
      {status === 'checking' && (
        <p className="mt-1.5 text-[12px] text-ink-4">Memeriksa gambar…</p>
      )}

      {status === 'error' && (
        <div className="mt-1.5 bg-red-50 border border-red-200 px-3 py-2 text-[12px] text-red-700">
          <p className="font-semibold">URL ini bukan gambar atau tidak bisa dimuat.</p>
          <p className="mt-0.5 text-red-600">
            Pastikan link berakhiran <code className="font-mono">.jpg</code>,{' '}
            <code className="font-mono">.png</code>, atau <code className="font-mono">.webp</code> —
            bukan alamat halaman web.
          </p>
        </div>
      )}

      {status === 'ok' && dims && (
        <p className={`mt-1.5 text-[12px] ${tooSmall ? 'text-ink-3' : 'text-green'}`}>
          Gambar valid · {dims.w}×{dims.h} px
          {tooSmall && (
            <span className="block text-amber-700 mt-0.5">
              Ukurannya kecil, hasilnya bisa buram. Pakai pilihan <strong>Tautan langsung</strong> di
              ImgBB (bukan &ldquo;gambar kecil&rdquo;) untuk resolusi penuh.
            </span>
          )}
        </p>
      )}

      {/* Panduan */}
      <div className="mt-2 bg-surface border border-border px-3 py-2.5 text-[12px] text-ink-3 space-y-1">
        <p className="font-semibold text-ink-2">Cara mendapatkan URL foto:</p>
        <p>
          1. Unggah foto ke{' '}
          <a href="https://imgbb.com" target="_blank" rel="noreferrer" className="text-ink underline">
            imgbb.com
          </a>{' '}
          (gratis, tanpa daftar)
        </p>
        <p>2. Setelah selesai, ubah dropdown <em>Kode sematan</em> menjadi <strong>Tautan langsung</strong></p>
        <p>3. Salin URL yang muncul lalu tempel di kolom di atas</p>
      </div>

      {/* Pratinjau */}
      {status === 'ok' && (
        <div className="mt-2 border border-border overflow-hidden bg-surface">
          <img src={value.trim()} alt="Pratinjau" className="w-full max-h-56 object-contain" />
        </div>
      )}
    </div>
  )
}

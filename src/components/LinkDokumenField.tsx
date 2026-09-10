import type { ReactNode } from 'react'

const INPUT = 'w-full border px-3 py-2.5 text-[14px] text-ink focus:outline-none transition-colors'

/**
 * Google Drive punya beberapa bentuk tautan. Yang lama (`open?id=`) dan tautan
 * hasil salin dari bilah alamat tidak selalu membuka pratinjau, jadi semuanya
 * dinormalkan ke bentuk `/file/d/<id>/view`.
 */
export function rapikanTautanDrive(url: string): string {
  const bersih = url.trim()
  if (!/drive\.google\.com/i.test(bersih)) return bersih

  const id =
    bersih.match(/\/file\/d\/([\w-]{10,})/)?.[1] ??
    bersih.match(/[?&]id=([\w-]{10,})/)?.[1]

  return id ? `https://drive.google.com/file/d/${id}/view` : bersih
}

type Status = 'kosong' | 'ok' | 'bukan-url' | 'drive-tanpa-id'

function periksa(url: string): Status {
  const bersih = url.trim()
  if (!bersih) return 'kosong'
  let alamat: URL
  try { alamat = new URL(bersih) } catch { return 'bukan-url' }
  if (!/^https?:$/.test(alamat.protocol)) return 'bukan-url'
  if (/drive\.google\.com/i.test(bersih) && !/\/file\/d\/[\w-]{10,}/.test(rapikanTautanDrive(bersih))) {
    return 'drive-tanpa-id'
  }
  return 'ok'
}

interface Props {
  value: string
  onChange: (url: string) => void
  label: string
  keterangan?: ReactNode
}

export default function LinkDokumenField({ value, onChange, label, keterangan }: Props) {
  const status = periksa(value)

  const warnaBatas =
    status === 'ok' ? 'border-green/50 focus:border-green'
      : status === 'kosong' ? 'border-border focus:border-ink'
        : 'border-red-400 focus:border-red-500'

  return (
    <div>
      <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
        {label}
        <span className="ml-1 font-normal text-ink-4 normal-case tracking-normal">(opsional)</span>
      </label>

      <input
        className={`${INPUT} ${warnaBatas}`}
        value={value}
        placeholder="https://drive.google.com/file/d/..."
        onChange={e => onChange(e.target.value)}
        onBlur={e => onChange(rapikanTautanDrive(e.target.value))}
      />

      {status === 'bukan-url' && (
        <p className="mt-1.5 text-[12px] text-red-600">
          Ini belum berupa alamat web. Tautan harus diawali <code className="font-mono">https://</code>.
        </p>
      )}
      {status === 'drive-tanpa-id' && (
        <p className="mt-1.5 text-[12px] text-red-600">
          Tautan Google Drive ini tidak memuat kode berkas. Pakai tombol <em>Bagikan → Salin link</em>,
          bukan menyalin dari bilah alamat.
        </p>
      )}
      {status === 'ok' && (
        <p className="mt-1.5 text-[12px] text-green">
          Tautan siap dipakai.{' '}
          <a href={value.trim()} target="_blank" rel="noreferrer" className="underline font-medium">
            Coba buka di tab baru →
          </a>
        </p>
      )}
      {status === 'kosong' && (
        <p className="mt-1.5 text-[11px] text-ink-4">
          Dikosongkan berarti tombol unduhnya tidak ditampilkan di website.
        </p>
      )}

      <div className="mt-2 bg-surface border border-border px-3 py-2.5 text-[12px] text-ink-3 space-y-1">
        <p className="font-semibold text-ink-2">Cara mengunggah berkas PDF:</p>
        <p>1. Buka <a href="https://drive.google.com" target="_blank" rel="noreferrer" className="text-ink underline">Google Drive</a>, unggah berkas PDF-nya</p>
        <p>2. Klik kanan berkas → <strong>Bagikan</strong></p>
        <p>
          3. Pada bagian Akses umum, ubah <em>Dibatasi</em> menjadi{' '}
          <strong>Siapa saja yang memiliki link</strong>
          <span className="block text-red-600">
            Langkah ini wajib. Kalau dilewati, pengunjung akan melihat pesan &ldquo;Anda perlu akses&rdquo;.
          </span>
        </p>
        <p>4. Klik <strong>Salin link</strong>, lalu tempel di kolom di atas</p>
        {keterangan}
      </div>
    </div>
  )
}

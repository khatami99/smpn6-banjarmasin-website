import { useState, type ImgHTMLAttributes } from 'react'

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  /** Teks kecil di bawah ikon saat gambar gagal dimuat */
  fallbackLabel?: string
}

/**
 * Gambar yang tidak pernah menampilkan ikon "broken image" bawaan browser.
 * Kalau URL kosong atau gagal dimuat, diganti placeholder abu-abu.
 */
export default function SafeImage({
  src, alt = '', className = '', fallbackLabel = 'Gambar tidak tersedia', ...rest
}: Props) {
  // Simpan URL yang gagal, bukan boolean — begitu src berganti, gambar baru
  // otomatis dapat kesempatan dimuat tanpa perlu effect reset.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const failed = failedSrc !== null && failedSrc === src

  if (!src || failed) {
    return (
      <div className={`flex flex-col items-center justify-center gap-1.5 bg-surface text-ink-4 ${className}`}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="1" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-4.5-4.5L3 21" />
        </svg>
        <span className="text-[10px] px-2 text-center leading-tight">{fallbackLabel}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
      {...rest}
    />
  )
}

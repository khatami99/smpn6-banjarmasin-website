interface Props {
  halaman: number
  totalHalaman: number
  onGanti: (halaman: number) => void
  /** Ditampilkan sebagai tombol "Tampilkan semua (N)" bila diisi */
  totalItem?: number
  onTampilkanSemua?: () => void
}

/**
 * Membuat deret nomor halaman yang ringkas: halaman pertama, terakhir,
 * dan tetangga halaman aktif. Sisanya diringkas menjadi elipsis.
 */
function deretHalaman(aktif: number, total: number): (number | 'elipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const hasil: (number | 'elipsis')[] = [1]
  const mulai = Math.max(2, aktif - 1)
  const selesai = Math.min(total - 1, aktif + 1)

  if (mulai > 2) hasil.push('elipsis')
  for (let i = mulai; i <= selesai; i++) hasil.push(i)
  if (selesai < total - 1) hasil.push('elipsis')

  hasil.push(total)
  return hasil
}

const TOMBOL = 'min-w-[34px] h-[34px] px-2 text-[13px] border transition-colors'

export default function Paginasi({
  halaman, totalHalaman, onGanti, totalItem, onTampilkanSemua,
}: Props) {
  if (totalHalaman <= 1) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
      <nav className="flex flex-wrap items-center gap-1.5" aria-label="Navigasi halaman">
        <button
          onClick={() => onGanti(halaman - 1)}
          disabled={halaman === 1}
          className={`${TOMBOL} border-border text-ink-3 hover:border-ink hover:text-ink
                      disabled:opacity-40 disabled:hover:border-border disabled:hover:text-ink-3`}
          aria-label="Halaman sebelumnya"
        >
          ←
        </button>

        {deretHalaman(halaman, totalHalaman).map((n, i) =>
          n === 'elipsis' ? (
            <span key={`e${i}`} className="px-1 text-[13px] text-ink-4 select-none">…</span>
          ) : (
            <button
              key={n}
              onClick={() => onGanti(n)}
              aria-current={n === halaman ? 'page' : undefined}
              className={`${TOMBOL} ${n === halaman
                ? 'bg-ink text-white border-ink font-semibold'
                : 'border-border text-ink-3 hover:border-ink hover:text-ink'}`}
            >
              {n}
            </button>
          ),
        )}

        <button
          onClick={() => onGanti(halaman + 1)}
          disabled={halaman === totalHalaman}
          className={`${TOMBOL} border-border text-ink-3 hover:border-ink hover:text-ink
                      disabled:opacity-40 disabled:hover:border-border disabled:hover:text-ink-3`}
          aria-label="Halaman berikutnya"
        >
          →
        </button>
      </nav>

      {onTampilkanSemua && totalItem !== undefined && (
        <button onClick={onTampilkanSemua}
          className="text-[13px] font-semibold text-ink-3 hover:text-ink hover:underline">
          Tampilkan semua ({totalItem}) →
        </button>
      )}
    </div>
  )
}

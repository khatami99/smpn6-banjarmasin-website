import { useState, type FormEvent, type ReactNode } from 'react'
import { useAuth, pesanGalatAuth } from '../../hooks/useAuth'

const INPUT = 'w-full border border-border px-3 py-2.5 text-[14px] text-ink focus:outline-none focus:border-ink'
const PANJANG_MIN = 8

function Kotak({ judul, desc, children }: { judul: string; desc: string; children: ReactNode }) {
  return (
    <div className="border border-border p-5 md:p-6 space-y-4">
      <div className="border-b border-border pb-3">
        <div className="text-[11px] font-bold tracking-widest uppercase text-ink-4">{judul}</div>
        <p className="text-[12px] text-ink-4 mt-1">{desc}</p>
      </div>
      {children}
    </div>
  )
}

function Label({ children }: { children: ReactNode }) {
  return (
    <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
      {children}
    </label>
  )
}

function Pesan({ jenis, teks }: { jenis: 'sukses' | 'galat' | 'info'; teks: string }) {
  const gaya = {
    sukses: 'border-green/40 bg-green/5 text-green',
    galat: 'border-red-200 bg-red-50 text-red-700',
    info: 'border-amber-300 bg-amber-50 text-amber-900',
  }[jenis]
  return <div className={`border px-3 py-2.5 text-[13px] ${gaya}`}>{teks}</div>
}

export default function AdminAkun() {
  const { user, gantiEmail, gantiPassword } = useAuth()

  // ── Ganti email ──
  const [emailBaru, setEmailBaru] = useState('')
  const [sandiEmail, setSandiEmail] = useState('')
  const [prosesEmail, setProsesEmail] = useState(false)
  const [hasilEmail, setHasilEmail] = useState<{ jenis: 'sukses' | 'galat' | 'info'; teks: string } | null>(null)

  // ── Ganti password ──
  const [sandiLama, setSandiLama] = useState('')
  const [sandiBaru, setSandiBaru] = useState('')
  const [sandiUlang, setSandiUlang] = useState('')
  const [prosesSandi, setProsesSandi] = useState(false)
  const [hasilSandi, setHasilSandi] = useState<{ jenis: 'sukses' | 'galat' | 'info'; teks: string } | null>(null)

  const kirimEmail = async (e: FormEvent) => {
    e.preventDefault()
    setHasilEmail(null)

    if (emailBaru.trim().toLowerCase() === (user?.email ?? '').toLowerCase()) {
      setHasilEmail({ jenis: 'galat', teks: 'Email baru sama dengan email sekarang.' })
      return
    }

    setProsesEmail(true)
    try {
      const hasil = await gantiEmail(sandiEmail, emailBaru.trim())
      setSandiEmail('')
      if (hasil === 'langsung') {
        setHasilEmail({ jenis: 'sukses', teks: `Email berhasil diganti menjadi ${emailBaru.trim()}. Pakai email ini untuk masuk berikutnya.` })
        setEmailBaru('')
      } else {
        setHasilEmail({
          jenis: 'info',
          teks: `Tautan konfirmasi dikirim ke ${emailBaru.trim()}. Buka email tersebut dan klik tautannya — email baru baru aktif setelah dikonfirmasi.`,
        })
      }
    } catch (err) {
      setHasilEmail({ jenis: 'galat', teks: pesanGalatAuth(err) })
    } finally {
      setProsesEmail(false)
    }
  }

  const kirimSandi = async (e: FormEvent) => {
    e.preventDefault()
    setHasilSandi(null)

    if (sandiBaru.length < PANJANG_MIN) {
      setHasilSandi({ jenis: 'galat', teks: `Password baru minimal ${PANJANG_MIN} karakter.` })
      return
    }
    if (sandiBaru !== sandiUlang) {
      setHasilSandi({ jenis: 'galat', teks: 'Konfirmasi password tidak cocok.' })
      return
    }
    if (sandiBaru === sandiLama) {
      setHasilSandi({ jenis: 'galat', teks: 'Password baru sama dengan password lama.' })
      return
    }

    setProsesSandi(true)
    try {
      await gantiPassword(sandiLama, sandiBaru)
      setSandiLama(''); setSandiBaru(''); setSandiUlang('')
      setHasilSandi({ jenis: 'sukses', teks: 'Password berhasil diganti. Pakai password baru untuk masuk berikutnya.' })
    } catch (err) {
      setHasilSandi({ jenis: 'galat', teks: pesanGalatAuth(err) })
    } finally {
      setProsesSandi(false)
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-ink">Pengaturan Akun</h1>
        <p className="text-ink-4 text-[13px] mt-1">
          Ubah email dan password yang dipakai untuk masuk ke panel admin.
        </p>
      </div>

      <div className="border border-border bg-surface px-4 py-3 mb-6">
        <div className="text-[11px] text-ink-4 uppercase tracking-wide">Akun yang sedang dipakai</div>
        <div className="text-[14px] text-ink font-medium mt-0.5 break-all">{user?.email ?? '—'}</div>
      </div>

      <div className="space-y-6">
        {/* Ganti email */}
        <Kotak
          judul="Ganti Email"
          desc="Email inilah yang berfungsi sebagai nama pengguna saat masuk."
        >
          <form onSubmit={kirimEmail} className="space-y-4">
            <div>
              <Label>Email Baru</Label>
              <input type="email" className={INPUT} value={emailBaru} required
                autoComplete="username"
                onChange={e => setEmailBaru(e.target.value)}
                placeholder="admin@smpn6.sch.id" />
            </div>
            <div>
              <Label>Password Saat Ini</Label>
              <input type="password" className={INPUT} value={sandiEmail} required
                autoComplete="current-password"
                onChange={e => setSandiEmail(e.target.value)}
                placeholder="••••••••" />
              <p className="text-[11px] text-ink-4 mt-1">
                Diminta untuk memastikan yang mengubah memang pemilik akun.
              </p>
            </div>

            {hasilEmail && <Pesan jenis={hasilEmail.jenis} teks={hasilEmail.teks} />}

            <button type="submit" disabled={prosesEmail} className="btn-black disabled:opacity-50">
              {prosesEmail ? 'Memproses...' : 'Ganti Email'}
            </button>
          </form>
        </Kotak>

        {/* Ganti password */}
        <Kotak
          judul="Ganti Password"
          desc={`Minimal ${PANJANG_MIN} karakter. Gunakan kombinasi huruf dan angka.`}
        >
          <form onSubmit={kirimSandi} className="space-y-4">
            <div>
              <Label>Password Saat Ini</Label>
              <input type="password" className={INPUT} value={sandiLama} required
                autoComplete="current-password"
                onChange={e => setSandiLama(e.target.value)} placeholder="••••••••" />
            </div>
            <div>
              <Label>Password Baru</Label>
              <input type="password" className={INPUT} value={sandiBaru} required
                autoComplete="new-password" minLength={PANJANG_MIN}
                onChange={e => setSandiBaru(e.target.value)} placeholder="••••••••" />
            </div>
            <div>
              <Label>Ulangi Password Baru</Label>
              <input type="password" className={INPUT} value={sandiUlang} required
                autoComplete="new-password" minLength={PANJANG_MIN}
                onChange={e => setSandiUlang(e.target.value)} placeholder="••••••••" />
              {sandiUlang.length > 0 && sandiBaru !== sandiUlang && (
                <p className="text-[12px] text-red-600 mt-1">Belum cocok dengan password baru.</p>
              )}
            </div>

            {hasilSandi && <Pesan jenis={hasilSandi.jenis} teks={hasilSandi.teks} />}

            <button type="submit" disabled={prosesSandi} className="btn-black disabled:opacity-50">
              {prosesSandi ? 'Memproses...' : 'Ganti Password'}
            </button>
          </form>
        </Kotak>

        <div className="border border-border bg-off-white p-5 text-[13px] text-ink-3 space-y-2">
          <p className="font-semibold text-ink-2">Kalau lupa password</p>
          <p>
            Password tidak bisa dilihat oleh siapa pun, termasuk lewat panel ini. Kalau sampai
            terlupa, atur ulang lewat{' '}
            <a href="https://console.firebase.google.com/project/smpn6-banjarmasin/authentication/users"
              target="_blank" rel="noreferrer" className="text-ink underline">
              Firebase Console → Authentication
            </a>{' '}
            dengan memilih akun lalu <em>Reset password</em>.
          </p>
        </div>
      </div>
    </div>
  )
}

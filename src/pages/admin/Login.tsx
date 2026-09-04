import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin')
    } catch {
      setError('Email atau password salah. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
          <div className="w-9 h-9 flex-shrink-0 overflow-hidden">
            <img src="/Logo SMPN 6 Banjarmasin.png" alt="Logo SMPN 6 Banjarmasin" className="w-full h-full object-contain" />
          </div>
        <div>
          <div className="font-semibold text-ink">SMPN 6 Banjarmasin</div>
          <div className="text-[11px] text-ink-4">Panel Admin</div>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white border border-border p-8">
        <h1 className="font-serif text-2xl text-ink mb-1">Masuk</h1>
        <p className="text-[13px] text-ink-4 mb-7">Silakan masuk untuk mengelola website sekolah.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-border px-3 py-2.5 text-[14px] text-ink 
                         focus:outline-none focus:border-ink transition-colors"
              placeholder="admin@smpn6.sch.id"
              required
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-border px-3 py-2.5 text-[14px] text-ink 
                         focus:outline-none focus:border-ink transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-yellow py-3 text-[14px] font-semibold 
                       hover:bg-ink-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2">
            {loading ? 'Memproses...' : 'Masuk ke Panel Admin'}
          </button>
        </form>

        <p className="text-[12px] text-ink-4 text-center mt-5">
          Hanya untuk staf yang berwenang.
        </p>
      </div>

      <p className="text-[11px] text-ink-4 mt-6">© {new Date().getFullYear()} SMPN 6 Banjarmasin</p>
    </div>
  )
}

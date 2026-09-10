import { useState, useEffect } from 'react'
import {
  onAuthStateChanged, signInWithEmailAndPassword, signOut,
  EmailAuthProvider, reauthenticateWithCredential,
  updatePassword, updateEmail, verifyBeforeUpdateEmail,
  type User,
} from 'firebase/auth'
import { auth } from '../lib/auth'

/** Menerjemahkan kode galat Firebase ke pesan yang dimengerti pengguna. */
export function pesanGalatAuth(err: unknown): string {
  const kode = (err as { code?: string })?.code ?? ''
  switch (kode) {
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Password saat ini salah.'
    case 'auth/weak-password':
      return 'Password baru terlalu lemah. Minimal 6 karakter.'
    case 'auth/email-already-in-use':
      return 'Email tersebut sudah dipakai akun lain.'
    case 'auth/invalid-email':
      return 'Format email tidak valid.'
    case 'auth/requires-recent-login':
      return 'Sesi masuk sudah terlalu lama. Silakan keluar, masuk lagi, lalu ulangi.'
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.'
    case 'auth/network-request-failed':
      return 'Gagal terhubung ke server. Periksa koneksi internet.'
    case 'auth/user-token-expired':
      return 'Sesi berakhir. Silakan masuk kembali.'
    default:
      return `Gagal memproses permintaan.${kode ? ` (${kode})` : ''}`
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    return signOut(auth)
  }

  /**
   * Firebase menolak perubahan email dan password kalau sesi masuknya sudah
   * lama, jadi identitas dibuktikan ulang memakai password saat ini.
   */
  const buktikanUlang = async (passwordSaatIni: string) => {
    const akun = auth.currentUser
    if (!akun?.email) throw new Error('Belum masuk.')
    const kredensial = EmailAuthProvider.credential(akun.email, passwordSaatIni)
    await reauthenticateWithCredential(akun, kredensial)
    return akun
  }

  const gantiPassword = async (passwordSaatIni: string, passwordBaru: string) => {
    const akun = await buktikanUlang(passwordSaatIni)
    await updatePassword(akun, passwordBaru)
  }

  /**
   * Mengembalikan 'langsung' bila email berganti seketika, atau 'verifikasi'
   * bila proyek mewajibkan tautan konfirmasi dikirim ke alamat baru dulu.
   */
  const gantiEmail = async (
    passwordSaatIni: string, emailBaru: string,
  ): Promise<'langsung' | 'verifikasi'> => {
    const akun = await buktikanUlang(passwordSaatIni)
    try {
      await updateEmail(akun, emailBaru)
      return 'langsung'
    } catch (err) {
      // Proyek dengan perlindungan enumerasi email mewajibkan konfirmasi
      if ((err as { code?: string }).code === 'auth/operation-not-allowed') {
        await verifyBeforeUpdateEmail(akun, emailBaru)
        return 'verifikasi'
      }
      throw err
    }
  }

  return { user, loading, login, logout, gantiPassword, gantiEmail }
}

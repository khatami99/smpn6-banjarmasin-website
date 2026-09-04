import { getAuth } from 'firebase/auth'
import app from './firebase'

/**
 * Modul terpisah dari lib/firebase.ts supaya `firebase/auth` hanya masuk
 * ke bundle panel admin — halaman publik tidak membutuhkannya.
 */
export const auth = getAuth(app)

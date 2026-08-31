import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBRczsyXPHKadZbrrjRJ1ijk7s-BIa9eEc",
  authDomain: "smpn6-banjarmasin.firebaseapp.com",
  projectId: "smpn6-banjarmasin",
  storageBucket: "smpn6-banjarmasin.firebasestorage.app",
  messagingSenderId: "840865030705",
  appId: "1:840865030705:web:108de367217e110c02eb10",
  measurementId: "G-WSH4L6HKPJ"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export default app
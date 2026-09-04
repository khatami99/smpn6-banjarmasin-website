import { useState, useEffect } from 'react'
import {
  collection, doc, setDoc, addDoc,
  updateDoc, deleteDoc, orderBy, query, where, onSnapshot,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { defaultStats, defaultProfile } from '../data/defaults'
import type { SchoolStats, SchoolProfile, NewsItem, Ekskul, Prestasi, Announcement, GaleriItem } from '../types'

// ─── School Stats ───────────────────────────────────────────
export function useStats() {
  const [stats, setStats] = useState<SchoolStats>(defaultStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ref = doc(db, 'settings', 'stats')
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setStats(snap.data() as SchoolStats)
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [])

  const updateStats = async (data: Partial<SchoolStats>) => {
    await setDoc(doc(db, 'settings', 'stats'), data, { merge: true })
  }

  return { stats, loading, updateStats }
}

// ─── School Profile ─────────────────────────────────────────
export function useProfile() {
  const [profile, setProfile] = useState<SchoolProfile>(defaultProfile)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ref = doc(db, 'settings', 'profile')
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setProfile(snap.data() as SchoolProfile)
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [])

  const updateProfile = async (data: Partial<SchoolProfile>) => {
    await setDoc(doc(db, 'settings', 'profile'), data, { merge: true })
  }

  return { profile, loading, updateProfile }
}

// ─── Announcement ────────────────────────────────────────────
export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)

  useEffect(() => {
    const ref = doc(db, 'settings', 'announcement')
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setAnnouncement(snap.data() as Announcement)
    })
    return unsub
  }, [])

  const updateAnnouncement = async (data: Announcement) => {
    await setDoc(doc(db, 'settings', 'announcement'), data)
  }

  return { announcement, updateAnnouncement }
}

// ─── News ────────────────────────────────────────────────────
export function useNews(publishedOnly = true) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const col = collection(db, 'news')
    const q = publishedOnly
      ? query(col, where('published', '==', true), orderBy('tanggal', 'desc'))
      : query(col, orderBy('tanggal', 'desc'))

    const unsub = onSnapshot(q, (snap) => {
      setNews(snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsItem)))
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [publishedOnly])

  const addNews = async (data: Omit<NewsItem, 'id'>) => {
    await addDoc(collection(db, 'news'), { ...data, createdAt: new Date().toISOString() })
  }

  const updateNews = async (id: string, data: Partial<NewsItem>) => {
    await updateDoc(doc(db, 'news', id), data)
  }

  const deleteNews = async (id: string) => {
    await deleteDoc(doc(db, 'news', id))
  }

  return { news, loading, addNews, updateNews, deleteNews }
}

// ─── Ekskul ──────────────────────────────────────────────────
export function useEkskul(aktifOnly = false) {
  const [ekskul, setEkskul] = useState<Ekskul[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const col = collection(db, 'ekskul')
    const q = aktifOnly
      ? query(col, where('aktif', '==', true))
      : query(col)

    const unsub = onSnapshot(q, (snap) => {
      setEkskul(snap.docs.map(d => ({ id: d.id, ...d.data() } as Ekskul)))
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [aktifOnly])

  const addEkskul = async (data: Omit<Ekskul, 'id'>) => {
    await addDoc(collection(db, 'ekskul'), data)
  }

  const updateEkskul = async (id: string, data: Partial<Ekskul>) => {
    await updateDoc(doc(db, 'ekskul', id), data)
  }

  const deleteEkskul = async (id: string) => {
    await deleteDoc(doc(db, 'ekskul', id))
  }

  return { ekskul, loading, addEkskul, updateEkskul, deleteEkskul }
}

// ─── Prestasi ────────────────────────────────────────────────
export function usePrestasi() {
  const [prestasi, setPrestasi] = useState<Prestasi[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'prestasi'), orderBy('tahun', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setPrestasi(snap.docs.map(d => ({ id: d.id, ...d.data() } as Prestasi)))
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [])

  const addPrestasi = async (data: Omit<Prestasi, 'id'>) => {
    await addDoc(collection(db, 'prestasi'), { ...data, createdAt: new Date().toISOString() })
  }

  const updatePrestasi = async (id: string, data: Partial<Prestasi>) => {
    await updateDoc(doc(db, 'prestasi', id), data)
  }

  const deletePrestasi = async (id: string) => {
    await deleteDoc(doc(db, 'prestasi', id))
  }

  return { prestasi, loading, addPrestasi, updatePrestasi, deletePrestasi }
}

// ─── Galeri ──────────────────────────────────────────────────
export function useGaleri() {
  const [galeri, setGaleri] = useState<GaleriItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'galeri'), orderBy('tanggal', 'desc'))
    const unsub = onSnapshot(q, (snap) => {
      setGaleri(snap.docs.map(d => ({ id: d.id, ...d.data() } as GaleriItem)))
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [])

  const addGaleri = async (data: Omit<GaleriItem, 'id'>) => {
    await addDoc(collection(db, 'galeri'), { ...data, createdAt: new Date().toISOString() })
  }

  const updateGaleri = async (id: string, data: Partial<GaleriItem>) => {
    await updateDoc(doc(db, 'galeri', id), data)
  }

  const deleteGaleri = async (id: string) => {
    await deleteDoc(doc(db, 'galeri', id))
  }

  return { galeri, loading, addGaleri, updateGaleri, deleteGaleri }
}


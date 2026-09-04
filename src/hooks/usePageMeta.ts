import { useEffect } from 'react'

const SUFFIX = 'SMPN 6 Dahlia Banjarmasin'

function setMeta(selector: string, attr: string, name: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/**
 * Mengatur judul tab & meta description per halaman.
 * Kirim title kosong untuk memakai judul default saja.
 */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${SUFFIX}` : SUFFIX
    setMeta('meta[property="og:title"]', 'property', 'og:title', document.title)

    if (description) {
      setMeta('meta[name="description"]', 'name', 'description', description)
      setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    }

    setMeta('meta[property="og:url"]', 'property', 'og:url', window.location.href)
  }, [title, description])
}

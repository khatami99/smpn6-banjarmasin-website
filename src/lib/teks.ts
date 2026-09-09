/**
 * Perapian huruf besar untuk kolom nama dan judul di panel admin.
 *
 * Aturan utama: hanya huruf PERTAMA tiap kata yang diubah, sisanya dibiarkan
 * apa adanya. Kalau seluruh kata ikut dikecilkan, akronim seperti OSN, PPDB,
 * SMPN, dan O2SN akan rusak menjadi Osn, Ppdb, Smpn.
 */

/** Kata sambung yang tetap huruf kecil di tengah judul (kaidah bahasa Indonesia). */
const KATA_KECIL = new Set([
  'dan', 'atau', 'di', 'ke', 'dari', 'yang', 'untuk', 'pada', 'dengan',
  'dalam', 'oleh', 'serta', 'bagi', 'tentang', 'sebagai', 'agar', 'akan',
  'the', 'of', 'in', 'on', 'for', 'and', 'to', 'at',
])

function rapikanSpasi(teks: string): string {
  return teks.replace(/\s+/g, ' ').trim()
}

function besarkanAwal(kata: string): string {
  // Bagian setelah tanda hubung ikut dibesarkan: "e-learning" -> "E-Learning"
  return kata
    .split('-')
    .map(bagian => bagian.replace(/^(\p{L})/u, huruf => huruf.toUpperCase()))
    .join('-')
}

/**
 * Setiap kata diawali huruf besar — untuk nama orang, tempat, dan pembina.
 * "ahmad fauzi" -> "Ahmad Fauzi"
 */
export function kapitalNama(teks: string): string {
  const bersih = rapikanSpasi(teks)
  if (!bersih) return bersih
  return bersih.split(' ').map(besarkanAwal).join(' ')
}

/**
 * Huruf besar tiap kata, kecuali kata sambung yang bukan kata pertama.
 * "festival olahraga dan seni" -> "Festival Olahraga dan Seni"
 */
export function kapitalJudul(teks: string): string {
  const bersih = rapikanSpasi(teks)
  if (!bersih) return bersih

  return bersih
    .split(' ')
    .map((kata, i) => {
      const polos = kata.toLowerCase().replace(/[^\p{L}]/gu, '')
      // Kata sambung di tengah judul dikecilkan seluruhnya ("DAN" -> "dan")
      if (i > 0 && KATA_KECIL.has(polos)) return kata.toLowerCase()
      return besarkanAwal(kata)
    })
    .join(' ')
}

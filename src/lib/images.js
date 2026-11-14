// Real product photos: drop files named after the product code into
// src/assets/products/ (JK-PD-001.jpg, and JK-PD-001_2.jpg for a second angle).
// They replace the placeholder photo automatically.
const local = import.meta.glob('../assets/products/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const byCode = {}
Object.keys(local)
  .sort()
  .forEach((path) => {
    const file = path.split('/').pop().replace(/\.[^.]+$/, '')
    const code = file.replace(/_\d+$/, '').toUpperCase()
    ;(byCode[code] ||= []).push(local[path])
  })

const unsplash = (url, w) => `${url}?auto=format&fit=crop&w=${w}&q=80`

// Returns [{src, srcSet?}] for a product: real photos first, else the placeholder.
export function photosFor(product, width = 640) {
  const own = byCode[product.code]
  if (own?.length) return own.map((src) => ({ src }))
  if (product.image) {
    return [
      {
        src: unsplash(product.image, width),
        srcSet: `${unsplash(product.image, Math.round(width / 2))} ${Math.round(width / 2)}w, ${unsplash(product.image, width)} ${width}w`,
        focus: product.focus,
      },
    ]
  }
  return []
}

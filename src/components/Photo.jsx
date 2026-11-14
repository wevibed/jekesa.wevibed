import React, { useState } from 'react'
import { Lamp, Plug } from 'lucide-react'
import { photosFor } from '../lib/images.js'
import { categoryGroup } from '../data/catalogue.js'

// Shown when a product has no photo yet (or the photo fails to load).
function Plate({ product }) {
  const Icon = categoryGroup[product.category] === 'Electrical' ? Plug : Lamp
  return (
    <div className="plate" role="img" aria-label={`${product.name} (photo coming soon)`}>
      <Icon size={34} strokeWidth={1.25} />
      <span>{product.code}</span>
    </div>
  )
}

export default function Photo({ product, width = 640, sizes, eager = false }) {
  const [failed, setFailed] = useState(false)
  const photo = photosFor(product, width)[0]
  if (!photo || failed) return <Plate product={product} />
  return (
    <img
      src={photo.src}
      srcSet={photo.srcSet}
      sizes={sizes}
      alt={product.name}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={photo.focus ? { objectPosition: photo.focus } : undefined}
      onError={() => setFailed(true)}
    />
  )
}

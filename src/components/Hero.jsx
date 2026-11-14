import React, { useRef } from 'react'
import { getProduct } from '../data/catalogue.js'
import { money } from '../lib/format.js'
import { useCover, useMediaQuery } from '../lib/hooks.js'
import scene from '../assets/showroom-dining.jpg'

// A real photograph you can shop from. Hotspot x/y are fractions of the photo
// (0 to 1), so they stay on the fixture at every screen size.
// To add another room later, add its photo and hotspots to this list.
const SCENE = {
  src: scene,
  w: 1078,
  h: 515,
  // Which part of the photo stays in view when it is cropped to fit the screen.
  // On wide screens the fixture sits right of the headline; on phones it is centred.
  focus: { wide: 0.08, narrow: 0.5 },
  alt: 'A dining room lit by a gold ribbon LED pendant over an oval table',
  hotspots: [{ code: 'JK-PD-030', x: 0.496, y: 0.5 }],
}

export default function Hero({ onShop, onShowroom, onOpenProduct }) {
  const stage = useRef(null)
  const wide = useMediaQuery('(min-width: 900px)')
  const fx = wide ? SCENE.focus.wide : SCENE.focus.narrow
  const place = useCover(stage, SCENE.w, SCENE.h, fx, 0.5)

  return (
    <section className="hero" id="top">
      <div className="hero-stage" ref={stage}>
        <img
          className="hero-img"
          src={SCENE.src}
          alt={SCENE.alt}
          style={{ objectPosition: `${fx * 100}% 50%` }}
        />
        <div className="hero-fade" aria-hidden="true" />
        <div className="hero-dark" aria-hidden="true" />

        {SCENE.hotspots.map((h) => {
          const product = getProduct(h.code)
          const pos = place(h.x, h.y)
          if (!product || !pos) return null
          return (
            <button
              key={h.code}
              type="button"
              className="hotspot"
              style={{ left: pos.left, top: pos.top }}
              onClick={() => onOpenProduct(product)}
              aria-label={`${product.name}, ${money(product.price)}. View details`}
            >
              <span className="hotspot-pin" aria-hidden="true" />
              <span className="hotspot-tag">
                <b>{product.name}</b>
                <span>{money(product.price)}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="hero-copy">
        <h1>
          Light up<br />your world.
        </h1>
        <p>
          Lighting and electrical supplies from our showroom in Eastlea, Harare. Prices in US dollars, ordered and confirmed on WhatsApp.
        </p>
        <div className="hero-actions">
          <button type="button" className="btn btn-light" onClick={onShop}>Shop the collection</button>
          <button type="button" className="btn btn-ghost" onClick={onShowroom}>Walk the 3D showroom</button>
        </div>
      </div>
    </section>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, ShoppingBag, X } from 'lucide-react'
import Photo from './Photo.jsx'
import Stepper from './Stepper.jsx'
import { AVAILABILITY, CATALOGUE_STATUS } from '../data/catalogue.js'
import { money } from '../lib/format.js'
import { buildOrderMessage, orderRef, whatsappUrl } from '../lib/whatsapp.js'
import { useEscape, useScrollLock } from '../lib/hooks.js'

export default function ProductModal({ product, onClose, onAdd }) {
  const [qty, setQty] = useState(1)
  const closeRef = useRef(null)
  useEscape(true, onClose)
  useScrollLock(true)
  useEffect(() => closeRef.current?.focus(), [])

  const stock = AVAILABILITY[product.availability]
  const quickOrder = whatsappUrl(
    buildOrderMessage({ items: [{ product, qty }], ref: orderRef() }),
  )

  return (
    <div className="overlay center" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={product.name}>
        <button ref={closeRef} type="button" className="icon-btn modal-close" onClick={onClose} aria-label="Close">
          <X size={22} />
        </button>
        <div className="modal-media">
          <Photo product={product} width={1000} sizes="(max-width: 800px) 100vw, 480px" eager />
        </div>
        <div className="modal-info">
          <p className="modal-kicker">{product.category}</p>
          <h2>{product.name}</h2>
          <p className="modal-code">Code {product.code}</p>

          <div className="modal-price-row">
            <p className="price price-lg">
              <span className="price-now">{money(product.price)}</span>
              {product.was && <s className="price-was">{money(product.was)}</s>}
            </p>
            {stock && <p className={`stock stock-${stock.tone}`}>{stock.label}</p>}
          </div>
          {CATALOGUE_STATUS === 'sample' && <p className="fineprint">Sample price. Jekesa confirms the final price on WhatsApp.</p>}

          <p className="modal-desc">{product.description}</p>

          <dl className="specs">
            {product.specs?.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>

          <div className="modal-actions">
            <Stepper qty={qty} onChange={(n) => setQty(Math.max(1, n))} label={product.name} />
            <button
              type="button"
              className="btn btn-dark btn-grow"
              onClick={() => {
                onAdd(product, qty)
                onClose()
              }}
            >
              <ShoppingBag size={17} /> Add to order, {money(product.price * qty)}
            </button>
          </div>
          <a className="btn btn-whatsapp-outline" href={quickOrder} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={17} /> Order this item on WhatsApp now
          </a>
        </div>
      </div>
    </div>
  )
}

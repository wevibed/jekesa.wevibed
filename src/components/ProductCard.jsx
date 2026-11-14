import React from 'react'
import { Check, Plus } from 'lucide-react'
import Photo from './Photo.jsx'
import Stepper from './Stepper.jsx'
import { AVAILABILITY } from '../data/catalogue.js'
import { money } from '../lib/format.js'

export default function ProductCard({ product, qty, onOpen, onAdd, onSetQty }) {
  const stock = AVAILABILITY[product.availability]
  return (
    <article className="card">
      <button type="button" className="card-media" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}>
        <Photo product={product} width={640} sizes="(max-width: 700px) 50vw, 300px" />
        {product.badge && <span className="badge">{product.badge}</span>}
      </button>
      <div className="card-body">
        <div className="card-top">
          <span>{product.category}</span>
          <span className="code">{product.code}</span>
        </div>
        <h3 className="card-name">
          <button type="button" onClick={() => onOpen(product)}>{product.name}</button>
        </h3>
        <div className="card-price-row">
          <p className="price">
            <span className="price-now">{money(product.price)}</span>
            {product.was && (
              <s className="price-was">
                <span className="sr-only">Was </span>
                {money(product.was)}
              </s>
            )}
          </p>
          {stock && <p className={`stock stock-${stock.tone}`}>{stock.label}</p>}
        </div>
        {qty === 0 ? (
          <button type="button" className="btn btn-add" onClick={() => onAdd(product)}>
            <Plus size={16} /> Add to order
          </button>
        ) : (
          <div className="in-order">
            <span><Check size={15} /> In your order</span>
            <Stepper qty={qty} onChange={(n) => onSetQty(product.code, n)} label={product.name} />
          </div>
        )}
      </div>
    </article>
  )
}

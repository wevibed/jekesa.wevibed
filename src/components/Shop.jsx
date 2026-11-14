import React, { useMemo, useState } from 'react'
import { Lightbulb, Search } from 'lucide-react'
import ProductCard from './ProductCard.jsx'
import { CATALOGUE_STATUS, CATEGORIES, GROUPS, PRODUCTS, categoryGroup } from '../data/catalogue.js'

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'low', label: 'Price, low to high' },
  { id: 'high', label: 'Price, high to low' },
  { id: 'az', label: 'Name, A to Z' },
]

export default function Shop({ order, onOpen, onAdd, filter, setFilter, search, setSearch }) {
  const { group, category } = filter
  const [sort, setSort] = useState('featured')

  const categories = CATEGORIES.filter((c) => group === 'All' || c.group === group)

  const list = useMemo(() => {
    const q = search.trim().toLowerCase()
    let out = PRODUCTS.filter(
      (p) =>
        (group === 'All' || categoryGroup[p.category] === group) &&
        (category === 'All' || p.category === category) &&
        (!q || `${p.name} ${p.category} ${p.code} ${p.finish}`.toLowerCase().includes(q)),
    )
    if (sort === 'low') out = [...out].sort((a, b) => a.price - b.price)
    if (sort === 'high') out = [...out].sort((a, b) => b.price - a.price)
    if (sort === 'az') out = [...out].sort((a, b) => a.name.localeCompare(b.name))
    return out
  }, [group, category, search, sort])

  return (
    <section className="shop" id="shop">
      <div className="wrap">
        <div className="shop-head">
          <h2>The collection</h2>
          <p>
            {PRODUCTS.length} products in US dollars. Add what you need to your order, then send it to us on WhatsApp.
          </p>
        </div>
      </div>

      <div className="toolbar">
        <div className="wrap toolbar-inner">
          <div className="segment" role="tablist" aria-label="Product type">
            {['All', ...GROUPS].map((g) => (
              <button
                key={g}
                type="button"
                role="tab"
                aria-selected={group === g}
                className={group === g ? 'on' : ''}
                onClick={() => setFilter({ group: g, category: 'All' })}
              >
                {g === 'All' ? 'Everything' : g}
              </button>
            ))}
          </div>
          <label className="search">
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
            />
          </label>
          <label className="sort">
            <span className="sr-only">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
        </div>
        <div className="wrap chips-wrap">
          <div className="chips">
            <button type="button" className={category === 'All' ? 'chip on' : 'chip'} onClick={() => setFilter({ group, category: 'All' })}>
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                type="button"
                className={category === c.name ? 'chip on' : 'chip'}
                onClick={() => setFilter({ group: c.group === group || group === 'All' ? group : c.group, category: c.name })}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap">
        {CATALOGUE_STATUS === 'sample' && (
          <p className="notice">
            Sample catalogue. Prices and stock shown here are placeholders until Jekesa confirms its price list.
          </p>
        )}
        <p className="result-count" aria-live="polite">{list.length} {list.length === 1 ? 'product' : 'products'}</p>

        {list.length > 0 ? (
          <div className="grid">
            {list.map((p) => (
              <ProductCard
                key={p.code}
                product={p}
                qty={order.qtyOf(p.code)}
                onOpen={onOpen}
                onAdd={onAdd}
                onSetQty={order.setQty}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <Lightbulb size={34} strokeWidth={1.25} />
            <h3>{search.trim() ? `Nothing matches “${search.trim()}”` : 'No products in this category yet'}</h3>
            <p>Check the spelling, try a product code like JK-PD-001, or clear the filters.</p>
            <button type="button" className="btn btn-dark" onClick={() => { setSearch(''); setFilter({ group: 'All', category: 'All' }) }}>
              Clear filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

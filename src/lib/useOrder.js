import { useCallback, useEffect, useMemo, useState } from 'react'
import { getProduct } from '../data/catalogue.js'

const KEY = 'jekesa-order-v1'

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(raw) ? raw.filter((l) => l && getProduct(l.code) && l.qty > 0) : []
  } catch {
    return []
  }
}

// The order list. Remembered in the browser so a refresh doesn't lose it.
export function useOrder() {
  const [lines, setLines] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines))
    } catch {
      /* storage unavailable, order simply won't persist */
    }
  }, [lines])

  const add = useCallback((code, n = 1) => {
    setLines((old) =>
      old.some((l) => l.code === code)
        ? old.map((l) => (l.code === code ? { ...l, qty: Math.min(99, l.qty + n) } : l))
        : [...old, { code, qty: n }],
    )
  }, [])

  const setQty = useCallback((code, qty) => {
    setLines((old) => old.map((l) => (l.code === code ? { ...l, qty } : l)).filter((l) => l.qty > 0))
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const items = useMemo(
    () => lines.map((l) => ({ product: getProduct(l.code), qty: l.qty })),
    [lines],
  )
  const count = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0)
  const qtyOf = (code) => lines.find((l) => l.code === code)?.qty || 0

  return { items, count, total, qtyOf, add, setQty, clear }
}

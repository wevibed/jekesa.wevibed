import { useEffect, useLayoutEffect, useState } from 'react'

export function useMediaQuery(query) {
  const get = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false)
  const [matches, setMatches] = useState(get)
  useEffect(() => {
    if (!window.matchMedia) return
    const mq = window.matchMedia(query)
    const handler = () => setMatches(mq.matches)
    handler()
    mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler)
    return () => (mq.removeEventListener ? mq.removeEventListener('change', handler) : mq.removeListener(handler))
  }, [query])
  return matches
}

// Close something with the Escape key.
export function useEscape(active, onEscape) {
  useEffect(() => {
    if (!active) return
    const handler = (e) => e.key === 'Escape' && onEscape()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active, onEscape])
}

// Stop the page behind a drawer, dialog or full-screen view from scrolling.
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [active])
}

// Where a point on an image lands once the image is drawn with object-fit: cover.
// Lets hotspots stay glued to the right spot on any screen size.
export function useCover(ref, imgW, imgH, focusX = 0.5, focusY = 0.5) {
  const [box, setBox] = useState(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const cw = el.clientWidth
      const ch = el.clientHeight
      if (!cw || !ch) return
      const s = Math.max(cw / imgW, ch / imgH)
      setBox({ s, ox: (cw - imgW * s) * focusX, oy: (ch - imgH * s) * focusY, cw, ch })
    }
    measure()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref, imgW, imgH, focusX, focusY])
  return (x, y) => (box ? { left: box.ox + x * imgW * box.s, top: box.oy + y * imgH * box.s } : null)
}

import React, { useEffect, useRef, useState } from 'react'
import { Check, ShoppingBag, X, Zap } from 'lucide-react'
import { products as studioProducts, walls } from '../data/studio-products.js'
import { getProduct } from '../data/catalogue.js'
import { money } from '../lib/format.js'
import { useEscape, useScrollLock } from '../lib/hooks.js'
import '../studio.css'

// The 3D showroom. three.js is only downloaded when someone opens it,
// so the shop itself loads fast on slow connections.
export default function Showroom3D({ onClose, onAdd, onOpenOrder, orderCount, qtyOf }) {
  const stage = useRef(null)
  const api = useRef(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [wall, setWall] = useState(0)
  const [selected, setSelected] = useState(null)
  const [on, setOn] = useState(true)
  const [brightness, setBrightness] = useState(75)
  const [temp, setTemp] = useState(3000)
  const [allOn, setAllOn] = useState(false)

  useEscape(true, onClose)
  useScrollLock(true)

  useEffect(() => {
    let dead = false
    let instance = null
    import('../showroom/scene.js')
      .then(({ createShowroom }) => {
        if (dead || !stage.current) return
        instance = createShowroom(stage.current, {
          onPick: (id) => {
            setSelected(studioProducts.find((p) => p.id === id) || null)
            setOn(true)
          },
          onWall: setWall,
        })
        api.current = instance
        instance.enter()
        setReady(true)
      })
      .catch(() => !dead && setFailed(true))
    return () => {
      dead = true
      instance?.dispose()
      api.current = null
    }
  }, [])

  useEffect(() => {
    if (selected) api.current?.setLight(selected.id, on, brightness / 75, temp)
  }, [selected, on, brightness, temp])

  const goWall = (i) => {
    const next = (i + walls.length) % walls.length
    setWall(next)
    setSelected(null)
    api.current?.flyToWall(next)
  }
  const toggleAll = () => {
    const next = !allOn
    setAllOn(next)
    setOn(next)
    api.current?.setAll(next)
  }

  const item = selected ? getProduct(selected.code) : null
  const inOrder = item ? qtyOf(item.code) : 0

  return (
    <section className="sx" role="dialog" aria-modal="true" aria-label="Jekesa 3D showroom">
      <div className={`sx-canvas${failed ? ' studio-webgl-unavailable' : ''}`} ref={stage} />
      <div className="sx-shade" />
      {!ready && !failed && <p className="sx-loading">Loading the showroom…</p>}
      {failed && <p className="sx-loading">The 3D showroom could not load. Check your connection and try again.</p>}

      <header className="sx-top">
        <p className="sx-brand">Jekesa <small>3D showroom</small></p>
        <div className="sx-top-actions">
          <button type="button" className="sx-btn" onClick={onOpenOrder}>
            <ShoppingBag size={16} /> Order{orderCount > 0 ? ` (${orderCount})` : ''}
          </button>
          <button type="button" className="sx-btn" onClick={onClose}><X size={16} /> Back to shop</button>
        </div>
      </header>

      <div className="sx-room">
        <p>Room {wall + 1} of {walls.length}</p>
        <h2>{walls[wall].name}</h2>
        <p>{walls[wall].sub}</p>
      </div>

      <nav className="sx-walls" aria-label="Showroom rooms">
        <button type="button" onClick={() => goWall(wall - 1)} aria-label="Previous room">‹</button>
        {walls.map((w, i) => (
          <button key={w.id} type="button" className={wall === i ? 'on' : ''} onClick={() => goWall(i)}>
            {w.name}
          </button>
        ))}
        <button type="button" onClick={() => goWall(wall + 1)} aria-label="Next room">›</button>
      </nav>

      <button type="button" className={`sx-master${allOn ? ' on' : ''}`} onClick={toggleAll}>
        <Zap size={16} /> {allOn ? 'All lights on' : 'Switch all lights on'}
      </button>
      {!selected && <p className="sx-hint">Drag to look around. Tap a light to see it up close.</p>}

      {selected && (
        <aside className="sx-panel" aria-label={selected.name}>
          <button type="button" className="sx-close" onClick={() => setSelected(null)} aria-label="Close details">
            <X size={20} />
          </button>
          <p className="sx-kicker">{selected.category}</p>
          <h3>{item?.name || selected.name}</h3>
          {item && <p className="sx-price">{money(item.price)}</p>}
          <p className="sx-desc">{selected.description}</p>

          <div className="sx-row">
            <span>Light</span>
            <button type="button" className={on ? 'on' : ''} onClick={() => setOn(!on)} aria-pressed={on}>{on ? 'On' : 'Off'}</button>
          </div>
          <label className="sx-slider">
            <span>Brightness <b>{brightness}%</b></span>
            <input type="range" min="10" max="100" value={brightness} onChange={(e) => setBrightness(+e.target.value)} />
          </label>
          <label className="sx-slider">
            <span>Colour temperature <b>{temp.toLocaleString()}K</b></span>
            <input type="range" min="2700" max="5000" step="100" value={temp} onChange={(e) => setTemp(+e.target.value)} />
          </label>

          <dl className="sx-specs">
            <div><dt>Finish</dt><dd>{selected.finish}</dd></div>
            <div><dt>Power</dt><dd>{selected.watts}</dd></div>
          </dl>

          {item && (
            <button type="button" className="sx-add" onClick={() => onAdd(item)}>
              {inOrder > 0 ? <><Check size={17} /> In your order ({inOrder}). Add another</> : <><ShoppingBag size={17} /> Add to order</>}
            </button>
          )}
        </aside>
      )}
    </section>
  )
}

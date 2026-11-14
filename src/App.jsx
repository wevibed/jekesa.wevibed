import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Check, MessageCircle, Search, ShoppingBag } from 'lucide-react'
import Hero from './components/Hero.jsx'
import Shop from './components/Shop.jsx'
import ProductModal from './components/ProductModal.jsx'
import OrderDrawer from './components/OrderDrawer.jsx'
import { Footer, HowItWorks, ShowroomBand, Visit } from './components/Sections.jsx'
import { BUSINESS } from './data/catalogue.js'
import { money } from './lib/format.js'
import { useOrder } from './lib/useOrder.js'
import { whatsappUrl } from './lib/whatsapp.js'

// Loaded on demand so three.js isn't part of the first page load.
const Showroom3D = lazy(() => import('./components/Showroom3D.jsx'))

export default function App() {
  const order = useOrder()
  const [filter, setFilter] = useState({ group: 'All', category: 'All' })
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [drawer, setDrawer] = useState(false)
  const [showroom, setShowroom] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef(0)
  const [pastHero, setPastHero] = useState(false)

  const notify = useCallback((message) => {
    setToast(message)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2600)
  }, [])

  const add = useCallback(
    (product, qty = 1) => {
      order.add(product.code, qty)
      notify(`${product.name} added to your order`)
    },
    [order.add, notify],
  )

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const goShop = () => {
    setShowroom(false)
    setTimeout(() => scrollTo('shop'), 0)
  }
  const focusSearch = () => {
    scrollTo('shop')
    setTimeout(() => document.querySelector('.search input')?.focus({ preventScroll: true }), 450)
  }

  useEffect(() => () => clearTimeout(toastTimer.current), [])
  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <a className="skip" href="#shop">Skip to the collection</a>

      <div className="topbar">
        <div className="wrap topbar-inner">
          <span>{BUSINESS.address}</span>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">WhatsApp {BUSINESS.phoneDisplay}</a>
        </div>
      </div>

      <header className="header">
        <div className="wrap header-inner">
          <a className="wordmark" href="#top" aria-label="Jekesa, back to top">
            Jekesa<small>{BUSINESS.tagline}</small>
          </a>
          <nav className="nav" aria-label="Main">
            <button type="button" onClick={() => scrollTo('shop')}>Shop</button>
            <button type="button" onClick={() => setShowroom(true)}>3D showroom</button>
            <button type="button" onClick={() => scrollTo('visit')}>Visit</button>
          </nav>
          <div className="header-actions">
            <button type="button" className="icon-btn" onClick={focusSearch} aria-label="Search products">
              <Search size={20} />
            </button>
            <button type="button" className="order-btn" onClick={() => setDrawer(true)}>
              <ShoppingBag size={19} aria-hidden="true" />
              <span className="order-label">Order</span>
              {order.count > 0 && <b className="order-count">{order.count}</b>}
              {order.count > 0 && <span className="order-total">{money(order.total)}</span>}
            </button>
          </div>
        </div>
      </header>

      <main>
        <Hero onShop={() => scrollTo('shop')} onShowroom={() => setShowroom(true)} onOpenProduct={setSelected} />
        <Shop
          order={order}
          onOpen={setSelected}
          onAdd={add}
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
        />
        <HowItWorks />
        <ShowroomBand onEnter={() => setShowroom(true)} />
        <Visit />
      </main>
      <Footer />

      {order.count > 0 && !drawer && !showroom && (
        <button type="button" className="order-bar" onClick={() => setDrawer(true)}>
          <span><ShoppingBag size={18} /> View order ({order.count})</span>
          <strong>{money(order.total)}</strong>
        </button>
      )}
      {order.count === 0 && pastHero && (
        <a className="wa-float" href={whatsappUrl('Hello Jekesa, I have a question.')} target="_blank" rel="noopener noreferrer" aria-label="Chat with Jekesa on WhatsApp">
          <MessageCircle size={22} /> <span>Chat with us</span>
        </a>
      )}

      {selected && <ProductModal key={selected.code} product={selected} onClose={() => setSelected(null)} onAdd={add} />}
      {drawer && (
        <OrderDrawer
          order={order}
          onClose={() => setDrawer(false)}
          onBrowse={() => { setDrawer(false); goShop() }}
          onSent={() => notify('Opening WhatsApp. Press send there to finish.')}
        />
      )}
      {showroom && (
        <Suspense fallback={<div className="sx sx-boot"><p className="sx-loading">Loading the showroom…</p></div>}>
          <Showroom3D
            onClose={() => setShowroom(false)}
            onAdd={(p) => add(p)}
            onOpenOrder={() => setDrawer(true)}
            orderCount={order.count}
            qtyOf={order.qtyOf}
          />
        </Suspense>
      )}

      {toast && (
        <div className="toast" role="status">
          <Check size={16} /> {toast}
        </div>
      )}
    </>
  )
}

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { MessageCircle, ShoppingBag, Trash2, X } from 'lucide-react'
import Photo from './Photo.jsx'
import Stepper from './Stepper.jsx'
import { BUSINESS, CATALOGUE_STATUS } from '../data/catalogue.js'
import { money } from '../lib/format.js'
import { buildOrderMessage, orderRef, whatsappUrl } from '../lib/whatsapp.js'
import { useEscape, useScrollLock } from '../lib/hooks.js'

const FORM_KEY = 'jekesa-order-form-v1'

function loadForm() {
  try {
    return { name: '', fulfilment: 'collect', area: '', note: '', ...JSON.parse(localStorage.getItem(FORM_KEY) || '{}') }
  } catch {
    return { name: '', fulfilment: 'collect', area: '', note: '' }
  }
}

export default function OrderDrawer({ order, onClose, onBrowse, onSent }) {
  const { items, count, total, setQty, clear } = order
  const [form, setForm] = useState(loadForm)
  const [tried, setTried] = useState(false)
  const [ref] = useState(() => orderRef())
  const nameRef = useRef(null)
  const closeRef = useRef(null)

  useEscape(true, onClose)
  useScrollLock(true)
  useEffect(() => closeRef.current?.focus(), [])
  useEffect(() => {
    try {
      localStorage.setItem(FORM_KEY, JSON.stringify({ name: form.name, fulfilment: form.fulfilment, area: form.area }))
    } catch {
      /* ignore */
    }
  }, [form.name, form.fulfilment, form.area])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const nameOk = form.name.trim().length > 1
  const areaOk = form.fulfilment !== 'delivery' || form.area.trim().length > 2
  const valid = nameOk && areaOk && items.length > 0

  const message = useMemo(
    () =>
      buildOrderMessage({
        items,
        name: form.name.trim(),
        fulfilment: form.fulfilment,
        area: form.area.trim(),
        note: form.note.trim(),
        ref,
      }),
    [items, form, ref],
  )

  function handleSend(e) {
    if (!valid) {
      e.preventDefault()
      setTried(true)
      if (!nameOk) nameRef.current?.focus()
      return
    }
    onSent?.()
  }

  return (
    <div className="overlay end" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Your order">
        <header className="drawer-head">
          <h2>
            Your order <span>({count} {count === 1 ? 'item' : 'items'})</span>
          </h2>
          <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Close order">
            <X size={22} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <ShoppingBag size={36} strokeWidth={1.25} />
            <h3>Your order is empty</h3>
            <p>Add lights or electrical items, then send the whole list to us on WhatsApp.</p>
            <button type="button" className="btn btn-dark" onClick={onBrowse}>Browse the collection</button>
          </div>
        ) : (
          <>
            <div className="drawer-scroll">
              <ul className="lines">
                {items.map(({ product, qty }) => (
                  <li key={product.code} className="line">
                    <div className="line-photo"><Photo product={product} width={240} sizes="72px" /></div>
                    <div className="line-info">
                      <p className="line-name">{product.name}</p>
                      <p className="line-code">{product.code}, {money(product.price)} each</p>
                      <Stepper qty={qty} onChange={(n) => setQty(product.code, n)} label={product.name} />
                    </div>
                    <p className="line-total">{money(product.price * qty)}</p>
                  </li>
                ))}
              </ul>
              <button type="button" className="link-btn" onClick={clear}><Trash2 size={14} /> Clear order</button>

              <form className="details" onSubmit={(e) => e.preventDefault()} noValidate>
                <h3>Your details</h3>
                <label>
                  <span>Your name</span>
                  <input
                    ref={nameRef}
                    value={form.name}
                    onChange={set('name')}
                    autoComplete="name"
                    placeholder="e.g. Tendai Moyo"
                    aria-invalid={tried && !nameOk}
                  />
                  {tried && !nameOk && <em className="field-error">Enter your name so we know who the order is for.</em>}
                </label>

                <fieldset>
                  <legend>How do you want to get it?</legend>
                  <div className="seg">
                    <label className={form.fulfilment === 'collect' ? 'on' : ''}>
                      <input type="radio" name="fulfilment" value="collect" checked={form.fulfilment === 'collect'} onChange={set('fulfilment')} />
                      Collect in Eastlea
                    </label>
                    <label className={form.fulfilment === 'delivery' ? 'on' : ''}>
                      <input type="radio" name="fulfilment" value="delivery" checked={form.fulfilment === 'delivery'} onChange={set('fulfilment')} />
                      Delivery
                    </label>
                  </div>
                </fieldset>

                {form.fulfilment === 'delivery' && (
                  <label>
                    <span>Delivery address or suburb</span>
                    <input value={form.area} onChange={set('area')} autoComplete="street-address" placeholder="e.g. 12 Borrowdale Road, Harare" aria-invalid={tried && !areaOk} />
                    {tried && !areaOk && <em className="field-error">Enter where we should deliver to.</em>}
                  </label>
                )}

                <label>
                  <span>Note for Jekesa (optional)</span>
                  <textarea rows={2} value={form.note} onChange={set('note')} placeholder="Bulb type, colour, installation questions" />
                </label>
              </form>

              <details className="preview">
                <summary>Preview the WhatsApp message</summary>
                <pre>{message}</pre>
              </details>
            </div>

            <footer className="drawer-foot">
              <div className="total-row">
                <span>Total<small>Delivery, if any, is quoted on WhatsApp</small></span>
                <strong>{money(total)}</strong>
              </div>
              <a className="btn btn-whatsapp" href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" onClick={handleSend}>
                <MessageCircle size={19} /> Send order on WhatsApp
              </a>
              <p className="fineprint center-text">
                This opens WhatsApp with your order ready to send to {BUSINESS.phoneDisplay}.
                {CATALOGUE_STATUS === 'sample' ? ' Prices shown are samples until Jekesa confirms them.' : ' We confirm stock, delivery and payment with you there. You pay nothing on this site.'}
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}

import React from 'react'
import { Minus, Plus } from 'lucide-react'

export default function Stepper({ qty, onChange, label }) {
  return (
    <div className="stepper" role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" onClick={() => onChange(qty - 1)} aria-label="Decrease quantity">
        <Minus size={15} />
      </button>
      <output aria-live="polite">{qty}</output>
      <button type="button" onClick={() => onChange(Math.min(99, qty + 1))} aria-label="Increase quantity">
        <Plus size={15} />
      </button>
    </div>
  )
}

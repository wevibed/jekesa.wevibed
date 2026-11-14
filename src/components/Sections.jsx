import React from 'react'
import { Facebook, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react'
import { BUSINESS } from '../data/catalogue.js'
import { whatsappUrl } from '../lib/whatsapp.js'

export function ShowroomBand({ onEnter }) {
  return (
    <section className="band" id="showroom">
      <div className="wrap band-inner">
        <div>
          <h2>See a light before you buy it</h2>
          <p>
            Step into our 3D showroom. Switch fixtures on, dim them, warm them up or cool them down, and add what you like straight to your order.
          </p>
          <button type="button" className="btn btn-light" onClick={onEnter}>Enter the 3D showroom</button>
        </div>
        <p className="band-note">Works best on a recent phone or computer. The shop works fine without it.</p>
      </div>
    </section>
  )
}

const STEPS = [
  ['Choose', 'Add lights and electrical items to your order. Prices are shown in US dollars.'],
  ['Send', 'Press “Send order on WhatsApp”. Your list opens in WhatsApp, ready to send to us.'],
  ['Confirm', 'We reply with stock, delivery cost and how to pay. You pay nothing on this site.'],
]

export function HowItWorks() {
  return (
    <section className="steps" aria-labelledby="how-title">
      <div className="wrap">
        <h2 id="how-title">How ordering works</h2>
        <ol>
          {STEPS.map(([title, text], i) => (
            <li key={title}>
              <span className="step-n" aria-hidden="true">{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function Visit() {
  return (
    <section className="visit" id="visit">
      <div className="wrap visit-inner">
        <div>
          <h2>Visit the showroom</h2>
          <p>See the fixtures lit, compare finishes in person and talk through your project with our team.</p>
        </div>
        <ul className="visit-list">
          <li>
            <MapPin size={20} aria-hidden="true" />
            <div>
              <b>Address</b>
              <span>{BUSINESS.address}</span>
              <a href={BUSINESS.mapsUrl} target="_blank" rel="noopener noreferrer">Get directions</a>
            </div>
          </li>
          <li>
            <MessageCircle size={20} aria-hidden="true" />
            <div>
              <b>WhatsApp</b>
              <span>{BUSINESS.phoneDisplay}</span>
              <a href={whatsappUrl('Hello Jekesa, I have a question.')} target="_blank" rel="noopener noreferrer">Start a chat</a>
            </div>
          </li>
          <li>
            <Phone size={20} aria-hidden="true" />
            <div>
              <b>Call</b>
              <a href={`tel:+${BUSINESS.whatsapp}`}>{BUSINESS.phoneDisplay}</a>
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p className="footer-brand">Jekesa <small>{BUSINESS.tagline}</small></p>
        <p className="footer-addr">{BUSINESS.address}</p>
        <div className="socials">
          <a href="https://www.facebook.com/" aria-label="Jekesa on Facebook"><Facebook size={18} /></a>
          <a href="https://www.instagram.com/" aria-label="Jekesa on Instagram"><Instagram size={18} /></a>
          <a href={whatsappUrl()} aria-label="Jekesa on WhatsApp"><MessageCircle size={18} /></a>
        </div>
      </div>
      <p className="wrap copy">© {new Date().getFullYear()} Jekesa. All rights reserved.</p>
    </footer>
  )
}

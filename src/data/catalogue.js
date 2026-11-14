/*
 * JEKESA CATALOGUE — the one file you edit to change what the shop sells.
 *
 * To go live:
 *   1. Set CATALOGUE_STATUS to 'live' (this removes the "sample prices" notice).
 *   2. Replace each product's price with the real price (USD).
 *   3. Drop real photos into src/assets/products/ named after the product code,
 *      e.g. JK-PD-001.jpg (extra angles: JK-PD-001_2.jpg). They are picked up
 *      automatically and replace the placeholder photo. No code changes needed.
 *
 * availability: 'in' (in stock) | 'low' (low stock) | 'order' (ordered in on request)
 * was:          optional old price. Shows as a struck-through "was" price.
 * badge:        optional short label on the photo, e.g. 'New' or 'Bestseller'.
 */

export const CATALOGUE_STATUS = 'sample' // 'sample' | 'live'

export const BUSINESS = {
  name: 'Jekesa',
  tagline: 'Lighting & electrical',
  whatsapp: '263713065373', // digits only, with country code
  phoneDisplay: '+263 71 306 5373',
  address: '4 Donald McDonald Drive, Eastlea, Harare',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('4 Donald McDonald Drive, Eastlea, Harare'),
  currency: 'USD',
}

export const GROUPS = ['Lighting', 'Electrical']

export const CATEGORIES = [
  { name: 'Pendants', group: 'Lighting' },
  { name: 'Chandeliers', group: 'Lighting' },
  { name: 'Ceiling lights', group: 'Lighting' },
  { name: 'Downlights', group: 'Lighting' },
  { name: 'Wall lights', group: 'Lighting' },
  { name: 'Table & floor', group: 'Lighting' },
  { name: 'Outdoor', group: 'Lighting' },
  { name: 'LED bulbs & strips', group: 'Electrical' },
  { name: 'Switches & sockets', group: 'Electrical' },
  { name: 'Cables & protection', group: 'Electrical' },
]

const u = (id) => `https://images.unsplash.com/${id}`

export const PRODUCTS = [
  // ---------- Lighting ----------
  {
    code: 'JK-PD-030', name: 'Ribbon LED Pendant', category: 'Pendants',
    price: 240, badge: 'New', availability: 'order', finish: 'Brushed brass',
    description: 'A sculpted ribbon of warm LED light, hung low over a dining table or entrance. A statement piece for rooms with height.',
    specs: [['Finish', 'Brushed brass'], ['Light', 'Integrated LED, warm white'], ['Best over', 'Dining tables, foyers']],
  },
  {
    code: 'JK-PD-001', name: 'Halo Pendant', category: 'Pendants',
    price: 68, was: 82, badge: 'Bestseller', availability: 'in', finish: 'Brushed brass · opal glass',
    image: u('photo-1507473885765-e6ed057f782c'),
    description: 'A sculptural pendant that gives a warm, focused glow above kitchen islands and dining tables.',
    specs: [['Finish', 'Brushed brass, opal glass'], ['Power', '12W LED'], ['Colour temperature', '2700K to 4000K']],
  },
  {
    code: 'JK-PD-019', name: 'Opal Globe Pendant', category: 'Pendants',
    price: 59, availability: 'in', finish: 'Opal glass · brass',
    image: u('photo-1600210492486-724fe5c67fb0'),
    description: 'Soft, diffused light in a timeless globe form for contemporary interiors.',
    specs: [['Finish', 'Opal glass, brass'], ['Power', '9W LED'], ['Colour temperature', '2700K to 4000K']],
  },
  {
    code: 'JK-CH-003', name: 'Orbit Chandelier', category: 'Chandeliers',
    price: 185, badge: 'Statement piece', availability: 'low', finish: 'Dark bronze · warm brass',
    image: u('photo-1518005020951-ecc8e4f4c6e1'),
    description: 'A multi-light chandelier with a refined architectural silhouette, made for dining rooms, foyers and hospitality spaces.',
    specs: [['Finish', 'Dark bronze, warm brass'], ['Power', '36W LED'], ['Colour temperature', '3000K']],
  },
  {
    code: 'JK-CL-008', name: 'Halo Ceiling Light', category: 'Ceiling lights',
    price: 54, availability: 'in', finish: 'Satin black · opal diffuser',
    image: u('photo-1519710164239-da123dc03ef4'),
    description: 'A low-profile ceiling fitting with even, comfortable light for bedrooms, hallways and living rooms.',
    specs: [['Finish', 'Satin black, opal diffuser'], ['Power', '18W LED'], ['Colour temperature', '3000K to 4000K']],
  },
  {
    code: 'JK-PL-010', name: 'Architectural Panel', category: 'Ceiling lights',
    price: 38, availability: 'in', finish: 'White aluminium',
    description: 'A slim panel light with clean, uniform light for offices, shops and modern interiors.',
    specs: [['Finish', 'White aluminium'], ['Power', '24W LED'], ['Colour temperature', '4000K']],
  },
  {
    code: 'JK-DL-010', name: 'LED Downlight Set', category: 'Downlights',
    price: 24, availability: 'in', finish: 'White trim',
    image: u('photo-1519710164239-da123dc03ef4'), focus: '80% 30%',
    description: 'Recessed downlights for kitchens, corridors and modern ceilings. Confirm cut-out size when you order.',
    specs: [['Finish', 'White trim'], ['Type', 'Recessed LED'], ['Sold as', 'Set']],
  },
  {
    code: 'JK-WL-011', name: 'Arc Wall Sconce', category: 'Wall lights',
    price: 32, availability: 'in', finish: 'Matte black · frosted diffuser',
    image: u('photo-1494438639946-1ebd1d20bf85'),
    description: 'A directional wall light that throws a controlled wash of warm light up and down the wall.',
    specs: [['Finish', 'Matte black, frosted diffuser'], ['Power', '8W LED'], ['Colour temperature', '3000K']],
  },
  {
    code: 'JK-WL-018', name: 'Linear Wall Light', category: 'Wall lights',
    price: 42, badge: 'Staff pick', availability: 'in', finish: 'Graphite · opal diffuser',
    image: u('photo-1494438639946-1ebd1d20bf85'), focus: '30% 60%',
    description: 'A clean linear fitting for layered, ambient light in homes and hospitality spaces.',
    specs: [['Finish', 'Graphite, opal diffuser'], ['Power', '10W LED'], ['Colour temperature', '3000K']],
  },
  {
    code: 'JK-TL-014', name: 'Arc Table Lamp', category: 'Table & floor',
    price: 45, badge: 'New', availability: 'in', finish: 'Black · brushed metal',
    image: u('photo-1513506003901-1e6a229e2d15'),
    description: 'A clean-lined accent lamp for bedside tables, reading corners and desks.',
    specs: [['Finish', 'Black, brushed metal'], ['Fitting', 'E27 bulb (sold separately)']],
  },
  {
    code: 'JK-TL-026', name: 'Minimal Desk Light', category: 'Table & floor',
    price: 36, availability: 'in', finish: 'Matte black',
    image: u('photo-1513506003901-1e6a229e2d15'), focus: '70% 40%',
    description: 'Compact task light for workspaces, study areas and bedside tables.',
    specs: [['Finish', 'Matte black']],
  },
  {
    code: 'JK-FL-005', name: 'Modern Floor Lamp', category: 'Table & floor',
    price: 92, availability: 'order', finish: 'Black · linen shade',
    image: u('photo-1507473885765-e6ed057f782c'), focus: '50% 70%',
    description: 'A statement floor lamp for lounges, reading areas and quiet corners.',
    specs: [['Finish', 'Black frame, linen shade'], ['Fitting', 'E27 bulb (sold separately)']],
  },
  {
    code: 'JK-OL-021', name: 'Outdoor Lantern', category: 'Outdoor',
    price: 39, badge: 'Popular', availability: 'in', finish: 'Black metal · clear glass',
    image: u('photo-1505693416388-ac5ce068fe85'),
    description: 'A classic exterior wall lantern for entrances, patios and garden walls. Check the weather rating before installing.',
    specs: [['Finish', 'Black metal, clear glass'], ['Power', '9W LED'], ['Colour temperature', '2700K']],
  },
  {
    code: 'JK-OL-032', name: 'Garden Bollard', category: 'Outdoor',
    price: 28, availability: 'in', finish: 'Graphite · weather-resistant',
    image: u('photo-1510798831971-661eb04b3739'),
    description: 'A low-level outdoor light for paths, garden borders and landscaped spaces.',
    specs: [['Finish', 'Graphite, weather-resistant'], ['Power', '7W LED'], ['Colour temperature', '3000K']],
  },

  // ---------- Electrical (sample listings, add photos as you go) ----------
  {
    code: 'JK-EL-101', name: 'LED Bulb, warm white', category: 'LED bulbs & strips',
    price: 2.5, availability: 'in', finish: 'E27',
    description: 'Energy-saving LED bulb with a warm white light for everyday lamps and pendants.',
    specs: [['Fitting', 'E27'], ['Power', '9W'], ['Colour', 'Warm white']],
  },
  {
    code: 'JK-EL-102', name: 'LED Strip, 5 metre', category: 'LED bulbs & strips',
    price: 14, availability: 'in', finish: 'Warm white',
    description: 'Flexible LED strip for coves, shelves, kitchens and under-cabinet lighting. Power supply sold separately.',
    specs: [['Length', '5 m'], ['Colour', 'Warm white']],
  },
  {
    code: 'JK-EL-201', name: 'Double Socket, 13A', category: 'Switches & sockets',
    price: 6.5, availability: 'in', finish: 'White',
    description: 'Switched double wall socket for homes, offices and shops.',
    specs: [['Rating', '13A, 230V'], ['Finish', 'White']],
  },
  {
    code: 'JK-EL-202', name: 'Light Switch, 1 gang', category: 'Switches & sockets',
    price: 3.5, availability: 'in', finish: 'White',
    description: 'Single-gang, one-way wall light switch.',
    specs: [['Gangs', '1'], ['Finish', 'White']],
  },
  {
    code: 'JK-EL-301', name: 'Circuit Breaker, 20A', category: 'Cables & protection',
    price: 8, availability: 'in', finish: 'Single pole',
    description: 'Single-pole circuit breaker for distribution boards. Installation should be done by a qualified electrician.',
    specs: [['Rating', '20A'], ['Poles', '1']],
  },
  {
    code: 'JK-EL-302', name: 'Extension Lead, 4 way', category: 'Cables & protection',
    price: 15, availability: 'low', finish: '5 m cable',
    description: 'Four-socket extension lead with a 5 m cable.',
    specs: [['Sockets', '4'], ['Cable', '5 m']],
  },
]

export const AVAILABILITY = {
  in: { label: 'In stock', tone: 'ok' },
  low: { label: 'Low stock', tone: 'low' },
  order: { label: 'Ordered in on request', tone: 'order' },
}

const byCode = Object.fromEntries(PRODUCTS.map((p) => [p.code, p]))
export const getProduct = (code) => byCode[code] || null
export const categoryGroup = Object.fromEntries(CATEGORIES.map((c) => [c.name, c.group]))

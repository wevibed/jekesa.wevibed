# Jekesa Lighting & Electrical: website

React + Vite storefront. Customers browse, build an order list, and send it to Jekesa on WhatsApp. No payments are taken on the site.

## Run it

```bash
npm install
npm run dev      # local preview
npm run build    # production build into dist/
```

## The three things you will actually edit

1. **Products and prices:** `src/data/catalogue.js`. One entry per product. Change `price`, `availability`, `name`, and so on.
2. **Go live:** in the same file set `CATALOGUE_STATUS = 'live'`. This removes the "sample prices" notices.
3. **Real photos:** drop files into `src/assets/products/` named after the product code, e.g. `JK-PD-001.jpg` (second angle: `JK-PD-001_2.jpg`). They replace the placeholder automatically. Products with no photo show a neutral plate with the code.

WhatsApp number, address and phone are at the top of `catalogue.js` (`BUSINESS`).

## Make the hero more realistic

The hero is a real photo with a shoppable hotspot (`src/components/Hero.jsx`). Replace `src/assets/showroom-dining.jpg` with a photo of the actual showroom, set its size in `SCENE`, and put each hotspot's `x`/`y` (0 to 1 across the photo) on a fixture. Hotspot `code` must match a product in the catalogue.

## What is where

- `src/App.jsx`: page layout and state
- `src/components/`: Hero, Shop, ProductCard, ProductModal, OrderDrawer, Showroom3D, Sections
- `src/lib/whatsapp.js`: builds the WhatsApp order message
- `src/showroom/scene.js`: the 3D showroom (three.js, loaded only when opened)
- `src/studio.css`: 3D showroom styles; `src/styles.css`: everything else
- `src/showroom/hero-scene.js`: old 3D hero, no longer used (safe to delete)

## Notes

- Catalogue products, prices, stock levels and electrical specs are placeholders until Jekesa confirms them.
- The 3D showroom fixtures are simple procedural models. For a more realistic showroom, use photography of the real space.
- Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

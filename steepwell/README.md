# Steepwell – Loose-leaf Tea Shop

Capstone project (ApexPlanet Task 5: Final Project and Optimization). A responsive e-commerce web app built with plain HTML, CSS and JavaScript. No frameworks or build step.

## Features
- Product catalogue with live search, type filters and sorting (featured, price, name)
- Shopping cart drawer: add, change quantity, remove; saved in `localStorage`
- Checkout form with validation (name, email, 10-digit phone, 6-digit PIN) and order confirmation
- Light and dark theme toggle (respects system preference)
- Accessible: keyboard navigation, visible focus, ARIA labels, reduced-motion support

## Performance optimizations
- Zero image downloads: product art is inline SVG, rendered lazily with `IntersectionObserver`
- Only two small local files (`style.css`, `script.js`); script loaded with `defer`
- Single web font request with `preconnect` and system-font fallback
- Minimal animation, disabled for users who prefer reduced motion

## Cross-browser and mobile
- Standard CSS grid/flexbox, responsive from phones to desktop
- Fallbacks for browsers without `<dialog>` or `IntersectionObserver`
- Safe-area insets for notched phones
- Tested targets: Chrome, Firefox, Safari, mobile browsers

## Run locally
Open `index.html` in any browser.

## Deploy with GitHub Pages
1. Push these files to a GitHub repository.
2. Go to **Settings > Pages**, choose the `main` branch and `/ (root)`, then save.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

## Project structure
```
index.html   page structure
style.css    styles and themes
script.js    products, cart, filters, checkout logic
README.md    documentation
```

## Testing checklist
- [ ] Chrome, Firefox, Safari, Edge (desktop)
- [ ] Chrome and Safari on a phone
- [ ] Search, filter, sort work together
- [ ] Cart persists after refresh
- [ ] Checkout shows errors for bad input and success for valid input
- [ ] Lighthouse score checked in Chrome DevTools

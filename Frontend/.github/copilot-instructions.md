<!-- Copilot / AI agent instructions for the E4A static frontend -->
# E4A — AI Coding Agent Guidance

This repository is a small, static frontend demo (HTML/CSS/JS). The goal for an AI coding agent is to be immediately productive editing the UI, fixing missing assets, and keeping changes minimal and safe.

Key facts (big picture)
- Project type: static, client-side website (no backend). Main files: `index.html`, `shop.html`, `product.html`, `style.css`, `script.js`.
- Single JS entry: `script.js` contains app state, data, renderers and page-specific initialization. Changes here affect all pages.
- Data model: a single `PRODUCTS` array (in `script.js`) is the source-of-truth for products, categories and images.

Important patterns and places to edit
- Product data: edit `PRODUCTS` in `script.js`. Each product has {id, name, price, image, category, description}.
  - Images must be a valid URL or local relative path because product cards render `<img src="${p.image}">`.
  - Several entries use plain strings (e.g. `"Samsung"`) which indicate missing images — update these to real URLs or add local files and point `image` to `images/<file>`.
- Category list: categories are derived via `Array.from(new Set(PRODUCTS.map(p => p.category)))` inside `renderCategories()`.
- Product detail: `product.html` reads `?id=` and calls `renderProductDetail(id)` — keep that behavior when refactoring.
- Cart: client-only, stored under `localStorage` key `e4a_cart`. Functions: `addToCart`, `removeFromCart`, `saveCart`, `updateCartCount`.

Project-specific conventions
- Minimal JS: rendering is DOM-manipulation based (no frameworks). Keep changes small and DOM-friendly.
- IDs used by views: `featured-grid`, `shop-grid`, `product-detail`, `cart-count`, `categories-bar`, `global-search` — use these IDs when adding or wiring features.
- Page init function: `initE4A()` runs on `DOMContentLoaded`. Register page-specific handlers there.
- Demo UX: many actions use `alert(...)` for demo-only responses (signin/signup/checkout). Preserve or replace consciously.

Developer workflows
- No build step. To preview locally use a static server. Recommended commands (PowerShell):
  - Using Python 3: `python -m http.server 8000` from repo root and open `http://localhost:8000`.
  - Using VS Code Live Server extension: right-click `index.html` -> "Open with Live Server".
- Debugging: open browser DevTools Console to inspect runtime errors; look for network failures on image URLs.

How to fix missing images (practical example)
- Option A (preferred for reproducibility): add an `images/` directory at repo root, add real image files named by product id or slug (e.g. `images/product-1.jpg`) and update `PRODUCTS[i].image` to `"images/product-1.jpg"`.
- Option B quick patch: replace placeholder `image` values with stable Unsplash or CDN URLs directly in `script.js`.

Safety and minimal change guidance
- Prefer editing `script.js` `PRODUCTS` entries for missing data rather than rewriting renderers.
- If you need to add helper utilities, keep them near the top of `script.js` and avoid introducing build tooling.
- When adding assets, create an `images/` folder and update paths; do not commit large binaries without user confirmation.

Examples (use these file references when producing PRs)
- Update product 1 image by editing `script.js` PRODUCTS entry on the top of the file.
- To add a new category, add product objects whose `category` matches the desired label; the category UI is generated automatically.

If you're unsure
- Ask: should images be downloaded and committed into `images/` or referenced via remote URLs? If large batches are required, request permission first.

Next steps (recommended)
- 1) Replace missing `PRODUCTS[].image` placeholders with either CDN/Unsplash URLs or local `images/` files.
- 2) Validate by running a local static server and verifying `index.html`, `shop.html`, `product.html`, and `cart.html` render without console errors.
- 3) Optionally, add a small `scripts/fix-images.js` helper that maps bad image strings to defaults (only if the user asks).

-- E4A: concise guide for AI agents (end)

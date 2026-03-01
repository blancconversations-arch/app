# BLANC VISION (lean prototype)

A minimal “perception layer” UI:
- phone camera background
- sparse HUD + grid
- placeholder layers for topo / air / civic data
- built to stay clean (no dashboard clutter)

## Run locally
```bash
npm install
npm run dev
```

Open the dev URL on mobile (same Wi‑Fi) to test camera + heading:
- Vite shows the LAN URL in the terminal.

## Build
```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages (Vite)
1. In `vite.config.ts`, set:
   ```ts
   export default defineConfig({
     base: "/<your-repo-name>/",
     plugins: [react()],
   });
   ```
2. Build:
   ```bash
   npm run build
   ```
3. Push `dist/` via your preferred method (Pages action, or `gh-pages` branch).

## Next (real data)
This scaffold is ready for:
- DEM / hillshade tiles for topo
- nearest air sensor station lookup
- civic layers (zoning, parcels, OSM, permits)
- caching + offline packs

Keep one rule: **one glance, not a dashboard.**

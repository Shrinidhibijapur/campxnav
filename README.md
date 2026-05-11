<div align="center">
  <h1>🏛️ CampXNav</h1>
  <p><strong>The unofficial 3D campus navigator for Dayananda Sagar College of Engineering.</strong></p>
  <p>
    <a href="#about">About</a> •
    <a href="#features">Features</a> •
    <a href="#stack">Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#contributing">Contributing</a>
  </p>
  <br/>
  <img src="https://img.shields.io/badge/status-almost%20there-yellowgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" />
  <img src="https://img.shields.io/badge/MapLibre-GL%20JS-396CB2?style=flat-square" />

</div>

---

## About

Finding a building on DSCE's campus is annoying. The official site has the info, but going from "where is the CSE block" to actually standing in front of it takes too many steps.

CampXNav fixes that. Open it, search your department or block, and get walking directions from wherever you're standing — on a real 3D satellite map, not a Google Maps redirect.

**This is a student project. Not affiliated with DSCE officially.**

---

## Status

**Almost there. Finishing up the last bits.**

- [x] Building directory — all 41 locations with correct names and links
- [x] Live search by department, block name, or facility
- [x] 3D satellite map with building pins
- [x] Walking / driving navigation
- [x] Street View building previews
- [x] Stairway segment rendering
- [x] Turn-by-turn navigation panel
- [ ] Mobile navigation experience *(in progress)*
- [ ] Final polish *(in progress)*

---

## Features

- **41 campus locations** — every block, hostel, facility, and gate, all searchable
- **3D satellite map** — real aerial imagery with extruded buildings at street-level zoom
- **Live navigation** — turn-by-turn walking or driving directions from your GPS location
- **Stairway-aware routing** — outdoor campus stairways detected by terrain elevation, shown distinctly on the route
- **Building previews** — Street View photo + department list when you tap any pin
- **Fast** — instant distance without any API call; routes cached so you never wait twice for the same path
- **Mobile-first** — built for students walking around campus, works on desktop too

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (App Router) |
| Map Engine | MapLibre GL JS |
| Tiles & Terrain | MapTiler Cloud |
| Routing | OpenRouteService |
| Building Photos | Google Street View Static API |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion + GSAP |
| Language | TypeScript |

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm / yarn / pnpm

### Install

```bash
git clone https://github.com/yourusername/campxnav.git
cd campxnav
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# MapTiler — satellite tiles + 3D terrain (client-side, safe to expose)
# Free at: https://cloud.maptiler.com/account/
NEXT_PUBLIC_MAPTILER_KEY=your_key_here

# OpenRouteService — routing engine (server-side only, never expose)
# Free at: https://account.heigit.org/signup
ORS_API_KEY=your_key_here

# Google Maps Platform — Street View Static API for building photos (client-side)
# Free at: https://console.cloud.google.com/ → Enable "Street View Static API"
NEXT_PUBLIC_GSV_KEY=your_key_here
```

> **Note:** The ORS key is proxied through `/api/route` and never sent to the browser. Keep it server-side only.

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
campxnav/
├── src/
│   ├── app/
│   │   ├── api/route/        # ORS routing proxy (keeps API key server-side)
│   │   ├── map/              # Map page
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── map/              # CampusMap, NavigationPanel, markers, route layers
│   └── lib/
│       ├── buildings-geo.ts                  # All 41 buildings — names, coords, links
│       ├── campus-buildings-3d.ts            # 3D extrusion config
│       ├── map-styles.ts                     # Dark satellite hybrid style
│       └── building-appearance-presets.ts    # Theming for map elements
├── public/
├── package.json
└── tailwind.config.ts
```

---

## Contributing

Student project, open to anyone who wants to help.

Found a building in the wrong place, a wrong department name, or a broken link? Open an issue. Want to build something? Fork it.

```bash
git checkout -b feature/your-feature
git commit -m 'what you did'
git push origin feature/your-feature
# open a pull request
```

<div align="center">
  <h2>Built by students, for students. · DSCE Bangalore</h2>
</div>

# 🗺️ DSCE Campus Navigator — 3D Map & Navigation Implementation Plan

> **Goal:** Custom 3D satellite map with real-time navigation from user's location to any DSCE campus building  
> **Philosophy:** 100% open-source rendering engine + 2 free-tier API keys (one for tiles, one for routing)  
> **Stack:** MapLibre GL JS + MapTiler Cloud (satellite + 3D terrain) + OpenRouteService (routing)

---

## 🔑 API Keys Required From You (2 Total)

### 1. MapTiler Cloud API Key — FREE tier
**What it gives you:**
- Satellite imagery tiles (the actual aerial photo layer)
- 3D terrain elevation data (makes terrain actually pop in 3D)
- Dark vector map style as base
- 100,000 tile requests/month free → ~10,000 map views/month (a campus tool will never exceed this)

**How to get it:**
1. Go to → `https://cloud.maptiler.com/account/`
2. Sign up for free (no credit card required for free tier)
3. Dashboard → **API Keys** → copy your default key
4. ⚠️ Restrict the key to your Vercel domain (e.g., `https://your-app.vercel.app`) for safety

**Cost if exceeded:** Map just pauses until next month. No charges on free tier. ✅

---

### 2. OpenRouteService API Key — FREE tier
**What it gives you:**
- Turn-by-turn directions (walking + driving profiles)
- GeoJSON route geometry to draw on map
- Step-by-step instruction text (e.g., "Turn left onto Ring Road after 200m")
- **2,000 direction requests/day** free — more than enough for a campus app

**How to get it:**
1. Go to → `https://account.heigit.org/signup`
2. Sign up for free
3. Dashboard → copy your API key (looks like a JWT token starting with `eyJ...`)
4. ⚠️ **Important:** ORS keys must NOT be exposed client-side. You'll proxy it through a Next.js API route (`/api/route`) — the plan covers this.

**Cost:** 100% free, forever, for standard usage. ✅

---

## 🧱 Full Tech Stack

| Layer | Tool | License | Cost |
|---|---|---|---|
| Map Renderer | **MapLibre GL JS v5** | BSD open-source | Free |
| Satellite Tiles | **MapTiler Cloud** | Proprietary tiles, free tier | Free (100K req/mo) |
| 3D Building Extrusions | **OpenStreetMap via MapTiler vector tiles** | ODbL | Free |
| 3D Terrain (elevation mesh) | **MapTiler Terrain-RGB** | Proprietary, free tier | Free |
| Routing Engine | **OpenRouteService (ORS)** | Apache 2.0 | Free (2K req/day) |
| User Location | **Browser Geolocation API** | W3C standard | Free |
| React Bindings | **react-map-gl** (MapLibre flavour) | MIT | Free |
| Route Animation | **GSAP** + MapLibre camera API | GSAP standard license | Free |
| Turn-by-turn UI | Custom React component | — | Free |

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                    Browser (Client)                       │
│                                                          │
│  ┌─────────────────┐     ┌──────────────────────────┐   │
│  │  MapLibre GL JS │     │   Navigation Panel UI     │   │
│  │  (WebGL Canvas) │     │   - Step-by-step list     │   │
│  │                 │     │   - Distance / ETA        │   │
│  │  Layers:        │     │   - Walking / Driving     │   │
│  │  1. Satellite   │     │   - "Recenter" button     │   │
│  │  2. 3D Terrain  │     └──────────┬───────────────┘   │
│  │  3. 3D Buildings│                │                    │
│  │  4. Route Line  │     ┌──────────▼───────────────┐   │
│  │  5. Markers     │     │  /api/route (Next.js)     │   │
│  └─────────────────┘     │  Proxy → ORS API          │   │
│           │               │  (hides your API key)     │   │
│           │               └──────────────────────────┘   │
└───────────┼──────────────────────────────────────────────┘
            │
    ┌───────▼────────────────────────┐
    │  External APIs                 │
    │                                │
    │  MapTiler Cloud                │
    │  ├── satellite-v4 tiles        │
    │  ├── terrain-rgb-v2 tiles      │
    │  └── dataviz-dark vector style │
    │                                │
    │  OpenRouteService              │
    │  └── /v2/directions/foot-walk  │
    └────────────────────────────────┘
```

---

## 📁 File Structure (Map Module)

```
dsce-navigator/
├── app/
│   ├── map/
│   │   └── page.tsx              # Full-screen map page
│   └── api/
│       └── route/
│           └── route.ts          # ORS proxy (keeps API key server-side)
├── components/
│   ├── map/
│   │   ├── CampusMap.tsx         # Main MapLibre wrapper
│   │   ├── NavigationPanel.tsx   # Slide-up navigation drawer
│   │   ├── BuildingMarker.tsx    # Custom animated pin
│   │   ├── RouteLayer.tsx        # GeoJSON route line on map
│   │   ├── UserLocationDot.tsx   # Pulsing blue dot
│   │   └── MapControls.tsx       # Pitch/bearing/zoom controls
│   └── ui/
│       └── TransportToggle.tsx   # Walk / Drive toggle
└── lib/
    ├── buildings-geo.ts          # All 41 buildings with lat/lng coords
    └── map-styles.ts             # Dark satellite hybrid style config
```

---

## 📍 DSCE Building Coordinates (Pre-geocoded — Locked)

All 41 destination coordinates are **hardcoded** from the original site's Google Maps links. The user can never change these — they're locked destinations. Below are the key ones (full list in `buildings-geo.ts`):

```ts
// DSCE Campus Center: approx 12.9684° N, 77.7154° E (Dayananda Sagar Campus)
export const CAMPUS_CENTER: [number, number] = [77.7154, 12.9684];

export const buildings: BuildingGeo[] = [
  {
    sno: 1, name: "Heritage Block", buildingNo: "1",
    coordinates: [77.7149, 12.9680],
    googleMapsUrl: "https://maps.app.goo.gl/XJB4exGW3cn9igmL6"
  },
  {
    sno: 2, name: "Library", buildingNo: "2",
    coordinates: [77.7152, 12.9682],
    googleMapsUrl: "https://maps.app.goo.gl/6UZBP7tUxtcZudmC6"
  },
  // ... all 41 entries
];
```

> **Note:** The exact lat/lng per building will need a one-time verification pass using the Google Maps links. Claude can auto-extract these by reverse-geocoding the short URLs during the implementation pass.

---

## 🖥️ Map Initialization — `CampusMap.tsx`

```ts
const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      // Satellite imagery layer
      satellite: {
        type: 'raster',
        tiles: [`https://api.maptiler.com/tiles/satellite-v4/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`],
        tileSize: 256,
        attribution: '© MapTiler © OpenStreetMap contributors'
      },
      // Terrain elevation for 3D
      terrain: {
        type: 'raster-dem',
        url: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_KEY}`,
      },
      // Vector tiles for 3D building extrusions
      openmaptiles: {
        type: 'vector',
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${MAPTILER_KEY}`,
      }
    },
    layers: [
      // Base satellite
      { id: 'satellite', type: 'raster', source: 'satellite' },
      // 3D Building extrusions from OSM data
      {
        id: '3d-buildings',
        source: 'openmaptiles',
        'source-layer': 'building',
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#1a2744',
          'fill-extrusion-height': ['get', 'render_height'],
          'fill-extrusion-base': ['get', 'render_min_height'],
          'fill-extrusion-opacity': 0.85
        }
      }
    ],
    terrain: { source: 'terrain', exaggeration: 1.2 },
    sky: { 'sky-color': '#0a0f1e', 'sky-horizon-blend': 0.4 }
  },
  center: CAMPUS_CENTER,
  zoom: 16,
  pitch: 55,        // Tilted 3D view by default
  bearing: -20,
  maxPitch: 85,
  antialias: true
});
```

---

## 🧭 Navigation Flow — Step by Step

### 1. User Opens Map
- Map loads centered on DSCE campus at 55° pitch (3D buildings visible)
- All 41 building pins rendered as custom amber glow markers
- User location dot requests geolocation (`navigator.geolocation.watchPosition`)

### 2. User Taps a Building Pin
```
Click on "Building 19 (CSE Block)"
  → Marker pulses amber
  → Bottom drawer slides up with:
     - Building name + departments
     - Distance from current location (straight line, instant)
     - [ 🚶 Walk ]  [ 🚗 Drive ]  buttons
```

### 3. User Taps "Navigate"
```
Client → POST /api/route
  body: { from: [userLng, userLat], to: [buildingLng, buildingLat], profile: "foot-walking" }

Server → ORS API
  GET https://api.openrouteservice.org/v2/directions/foot-walking
  Authorization: Bearer ${ORS_KEY}

Response: GeoJSON route + step instructions
  ↓
Client draws route as animated line on map
Camera flies to fit both origin and destination
Turn-by-turn panel renders step list
```

### 4. Active Navigation
```
Live user dot updates via watchPosition
Route line persists
Top HUD shows: "Step 3 of 7 · Turn left · 45m"
Camera follows user in navigation mode (optional toggle)
```

### 5. Arrival
```
Distance < 20m → "You've arrived at Building 19" toast
Confetti micro-animation (canvas-confetti, 200ms burst)
Map re-centers on destination marker
```

---

## 🎨 Map Visual Style — Dark Hybrid

The map uses a **Dark Satellite Hybrid** style:

| Element | Style |
|---|---|
| Satellite base | Full-color aerial imagery (MapTiler satellite-v4) |
| 3D Buildings | Semi-transparent dark navy extrusions (#1a2744) |
| Active building | Glowing amber extrusion (#fbbf24) |
| Route line | Electric cyan (#22d3ee), 5px, dashed animation |
| User dot | Pulsing blue (#3b82f6) with white ring |
| Building pins | Custom SVG — amber diamond with building number |
| Road labels | White, Syne font, only at zoom 16+ |
| Terrain | Exaggeration 1.2x for subtle campus topography |
| Sky | Dark navy gradient |

---

## 🧩 Key Components

### `NavigationPanel.tsx`
```
┌────────────────────────────────────┐
│  ← Back          🧭 Navigating...  │
├────────────────────────────────────┤
│  📍 Building 19 · CSE Block        │
│     Computer Science & Engineering  │
├────────────────────────────────────┤
│  🚶 850m · ~10 min walk            │
│  🚗 1.2km · ~3 min drive           │
├────────────────────────────────────┤
│  Turn-by-turn steps:               │
│  ✅ Head north on Main Road        │
│  ▶  Turn right after Library       │
│     Pass Building 18               │
│     Arrive at Building 19          │
├────────────────────────────────────┤
│  [  🚶 Walk  ]   [  🚗 Drive  ]   │
│  [    Start Navigation    ]        │
└────────────────────────────────────┘
```

### `/api/route/route.ts` (ORS Proxy)
```ts
// Next.js API Route — keeps ORS key server-side
export async function POST(req: Request) {
  const { from, to, profile } = await req.json();
  const res = await fetch(
    `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
    {
      method: 'POST',
      headers: {
        'Authorization': process.env.ORS_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ coordinates: [from, to] })
    }
  );
  const data = await res.json();
  return Response.json(data);
}
```

### `RouteLayer.tsx` — Animated Dashed Line
```ts
// Animated dashed line — gives moving "flow" effect
map.addLayer({
  id: 'route-line',
  type: 'line',
  source: 'route',
  paint: {
    'line-color': '#22d3ee',
    'line-width': 5,
    'line-dasharray': [2, 1],
    'line-opacity': 0.9
  }
});

// Animate the dash offset for flow effect
let dashOffset = 0;
function animateDash() {
  dashOffset -= 0.5;
  map.setPaintProperty('route-line', 'line-dasharray', [2, 1]);
  requestAnimationFrame(animateDash);
}
```

---

## ✅ Environment Variables Setup

In your `.env.local` (and Vercel environment settings):

```env
# MapTiler API Key (public — used client-side for tiles)
NEXT_PUBLIC_MAPTILER_KEY=your_maptiler_key_here

# OpenRouteService API Key (private — NEVER expose client-side)
ORS_API_KEY=your_ors_jwt_key_here
```

**Vercel setup:** Dashboard → Project → Settings → Environment Variables → add both.

---

## 📋 Implementation Phases (Map Module)

### Phase M1 — Static Map with Markers
**Prompt focus:** "Set up MapLibre GL JS with MapTiler satellite+3D terrain+3D building extrusions. Place amber markers for all 41 DSCE buildings. Dark satellite hybrid style. Pitch 55°."
- [ ] `CampusMap.tsx` with satellite + terrain + 3D buildings
- [ ] Custom building markers (SVG amber diamond)
- [ ] Campus center + all 41 building coordinates loaded
- [ ] Mobile responsive (touch gestures work)

### Phase M2 — User Location
**Prompt focus:** "Add live user location tracking with pulsing blue dot. Show straight-line distance from user to each marker on hover/tap."
- [ ] `UserLocationDot.tsx` — pulsing CSS animation
- [ ] `watchPosition` with error handling (permission denied gracefully)
- [ ] Haversine distance calculation (no API needed, pure math)

### Phase M3 — ORS Routing Backend
**Prompt focus:** "Create Next.js API route at /api/route that proxies to OpenRouteService. Accept POST { from, to, profile }. Return GeoJSON route + step instructions."
- [ ] `/api/route/route.ts` proxy
- [ ] Error handling (ORS rate limit, no route found, user offline)
- [ ] Support both `foot-walking` and `driving-car` profiles

### Phase M4 — Navigation UI
**Prompt focus:** "Build NavigationPanel drawer component. Shows building info, distance/ETA, transport toggle, turn-by-turn steps. Slides up from bottom on mobile, side panel on desktop."
- [ ] `NavigationPanel.tsx` — bottom sheet mobile / sidebar desktop
- [ ] `TransportToggle.tsx` — walk/drive with animated switch
- [ ] Step-by-step list with progress tracking
- [ ] "Arrived" state + toast + confetti burst

### Phase M5 — Route Animation & Camera
**Prompt focus:** "Animate route line on map with flowing dash effect. Camera flyTo to fit route bounds. In navigation mode, camera follows user location with smooth transitions."
- [ ] `RouteLayer.tsx` — animated cyan dashed line
- [ ] `camera.fitBounds()` on route load
- [ ] Follow-mode toggle — camera tracks user
- [ ] GSAP camera transition on building select

---

## 🚨 Gotchas & Things to Handle

| Issue | Solution |
|---|---|
| User denies geolocation | Show "Enable location for navigation" banner; markers still work for info |
| ORS can't find route (building too close / off-road) | Fallback: open Google Maps link in new tab |
| MapTiler free tier exhausted | Map tiles fail gracefully; show OpenStreetMap raster fallback |
| Mobile keyboard covers navigation panel | CSS `env(safe-area-inset-bottom)` padding |
| 3D buildings not visible at campus zoom | Force `minzoom: 15`, ensure pitch > 40° |
| ORS API key leaked | Never send from client; always proxy through `/api/route` |

---

## 🔗 Quick Reference — Signup URLs

| Service | URL | Time to get key |
|---|---|---|
| MapTiler Cloud | `https://cloud.maptiler.com/account/` | < 2 min |
| OpenRouteService | `https://account.heigit.org/signup` | < 2 min |

---

## 📊 Total API Summary

| Service | Free Limit | Your Expected Usage | Will it be enough? |
|---|---|---|---|
| MapTiler tiles | 100K requests/month | ~5K for a campus tool | ✅ Yes |
| ORS Directions | 2,000/day · 40/min | ~50/day peak | ✅ Yes |
| Browser Geolocation | Unlimited | Per-session | ✅ Yes |
| OpenFreemap (fallback tiles) | Unlimited | Fallback only | ✅ Yes |

---

*Map Navigation Plan for DSCE Campus Navigator · May 2026*

# 🗺️ DSCE Map Upgrade — Focused Build Plan
> Addendum to `implementation_plan.md` and `map_navigation_plan.md`
> This file covers ONLY the delta: map visual upgrade + corrected building data + fast routing

---

## ✅ What's Already Decided (Don't Re-explain to Claude)
- Stack: MapLibre GL JS + MapTiler + OpenRouteService proxy
- Colors: amber pins, cyan route line, dark satellite base
- All animation libs already chosen in implementation_plan.md

---

## 🏗️ CORRECTED BUILDING DATA — All 41 Entries (Source of Truth)

Use these EXACT names, numbers, and links. Nothing else.

```ts
export const buildings = [
  { sno:1,  no:"1",    label:"Heritage", name:"Heritage Block",
    depts:["Heritage Block"],
    link:"https://maps.app.goo.gl/XJB4exGW3cn9igmL6" },

  { sno:2,  no:"2",    label:"Lib",      name:"Library",
    depts:["Library"],
    link:"https://maps.app.goo.gl/6UZBP7tUxtcZudmC6" },

  { sno:3,  no:"3",    label:"AU",       name:"Automobile Engineering",
    depts:["Automobile Engineering"],
    link:"https://maps.app.goo.gl/YXBYzrH3yrp2iBN36" },

  { sno:4,  no:"4",    label:"NEB",      name:"New Engineering Block (NEB)",
    depts:["Aeronautics Engineering","CS & Data Science","CS & Business Studies","Electrical Dept","Mathematics Dept"],
    link:"https://maps.app.goo.gl/EnDnBN9hEnhUQWF29" },

  { sno:5,  no:"5",    label:"Mech",     name:"Mechanical Engineering",
    depts:["Mechanical Engineering"],
    link:"https://maps.app.goo.gl/vDEEA1D5jGBpzdJF9" },

  { sno:6,  no:"6",    label:"NMech",    name:"New Mechanical Block",
    depts:["New Mechanical Engineering Block"],
    link:"https://maps.app.goo.gl/vDEEA1D5jGBpzdJF9" },

  { sno:7,  no:"7",    label:"EE",       name:"Electrical & Electronics Engg",
    depts:["Electrical and Electronic Engineering"],
    link:"https://maps.app.goo.gl/qnoj4SfDaWrSmjrm6" },

  { sno:8,  no:"8",    label:"RAI",      name:"Robotics & AI Block",
    depts:["Robotics and Artificial Intelligence"],
    link:"https://maps.app.goo.gl/bn83Fqa4PaowWXcs5" },

  { sno:9,  no:"9",    label:"CH",       name:"Chemical Engineering",
    depts:["Chemical Engineering","Chemistry Department"],
    link:"https://maps.app.goo.gl/GEgPknuV8aZv4JFLA" },

  { sno:10, no:"10",   label:"BT",       name:"Biotechnology & Cybersecurity Block",
    depts:["Biotechnology Engineering","Cybersecurity","Cybersecurity IOT & Blockchain","CD Sagar Auditorium","CIL"],
    links:["https://maps.app.goo.gl/Yy5xVJWpym8NniCm9","https://maps.app.goo.gl/EhtKYRXJWE1qupNk6"] },

  { sno:11, no:"11",   label:"NRI-H",    name:"NRI Boys Hostel",
    depts:["NRI Boys Hostel","Gym","NRI Hostel Mess"],
    link:"https://maps.app.goo.gl/dxtd86e2n7yxFUXG7" },

  { sno:12, no:"12",   label:"PUC",      name:"PUC Block",
    depts:["PUC"],
    link:"https://maps.app.goo.gl/LK6KGQZpPm69nznb7" },

  { sno:13, no:"13",   label:"MBA",      name:"Business Block",
    depts:["Business Block","MCA (VTU)"],
    link:"https://maps.app.goo.gl/WGAcL2V6RmVnnXZ66" },

  { sno:14, no:"14",   label:"Arch",     name:"Architecture Block",
    depts:["Architecture Block","COE"],
    link:"https://maps.app.goo.gl/xqxhHAqnvhYcDceg9" },

  { sno:15, no:"15",   label:"MBA2",     name:"MBA Block",
    depts:["MBA","PG Diploma"],
    link:"https://maps.app.goo.gl/T4taTXZRaPHgjzFR7" },

  { sno:16, no:"16",   label:"Schl",     name:"School",
    depts:["School"],
    link:"https://maps.app.goo.gl/DyFPugryAbsLj8Sv9" },

  { sno:17, no:"17",   label:"EC",       name:"Electronics Block",
    depts:["Electronics & Communication Engg","Electronics & Telecom","BCA","MCA","B.Arch"],
    link:"https://maps.app.goo.gl/ghdBg1mqNX4GfaW1A" },

  { sno:18, no:"18",   label:"IS",       name:"Innovation Space",
    depts:["Innovation Space (CSE / ISE / AIML)"],
    link:"https://maps.app.goo.gl/2i21F4zEkX9Q1nvY8" },

  { sno:19, no:"19",   label:"CSE",      name:"CSE / ISE / AIML Block",
    depts:["Computer Science & Engineering","Information Science Engg","AI & Machine Learning","Physics Dept"],
    link:"https://maps.app.goo.gl/YXBYzrH3yrp2iBN36" },

  { sno:20, no:"20",   label:"G-H",      name:"Girls Hostel",
    depts:["Girls Hostel"],
    link:"https://maps.app.goo.gl/DMEqcBNTKBkq3vsy5" },

  { sno:21, no:"21",   label:"NMH",      name:"Nelson Mandela Old Hostel",
    depts:["Nelson Mandela Old Hostel"],
    link:"https://maps.app.goo.gl/XigyWbdsS24TPWkB8" },

  { sno:22, no:"22",   label:"CD",       name:"Chocolate Building",
    depts:["CS & Design Engineering","Medical Electronics","Electronics & Instrumentation"],
    link:"https://maps.app.goo.gl/uVTUVArGaXX1dqZR6" },

  { sno:23, no:"23",   label:"IBH",      name:"Indian Boys Hostel",
    depts:["Indian Boys Hostel"],
    link:"https://maps.app.goo.gl/PmvhTD28ciXYwuJy8" },

  { sno:24, no:"24",   label:"Civil",    name:"Polytechnic / Civil Block",
    depts:["Polytechnic","Civil Engineering"],
    link:"https://maps.app.goo.gl/skHR2qxpHxDLPJxQ8" },

  { sno:25, no:"25",   label:"Dent",     name:"Dental & Admission Block",
    depts:["Dental","City of Admission"],
    link:"https://maps.app.goo.gl/PPQted9ATLLGEAWD7" },

  { sno:26, no:"26",   label:"Adm",      name:"Hall of Admission",
    depts:["Hall of Admission"],
    link:"https://maps.app.goo.gl/kpoS9xJvM38pU2qT8" },

  { sno:27, no:"--",   label:"Aud",      name:"Dr. D. Premachandra Sagar Auditorium",
    depts:["Dr D Premachandra Sagar Auditorium","Center for Performing Arts"],
    link:"https://maps.app.goo.gl/iJcoARKjhDxE9qS19" },

  { sno:28, no:"--",   label:"Amph",     name:"Amphi Theatre",
    depts:["Amphi Theatre"],
    link:"https://maps.app.goo.gl/nsu6wrxGZYBW1n3a6" },

  { sno:29, no:"--",   label:"Tmpl",     name:"Shavige Malleshwara Temple",
    depts:["Shavige Malleshwara Temple"],
    link:"https://maps.app.goo.gl/CDYrikyh7RXm7fCv7" },

  { sno:30, no:"--",   label:"IMess",    name:"Indian Hostel Mess",
    depts:["Indian Hostel Mess"],
    link:"https://maps.app.goo.gl/UvT115vACWj82LwWA" },

  { sno:31, no:"--",   label:"GMess",    name:"Girls Hostel Mess",
    depts:["Girls Hostel Mess"],
    link:"https://maps.app.goo.gl/swcWcDVRzm46nPUn6" },

  { sno:32, no:"--",   label:"Food",     name:"Canteen",
    depts:["Canteen"],
    link:"https://maps.app.goo.gl/kioxSYiJcYuZiHhXA" },

  { sno:33, no:"--",   label:"Grnd",     name:"Football Ground",
    depts:["Football Ground"],
    link:"https://maps.app.goo.gl/3mEvVrYP8sXFLLh77" },

  { sno:34, no:"--",   label:"Gate1",    name:"Main Gate 1",
    depts:["Main Gate 1"],
    link:"https://maps.app.goo.gl/aW5MvAu7CfnJX3d18" },

  { sno:35, no:"--",   label:"Gate2",    name:"Main Gate 2",
    depts:["Main Gate 2"],
    link:"https://maps.app.goo.gl/5DBPp36KGQbgwC1J8" },

  { sno:36, no:"--",   label:"P-S",      name:"Student Parking",
    depts:["Students Vehicle Parking"],
    link:"https://maps.app.goo.gl/skud2i41SjYoFhQZ6" },

  { sno:37, no:"--",   label:"P-F",      name:"Faculty Parking",
    depts:["Faculty Vehicle Parking"],
    link:"https://maps.app.goo.gl/Eig6r2WGqaT65nQD9" },

  { sno:38, no:"--",   label:"Conv",     name:"Conveno",
    depts:["Conveno"],
    link:"https://maps.app.goo.gl/dZP5ib98JTcsRhm37" },

  { sno:39, no:"--",   label:"Xerox",    name:"Xerox",
    depts:["Xerox"],
    link:"https://maps.app.goo.gl/SmV94qVTPooFK2Ek7" },

  { sno:40, no:"--",   label:"WR-G1",    name:"Washroom near Gate 1",
    depts:["Washroom near Main Gate 1"],
    link:"https://maps.app.goo.gl/GTNi4rw6wXaNtvMp8" },

  { sno:41, no:"--",   label:"WR-H",     name:"Washroom near Heritage",
    depts:["Washroom near Heritage Building"],
    link:"https://maps.app.goo.gl/SDpVe6tCaGRFEXRE7" },
];
```

---

## 🗺️ Map Visual Upgrades (Delta from existing plan)

### 1. Remove the Blue Building Overlay
The blue tint in your screenshot comes from MapLibre's `fill-extrusion` layer using a dark color at low opacity over the satellite. Fix:

```ts
// REMOVE this or set opacity to 0 when zoom < 17
'fill-extrusion-opacity': [
  'interpolate', ['linear'], ['zoom'],
  15, 0,      // invisible below zoom 15
  17, 0.6     // only show 3D extrusions when zoomed in close
]
```
At campus overview zoom (16), satellite shows clean with no blue wash.

### 2. Google Street View Photo on Pin Tap
When a user taps a marker, fetch the Street View Static image as the card thumbnail.

```ts
// Street View Static API — FREE, no key needed for basic usage
// (Uses the same Maps API your Google Maps links already open)
const streetViewUrl = (lat: number, lng: number) =>
  `https://maps.googleapis.com/maps/api/streetview?size=400x200&location=${lat},${lng}&fov=90&key=${GOOGLE_SV_KEY}`;
```

> ⚠️ **One more API key needed:** Google Street View Static API
> - Free tier: **28,000 requests/month**
> - Get it: `https://console.cloud.google.com/` → Enable "Street View Static API" → Copy key
> - Restrict to your domain. Add to `.env.local` as `NEXT_PUBLIC_GSV_KEY`
> - This is the ONLY additional key beyond the two already planned.

Card layout when pin tapped:
```
┌──────────────────────────────────┐
│  [Street View photo — 400×200]   │
├──────────────────────────────────┤
│  🏛 Building 19 · CSE Block      │
│  CS Engineering · ISE · AIML     │
│  Physics Dept                    │
├──────────────────────────────────┤
│  📍 850m away · ~10 min walk     │
│  [ 🚶 Walk ]   [ 🚗 Drive ]      │
└──────────────────────────────────┘
```

### 3. Pin Label Style — Number + Short Code Stacked
```tsx
// Custom MapLibre marker HTML
`<div class="pin">
  <span class="pin-number">${building.no}</span>   <!-- "19" -->
  <span class="pin-label">${building.label}</span>  <!-- "CSE" -->
</div>`
```
CSS: amber pill, number bold top, label smaller below, drop shadow, scale-up on hover.

---

## ⚡ Navigation Speed Fixes

The original screenshot's navigation was slow because of 3 bottlenecks. Fix all three:

### Fix 1 — Precompute straight-line distance client-side (instant)
Don't call ORS just to show distance. Use Haversine math:
```ts
function haversine(from: [number,number], to: [number,number]): number {
  const R = 6371000; // meters
  const dLat = (to[1]-from[1]) * Math.PI/180;
  const dLng = (to[0]-from[0]) * Math.PI/180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(from[1]*Math.PI/180) * Math.cos(to[1]*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
```
Show this instantly on pin tap. ORS call only fires when user hits "Start Navigation".

### Fix 2 — Cache ORS responses in sessionStorage
Same route requested twice (very common on campus) = instant replay:
```ts
const cacheKey = `route_${from.join(',')}_${to.join(',')}`;
const cached = sessionStorage.getItem(cacheKey);
if (cached) return JSON.parse(cached);
const result = await fetchORS(from, to);
sessionStorage.setItem(cacheKey, JSON.stringify(result));
return result;
```

### Fix 3 — Abort stale ORS requests
If user taps a second building before the first route loads, abort the pending fetch:
```ts
const abortRef = useRef<AbortController>();
// On new navigation request:
abortRef.current?.abort();
abortRef.current = new AbortController();
fetch('/api/route', { signal: abortRef.current.signal, ... });
```

---

## 🪜 Route–Stair–Route Navigation (Outdoor Terrain Stairs)

ORS handles outdoor pedestrian paths automatically via OpenStreetMap footway data. DSCE's campus stairways are already mapped in OSM.

To make the stair segments visible and distinct:

```ts
// After getting ORS GeoJSON, tag segments by elevation change
// ORS returns `way_points` with elevation if you request it:

body: JSON.stringify({
  coordinates: [from, to],
  elevation: true,           // ← request elevation data
  instructions: true,
  units: "m"
})

// Then in route rendering, split segments by elevation delta:
// elevation change > 2m per 10m distance = stair segment
```

Render stair segments differently on map:
```ts
// Normal path: solid cyan line
// Stair segment: dashed amber line with stair icon at midpoint
map.addLayer({
  id: 'route-stairs',
  type: 'line',
  source: 'route-stairs',
  paint: {
    'line-color': '#fbbf24',  // amber for stairs
    'line-width': 4,
    'line-dasharray': [1, 1]
  }
});
```

Turn-by-turn instruction panel shows: `🪜 Use stairway · +12m elevation`

---

## 🔑 Final API Key Summary (3 Total)

| # | Service | Use | Free Limit | Get It At |
|---|---|---|---|---|
| 1 | **MapTiler Cloud** | Satellite tiles + 3D terrain + vector buildings | 100K req/mo | `cloud.maptiler.com` |
| 2 | **OpenRouteService** | Turn-by-turn routing + elevation + stair detection | 2K req/day | `account.heigit.org` |
| 3 | **Google Street View Static** | Building preview photo on pin tap | 28K req/mo | `console.cloud.google.com` |

`.env.local`:
```env
NEXT_PUBLIC_MAPTILER_KEY=xxx
NEXT_PUBLIC_GSV_KEY=xxx
ORS_API_KEY=xxx        # server-side only, never NEXT_PUBLIC_
```

---

## 📋 Build Phases (Map Upgrade Only)

| Phase | Task | Prompt Hint |
|---|---|---|
| **M1** | Load corrected building data + fixed pins (number + label stacked, amber, no blue wash) | "Replace building data with corrected 41-entry array. Fix blue overlay. Show stacked number+label pins." |
| **M2** | Street View photo card on tap + haversine distance (instant, no API) | "On marker tap, show Street View Static image card + dept list + instant haversine distance." |
| **M3** | ORS routing with elevation, stair segment detection, cached + aborted properly | "Route with elevation:true, cache in sessionStorage, abort on new request, render stair segments in amber dashed." |
| **M4** | Navigation panel + live GPS follow + arrival detection | "Build slide-up nav panel, watchPosition, camera follow toggle, confetti on arrival <20m." |

---

*Addendum to DSCE Campus Navigator build plan · May 2026*

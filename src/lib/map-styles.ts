import type { StyleSpecification } from "maplibre-gl";

// ============================================================
// Map Style Configuration
// Priority: Google Satellite → MapTiler Hybrid → Esri Satellite
// ============================================================

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || "";
const GOOGLE_KEY = process.env.NEXT_PUBLIC_GSV_KEY || "";

/**
 * Returns the best satellite map style.
 * Priority: Google Satellite (session-based) → MapTiler Hybrid → Esri Satellite
 */
export function getMapStyleUrl(googleSession?: string): string | StyleSpecification {
  // Option 1: Google Maps satellite tiles (looks exactly like Google Maps)
  if (googleSession && GOOGLE_KEY) {
    return {
      version: 8,
      sources: {
        "google-satellite": {
          type: "raster",
          tiles: [
            `https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${googleSession}&key=${GOOGLE_KEY}`
          ],
          tileSize: 256,
          maxzoom: 22,
          attribution: "Map data ©Google"
        }
      },
      layers: [
        {
          id: "google-satellite",
          type: "raster",
          source: "google-satellite",
          minzoom: 0,
          maxzoom: 22
        }
      ]
    };
  }

  // Option 2: MapTiler hybrid (satellite + labels + vector data for 3D buildings)
  if (MAPTILER_KEY && MAPTILER_KEY !== "YOUR_MAPTILER_KEY_HERE") {
    return `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`;
  }

  // Option 3: Esri World Imagery (free, no key required)
  return {
    version: 8,
    sources: {
      "esri-satellite": {
        type: "raster",
        tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
        tileSize: 256,
        attribution: "Tiles &copy; Esri"
      }
    },
    layers: [
      {
        id: "satellite",
        type: "raster",
        source: "esri-satellite",
        minzoom: 0,
        maxzoom: 22
      }
    ]
  };
}

// Pure MapTiler satellite (no labels)
export function getMapTilerSatelliteUrl(): string | null {
  if (!MAPTILER_KEY || MAPTILER_KEY === "YOUR_MAPTILER_KEY_HERE") return null;
  return `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`;
}

// 3D Building extrusion layer config — varied realistic rooftop colors
// Each building gets a different color based on its height + base, simulating
// the natural variation you see in real satellite imagery
export const BUILDING_EXTRUSION_LAYER = {
  id: "3d-buildings-custom",
  type: "fill-extrusion" as const,
  source: "openmaptiles",
  "source-layer": "building",
  minzoom: 14,
  paint: {
    // Use a step expression on render_min_height to bucket buildings into
    // different color families, creating realistic per-building variation
    "fill-extrusion-color": [
      "case",
      // Bucket 1: ground-level short buildings → weathered concrete
      ["<", ["coalesce", ["get", "render_height"], 8], 6],
      "#a89b8c",
      // Bucket 2: ~2 floor buildings → warm beige
      ["<", ["coalesce", ["get", "render_height"], 8], 10],
      [
        "step", ["coalesce", ["get", "render_min_height"], 0],
        "#b5a99a",   // beige
        0.5, "#c2b8a8", // lighter beige
        1, "#a89e93"    // gray-beige
      ],
      // Bucket 3: ~3 floor buildings → varied gray/cream
      ["<", ["coalesce", ["get", "render_height"], 8], 14],
      [
        "step", ["coalesce", ["get", "render_min_height"], 0],
        "#bfb5a8",   // warm gray
        0.5, "#c9c1b5", // cream
        1, "#b0a598"    // darker gray
      ],
      // Bucket 4: ~4 floor buildings → lighter concrete
      ["<", ["coalesce", ["get", "render_height"], 8], 18],
      [
        "step", ["coalesce", ["get", "render_min_height"], 0],
        "#c4bdb3",   // light concrete
        0.5, "#d1cab0", // yellowish
        1, "#bdb5a9"    // neutral concrete
      ],
      // Bucket 5: tall 5+ floor buildings → white/off-white
      [
        "step", ["coalesce", ["get", "render_min_height"], 0],
        "#ddd7ce",   // off-white
        0.5, "#e2dcd5", // white painted
        1, "#d4cdc2"    // cream
      ]
    ],
    "fill-extrusion-height": ["coalesce", ["get", "render_height"], 8],
    "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
    "fill-extrusion-opacity": [
      "interpolate", ["linear"], ["zoom"],
      15, 0,
      16.5, 0.4,
      17, 0.65,
      18, 0.75
    ],
    // Vertical gradient: darker at base (shadow), lighter at top (sunlight)
    "fill-extrusion-vertical-gradient": true,
  }
};

// Style constants
export const MAP_COLORS = {
  markerAmber: "#fbbf24",
  markerAmberGlow: "rgba(251, 191, 36, 0.4)",
  routeCyan: "#22d3ee",
  routeCyanGlow: "rgba(34, 211, 238, 0.3)",
  userBlue: "#3b82f6",
  textPrimary: "#f8fafc",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
};

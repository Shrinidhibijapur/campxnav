import type { StyleSpecification } from "maplibre-gl";

// ============================================================
// Map Style Configuration
// Priority: Google Satellite (XYZ) → MapTiler Hybrid → Esri Satellite
// ============================================================

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || "";
const GOOGLE_KEY = process.env.NEXT_PUBLIC_GSV_KEY || "";

/**
 * Returns the best satellite map style.
 * Uses Google Maps satellite tiles for maximum zoom and clarity.
 * Falls back to MapTiler hybrid, then Esri World Imagery.
 */
export function getMapStyleUrl(googleSession?: string): string | StyleSpecification {
  // Option 1: Google Maps satellite tiles with session token (Map Tiles API)
  if (googleSession && GOOGLE_KEY) {
    return {
      version: 8,
      glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
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

  // Option 2: Google Satellite XYZ tiles (standard web tiles, no API key needed for basic usage)
  // These provide excellent high-zoom satellite imagery
  if (GOOGLE_KEY) {
    return {
      version: 8,
      glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
      sources: {
        "google-satellite": {
          type: "raster",
          tiles: [
            "https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            "https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
            "https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          ],
          tileSize: 256,
          maxzoom: 21,
          attribution: "Imagery ©Google"
        },
        "google-roads": {
          type: "raster",
          tiles: [
            "https://mt0.google.com/vt/lyrs=h&x={x}&y={y}&z={z}",
            "https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}"
          ],
          tileSize: 256,
          maxzoom: 21,
          attribution: "Labels ©Google"
        }
      },
      layers: [
        {
          id: "google-satellite",
          type: "raster",
          source: "google-satellite",
          minzoom: 0,
          maxzoom: 21
        },
        {
          id: "google-roads",
          type: "raster",
          source: "google-roads",
          minzoom: 0,
          maxzoom: 21,
          paint: {
            "raster-opacity": 0.65
          }
        }
      ]
    };
  }

  // Option 3: MapTiler hybrid (satellite + labels + vector data)
  if (MAPTILER_KEY && MAPTILER_KEY !== "YOUR_MAPTILER_KEY_HERE") {
    return `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`;
  }

  // Option 4: Google Satellite XYZ tiles (no API key needed) — best fallback
  return {
    version: 8,
    glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
    sources: {
      "google-satellite": {
        type: "raster",
        tiles: [
          "https://mt0.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
          "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
          "https://mt2.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
          "https://mt3.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        ],
        tileSize: 256,
        maxzoom: 21,
        attribution: "Imagery ©Google"
      },
      "google-roads": {
        type: "raster",
        tiles: [
          "https://mt0.google.com/vt/lyrs=h&x={x}&y={y}&z={z}",
          "https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}"
        ],
        tileSize: 256,
        maxzoom: 21,
        attribution: "Labels ©Google"
      }
    },
    layers: [
      {
        id: "google-satellite",
        type: "raster",
        source: "google-satellite",
        minzoom: 0,
        maxzoom: 21
      },
      {
        id: "google-roads",
        type: "raster",
        source: "google-roads",
        minzoom: 0,
        maxzoom: 21,
        paint: {
          "raster-opacity": 0.95
        }
      }
    ]
  };
}

// Pure MapTiler satellite (no labels)
export function getMapTilerSatelliteUrl(): string | null {
  if (!MAPTILER_KEY || MAPTILER_KEY === "YOUR_MAPTILER_KEY_HERE") return null;
  return `https://api.maptiler.com/maps/satellite/style.json?key=${MAPTILER_KEY}`;
}

// 3D Building extrusion layer config for OpenMapTiles vector source
// Used when vector tile source is available (MapTiler)
export const BUILDING_EXTRUSION_LAYER = {
  id: "3d-buildings-custom",
  type: "fill-extrusion" as const,
  source: "openmaptiles",
  "source-layer": "building",
  minzoom: 14,
  paint: {
    "fill-extrusion-color": "#e2e8f0",
    "fill-extrusion-height": ["coalesce", ["get", "render_height"], 8],
    "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
    "fill-extrusion-opacity": [
      "interpolate", ["linear"], ["zoom"],
      15, 0,
      16.5, 0.4,
      17, 0.7,
      18, 0.8
    ],
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

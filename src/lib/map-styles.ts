// ============================================================
// Map Style Configuration
// Uses OpenFreeMap (free, no API key needed) as PRIMARY base
// MapTiler satellite can be added as overlay when key works
// ============================================================

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || "";

// Always use OpenFreeMap positron as the primary style — guaranteed to work
export function getMapStyleUrl(): string {
  return "https://tiles.openfreemap.org/styles/positron";
}

// MapTiler hybrid for satellite overlay (when key works)
export function getMapTilerStyleUrl(): string | null {
  if (!MAPTILER_KEY || MAPTILER_KEY === "YOUR_MAPTILER_KEY_HERE") return null;
  return `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`;
}

// 3D Building extrusion layer config — for OpenFreeMap (openmaptiles source)
export const BUILDING_EXTRUSION_LAYER = {
  id: "3d-buildings-custom",
  type: "fill-extrusion" as const,
  source: "openmaptiles",
  "source-layer": "building",
  minzoom: 14,
  paint: {
    "fill-extrusion-color": [
      "interpolate", ["linear"], ["get", "render_height"],
      0, "#6366f1",
      10, "#818cf8",
      20, "#a5b4fc",
      30, "#c7d2fe",
    ],
    "fill-extrusion-height": ["coalesce", ["get", "render_height"], 8],
    "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
    "fill-extrusion-opacity": 0.7,
  },
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

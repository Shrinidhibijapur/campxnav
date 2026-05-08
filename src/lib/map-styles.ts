// ============================================================
// Map Style Configuration
// Uses MapTiler as PRIMARY (dark style for premium look)
// Falls back to OpenFreeMap if no key
// ============================================================

const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY || "";

/**
 * Returns the best available map style URL.
 * - If a MapTiler key is configured, uses MapTiler's streets-dark style
 *   for a premium dark-themed look that matches the app UI.
 * - Falls back to OpenFreeMap liberty (better compatibility than positron)
 */
export function getMapStyleUrl(): string {
  // Use MapTiler dark streets if key is available
  if (MAPTILER_KEY && MAPTILER_KEY !== "YOUR_MAPTILER_KEY_HERE") {
    return `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`;
  }
  // Fallback: OpenFreeMap liberty style (better MapLibre v5 compat than positron)
  return "https://tiles.openfreemap.org/styles/liberty";
}

// MapTiler hybrid/satellite for satellite overlay
export function getMapTilerSatelliteUrl(): string | null {
  if (!MAPTILER_KEY || MAPTILER_KEY === "YOUR_MAPTILER_KEY_HERE") return null;
  return `https://api.maptiler.com/maps/hybrid/style.json?key=${MAPTILER_KEY}`;
}

// 3D Building extrusion layer config — works with openmaptiles source
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

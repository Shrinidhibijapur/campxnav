// ============================================================
// ORS Routing Proxy — keeps API key server-side
// POST /api/route
// Body: { from: [lng, lat], to: [lng, lat], profile: "foot-walking" | "driving-car" }
// ============================================================

import { NextRequest, NextResponse } from "next/server";

const ORS_KEY = process.env.ORS_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const { from, to, profile = "foot-walking" } = await req.json();

    if (!from || !to) {
      return NextResponse.json(
        { error: "Missing 'from' or 'to' coordinates" },
        { status: 400 }
      );
    }

    if (!ORS_KEY || ORS_KEY === "YOUR_ORS_KEY_HERE") {
      // Return a mock route for demo/development
      return NextResponse.json(createMockRoute(from, to));
    }

    const validProfiles = ["foot-walking", "driving-car", "cycling-regular"];
    const safeProfile = validProfiles.includes(profile) ? profile : "foot-walking";

    const res = await fetch(
      `https://api.openrouteservice.org/v2/directions/${safeProfile}/geojson`,
      {
        method: "POST",
        headers: {
          Authorization: ORS_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coordinates: [from, to],
          instructions: true,
          language: "en",
          elevation: true,
        }),
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("ORS Error:", res.status, errorText);

      if (res.status === 429) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again in a moment." },
          { status: 429 }
        );
      }

      // Fallback to mock route
      return NextResponse.json(createMockRoute(from, to));
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Route API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch route" },
      { status: 500 }
    );
  }
}

// Generate a mock route for development/demo
function createMockRoute(from: [number, number], to: [number, number]) {
  const midLng = (from[0] + to[0]) / 2;
  const midLat = (from[1] + to[1]) / 2;
  const offset = 0.0003;

  const coordinates = [
    from,
    [from[0] + (midLng - from[0]) * 0.3, from[1] + offset],
    [midLng + offset, midLat],
    [to[0] - (to[0] - midLng) * 0.3, to[1] - offset],
    to,
  ];

  const dx = (to[0] - from[0]) * 111320 * Math.cos((from[1] * Math.PI) / 180);
  const dy = (to[1] - from[1]) * 110540;
  const distanceMeters = Math.sqrt(dx * dx + dy * dy) * 1.3;

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: { type: "LineString", coordinates },
        properties: {
          summary: {
            distance: distanceMeters,
            duration: distanceMeters / 1.4,
          },
          segments: [
            {
              distance: distanceMeters,
              duration: distanceMeters / 1.4,
              steps: [
                { instruction: "Head towards the destination", distance: distanceMeters * 0.3, duration: (distanceMeters * 0.3) / 1.4, type: 11 },
                { instruction: "Continue along the campus road", distance: distanceMeters * 0.4, duration: (distanceMeters * 0.4) / 1.4, type: 0 },
                { instruction: "You have arrived at your destination", distance: distanceMeters * 0.3, duration: (distanceMeters * 0.3) / 1.4, type: 10 },
              ],
            },
          ],
        },
      },
    ],
  };
}

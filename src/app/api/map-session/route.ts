// ============================================================
// Google Map Tiles API Session Token Proxy
// POST /api/map-session
// Returns a session token for satellite tile requests
// ============================================================

import { NextResponse } from "next/server";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GSV_KEY || "";

export async function GET() {
  if (!GOOGLE_API_KEY) {
    // Return success with null session so client can silently fall back.
    return NextResponse.json({ session: null, reason: "missing_api_key" }, { status: 200 });
  }

  try {
    const res = await fetch(
      `https://tile.googleapis.com/v1/createSession?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mapType: "satellite",
          language: "en-US",
          region: "IN",
        }),
      }
    );

    if (!res.ok) {
      // Silently fall back — Map Tiles API may not be enabled
      return NextResponse.json({ session: null }, { status: 200 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Map session error:", error);
    return NextResponse.json({ error: "Failed to create map session" }, { status: 500 });
  }
}

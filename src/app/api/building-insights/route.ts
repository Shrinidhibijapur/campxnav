import { NextRequest, NextResponse } from "next/server";
import { buildingAppearancePresetsByNo } from "@/lib/building-appearance-presets";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GSV_KEY || "";

function inferFromTypes(types: string[] = [], name = "") {
  const t = types.join(" ").toLowerCase();
  const n = name.toLowerCase();

  let material = "reinforced concrete + plaster";
  if (t.includes("university") || t.includes("school")) material = "institutional concrete facade";
  if (n.includes("hostel")) material = "painted concrete facade";
  if (n.includes("temple")) material = "stone and plaster";

  let windowStyle = "standard academic window grid";
  if (n.includes("auditorium")) windowStyle = "limited fenestration";
  if (n.includes("hostel")) windowStyle = "dense ribbon windows";

  let appearance = "mid-rise academic block";
  if (n.includes("hostel")) appearance = "residential hostel block";
  if (n.includes("auditorium")) appearance = "large hall / performance block";
  if (n.includes("temple")) appearance = "traditional small structure";

  return { material, windowStyle, appearance };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "";
  const buildingNo = searchParams.get("buildingNo") || "--";
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!name || !lat || !lng) {
    return NextResponse.json({ error: "Missing query params" }, { status: 400 });
  }

  const preset = buildingAppearancePresetsByNo[buildingNo];
  const inferredFallback = inferFromTypes([], name);
  const fallback = {
    ...inferredFallback,
    wallColor: preset?.wallColor || "#c1b8aa",
    windowColor: preset?.windowColor || "#566a7f",
    accentColor: preset?.accentColor || "#ada498",
    source: preset ? "preset" : "inferred",
  };

  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ ...fallback, photoUrl: null }, { status: 200 });
  }

  try {
    const searchRes = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "places.displayName,places.types,places.photos.name",
      },
      body: JSON.stringify({
        textQuery: `${name} Dayananda Sagar College of Engineering`,
        locationBias: {
          circle: {
            center: {
              latitude: Number(lat),
              longitude: Number(lng),
            },
            radius: 350.0,
          },
        },
        pageSize: 1,
      }),
    });

    if (!searchRes.ok) {
      return NextResponse.json({ ...fallback, photoUrl: null }, { status: 200 });
    }

    const data = await searchRes.json();
    const place = data?.places?.[0];
    const types: string[] = place?.types || [];
    const inferred = inferFromTypes(types, name);
    const photoName: string | undefined = place?.photos?.[0]?.name;
    const photoUrl = photoName
      ? `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=500&maxWidthPx=900&key=${GOOGLE_API_KEY}`
      : null;

    return NextResponse.json(
      {
        placeName: place?.displayName?.text || name,
        material: preset?.material || inferred.material,
        windowStyle: preset?.windowStyle || inferred.windowStyle,
        appearance: preset?.appearance || inferred.appearance,
        wallColor: preset?.wallColor || fallback.wallColor,
        windowColor: preset?.windowColor || fallback.windowColor,
        accentColor: preset?.accentColor || fallback.accentColor,
        photoUrl,
        source: preset ? "preset+google" : "google+inferred",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ ...fallback, photoUrl: null }, { status: 200 });
  }
}

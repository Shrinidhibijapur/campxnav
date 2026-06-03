import { NextRequest, NextResponse } from "next/server";
import { buildingAppearancePresetsByNo } from "@/lib/building-appearance-presets";
import fs from "fs";
import path from "path";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GSV_KEY || "";
const PHOTO_EXTENSIONS = [".jpeg", ".jpg", ".png", ".webp", ".avif", ".htm", ".html"];

function findLocalPhotos(buildingNo: string, label?: string, sno?: string, name?: string): string[] {
  const publicDir = path.join(process.cwd(), "public", "buildings");
  const found: string[] = [];
  try {
    if (!fs.existsSync(publicDir)) return found;

    // Collect potential filenames (without extensions)
    const candidates = new Set<string>();

    if (buildingNo && buildingNo !== "--") {
      candidates.add(buildingNo.trim());
      candidates.add(`building_${buildingNo.trim()}`);
      candidates.add(`building-${buildingNo.trim()}`);
    }
    if (sno) {
      candidates.add(sno.trim());
      candidates.add(`sno_${sno.trim()}`);
      candidates.add(`sno-${sno.trim()}`);
    }
    if (label) {
      candidates.add(label.trim());
      candidates.add(label.trim().toLowerCase());
    }
    if (name) {
      candidates.add(name.trim());
      candidates.add(name.trim().toLowerCase());
      candidates.add(name.trim().toLowerCase().replace(/\s+/g, "_"));
      candidates.add(name.trim().toLowerCase().replace(/\s+/g, "-"));
      candidates.add(name.trim().toLowerCase().replace(/[^a-z0-9]/g, ""));
    }

    const seen = new Set<string>();

    // Find all files in public/buildings
    const files = fs.readdirSync(publicDir);

    // Exact matches
    for (const cand of candidates) {
      for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (PHOTO_EXTENSIONS.includes(ext)) {
          const base = path.basename(file, ext);
          if (base.toLowerCase() === cand.toLowerCase() && !seen.has(file)) {
            found.push(`/buildings/${file}`);
            seen.add(file);
          }
        }
      }
    }

    // Numbered variants like "1_2.jpeg", "1_3.jpeg", "heritage_block-2.png"
    for (const cand of candidates) {
      for (let i = 2; i <= 10; i++) {
        const suffixPattern = `_${i}`;
        const dashPattern = `-${i}`;
        for (const file of files) {
          const ext = path.extname(file).toLowerCase();
          if (PHOTO_EXTENSIONS.includes(ext)) {
            const base = path.basename(file, ext);
            if ((base.toLowerCase() === `${cand.toLowerCase()}${suffixPattern}` ||
                 base.toLowerCase() === `${cand.toLowerCase()}${dashPattern}`) &&
                !seen.has(file)) {
              found.push(`/buildings/${file}`);
              seen.add(file);
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Error reading local photos:", err);
  }
  return found;
}

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
  const label = searchParams.get("label") || "";
  const sno = searchParams.get("sno") || "";
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (!name || !lat || !lng) {
    return NextResponse.json({ error: "Missing query params" }, { status: 400 });
  }

  const localPhotos = findLocalPhotos(buildingNo, label || undefined, sno || undefined, name || undefined);

  const preset = buildingAppearancePresetsByNo[buildingNo];
  const inferredFallback = inferFromTypes([], name);
  const fallback = {
    ...inferredFallback,
    wallColor: preset?.wallColor || "#c1b8aa",
    windowColor: preset?.windowColor || "#566a7f",
    accentColor: preset?.accentColor || "#ada498",
    source: preset ? "preset" : "inferred",
    localPhotos,
    photoUrl: null
  };

  return NextResponse.json(fallback, { status: 200 });
}

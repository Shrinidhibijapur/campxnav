"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { gsap } from "gsap";
import confetti from "canvas-confetti";

import { buildings, BuildingGeo, CAMPUS_CENTER, DEFAULT_VIEW, haversineDistance, formatDistance, estimateWalkTime, estimateDriveTime } from "@/lib/buildings-geo";
import { getMapStyleUrl } from "@/lib/map-styles";
import { buildingsToGeoJSON, resolveBuilding3DId } from "@/lib/campus-buildings-3d";

// ============================================================
// Types
// ============================================================
interface RouteData {
  geometry: { coordinates: number[][] };
  properties: {
    summary: { distance: number; duration: number };
    segments: Array<{
      steps: Array<{
        instruction: string;
        distance: number;
        duration: number;
        type: number;
      }>;
    }>;
  };
}

type TransportProfile = "foot-walking" | "driving-car";
interface GoogleBuildingInsights {
  placeName?: string;
  material: string;
  windowStyle: string;
  appearance: string;
  wallColor?: string;
  windowColor?: string;
  accentColor?: string;
  photoUrl?: string;
  source?: string;
}

interface BuildingVisualState {
  wallColor?: string;
}

function visualStateFromInsights(insights: GoogleBuildingInsights): BuildingVisualState {
  return { wallColor: insights.wallColor || "#c9c2b8" };
}

function getBuildingProfile(bldg: BuildingGeo) {
  const h = bldg.height ?? 0;
  const floors = h > 0 ? Math.max(1, Math.round(h / 3.2)) : 1;
  const lowerName = bldg.name.toLowerCase();
  const material = lowerName.includes("hostel")
    ? "painted concrete"
    : lowerName.includes("auditorium")
    ? "concrete with facade cladding"
    : lowerName.includes("temple")
    ? "stone and plaster"
    : "reinforced concrete + plaster";
  const windowStyle = floors >= 5 ? "dense ribbon windows" : floors >= 3 ? "standard academic window grid" : "limited fenestration";
  const appearance = h >= 18 ? "high-rise institutional block" : h >= 12 ? "mid-rise academic block" : "low-rise utility structure";
  return { floors, material, windowStyle, appearance };
}

// ============================================================
// Component
// ============================================================
export default function CampusMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const analyzedBuildingsRef = useRef<Set<number>>(new Set());

  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingGeo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BuildingGeo[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [profile, setProfile] = useState<TransportProfile>("foot-walking");
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [navigating, setNavigating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [buildingInsights, setBuildingInsights] = useState<Record<number, GoogleBuildingInsights>>({});

  const applyFeatureVisualState = useCallback((bldg: BuildingGeo, insights: GoogleBuildingInsights) => {
    if (!mapRef.current) return;
    const featureId = resolveBuilding3DId(bldg.buildingNo, bldg.name);
    if (!featureId) return;
    const state = visualStateFromInsights(insights);
    mapRef.current.setFeatureState(
      { source: "campus-buildings-3d", id: featureId },
      state
    );
  }, []);

  // Developer Mode (Coordinate Picker)
  const [devMode, setDevMode] = useState(false);
  const [pickedCoords, setPickedCoords] = useState<[number, number] | null>(null);

  // ============================================================
  // Show toast
  // ============================================================
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Initialize Map
  // ============================================================
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    const initMap = async () => {
      // Try to get Google satellite session for best imagery
      let googleSession: string | undefined;
      try {
        const sessionRes = await fetch("/api/map-session");
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          googleSession = sessionData.session;
        }
      } catch {
        // Silently fall back to MapTiler/Esri
      }

      const styleUrl = getMapStyleUrl(googleSession);

      const map = new maplibregl.Map({
        container: mapContainer.current!,
        style: styleUrl,
        center: CAMPUS_CENTER,
        zoom: 16,
        pitch: 0,
        bearing: 0,
        maxPitch: 85,
        fadeDuration: 0,
        attributionControl: false,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        canvasContextAttributes: {
          antialias: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: false,
        },
      });

    mapRef.current = map;

    // Helper: add building markers
    const addMarkers = () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      buildings.forEach((bldg) => {
        const el = document.createElement("div");
        el.className = "building-marker";
        el.dataset.buildingId = String(bldg.sno);
        const nameLower = (bldg.name || "").toLowerCase();
        let pinColor = "#ef4444"; // red for buildings
        let markerVariant: "red" | "green" | "yellow" = "red";
        if (
          nameLower.includes("food") ||
          nameLower.includes("ground") ||
          nameLower.includes("mess") ||
          nameLower.includes("canteen") ||
          nameLower.includes("amphi")
        ) {
          pinColor = "#22c55e"; // green
          markerVariant = "green";
        } else if (
          nameLower.includes("gate") ||
          nameLower.includes("parking") ||
          nameLower.includes("conveno") ||
          nameLower.includes("xerox") ||
          nameLower.includes("washroom")
        ) {
          pinColor = "#f59e0b"; // yellow
          markerVariant = "yellow";
        }

        const markerText =
          markerVariant === "red"
            ? bldg.buildingNo !== "--"
              ? bldg.buildingNo
              : bldg.label || "•"
            : "";

        el.innerHTML = `
          <div class="pin-modern ${markerVariant !== "red" ? "tag-only" : ""}" style="--pin-color: ${pinColor}">
            <span class="pin-modern-number">${markerText}</span>
            <span class="pin-modern-pulse"></span>
          </div>
        `;
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          handleBuildingSelect(bldg);
        });
        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat(bldg.coordinates)
          .addTo(map);
        markersRef.current.push(marker);
      });
    };

    // Helper: try adding 3D building extrusions
    const add3DBuildings = () => {
      // Always add custom campus building extrusions (GeoJSON)
      try {
        if (map.getSource("campus-buildings-3d")) return;
        map.addSource("campus-buildings-3d", {
          type: "geojson",
          data: buildingsToGeoJSON() as GeoJSON.GeoJSON,
        });



        // Main building extrusion with per-building colors
        map.addLayer({
          id: "campus-buildings-3d",
          type: "fill-extrusion",
          source: "campus-buildings-3d",
          paint: {
            "fill-extrusion-color": ["coalesce", ["feature-state", "wallColor"], ["get", "wallColor"]],
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-base": ["get", "minHeight"],
            "fill-extrusion-opacity": 1,
            "fill-extrusion-vertical-gradient": true,
          },
        });


      } catch (err) {
        console.warn("3D campus buildings:", err);
      }

      // Add surrounding map buildings
      try {
        if (!map.getSource("surrounding-buildings")) {
          map.addSource("surrounding-buildings", {
            type: "geojson",
            data: "/surrounding-buildings.json"
          });
          map.addLayer({
            id: "surrounding-buildings-3d",
            type: "fill-extrusion",
            source: "surrounding-buildings",
            paint: {
              "fill-extrusion-color": "#e2e8f0",
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": ["get", "minHeight"],
              "fill-extrusion-opacity": 0.8,
            }
          }, "campus-buildings-3d"); // insert behind campus buildings
        }
      } catch (err) {
        console.warn("Surrounding buildings:", err);
      }
    };

    const tryAdd3DBuildings = () => {
      if (!map.isStyleLoaded()) {
        map.once("styledata", tryAdd3DBuildings);
        return;
      }
      add3DBuildings();
    };

    // Helper: animate camera to campus and dismiss loading
    const animateToCampus = () => {
      gsap.to({}, {
        duration: 2.5,
        onUpdate: function () {
          const p = this.progress();
          const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
          map.jumpTo({
            center: CAMPUS_CENTER,
            zoom: 16 + (DEFAULT_VIEW.zoom - 16) * e,
            pitch: DEFAULT_VIEW.pitch * e,
            bearing: DEFAULT_VIEW.bearing * e,
          });
        },
        onComplete: () => setLoading(false),
      });
    };

    // On map fully loaded
    let failsafeTimer: ReturnType<typeof setTimeout>;
    map.on("load", () => {
      clearTimeout(failsafeTimer);
      tryAdd3DBuildings();
      addMarkers();
      setTimeout(animateToCampus, 400);
    });

    // Failsafe: if map doesn't fire 'load' within 8s, dismiss loading anyway
    failsafeTimer = setTimeout(() => {
      if (loading) {
        console.warn("Map load failsafe triggered");
        tryAdd3DBuildings();
        addMarkers();
        setLoading(false);
      }
    }, 8000);

    map.on("click", (e) => {
      // Capture coordinates for dev mode
      setPickedCoords([
        Number(e.lngLat.lng.toFixed(5)), 
        Number(e.lngLat.lat.toFixed(5))
      ]);

      if (!navigating) {
        setSelectedBuilding(null);
        clearActiveMarkers();
      }
    });

    // Log any map errors for debugging
    map.on("error", (e) => {
      console.warn("Map error:", e.error?.message || e);
    });

    }; // end initMap

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================
  // User Location Tracking
  // ============================================================
  useEffect(() => {
    if (!("geolocation" in navigator)) return;

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const loc: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setUserLocation(loc);

        if (mapRef.current) {
          if (!userMarkerRef.current) {
            const el = document.createElement("div");
            el.className = "user-dot";
            userMarkerRef.current = new maplibregl.Marker({ element: el })
              .setLngLat(loc)
              .addTo(mapRef.current);
          } else {
            userMarkerRef.current.setLngLat(loc);
          }
        }

        // Check arrival during navigation
        if (navigating && selectedBuilding) {
          const dist = haversineDistance(loc, selectedBuilding.coordinates);
          if (dist < 25) {
            handleArrival();
          }
        }
      },
      (err) => {
        const geolocationError =
          err.code === 1
            ? "Location permission denied. Enable location access for live navigation."
            : err.code === 2
            ? "Location currently unavailable. Trying a lower-accuracy fallback."
            : "Location request timed out. Using map center until GPS is ready.";
        console.warn("Geolocation error:", err.message);
        showToast(geolocationError);
      },
      { enableHighAccuracy: false, maximumAge: 20000, timeout: 10000 }
    );

    watchIdRef.current = id;
    return () => navigator.geolocation.clearWatch(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigating, selectedBuilding]);

  // ============================================================
  // Search
  // ============================================================
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = buildings.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.buildingNo.includes(q) ||
        b.departments?.some((d) => d.toLowerCase().includes(q))
    );
    setSearchResults(results.slice(0, 8));
  }, [searchQuery]);

  // ============================================================
  // Building Select Handler
  // ============================================================
  const handleBuildingSelect = useCallback(
    (bldg: BuildingGeo) => {
      setSelectedBuilding(bldg);
      setSearchQuery("");
      setSearchResults([]);
      setRouteData(null);
      setNavigating(false);
      setCurrentStep(0);

      clearActiveMarkers();

      // Set active marker
      const markerEl = document.querySelector(
        `[data-building-id="${bldg.sno}"]`
      );
      markerEl?.classList.add("active");

      // Smooth camera fly
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: bldg.coordinates,
          zoom: 18,
          pitch: 60,
          bearing: -10 + Math.random() * 20,
          duration: 2000,
          essential: true,
        });
      }

      if (!buildingInsights[bldg.sno]) {
        fetch(`/api/building-insights?name=${encodeURIComponent(bldg.name)}&buildingNo=${encodeURIComponent(bldg.buildingNo)}&lat=${bldg.coordinates[1]}&lng=${bldg.coordinates[0]}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data) {
              applyFeatureVisualState(bldg, data as GoogleBuildingInsights);
              setBuildingInsights((prev) => ({
                ...prev,
                [bldg.sno]: data as GoogleBuildingInsights,
              }));
            }
          })
          .catch(() => {
            // Keep local inferred fallback only.
          });
      }
    },
    [applyFeatureVisualState, buildingInsights]
  );

  useEffect(() => {
    if (!mapRef.current) return;

    const toAnalyze = buildings.filter((b) => (b.height ?? 0) > 0 && !b.name.toLowerCase().includes("parking") && !b.name.toLowerCase().includes("ground"));
    let cancelled = false;

    const run = async () => {
      for (const b of toAnalyze) {
        if (cancelled) break;
        if (analyzedBuildingsRef.current.has(b.sno)) continue;
        analyzedBuildingsRef.current.add(b.sno);

        try {
          const res = await fetch(`/api/building-insights?name=${encodeURIComponent(b.name)}&buildingNo=${encodeURIComponent(b.buildingNo)}&lat=${b.coordinates[1]}&lng=${b.coordinates[0]}`);
          if (!res.ok) continue;
          const data = (await res.json()) as GoogleBuildingInsights;
          if (cancelled) break;
          applyFeatureVisualState(b, data);
          setBuildingInsights((prev) => ({ ...prev, [b.sno]: data }));
        } catch {
          // Keep default styling when lookup fails.
        }
        await new Promise((resolve) => setTimeout(resolve, 180));
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [applyFeatureVisualState]);

  // ============================================================
  // Clear active markers
  // ============================================================
  const clearActiveMarkers = () => {
    document.querySelectorAll(".building-marker.active").forEach((el) => el.classList.remove("active"));
  };

  // ============================================================
  // Fetch Route
  // ============================================================
  const fetchRoute = useCallback(
    async (from: [number, number], to: [number, number]) => {
      // Abort previous request if still pending
      if (abortRef.current) {
        abortRef.current.abort();
      }
      abortRef.current = new AbortController();

      const cacheKey = `route_${from.join(',')}_${to.join(',')}_${profile}`;
      const cached = sessionStorage.getItem(cacheKey);

      let data;
      if (cached) {
        data = JSON.parse(cached);
      } else {
        try {
          const res = await fetch("/api/directions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from, to, profile }),
            signal: abortRef.current.signal,
          });
          data = await res.json();
          if (!data.error) {
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
          }
        } catch (err: any) {
          if (err.name === 'AbortError') return; // Ignore aborted requests
          showToast("Failed to fetch route. Check your connection.");
          return;
        }
      }

      if (data?.error) {
          showToast(`Route error: ${data.error}`);
          return;
        }

        const feature = data.features?.[0];
        if (!feature) {
          showToast("No route found");
          return;
        }

        setRouteData(feature);
        drawRoute(feature.geometry.coordinates);

        // Fit bounds to route
        if (mapRef.current) {
          try {
            const coords = feature.geometry.coordinates;
            const bounds = coords.reduce(
              (b: maplibregl.LngLatBounds, c: number[]) => b.extend(c as [number, number]),
              new maplibregl.LngLatBounds(coords[0] as [number, number], coords[0] as [number, number])
            );
            mapRef.current.fitBounds(bounds, {
              padding: 80,
              pitch: 50,
              duration: 1500,
              maxZoom: 18,
            });
          } catch {
            // If fitBounds fails, just fly to destination
            mapRef.current.flyTo({ center: to, zoom: 17, pitch: 50, duration: 1500 });
          }
        }
    },
    [profile, showToast]
  );

  // ============================================================
  // Draw Route on Map
  // ============================================================
  const drawRoute = (coordinates: number[][]) => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing route
    if (map.getLayer("route-line-glow")) map.removeLayer("route-line-glow");
    if (map.getLayer("route-line")) map.removeLayer("route-line");
    if (map.getLayer("route-line-dash")) map.removeLayer("route-line-dash");
    if (map.getLayer("route-stairs")) map.removeLayer("route-stairs");
    if (map.getSource("route")) map.removeSource("route");
    if (map.getSource("route-stairs")) map.removeSource("route-stairs");

    const normalSegments: number[][][] = [];
    const stairSegments: number[][][] = [];
    
    let currentNormal: number[][] = [coordinates[0]];
    let currentStairs: number[][] = [];
    let inStairs = false;

    for (let i = 1; i < coordinates.length; i++) {
      const p1 = coordinates[i - 1];
      const p2 = coordinates[i];
      
      const dist = haversineDistance([p1[0], p1[1]], [p2[0], p2[1]]);
      const elev1 = p1[2] || 0;
      const elev2 = p2[2] || 0;
      const elevDiff = Math.abs(elev2 - elev1);

      // elevation change > 2m per 10m distance = stair segment
      const isStair = dist > 0 && (elevDiff / dist) > 0.2 && elevDiff > 1;

      if (isStair) {
        if (!inStairs) {
          inStairs = true;
          normalSegments.push(currentNormal);
          currentNormal = [];
          currentStairs = [p1, p2];
        } else {
          currentStairs.push(p2);
        }
      } else {
        if (inStairs) {
          inStairs = false;
          stairSegments.push(currentStairs);
          currentStairs = [];
          currentNormal = [p1, p2];
        } else {
          currentNormal.push(p2);
        }
      }
    }
    
    if (currentNormal.length > 1) normalSegments.push(currentNormal);
    if (currentStairs.length > 1) stairSegments.push(currentStairs);

    map.addSource("route", {
      type: "geojson",
      data: { 
        type: "FeatureCollection", 
        features: normalSegments.map(coords => ({ type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} }))
      },
    });

    map.addSource("route-stairs", {
      type: "geojson",
      data: { 
        type: "FeatureCollection", 
        features: stairSegments.map(coords => ({ type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} }))
      },
    });

    // Glow layer
    map.addLayer({
      id: "route-line-glow",
      type: "line",
      source: "route",
      paint: {
        "line-color": "#22d3ee",
        "line-width": 14,
        "line-opacity": 0.15,
        "line-blur": 8,
      },
    });

    // Main line
    map.addLayer({
      id: "route-line",
      type: "line",
      source: "route",
      paint: {
        "line-color": "#22d3ee",
        "line-width": 5,
        "line-opacity": 0.9,
      },
    });

    // Animated dashes
    map.addLayer({
      id: "route-line-dash",
      type: "line",
      source: "route",
      paint: {
        "line-color": "#a5f3fc",
        "line-width": 3,
        "line-dasharray": [0, 2, 2],
        "line-opacity": 0.7,
      },
    });

    // Stair layer
    map.addLayer({
      id: "route-stairs",
      type: "line",
      source: "route-stairs",
      paint: {
        "line-color": "#fbbf24",  // amber for stairs
        "line-width": 4,
        "line-dasharray": [1, 1]
      }
    });

    // Animate the dashes
    let step = 0;
    function animateDash() {
      step = (step + 1) % 40;
      const t = step / 40;
      const dashLength = 2;
      const gapLength = 2;
      const totalLength = dashLength + gapLength;
      const offset = t * totalLength;
      if (mapRef.current && mapRef.current.getLayer("route-line-dash")) {
        mapRef.current.setPaintProperty("route-line-dash", "line-dasharray", [
          offset,
          gapLength,
          dashLength,
        ]);
        requestAnimationFrame(animateDash);
      }
    }
    animateDash();
  };

  // ============================================================
  // Start Navigation
  // ============================================================
  const startNavigation = useCallback(() => {
    if (!selectedBuilding) return;

    const from = userLocation || CAMPUS_CENTER;
    setNavigating(true);
    setCurrentStep(0);
    fetchRoute(from, selectedBuilding.coordinates);
  }, [selectedBuilding, userLocation, fetchRoute]);

  // ============================================================
  // Handle Arrival
  // ============================================================
  const handleArrival = useCallback(() => {
    setNavigating(false);
    showToast(`🎉 You've arrived at ${selectedBuilding?.name}!`);

    // Confetti burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#fbbf24", "#22d3ee", "#f8fafc", "#3b82f6"],
    });

    // Camera settle on destination
    if (mapRef.current && selectedBuilding) {
      mapRef.current.flyTo({
        center: selectedBuilding.coordinates,
        zoom: 19,
        pitch: 65,
        duration: 1500,
      });
    }
  }, [selectedBuilding, showToast]);

  // ============================================================
  // Close panel
  // ============================================================
  const closePanel = () => {
    setSelectedBuilding(null);
    setRouteData(null);
    setNavigating(false);
    clearActiveMarkers();

    // Remove route
    const map = mapRef.current;
    if (map) {
      if (map.getLayer("route-line-glow")) map.removeLayer("route-line-glow");
      if (map.getLayer("route-line")) map.removeLayer("route-line");
      if (map.getLayer("route-line-dash")) map.removeLayer("route-line-dash");
      if (map.getLayer("route-stairs")) map.removeLayer("route-stairs");
      if (map.getSource("route")) map.removeSource("route");
      if (map.getSource("route-stairs")) map.removeSource("route-stairs");

      map.flyTo({
        center: CAMPUS_CENTER,
        zoom: DEFAULT_VIEW.zoom,
        pitch: DEFAULT_VIEW.pitch,
        bearing: DEFAULT_VIEW.bearing,
        duration: 1500,
      });
    }
  };

  // ============================================================
  // Computed values
  // ============================================================
  const distance = selectedBuilding && userLocation
    ? haversineDistance(userLocation, selectedBuilding.coordinates)
    : selectedBuilding
    ? haversineDistance(CAMPUS_CENTER, selectedBuilding.coordinates)
    : 0;

  const steps = routeData?.properties?.segments?.[0]?.steps || [];
  const selectedBuildingProfile = selectedBuilding ? getBuildingProfile(selectedBuilding) : null;
  const selectedGoogleInsights = selectedBuilding ? buildingInsights[selectedBuilding.sno] : null;

  // ============================================================
  // Render
  // ============================================================
  return (
    <>
      {/* Loading Screen */}
      <div className={`loading-screen ${!loading ? "hidden" : ""}`}>
        <div className="loading-logo">
          Campus<span>X</span>Nav
        </div>
        <div className="loading-bar">
          <div className="loading-bar-fill" />
        </div>
        <div className="loading-text">Initializing 3D Map</div>
      </div>

      {/* Map */}
      <div ref={mapContainer} className="map-wrapper" />

      {/* Satellite 3D Badge */}
      {!loading && (
        <div className="satellite-badge">
          <span className="dot" />
          Satellite 3D
        </div>
      )}

      {/* Search Bar (hidden during navigation) */}
      {!navigating && (
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Search buildings, departments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map((b) => (
                <div
                  key={b.sno}
                  className="search-result-item"
                  onClick={() => handleBuildingSelect(b)}
                >
                  <div className="bldg-no">{b.buildingNo !== "--" ? b.buildingNo : b.label}</div>
                  <div>
                    <div className="bldg-name">{b.name}</div>
                    <div className="bldg-dept">
                      {b.departments?.slice(0, 2).join(" · ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation HUD (during navigation) */}
      {navigating && steps.length > 0 && (
        <div className="nav-hud">
          <div>
            <div className="nav-hud-step">
              Step {currentStep + 1} of {steps.length}
            </div>
            <div className="nav-hud-instruction">
              {steps[currentStep]?.instruction || "Navigate"}
            </div>
          </div>
          <div className="nav-hud-dist">
            {formatDistance(steps[currentStep]?.distance || 0)}
          </div>
        </div>
      )}

      {/* Map Controls */}
      <div className="map-controls">
        <button
          className="map-ctrl-btn"
          title="Zoom In"
          onClick={() => mapRef.current?.zoomIn({ duration: 300 })}
        >
          +
        </button>
        <button
          className="map-ctrl-btn"
          title="Zoom Out"
          onClick={() => mapRef.current?.zoomOut({ duration: 300 })}
        >
          −
        </button>
        <button
          className="map-ctrl-btn"
          title="Reset View"
          onClick={() =>
            mapRef.current?.flyTo({
              center: CAMPUS_CENTER,
              zoom: DEFAULT_VIEW.zoom,
              pitch: DEFAULT_VIEW.pitch,
              bearing: DEFAULT_VIEW.bearing,
              duration: 1500,
            })
          }
        >
          ⌂
        </button>
        <button
          className={`map-ctrl-btn ${userLocation ? "active" : ""}`}
          title="My Location"
          onClick={() => {
            if (userLocation && mapRef.current) {
              mapRef.current.flyTo({ center: userLocation, zoom: 18, pitch: 55, duration: 1000 });
            } else {
              showToast("Location not available. Please enable GPS.");
            }
          }}
        >
          ◎
        </button>
        <button
          className={`map-ctrl-btn ${devMode ? "active" : ""}`}
          title="Developer Mode (Coordinate Picker)"
          onClick={() => {
            setDevMode(!devMode);
            showToast(!devMode ? "Developer Mode Enabled: Click anywhere to get coords" : "Developer Mode Disabled");
          }}
        >
          🛠️
        </button>
      </div>

      {/* Developer Mode Coordinate Picker HUD */}
      {devMode && (
        <div style={{
          position: "fixed", top: 80, right: 16, zIndex: 100,
          background: "var(--bg-panel)", backdropFilter: "blur(20px)",
          padding: "16px", borderRadius: "12px", border: "1px solid rgba(251,191,36,0.3)",
          color: "var(--text-primary)", maxWidth: "320px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
        }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--amber)", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>📍</span> Coordinate Picker
          </h3>
          <p style={{ fontSize: "12px", marginBottom: "12px", color: "var(--text-secondary)", lineHeight: 1.4 }}>
            Click anywhere on the map to pinpoint the exact latitude and longitude.
          </p>
          <div style={{
            background: "rgba(0,0,0,0.3)", padding: "10px", borderRadius: "8px",
            fontFamily: "var(--font-mono)", fontSize: "13px", display: "flex",
            justifyContent: "space-between", alignItems: "center", gap: "12px",
            border: "1px solid var(--border-subtle)"
          }}>
            <span style={{ color: pickedCoords ? "var(--cyan)" : "var(--text-muted)" }}>
              {pickedCoords ? `[${pickedCoords[0]}, ${pickedCoords[1]}]` : "Waiting for click..."}
            </span>
            {pickedCoords && (
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`[${pickedCoords[0]}, ${pickedCoords[1]}]`);
                  showToast("Coordinates copied to clipboard!");
                }}
                style={{
                  background: "var(--blue)", border: "none", borderRadius: "6px",
                  color: "#fff", padding: "6px 12px", cursor: "pointer",
                  fontSize: "12px", fontWeight: 600, transition: "background 0.2s"
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#2563eb")}
                onMouseOut={(e) => (e.currentTarget.style.background = "var(--blue)")}
              >
                Copy
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation Panel */}
      <div className={`nav-panel ${selectedBuilding ? "open" : ""}`}>
        <div className="nav-panel-handle" />
        {selectedBuilding && (
          <>
            {/* Street View Preview Image */}
            <div style={{
              width: "100%", height: "160px",
              backgroundImage: `url(${selectedGoogleInsights?.photoUrl || `https://maps.googleapis.com/maps/api/streetview?size=600x200&location=${selectedBuilding.coordinates[1]},${selectedBuilding.coordinates[0]}&fov=90&heading=0&pitch=5&key=${process.env.NEXT_PUBLIC_GSV_KEY || ""}`})`,
              backgroundSize: "cover", backgroundPosition: "center",
              backgroundColor: "rgba(0,0,0,0.3)",
              borderTopLeftRadius: "24px", borderTopRightRadius: "24px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              position: "relative"
            }}>
              {/* Building number badge overlay */}
              {selectedBuilding.buildingNo !== "--" && (
                <div style={{
                  position: "absolute", bottom: 8, left: 12,
                  background: "var(--amber)", color: "#1a1a2e",
                  padding: "2px 10px", borderRadius: "6px",
                  fontSize: "13px", fontWeight: 800
                }}>
                  #{selectedBuilding.buildingNo}
                </div>
              )}
            </div>
            <div className="nav-panel-header" style={{ paddingTop: "12px" }}>
              <div>
                <h2>
                  {selectedBuilding.buildingNo !== "--" && (
                    <span style={{ color: "var(--amber)", marginRight: "6px" }}>
                      🏛 Building {selectedBuilding.buildingNo} ·
                    </span>
                  )}
                  {selectedBuilding.name}
                </h2>
                {selectedBuilding.departments?.map((d, i) => (
                  <span key={i} className="dept-tag" style={{ marginRight: 6, marginTop: 6, display: "inline-block" }}>
                    {d}
                  </span>
                ))}
                {selectedBuilding.height != null && selectedBuilding.height > 0 && (
                  <div style={{ marginTop: 8, fontSize: "12px", color: "var(--text-muted)" }}>
                    📐 ~{selectedBuilding.height}m tall · ~{Math.round(selectedBuilding.height / 3.2)} floors
                  </div>
                )}
              </div>
              <button className="nav-panel-close" onClick={closePanel}>
                ✕
              </button>
            </div>
            <div className="nav-panel-body">
              {/* Distance Info */}
              <div className="nav-distance">
                <div className="nav-distance-item">
                  <div className="icon">🚶</div>
                  <div className="value">{formatDistance(distance)}</div>
                  <div className="label">{estimateWalkTime(distance)}</div>
                </div>
                <div className="nav-distance-item">
                  <div className="icon">🚗</div>
                  <div className="value">{formatDistance(distance * 1.3)}</div>
                  <div className="label">{estimateDriveTime(distance * 1.3)}</div>
                </div>
              </div>

              {/* Transport Toggle */}
              <div className="transport-toggle">
                <button
                  className={`transport-btn ${profile === "foot-walking" ? "active" : ""}`}
                  onClick={() => setProfile("foot-walking")}
                >
                  🚶 Walk
                </button>
                <button
                  className={`transport-btn ${profile === "driving-car" ? "active" : ""}`}
                  onClick={() => setProfile("driving-car")}
                >
                  🚗 Drive
                </button>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons" style={{ display: "flex", gap: "12px" }}>
                <button className="nav-start-btn" onClick={startNavigation} style={{ flex: 1 }}>
                  {navigating ? "Navigating..." : "Start Navigation"}
                </button>
                {selectedBuilding.notesUrl && (
                  <a 
                    href={selectedBuilding.notesUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="notes-btn"
                  >
                    View Notes 📚
                  </a>
                )}
              </div>

              {selectedBuildingProfile && (
                <div
                  style={{
                    marginTop: 14,
                    padding: "12px",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.03)",
                  }}
                >
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "8px" }}>
                    Building visual profile
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                    Appearance: <span style={{ color: "var(--text-primary)" }}>{selectedGoogleInsights?.appearance || selectedBuildingProfile.appearance}</span><br />
                    Material: <span style={{ color: "var(--text-primary)" }}>{selectedGoogleInsights?.material || selectedBuildingProfile.material}</span><br />
                    Windows: <span style={{ color: "var(--text-primary)" }}>{selectedGoogleInsights?.windowStyle || selectedBuildingProfile.windowStyle}</span>
                  </div>
                  {selectedGoogleInsights?.source && (
                    <div style={{ marginTop: "6px", fontSize: "11px", color: "var(--text-muted)" }}>
                      Visual source: {selectedGoogleInsights.source}
                    </div>
                  )}
                  {selectedBuilding.googleMapsUrl && (
                    <a
                      href={selectedBuilding.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: "inline-block", marginTop: "8px", fontSize: "12px", color: "var(--cyan)", textDecoration: "none", fontWeight: 600 }}
                    >
                      Open Google Maps reference ↗
                    </a>
                  )}
                </div>
              )}

              {/* Turn-by-turn Steps */}
              {steps.length > 0 && (
                <div className="nav-steps">
                  {steps.map((step, i) => (
                    <div
                      key={i}
                      className={`nav-step ${i < currentStep ? "completed" : ""} ${i === currentStep ? "active" : ""}`}
                      onClick={() => setCurrentStep(i)}
                    >
                      <div className="nav-step-icon">
                        {i < currentStep ? "✓" : i === currentStep ? "▶" : (i + 1)}
                      </div>
                      <div>
                        <div className="nav-step-text">{step.instruction}</div>
                        <div className="nav-step-dist">{formatDistance(step.distance)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

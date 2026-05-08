"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { gsap } from "gsap";
import confetti from "canvas-confetti";

import { buildings, BuildingGeo, CAMPUS_CENTER, DEFAULT_VIEW, haversineDistance, formatDistance, estimateWalkTime, estimateDriveTime } from "@/lib/buildings-geo";
import { getMapStyleUrl, BUILDING_EXTRUSION_LAYER } from "@/lib/map-styles";

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

// ============================================================
// Component
// ============================================================
export default function CampusMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);

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

    const styleUrl = getMapStyleUrl();

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: CAMPUS_CENTER,
      zoom: 14,
      pitch: 0,
      bearing: 0,
      maxPitch: 85,
    });

    mapRef.current = map;

    // On style load — add 3D buildings and markers
    map.on("style.load", () => {
      // Add 3D building extrusions
      try {
        if (map.getSource("openmaptiles") && !map.getLayer("3d-buildings-custom")) {
          map.addLayer(BUILDING_EXTRUSION_LAYER as maplibregl.LayerSpecification);
        }
      } catch (err) {
        console.warn("3D buildings:", err);
      }

      // Add markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      buildings.forEach((bldg) => {
        const el = document.createElement("div");
        el.className = "building-marker";
        el.dataset.buildingId = String(bldg.sno);
        el.innerHTML = `<div class="building-marker-inner"><span>${bldg.buildingNo}</span></div>`;
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          handleBuildingSelect(bldg);
        });
        const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat(bldg.coordinates)
          .addTo(map);
        markersRef.current.push(marker);
      });
    });

    map.on("load", () => {
      setTimeout(() => {
        gsap.to({}, {
          duration: 3,
          onUpdate: function () {
            const p = this.progress();
            const e = 1 - Math.pow(1 - p, 3);
            map.jumpTo({
              center: CAMPUS_CENTER,
              zoom: 14 + (DEFAULT_VIEW.zoom - 14) * e,
              pitch: DEFAULT_VIEW.pitch * e,
              bearing: DEFAULT_VIEW.bearing * e,
            });
          },
          onComplete: () => setLoading(false),
        });
      }, 300);
    });

    map.on("click", () => {
      if (!navigating) {
        setSelectedBuilding(null);
        clearActiveMarkers();
      }
    });

    return () => {
      map.remove();
      mapRef.current = null;
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
        console.warn("Geolocation error:", err.message);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
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
    },
    []
  );

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
      try {
        const res = await fetch("/api/directions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ from, to, profile }),
        });
        const data = await res.json();

        if (data.error) {
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
      } catch {
        showToast("Failed to fetch route. Check your connection.");
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
    if (map.getSource("route")) map.removeSource("route");

    map.addSource("route", {
      type: "geojson",
      data: { type: "Feature", geometry: { type: "LineString", coordinates }, properties: {} },
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

    // Animate the dashes
    let step = 0;
    function animateDash() {
      step = (step + 1) % 40;
      const t = step / 40;
      const dashLength = 2;
      const gapLength = 2;
      const totalLength = dashLength + gapLength;
      const offset = t * totalLength;
      if (map && map.getLayer("route-line-dash")) {
        map.setPaintProperty("route-line-dash", "line-dasharray", [
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
      if (map.getSource("route")) map.removeSource("route");

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
                  <div className="bldg-no">{b.buildingNo}</div>
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
      </div>

      {/* Navigation Panel */}
      <div className={`nav-panel ${selectedBuilding ? "open" : ""}`}>
        <div className="nav-panel-handle" />
        {selectedBuilding && (
          <>
            <div className="nav-panel-header">
              <div>
                <h2>
                  {selectedBuilding.name}
                </h2>
                {selectedBuilding.departments?.map((d, i) => (
                  <span key={i} className="dept-tag" style={{ marginRight: 6, marginTop: 6, display: "inline-block" }}>
                    {d}
                  </span>
                ))}
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

              {/* Navigate Button */}
              <button className="nav-start-btn" onClick={startNavigation}>
                {navigating ? "Navigating..." : "Start Navigation"}
              </button>

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

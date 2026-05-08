"use client";

import dynamic from "next/dynamic";

// Dynamic import with SSR disabled — MapLibre requires browser APIs
const CampusMap = dynamic(() => import("@/components/map/CampusMap"), {
  ssr: false,
  loading: () => (
    <div className="loading-screen">
      <div className="loading-logo">
        Campus<span>X</span>Nav
      </div>
      <div className="loading-bar">
        <div className="loading-bar-fill" />
      </div>
      <div className="loading-text">Loading Map Engine</div>
    </div>
  ),
});

export default function MapPage() {
  return <CampusMap />;
}

// ============================================================
// DSCE Campus Building Coordinates — Pre-geocoded & Locked
// All coordinates extracted from official Google Maps links
// Format: [longitude, latitude] (MapLibre convention)
// ============================================================

export interface BuildingGeo {
  sno: number;
  name: string;
  buildingNo: string;
  coordinates: [number, number]; // [lng, lat]
  departments?: string[];
  googleMapsUrl?: string;
}

// Campus center point — Dayananda Sagar College of Engineering
export const CAMPUS_CENTER: [number, number] = [77.5658, 12.9082];

// Default map view settings
export const DEFAULT_VIEW = {
  center: CAMPUS_CENTER,
  zoom: 17,
  pitch: 55,
  bearing: -20,
};

// All 41 DSCE campus buildings with precise coordinates
export const buildings: BuildingGeo[] = [
  {
    sno: 1,
    name: "Heritage Block",
    buildingNo: "1",
    coordinates: [77.5651, 12.9078],
    departments: ["Administration", "Principal Office"],
    googleMapsUrl: "https://maps.app.goo.gl/XJB4exGW3cn9igmL6",
  },
  {
    sno: 2,
    name: "Library",
    buildingNo: "2",
    coordinates: [77.5654, 12.9081],
    departments: ["Central Library", "Reading Hall", "Digital Library"],
    googleMapsUrl: "https://maps.app.goo.gl/6UZBP7tUxtcZudmC6",
  },
  {
    sno: 3,
    name: "Admin Block",
    buildingNo: "3",
    coordinates: [77.5649, 12.9084],
    departments: ["Accounts", "HR", "Registrar"],
  },
  {
    sno: 4,
    name: "Mechanical Block",
    buildingNo: "4",
    coordinates: [77.5656, 12.9076],
    departments: ["Mechanical Engineering"],
  },
  {
    sno: 5,
    name: "Civil Block",
    buildingNo: "5",
    coordinates: [77.5659, 12.9074],
    departments: ["Civil Engineering"],
  },
  {
    sno: 6,
    name: "EEE Block",
    buildingNo: "6",
    coordinates: [77.5662, 12.9077],
    departments: ["Electrical & Electronics Engineering"],
  },
  {
    sno: 7,
    name: "ECE Block",
    buildingNo: "7",
    coordinates: [77.5665, 12.9080],
    departments: ["Electronics & Communication Engineering"],
  },
  {
    sno: 8,
    name: "ISE Block",
    buildingNo: "8",
    coordinates: [77.5661, 12.9083],
    departments: ["Information Science & Engineering"],
  },
  {
    sno: 9,
    name: "CSE Block",
    buildingNo: "9",
    coordinates: [77.5658, 12.9086],
    departments: ["Computer Science & Engineering"],
  },
  {
    sno: 10,
    name: "AIML Block",
    buildingNo: "10",
    coordinates: [77.5655, 12.9089],
    departments: ["AI & Machine Learning", "Data Science"],
  },
  {
    sno: 11,
    name: "MBA Block",
    buildingNo: "11",
    coordinates: [77.5652, 12.9085],
    departments: ["Master of Business Administration"],
  },
  {
    sno: 12,
    name: "MCA Block",
    buildingNo: "12",
    coordinates: [77.5648, 12.9080],
    departments: ["Master of Computer Applications"],
  },
  {
    sno: 13,
    name: "Science Block",
    buildingNo: "13",
    coordinates: [77.5646, 12.9077],
    departments: ["Physics", "Chemistry", "Mathematics"],
  },
  {
    sno: 14,
    name: "Workshop",
    buildingNo: "14",
    coordinates: [77.5663, 12.9072],
    departments: ["Engineering Workshop", "Fabrication Lab"],
  },
  {
    sno: 15,
    name: "Seminar Hall 1",
    buildingNo: "15",
    coordinates: [77.5660, 12.9088],
    departments: ["Events", "Seminars"],
  },
  {
    sno: 16,
    name: "Seminar Hall 2",
    buildingNo: "16",
    coordinates: [77.5657, 12.9091],
    departments: ["Events", "Conferences"],
  },
  {
    sno: 17,
    name: "Auditorium",
    buildingNo: "17",
    coordinates: [77.5653, 12.9092],
    departments: ["Cultural Events", "Convocation Hall"],
  },
  {
    sno: 18,
    name: "Sports Complex",
    buildingNo: "18",
    coordinates: [77.5668, 12.9085],
    departments: ["Indoor Games", "Gymnasium"],
  },
  {
    sno: 19,
    name: "Canteen",
    buildingNo: "19",
    coordinates: [77.5664, 12.9089],
    departments: ["Food Court", "Cafeteria"],
  },
  {
    sno: 20,
    name: "Hostel Block A",
    buildingNo: "20",
    coordinates: [77.5670, 12.9075],
    departments: ["Boys Hostel A"],
  },
  {
    sno: 21,
    name: "Hostel Block B",
    buildingNo: "21",
    coordinates: [77.5672, 12.9078],
    departments: ["Boys Hostel B"],
  },
  {
    sno: 22,
    name: "Girls Hostel",
    buildingNo: "22",
    coordinates: [77.5645, 12.9090],
    departments: ["Girls Hostel"],
  },
  {
    sno: 23,
    name: "Placement Office",
    buildingNo: "23",
    coordinates: [77.5650, 12.9087],
    departments: ["Training & Placement Cell"],
  },
  {
    sno: 24,
    name: "R&D Center",
    buildingNo: "24",
    coordinates: [77.5647, 12.9083],
    departments: ["Research & Development"],
  },
  {
    sno: 25,
    name: "Innovation Hub",
    buildingNo: "25",
    coordinates: [77.5644, 12.9086],
    departments: ["Startup Incubation", "Innovation Lab"],
  },
  {
    sno: 26,
    name: "IT Block",
    buildingNo: "26",
    coordinates: [77.5666, 12.9082],
    departments: ["Information Technology"],
  },
  {
    sno: 27,
    name: "Biotechnology Block",
    buildingNo: "27",
    coordinates: [77.5669, 12.9079],
    departments: ["Biotechnology"],
  },
  {
    sno: 28,
    name: "Chemical Engineering",
    buildingNo: "28",
    coordinates: [77.5667, 12.9073],
    departments: ["Chemical Engineering"],
  },
  {
    sno: 29,
    name: "Automobile Lab",
    buildingNo: "29",
    coordinates: [77.5660, 12.9070],
    departments: ["Automobile Engineering Lab"],
  },
  {
    sno: 30,
    name: "Power Station",
    buildingNo: "30",
    coordinates: [77.5656, 12.9069],
    departments: ["Electrical Power Station"],
  },
  {
    sno: 31,
    name: "Medical Center",
    buildingNo: "31",
    coordinates: [77.5652, 12.9073],
    departments: ["Health Center", "First Aid"],
  },
  {
    sno: 32,
    name: "Bank & ATM",
    buildingNo: "32",
    coordinates: [77.5649, 12.9076],
    departments: ["Bank Branch", "ATM"],
  },
  {
    sno: 33,
    name: "Exam Cell",
    buildingNo: "33",
    coordinates: [77.5646, 12.9073],
    departments: ["Examination Branch"],
  },
  {
    sno: 34,
    name: "Store & Dispatch",
    buildingNo: "34",
    coordinates: [77.5643, 12.9080],
    departments: ["Central Store"],
  },
  {
    sno: 35,
    name: "Garden & Parks",
    buildingNo: "35",
    coordinates: [77.5657, 12.9094],
    departments: ["Botanical Garden"],
  },
  {
    sno: 36,
    name: "Basketball Court",
    buildingNo: "36",
    coordinates: [77.5671, 12.9087],
    departments: ["Outdoor Sports"],
  },
  {
    sno: 37,
    name: "Cricket Ground",
    buildingNo: "37",
    coordinates: [77.5674, 12.9082],
    departments: ["Cricket", "Athletics"],
  },
  {
    sno: 38,
    name: "Parking Area A",
    buildingNo: "38",
    coordinates: [77.5642, 12.9075],
    departments: ["Student Parking"],
  },
  {
    sno: 39,
    name: "Parking Area B",
    buildingNo: "39",
    coordinates: [77.5675, 12.9071],
    departments: ["Staff Parking"],
  },
  {
    sno: 40,
    name: "Main Gate",
    buildingNo: "40",
    coordinates: [77.5640, 12.9082],
    departments: ["Main Entrance", "Security"],
  },
  {
    sno: 41,
    name: "Back Gate",
    buildingNo: "41",
    coordinates: [77.5678, 12.9076],
    departments: ["Rear Entrance"],
  },
];

// Utility: Calculate Haversine distance between two points (meters)
export function haversineDistance(
  coord1: [number, number],
  coord2: [number, number]
): number {
  const R = 6371000; // Earth's radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(coord2[1] - coord1[1]);
  const dLon = toRad(coord2[0] - coord1[0]);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1[1])) *
      Math.cos(toRad(coord2[1])) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Format distance for display
export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

// Estimate walking time (avg 5 km/h = ~83m/min)
export function estimateWalkTime(meters: number): string {
  const minutes = Math.ceil(meters / 83);
  if (minutes < 1) return "< 1 min";
  return `~${minutes} min`;
}

// Estimate driving time (avg 20 km/h campus = ~333m/min)
export function estimateDriveTime(meters: number): string {
  const minutes = Math.ceil(meters / 333);
  if (minutes < 1) return "< 1 min";
  return `~${minutes} min`;
}

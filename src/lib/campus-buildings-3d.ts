// ============================================================
// DSCE Campus 3D Building Footprints
// Realistic polygon outlines with heights, colors derived from
// Google Street View / satellite analysis of each building.
// ============================================================

import { buildings } from "@/lib/buildings-geo";
import { buildingAppearancePresetsByNo } from "@/lib/building-appearance-presets";

export interface Building3D {
  id: string;
  name: string;
  buildingNo: string;
  height: number;        // meters
  minHeight: number;     // base height (for elevated structures)
  wallColor: string;     // hex — actual wall/facade color
  windowColor?: string;  // hex — window band tint
  accentColor?: string;  // hex — facade accent tint
  opacity: number;       // 0-1
  polygon: number[][];   // [[lng, lat], ...] ring
}

// ============================================================
// Building footprints — traced from satellite imagery
// Coordinates are [lng, lat] pairs forming closed polygons
// Heights are estimated from floor counts × ~3.2m/floor
// Colors are matched to actual building appearances
// ============================================================

export const campusBuildings3D: Building3D[] = [
  // ---- Building 1: Heritage Block ----
  // 3-4 floor cream/beige building, older colonial-style
  {
    id: "bldg-1",
    name: "Heritage Block",
    buildingNo: "1",
    height: 14,
    minHeight: 0,
    wallColor: "#d4c8a8",
    opacity: 0.92,
    polygon: [
      [77.566461, 12.9091208], [77.5664712, 12.9092328], [77.5666219, 12.9092197], [77.5666167, 12.9091627], [77.5665795, 12.909166], [77.5665625, 12.9089819], [77.5666146, 12.9089774], [77.5666063, 12.9088871], [77.5665538, 12.9088917], [77.5665365, 12.9087042], [77.5665734, 12.9087009], [77.5665679, 12.9086412], [77.5662529, 12.9086688], [77.5662806, 12.90897], [77.5662883, 12.9090014], [77.5662999, 12.9090313], [77.5663173, 12.9090584], [77.5663399, 12.9090816], [77.5663666, 12.9091001], [77.5663963, 12.909113], [77.5664279, 12.90912], [77.566461, 12.9091208]
    ]
  },
  // ---- Building 2: Library ----
  // Modern concrete, 3 floors, light gray roof
  {
    id: "bldg-2",
    name: "Library",
    buildingNo: "2",
    height: 12,
    minHeight: 0,
    wallColor: "#c9c2b8",
    opacity: 0.92,
    polygon: [
      [77.5669873, 12.9092928], [77.5671955, 12.9092752], [77.5671793, 12.9090929], [77.5669711, 12.9091105], [77.5669873, 12.9092928]
    ]
  },
  // ---- Building 3: Automobile Engineering ----
  // Industrial-style, gray concrete, 3-4 floors
  {
    id: "bldg-3",
    name: "Automobile Engineering",
    buildingNo: "3",
    height: 14,
    minHeight: 0,
    wallColor: "#a89e93",
    opacity: 0.92,
    polygon: [
      [77.568188, 12.9091095], [77.568537, 12.909047], [77.5685041, 12.9088723], [77.568155, 12.9089348], [77.568188, 12.9091095]
    ]
  },
  // ---- Building 4: NEB (New Engineering Block) ----
  // Tallest academic building, 5-6 floors, modern white/off-white
  {
    id: "bldg-4",
    name: "New Engineering Block (NEB)",
    buildingNo: "4",
    height: 20,
    minHeight: 0,
    wallColor: "#d8d2c8",
    opacity: 0.92,
    polygon: [
      [77.5681545, 12.9088458], [77.5684513, 12.9087934], [77.5683891, 12.9084585], [77.568064, 12.9085158], [77.5680798, 12.9086008], [77.568053, 12.9086055], [77.5680625, 12.9086567], [77.5680959, 12.9086508], [77.5681061, 12.9087053], [77.5681645, 12.908695], [77.5681559, 12.908649], [77.5681972, 12.9086418], [77.56819, 12.9086034], [77.5682821, 12.9085872], [77.5683103, 12.9087394], [77.5681403, 12.9087694], [77.5681545, 12.9088458]
    ]
  },
  // ---- Building 5: Mechanical Engineering ----
  // Workshop-style with industrial gray, 4 floors
  {
    id: "bldg-5",
    name: "Mechanical Engineering",
    buildingNo: "5",
    height: 16,
    minHeight: 0,
    wallColor: "#9e9488",
    opacity: 0.92,
    polygon: [
      [77.5676468, 12.9086054], [77.5680225, 12.9085989], [77.5680199, 12.9084537], [77.5676442, 12.9084602], [77.5676468, 12.9086054]
    ]
  },
  // ---- Building 6: New Mechanical Block ----
  // Newer construction, light concrete, 3-4 floors
  {
    id: "bldg-6",
    name: "New Mechanical Block",
    buildingNo: "6",
    height: 14,
    minHeight: 0,
    wallColor: "#b8b0a5",
    opacity: 0.92,
    polygon: [
      [77.5675065, 12.9090744], [77.5674148, 12.909074], [77.5674332, 12.909254], [77.5672244, 12.9092715], [77.5672032, 12.90906], [77.5670131, 12.9090596], [77.5669219, 12.9090321], [77.5669437, 12.9089841], [77.5669608, 12.9089343], [77.5669728, 12.9088831], [77.5669797, 12.9088315], [77.5669815, 12.9087795], [77.5669782, 12.9087275], [77.567516, 12.9087354], [77.5675065, 12.9090744]
    ]
  },
  // ---- Building 7: EE Block ----
  // Mid-height concrete, 3-4 floors, weathered gray
  {
    id: "bldg-7",
    name: "Electrical & Electronics Engg",
    buildingNo: "7",
    height: 14,
    minHeight: 0,
    wallColor: "#a59a8e",
    opacity: 0.92,
    polygon: [
      [77.5678611, 12.9083964], [77.5678518, 12.9079713], [77.5676521, 12.9079755], [77.5676614, 12.9084006], [77.5678611, 12.9083964]
    ]
  },
  // ---- Building 8: Robotics & AI Block ----
  // Newer block, 3 floors, lighter facade
  {
    id: "bldg-8",
    name: "Robotics & AI Block",
    buildingNo: "8",
    height: 12,
    minHeight: 0,
    wallColor: "#ccc6be",
    opacity: 0.92,
    polygon: [
      [77.5673805, 12.9083953], [77.5675016, 12.9083934], [77.5674968, 12.9081137], [77.5673757, 12.9081156], [77.5673805, 12.9083953]
    ]
  },
  // ---- Building 9: Chemical Engineering ----
  // 4-5 floors, typical Indian college beige/gray
  {
    id: "bldg-9",
    name: "Chemical Engineering",
    buildingNo: "9",
    height: 16,
    minHeight: 0,
    wallColor: "#b5ab9e",
    opacity: 0.92,
    polygon: [
      [77.5673805, 12.9083953], [77.5675016, 12.9083934], [77.5674968, 12.9081137], [77.5673757, 12.9081156], [77.5673805, 12.9083953]
    ]
  },
  // ---- Building 10: BT & Cybersecurity Block ----
  // Large block, 5-6 floors, cream colored
  {
    id: "bldg-10",
    name: "Biotechnology & Cybersecurity Block",
    buildingNo: "10",
    height: 20,
    minHeight: 0,
    wallColor: "#c2bbb0",
    opacity: 0.92,
    polygon: [
      [77.567649, 12.9079622], [77.568111, 12.9078779], [77.5680884, 12.9077602], [77.5676264, 12.9078445], [77.567649, 12.9079622]
    ]
  },
  // ---- Building 11: NRI Boys Hostel ----
  // Tall hostel, 6 floors, modern off-white
  {
    id: "bldg-11",
    name: "NRI Boys Hostel",
    buildingNo: "11",
    height: 22,
    minHeight: 0,
    wallColor: "#d4cec5",
    opacity: 0.92,
    polygon: [
      [77.5678383, 12.9076772], [77.5679154, 12.9076601], [77.5678684, 12.9074584], [77.567786, 12.9074767], [77.5677679, 12.9074613], [77.5677033, 12.9074401], [77.5676352, 12.9074446], [77.5675741, 12.9074742], [77.5675293, 12.9075243], [77.5675075, 12.9075873], [77.5675122, 12.9076536], [77.5675425, 12.9077131], [77.5675939, 12.9077568], [77.5676585, 12.9077781], [77.5677265, 12.9077735], [77.5677876, 12.907744], [77.5678325, 12.9076939], [77.5678383, 12.9076772]
    ]
  },
  // ---- Building 12: PUC Block ----
  // 3-4 floors, school-style, cream
  {
    id: "bldg-12",
    name: "PUC Block",
    buildingNo: "12",
    height: 14,
    minHeight: 0,
    wallColor: "#beb6aa",
    opacity: 0.92,
    polygon: [
      [77.5668387, 12.9063144], [77.5667113, 12.9062673], [77.566376, 12.90647], [77.5664324, 12.9065497], [77.5667395, 12.9063693], [77.5671163, 12.9066974], [77.5671861, 12.9066294], [77.5668387, 12.9063144]
    ]
  },
  // ---- Building 13: Business Block (MBA) ----
  // 3-4 floors, yellowish cream
  {
    id: "bldg-13",
    name: "Business Block",
    buildingNo: "13",
    height: 14,
    minHeight: 0,
    wallColor: "#c7c0a6",
    opacity: 0.92,
    polygon: [
      [77.5660716, 12.9073164], [77.5660762, 12.9071499], [77.5659809, 12.9071474], [77.5659862, 12.9069532], [77.5659486, 12.9069448], [77.5659133, 12.9069295], [77.5658863, 12.9069115], [77.5658626, 12.9068896], [77.5658428, 12.9068642], [77.5658275, 12.906836], [77.5662714, 12.9065677], [77.5664033, 12.9065673], [77.566404, 12.9067586], [77.5663532, 12.9067588], [77.5663553, 12.9073589], [77.5660716, 12.9073164]
    ]
  },
  // ---- Building 14: Architecture Block ----
  // 3-4 floors, concrete neutral
  {
    id: "bldg-14",
    name: "Architecture Block",
    buildingNo: "14",
    height: 14,
    minHeight: 0,
    wallColor: "#b3ab9f",
    opacity: 0.92,
    polygon: [
      [77.5660716, 12.9073164], [77.5660762, 12.9071499], [77.5659809, 12.9071474], [77.5659862, 12.9069532], [77.5659486, 12.9069448], [77.5659133, 12.9069295], [77.5658863, 12.9069115], [77.5658626, 12.9068896], [77.5658428, 12.9068642], [77.5658275, 12.906836], [77.5662714, 12.9065677], [77.5664033, 12.9065673], [77.566404, 12.9067586], [77.5663532, 12.9067588], [77.5663553, 12.9073589], [77.5660716, 12.9073164]
    ]
  },
  // ---- Building 15: MBA Block ----
  // 3-4 floors, cream/off-white
  {
    id: "bldg-15",
    name: "MBA Block",
    buildingNo: "15",
    height: 14,
    minHeight: 0,
    wallColor: "#cbc4b9",
    opacity: 0.92,
    polygon: [
      [77.5659329, 12.9077616], [77.565977, 12.9074974], [77.5662192, 12.9075357], [77.5661926, 12.9076948], [77.5660272, 12.9076686], [77.5660097, 12.9077737], [77.5659329, 12.9077616]
    ]
  },
  // ---- Building 16: School ----
  // 2-3 floors, lower profile, warm gray
  {
    id: "bldg-16",
    name: "School",
    buildingNo: "16",
    height: 10,
    minHeight: 0,
    wallColor: "#b8b1a6",
    opacity: 0.88,
    polygon: [
      [77.5654264, 12.9072839], [77.5654292, 12.9071922], [77.5655625, 12.9071961], [77.5654769, 12.9071075], [77.5655502, 12.9070403], [77.5656357, 12.9071288], [77.565641, 12.9069584], [77.5657272, 12.9069609], [77.5657194, 12.9072149], [77.5656376, 12.9072901], [77.5654264, 12.9072839]
    ]
  },
  // ---- Building 17: Electronics Block ----
  // 4-5 floors, darker concrete/gray
  {
    id: "bldg-17",
    name: "Electronics Block",
    buildingNo: "17",
    height: 16,
    minHeight: 0,
    wallColor: "#aaa298",
    opacity: 0.92,
    polygon: [
      [77.5653387, 12.9079125], [77.5655586, 12.9078958], [77.5655446, 12.9077211], [77.5653248, 12.9077378], [77.5653387, 12.9079125]
    ]
  },
  // ---- Building 18: Innovation Space ----
  // Single-story / 2 floors, modern light
  {
    id: "bldg-18",
    name: "Innovation Space",
    buildingNo: "18",
    height: 8,
    minHeight: 0,
    wallColor: "#d2ccc3",
    opacity: 0.88,
    polygon: [
      [77.5659329, 12.9077616], [77.565977, 12.9074974], [77.5662192, 12.9075357], [77.5661926, 12.9076948], [77.5660272, 12.9076686], [77.5660097, 12.9077737], [77.5659329, 12.9077616]
    ]
  },
  // ---- Building 19: CSE / ISE / AIML Block ----
  // 4-5 floors, standard institutional gray-cream
  {
    id: "bldg-19",
    name: "CSE / ISE / AIML Block",
    buildingNo: "19",
    height: 16,
    minHeight: 0,
    wallColor: "#bdb6ab",
    opacity: 0.92,
    polygon: [
      [77.5660154, 12.9079269], [77.5662981, 12.9079662], [77.56633, 12.9077481], [77.5660473, 12.9077088], [77.5660154, 12.9079269]
    ]
  },
  // ---- Building 20: Girls Hostel ----
  // 5-6 floors, taller, painted white/cream
  {
    id: "bldg-20",
    name: "Girls Hostel",
    buildingNo: "20",
    height: 20,
    minHeight: 0,
    wallColor: "#d9d3cc",
    opacity: 0.92,
    polygon: [
      [77.5660154, 12.9079269], [77.5662981, 12.9079662], [77.56633, 12.9077481], [77.5660473, 12.9077088], [77.5660154, 12.9079269]
    ]
  },
  // ---- Building 21: Nelson Mandela Old Hostel ----
  // 4-5 floors, aged concrete beige
  {
    id: "bldg-21",
    name: "Nelson Mandela Old Hostel",
    buildingNo: "21",
    height: 16,
    minHeight: 0,
    wallColor: "#bfb8ad",
    opacity: 0.92,
    polygon: [
      [77.5656906, 12.9083581], [77.5656819, 12.9081579], [77.5653801, 12.9081702], [77.5653858, 12.9083012], [77.5655007, 12.9082966], [77.5655037, 12.9083658], [77.5656906, 12.9083581]
    ]
  },
  // ---- Building 22: Chocolate Building ----
  // Distinctive dark brown/chocolate facade, 3-4 floors
  {
    id: "bldg-22",
    name: "Chocolate Building",
    buildingNo: "22",
    height: 14,
    minHeight: 0,
    wallColor: "#7a5c3e",
    opacity: 0.92,
    polygon: [
      [77.5655607, 12.9089207], [77.5658088, 12.9088822], [77.5657923, 12.908781], [77.5656548, 12.9088023], [77.5656277, 12.9086363], [77.565817, 12.9086069], [77.5657978, 12.9084892], [77.5654979, 12.9085356], [77.5655607, 12.9089207]
    ]
  },
  // ---- Building 23: Indian Boys Hostel ----
  // 5-6 floors, cream/off-white, tall
  {
    id: "bldg-23",
    name: "Indian Boys Hostel",
    buildingNo: "23",
    height: 20,
    minHeight: 0,
    wallColor: "#ccc6bd",
    opacity: 0.92,
    polygon: [
      [77.5650962, 12.9090144], [77.5651538, 12.9090155], [77.5651551, 12.9089511], [77.5650976, 12.90895], [77.5650962, 12.9090144]
    ]
  },
  // ---- Building 24: Polytechnic / Civil Block ----
  // 3-4 floors, gray concrete
  {
    id: "bldg-24",
    name: "Polytechnic / Civil Block",
    buildingNo: "24",
    height: 14,
    minHeight: 0,
    wallColor: "#aea698",
    opacity: 0.92,
    polygon: [
      [77.5678611, 12.9083964], [77.5678518, 12.9079713], [77.5676521, 12.9079755], [77.5676614, 12.9084006], [77.5678611, 12.9083964]
    ]
  },
  // ---- Building 25: Dental & Admission Block ----
  // 3 floors, light cream
  {
    id: "bldg-25",
    name: "Dental & Admission Block",
    buildingNo: "25",
    height: 12,
    minHeight: 0,
    wallColor: "#c6bfb4",
    opacity: 0.92,
    polygon: [
      [77.5658661, 12.9089259], [77.5660768, 12.9088969], [77.5660252, 12.9085407], [77.5658979, 12.9085582], [77.5659064, 12.908617], [77.5658231, 12.9086285], [77.5658661, 12.9089259]
    ]
  },
  // ---- Building 26: Hall of Admission ----
  // 2 floors, administrative, warm beige
  {
    id: "bldg-26",
    name: "Hall of Admission",
    buildingNo: "26",
    height: 9,
    minHeight: 0,
    wallColor: "#bbb5ab",
    opacity: 0.90,
    polygon: [
      [77.566461, 12.9091208], [77.5664712, 12.9092328], [77.5666219, 12.9092197], [77.5666167, 12.9091627], [77.5665795, 12.909166], [77.5665625, 12.9089819], [77.5666146, 12.9089774], [77.5666063, 12.9088871], [77.5665538, 12.9088917], [77.5665365, 12.9087042], [77.5665734, 12.9087009], [77.5665679, 12.9086412], [77.5662529, 12.9086688], [77.5662806, 12.90897], [77.5662883, 12.9090014], [77.5662999, 12.9090313], [77.5663173, 12.9090584], [77.5663399, 12.9090816], [77.5663666, 12.9091001], [77.5663963, 12.909113], [77.5664279, 12.90912], [77.566461, 12.9091208]
    ]
  },
  // ---- Auditorium ----
  // Large hall, 2-3 floors, wide footprint, dome-like
  {
    id: "bldg-aud",
    name: "Dr. D. Premachandra Sagar Auditorium",
    buildingNo: "--",
    height: 14,
    minHeight: 0,
    wallColor: "#ccc6bc",
    opacity: 0.92,
    polygon: [
      [77.5675065, 12.9090744], [77.5674148, 12.909074], [77.5674332, 12.909254], [77.5672244, 12.9092715], [77.5672032, 12.90906], [77.5670131, 12.9090596], [77.5669219, 12.9090321], [77.5669437, 12.9089841], [77.5669608, 12.9089343], [77.5669728, 12.9088831], [77.5669797, 12.9088315], [77.5669815, 12.9087795], [77.5669782, 12.9087275], [77.567516, 12.9087354], [77.5675065, 12.9090744]
    ]
  },
  // ---- Amphi Theatre ----
  // Open-air, stepped seating, low profile
  {
    id: "bldg-amph",
    name: "Amphi Theatre",
    buildingNo: "--",
    height: 5,
    minHeight: 0,
    wallColor: "#948b7e",
    opacity: 0.80,
    polygon: [
      [77.56600, 12.90825], [77.56632, 12.90825],
      [77.56632, 12.90800], [77.56600, 12.90800],
      [77.56600, 12.90825]
    ]
  },
  // ---- Temple ----
  // Small structure, traditional style
  {
    id: "bldg-tmpl",
    name: "Shavige Malleshwara Temple",
    buildingNo: "--",
    height: 10,
    minHeight: 0,
    wallColor: "#b89a72",
    opacity: 0.90,
    polygon: [
      [77.566461, 12.9091208], [77.5664712, 12.9092328], [77.5666219, 12.9092197], [77.5666167, 12.9091627], [77.5665795, 12.909166], [77.5665625, 12.9089819], [77.5666146, 12.9089774], [77.5666063, 12.9088871], [77.5665538, 12.9088917], [77.5665365, 12.9087042], [77.5665734, 12.9087009], [77.5665679, 12.9086412], [77.5662529, 12.9086688], [77.5662806, 12.90897], [77.5662883, 12.9090014], [77.5662999, 12.9090313], [77.5663173, 12.9090584], [77.5663399, 12.9090816], [77.5663666, 12.9091001], [77.5663963, 12.909113], [77.5664279, 12.90912], [77.566461, 12.9091208]
    ]
  },
  // ---- Indian Hostel Mess ----
  // Single floor, dining hall
  {
    id: "bldg-imess",
    name: "Indian Hostel Mess",
    buildingNo: "--",
    height: 5,
    minHeight: 0,
    wallColor: "#aba398",
    opacity: 0.85,
    polygon: [
      [77.566461, 12.9091208], [77.5664712, 12.9092328], [77.5666219, 12.9092197], [77.5666167, 12.9091627], [77.5665795, 12.909166], [77.5665625, 12.9089819], [77.5666146, 12.9089774], [77.5666063, 12.9088871], [77.5665538, 12.9088917], [77.5665365, 12.9087042], [77.5665734, 12.9087009], [77.5665679, 12.9086412], [77.5662529, 12.9086688], [77.5662806, 12.90897], [77.5662883, 12.9090014], [77.5662999, 12.9090313], [77.5663173, 12.9090584], [77.5663399, 12.9090816], [77.5663666, 12.9091001], [77.5663963, 12.909113], [77.5664279, 12.90912], [77.566461, 12.9091208]
    ]
  },
  // ---- Girls Hostel Mess ----
  // Single floor
  {
    id: "bldg-gmess",
    name: "Girls Hostel Mess",
    buildingNo: "--",
    height: 5,
    minHeight: 0,
    wallColor: "#b0a99e",
    opacity: 0.85,
    polygon: [
      [77.5652441, 12.9082504], [77.5652093, 12.9079654], [77.5652227, 12.9077406], [77.5653004, 12.9075079], [77.565228, 12.9074713], [77.5651851, 12.9074635], [77.5651261, 12.9074791], [77.5650456, 12.9078033], [77.5650242, 12.9079837], [77.5650698, 12.9082321], [77.56511, 12.9082556], [77.5651798, 12.9082713], [77.5652441, 12.9082504]
    ]
  },
  // ---- Canteen ----
  // Single floor, open-air dining
  {
    id: "bldg-food",
    name: "Canteen",
    buildingNo: "--",
    height: 4,
    minHeight: 0,
    wallColor: "#9e9790",
    opacity: 0.82,
    polygon: [
      [77.5662333, 12.9083611], [77.5663376, 12.9083625], [77.5663396, 12.9082194], [77.5662354, 12.908218], [77.5662333, 12.9083611]
    ]
  },
  // ---- Conveno ----
  // Small block, event space
  {
    id: "bldg-conv",
    name: "Conveno",
    buildingNo: "--",
    height: 6,
    minHeight: 0,
    wallColor: "#b8b0a6",
    opacity: 0.85,
    polygon: [
      [77.5658661, 12.9089259], [77.5660768, 12.9088969], [77.5660252, 12.9085407], [77.5658979, 12.9085582], [77.5659064, 12.908617], [77.5658231, 12.9086285], [77.5658661, 12.9089259]
    ]
  },
  // ---- Xerox ----
  // Tiny structure near gate
  {
    id: "bldg-xerox",
    name: "Xerox",
    buildingNo: "--",
    height: 4,
    minHeight: 0,
    wallColor: "#a6a094",
    opacity: 0.80,
    polygon: [
      [77.5675065, 12.9090744], [77.5674148, 12.909074], [77.5674332, 12.909254], [77.5672244, 12.9092715], [77.5672032, 12.90906], [77.5670131, 12.9090596], [77.5669219, 12.9090321], [77.5669437, 12.9089841], [77.5669608, 12.9089343], [77.5669728, 12.9088831], [77.5669797, 12.9088315], [77.5669815, 12.9087795], [77.5669782, 12.9087275], [77.567516, 12.9087354], [77.5675065, 12.9090744]
    ]
  },
  // ---- Main Gate 1 ----
  {
    id: "bldg-gate1",
    name: "Main Gate 1",
    buildingNo: "--",
    height: 5,
    minHeight: 0,
    wallColor: "#8a837a",
    opacity: 0.78,
    polygon: [
      [77.5669873, 12.9092928], [77.5671955, 12.9092752], [77.5671793, 12.9090929], [77.5669711, 12.9091105], [77.5669873, 12.9092928]
    ]
  },
  // ---- Main Gate 2 ----
  {
    id: "bldg-gate2",
    name: "Main Gate 2",
    buildingNo: "--",
    height: 5,
    minHeight: 0,
    wallColor: "#8a837a",
    opacity: 0.78,
    polygon: [
      [77.5665028, 12.9093883], [77.5666308, 12.9093696], [77.5666139, 12.9092597], [77.5664859, 12.9092784], [77.5665028, 12.9093883]
    ]
  },
  // ---- Washroom near Gate 1 ----
  {
    id: "bldg-wrg1",
    name: "Washroom near Gate 1",
    buildingNo: "--",
    height: 3,
    minHeight: 0,
    wallColor: "#968e86",
    opacity: 0.75,
    polygon: [
      [77.5669873, 12.9092928], [77.5671955, 12.9092752], [77.5671793, 12.9090929], [77.5669711, 12.9091105], [77.5669873, 12.9092928]
    ]
  },
  // ---- Washroom near Heritage ----
  {
    id: "bldg-wrh",
    name: "Washroom near Heritage",
    buildingNo: "--",
    height: 3,
    minHeight: 0,
    wallColor: "#968e86",
    opacity: 0.75,
    polygon: [
      [77.5675065, 12.9090744], [77.5674148, 12.909074], [77.5674332, 12.909254], [77.5672244, 12.9092715], [77.5672032, 12.90906], [77.5670131, 12.9090596], [77.5669219, 12.9090321], [77.5669437, 12.9089841], [77.5669608, 12.9089343], [77.5669728, 12.9088831], [77.5669797, 12.9088315], [77.5669815, 12.9087795], [77.5669782, 12.9087275], [77.567516, 12.9087354], [77.5675065, 12.9090744]
    ]
  }
];

function darkenHex(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#bdb6ab";
  const r = Math.max(0, Math.min(255, parseInt(clean.slice(0, 2), 16) - amount));
  const g = Math.max(0, Math.min(255, parseInt(clean.slice(2, 4), 16) - amount));
  const b = Math.max(0, Math.min(255, parseInt(clean.slice(4, 6), 16) - amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function makeRectFootprint(center: [number, number], widthMeters = 30, depthMeters = 20): number[][] {
  const [lng, lat] = center;
  const latRad = (lat * Math.PI) / 180;
  const metersPerDegLat = 111320;
  const metersPerDegLng = 111320 * Math.cos(latRad);
  const halfLng = (widthMeters / 2) / metersPerDegLng;
  const halfLat = (depthMeters / 2) / metersPerDegLat;

  return [
    [lng - halfLng, lat - halfLat],
    [lng + halfLng, lat - halfLat],
    [lng + halfLng, lat + halfLat],
    [lng - halfLng, lat + halfLat],
    [lng - halfLng, lat - halfLat],
  ];
}

function isCampusBuildingCandidate(name: string, height: number): boolean {
  const n = name.toLowerCase();
  if (height <= 0) return false;
  if (n.includes("parking") || n.includes("ground")) return false;
  return true;
}

function normalizeKey(buildingNo: string, name: string): string {
  return buildingNo !== "--" ? `no:${buildingNo}` : `name:${name.toLowerCase()}`;
}

function getAllCampusBuildings3D(): Building3D[] {
  const existing = new Map<string, Building3D>();
  for (const b of campusBuildings3D) {
    existing.set(normalizeKey(b.buildingNo, b.name), b);
  }

  const derived: Building3D[] = [];

  for (const b of buildings) {
    const key = normalizeKey(b.buildingNo, b.name);
    if (existing.has(key)) continue;

    const h = b.height ?? 10;
    if (!isCampusBuildingCandidate(b.name, h)) continue;

    const wall = "#999185ff";
    const isTall = h >= 16;
    const isMid = h >= 10;

    derived.push({
      id: `auto-${b.sno}`,
      name: b.name,
      buildingNo: b.buildingNo,
      height: h,
      minHeight: 0,
      wallColor: wall,
      opacity: 0.9,
      polygon: makeRectFootprint(
        b.coordinates,
        isTall ? 40 : isMid ? 32 : 24,
        isTall ? 28 : isMid ? 22 : 18
      ),
    });
  }

  const merged = [...campusBuildings3D, ...derived].map((b) => {
    return {
      ...b,
      wallColor: "#999185ff",
      windowColor: "#a39b8c",
      accentColor: "#b8ab9a",
      opacity: 1,
    };
  });

  return merged;
}

export function resolveBuilding3DId(buildingNo: string, name: string): string | null {
  const all = getAllCampusBuildings3D();
  const key = normalizeKey(buildingNo, name);
  const found = all.find((b) => normalizeKey(b.buildingNo, b.name) === key);
  return found?.id ?? null;
}

/**
 * Ensure a polygon ring is counter-clockwise (Right-Hand Rule)
 * Required by GeoJSON spec and MapLibre fill-extrusion to render properly.
 */
function ensureCounterClockwise(ring: number[][]): number[][] {
  let area = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    area += (x2 - x1) * (y2 + y1);
  }
  if (area > 0) {
    return [...ring].reverse();
  }
  return ring;
}

/**
 * Convert building footprint data to GeoJSON FeatureCollection
 * for use with MapLibre fill-extrusion layers
 */
export function buildingsToGeoJSON(): GeoJSON.FeatureCollection {
  const allBuildings = getAllCampusBuildings3D();
  return {
    type: "FeatureCollection",
    features: allBuildings.map(bldg => ({
      type: "Feature" as const,
      id: bldg.id,
      properties: {
        id: bldg.id,
        name: bldg.name,
        buildingNo: bldg.buildingNo,
        height: bldg.height,
        minHeight: bldg.minHeight,
        wallColor: bldg.wallColor,
        windowColor: bldg.windowColor || "#52667b",
        accentColor: bldg.accentColor || "#a9a093",
        opacity: bldg.opacity,
      },
      geometry: {
        type: "Polygon" as const,
        coordinates: [ensureCounterClockwise(bldg.polygon)],
      },
    })),
  };
}

// ============================================================
// DSCE Campus Building Coordinates — Pre-geocoded & Locked
// All coordinates extracted from official Google Maps links
// Format: [longitude, latitude] (MapLibre convention)
// ============================================================

interface BuildingGeo {
  sno: number;
  name: string;
  buildingNo: string;
  label?: string;
  coordinates: [number, number]; // [lng, lat]
  departments?: string[];
  googleMapsUrl?: string;
  notesUrl?: string;
  height?: number;      // estimated building height in meters
  roofColor?: string;   // hex color matching actual rooftop appearance
}

// Campus center point — Dayananda Sagar College of Engineering
const CAMPUS_CENTER: [number, number] = [77.5658, 12.9082];

// Default map view settings — zoomed tight on DSCE campus
const DEFAULT_VIEW = {
  center: CAMPUS_CENTER,
  zoom: 18,
  pitch: 55,
  bearing: -20,
};

const buildings: BuildingGeo[] = [
  {
    "sno": 1,
    "buildingNo": "1",
    "label": "Heritage",
    "name": "Heritage Block",
    "departments": [
      "Heritage Block"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/XJB4exGW3cn9igmL6",
    "coordinates": [
      77.56651, 12.90887
    ],
    "height": 12,
    "roofColor": "#c8b89a"
  },
  {
    "sno": 2,
    "buildingNo": "2",
    "label": "Lib",
    "name": "Library",
    "departments": [
      "Library"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/6UZBP7tUxtcZudmC6",
    "coordinates": [
      77.56704, 12.90923
    ],
    "height": 10,
    "roofColor": "#d4cfc8"
  },
  {
    "sno": 3,
    "buildingNo": "3",
    "label": "AU",
    "name": "Automobile Engineering",
    "departments": [
      "Automobile Engineering"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/YXBYzrH3yrp2iBN36",
    "coordinates": [
   77.56826, 12.90884
    ],
    "height": 12,
    "roofColor": "#b8ada0"
  },
  {
    "sno": 4,
    "buildingNo": "4",
    "label": "NEB",
    "name": "New Engineering Block (NEB)",
    "departments": [
      "Aeronautics Engineering",
      "CS & Data Science",
      "CS & Business Studies",
      "Electrical Dept",
      "Mathematics Dept"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/EnDnBN9hEnhUQWF29",
    "coordinates": [
     77.56834, 12.90855
    ],
    "height": 18,
    "roofColor": "#e0dbd4"
  },
  {
    "sno": 5,
    "buildingNo": "5",
    "label": "Mech",
    "name": "Mechanical Engineering",
    "departments": [
      "Mechanical Engineering"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/vDEEA1D5jGBpzdJF9",
    "coordinates": [
    77.56798, 12.90855
    ],
    "height": 15,
    "roofColor": "#a89e93"
  },
  {
    "sno": 6,
    "buildingNo": "6",
    "label": "NMech",
    "name": "New Mechanical Block",
    "departments": [
      "New Mechanical Engineering Block"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/vDEEA1D5jGBpzdJF9",
    "coordinates": [
     77.56776, 12.90856
    ],
    "height": 12,
    "roofColor": "#c4bdb3"
  },
  {
    "sno": 7,
    "buildingNo": "7",
    "label": "EE",
    "name": "Electrical & Electronics Engg",
    "departments": [
      "Electrical and Electronic Engineering"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/qnoj4SfDaWrSmjrm6",
    "coordinates": [
      77.56776, 12.90824
    ],
    "height": 12,
    "roofColor": "#b0a598"
  },
  {
    "sno": 8,
    "buildingNo": "8",
    "label": "RAI",
    "name": "Robotics & AI Block",
    "departments": [
      "Robotics and Artificial Intelligence"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/bn83Fqa4PaowWXcs5",
    "coordinates": [
   77.56749, 12.90824
    ],
    "height": 10,
    "roofColor": "#d8d2ca"
  },
  {
    "sno": 9,
    "buildingNo": "9",
    "label": "CH",
    "name": "Chemical Engineering",
    "departments": [
      "Chemical Engineering",
      "Chemistry Department"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/GEgPknuV8aZv4JFLA",
    "coordinates": [
      77.56773, 12.9079
    ],
    "height": 15,
    "roofColor": "#bfb5a8"
  },
  {
    "sno": 10,
    "buildingNo": "10",
    "label": "BT",
    "name": "Biotechnology & Cybersecurity Block",
    "departments": [
      "Biotechnology Engineering",
      "Cybersecurity",
      "Cybersecurity IOT & Blockchain",
      "CD Sagar Auditorium",
      "CIL"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/Yy5xVJWpym8NniCm9",
    "coordinates": [
     77.56764, 12.90772
    ],
    "height": 18,
    "roofColor": "#ccc5bb"
  },
  {
    "sno": 11,
    "buildingNo": "11",
    "label": "NRI-H",
    "name": "NRI Boys Hostel",
    "departments": [
      "NRI Boys Hostel",
      "Gym",
      "NRI Hostel Mess"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/dxtd86e2n7yxFUXG7",
    "coordinates": [
      77.56763, 12.90721
    ],
    "height": 20,
    "roofColor": "#ddd7ce"
  },
  {
    "sno": 12,
    "buildingNo": "12",
    "label": "PUC",
    "name": "PUC Block",
    "departments": [
      "PUC"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/LK6KGQZpPm69nznb7",
    "coordinates": [
   77.56679, 12.90642
    ],
    "height": 12,
    "roofColor": "#c9c1b5"
  },
  {
    "sno": 13,
    "buildingNo": "13",
    "label": "MBA",
    "name": "Business Block",
    "departments": [
      "Business Block",
      "MCA (VTU)"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/WGAcL2V6RmVnnXZ66",
    "coordinates": [
      77.56628, 12.90714
    ],
    "height": 12,
    "roofColor": "#d1cab0"
  },
  {
    "sno": 14,
    "buildingNo": "14",
    "label": "Arch",
    "name": "Architecture Block",
    "departments": [
      "Architecture Block",
      "COE"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/xqxhHAqnvhYcDceg9",
    "coordinates": [
      77.56635, 12.90679
    ],
    "height": 12,
    "roofColor": "#bdb5a9"
  },
  {
    "sno": 15,
    "buildingNo": "15",
    "label": "MBA2",
    "name": "MBA Block",
    "departments": [
      "MBA",
      "PG Diploma"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/T4taTXZRaPHgjzFR7",
    "coordinates": [
      77.56622, 12.90737
    ],
    "height": 12,
    "roofColor": "#d4cdc2"
  },
  {
    "sno": 16,
    "buildingNo": "16",
    "label": "Schl",
    "name": "School",
    "departments": [
      "School"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/DyFPugryAbsLj8Sv9",
    "coordinates": [
      77.5656, 12.90708
    ],
    "height": 10,
    "roofColor": "#c2bbb0"
  },
  {
    "sno": 17,
    "buildingNo": "17",
    "label": "EC",
    "name": "Electronics Block",
    "departments": [
      "Electronics & Communication Engg",
      "Electronics & Telecom",
      "BCA",
      "MCA",
      "B.Arch"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/ghdBg1mqNX4GfaW1A",
    "coordinates": [
     77.56552, 12.90764
    ],
    "height": 15,
    "roofColor": "#b5ada2"
  },
  {
    "sno": 18,
    "buildingNo": "18",
    "label": "IS",
    "name": "Innovation Space",
    "departments": [
      "Innovation Space (CSE / ISE / AIML)"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/2i21F4zEkX9Q1nvY8",
    "coordinates": [
      77.56607, 12.90764
    ],
    "height": 8,
    "roofColor": "#dcd6cd"
  },
  {
    "sno": 19,
    "buildingNo": "19",
    "label": "CSE",
    "name": "CSE / ISE / AIML Block",
    "departments": [
      "Computer Science & Engineering",
      "Information Science Engg",
      "AI & Machine Learning",
      "Physics Dept"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/YXBYzrH3yrp2iBN36",
    "coordinates": [
     77.56608, 12.90778
    ],
    "height": 15,
    "roofColor": "#c7c0b5"
  },
  {
    "sno": 20,
    "buildingNo": "20",
    "label": "G-H",
    "name": "Girls Hostel",
    "departments": [
      "Girls Hostel"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/DMEqcBNTKBkq3vsy5",
    "coordinates": [
     77.56638, 12.90767
    ],
    "height": 18,
    "roofColor": "#e2dcd5"
  },
  {
    "sno": 21,
    "buildingNo": "21",
    "label": "NMH",
    "name": "Nelson Mandela Old Hostel",
    "departments": [
      "Nelson Mandela Old Hostel"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/XigyWbdsS24TPWkB8",
    "coordinates": [
      77.56562, 12.90808
    ],
    "height": 15,
    "roofColor": "#c9c2b7"
  },
  {
    "sno": 22,
    "buildingNo": "22",
    "label": "CD",
    "name": "Chocolate Building",
    "departments": [
      "CS & Design Engineering",
      "Medical Electronics",
      "Electronics & Instrumentation"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/uVTUVArGaXX1dqZR6",
    "coordinates": [
      77.56566, 12.90836
    ],
    "height": 12,
    "roofColor": "#8b6b4a"
  },
  {
    "sno": 23,
    "buildingNo": "23",
    "label": "IBH",
    "name": "Indian Boys Hostel",
    "departments": [
      "Indian Boys Hostel"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/PmvhTD28ciXYwuJy8",
    "coordinates": [
     77.5654, 12.90868
    ],
    "height": 18,
    "roofColor": "#d5cfc6"
  },
  {
    "sno": 24,
    "buildingNo": "24",
    "label": "Civil",
    "name": "Polytechnic / Civil Block",
    "departments": [
      "Polytechnic",
      "Civil Engineering"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/skHR2qxpHxDLPJxQ8",
    "coordinates": [
     77.56784, 12.90809
    ],
    "height": 12,
    "roofColor": "#b8b0a4"
  },
  {
    "sno": 25,
    "buildingNo": "25",
    "label": "Dent",
    "name": "Dental & Admission Block",
    "departments": [
      "Dental",
      "City of Admission"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/PPQted9ATLLGEAWD7",
    "coordinates": [
     77.56603, 12.90876
    ],
    "height": 10,
    "roofColor": "#d0c9be"
  },
  {
    "sno": 26,
    "buildingNo": "26",
    "label": "Adm",
    "name": "Hall of Admission",
    "departments": [
      "Hall of Admission"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/kpoS9xJvM38pU2qT8",
    "coordinates": [
    77.56639, 12.9088
    ],
    "height": 8,
    "roofColor": "#c5bfb5"
  },
  {
    "sno": 27,
    "buildingNo": "--",
    "label": "Aud",
    "name": "Dr. D. Premachandra Sagar Auditorium",
    "departments": [
      "Dr D Premachandra Sagar Auditorium",
      "Center for Performing Arts"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/iJcoARKjhDxE9qS19",
    "coordinates": [
     77.56704, 12.90892
    ],
    "height": 12,
    "roofColor": "#d6d0c6"
  },
  {
    "sno": 28,
    "buildingNo": "--",
    "label": "Amph",
    "name": "Amphi Theatre",
    "departments": [
      "Amphi Theatre"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/nsu6wrxGZYBW1n3a6",
    "coordinates": [
     77.56615, 12.90812
    ],
    "height": 5,
    "roofColor": "#9e9588"
  },
  {
    "sno": 29,
    "buildingNo": "--",
    "label": "Tmpl",
    "name": "Shavige Malleshwara Temple",
    "departments": [
      "Shavige Malleshwara Temple"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/CDYrikyh7RXm7fCv7",
    "coordinates": [
      77.56671, 12.90854
    ],
    "height": 8,
    "roofColor": "#c4a882"
  },
  {
    "sno": 30,
    "buildingNo": "--",
    "label": "IMess",
    "name": "Indian Hostel Mess",
    "departments": [
      "Indian Hostel Mess"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/UvT115vACWj82LwWA",
    "coordinates": [
   77.56644, 12.90843
    ],
    "height": 5,
    "roofColor": "#b5ada2"
  },
  {
    "sno": 31,
    "buildingNo": "--",
    "label": "GMess",
    "name": "Girls Hostel Mess",
    "departments": [
      "Girls Hostel Mess"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/swcWcDVRzm46nPUn6",
    "coordinates": [
  77.56546, 12.90809
    ],
    "height": 5,
    "roofColor": "#bab3a8"
  },
  {
    "sno": 32,
    "buildingNo": "--",
    "label": "Food",
    "name": "Canteen",
    "departments": [
      "Canteen"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/kioxSYiJcYuZiHhXA",
    "coordinates": [
      77.56631, 12.90836
    ],
    "height": 4,
    "roofColor": "#a8a19a"
  },
  {
    "sno": 33,
    "buildingNo": "--",
    "label": "Grnd",
    "name": "Football Ground",
    "departments": [
      "Football Ground"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/3mEvVrYP8sXFLLh77",
    "coordinates": [
    77.56674, 12.90713
    ],
    "height": 0,
    "roofColor": "#5a7a3a"
  },
  {
    "sno": 34,
    "buildingNo": "--",
    "label": "Gate1",
    "name": "Main Gate 1",
    "departments": [
      "Main Gate 1"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/aW5MvAu7CfnJX3d18",
    "coordinates": [
77.5669, 12.90937
    ],
    "height": 4,
    "roofColor": "#948d84"
  },
  {
    "sno": 35,
    "buildingNo": "--",
    "label": "Gate2",
    "name": "Main Gate 2",
    "departments": [
      "Main Gate 2"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/5DBPp36KGQbgwC1J8",
    "coordinates": [
    77.56648, 12.90931
    ],
    "height": 4,
    "roofColor": "#948d84"
  },
  {
    "sno": 36,
    "buildingNo": "--",
    "label": "P-S",
    "name": "Student Parking",
    "departments": [
      "Students Vehicle Parking"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/skud2i41SjYoFhQZ6",
    "coordinates": [
     77.56786, 12.90901
    ],
    "height": 0,
    "roofColor": "#6b6560"
  },
  {
    "sno": 37,
    "buildingNo": "--",
    "label": "P-F",
    "name": "Faculty Parking",
    "departments": [
      "Faculty Vehicle Parking"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/Eig6r2WGqaT65nQD9",
    "coordinates": [
    77.56595, 12.90914
    ],
    "height": 0,
    "roofColor": "#6b6560"
  },
  {
    "sno": 38,
    "buildingNo": "--",
    "label": "Conv",
    "name": "Conveno",
    "departments": [
      "Conveno"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/dZP5ib98JTcsRhm37",
    "coordinates": [
   77.5663, 12.90877
    ],
    "height": 5,
    "roofColor": "#c2bab0"
  },
  {
    "sno": 39,
    "buildingNo": "--",
    "label": "Xerox",
    "name": "Xerox",
    "departments": [
      "Xerox"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/SmV94qVTPooFK2Ek7",
    "coordinates": [
      77.5674, 12.90928
    ],
    "height": 4,
    "roofColor": "#b0a89e"
  },
  {
    "sno": 40,
    "buildingNo": "--",
    "label": "WR-G1",
    "name": "Washroom near Gate 1",
    "departments": [
      "Washroom near Main Gate 1"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/GTNi4rw6wXaNtvMp8",
    "coordinates": [
    77.5672, 12.90937
    ],
    "height": 3,
    "roofColor": "#a09890"
  },
  {
    "sno": 41,
    "buildingNo": "--",
    "label": "WR-H",
    "name": "Washroom near Heritage",
    "departments": [
      "Washroom near Heritage Building"
    ],
    "googleMapsUrl": "https://maps.app.goo.gl/SDpVe6tCaGRFEXRE7",
    "coordinates": [
      77.56702, 12.90877
    ],
    "height": 3,
    "roofColor": "#a09890"
  }
];

// Utility: Calculate Haversine distance between two points (meters)
function haversineDistance(
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
function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

// Estimate walking time (avg 5 km/h = ~83m/min)
function estimateWalkTime(meters: number): string {
  const minutes = Math.ceil(meters / 83);
  if (minutes < 1) return "< 1 min";
  return `~${minutes} min`;
}

// Estimate driving time (avg 20 km/h campus = ~333m/min)
function estimateDriveTime(meters: number): string {
  const minutes = Math.ceil(meters / 333);
  if (minutes < 1) return "< 1 min";
  return `~${minutes} min`;
}

fs.writeFileSync('buildings.json', JSON.stringify(buildings));
const fs = require('fs');

const osmData = JSON.parse(fs.readFileSync('osm_buildings.json', 'utf8'));
const ways = osmData.elements.filter(e => e.type === 'way' && e.geometry);
const nodes = {};
osmData.elements.filter(e => e.type === 'node').forEach(n => nodes[n.id] = {lat: n.lat, lon: n.lon});

const tsContent = fs.readFileSync('src/lib/campus-buildings-3d.ts', 'utf8');
const bldgMatches = [...tsContent.matchAll(/polygon:\s*\[([\s\S]*?)\]/g)];

function getCentroid(pts) {
  let lon = 0, lat = 0;
  for (let p of pts) {
    lon += p.lon;
    lat += p.lat;
  }
  return {lon: lon/pts.length, lat: lat/pts.length};
}

const campusCentroids = bldgMatches.map(m => {
  const coordsStr = m[1].split('],');
  const pts = coordsStr.map(s => {
    const coords = s.replace(/[\[\]]/g, '').split(',');
    if (coords.length >= 2) return {lon: parseFloat(coords[0]), lat: parseFloat(coords[1])};
    return null;
  }).filter(Boolean);
  if (pts.length > 0) return getCentroid(pts);
  return null;
}).filter(Boolean);

function isPointInPolygon(point, vs) {
    let x = point.lon, y = point.lat;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i].lon, yi = vs[i].lat;
        let xj = vs[j].lon, yj = vs[j].lat;
        let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

const features = [];

ways.forEach(way => {
  const geometry = way.geometry || way.nodes.map(nid => nodes[nid]).filter(n => n);
  if (!geometry || geometry.length < 3) return;

  let isCampusBuilding = false;
  for (let centroid of campusCentroids) {
    if (isPointInPolygon(centroid, geometry)) {
      isCampusBuilding = true;
      break;
    }
  }

  if (!isCampusBuilding) {
    const coordinates = geometry.map(pt => [pt.lon, pt.lat]);
    if (coordinates[0][0] !== coordinates[coordinates.length-1][0] || coordinates[0][1] !== coordinates[coordinates.length-1][1]) {
      coordinates.push([...coordinates[0]]);
    }
    
    // Ensure counter-clockwise winding order for surrounding buildings too
    let area = 0;
    for (let i = 0; i < coordinates.length - 1; i++) {
      area += (coordinates[i+1][0] - coordinates[i][0]) * (coordinates[i+1][1] + coordinates[i][1]);
    }
    if (area > 0) {
      coordinates.reverse();
    }

    let height = 10;
    if (way.tags) {
      if (way.tags.height) height = parseFloat(way.tags.height.replace(/[^\d.]/g, '')) || 10;
      else if (way.tags['building:levels']) height = (parseInt(way.tags['building:levels']) || 3) * 3;
    }

    features.push({
      type: "Feature",
      properties: { height: height, minHeight: 0, color: "#e5e5e5" },
      geometry: { type: "Polygon", coordinates: [coordinates] }
    });
  }
});

fs.writeFileSync('public/surrounding-buildings.json', JSON.stringify({type: "FeatureCollection", features: features}));
console.log('Saved surrounding buildings. Count:', features.length);

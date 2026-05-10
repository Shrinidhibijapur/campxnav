const https = require('https');
const query = '[out:json];way(around:800,12.9082,77.5658)["building"];out geom;';
const url = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query);
const options = {
  headers: {
    'User-Agent': 'CampXNav Script/1.0',
    'Accept': '*/*'
  }
};
https.get(url, options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    require('fs').writeFileSync('osm_buildings.json', data);
    console.log('Saved to osm_buildings.json');
  });
}).on('error', err => console.error(err));

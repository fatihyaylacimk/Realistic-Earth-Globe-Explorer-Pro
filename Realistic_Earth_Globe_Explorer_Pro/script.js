const canvas = document.getElementById("earthCanvas");
const ctx = canvas.getContext("2d");

const zoomText = document.getElementById("zoomText");
const visibleText = document.getElementById("visibleText");
const modeText = document.getElementById("modeText");
const infoPanel = document.getElementById("infoPanel");
const infoType = document.getElementById("infoType");
const infoTitle = document.getElementById("infoTitle");
const infoDescription = document.getElementById("infoDescription");
const infoGrid = document.getElementById("infoGrid");
const locationList = document.getElementById("locationList");

const zoomIn = document.getElementById("zoomIn");
const zoomOut = document.getElementById("zoomOut");
const resetView = document.getElementById("resetView");
const closeInfo = document.getElementById("closeInfo");

let width;
let height;
let dpr;
let time = 0;

let rotation = { lon: -20, lat: -5 };
let targetRotation = { lon: -20, lat: -5 };
let zoom = 1.05;
let targetZoom = 1.05;

let dragging = false;
let dragStart = { x: 0, y: 0, lon: 0, lat: 0 };
let mouse = { x: -9999, y: -9999 };

const clickableItems = [];
const stars = [];
const clouds = [];

const continents = [
  {
    name: "North America",
    points: [
      [-168, 63], [-145, 72], [-114, 70], [-92, 61], [-75, 52], [-60, 43],
      [-78, 25], [-98, 17], [-117, 25], [-130, 42], [-152, 51]
    ]
  },
  {
    name: "Central America",
    points: [[-105, 22], [-88, 20], [-78, 12], [-84, 8], [-100, 14]]
  },
  {
    name: "South America",
    points: [
      [-81, 10], [-63, 5], [-47, -5], [-38, -18], [-45, -34],
      [-55, -53], [-68, -50], [-76, -28], [-80, -8]
    ]
  },
  {
    name: "Europe",
    points: [
      [-11, 36], [-5, 52], [10, 60], [30, 58], [44, 49], [33, 40], [14, 36], [0, 42]
    ]
  },
  {
    name: "Africa",
    points: [
      [-17, 33], [7, 36], [31, 31], [45, 12], [41, -15], [28, -34],
      [10, -35], [-8, -22], [-15, 4]
    ]
  },
  {
    name: "Middle East",
    points: [[35, 34], [55, 31], [62, 20], [48, 12], [36, 18]]
  },
  {
    name: "Asia",
    points: [
      [38, 55], [60, 67], [100, 67], [140, 55], [153, 40], [138, 23],
      [108, 8], [78, 17], [54, 26], [36, 40]
    ]
  },
  {
    name: "India",
    points: [[68, 25], [82, 27], [90, 20], [78, 7], [70, 16]]
  },
  {
    name: "Southeast Asia",
    points: [[95, 18], [111, 13], [118, 1], [106, -6], [98, 5]]
  },
  {
    name: "Australia",
    points: [[112, -12], [154, -18], [151, -37], [130, -43], [113, -31]]
  },
  {
    name: "Greenland",
    points: [[-52, 60], [-34, 72], [-45, 82], [-70, 78], [-72, 65]]
  },
  {
    name: "Japan",
    points: [[136, 45], [144, 40], [141, 34], [132, 32], [130, 38]]
  }
];

const countries = [
  {
    name: "United States",
    capital: "Washington, D.C.",
    region: "North America",
    lon: -98, lat: 39,
    population: "331M+",
    info: "A large North American country with major technology, finance and innovation centers."
  },
  {
    name: "Canada",
    capital: "Ottawa",
    region: "North America",
    lon: -106, lat: 57,
    population: "38M+",
    info: "Known for large natural landscapes, advanced cities and strong technology sectors."
  },
  {
    name: "Brazil",
    capital: "Brasília",
    region: "South America",
    lon: -51, lat: -10,
    population: "214M+",
    info: "The largest country in South America, with major economic and cultural influence."
  },
  {
    name: "United Kingdom",
    capital: "London",
    region: "Europe",
    lon: -2, lat: 54,
    population: "67M+",
    info: "A major European economy with strong finance, education and technology sectors."
  },
  {
    name: "France",
    capital: "Paris",
    region: "Europe",
    lon: 2, lat: 46,
    population: "67M+",
    info: "A European country known for culture, industry, tourism and research."
  },
  {
    name: "Germany",
    capital: "Berlin",
    region: "Europe",
    lon: 10, lat: 51,
    population: "83M+",
    info: "A leading European industrial and engineering economy."
  },
  {
    name: "Türkiye",
    capital: "Ankara",
    region: "Europe / Asia",
    lon: 35, lat: 39,
    population: "85M+",
    info: "A transcontinental country connecting Europe and Asia with major trade and cultural routes."
  },
  {
    name: "North Macedonia",
    capital: "Skopje",
    region: "Balkans",
    lon: 21.7, lat: 41.6,
    population: "1.8M+",
    info: "A Balkan country located in Southeast Europe, with Skopje as its capital."
  },
  {
    name: "Egypt",
    capital: "Cairo",
    region: "Africa",
    lon: 30, lat: 27,
    population: "109M+",
    info: "A North African country known for the Nile, Cairo and ancient civilization."
  },
  {
    name: "South Africa",
    capital: "Pretoria / Cape Town / Bloemfontein",
    region: "Africa",
    lon: 24, lat: -29,
    population: "60M+",
    info: "A major African economy with diverse geography and urban centers."
  },
  {
    name: "India",
    capital: "New Delhi",
    region: "Asia",
    lon: 78, lat: 22,
    population: "1.4B+",
    info: "A highly populated South Asian country with major technology, industry and culture."
  },
  {
    name: "China",
    capital: "Beijing",
    region: "Asia",
    lon: 104, lat: 35,
    population: "1.4B+",
    info: "A major global economy with large cities, industry and technology development."
  },
  {
    name: "Japan",
    capital: "Tokyo",
    region: "Asia",
    lon: 138, lat: 37,
    population: "125M+",
    info: "An island country known for advanced technology, industry and dense urban regions."
  },
  {
    name: "Australia",
    capital: "Canberra",
    region: "Oceania",
    lon: 134, lat: -25,
    population: "26M+",
    info: "A country and continent with major cities, natural resources and coastal population centers."
  }
];

const cities = [
  { city: "New York", country: "United States", lon: -74.006, lat: 40.7128, population: "8.4M", info: "A major global finance, media and technology city." },
  { city: "Los Angeles", country: "United States", lon: -118.2437, lat: 34.0522, population: "3.9M", info: "Known for entertainment, technology and creative industries." },
  { city: "Toronto", country: "Canada", lon: -79.3832, lat: 43.6532, population: "2.9M", info: "Canada's largest city and a major business and technology hub." },
  { city: "São Paulo", country: "Brazil", lon: -46.6333, lat: -23.5505, population: "12.3M", info: "Brazil's largest city and a major economic center." },
  { city: "London", country: "United Kingdom", lon: -0.1276, lat: 51.5072, population: "8.9M", info: "A major global finance, culture and education center." },
  { city: "Paris", country: "France", lon: 2.3522, lat: 48.8566, population: "2.1M", info: "France's capital, known for culture, business and tourism." },
  { city: "Berlin", country: "Germany", lon: 13.405, lat: 52.52, population: "3.7M", info: "Germany's capital and a strong startup and technology center." },
  { city: "Istanbul", country: "Türkiye", lon: 28.9784, lat: 41.0082, population: "15.9M", info: "A major city connecting Europe and Asia through trade, culture and history." },
  { city: "Ankara", country: "Türkiye", lon: 32.8597, lat: 39.9334, population: "5.7M", info: "Türkiye's capital and administrative center." },
  { city: "Skopje", country: "North Macedonia", lon: 21.4316, lat: 41.9981, population: "0.5M", info: "The capital and largest city of North Macedonia." },
  { city: "Cairo", country: "Egypt", lon: 31.2357, lat: 30.0444, population: "10M+", info: "Egypt's capital and one of Africa's largest metropolitan areas." },
  { city: "Cape Town", country: "South Africa", lon: 18.4241, lat: -33.9249, population: "4.8M", info: "A major South African coastal city with tourism and business activity." },
  { city: "Mumbai", country: "India", lon: 72.8777, lat: 19.076, population: "12.5M", info: "A major Indian finance, trade and entertainment center." },
  { city: "Delhi", country: "India", lon: 77.1025, lat: 28.7041, population: "16.8M", info: "A major metropolitan region and national capital area." },
  { city: "Beijing", country: "China", lon: 116.4074, lat: 39.9042, population: "21.5M", info: "China's capital and a major political, cultural and technology city." },
  { city: "Shanghai", country: "China", lon: 121.4737, lat: 31.2304, population: "24.9M", info: "A major global finance, shipping and technology center." },
  { city: "Tokyo", country: "Japan", lon: 139.6917, lat: 35.6895, population: "14M+", info: "Japan's capital and one of the world's largest metropolitan economies." },
  { city: "Sydney", country: "Australia", lon: 151.2093, lat: -33.8688, population: "5.3M", info: "A major Australian city known for business, culture and coastal lifestyle." }
];

const connections = [
  ["New York", "London"], ["London", "Paris"], ["Paris", "Istanbul"], ["Istanbul", "Mumbai"],
  ["Mumbai", "Singapore"], ["Tokyo", "Sydney"], ["New York", "São Paulo"], ["Berlin", "Skopje"],
  ["Skopje", "Istanbul"], ["Cairo", "Cape Town"], ["Beijing", "Shanghai"], ["Los Angeles", "Tokyo"]
];

function resize() {
  dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  initScene();
}

function initScene() {
  stars.length = 0;
  clouds.length = 0;

  for (let i = 0; i < Math.floor(width * height / 3600); i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.45 + 0.22,
      alpha: Math.random() * 0.72 + 0.18,
      phase: Math.random() * Math.PI * 2
    });
  }

  for (let i = 0; i < 42; i++) {
    clouds.push({
      lon: Math.random() * 360 - 180,
      lat: Math.random() * 120 - 60,
      size: Math.random() * 13 + 8,
      speed: Math.random() * 0.025 + 0.012,
      alpha: Math.random() * 0.15 + 0.05
    });
  }
}

function center() {
  return { x: width * 0.52, y: height * 0.52 };
}

function radius() {
  return Math.min(width, height) * 0.31 * zoom;
}

function toRad(deg) {
  return deg * Math.PI / 180;
}

function project(lon, lat) {
  const lonR = toRad(lon + rotation.lon);
  const latR = toRad(lat + rotation.lat);
  const r = radius();
  const c = center();

  const x3 = Math.cos(latR) * Math.sin(lonR);
  const y3 = Math.sin(latR);
  const z3 = Math.cos(latR) * Math.cos(lonR);

  return {
    x: c.x + x3 * r,
    y: c.y - y3 * r,
    z: z3,
    visible: z3 > -0.035,
    scale: 0.62 + z3 * 0.38
  };
}

function drawSpace() {
  const g = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height) * 0.72);
  g.addColorStop(0, "#071b33");
  g.addColorStop(0.45, "#031024");
  g.addColorStop(1, "#01040b");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);

  for (const s of stars) {
    const tw = 0.55 + Math.sin(time * 1.7 + s.phase) * 0.45;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(220,235,255,${s.alpha * tw})`;
    ctx.fill();
  }
}

function clipGlobe() {
  const c = center();
  const r = radius();
  ctx.beginPath();
  ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
  ctx.clip();
}

function drawEarthOcean() {
  const c = center();
  const r = radius();

  ctx.save();

  const ocean = ctx.createRadialGradient(c.x - r * 0.42, c.y - r * 0.42, 0, c.x, c.y, r);
  ocean.addColorStop(0.00, "#46b7e8");
  ocean.addColorStop(0.18, "#1f8dc2");
  ocean.addColorStop(0.42, "#0b5d93");
  ocean.addColorStop(0.68, "#063461");
  ocean.addColorStop(0.90, "#021936");
  ocean.addColorStop(1.00, "#000812");

  ctx.beginPath();
  ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
  ctx.fillStyle = ocean;
  ctx.shadowBlur = 52;
  ctx.shadowColor = "rgba(90,200,255,0.42)";
  ctx.fill();

  // ocean depth bands
  ctx.save();
  clipGlobe();
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.ellipse(
      c.x + Math.sin(time * 0.2 + i) * r * 0.2,
      c.y + (i - 5) * r * 0.12,
      r * (0.9 - i * 0.025),
      r * 0.05,
      Math.sin(i) * 0.25,
      0,
      Math.PI * 2
    );
    ctx.strokeStyle = `rgba(120,210,255,${0.035 + i * 0.002})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();
}

function drawLand() {
  ctx.save();
  clipGlobe();

  for (const cont of continents) {
    const projected = cont.points.map(([lon, lat]) => project(lon, lat));
    const visible = projected.filter(p => p.visible).length;
    if (visible < 3) continue;

    const avgZ = projected.reduce((s, p) => s + p.z, 0) / projected.length;
    const landGrad = ctx.createLinearGradient(0, center().y - radius(), 0, center().y + radius());
    landGrad.addColorStop(0, `rgba(190, 210, 150, ${0.58 + avgZ * 0.18})`);
    landGrad.addColorStop(0.36, `rgba(112, 170, 92, ${0.62 + avgZ * 0.16})`);
    landGrad.addColorStop(0.68, `rgba(92, 132, 72, ${0.58 + avgZ * 0.12})`);
    landGrad.addColorStop(1, `rgba(206, 185, 120, ${0.48 + avgZ * 0.10})`);

    ctx.beginPath();
    let started = false;

    for (const p of projected) {
      if (!p.visible) continue;
      if (!started) {
        ctx.moveTo(p.x, p.y);
        started = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }

    ctx.closePath();
    ctx.fillStyle = landGrad;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(80,120,60,0.22)";
    ctx.fill();

    ctx.strokeStyle = "rgba(230,245,210,0.22)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.restore();
}

function drawClouds() {
  ctx.save();
  clipGlobe();
  ctx.globalCompositeOperation = "screen";

  for (const cloud of clouds) {
    cloud.lon += cloud.speed;
    if (cloud.lon > 180) cloud.lon = -180;

    const p = project(cloud.lon, cloud.lat);
    if (!p.visible || p.z < 0.02) continue;

    const size = cloud.size * zoom * p.scale;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, size * 2.1, size * 0.65, Math.sin(cloud.lon) * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${cloud.alpha * p.scale})`;
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(p.x + size * 0.9, p.y + size * 0.15, size * 1.6, size * 0.5, 0.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${cloud.alpha * 0.7 * p.scale})`;
    ctx.fill();
  }

  ctx.restore();
}

function drawGrid() {
  ctx.save();
  clipGlobe();

  for (let lat = -60; lat <= 60; lat += 30) {
    drawProjectedLine(Array.from({ length: 145 }, (_, i) => [-180 + i * 2.5, lat]), "rgba(230,250,255,0.085)", 1);
  }

  for (let lon = -180; lon <= 180; lon += 30) {
    drawProjectedLine(Array.from({ length: 73 }, (_, i) => [lon, -90 + i * 2.5]), "rgba(230,250,255,0.075)", 1);
  }

  ctx.restore();
}

function drawProjectedLine(points, color, lineWidth) {
  ctx.beginPath();
  let started = false;

  for (const [lon, lat] of points) {
    const p = project(lon, lat);
    if (!p.visible) {
      started = false;
      continue;
    }

    if (!started) {
      ctx.moveTo(p.x, p.y);
      started = true;
    } else {
      ctx.lineTo(p.x, p.y);
    }
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function drawAtmosphere() {
  const c = center();
  const r = radius();

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  ctx.beginPath();
  ctx.arc(c.x, c.y, r * 1.006, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(130,220,255,0.52)";
  ctx.lineWidth = 2.4;
  ctx.shadowBlur = 35;
  ctx.shadowColor = "rgba(80,190,255,0.70)";
  ctx.stroke();

  const atmosphere = ctx.createRadialGradient(c.x, c.y, r * 0.86, c.x, c.y, r * 1.25);
  atmosphere.addColorStop(0, "rgba(125,223,255,0)");
  atmosphere.addColorStop(0.58, "rgba(125,223,255,0.10)");
  atmosphere.addColorStop(1, "rgba(125,223,255,0)");

  ctx.fillStyle = atmosphere;
  ctx.beginPath();
  ctx.arc(c.x, c.y, r * 1.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawNightShadow() {
  const c = center();
  const r = radius();

  ctx.save();
  ctx.beginPath();
  ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
  ctx.clip();

  const shadow = ctx.createLinearGradient(c.x - r, c.y - r, c.x + r, c.y + r);
  shadow.addColorStop(0, "rgba(255,255,255,0.05)");
  shadow.addColorStop(0.42, "rgba(0,0,0,0)");
  shadow.addColorStop(0.76, "rgba(0,0,0,0.38)");
  shadow.addColorStop(1, "rgba(0,0,0,0.72)");

  ctx.fillStyle = shadow;
  ctx.fillRect(c.x - r, c.y - r, r * 2, r * 2);

  ctx.restore();
}

function drawCountries() {
  if (zoom < 1.32) return;

  ctx.save();
  ctx.font = `${Math.min(15, 10 + zoom * 1.25)}px Arial`;
  ctx.textAlign = "center";

  for (const country of countries) {
    const p = project(country.lon, country.lat);
    if (!p.visible || p.z < 0.18) continue;

    const alpha = Math.min(0.90, 0.22 + p.z * 0.78);
    const textY = p.y - 10 * zoom;

    ctx.fillStyle = `rgba(245,250,230,${alpha})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(0,0,0,0.88)";
    ctx.fillText(country.name, p.x, textY);

    clickableItems.push({
      type: "country",
      data: country,
      x: p.x,
      y: textY - 4,
      r: 24 + country.name.length * 3
    });
  }

  ctx.restore();
}

function drawCities() {
  clickableItems.length = clickableItems.filter(i => i.type !== "city" && i.type !== "country").length ? clickableItems : [];
  const visible = [];

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (const city of cities) {
    const p = project(city.lon, city.lat);
    if (!p.visible || p.z < 0.04) continue;

    visible.push({ ...city, z: p.z });

    if (zoom < 1.65) continue;

    const alpha = Math.min(1, 0.18 + p.z * 0.86);
    const markerSize = Math.max(3, 4.2 * p.scale * Math.min(1.6, zoom * 0.72));

    ctx.beginPath();
    ctx.arc(p.x, p.y, markerSize * (3.4 + Math.sin(time * 4 + city.lon) * 0.7), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(125,223,255,${0.045 * alpha})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, markerSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(109,255,157,${0.90 * alpha})`;
    ctx.shadowBlur = 14;
    ctx.shadowColor = `rgba(125,223,255,${0.85 * alpha})`;
    ctx.fill();

    ctx.shadowBlur = 0;
    if (zoom > 2.15 && p.z > 0.18) {
      ctx.font = `${Math.min(14, 9 + zoom)}px Arial`;
      ctx.textAlign = "left";
      ctx.fillStyle = `rgba(245,255,248,${0.82 * alpha})`;
      ctx.fillText(city.city, p.x + 9, p.y - 7);
    }

    clickableItems.push({
      type: "city",
      data: city,
      x: p.x,
      y: p.y,
      r: Math.max(13, markerSize * 4)
    });
  }

  ctx.restore();

  updateLocationList(visible);
}

function drawConnections() {
  if (zoom < 1.15) return;

  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < connections.length; i++) {
    const [aName, bName] = connections[i];
    const aCity = cities.find(c => c.city === aName);
    const bCity = cities.find(c => c.city === bName);
    if (!aCity || !bCity) continue;

    const a = project(aCity.lon, aCity.lat);
    const b = project(bCity.lon, bCity.lat);
    if (!a.visible || !b.visible || a.z < 0.02 || b.z < 0.02) continue;

    const mid = {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2 - radius() * 0.16
    };

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(mid.x, mid.y, b.x, b.y);
    ctx.strokeStyle = `rgba(125,223,255,${0.08 + (a.z + b.z) * 0.06})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    const t = (time * 0.33 + i * 0.09) % 1;
    const dot = quadPoint(a, mid, b, t);
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 2.4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(125,223,255,0.80)";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(125,223,255,0.80)";
    ctx.fill();
  }

  ctx.restore();
}

function quadPoint(a, c, b, t) {
  return {
    x: (1-t)*(1-t)*a.x + 2*(1-t)*t*c.x + t*t*b.x,
    y: (1-t)*(1-t)*a.y + 2*(1-t)*t*c.y + t*t*b.y
  };
}

function updateLocationList(visible) {
  visibleText.textContent = visible.length;
  const rows = visible
    .sort((a, b) => b.z - a.z)
    .slice(0, 10)
    .map(item => `
      <div class="location-row">
        <strong>${item.city}</strong>
        <span>${item.country}</span>
      </div>
    `).join("");

  locationList.innerHTML = rows;
}

function openInfo(type, data) {
  if (type === "country") {
    infoType.textContent = "COUNTRY";
    infoTitle.textContent = data.name;
    infoDescription.textContent = data.info;
    infoGrid.innerHTML = `
      <div><span>Capital</span><strong>${data.capital}</strong></div>
      <div><span>Region</span><strong>${data.region}</strong></div>
      <div><span>Population</span><strong>${data.population}</strong></div>
      <div><span>Layer</span><strong>Country</strong></div>
    `;
  }

  if (type === "city") {
    infoType.textContent = "CITY";
    infoTitle.textContent = data.city;
    infoDescription.textContent = data.info;
    infoGrid.innerHTML = `
      <div><span>Country</span><strong>${data.country}</strong></div>
      <div><span>Population</span><strong>${data.population}</strong></div>
      <div><span>Latitude</span><strong>${data.lat.toFixed(2)}</strong></div>
      <div><span>Longitude</span><strong>${data.lon.toFixed(2)}</strong></div>
    `;
  }
}

function handleClick(x, y) {
  let nearest = null;
  let best = Infinity;

  for (const item of clickableItems) {
    const d = Math.hypot(x - item.x, y - item.y);
    if (d < item.r && d < best) {
      best = d;
      nearest = item;
    }
  }

  if (nearest) {
    openInfo(nearest.type, nearest.data);
  }
}

function drawVignette() {
  const g = ctx.createRadialGradient(width/2, height/2, Math.min(width,height)*0.12, width/2, height/2, Math.max(width,height)*0.78);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(0.72, "rgba(0,0,0,0.20)");
  g.addColorStop(1, "rgba(0,0,0,0.68)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

function animate() {
  time += 0.016;

  if (!dragging) {
    targetRotation.lon += 0.028 / Math.max(1, zoom * 0.3);
  }

  rotation.lon += (targetRotation.lon - rotation.lon) * 0.08;
  rotation.lat += (targetRotation.lat - rotation.lat) * 0.08;
  zoom += (targetZoom - zoom) * 0.08;

  targetZoom = Math.max(0.75, Math.min(4.2, targetZoom));
  zoom = Math.max(0.75, Math.min(4.2, zoom));

  clickableItems.length = 0;

  drawSpace();
  drawEarthOcean();
  drawGrid();
  drawLand();
  drawClouds();
  drawNightShadow();
  drawConnections();
  drawCountries();
  drawCities();
  drawAtmosphere();
  drawVignette();

  zoomText.textContent = `${zoom.toFixed(2)}x`;
  modeText.textContent = zoom > 2.05 ? "City" : zoom > 1.32 ? "Country" : "Earth";

  requestAnimationFrame(animate);
}

canvas.addEventListener("mousedown", e => {
  dragging = true;
  dragStart = {
    x: e.clientX,
    y: e.clientY,
    lon: targetRotation.lon,
    lat: targetRotation.lat
  };
});

window.addEventListener("mouseup", () => dragging = false);

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;

  if (!dragging) return;

  const dx = e.clientX - dragStart.x;
  const dy = e.clientY - dragStart.y;

  targetRotation.lon = dragStart.lon + dx * 0.30;
  targetRotation.lat = Math.max(-68, Math.min(68, dragStart.lat - dy * 0.18));
});

canvas.addEventListener("click", e => {
  handleClick(e.clientX, e.clientY);
});

canvas.addEventListener("wheel", e => {
  e.preventDefault();
  targetZoom += e.deltaY > 0 ? -0.22 : 0.22;
}, { passive: false });

canvas.addEventListener("touchstart", e => {
  const t = e.touches[0];
  dragging = true;
  dragStart = {
    x: t.clientX,
    y: t.clientY,
    lon: targetRotation.lon,
    lat: targetRotation.lat
  };
}, { passive: true });

canvas.addEventListener("touchmove", e => {
  const t = e.touches[0];
  if (!dragging) return;
  const dx = t.clientX - dragStart.x;
  const dy = t.clientY - dragStart.y;
  targetRotation.lon = dragStart.lon + dx * 0.30;
  targetRotation.lat = Math.max(-68, Math.min(68, dragStart.lat - dy * 0.18));
}, { passive: true });

window.addEventListener("touchend", () => dragging = false);

zoomIn.addEventListener("click", () => targetZoom += 0.35);
zoomOut.addEventListener("click", () => targetZoom -= 0.35);

resetView.addEventListener("click", () => {
  targetRotation.lon = -20;
  targetRotation.lat = -5;
  targetZoom = 1.05;
});

closeInfo.addEventListener("click", () => {
  infoType.textContent = "SELECTED";
  infoTitle.textContent = "Earth";
  infoDescription.textContent = "Click on a country label or city marker to display information.";
  infoGrid.innerHTML = `
    <div><span>Type</span><strong>Planet</strong></div>
    <div><span>Surface</span><strong>Ocean / Land</strong></div>
    <div><span>Interaction</span><strong>Drag + Zoom</strong></div>
    <div><span>Layer</span><strong>Countries / Cities</strong></div>
  `;
});

window.addEventListener("resize", resize);

resize();
animate();

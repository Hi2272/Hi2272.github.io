"use strict";

const $ = (id) => document.getElementById(id);
let lastBlob = null;

$("convertBtn").addEventListener("click", async () => {
  $("status").className = "";
  $("downloadBtn").disabled = true;
  $("stlOutput").value = "";
  lastBlob = null;

  try {
    const gerber = $("gerberInput").value;
    const drill = $("drillInput").value;

    if (!gerber.trim()) throw new Error("Bitte zuerst die Gerber-Datei einfügen.");
    if (!drill.trim()) throw new Error("Bitte auch die Bohrdatei einfügen.");

    const result = await convertGerberToStl(
      gerber,
      drill,
      true,
      (current, total) => {
        const message = `Zeile ${current} von ${total} verarbeitet.`;
        $("status").textContent = message;
        $("stlOutput").value = message;
      }
    );

    lastBlob = result.blob;
    $("downloadBtn").disabled = false;

    const message =
      `Fertig: ${result.triangles.toLocaleString("de-DE")} Dreiecke. ` +
      `Binäre STL-Datei kann heruntergeladen werden.`;

    $("status").textContent = message;
    $("stlOutput").value = message;
  } catch (error) {
    $("status").className = "error";
    $("status").textContent = error.message || String(error);
    $("stlOutput").value = error.message || String(error);
  }
});

$("downloadBtn").addEventListener("click", () => {
  if (!lastBlob) return;

  const url = URL.createObjectURL(lastBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "coppertop_template.stl";
  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

async function convertGerberToStl(gerberText, drillText, includeTraces, onProgress) {

  const resolution = 0.1; // mm pro Rasterzelle
  const height = 1.0;     // mm
  const margin = 1.5;     // mm Rand um die Koordinaten

  const apertures = parseApertures(gerberText);
  const shapes = parseGerber(gerberText, apertures, includeTraces);
  const holes = parseDrill(drillText);

  if (!shapes.length) {
    throw new Error("Keine unterstützten Pads oder G36-Flächen gefunden.");
  }

  const allPoints = [];

for (const shape of shapes) {
  if (shape.type === "polygon") {
    allPoints.push(...shape.points);
  } else if (shape.type === "trace") {
    allPoints.push(shape.a, shape.b);
  } else if (shape.type === "flash") {
    allPoints.push(shape.a);
  }
}

for (const hole of holes) {
  allPoints.push(hole.center);
}

if (!allPoints.length) {
  throw new Error("Keine Koordinaten gefunden.");
}

  const minX = Math.min(...allPoints.map(p => p[0])) - margin;
  const maxX = Math.max(...allPoints.map(p => p[0])) + margin;
  const minY = Math.min(...allPoints.map(p => p[1])) - margin;
  const maxY = Math.max(...allPoints.map(p => p[1])) + margin;

  const width = Math.ceil((maxX - minX) / resolution);
  const heightCells = Math.ceil((maxY - minY) / resolution);

  if (width * heightCells > 1_500_000) {
    throw new Error("Das Raster wäre zu groß. Erhöhe im Script die Rasterweite.");
  }

  const mask = new Uint8Array(width * heightCells);
  mask.fill(1);


  function cellCenter(ix, iy) {
    return [
      minX + (ix + 0.5) * resolution,
      minY + (iy + 0.5) * resolution
    ];
  }

  function paintCircle(center, radius, value = 1) {
    const x0 = Math.max(0, Math.floor((center[0] - radius - minX) / resolution));
    const x1 = Math.min(width - 1, Math.ceil((center[0] + radius - minX) / resolution));
    const y0 = Math.max(0, Math.floor((center[1] - radius - minY) / resolution));
    const y1 = Math.min(heightCells - 1, Math.ceil((center[1] + radius - minY) / resolution));
    const r2 = radius * radius;

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const [cx, cy] = cellCenter(x, y);
        const dx = cx - center[0];
        const dy = cy - center[1];
        if (dx * dx + dy * dy <= r2) mask[y * width + x] = value;

      }
    }
  }

  function paintRectangle(center, w, h) {
    const x0 = Math.max(0, Math.floor((center[0] - w / 2 - minX) / resolution));
    const x1 = Math.min(width - 1, Math.ceil((center[0] + w / 2 - minX) / resolution));
    const y0 = Math.max(0, Math.floor((center[1] - h / 2 - minY) / resolution));
    const y1 = Math.min(heightCells - 1, Math.ceil((center[1] + h / 2 - minY) / resolution));

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const [cx, cy] = cellCenter(x, y);
        if (Math.abs(cx - center[0]) <= w / 2 &&
            Math.abs(cy - center[1]) <= h / 2) {
          mask[y * width + x] = 1;
        }
      }
    }
  }

  function paintPolygon(points) {
    if (points.length < 3) return;

    const x0 = Math.max(0, Math.floor((Math.min(...points.map(p => p[0])) - minX) / resolution));
    const x1 = Math.min(width - 1, Math.ceil((Math.max(...points.map(p => p[0])) - minX) / resolution));
    const y0 = Math.max(0, Math.floor((Math.min(...points.map(p => p[1])) - minY) / resolution));
    const y1 = Math.min(heightCells - 1, Math.ceil((Math.max(...points.map(p => p[1])) - minY) / resolution));

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const [px, py] = cellCenter(x, y);
        if (pointInPolygon(px, py, points)) mask[y * width + x] = 1;
      }
    }
  }

  for (const shape of shapes) {
  if (shape.type !== "trace") continue;

  const distance = Math.hypot(
    shape.b[0] - shape.a[0],
    shape.b[1] - shape.a[1]
  );

  const steps = Math.max(1, Math.ceil(distance / (resolution / 2)));
 const traceWidth = 1.0; // gewünschte Freistellungsbreite in mm
const radius = traceWidth / 2;


  for (let i = 0; i <= steps; i++) {
    const t = i / steps;

    const point = [
      shape.a[0] + (shape.b[0] - shape.a[0]) * t,
      shape.a[1] + (shape.b[1] - shape.a[1]) * t
    ];

    paintCircle(point, radius, 0);
  }
}

  

  // Bohrungen werden aus dem Material ausgespart.
  for (const hole of holes) {
    const radius = Math.max(1.0, hole.diameter / 2); // mindestens 1 mm Radius

    const x0 = Math.max(0, Math.floor((hole.center[0] - radius - minX) / resolution));
    const x1 = Math.min(width - 1, Math.ceil((hole.center[0] + radius - minX) / resolution));
    const y0 = Math.max(0, Math.floor((hole.center[1] - radius - minY) / resolution));
    const y1 = Math.min(heightCells - 1, Math.ceil((hole.center[1] + radius - minY) / resolution));

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const [cx, cy] = cellCenter(x, y);
        const dx = cx - hole.center[0];
        const dy = cy - hole.center[1];
        if (dx * dx + dy * dy <= radius * radius) mask[y * width + x] = 0;
      }
    }
  }

  const mesh = await createVoxelStl(
  mask,
  width,
  heightCells,
  minX,
  minY,
  resolution,
  height,
  onProgress
);

return {
  blob: mesh.blob,
  triangles: mesh.triangles,
  width,
  height: heightCells,
  resolution
};

}

function parseApertures(text) {
  const apertures = new Map();
  const regex = /%ADD(\d+)([A-Z]),?([\d.]+)(?:X([\d.]+))?[^%]*%/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const id = Number(match[1]);
    const shape = match[2];
    const first = Number(match[3]) * 25.4;
    const second = match[4] ? Number(match[4]) * 25.4 : first;

    if (shape === "C") apertures.set(id, { shape: "C", w: first, h: first });
    if (shape === "R") apertures.set(id, { shape: "R", w: first, h: second });
  }

  return apertures;
}

function parseGerber(text, apertures, includeTraces) {
  const tokens = text
    .replace(/G04[^\r\n]*/g, "")
    .split("*")
    .map(s => s.trim())
    .filter(Boolean);

  const shapes = [];
  let currentAperture = null;
  let currentPoint = null;
  let inRegion = false;
  let regionPoints = [];

  for (const token of tokens) {
    if (/^G36$/i.test(token)) {
      inRegion = true;
      regionPoints = [];
      continue;
    }
    if (/^G37$/i.test(token)) {
      if (regionPoints.length >= 3) {
        shapes.push({ type: "polygon", points: regionPoints });
      }
      inRegion = false;
      regionPoints = [];
      continue;
    }

    const select = token.match(/(?:^|G54)D0*(\d+)$/i);
    if (select && Number(select[1]) >= 10) {
      currentAperture = Number(select[1]);
      continue;
    }

    const coordinate = token.match(/X([+-]?\d+)Y([+-]?\d+)(?:D0*(\d+))?/i);
    if (!coordinate) continue;

    const point = [
      -Number(coordinate[1]) / 1000 * 25.4,
      Number(coordinate[2]) / 1000 * 25.4
    ];
    const operation = coordinate[3] ? Number(coordinate[3]) : null;

    if (inRegion) {
      regionPoints.push(point);
      currentPoint = point;
      continue;
    }

    if (operation === 2) {
      currentPoint = point;
    } else if (operation === 3) {
      const aperture = apertures.get(currentAperture);
      if (!aperture) {
        throw new Error(`Apertur D${currentAperture} konnte nicht gelesen werden.`);
      }
      shapes.push({ type: "flash", a: point, aperture });
      currentPoint = point;
    } else if (operation === 1 && includeTraces && currentPoint) {
      const aperture = apertures.get(currentAperture);
      if (aperture) {
        shapes.push({ type: "trace", a: currentPoint, b: point, aperture });
      }
      currentPoint = point;
    } else if (operation === 1) {
      currentPoint = point;
    }
  }

  return shapes;
}

function parseDrill(text) {
  const holes = [];
  const tools = new Map();
  let currentTool = null;
  let unitScale = 25.4;

  if (/^\s*METRIC/im.test(text)) unitScale = 1;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim().toUpperCase();
    const tool = line.match(/^T(\d+)C([\d.]+)/);

    if (tool) {
      tools.set(Number(tool[1]), Number(tool[2]) * unitScale);
      continue;
    }

    const selected = line.match(/^T(\d+)$/);
    if (selected) {
      currentTool = Number(selected[1]);
      continue;
    }

    const coord = line.match(/^X([+-]?\d+)Y([+-]?\d+)$/);
    if (coord && currentTool !== null && tools.has(currentTool)) {
      // Die vorliegenden Drill-Koordinaten sind 2:4, anders als die Gerber-Koordinaten.
      const scale = unitScale / 10000;
      holes.push({
        center: [-Number(coord[1]) * scale, Number(coord[2]) * scale],
        diameter: tools.get(currentTool)
      });
    }
  }

  if (!holes.length) throw new Error("In der Bohrdatei wurden keine Bohrungen erkannt.");
  return holes;
}

function pointInPolygon(x, y, points) {
  let inside = false;

  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i][0], yi = points[i][1];
    const xj = points[j][0], yj = points[j][1];
    const intersects =
      ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersects) inside = !inside;
  }

  return inside;
}

async function createVoxelStl(
  mask,
  width,
  heightCells,
  minX,
  minY,
  res,
  zHeight,
  onProgress
) {
  function occupied(x, y) {
    return x >= 0 &&
      x < width &&
      y >= 0 &&
      y < heightCells &&
      mask[y * width + x] !== 0;
  }

  // Zuerst die Anzahl der Dreiecke berechnen, damit der Speicher
  // für die Binär-STL passend reserviert werden kann.
  let triangles = 0;

  for (let y = 0; y < heightCells; y++) {
    for (let x = 0; x < width; x++) {
      if (!occupied(x, y)) continue;

      triangles += 4; // Ober- und Unterseite
      if (!occupied(x - 1, y)) triangles += 2;
      if (!occupied(x + 1, y)) triangles += 2;
      if (!occupied(x, y - 1)) triangles += 2;
      if (!occupied(x, y + 1)) triangles += 2;
    }
  }

  if (triangles === 0) {
    throw new Error("Es wurde keine STL-Geometrie erzeugt.");
  }

  // Binäre STL: 80 Byte Header, 4 Byte Dreieckszahl, 50 Byte je Dreieck.
  const buffer = new ArrayBuffer(84 + triangles * 50);
  const view = new DataView(buffer);

  const header = new TextEncoder().encode("Coppertop template - binary STL");
  new Uint8Array(buffer, 0, header.length).set(header);
  view.setUint32(80, triangles, true);

  let offset = 84;
  let writtenTriangles = 0;

  function writeFacet(a, b, c) {
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];

    let nx = uy * vz - uz * vy;
    let ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;

    const length = Math.hypot(nx, ny, nz) || 1;
    nx /= length;
    ny /= length;
    nz /= length;

    for (const value of [nx, ny, nz, ...a, ...b, ...c]) {
      view.setFloat32(offset, value, true);
      offset += 4;
    }

    view.setUint16(offset, 0, true);
    offset += 2;
    writtenTriangles++;
  }

  function writeQuad(points) {
    writeFacet(points[0], points[1], points[2]);
    writeFacet(points[0], points[2], points[3]);
  }

  const updateEvery = Math.max(1, Math.ceil(heightCells / 100));

  for (let y = 0; y < heightCells; y++) {
    for (let x = 0; x < width; x++) {
      if (!occupied(x, y)) continue;

      const x0 = minX + x * res;
      const x1 = x0 + res;
      const y0 = minY + y * res;
      const y1 = y0 + res;

      writeQuad([
        [x0, y0, zHeight],
        [x1, y0, zHeight],
        [x1, y1, zHeight],
        [x0, y1, zHeight]
      ]);

      writeQuad([
        [x0, y1, 0],
        [x1, y1, 0],
        [x1, y0, 0],
        [x0, y0, 0]
      ]);

      if (!occupied(x - 1, y)) {
        writeQuad([[x0,y0,0],[x0,y0,zHeight],[x0,y1,zHeight],[x0,y1,0]]);
      }

      if (!occupied(x + 1, y)) {
        writeQuad([[x1,y0,0],[x1,y1,0],[x1,y1,zHeight],[x1,y0,zHeight]]);
      }

      if (!occupied(x, y - 1)) {
        writeQuad([[x0,y0,0],[x1,y0,0],[x1,y0,zHeight],[x0,y0,zHeight]]);
      }

      if (!occupied(x, y + 1)) {
        writeQuad([[x0,y1,0],[x0,y1,zHeight],[x1,y1,zHeight],[x1,y1,0]]);
      }
    }

    if ((y + 1) % updateEvery === 0 || y === heightCells - 1) {
      onProgress?.(y + 1, heightCells);
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }

  return {
    blob: new Blob([buffer], { type: "model/stl" }),
    triangles: writtenTriangles
  };
}


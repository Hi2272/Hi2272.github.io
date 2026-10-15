"use strict";

const gerberInput = document.querySelector("#gerberInput");
const gcodeOutput = document.querySelector("#gcodeOutput");
const convertButton = document.querySelector("#convertButton");
const saveButton = document.querySelector("#saveButton");
const statusEl = document.querySelector("#status");
const canvas = document.querySelector("#preview");

const GAP_EVERY_MM = 10;
const GAP_LENGTH_MM = 2;
let generatedGcode = "";
let lastPaths = [];
let lastRuns = [];

convertButton.addEventListener("click", convertGerber);
saveButton.addEventListener("click", saveGcode);
window.addEventListener("resize", () => drawPreview(lastPaths, lastRuns));

function convertGerber() {
  try {
    const source = gerberInput.value.trim();
    if (!source) throw new Error("Bitte zuerst Gerber-Code einfügen.");

    const paths = parseGerber(source);
    if (!paths.length) {
      throw new Error("Keine gezeichnete Kontur gefunden. Prüfe den Gerber-Code.");
    }

    const depth = readNumber("#depth", "Frästiefe");
    const safeZ = readNumber("#safeZ", "Sicherheits-Z");
    const feed = readNumber("#feed", "Fräsvorschub");
    const plungeFeed = readNumber("#plungeFeed", "Eintauchvorschub");
    const toolDiameter = readNumber("#toolDiameter", "Werkzeugdurchmesser");

    if (depth >= 0) throw new Error("Die Frästiefe muss negativ sein.");
    if (safeZ <= 0 || feed <= 0 || plungeFeed <= 0) {
      throw new Error("Sicherheits-Z und Vorschübe müssen größer als 0 sein.");
    }
    if (toolDiameter <= 0) {
      throw new Error("Der Werkzeugdurchmesser muss größer als 0 sein.");
    }

    const toolRadius = toolDiameter / 2;
    const offsetPaths = paths.map(path => offsetClosedPath(path, toolRadius));
    const runs = offsetPaths.flatMap(path =>
      splitIntoCutRuns(path, GAP_EVERY_MM, GAP_LENGTH_MM)
    );

    if (!runs.length) throw new Error("Es konnte kein Fräsweg erzeugt werden.");

    generatedGcode = makeGcode(runs, { depth, safeZ, feed, plungeFeed });
    lastPaths = paths;
    lastRuns = runs;
    gcodeOutput.value = generatedGcode;
    saveButton.disabled = false;
    drawPreview(paths, runs);

    const totalLength = paths.reduce((sum, path) => sum + pathLength(path), 0);
    statusEl.textContent =
      `Erfolgreich: ${paths.length} Kontur(en), ${runs.length} Fräsabschnitte. ` +
      `Werkzeugmitte außen um ${toolRadius.toFixed(2)} mm versetzt. ` +
      `Konturlänge ca. ${totalLength.toFixed(1)} mm.`;
  } catch (error) {
    generatedGcode = "";
    saveButton.disabled = true;
    statusEl.textContent = error.message;
  }
}

function offsetClosedPath(points, radius) {
  const clean = [];

  for (const point of points) {
    if (!clean.length || distance(clean[clean.length - 1], point) > 0.000001) {
      clean.push({ x: point.x, y: point.y });
    }
  }

  if (clean.length > 2 && distance(clean[0], clean[clean.length - 1]) < 0.01) {
    clean.pop();
  }

  if (clean.length < 3) {
    throw new Error("Für den Außenversatz wird eine geschlossene Kontur benötigt.");
  }

  let area = 0;
  for (let i = 0; i < clean.length; i++) {
    const a = clean[i];
    const b = clean[(i + 1) % clean.length];
    area += a.x * b.y - b.x * a.y;
  }

  if (Math.abs(area) < 0.000001) {
    throw new Error("Die Kontur ist ungültig oder hat keine Fläche.");
  }

  // Vorzeichen der Fläche: legt fest, auf welcher Seite außen liegt.
  const orientation = area > 0 ? 1 : -1;
  const offsetPoints = [];

  for (let i = 0; i < clean.length; i++) {
    const previous = clean[(i - 1 + clean.length) % clean.length];
    const current = clean[i];
    const next = clean[(i + 1) % clean.length];

    const len1 = distance(previous, current);
    const len2 = distance(current, next);
    const u1 = { x: (current.x - previous.x) / len1, y: (current.y - previous.y) / len1 };
    const u2 = { x: (next.x - current.x) / len2, y: (next.y - current.y) / len2 };

    const n1 = orientation > 0
      ? { x: u1.y, y: -u1.x }
      : { x: -u1.y, y: u1.x };
    const n2 = orientation > 0
      ? { x: u2.y, y: -u2.x }
      : { x: -u2.y, y: u2.x };

    const denominator = 1 + n1.x * n2.x + n1.y * n2.y;
    if (denominator < 0.000001) {
      throw new Error("Außenversatz an einer Kontur-Ecke nicht möglich.");
    }

    const dx = radius * (n1.x + n2.x) / denominator;
    const dy = radius * (n1.y + n2.y) / denominator;
    const miterLength = Math.hypot(dx, dy);

    if (miterLength > radius * 20) {
      throw new Error("Zu spitze Ecke für einen sicheren Werkzeugversatz.");
    }

    offsetPoints.push({ x: current.x + dx, y: current.y + dy });
  }

  // Kontur schließen, damit auch die letzte Kante gefräst werden kann.
  offsetPoints.push({ ...offsetPoints[0] });
  return offsetPoints;
}


function readNumber(selector, label) {
  const value = Number(document.querySelector(selector).value);
  if (!Number.isFinite(value)) throw new Error(`${label}: ungültiger Wert.`);
  return value;
}

function parseGerber(source) {
  const inchMode = /\bG70\b/i.test(source) || !/\bG71\b/i.test(source);
  const unitScale = inchMode ? 25.4 : 1;

  const formatMatch = source.match(/%FSLAX(\d)(\d)Y(\d)(\d)\*%/i);
  const xDecimals = formatMatch ? Number(formatMatch[2]) : 3;
  const yDecimals = formatMatch ? Number(formatMatch[4]) : 3;

  let x = null;
  let y = null;
  let operation = 2;
  let activePath = null;
  const paths = [];

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.replace(/G04.*$/i, "").trim();
    if (!line || line.startsWith("%")) continue;

    const tokens = line.match(/G\d+|D\d+|[XY][+-]?\d+(?:\.\d+)?/gi) || [];
    let nextX = x;
    let nextY = y;
    let hasCoordinate = false;
    let resetPath = false;

    for (const token of tokens) {
      const upper = token.toUpperCase();

      if (upper === "D01" || upper === "D02" || upper === "D03") {
        operation = Number(upper.slice(1));
        if (operation !== 1) resetPath = true;
      } else if (upper[0] === "X") {
        nextX = parseGerberCoordinate(upper.slice(1), xDecimals) * unitScale;
        hasCoordinate = true;
      } else if (upper[0] === "Y") {
        nextY = parseGerberCoordinate(upper.slice(1), yDecimals) * unitScale;
        hasCoordinate = true;
      }
    }

    if (hasCoordinate) {
      if (operation === 2 || operation === 3) {
        x = nextX;
        y = nextY;
        activePath = null;
      } else if (operation === 1 && x !== null && y !== null) {
        const start = { x, y };
        const end = { x: nextX, y: nextY };

        if (!activePath) {
          activePath = [start];
          paths.push(activePath);
        }
        activePath.push(end);
        x = nextX;
        y = nextY;
      } else {
        x = nextX;
        y = nextY;
      }
    } else if (resetPath) {
      activePath = null;
    }
  }

  return paths.filter(path => path.length >= 2);
}

function parseGerberCoordinate(text, decimals) {
  if (text.includes(".")) return Number(text);

  const sign = text.startsWith("-") ? -1 : 1;
  const digits = text.replace(/^[+-]/, "");
  return sign * Number(digits || "0") / (10 ** decimals);
}

function pathLength(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += distance(points[i - 1], points[i]);
  }
  return total;
}

function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function splitIntoCutRuns(points, pitch, gap) {
  const total = pathLength(points);
  const cutLength = pitch - gap;
  const runs = [];

  for (let start = 0; start < total; start += pitch) {
    const end = Math.min(start + cutLength, total);
    if (end - start > 0.001) {
      runs.push(pointsBetween(points, start, end));
    }
  }
  return runs;
}

function pointsBetween(points, from, to) {
  const result = [pointAtDistance(points, from)];
  let accumulated = 0;

  for (let i = 1; i < points.length; i++) {
    const segmentLength = distance(points[i - 1], points[i]);
    accumulated += segmentLength;
    if (accumulated > from + 0.001 && accumulated < to - 0.001) {
      result.push(points[i]);
    }
  }

  result.push(pointAtDistance(points, to));
  return result;
}

function pointAtDistance(points, target) {
  let accumulated = 0;

  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const length = distance(a, b);

    if (accumulated + length >= target) {
      const ratio = length === 0 ? 0 : (target - accumulated) / length;
      return {
        x: a.x + (b.x - a.x) * ratio,
        y: a.y + (b.y - a.y) * ratio
      };
    }
    accumulated += length;
  }

  return { ...points[points.length - 1] };
}

function makeGcode(runs, settings) {
  const allPoints = runs.flat();
  const minX = Math.min(...allPoints.map(point => point.x));
  const minY = Math.min(...allPoints.map(point => point.y));

  const lines = [
    "G21",
    "G90",
    "G17",
    "G94",
    "M3 S10000",
    `G0 Z${format(settings.safeZ)}`
  ];

  for (const run of runs) {
    const first = run[0];
    lines.push(
      `G0 X${format(first.x - minX)} Y${format(first.y - minY)}`,
      `G1 Z${format(settings.depth)} F${format(settings.plungeFeed)}`
    );

    for (const point of run.slice(1)) {
      lines.push(
        `G1 X${format(point.x - minX)} Y${format(point.y - minY)} ` +
        `F${format(settings.feed)}`
      );
    }
    lines.push(`G0 Z${format(settings.safeZ)}`);
  }

   lines.push(
    `G0 Z${format(settings.safeZ)}`,
    "M5",
    "G0 X0 Y0",
    "M30"
  );

  return lines.join("\n");
}

function format(value) {
  return Number(value).toFixed(3);
}

function saveGcode() {
  if (!generatedGcode) return;

  const blob = new Blob([generatedGcode], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "gerber-contour.gcode";
  link.click();
  URL.revokeObjectURL(url);
}

function drawPreview(paths, runs) {
  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, rect.width, rect.height);

  const allPoints = paths.flat();
  if (!allPoints.length) return;

  const minX = Math.min(...allPoints.map(p => p.x));
  const maxX = Math.max(...allPoints.map(p => p.x));
  const minY = Math.min(...allPoints.map(p => p.y));
  const maxY = Math.max(...allPoints.map(p => p.y));
  const width = Math.max(maxX - minX, 0.1);
  const height = Math.max(maxY - minY, 0.1);
  const margin = 28;
  const scale = Math.min(
    (rect.width - 2 * margin) / width,
    (rect.height - 2 * margin) / height
  );

  const project = point => ({
    x: margin + (point.x - minX) * scale,
    y: rect.height - margin - (point.y - minY) * scale
  });

  context.lineWidth = 2;
  context.strokeStyle = "#f59e0b";
  context.setLineDash([5, 4]);
  for (const path of paths) drawPath(context, path, project);
  context.setLineDash([]);

  context.lineWidth = 3;
  context.strokeStyle = "#2563eb";
  for (const run of runs) drawPath(context, run, project);

  context.fillStyle = "#475569";
  context.font = "12px system-ui, sans-serif";
  context.fillText(
    `${width.toFixed(1)} × ${height.toFixed(1)} mm`,
    10,
    18
  );
}

function drawPath(context, points, project) {
  if (!points.length) return;

  context.beginPath();
  const first = project(points[0]);
  context.moveTo(first.x, first.y);

  for (const point of points.slice(1)) {
    const projected = project(point);
    context.lineTo(projected.x, projected.y);
  }
  context.stroke();
}

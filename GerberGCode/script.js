"use strict";

const $ = (id) => document.getElementById(id);
const state = { holes: [], paths: [], cutPaths: [], outputs: [], baseName: "platine" };
const palette = ["#2459d3", "#169873", "#9b59b6", "#d28b13", "#ce4c67", "#267f91"];

$("cutterDiameter").addEventListener("change", convertTextareas);
$("convertButton").addEventListener("click", convertTextareas);
$("downloadAllButton").addEventListener("click", downloadAll);
["safeZ", "drillDepth", "millDepth", "feedRate", "spindleSpeed"].forEach(id => {
    $(id).addEventListener("change", regenerate);
});
window.addEventListener("resize", drawCanvas);
drawCanvas();


function processFiles(files) {
    state.outputs = [];
    state.holes = [];
    state.paths = [];
    state.cutPaths = [];
    $("downloadAllButton").disabled = true;
    $("fileList").innerHTML = "";


    state.baseName = cleanName(contourEntry.name.replace(/\.[^.]+$/, "").replace(/_?contour$/i, "")) || "platine";
    Promise.all([drillEntry.file.text(), contourEntry.file.text()])
        .then(([drillText, contourText]) => {
            $("drillText").value = drillText;
            $("contourText").value = contourText;
            $("sourceFiles").textContent =
                `Bohrdatei: ${drillEntry.path} · Kontur: ${contourEntry.path}`;
            convertTextareas();
        })
        .catch(error => {
            $("status").textContent = `Fehler beim Einlesen: ${error.message}`;
            drawCanvas();
        });
}

function offsetClosedPath(path, offset) {
    if (offset <= 0 || path.length < 4) return path;

    const first = path[0];
    const last = path[path.length - 1];
    if (distance(first, last) > 1e-6) return path;

    const vertices = path.slice(0, -1);
    if (vertices.length < 3) return path;

    let area = 0;
    for (let i = 0; i < vertices.length; i++) {
        const a = vertices[i];
        const b = vertices[(i + 1) % vertices.length];
        area += a.x * b.y - b.x * a.y;
    }

    if (Math.abs(area) < 1e-9) return path;
    const direction = area > 0 ? 1 : -1;

    const normal = (a, b) => {
        const length = distance(a, b);
        if (length < 1e-9) return null;
        const dx = (b.x - a.x) / length;
        const dy = (b.y - a.y) / length;
        return direction > 0
            ? { x: dy, y: -dx }
            : { x: -dy, y: dx };
    };

    const result = vertices.map((point, i) => {
        const prev = vertices[(i - 1 + vertices.length) % vertices.length];
        const next = vertices[(i + 1) % vertices.length];
        const n1 = normal(prev, point);
        const n2 = normal(point, next);
        if (!n1 || !n2) return { ...point };

        const denominator = 1 + n1.x * n2.x + n1.y * n2.y;
        if (Math.abs(denominator) < 1e-6) return { ...point };

        return {
            x: point.x + offset * (n1.x + n2.x) / denominator,
            y: point.y + offset * (n1.y + n2.y) / denominator
        };
    });

    result.push({ ...result[0] });
    return result;
}



function convertTextareas() {
    const parsedHoles = parseDrill($("drillText").value);
    const parsedPaths = parseGerber($("contourText").value);

    const contourPoints = parsedPaths.flat();
    const minX = Math.min(...contourPoints.map(point => point.x));
    const maxX = Math.max(...contourPoints.map(point => point.x));
    const minY = Math.min(...contourPoints.map(point => point.y));
    const boardWidth = maxX - minX;

    const maxY = Math.max(...contourPoints.map(point => point.y));
    const boardHeight = maxY - minY;

    state.holes = parsedHoles.map(hole => ({
        ...hole,
        x: hole.x - minX,
        y: boardHeight - (hole.y - minY)
    }));

    // Kontur auf denselben Ursprung normieren.
    const normalizedPaths = parsedPaths.map(path =>
        path.map(point => ({
            x: point.x - minX,
            y: point.y - minY
        }))
    );

    // Erst nach der Normierung nach außen versetzen.
    const cutterRadius = Math.max(0, numberValue("cutterDiameter", 3)) / 2;
    state.paths = normalizedPaths.map(path =>
        offsetClosedPath(path, cutterRadius)
    );
    state.cutPaths = state.paths.flatMap(path =>
        splitForTabs(path, 20, 2)
    );

    if (!state.holes.length || !state.paths.length) {
        $("status").textContent =
            "Bitte gültige Bohrdaten und Konturdaten in beide Textfelder einfügen.";
        state.outputs = [];
        $("downloadAllButton").disabled = true;
        $("fileList").innerHTML = "";
        drawCanvas();
        return;
    }

    regenerate();
    $("status").textContent =
        `${state.holes.length} Bohrungen und ${state.paths.length} Konturpfad/-pfade konvertiert.`;
    drawCanvas();
}


function parseDrill(text) {
    const lines = text.split(/\r?\n/);
    let units = "INCH";
    let currentTool = null;
    let decimals = 4;
    const tools = new Map();
    const hits = [];

    for (const raw of lines) {
        const line = raw.trim().toUpperCase();
        const fmt = line.match(/FILE_FORMAT\s*=\s*\d\s*:\s*(\d)/);
        if (fmt) decimals = Number(fmt[1]);
        if (line.includes("METRIC") || line === "METRIC") units = "MM";
        if (line.includes("INCH")) units = "INCH";
        const toolDef = line.match(/^T(\d+)C([+-]?\d*\.?\d+)/);
        if (toolDef) {
            const diameter = Number(toolDef[2]) * (units === "INCH" ? 25.4 : 1);
            tools.set(toolDef[1], diameter);
            continue;
        }
        const selected = line.match(/^T(\d+)\s*$/);
        if (selected) {
            currentTool = selected[1];
            continue;
        }
        const coord = line.match(/(?:^|[^A-Z])X([+-]?\d*\.?\d+).*?Y([+-]?\d*\.?\d+)/);
        if (!coord || !currentTool) continue;
        const x = parseExcellonCoord(coord[1], decimals);
        const y = parseExcellonCoord(coord[2], decimals);
        hits.push({
            x: convertUnits(x, units), y: convertUnits(y, units), tool: currentTool,
            diameter: tools.get(currentTool) || 0.8
        });
    }
    return hits;
}

function parseExcellonCoord(value, decimals) {
    if (value.includes(".")) return Number(value);
    const sign = value.startsWith("-") ? -1 : 1;
    const digits = value.replace(/[+-]/g, "");
    return sign * (Number(digits || "0") / (10 ** decimals));
}

function parseGerber(text) {
    const formatMatch = text.match(/%FS[LT]A?X(\d)(\d)Y(\d)(\d)\*%/i);
    const decimals = formatMatch ? Number(formatMatch[2]) : 3;
    const unit = /%MOMM\*%/i.test(text) ? "MM" : "INCH";
    const scale = unit === "INCH" ? 25.4 : 1;
    const paths = [];
    let current = null;
    let activePath = null;
    let operation = null;

    for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim().toUpperCase();
        const opMatch = line.match(/D0([123])/);
        if (opMatch) operation = Number(opMatch[1]);
        const xMatch = line.match(/X([+-]?\d*\.?\d+)/);
        const yMatch = line.match(/Y([+-]?\d*\.?\d+)/);
        const hasXY = Boolean(xMatch || yMatch);
        if (!hasXY) continue;

        const x = xMatch ? gerberCoord(xMatch[1], decimals) : current?.x;
        const y = yMatch ? gerberCoord(yMatch[1], decimals) : current?.y;
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
        const point = { x: x * scale, y: y * scale };

        if (operation === 2) {
            current = point;
            activePath = [point];
            continue;
        }
        if (operation === 1 && current) {
            if (!activePath) activePath = [current];
            if (distance(activePath[activePath.length - 1], point) > 1e-7) activePath.push(point);
            current = point;
        }
    }

    if (activePath && activePath.length > 1) paths.push(activePath);
    return paths.filter(path => path.length > 1);
}

function gerberCoord(value, decimals) {
    if (value.includes(".")) return Number(value);
    const sign = value.startsWith("-") ? -1 : 1;
    const digits = value.replace(/[+-]/g, "");
    return sign * Number(digits || "0") / (10 ** decimals);
}

function splitForTabs(path, spacingMm, gapMm) {
    const lengths = [0];
    for (let i = 1; i < path.length; i++) {
        lengths.push(lengths[i - 1] + distance(path[i - 1], path[i]));
    }
    const total = lengths[lengths.length - 1];
    if (total <= gapMm) return [path];

    const gaps = [];
    for (let center = spacingMm; center < total; center += spacingMm) {
        gaps.push([Math.max(0, center - gapMm / 2), Math.min(total, center + gapMm / 2)]);
    }
    if (!gaps.length) return [path];

    const ranges = [];
    let start = 0;
    for (const [gapStart, gapEnd] of gaps) {
        if (gapStart - start > 0.05) ranges.push([start, gapStart]);
        start = gapEnd;
    }
    if (total - start > 0.05) ranges.push([start, total]);

    return ranges.map(([from, to]) => pointsBetween(path, lengths, from, to))
        .filter(fragment => fragment.length > 1);
}

function pointsBetween(path, lengths, from, to) {
    const result = [pointAt(path, lengths, from)];
    for (let i = 1; i < path.length - 1; i++) {
        if (lengths[i] > from && lengths[i] < to) result.push(path[i]);
    }
    result.push(pointAt(path, lengths, to));
    return result;
}

function pointAt(path, lengths, target) {
    for (let i = 1; i < lengths.length; i++) {
        if (target <= lengths[i]) {
            const segmentLength = lengths[i] - lengths[i - 1];
            const ratio = segmentLength ? (target - lengths[i - 1]) / segmentLength : 0;
            return {
                x: path[i - 1].x + (path[i].x - path[i - 1].x) * ratio,
                y: path[i - 1].y + (path[i].y - path[i - 1].y) * ratio
            };
        }
    }
    return { ...path[path.length - 1] };
}

function optimizeDrillRoute(holes) {
    const remaining = [...holes];
    const route = [];
    let current = { x: 0, y: 0 };

    while (remaining.length > 0) {
        let nearestIndex = 0;
        let nearestDistance = Infinity;

        for (let i = 0; i < remaining.length; i++) {
            const candidate = remaining[i];
            const candidateDistance = distance(current, candidate);

            if (candidateDistance < nearestDistance) {
                nearestDistance = candidateDistance;
                nearestIndex = i;
            }
        }

        const [nextHole] = remaining.splice(nearestIndex, 1);
        route.push(nextHole);
        current = nextHole;
    }

    return route;
}

function regenerate() {
    if (!state.holes.length || !state.cutPaths.length) return;
    const safeZ = numberValue("safeZ", 3);
    const drillDepth = -Math.abs(numberValue("drillDepth", 1.8));
    const millDepth = -Math.abs(numberValue("millDepth", 1.6));
    const feed = numberValue("feedRate", 100);
    const spindle = numberValue("spindleSpeed", 10000);
    const groups = new Map();

    for (const hole of state.holes) {
        if (!groups.has(hole.tool)) groups.set(hole.tool, []);
        groups.get(hole.tool).push(hole);
    }


    const outputs = [];

    const toolIds = [...new Set(state.holes.map(hole => hole.tool))];

    for (const [tool, holes] of groups) {
        const diameter = holes[0].diameter.toFixed(3);
        const lines = header(
            `Bohren, Werkzeug T${tool}, Durchmesser ${diameter} mm`,
            safeZ,
            spindle
        );

        lines.push(`(Anzahl Bohrungen: ${holes.length})`, `F${feed}`);

        for (const hole of optimizeDrillRoute(holes)) {
            lines.push(
                `G0 X${fmt(hole.x)} Y${fmt(hole.y)}`,
                `G1 Z${fmt(drillDepth)} F${fmt(feed)}`,
                `G0 Z${fmt(safeZ)}`
            );
        }

        lines.push("M5", "G0 Z10", "G0 X0 Y0", "M30");

        outputs.push({
            name: `${state.baseName}_bohren_T${cleanName(tool)}.gcode`,
            text: lines.join("\n"),
            color: palette[toolIds.indexOf(tool) % palette.length]
        });
    }


    const millLines = header("Platinenkontur fräsen – 2-mm-Unterbrechung im Abstand 20 mm", safeZ, spindle);
    millLines.push(`F${feed}`);
    for (const fragment of state.cutPaths) {
        if (fragment.length < 2) continue;
        millLines.push(`G0 X${fmt(fragment[0].x)} Y${fmt(fragment[0].y)}`);
        millLines.push(`G1 Z${fmt(millDepth)} F${fmt(feed)}`);
        for (const point of fragment.slice(1)) millLines.push(`G1 X${fmt(point.x)} Y${fmt(point.y)} F${fmt(feed)}`);
        millLines.push(`G0 Z${fmt(safeZ)}`);
    }
    millLines.push("M5", "G0 Z10", "G0 X0 Y0", "M30");
    outputs.push({ name: `${state.baseName}_kontur.gcode`, text: millLines.join("\n") });

    state.outputs = outputs;
    renderOutputs();
    $("downloadAllButton").disabled = false;
    drawCanvas();
}

function header(comment, safeZ, spindle) {
    return [
        `( ${comment} )`,
        "G21 (mm)", "G90 (absolute coordinates)", "G17", "G94",
        `G0 Z${fmt(safeZ)}`,
        ...(spindle > 0 ? [`M3 S${fmt(spindle)}`] : [])
    ];
}

function renderOutputs() {
    const list = $("fileList");
    list.innerHTML = "";
    state.outputs.forEach((output, index) => {
        const item = document.createElement("li");
        const name = document.createElement("span");
        name.textContent = output.name;
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Herunterladen";
        button.addEventListener("click", () => downloadOutput(index));
        item.append(name, button);
        list.append(item);
    });
}

function downloadOutput(index) {
    const output = state.outputs[index];
    if (!output) return;
    const blob = new Blob([output.text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = output.name;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadAll() {
    if (!state.outputs.length) return;

    if (typeof JSZip === "undefined") {
        $("status").textContent = "ZIP-Bibliothek konnte nicht geladen werden. Prüfe die Internetverbindung.";
        return;
    }

    const zip = new JSZip();

    for (const output of state.outputs) {
        zip.file(output.name, output.text);
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${state.baseName}_gcode.zip`;
    anchor.click();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}


function drawCanvas() {
    const canvas = $("boardCanvas");
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, rect.width, rect.height);

    const points = [...state.holes, ...state.paths.flat()];
    if (!points.length) {
        ctx.fillStyle = "#7b8798";
        ctx.font = "14px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("Nach dem Laden erscheinen hier Bohrungen und Konturen.", rect.width / 2, rect.height / 2);
        return;
    }

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));
    const padding = 28;
    const scale = Math.min((rect.width - 2 * padding) / Math.max(maxX - minX, 1),
        (rect.height - 2 * padding) / Math.max(maxY - minY, 1));
    const offsetX = (rect.width - (maxX - minX) * scale) / 2;
    const offsetY = (rect.height - (maxY - minY) * scale) / 2;
    const screen = p => ({
        x: offsetX + (p.x - minX) * scale,
        y: rect.height - (offsetY + (p.y - minY) * scale)
    });
    // Zentimeter-Koordinatensystem mit 1-, 2- oder 5-cm-Schritten.
    const stepMm = chooseGridStep(Math.max(maxX - minX, maxY - minY));
    const gridStartX = Math.ceil(minX / stepMm) * stepMm;
    const gridStartY = Math.ceil(minY / stepMm) * stepMm;

    ctx.save();
    ctx.font = "11px system-ui";
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#e8edf4";
    ctx.fillStyle = "#536176";

    for (let x = gridStartX; x <= maxX + 1e-6; x += stepMm) {
        const top = screen({ x, y: maxY });
        const bottom = screen({ x, y: minY });

        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(bottom.x, bottom.y);
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillText(`${formatCm(x)} cm`, bottom.x, bottom.y + 4);
    }

    for (let y = gridStartY; y <= maxY + 1e-6; y += stepMm) {
        const left = screen({ x: minX, y });
        const right = screen({ x: maxX, y });

        ctx.beginPath();
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.stroke();

        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(`${formatCm(y)} cm`, left.x + 4, left.y);
    }

    ctx.restore();

    // Vollständige Sollkontur als gestrichelte Orientierungslinie.
    ctx.save();
    ctx.strokeStyle = "#9aa6b7";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    for (const path of state.paths) drawPath(ctx, path, screen);
    ctx.restore();

    // Tatsächlich zu fräsende Teilstücke; die Lücken bleiben sichtbar.
    ctx.strokeStyle = "#e45b37";
    ctx.lineWidth = 2;
    for (const path of state.cutPaths) drawPath(ctx, path, screen);

    const toolIds = [...new Set(state.holes.map(hole => hole.tool))];

    ctx.save();

state.holes.forEach(hole => {
  const point = screen(hole);
  const color = palette[toolIds.indexOf(hole.tool) % palette.length];
  const diameter = Number(hole.diameter) || 0;
  const edge = screen({ x: hole.x + diameter / 2, y: hole.y });
  const radius = Math.max(2, Math.abs(edge.x - point.x));

  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
});

    ctx.restore();

    $("legend").innerHTML = toolIds.map((tool, index) => {
        const color = palette[index % palette.length];
        const filename =
            `${state.baseName}_bohren_T${cleanName(tool)}.gcode`;

        return `
    <span class="legend-item">
      <i class="tool-key" style="background-color: ${color}"></i>
      T${tool} 
    </span>
  `;
    }).join("");
}

    function drawPath(ctx, path, screen) {
        if (path.length < 2) return;
        ctx.beginPath();
        const first = screen(path[0]);
        ctx.moveTo(first.x, first.y);
        for (const point of path.slice(1)) {
            const p = screen(point);
            ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
    }

    function distance(a, b) { return Math.hypot(b.x - a.x, b.y - a.y); }
    function convertUnits(value, units) { return value * (units === "INCH" ? 25.4 : 1); }
    function fmt(value) { return Number(value).toFixed(3); }
    function numberValue(id, fallback) {
        const value = Number($(id).value);
        return Number.isFinite(value) ? value : fallback;
    }
    function cleanName(value) {
        return String(value).replace(/[^a-z0-9_-]+/gi, "_").replace(/^_+|_+$/g, "");
    }

    function chooseGridStep(rangeMm) {
        const target = Math.max(rangeMm / 8, 1);
        const magnitude = 10 ** Math.floor(Math.log10(target));
        const normalized = target / magnitude;
        const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
        return factor * magnitude;
    }

    function formatCm(valueMm) {
        return (valueMm / 10).toFixed(2).replace(/\.?0+$/, "");
    }

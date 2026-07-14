
/* -------------------------------------------------



Gerber → G‑Code Konverter + Canvas‑Visualisierung



• Board‑Größe 70 mm × 100 mm (voll sichtbar)



• G‑Code beginnt immer mit „G0 Z20“



• Fahrstrecken (D02) → gestrichelte gelbe Linien



• Zeichen‑Linien (D01) → durchgezogene blaue Linien



• Pads (D03) → kleine rote Kreise



------------------------------------------------- */
const INCH_TO_MM = 25.4;
const BOARD_W = 100;   // mm (X‑Richtung)
const BOARD_H = 70;  // mm (Y‑Richtung)
const gerberTxt   = document.getElementById('gerberTxt');
const gcodeOutput = document.getElementById('gcodeOutput');
const canvas      = document.getElementById('boardCanvas');
const ctx         = canvas.getContext('2d');
/* -------------------------------------------------
Canvas‑Skalierung – sorgt dafür, dass das komplette
Board immer vollständig sichtbar ist (kleiner Rand).
------------------------------------------------- */

function getCanvasMetrics() {
    const margin = 5;                     // px Abstand zum Rand
    // **Breite immer vollständig ausnutzen**
    const usableW = canvas.width - 2 * margin;          // verfügbare Breite
    const scale  = usableW / BOARD_W;                   // einheitlicher Scale
    // Höhe anhand des gleichen Scales berechnen und vertikal zentrieren
    const usableH = BOARD_H * scale;
    const offsetX = margin;                             // links‑Rand
    const offsetY = (canvas.height - usableH) / 2;       // vertikal zentrieren
    return {scale, offsetX, offsetY};
}
/* -------------------------------------------------
UI‑Buttons
------------------------------------------------- */
document.getElementById('convertBtn').addEventListener('click', () => {
const commands = parseGerber(gerberTxt.value);
const gcode    = generateGCode(commands);
gcodeOutput.value = gcode;
drawBoard(commands);
});
document.getElementById('copyBtn').addEventListener('click', () => {
gcodeOutput.select();
document.execCommand('copy');
});
document.getElementById('saveBtn').addEventListener('click', () => {
const blob = new Blob([gcodeOutput.value], {type: 'text/plain'});
const url  = URL.createObjectURL(blob);
const a    = document.createElement('a');
a.href    = url;
a.download = 'output.gcode';
a.click();
URL.revokeObjectURL(url);
});
/* -------------------------------------------------

Gerber‑Parser (unterstützt das gelieferte Format)
------------------------------------------------- */
// Rückgabe: Array von Objekten
//   {type: 'move'|'draw'|'flash', x: mm, y: mm}
function parseGerber(text) {
const lines   = text.split('\n');
const result  = [];
let   unit    = 'mm';      // Standard, kann durch G70 (inch) geändert werden
const toMM = (raw) => {
// %FSLAX23Y23% → 2 int + 3 dec → Faktor 0.001
let mm = parseInt(raw, 10) * 0.001;
if (unit === 'inch') mm *= INCH_TO_MM;
return mm;
};

for (let rawLine of lines) {

    const line = rawLine.trim();
    if (!line) continue;

    // -------------------------------------------------
    // 1.1 Kommentare / Header ignorieren
    // -------------------------------------------------
    if (line.startsWith('G04') || line.startsWith('%') || line.startsWith('M02')) {
        continue;
    }

    // -------------------------------------------------
    // 1.2 Einheit setzen
    // -------------------------------------------------
    if (line === 'G70*') {               // inches
        unit = 'inch';
        continue;
    }
    if (line === 'G71*') {               // mm (falls vorkommt)
        unit = 'mm';
        continue;
    }

    // -------------------------------------------------
    // 1.3 Werkzeug‑/Aperture‑Wechsel (nur merken)
    // -------------------------------------------------
    if (/^G54D\d+\*/.test(line)) {
        continue;
    }

    // -------------------------------------------------
    // 1.4 Koordinaten‑Zeilen mit D‑Code
    // -------------------------------------------------
    const coordMatch = line.match(/^X([\d]+)Y([\d]+)D(\d+)\*/);
    if (coordMatch) {
        const rawX = coordMatch[1];
        const rawY = coordMatch[2];
        const d    = parseInt(coordMatch[3], 10); // 02, 01, 03 …

        const xMM = toMM(rawX);
        const yMM = BOARD_H - toMM(rawY); // Y‑Achse spiegeln (Board‑Höhe)

        if (d === 2) {               // D02 → rapid move (pen up)
            result.push({type: 'move', x: xMM, y: yMM});
        } else if (d === 1) {        // D01 → draw (pen down)
            result.push({type: 'draw', x: xMM, y: yMM});
        } else if (d === 3) {        // D03 → flash (Pad)
            result.push({type: 'flash', x: xMM, y: yMM});
        }
        continue;
    }

    // -------------------------------------------------
    // 1.5 Zeilen ohne Koordinaten, aber mit D‑Code (z. B. D02*)
    // -------------------------------------------------
    if (/^D\d+\*/.test(line)) {
        // Keine neue Koordinate – nur ein Zustandswechsel,
        // wird im G‑Code‑Generator über die vorherige
        // Position behandelt.
        continue;
    }

    // -------------------------------------------------
    // 1.6 Alle anderen Zeilen ignorieren
    // -------------------------------------------------
}
return result;

}
/* -------------------------------------------------
2. G‑Code‑Generator
------------------------------------------------- */
function generateGCode(commands) {
    const parts = [];
    parts.push('G21 ; mm');
    parts.push('G90 ; absolute positioning');
    // Start: Werkzeug sofort anheben mit Feedrate F300
    parts.push('G0 Z20 F300');

    let penDown = false;
    let lastPos = null;

    for (const cmd of commands) {
        if (cmd.type === 'move') {
            if (penDown) {
                parts.push('G0 Z20 F300');
                penDown = false;
            }
            parts.push(`G0 X${cmd.x.toFixed(3)} Y${cmd.y.toFixed(3)} F300`);
            lastPos = { x: cmd.x, y: cmd.y };
        } else if (cmd.type === 'draw') {
            if (!penDown) {
                // Anfahren
                parts.push('G0 Z20 F300');
                parts.push(`G0 X${lastPos.x.toFixed(3)} Y${lastPos.y.toFixed(3)} F300`);
                parts.push('G1 Z0 F100');
                penDown = true;
            }
            parts.push(`G1 X${cmd.x.toFixed(3)} Y${cmd.y.toFixed(3)} F100`);
            lastPos = { x: cmd.x, y: cmd.y };
        } else if (cmd.type === 'flash') {
            if (penDown) {
                parts.push('G0 Z20 F300');
                penDown = false;
            }
            parts.push(`G0 X${cmd.x.toFixed(3)} Y${cmd.y.toFixed(3)} F300`);
            parts.push('G1 Z0 F100');
            // Werkzeug wieder anheben nach dem Pad
            parts.push('G0 Z20 F300');
            lastPos = { x: cmd.x, y: cmd.y };
        }
    }

    if (penDown) {
        parts.push('G0 Z20 F300');
    }
    parts.push('M30 ; Programmende');
    return parts.join('\n');
}


/* -------------------------------------------------
3. Canvas‑Zeichnung
------------------------------------------------- */
function drawBoard(commands) {
const {scale: SCALE, offsetX: OFFX, offsetY: OFFY} = getCanvasMetrics();
// Canvas leeren
ctx.clearRect(0, 0, canvas.width, canvas.height);

// -------------------------------------------------
// 3.1 Board‑Rahmen (schwarz)
// -------------------------------------------------
ctx.strokeStyle = '#000';
ctx.lineWidth   = 2;
ctx.strokeRect(OFFX, OFFY, BOARD_W * SCALE, BOARD_H * SCALE);

// -------------------------------------------------
// 3.2 Fahrstrecken (D02) – gestrichelte gelbe Linien
// -------------------------------------------------
ctx.strokeStyle = 'yellow';
ctx.lineWidth   = 1;
ctx.setLineDash([6, 4]); // gestrichelt
ctx.beginPath();

let travelPos = null; // aktuelle Position während reiner Fahrstrecken
for (const cmd of commands) {
    const x = OFFX + cmd.x * SCALE;
    const y = OFFY + cmd.y * SCALE;

    if (cmd.type === 'move') {
        // Start einer neuen reinen Fahrstrecke
        travelPos = {x, y};
    } else {
        // Jeder andere Befehl beendet die aktuelle Fahrstrecke
        travelPos = null;
    }
}
// Wir zeichnen die Fahrstrecken, indem wir die Punkte aus
// den move‑Kommandos verbinden (jeweils von vorherigem move
// zum nächsten move). Das entspricht dem „Schnellfahrt“-Pfad.
// Dafür sammeln wir die move‑Punkte in einem Array:
const travelPoints = commands.filter(c => c.type === 'move')
                             .map(c => ({x: OFFX + c.x * SCALE,
                                        y: OFFY + c.y * SCALE}));
for (let i = 0; i < travelPoints.length - 1; i++) {
    ctx.moveTo(travelPoints[i].x, travelPoints[i].y);
    ctx.lineTo(travelPoints[i + 1].x, travelPoints[i + 1].y);
}
ctx.stroke();
ctx.setLineDash([]); // zurücksetzen

// -------------------------------------------------
// 3.3 Zeichen‑Linien (D01) – durchgezogene blaue Linien
// -------------------------------------------------
ctx.strokeStyle = '#0066cc';
ctx.lineWidth   = 1;
ctx.beginPath();

let currentPos = null; // aktuelle Position (egal ob move oder draw)
for (const cmd of commands) {
    const x = OFFX + cmd.x * SCALE;
    const y = OFFY + cmd.y * SCALE;

    if (cmd.type === 'move') {
        currentPos = {x, y}; // pen up – neuer Startpunkt
    } else if (cmd.type === 'draw') {
        if (currentPos) {
            ctx.moveTo(currentPos.x, currentPos.y);
            ctx.lineTo(x, y);
        } else {
            // Sollte nie vorkommen, aber für Sicherheit:
            ctx.moveTo(x, y);
        }
        currentPos = {x, y};
    } else {
        // flash beendet die aktuelle Zeichen‑Sequenz
        currentPos = null;
    }
}
ctx.stroke();

// -------------------------------------------------
// 3.4 Flashes (D03) – kleine rote Kreise (Durchmesser ≈ 0,8 mm)
// -------------------------------------------------
ctx.fillStyle = '#ff0000';
const padRadius = (0.8 / 2) * SCALE; // 0,8 mm Durchmesser → 0,4 mm Radius
for (const cmd of commands) {
    if (cmd.type === 'flash') {
        const x = OFFX + cmd.x * SCALE;
        const y = OFFY + cmd.y * SCALE;
        ctx.beginPath();
        ctx.arc(x, y, padRadius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

}

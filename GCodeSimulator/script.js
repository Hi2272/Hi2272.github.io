/* ---------------------------------------------------------------
   Konstanten für Randabstand (damit Beschriftungen sichtbar bleiben)
   --------------------------------------------------------------- */
const MARGIN_LEFT   = 60;   // Platz für Y‑Achsen‑Zahlen
const MARGIN_BOTTOM = 40;   // Platz für X‑Achsen‑Zahlen
const MARGIN_TOP    = 20;
const MARGIN_RIGHT  = 20;

/* ---------------------------------------------------------------
   Globale Variablen
   --------------------------------------------------------------- */
let maxX = 100;               // Standard‑Breite (mm)
let maxY = 70;                // Standard‑Höhe  (mm)
let scale = 1;                // Pixel‑pro‑mm – wird bei jedem Resize/Update neu berechnet
let drawnLines = [];          // dauerhaft gespeicherte Linien
let pointMarks = [];          // Kreise, die bei speziellen Befehlen gesetzt werden
let gcodeLines = [];          // Zeilen‑Array des Textareas (inkl. Kommentare/Leerzeilen)
const stopBtn = document.getElementById('stopBtn');
let animationHandle = null;   // speichert den aktuellen requestAnimationFrame‑Handle
let isRunning = false;        // true, solange eine Simulation läuft

/* ---------------------------------------------------------------
   Hilfsfunktionen
   --------------------------------------------------------------- */
// Spindel‑Dreieck – Spitze nach unten (180° gedreht)
function drawSpindle(ctx, tipX, tipY, size = 20) {
    ctx.save();
    ctx.translate(tipX, tipY);
    ctx.rotate(Math.PI);               // 180° drehen → Spitze nach unten
    ctx.beginPath();
    ctx.moveTo(0, 0);                  // Spitze
    ctx.lineTo(-size / 2, size);       // linke Basis
    ctx.lineTo(size / 2, size);        // rechte Basis
    ctx.closePath();
    ctx.fillStyle = "#ff6600";
    ctx.fill();
    ctx.restore();
}

function stopSimulation() {
    // Abbruch der laufenden Animation
    if (animationHandle !== null) {
        cancelAnimationFrame(animationHandle);
        animationHandle = null;
    }
    isRunning = false;

    // UI zurücksetzen
    runBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
    gcodeArea.setSelectionRange(0, 0);
    commandText.textContent = '‑';
}

// Kleiner Kreis (Radius 6 px) – für G0 Z0 F100‑Bedingung
function drawCircle(ctx, x, y, radius = 6, color = "#000000") {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

/* ---------------------------------------------------------------
   Schrittweite (Tick‑Abstand) – größte Zehner‑Potenz ≤ maxX
   --------------------------------------------------------------- */
function computeStep() {
    // Für maxX ≤ 0 ein fallback von 1
    if (maxX <= 10) return 1;
    const exponent = Math.floor(Math.log10(maxX))-1;
    return Math.pow(10, exponent);
}

/* ---------------------------------------------------------------
   Gitternetz (blau) – dynamischer Schritt
   --------------------------------------------------------------- */
function drawGrid(ctx, width, height) {
    ctx.save();
    ctx.strokeStyle = "#cce5ff";   // helles Blau für das Gitter
    ctx.lineWidth = 0.5;

    const x0 = MARGIN_LEFT;
    const y0 = height - MARGIN_BOTTOM;
    const drawableW = width  - MARGIN_LEFT - MARGIN_RIGHT;
    const drawableH = height - MARGIN_TOP  - MARGIN_BOTTOM;

    const step = computeStep();               // dynamischer Schritt (mm)
    const stepXpx = step * scale;
    const stepYpx = step * scale;

    // Vertikale Linien
    for (let x = x0 + stepXpx; x < x0 + drawableW; x += stepXpx) {
        ctx.beginPath();
        ctx.moveTo(x, MARGIN_TOP);
        ctx.lineTo(x, height - MARGIN_BOTTOM);
        ctx.stroke();
    }

    // Horizontale Linien
    for (let y = y0 - stepYpx; y > MARGIN_TOP; y -= stepYpx) {
        ctx.beginPath();
        ctx.moveTo(MARGIN_LEFT, y);
        ctx.lineTo(width - MARGIN_RIGHT, y);
        ctx.stroke();
    }

    ctx.restore();
}

/* ---------------------------------------------------------------
   Achsen (blau, Tick‑Marken links/unterhalb, dynamischer Schritt)
   --------------------------------------------------------------- */
function drawAxes(ctx, width, height) {
    ctx.save();

    ctx.strokeStyle = "#0066ff";
    ctx.fillStyle   = "#0066ff";
    ctx.lineWidth = 1;

    const x0 = MARGIN_LEFT;
    const y0 = height - MARGIN_BOTTOM;

    // X‑Achse
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(width - MARGIN_RIGHT, y0);
    ctx.stroke();

    // Y‑Achse
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x0, MARGIN_TOP);
    ctx.stroke();

    ctx.font = "10px Arial";
    ctx.textBaseline = "middle";

    const step = computeStep();   // dynamischer Schritt (mm)

    // ----- X‑Ticks (unterhalb der X‑Achse) -----
    for (let mm = step; mm <= maxX; mm += step) {
        const px = x0 + mm * scale;
        ctx.beginPath();
        ctx.moveTo(px, y0);
        ctx.lineTo(px, y0 + 5);
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.fillText(mm.toString(), px, y0 + 12);
    }

    // ----- Y‑Ticks (links von der Y‑Achse) -----
    for (let mm = step; mm <= maxY; mm += step) {
        const py = y0 - mm * scale;
        ctx.beginPath();
        ctx.moveTo(x0, py);
        ctx.lineTo(x0 - 5, py);
        ctx.stroke();

        ctx.textAlign = "right";
        ctx.fillText(mm.toString(), x0 - 8, py);
    }

    ctx.restore();
}

/* ---------------------------------------------------------------
   G‑Code‑Parser – Zeilen‑Index merken und Kreis‑Bedingung prüfen
   --------------------------------------------------------------- */
function parseGCode(text) {
    gcodeLines = text.split('\n');               // Zeilen‑Array für Highlight & Anzeige
    const lines = gcodeLines;
    const moves = [];

    let cur = { X: 0, Y: 0, Z: 0 };
    let currentFeed = null;
    let prevLine = null;                         // Roh‑Zeile (nach Trim) der vorherigen Zeile

    for (let i = 0; i < lines.length; i++) {
        const rawLine = lines[i];
        const line = rawLine.trim().toUpperCase();

        if (!line || line.startsWith(';')) {
            prevLine = line;
            continue;
        }

        // Feed‑Rate‑Änderung ohne Bewegungsbefehl
        if (line.startsWith('F')) {
            const fVal = parseFloat(line.slice(1));
            if (!isNaN(fVal)) currentFeed = fVal;
            prevLine = line;
            continue;
        }

        // Bewegungsbefehle G0 / G1
        if (line.startsWith('G0') || line.startsWith('G1')) {
            const parts = line.split(' ');
            const target = { ...cur };
            let feedForThisMove = currentFeed;
            let circleFlag = false;               // wird ggf. gesetzt

            for (const p of parts) {
                if (p.startsWith('X')) target.X = parseFloat(p.slice(1));
                if (p.startsWith('Y')) target.Y = parseFloat(p.slice(1));
                if (p.startsWith('Z')) target.Z = parseFloat(p.slice(1));
                if (p.startsWith('F')) {
                    const fVal = parseFloat(p.slice(1));
                    if (!isNaN(fVal)) {
                        feedForThisMove = fVal;
                        currentFeed = fVal;
                    }
                }
            }

            // Kreis‑Bedingung:
            //   vorherige Zeile: G1 Z0
            //   aktuelle Zeile : G0 Z5
            const isCurrentG0Z5 = line.startsWith('G0') && line.includes('Z5');
            const isPrevG1Z0   = prevLine && prevLine.startsWith('G1') && prevLine.includes('Z0');
            if (isCurrentG0Z5 && isPrevG1Z0) circleFlag = true;

            moves.push({
                from: { ...cur },
                to: target,
                feed: feedForThisMove,
                circle: circleFlag,
                lineIndex: i                         // merken, welche Zeile das ist
            });
            cur = target;
        }

        prevLine = line;
    }
    return moves;
}

/* ---------------------------------------------------------------
   Canvas‑Initialisierung & Event‑Handler
   --------------------------------------------------------------- */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const runBtn = document.getElementById('runBtn');
const speedSlider = document.getElementById('speed');
const speedVal = document.getElementById('speedVal');
const gcodeArea = document.getElementById('gcode');
const widthInput = document.getElementById('canvasW');
const heightInput = document.getElementById('canvasH');
const commandText = document.getElementById('commandText');   // Anzeige des aktuellen Befehls

speedSlider.addEventListener('input', () => {
    speedVal.textContent = speedSlider.value;
});

/* ---- Eingabefelder für Breite/Höhe ---- */
function updateDimensionsFromInputs() {
    const w = parseFloat(widthInput.value);
    const h = parseFloat(heightInput.value);
    if (!isNaN(w) && w > 0) maxX = w;
    if (!isNaN(h) && h > 0) maxY = h;
    computeScale();
    redrawBackground();   // Gitter + Achsen + Spindel‑Startposition
}

/* ---- Berechne den Pixel‑zu‑mm‑Faktor (gleiche Skalierung für X & Y) ---- */
function computeScale() {
    const drawableW = canvas.width  - MARGIN_LEFT - MARGIN_RIGHT;
    const drawableH = canvas.height - MARGIN_TOP  - MARGIN_BOTTOM;
    scale = Math.min(drawableW / maxX, drawableH / maxY);
}

/* ---- Hintergrund (Gitter + Achsen) + Start‑Spindel neu zeichnen ---- */
function redrawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    drawAxes(ctx, canvas.width, canvas.height);
    // bereits gesetzte Kreise wiederzeichnen (falls vorhanden)
    pointMarks.forEach(p => drawCircle(ctx, p.x, p.y));
    // Spindel‑Dreieck bei (0,0)
    const origin = toCanvas(0, 0);
    drawSpindle(ctx, origin.x, origin.y);
}

/* ---- Beim Laden der Seite sofort Gitter, Achsen und Spindel anzeigen ---- */
window.addEventListener('load', () => {
    computeScale();
    redrawBackground();
});

/* ---- Änderungen an den Eingabefeldern sofort wirksam machen ---- */
widthInput.addEventListener('change', updateDimensionsFromInputs);
heightInput.addEventListener('change', updateDimensionsFromInputs);

/* ---------------------------------------------------------------
   Koordinaten‑Umrechnung (G‑Code → Canvas) inkl. Randabstand
   --------------------------------------------------------------- */
function toCanvas(gx, gy) {
    // Ursprung (0,0) = (MARGIN_LEFT, canvas.height - MARGIN_BOTTOM)
    return {
        x: MARGIN_LEFT + gx * scale,
        y: canvas.height - MARGIN_BOTTOM - gy * scale
    };
}

/* ---------------------------------------------------------------
   Hilfsfunktion: aktuelle Zeile im Textarea markieren
   --------------------------------------------------------------- */
function highlightGcodeLine(lineIdx) {
    if (lineIdx < 0 || lineIdx >= gcodeLines.length) return;

    // Start‑Offset berechnen (inkl. Zeilenumbrüche)
    let start = 0;
    for (let i = 0; i < lineIdx; i++) {
        start += gcodeLines[i].length + 1; // +1 für "\n"
    }
    const end = start + gcodeLines[lineIdx].length;

    gcodeArea.focus();
    gcodeArea.setSelectionRange(start, end);
}

/* ---------------------------------------------------------------
   Simulations‑Button
   --------------------------------------------------------------- */
runBtn.addEventListener('click', () => {
    // ggf. laufende Simulation abbrechen
    if (isRunning) stopSimulation();

    const moves = parseGCode(gcodeArea.value);
    if (moves.length === 0) {
        alert('Kein gültiger G‑Code gefunden.');
        return;
    }

    // UI für laufende Simulation vorbereiten
    isRunning = true;
    runBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';

    drawnLines = [];
    pointMarks = [];
    commandText.textContent = '‑';
    redrawBackground();

    animateMoves(moves, 0);
});

stopBtn.addEventListener('click', () => {
    if (isRunning) stopSimulation();
});

/* ---------------------------------------------------------------
   Animationsfunktion – Berücksichtigt Feed‑Rate (F), Kreise,
   Zeilen‑Highlight und aktuellen Befehl
   --------------------------------------------------------------- */

function animateMoves(moves, idx) {
    if (!isRunning) return;                     // Abbruch‑Check

    if (idx >= moves.length) {
        // Simulation fertig → UI zurücksetzen
        stopSimulation();
        return;
    }

    const move = moves[idx];

    if (idx >= moves.length) {
        // Alle Moves erledigt → Markierung und Anzeige zurücksetzen
        gcodeArea.setSelectionRange(0, 0);
        commandText.textContent = '‑';
        return;
    }


    // ---- Highlight aktuelle Zeile im Textarea ----
    if (typeof move.lineIndex === 'number') {
        highlightGcodeLine(move.lineIndex);
    }

    // ---- Anzeige des aktuellen G‑Code‑Befehls ----
    if (typeof move.lineIndex === 'number' && gcodeLines[move.lineIndex]) {
        commandText.textContent = gcodeLines[move.lineIndex].trim();
    } else {
        commandText.textContent = '‑';
    }

    const from = move.from;
    const to   = move.to;

    const start = toCanvas(from.X, from.Y);
    const end   = toCanvas(to.X,   to.Y);

    // ---- Dauer basierend auf Feed‑Rate (mm/min) ----
    const dxMm = (end.x - start.x) / scale;
    const dyMm = (end.y - start.y) / scale;
    const distanceMm = Math.hypot(dxMm, dyMm);

    let duration;
    if (move.feed && move.feed > 0) {
        duration = (distanceMm / move.feed) * 60000/speedSlider.value; // ms
    } else {
        duration = 1000 / speedSlider.value;        // fallback
    }

     const startTime = performance.now();



    function step(now) {
        if (!isRunning) return;                 // sofort abbrechen, falls gestoppt


        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1); // 0‑1

        const curX = start.x + (end.x - start.x) * t;
        const curY = start.y + (end.y - start.y) * t;

        // Canvas komplett neu zeichnen (Gitter + Achsen bleiben erhalten)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx, canvas.width, canvas.height);
        drawAxes(ctx, canvas.width, canvas.height);

        // bereits gespeicherte Linien wiederherstellen
        ctx.beginPath();
        drawnLines.forEach(seg => {
            ctx.moveTo(seg.from.x, seg.from.y);
            ctx.lineTo(seg.to.x, seg.to.y);
        });
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // bereits gesetzte Kreise wiederzeichnen
        pointMarks.forEach(p => drawCircle(ctx, p.x, p.y));

        // Wenn Z ≤ 0, aktuelle Teilstrecke sichtbar machen (ohne sofort zu speichern)
        if (to.Z <= 0) {
            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(curX, curY);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Spindel (Dreieck) zeichnen – Spitze liegt bei (curX,curY)
        drawSpindle(ctx, curX, curY);


        if (t < 1) {
            
            animationHandle = requestAnimationFrame(step);
        } else {
            // Zug beendet – bei Z ≤ 0 Linie dauerhaft speichern
            if (to.Z <= 0) {
                drawnLines.push({ from: { x: start.x, y: start.y }, to: { x: end.x, y: end.y } });
            }

            // Kreis‑Bedingung: wenn move.circle true, Kreis setzen
            if (move.circle) {
                const pt = { x: end.x, y: end.y };
                pointMarks.push(pt);
                drawCircle(ctx, pt.x, pt.y);
            }

            // Nächsten Zug starten
            animateMoves(moves, idx + 1);
        }
    }
  animationHandle = requestAnimationFrame(step);
}

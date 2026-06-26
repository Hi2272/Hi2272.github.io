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
let maxX = 100;   // Standard‑Breite (mm) – wird beim Laden aus den Input‑Feldern übernommen
let maxY = 70;    // Standard‑Höhe  (mm)
let scale = 1;    // Pixel‑pro‑mm – wird bei jedem Resize/Update neu berechnet
let drawnLines = []; // dauerhaft gespeicherte Linien
let pointMarks = []; // Kreise, die bei speziellen Befehlen gesetzt werden

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

// Kleiner blauer Kreis (Radius 2 px) – für G0 Z0 F100
/* ---------- 1. Kreis‑Funktion (größerer Radius) ---------- */
function drawCircle(ctx, x, y, radius = 6, color = "#000000") {   // ← Radius von 2 → 6
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

/* ---------------------------------------------------------------
   Gitternetz (blau) – 10 mm‑Schritte
   --------------------------------------------------------------- */
function drawGrid(ctx, width, height) {
    ctx.save();
    ctx.strokeStyle = "#cce5ff";   // helles Blau für das Gitter
    ctx.lineWidth = 0.5;

    const x0 = MARGIN_LEFT;
    const y0 = height - MARGIN_BOTTOM;
    const drawableW = width  - MARGIN_LEFT - MARGIN_RIGHT;
    const drawableH = height - MARGIN_TOP  - MARGIN_BOTTOM;

    // Vertikale Linien (10 mm)
    const stepXpx = 10 * scale;
    for (let x = x0 + stepXpx; x < x0 + drawableW; x += stepXpx) {
        ctx.beginPath();
        ctx.moveTo(x, MARGIN_TOP);
        ctx.lineTo(x, height - MARGIN_BOTTOM);
        ctx.stroke();
    }

    // Horizontale Linien (10 mm)
    const stepYpx = 10 * scale;
    for (let y = y0 - stepYpx; y > MARGIN_TOP; y -= stepYpx) {
        ctx.beginPath();
        ctx.moveTo(MARGIN_LEFT, y);
        ctx.lineTo(width - MARGIN_RIGHT, y);
        ctx.stroke();
    }

    ctx.restore();
}

/* ---------------------------------------------------------------
   Achsen (blau, Tick‑Marken links/unterhalb, 10 mm‑Schritte)
   --------------------------------------------------------------- */
function drawAxes(ctx, width, height) {
    ctx.save();

    // Farbe für Achsen, Striche und Zahlen → Blau
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

    // Schrift für Tick‑Beschriftungen
    ctx.font = "10px Arial";
    ctx.textBaseline = "middle";

    // Fest 10 mm‑Schritte für Beschriftungen
    const step = 10;

    // ----- X‑Ticks (unterhalb der X‑Achse) -----
    for (let mm = step; mm < maxX; mm += step) {
        const px = x0 + mm * scale;
        ctx.beginPath();
        ctx.moveTo(px, y0);
        ctx.lineTo(px, y0 + 5);
        ctx.stroke();

        ctx.textAlign = "center";
        ctx.fillText(mm.toString(), px, y0 + 12);
    }

    // ----- Y‑Ticks (links von der Y‑Achse) -----
    for (let mm = step; mm < maxY; mm += step) {
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
   G‑Code‑Parser (unterstützt F‑Feed‑Rate und Kreis‑Befehl)
   --------------------------------------------------------------- */

   /* ---------------------------------------------------------------
   G‑Code‑Parser (angepasst)
   --------------------------------------------------------------- */
function parseGCode(text) {
    const lines = text.split('\n');
    const moves = [];

    let cur = { X: 0, Y: 0, Z: 0 };
    let currentFeed = null; // mm/min, wird durch F‑Angaben gesetzt
    let prevLine = null;    // speichert die vorherige Roh‑Zeile für die Prüfung

    for (let rawLine of lines) {
        let line = rawLine.trim().toUpperCase();
        if (!line || line.startsWith(';')) {
            prevLine = line;               // Kommentar‑ oder leere Zeile merken
            continue;                     // Kommentar / leer → überspringen
        }

        /* ---- Feed‑Rate‑Änderung ohne Bewegungsbefehl ---- */
        if (line.startsWith('F')) {
            const fVal = parseFloat(line.slice(1));
            if (!isNaN(fVal)) currentFeed = fVal;
            prevLine = line;
            continue;
        }

        /* ---- Bewegungsbefehle G0 / G1 ---- */
        if (line.startsWith('G0') || line.startsWith('G1')) {
            const parts = line.split(' ');
            const target = { ...cur };
            let feedForThisMove = currentFeed; // ggf. überschrieben durch F im selben Befehl
            let circleFlag = false;            // wird später ggf. gesetzt

            for (let p of parts) {
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

            /* ---- Bedingung für Kreis setzen ----
               Kreis wird gesetzt, wenn die aktuelle Zeile ein G0‑Befehl
               mit Z5 ist UND die vorherige Zeile ein G1‑Befehl mit Z0 war.
            --------------------------------------------------- */
            const isCurrentG0Z5 = line.startsWith('G0') && line.includes('Z5');
            const isPrevG1Z0   = prevLine && prevLine.startsWith('G1') && prevLine.includes('Z0');
            if (isCurrentG0Z5 && isPrevG1Z0) {
                circleFlag = true;
            }

            moves.push({
                from: { ...cur },
                to: target,
                feed: feedForThisMove,
                circle: circleFlag          // true → Kreis wird beim Zeichnen gesetzt
            });
            cur = target;
        }

        // vorherige Zeile für die nächste Iteration merken
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
    // Gleiche Skalierung, damit das Seitenverhältnis erhalten bleibt
    scale = Math.min(drawableW / maxX, drawableH / maxY);
}

/* ---------- 2. Hintergrund neu zeichnen (Kreise vor Spindel) ---------- */
function redrawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    drawAxes(ctx, canvas.width, canvas.height);
    // Kreise (falls bereits gesetzt) zuerst zeichnen
    pointMarks.forEach(p => drawCircle(ctx, p.x, p.y));
    // Spindel‑Dreieck danach, damit es nicht über die Kreise legt
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
   Simulations‑Button
   --------------------------------------------------------------- */
runBtn.addEventListener('click', () => {
    const moves = parseGCode(gcodeArea.value);
    if (moves.length === 0) {
        alert('Kein gültiger G‑Code gefunden.');
        return;
    }

    // Canvas zurücksetzen, aber Gitter + Achsen bleiben erhalten
    drawnLines = [];
    pointMarks = [];               // Kreise werden neu gesetzt
    redrawBackground();           // Gitter, Achsen, Spindel‑Start bei (0,0)

    animateMoves(moves, 0);
});

/* ---------------------------------------------------------------
   Animationsfunktion – Berücksichtigt Feed‑Rate (F) und Kreise
   --------------------------------------------------------------- */
function animateMoves(moves, idx) {
    if (idx >= moves.length) return; // fertig

    const move = moves[idx];
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
        duration = (distanceMm / move.feed) * 6000; // ms
    } else {
        duration = 1000 / speedSlider.value;        // fallback
    }

    const startTime = performance.now();

    function step(now) {
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
   // bereits gesetzte Kreise wiederzeichnen (vor Spindel)
    pointMarks.forEach(p => drawCircle(ctx, p.x, p.y));

    // Spindel (Dreieck) zeichnen – Spitze liegt bei (curX,curY)
    drawSpindle(ctx, curX, curY);

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
            requestAnimationFrame(step);
        } else {
            // Zug beendet – bei Z ≤ 0 Linie dauerhaft speichern
            if (to.Z <= 0) {
                drawnLines.push({ from: { x: start.x, y: start.y }, to: { x: end.x, y: end.y } });
            }

            // Falls dieser Zug ein Kreis‑Befehl war, Kreis setzen
            if (move.circle) {
                const pt = { x: end.x, y: end.y };
                pointMarks.push(pt);
                drawCircle(ctx, pt.x, pt.y);
            }

            // Nächsten Zug starten
            animateMoves(moves, idx + 1);
        }
    }

    requestAnimationFrame(step);
}

/* -------------------------------------------------
   G‑Code Viewer & Editor – erweiterte Logik
   ------------------------------------------------- */

const canvas    = document.getElementById('gcodeCanvas');
const ctx       = canvas.getContext('2d');
const textarea  = document.getElementById('gcodeText');
const openBtn   = document.getElementById('openBtn');
const saveBtn   = document.getElementById('saveBtn');
const helpBtn   = document.getElementById('helpBtn');
const fileInput = document.getElementById('fileInput');

/* ---------- Variablen für das Rechteck‑Zeichnen ---------- */
let isDragging   = false;
let dragStart    = { x: 0, y: 0 };
let dragEnd      = { x: 0, y: 0 };
let currentScale = { scale: 1, offsetX: 0, offsetY: 0 };

/* ---------- Canvas zurücksetzen ---------- */
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/* ---------- Skalierung ermitteln (nur X/Y‑Koordinaten) ---------- */
function getScale(gcodeLines) {
    let minX =  Infinity, minY =  Infinity,
        maxX = -Infinity, maxY = -Infinity;

    gcodeLines.forEach(line => {
        const match = line.match(/[XY]\s*(-?\d+(\.\d+)?)/gi);
        if (!match) return;

        let x = null, y = null;
        match.forEach(tok => {
            const axis = tok[0];
            const val  = parseFloat(tok.slice(1));
            if (axis === 'X') x = val;
            if (axis === 'Y') y = val;
        });
        if (x !== null && y !== null) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
        }
    });

    const padding = 20;
    const scaleX = (canvas.width  - 2 * padding) / (maxX - minX || 1);
    const scaleY = (canvas.height - 2 * padding) / (maxY - minY || 1);
    const scale  = Math.min(scaleX, scaleY);

    return {
        scale,
        offsetX: padding - minX * scale,
        offsetY: padding - minY * scale
    };
}

/* ---------- G‑Code‑Zeichnung (nur G00‑Kreise) ----------
   **Ausnahme:** Punkte mit X = 0 und Y = 0 (Startpunkt) werden nicht gezeichnet. */
function drawGcode(gcodeText) {
    clearCanvas();

    const lines = gcodeText.split(/\r?\n/).map(l => l.trim()).filter(l => l);
    const { scale, offsetX, offsetY } = getScale(lines);
    currentScale = { scale, offsetX, offsetY };

    ctx.fillStyle = '#ff0000';
    const radius = 2;

    lines.forEach(line => {
        const code = line.split(';')[0].trim();   // Kommentare entfernen
        if (!code) return;
        if (!/^G0{1,2}\b/.test(code)) return;    // nur G00 / G0

        const match = code.match(/[XY]\s*(-?\d+(\.\d+)?)/gi);
        if (!match) return;

        let x = null, y = null;
        match.forEach(tok => {
            const axis = tok[0];
            const val  = parseFloat(tok.slice(1));
            if (axis === 'X') x = val;
            if (axis === 'Y') y = val;
        });
        if (x === null || y === null) return;

        // ---- **Startpunkt (0,0) nicht darstellen** ----
        if (x === 0 && y === 0) return;

        const cx = x * scale + offsetX;
        const cy = canvas.height - (y * scale + offsetY);

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
        ctx.fill();
    });

    // Wenn gerade ein Rechteck gezogen wird, das temporäre Rechteck nachzeichnen
    if (isDragging) drawTempRectangle();
}

/* ---------- Temporäres Rechteck ---------- */
function drawTempRectangle() {
    const x = Math.min(dragStart.x, dragEnd.x);
    const y = Math.min(dragStart.y, dragEnd.y);
    const w = Math.abs(dragStart.x - dragEnd.x);
    const h = Math.abs(dragStart.y - dragEnd.y);

    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,255,0.8)';
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 2]);
    ctx.strokeRect(x, y, w, h);
    ctx.restore();
}

/* ---------- Maus‑Events für das Rechteck ---------- */
canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    dragStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    dragEnd   = { ...dragStart };
    isDragging = true;
});

canvas.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    dragEnd = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    drawGcode(textarea.value);
});

canvas.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;

    const { scale, offsetX, offsetY } = currentScale;

    const x1 = Math.min(dragStart.x, dragEnd.x);
    const y1 = Math.min(dragStart.y, dragEnd.y);
    const x2 = Math.max(dragStart.x, dragEnd.x);
    const y2 = Math.max(dragStart.y, dragEnd.y);

    const gx1 = (x1 - offsetX) / scale;
    const gy1 = (canvas.height - y1 - offsetY) / scale;
    const gx2 = (x2 - offsetX) / scale;
    const gy2 = (canvas.height - y2 - offsetY) / scale;

    const minX = Math.min(gx1, gx2);
    const maxX = Math.max(gx1, gx2);
    const minY = Math.min(gy1, gy2);
    const maxY = Math.max(gy1, gy2);

    const originalLines = textarea.value.split(/\r?\n/);
    const filteredLines = [];
    let deleteNextPureZ = false;

    originalLines.forEach(line => {
        const raw  = line;
        const code = line.split(';')[0].trim();

        if (!code) {
            filteredLines.push(raw);
            deleteNextPureZ = false;
            return;
        }

        const xyMatch = code.match(/[XY]\s*(-?\d+(\.\d+)?)/gi);

        if (xyMatch) {
            let x = null, y = null;
            xyMatch.forEach(tok => {
                const axis = tok[0];
                const val  = parseFloat(tok.slice(1));
                if (axis === 'X') x = val;
                if (axis === 'Y') y = val;
            });

            const inside = (x !== null && y !== null &&
                x >= minX && x <= maxX && y >= minY && y <= maxY);

            if (inside) {
                deleteNextPureZ = true;
                return;                 // Zeile entfernen
            } else {
                filteredLines.push(raw);
                deleteNextPureZ = false;
                return;
            }
        }

        // reine Z‑Zeilen (z. B. G01 Z‑2.0000) entfernen, wenn vorheriger Punkt gelöscht wurde
        const hasZ   = /Z\s*-?\d+(\.\d+)?/i.test(code);
        const hasXorY = /[XY]\s*-?\d+(\.\d+)?/i.test(code);
        const isPureZ = hasZ && !hasXorY;

        if (isPureZ && deleteNextPureZ) {
            return;                     // ebenfalls entfernen
        }

        filteredLines.push(raw);
        deleteNextPureZ = false;
    });

    textarea.value = filteredLines.join('\n');
    drawGcode(textarea.value);
});

/* ---------- Button‑Handler ---------- */
openBtn.addEventListener('click', () => fileInput.click());

saveBtn.addEventListener('click', () => {
    const blob = new Blob([textarea.value], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href    = url;
    a.download = 'export.gcode';
    a.click();
    URL.revokeObjectURL(url);
});

/* Neuer Button: Anleitung → öffnet help.html in neuem Tab */
helpBtn.addEventListener('click', () => {
    window.open('help.html', '_blank');
});

/* Datei öffnen – **kompletten Inhalt anzeigen** */
fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
        const content = ev.target.result;

        // 1️⃣ Textarea vollständig befüllen
        textarea.value = content;

        // 2️⃣ Scroll‑Position zurück nach oben (falls vorher gescrollt)
        textarea.scrollTop = 0;

        // 3️⃣ Canvas neu zeichnen (alle Punkte, inkl. neuer Skalierung)
        drawGcode(content);

        // 4️⃣ Reset des <input>, damit dieselbe Datei erneut gewählt werden kann
        fileInput.value = '';
    };
    reader.readAsText(file);
});

/* Änderungen im Textarea sofort darstellen */
textarea.addEventListener('input', () => drawGcode(textarea.value));

/* Initialisierung */
clearCanvas();

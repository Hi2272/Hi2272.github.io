/* ------------------------------------------------------------
   Globale Zustände
   ------------------------------------------------------------ */
let originalGcode = "";          // unveränderte (nicht‑skalierte) Version
let origMaxX = 0;
let origMaxY = 0;
let syncing = false;            // verhindert rekursive change‑Events

/* ------------------------------------------------------------
   Hilfsfunktion: Einfügen von M‑Befehlen (wie vorher)
   ------------------------------------------------------------ */
function insertConversionLines(text) {
    const lines   = text.split('\n');
    const result  = [];

    let insertedG0 = false;
    let insertedG1 = false;

    const penUp   = document.getElementById('penUpInput').value.trim();
    const penDown = document.getElementById('penDownInput').value.trim();

    const g0Pattern = /^G0\s/;
    const g1Pattern = /^G1\s/;

    lines.forEach(line => {
        const trimmed = line.trim();

        if (g0Pattern.test(trimmed)) {
            if (!insertedG0) { result.push(penUp); insertedG0 = true; }
            insertedG1 = false;
            result.push(line);
        } else if (g1Pattern.test(trimmed)) {
            if (!insertedG1) { result.push(penDown); insertedG1 = true; }
            insertedG0 = false;
            result.push(line);
        } else {
            result.push(line);
        }
    });

    result.push(penUp);
    return result.join('\n');
}

/* ------------------------------------------------------------
   Max‑X / Max‑Y aus einem G‑Code‑String ermitteln
   ------------------------------------------------------------ */
function getCurrentMaxXY(text) {
    let maxX = null, maxY = null;
    const lines = text.split('\n');
    const coordRegex = /[XY]([-+]?\d*\.?\d+)/g;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!/^G[01]\s/.test(trimmed)) return;

        let match;
        while ((match = coordRegex.exec(trimmed)) !== null) {
            const axis = match[0][0];
            const val  = parseFloat(match[1]);
            if (isNaN(val)) continue;
            if (axis === 'X') { if (maxX === null || val > maxX) maxX = val; }
            else if (axis === 'Y') { if (maxY === null || val > maxY) maxY = val; }
        }
    });
    return { maxX: maxX ?? 0, maxY: maxY ?? 0 };
}

/* ------------------------------------------------------------
   Original‑Metriken ermitteln und Eingabefelder füllen
   ------------------------------------------------------------ */
function refreshOriginalMetrics() {
    const { maxX, maxY } = getCurrentMaxXY(originalGcode);
    origMaxX = maxX;
    origMaxY = maxY;

    // Felder nur füllen, wenn sie noch leer sind (damit nicht überschrieben wird,
    // wenn der Nutzer bereits eigene Werte eingegeben hat)
    if (!document.getElementById('widthInput').value)  document.getElementById('widthInput').value  = maxX ? maxX.toFixed(3) : '';
    if (!document.getElementById('heightInput').value) document.getElementById('heightInput').value = maxY ? maxY.toFixed(3) : '';
}

/* ------------------------------------------------------------
   Skalierung des G‑Codes anhand gewünschter Breite/Höhe
   ------------------------------------------------------------ */
function scaleGcode() {
    const widthTarget  = parseFloat(document.getElementById('widthInput').value);
    const heightTarget = parseFloat(document.getElementById('heightInput').value);
    if (isNaN(widthTarget) || isNaN(heightTarget) || origMaxX === 0 || origMaxY === 0) return;

    const factorX = widthTarget  / origMaxX;
    const factorY = heightTarget / origMaxY;

    const coordRegex = /([XY])([-+]?\d*\.?\d+)/g;
    const scaledLines = originalGcode.split('\n').map(line => {
        const trimmed = line.trim();
        if (!/^G[01]\s/.test(trimmed)) return line;

        return line.replace(coordRegex, (full, axis, num) => {
            const value = parseFloat(num);
            if (isNaN(value)) return full;
            const scaled = axis === 'X' ? value * factorX : value * factorY;
            return `${axis}${scaled.toFixed(3)}`;
        });
    });

    document.getElementById('myTextarea').value = scaledLines.join('\n');
}

/* ------------------------------------------------------------
   Kopplung Breite ↔ Höhe (automatisches Update des Gegenwertes)
   ------------------------------------------------------------ */
function onWidthChange() {
    if (syncing) return;
    const newWidth = parseFloat(document.getElementById('widthInput').value);
    if (isNaN(newWidth) || origMaxX === 0) return;

    const newHeight = (newWidth / origMaxX) * origMaxY;
    syncing = true;
    document.getElementById('heightInput').value = newHeight.toFixed(3);
    syncing = false;

    scaleGcode();
}
function onHeightChange() {
    if (syncing) return;
    const newHeight = parseFloat(document.getElementById('heightInput').value);
    if (isNaN(newHeight) || origMaxY === 0) return;

    const newWidth = (newHeight / origMaxY) * origMaxX;
    syncing = true;
    document.getElementById('widthInput').value = newWidth.toFixed(3);
    syncing = false;

    scaleGcode();
}

/* ------------------------------------------------------------
   Canvas‑Visualisierung (wie vorher)
   ------------------------------------------------------------ */
function visualizeGcode() {
    const canvas = document.getElementById('gcodeCanvas');
    const ctx    = canvas.getContext('2d');

    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const text = document.getElementById('myTextarea').value;
    const lines = text.split('\n');

    const { maxX, maxY } = getCurrentMaxXY(text);
    const padding = 20;
    const scaleX = (canvas.width  - 2 * padding) / (maxX || 1);
    const scaleY = (canvas.height - 2 * padding) / (maxY || 1);
    const scale  = Math.min(scaleX, scaleY);

    let curX = padding;
    let curY = canvas.height - padding;
    const coordRegex = /[XY]([-+]?\d*\.?\d+)/g;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!/^G[01]\s/.test(trimmed)) return;

        let newX = curX, newY = curY;
        let match;
        while ((match = coordRegex.exec(trimmed)) !== null) {
            const axis = match[0][0];
            const val  = parseFloat(match[1]);
            if (axis === 'X') newX = padding + val * scale;
            if (axis === 'Y') newY = canvas.height - padding - val * scale;
        }

        if (trimmed.startsWith('G0 ')) {
            ctx.strokeStyle = '#0066ff';
            ctx.lineWidth   = 1;
            ctx.setLineDash([6, 4]);
        } else { // G1
            ctx.strokeStyle = '#000000';
            ctx.lineWidth   = 3;
            ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.moveTo(curX, curY);
        ctx.lineTo(newX, newY);
        ctx.stroke();

        curX = newX;
        curY = newY;
    });

    ctx.setLineDash([]);
}

/* ------------------------------------------------------------
   Button‑Handler
   ------------------------------------------------------------ */
document.getElementById('convertBtn').addEventListener('click', () => {
    const textarea   = document.getElementById('myTextarea');
    const original   = textarea.value;
    const converted  = insertConversionLines(original);
    textarea.value   = converted;
    originalGcode = converted;   // neuer Ausgangs‑G‑Code
    refreshOriginalMetrics();
    // Nach Konvertierung sofort visualisieren
    visualizeGcode();
});

document.getElementById('copyBtn').addEventListener('click', async () => {
    const textarea = document.getElementById('myTextarea');
    try {
        await navigator.clipboard.writeText(textarea.value);
        alert('Inhalt kopiert!');
    } catch (e) {
        alert('Kopieren fehlgeschlagen: ' + e);
    }
});

/* ------------------------------------------------------------
   Eingabefelder Breite / Höhe – gekoppelte Aktualisierung
   ------------------------------------------------------------ */
document.getElementById('widthInput').addEventListener('change', onWidthChange);
document.getElementById('heightInput').addEventListener('change', onHeightChange);

/* ------------------------------------------------------------
   Textarea – Sichtbarkeit der Buttons & automatische Visualisierung
   ------------------------------------------------------------ */
function handleTextareaInput() {
    const txt = document.getElementById('myTextarea').value.trim();

    // Wenn Text vorhanden → Buttons einblenden, sonst ausblenden
    const convertBtn = document.getElementById('convertBtn');
    const copyBtn    = document.getElementById('copyBtn');

    if (txt) {
        convertBtn.classList.remove('hidden');
        copyBtn.classList.remove('hidden');

        // Nur beim ersten Einfügen (oder wenn sich der Inhalt ändert) das Original‑Backup setzen
        originalGcode = document.getElementById('myTextarea').value;
        refreshOriginalMetrics();

        // Automatisch visualisieren
        visualizeGcode();
    } else {
        convertBtn.classList.add('hidden');
        copyBtn.classList.add('hidden');
        // Canvas leeren, weil kein G‑Code mehr da ist
        const canvas = document.getElementById('gcodeCanvas');
        const ctx    = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
document.getElementById('myTextarea').addEventListener('input', handleTextareaInput);

/* ------------------------------------------------------------
   Initiales Laden (falls bereits Text vorhanden)
   ------------------------------------------------------------ */
window.addEventListener('load', () => {
    // Der Hinweis‑Text ist bereits im HTML‑Markup als Anfangs‑Inhalt gesetzt.
    // Wir prüfen, ob die Textarea *nur* diesen Hinweis enthält – dann bleiben die Buttons hidden.
    handleTextareaInput();
});

/* ------------------------------------------------------------
   Globale Zustände
   ------------------------------------------------------------ */
let originalGcode = "";   // unveränderte (nicht‑skalierte) Version
let origMinX = null, origMinY = null, origMaxX = null, origMaxY = null;
let syncing = false;      // verhindert rekursive change‑Events

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

    result.push(penUp);               // abschließendes PenUp
    return result.join('\n');
}

/* ------------------------------------------------------------
   Max‑/Min‑X/Y aus einem G‑Code‑String ermitteln
   ------------------------------------------------------------ */
function getCurrentExtremes(text) {
    const lines = text.split('\n');
    const coordRegex = /[XY]([-+]?\d*\.?\d+)/g;
    let minX = null, minY = null, maxX = null, maxY = null;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!/^G[01]\s/.test(trimmed)) return;

        let match;
        while ((match = coordRegex.exec(trimmed)) !== null) {
            const axis = match[0][0];
            const val  = parseFloat(match[1]);
            if (isNaN(val)) continue;
            if (axis === 'X') {
                if (minX === null || val < minX) minX = val;
                if (maxX === null || val > maxX) maxX = val;
            } else {
                if (minY === null || val < minY) minY = val;
                if (maxY === null || val > maxY) maxY = val;
            }
        }
    });
    return { minX, minY, maxX, maxY };
}

/* ------------------------------------------------------------
   Aktualisiert alle Eingabefelder (Min/Width/Height)
   ------------------------------------------------------------ */
function refreshOriginalMetrics() {
    const { minX, minY, maxX, maxY } = getCurrentExtremes(originalGcode);
    origMinX = minX; origMinY = minY; origMaxX = maxX; origMaxY = maxY;

    const setIfEmpty = (id, value) => {
        const el = document.getElementById(id);
        el.value = value.toFixed(3);
    };

    setIfEmpty('minXInput', minX);
    setIfEmpty('minYInput', minY);
    setIfEmpty('widthInput',  (maxX !== null && minX !== null) ? maxX - minX : null);
    setIfEmpty('heightInput', (maxY !== null && minY !== null) ? maxY - minY : null);
}

/* ------------------------------------------------------------
   Generische Transformation von X‑/Y‑Werten
   ------------------------------------------------------------ */
function transformGcode(transformX, transformY) {
    const lines = originalGcode.split('\n');
    const coordRegex = /([XY])([-+]?\d*\.?\d+)/g;

    const newLines = lines.map(line => {
        const trimmed = line.trim();
        if (!/^G[01]\s/.test(trimmed)) return line; // keine Koordinaten → unverändert

        return line.replace(coordRegex, (full, axis, num) => {
            const val = parseFloat(num);
            if (isNaN(val)) return full;
            const newVal = axis === 'X' ? transformX(val) : transformY(val);
            return `${axis}${newVal.toFixed(3)}`;
        });
    });

    const newText = newLines.join('\n');
    document.getElementById('myTextarea').value = newText;
    originalGcode = newText;               // neuer Ausgangs‑G‑Code
    refreshOriginalMetrics();              // aktualisiert alle Felder
    visualizeGcode();                      // sofortige Neuzeichnung
}

/* ------------------------------------------------------------
   Handler für Min‑X / Min‑Y (Verschiebung)
   ------------------------------------------------------------ */
function onMinXChange() {
    const newMinX = parseFloat(document.getElementById('minXInput').value);
    if (isNaN(newMinX) || origMinX === null) return;
    const deltaX = newMinX - origMinX;
    transformGcode(v => v + deltaX, v => v);
}
function onMinYChange() {
    const newMinY = parseFloat(document.getElementById('minYInput').value);
    if (isNaN(newMinY) || origMinY === null) return;
    const deltaY = newMinY - origMinY;
    transformGcode(v => v, v => v + deltaY);
}

/* ------------------------------------------------------------
   Handler für Breite / Höhe (Skalierung relativ zu Min‑X/Min‑Y)
   ------------------------------------------------------------ */
function onWidthChange() {
    const newWidth = parseFloat(document.getElementById('widthInput').value);
    if (isNaN(newWidth) || origMinX === null || origMaxX === null) return;

    const currentWidth = origMaxX - origMinX;
    const factorX = newWidth / currentWidth;

    const keepRatio = document.getElementById('keepAspectRatio').checked;
    if (keepRatio && origMinY !== null && origMaxY !== null) {
        const currentHeight = origMaxY - origMinY;
        const newHeight = currentHeight * factorX;               // gleiche Skalierung wie X
        const factorY = newHeight / currentHeight;
        transformGcode(
            v => (v - origMinX) * factorX + origMinX,
            v => (v - origMinY) * factorY + origMinY
        );
        // UI‑Konsistenz
        document.getElementById('heightInput').value = (origMinY + newHeight).toFixed(3);
    } else {
        transformGcode(v => (v - origMinX) * factorX + origMinX, v => v);
    }
}
function onHeightChange() {
    const newHeight = parseFloat(document.getElementById('heightInput').value);
    if (isNaN(newHeight) || origMinY === null || origMaxY === null) return;

    const currentHeight = origMaxY - origMinY;
    const factorY = newHeight / currentHeight;

    const keepRatio = document.getElementById('keepAspectRatio').checked;
    if (keepRatio && origMinX !== null && origMaxX !== null) {
        const currentWidth = origMaxX - origMinX;
        const newWidth = currentWidth * factorY;                 // gleiche Skalierung wie Y
        const factorX = newWidth / currentWidth;
        transformGcode(
            v => (v - origMinX) * factorX + origMinX,
            v => (v - origMinY) * factorY + origMinY
        );
        // UI‑Konsistenz
        document.getElementById('widthInput').value = (origMinX + newWidth).toFixed(3);
    } else {
        transformGcode(v => v, v => (v - origMinY) * factorY + origMinY);
    }
}

/* ------------------------------------------------------------
   Canvas‑Visualisierung
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

    const { minX, minY, maxX, maxY } = getCurrentExtremes(text);
    const padding = 20;
    const scaleX = (canvas.width  - 2 * padding) / ((maxX - minX) || 1);
    const scaleY = (canvas.height - 2 * padding) / ((maxY - minY) || 1);
    const scale  = Math.min(scaleX, scaleY);

    // Startpunkt (erstes Koordinaten‑Paar) – roter Kreis
    let curX = padding + (minX !== null ? (minX - minX) * scale : 0);
    let curY = canvas.height - padding - (minY !== null ? (minY - minY) * scale : 0);
    let isFirstSegment = true;
    const coordRegex = /[XY]([-+]?\d*\.?\d+)/g;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!/^G[01]\s/.test(trimmed)) return;

        let newX = curX, newY = curY;
        let match;
        while ((match = coordRegex.exec(trimmed)) !== null) {
            const axis = match[0][0];
            const val  = parseFloat(match[1]);
            if (axis === 'X') newX = padding + (val - minX) * scale;
            if (axis === 'Y') newY = canvas.height - padding - (val - minY) * scale;
        }

        // Markiere den Startpunkt des allerersten Segments
        if (isFirstSegment) {
            ctx.beginPath();
            ctx.arc(curX, curY, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#ff0000';
            ctx.fill();
            isFirstSegment = false;
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
    visualizeGcode();            // sofort visualisieren
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
   Eingabefelder – gekoppelte Aktualisierung
   ------------------------------------------------------------ */
document.getElementById('widthInput').addEventListener('change', onWidthChange);
document.getElementById('heightInput').addEventListener('change', onHeightChange);
document.getElementById('minXInput').addEventListener('change', onMinXChange);
document.getElementById('minYInput').addEventListener('change', onMinYChange);
document.getElementById('keepAspectRatio').addEventListener('change', () => {
    // Der aktuelle Zustand wird bei der nächsten Breite‑/Höhe‑Änderung berücksichtigt.
});

/* ------------------------------------------------------------
   Textarea – Sichtbarkeit der Buttons & automatische Visualisierung
   ------------------------------------------------------------ */
function handleTextareaInput() {
    const txt = document.getElementById('myTextarea').value.trim();

    const convertBtn = document.getElementById('convertBtn');
    const copyBtn    = document.getElementById('copyBtn');

    if (txt) {
        convertBtn.classList.remove('hidden');
        copyBtn.classList.remove('hidden');

        // Setze das aktuelle G‑Code‑Backup und aktualisiere Metriken
        originalGcode = txt;
        refreshOriginalMetrics();

        // Automatisch visualisieren
        visualizeGcode();
    } else {
        convertBtn.classList.add('hidden');
        copyBtn.classList.add('hidden');

        // Canvas leeren
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
    // Beim Start ist die Textarea leer → Buttons bleiben hidden
    handleTextareaInput();
});

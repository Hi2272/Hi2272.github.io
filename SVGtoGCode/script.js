/* ---------------------------------------------------------------
   Hilfsfunktion: Wandelt Gerber‑Koordinaten (Zoll‑Format) in
   Millimeter um.
   --------------------------------------------------------------- */
function parseGerberCoordToMM(coord) {
    const intPart = coord.slice(0, 2);
    const decPart = coord.slice(2);
    const inches = parseFloat(intPart + '.' + decPart);
    return inches * 25.4;               // 1 inch = 25.4 mm
}

/**
 * Liest die Tool‑Definitionen aus dem Drill‑Text und erzeugt ein
 * **Array** mit den zugewiesenen Durchmessern. Die Reihenfolge des
 * Arrays entspricht exakt der Reihenfolge, in der die Werkzeuge
 * im Zwischentext (T0, T1, …) auftauchen.
 *
 *   1\. kleinster Durchmesser   → 0.8 mm
 *   2\. zweiter Durchmesser    → 1.0 mm
 *   3\. dritter Durchmesser    → 1.2 mm
 *   4\. vierter und alle weiteren → 3.0 mm
 *
 * @param {string} drillText – Rohtext aus der Drill‑Textbox.
 * @returns {number[]} Array mit den Durchmessern für T0, T1, T2, …
 */
function parseToolDefinitions(drillText) {
    // 1. Alle eindeutigen Werkzeug‑IDs ermitteln (z. B. "10", "20")
    const toolSet = new Set();
    const lines = drillText.split('\n');

    lines.forEach(line => {
        const m = line.trim().match(/^T(\d+)/);   // nur die Tool‑Nummer
        if (m) toolSet.add(m[1]);
    });

    // 2. Werkzeuge in der Reihenfolge ihres ersten Auftretens sortieren
    const sortedTools = Array.from(toolSet);

    // 3. Festgelegte Durchmesser zuweisen
    const fixedValues = [0.8, 1.0, 1.2]; // für die ersten drei Werkzeuge
    const diameters = sortedTools.map((_, idx) =>
        idx < fixedValues.length ? fixedValues[idx] : 3.0
    );

    return diameters; // Index = T‑Nummer
}

/* ---------------------------------------------------------------
   Extrahiert aus der Drill‑Datei alle Bohrungen und gruppiert sie
   nach Werkzeug (Tool‑Nummer). Jede Bohrung wird als {x,y,tool}
   gespeichert (x/y bereits in mm).
   --------------------------------------------------------------- */
function extractHolesByTool(drillText) {
    const blocks = {};                 // tool → [{x,y}]
    const lines = drillText.split('\n');
    let currentTool = null;

    lines.forEach(line => {
        line = line.trim();

        // Werkzeugwechsel merken
        const toolMatch = line.match(/^T(\d+)/);
        if (toolMatch) {
            currentTool = toolMatch[1];
            if (!blocks[currentTool]) blocks[currentTool] = [];
            return;
        }

        // Koordinatenzeile (X…Y…) – nur wenn ein Werkzeug aktiv ist
        if (/^X\d+Y\d+/.test(line) && currentTool) {
            const xMatch = line.match(/X(\d+)/);
            const yMatch = line.match(/Y(\d+)/);
            if (xMatch && yMatch) {
                const xMM = parseGerberCoordToMM(xMatch[1]);
                const yMM = parseGerberCoordToMM(yMatch[1]);
                blocks[currentTool].push({ x: xMM, y: yMM });
            }
        }
    });
    return blocks;
}

/* ---------------------------------------------------------------
   Sortiert die Bohrungen innerhalb jedes Werkzeugs zuerst nach x,
   dann nach y (aufsteigend).
   --------------------------------------------------------------- */
function sortBlocks(blocks) {
    Object.values(blocks).forEach(arr => {
        arr.sort((a, b) => (a.x !== b.x) ? a.x - b.x : a.y - b.y);
    });
}

/* ---------------------------------------------------------------
   Spiegelt die Y‑Koordinate (für das Bohren von unten nach oben).
   Die Spiegelung erfolgt **nach** dem Sortieren, weil die Sortierung
   nach dem Spiegeln sinnvoller ist (negative Werte würden das
   Ergebnis verfälschen). Die Funktion ändert die übergebenen Objekte
   in‑Place.
   --------------------------------------------------------------- */
function mirrorY(blocks) {
    Object.values(blocks).forEach(arr => {
        arr.forEach(p => {
            p.y = -p.y;               // Spiegelung an der X‑Achse
            p.y = 70 + p.y;
        });
    });
}

/**
 * Erzeugt den Zwischentext, der in die mittlere Textarea geschrieben
 * wird. Werkzeuge ohne Koordinaten werden **nicht** ausgegeben.
 *
 * @param {Object} blocks    – { toolKey: [{x,y}, …], … }
 * @param {number[]} diameters – Durchmesser‑Array, Index = T‑Nummer
 * @returns {string} Der formatierte Zwischentext.
 */
function generateIntermediateText(blocks, diameters) {
    let txt = '';
    const sortedToolKeys = Object.keys(blocks).sort((a, b) => a - b); // numerisch

    sortedToolKeys.forEach((origKey, idx) => {
        const points = blocks[origKey];
        if (!points || points.length === 0) return; // kein Werkzeug‑Eintrag ohne Punkte

        const toolNumber = idx;                     // T0, T1, T2, …
        const dia = (diameters[idx] !== undefined) ? diameters[idx].toFixed(3) : '3.000';

        txt += `T${toolNumber} D=${dia} mm\n`;
        points.forEach(p => {
            txt += `x: ${p.x.toFixed(3)} mm, y: ${p.y.toFixed(3)} mm\n`;
        });
        txt += '\n';
    });

    return txt.trim();
}

/* ---------------------------------------------------------------
   Extrahiert Bohrungen aus dem Zwischentext (oder aus beliebigem
   Text, das das Muster „x: … mm, y: … mm“ enthält). Zusätzlich wird
   die aktuelle Werkzeug‑Nummer (T‑Index) gespeichert, damit Farbe
   und Nummerierung später verwendet werden können.
   --------------------------------------------------------------- */
function extractHolesFromIntermediate(text) {
    const holes = [];
    const lines = text.split('\n');
    let currentTool = null;   // T‑Index (0,1,2,…)

    lines.forEach(line => {
        // Werkzeug‑Zeile (z. B. "T0 D=0.800 mm")
        const toolMatch = line.match(/^T(\d+)\s+D=([\d.]+)\s*mm/i);
        if (toolMatch) {
            currentTool = parseInt(toolMatch[1], 10);
            return;
        }

        // Koordinaten‑Zeile
        const coordMatch = line.match(/x:\s*([\d.]+)\s*mm,\s*y:\s*([\d.]+)\s*mm/i);
        if (coordMatch && currentTool !== null) {
            holes.push({
                x: parseFloat(coordMatch[1]),
                y: parseFloat(coordMatch[2]),
                tool: currentTool               // wichtig für Farbe
            });
        }
    });
    return holes;
}

/* ---------------------------------------------------------------
   Hilfsfunktion: liefert eine feste Farbe für einen Werkzeug‑Index.
   --------------------------------------------------------------- */
function getColorForTool(tool) {
    const palette = ['#0066cc', '#ff6600', '#009900', '#cc00cc', '#ff0000', '#00cccc'];
    const idx = Math.abs(parseInt(tool, 10)) % palette.length;
    return palette[idx];
}

/* ---------------------------------------------------------------
   Zeichnet die Bohrungen auf das Canvas. Die Farbe wird anhand der
   Werkzeug‑Nummer (T‑Index) bestimmt.
   --------------------------------------------------------------- */
function drawHolesOnCanvas(holes) {
    const canvas = document.getElementById('holeCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ---------- Oberer Teil ----------
    const upperHeight = canvas.height / 2;
    const marginUpper = 20;

    const maxX = Math.max(...holes.map(h => h.x));
    const maxY = Math.max(...holes.map(h => Math.abs(h.y)));

    const scaleXUpper = (canvas.width - 2 * marginUpper) / maxX;
    const scaleYUpper = (upperHeight - 2 * marginUpper) / maxY;
    const scaleUpper = Math.min(scaleXUpper, scaleYUpper);

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth   = 1;

    let prevUpper = { x: 0, y: 0 };
    holes.forEach((h, idx) => {
        const cx = marginUpper + h.x * scaleUpper;
        const cy = upperHeight - (marginUpper + Math.abs(h.y) * scaleUpper);

        // Weglinie
        ctx.beginPath();
        ctx.moveTo(
            marginUpper + prevUpper.x * scaleUpper,
            upperHeight - (marginUpper + Math.abs(prevUpper.y) * scaleUpper)
        );
        ctx.lineTo(cx, cy);
        ctx.stroke();

        // Farbe nach Werkzeug‑Nummer
        const col = (typeof h.tool !== 'undefined') ? getColorForTool(h.tool) : '#0066cc';
        ctx.strokeStyle = col;

        // Nummer (farbig)
        ctx.font = '12px Arial';
        ctx.fillStyle = col;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((idx + 1).toString(), cx, cy);

        prevUpper = h;
        ctx.strokeStyle = '#ffcc00';
        ctx.setLineDash([5, 5]);
    });

    // ---------- Unterer Teil ----------
    const lowerY0   = upperHeight;
    const lowerHeight = canvas.height - upperHeight;
    const marginLower = 20;

    const euroWidthMM  = 100;
    const euroHeightMM = 70;

    const scaleXLower = (canvas.width - 2 * marginLower) / euroWidthMM;
    const scaleYLower = (lowerHeight - 2 * marginLower) / euroHeightMM;
    const scaleLower = Math.min(scaleXLower, scaleYLower);

    // Rechteck (Euro‑Platine)
    ctx.save();
    ctx.strokeStyle = '#777777';
    ctx.lineWidth   = 1;
    ctx.setLineDash([]);
    const rectX = marginLower;
    const rectY = lowerY0 + marginLower;
    const rectW = euroWidthMM * scaleLower;
    const rectH = euroHeightMM * scaleLower;
    ctx.strokeRect(rectX, rectY, rectW, rectH);
    ctx.restore();

    // Bohrungen (kleiner dargestellt)
    let prevLower = { x: 0, y: 0 };
    holes.forEach((h, idx) => {
        const cx = marginLower + h.x * scaleLower;
        const cy = lowerY0 + marginLower + euroHeightMM * scaleLower - Math.abs(h.y) * scaleLower;

        // Weglinie
        ctx.beginPath();
        ctx.moveTo(
            marginLower + prevLower.x * scaleLower,
            lowerY0 + marginLower + euroHeightMM * scaleLower - Math.abs(prevLower.y) * scaleLower
        );
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = '#ffcc00';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.stroke();

        // Kreis (Farbe nach Werkzeug‑Nummer)
        const col = (typeof h.tool !== 'undefined') ? getColorForTool(h.tool) : '#0066cc';
        ctx.strokeStyle = col;
        ctx.setLineDash([]);

        const radiusPx = 0.508 * scaleLower; // 0.508 mm = 0.020 inch (Standard‑Bohrung)
        ctx.beginPath();
        ctx.arc(cx, cy, radiusPx, 0, 2 * Math.PI);
        ctx.stroke();

        // Nummer (farbig)
        ctx.font = '12px Arial';
        ctx.fillStyle = col;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((idx + 1).toString(), cx, cy);

        prevLower = h;
    });
}

/* ---------------------------------------------------------------
   Hilfsfunktion: erzeugt einen Download‑Link und löst den Klick aus.
   --------------------------------------------------------------- */
function triggerDownload(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/* ---------------------------------------------------------------
   Globale Variablen – werden zwischen den Event‑Handlern ausgetauscht.
   --------------------------------------------------------------- */
let lastToolMap = [];   // Array mit Durchmessern für T0, T1, …
let lastBlocks   = {};  // Bohrungen gruppiert nach ursprünglichem Werkzeug

/* ---------------------------------------------------------------
   1️⃣  „Umwandeln“ – erzeugt den Zwischentext, spiegelt Y,
        füllt die mittlere Textarea und zeichnet.
   --------------------------------------------------------------- */
document.getElementById('convertBtn').addEventListener('click', () => {
    const drillTxt = document.getElementById('drillTxt').value;

    // 1. Durchmesser‑Array erzeugen (T0, T1, …)
    lastToolMap = parseToolDefinitions(drillTxt);

    // 2. Bohrungen nach Werkzeug gruppieren
    const blocks = extractHolesByTool(drillTxt);

    // 3. Sortieren (nach x, dann y) innerhalb jedes Werkzeugs
    sortBlocks(blocks);

    // 4. Spiegeln – Y‑Koordinate invertieren (Bohren von unten nach oben)
    mirrorY(blocks);

    // 5. Zwischentext erzeugen und in die mittlere Textarea schreiben
    const intermediate = generateIntermediateText(blocks, lastToolMap);
    document.getElementById('gcodeTxt').value = intermediate;

    // Merken für späteres „Getrennt Speichern“
    lastBlocks = blocks;

    // Zeichnen
    const holes = extractHolesFromIntermediate(intermediate);
    drawHolesOnCanvas(holes);
});

/* ---------------------------------------------------------------
   Kopieren‑Button – kopiert den aktuellen Inhalt von gcodeTxt
   in die Zwischenablage.
   --------------------------------------------------------------- */
document.getElementById('copyBtn').addEventListener('click', () => {
    const textarea = document.getElementById('gcodeTxt');
    textarea.select();
    document.execCommand('copy');
    alert('Inhalt von gcodeTxt wurde in die Zwischenablage kopiert.');
});

/* ---------------------------------------------------------------
   Shift‑X / Shift‑Y – verschieben die Koordinaten in der
   gcodeTxt‑Textarea und aktualisieren das Canvas.
   --------------------------------------------------------------- */
document.getElementById('shiftX').addEventListener('change', () => {
    const shift = parseInt(document.getElementById('shiftX').value, 10) || 0;
    const txt = document.getElementById('gcodeTxt').value;

    const newLines = txt.split('\n').map(line => {
        const coordMatch = line.match(/(x:\s*)(-?[\d.]+)(\s*mm,\s*y:\s*[-\d.]+\s*mm)/i);
        if (coordMatch) {
            const newX = (parseFloat(coordMatch[2]) + shift).toFixed(3);
            return `${coordMatch[1]}${newX}${coordMatch[3]}`;
        }
        return line;
    });

    const newIntermediate = newLines.join('\n');
    document.getElementById('gcodeTxt').value = newIntermediate;
    drawHolesOnCanvas(extractHolesFromIntermediate(newIntermediate));
    document.getElementById('shiftX').value = '';
});

document.getElementById('shiftY').addEventListener('change', () => {
    const shift = parseInt(document.getElementById('shiftY').value, 10) || 0;
    const txt = document.getElementById('gcodeTxt').value;

    const newLines = txt.split('\n').map(line => {
        const coordMatch = line.match(/(x:\s*[-\d.]+\s*mm,\s*y:\s*)(-?[\d.]+)(\s*mm)/i);
        if (coordMatch) {
            const newY = (parseFloat(coordMatch[2]) + shift).toFixed(3);
            return `${coordMatch[1]}${newY}${coordMatch[3]}`;
        }
        return line;
    });

    const newIntermediate = newLines.join('\n');
    document.getElementById('gcodeTxt').value = newIntermediate;
    drawHolesOnCanvas(extractHolesFromIntermediate(newIntermediate));
    document.getElementById('shiftY').value = '';
});

/* ---------------------------------------------------------------
   Direkte Änderungen in der mittleren Textarea sollen sofort
   neu zeichnen.
   --------------------------------------------------------------- */
document.getElementById('gcodeTxt').addEventListener('input', () => {
    const txt = document.getElementById('gcodeTxt').value;
    const holes = extractHolesFromIntermediate(txt);
    drawHolesOnCanvas(holes);
});

/* ---------------------------------------------------------------
   4️⃣  „Getrennt Speichern“ – erzeugt eine eigene G‑Code‑Datei pro
        Durchmesser‑Block.
   --------------------------------------------------------------- */
document.getElementById('saveSeparateBtn').addEventListener('click', () => {
    const txt = document.getElementById('gcodeTxt').value;
    if (!txt.trim()) return;

    // Zwischentext in einzelne Blöcke parsen
    const lines = txt.split('\n');
    const blocks = [];               // [{tool, dia, coords: [{x,y}]}]
    let currentBlock = null;

    lines.forEach(raw => {
        const line = raw.trim();

        // Werkzeug‑Zeile
        const toolMatch = line.match(/^T(\d+)\s+D=([\d.]+)\s*mm/i);
        if (toolMatch) {
            if (currentBlock) blocks.push(currentBlock);
            currentBlock = {
                tool: toolMatch[1],
                dia: parseFloat(toolMatch[2]),
                coords: []
            };
            return;
        }

        // Koordinaten‑Zeile
        const coordMatch = line.match(/x:\s*([\d.]+)\s*mm,\s*y:\s*([\d.]+)\s*mm/i);
        if (coordMatch && currentBlock) {
            currentBlock.coords.push({
                x: parseFloat(coordMatch[1]),
                y: parseFloat(coordMatch[2])
            });
        }
    });
    if (currentBlock) blocks.push(currentBlock);

    const header = [
        'G21 ; set units to millimetres',
        'G90 ; absolute positioning',
        'G94 ; feed per minute',
        'M03 S2000 ; start spindle at 2000 rpm'
    ].join('\n');

    const footer = [
        'M05 ; stop spindle',
        'G00 X0 Y0 F300',
        'G01 Z7 F100',
        'M30 ; program end'
    ].join('\n');

    const baseName = prompt('Dateinamen (ohne Endung) für die Export‑Dateien:', 'Export');
    if (!baseName) return;

    blocks.forEach(block => {
        const out = [header];
        block.coords.forEach(p => {
            const x = p.x.toFixed(3);
            const y = p.y.toFixed(3);
            out.push(`G00 X${x} Y${y} F300`);
            out.push('G01 Z-2 F100');
            out.push('G01 Z0 F100');
            out.push('G01 Z2 F100');
        });
        out.push(footer);
        const diaStr = block.dia.toString().replace('.', '_');
        const filename = `${baseName}_D${diaStr}.gcode`;
        triggerDownload(filename, out.join('\n'));
    });
});

/* ---------------------------------------------------------------
   Initiales Zeichnen (falls bereits Text im linken Feld steht)
   --------------------------------------------------------------- */
window.addEventListener('load', () => {
    const drillTxt = document.getElementById('drillTxt').value;
    if (!drillTxt) return;

    lastToolMap = parseToolDefinitions(drillTxt);
    const blocks = extractHolesByTool(drillTxt);
    sortBlocks(blocks);
    mirrorY(blocks);
    lastBlocks = blocks;

    const intermediate = generateIntermediateText(blocks, lastToolMap);
    document.getElementById('gcodeTxt').value = intermediate;
    drawHolesOnCanvas(extractHolesFromIntermediate(intermediate));
});

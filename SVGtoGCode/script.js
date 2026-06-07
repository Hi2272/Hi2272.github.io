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

/* ---------------------------------------------------------------
   Liest die Tool‑Definitionen (TxxxCyyy) und liefert ein Mapping:
   tool‑Nummer → Durchmesser in Millimeter.
   --------------------------------------------------------------- */
function parseToolDefinitions(drillText) {
    const map = {};
    const lines = drillText.split('\n');

    lines.forEach(line => {
        line = line.trim();
        const m = line.match(/^T(\d+)C([\d.]+)/);   // z. B. T10C0.020000
        if (m) {
            const tool = m[1];
            const inchDia = parseFloat(m[2]);       // in inches
            const mmDia = inchDia * 25.4;
            map[tool] = parseFloat(mmDia.toFixed(3));
        }
    });
    return map;
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
        arr.sort((a, b) => {
            if (a.x !== b.x) return a.x - b.x;
            return a.y - b.y;
        });
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

/* ---------------------------------------------------------------
   Erzeugt den Zwischentext, der in die mittlere Textarea geschrieben
   wird. Format:

   T10 D=0.508 mm
   x: 12.345 mm, y: -6.789 mm
   ...

   Die Reihenfolge entspricht exakt der späteren Nummerierung im
   Canvas.
   --------------------------------------------------------------- */
function generateIntermediateText(blocks, toolMap) {
    let txt = '';
    const sortedTools = Object.keys(blocks).sort((a, b) => a - b); // numerisch

    sortedTools.forEach(tool => {
        const dia = toolMap[tool] ? toolMap[tool].toFixed(3) : '???';
        txt += `T${tool} D=${dia} mm\n`;
        blocks[tool].forEach(p => {
            txt += `x: ${p.x.toFixed(3)} mm, y: ${p.y.toFixed(3)} mm\n`;
        });
        txt += '\n';
    });
    return txt.trim();
}

/* ---------------------------------------------------------------
   Extrahiert Bohrungen aus dem Zwischentext (oder aus beliebigem
   Text, das das Muster „x: … mm, y: … mm“ enthält). Zusätzlich wird
   der aktuelle Durchmesser (aus der vorherigen T‑Zeile) gespeichert,
   damit wir die Farbe und die Nummerierung später nutzen können.
   --------------------------------------------------------------- */
function extractHolesFromIntermediate(text) {
    const holes = [];
    const lines = text.split('\n');
    let currentDia = null;   // Durchmesser des zuletzt gelesenen Werkzeugs

    lines.forEach(line => {
        // Werkzeug‑Zeile (z. B. "T10 D=0.508 mm")
        const toolMatch = line.match(/^T(\d+)\s+D=([\d.]+)\s*mm/i);
        if (toolMatch) {
            currentDia = parseFloat(toolMatch[2]);   // Durchmesser in mm
            return;
        }

        // Koordinaten‑Zeile
        const coordMatch = line.match(/x:\s*([\d.]+)\s*mm,\s*y:\s*([\d.]+)\s*mm/i);
        if (coordMatch) {
            const x = parseFloat(coordMatch[1]);
            const y = parseFloat(coordMatch[2]);
            holes.push({ x, y, dia: currentDia });
        }
    });
    return holes;
}

/* ---------------------------------------------------------------
   Erzeugt **echten** G‑Code aus dem Zwischentext. Für jedes Werkzeug
   wird ein Block erzeugt:

   T10 M6
   G00 X… Y…
   G01 Z-2
   G01 Z0
   G01 Z2
   ...

   Am Ende wird der Footer angehängt.
   --------------------------------------------------------------- */
function generateFinalGCodeFromIntermediate(text) {
    const lines = text.split('\n');
    const header = [
        'G21 ; set units to millimetres',
        'G90 ; absolute positioning',
        'G94 ; feed per minute',
        'F300 ; feed rate 300 mm/min',
        'M03 S2000 ; start spindle at 2000 rpm'
    ].join('\n');

    const footer = [
        'G00 X0 Y0',
        'G01 Z7',
        'M05 ; stop spindle',
        'M30 ; program end'
    ].join('\n');

    const result = [header];
    let currentTool = null;

    lines.forEach(raw => {
        const line = raw.trim();

        // Werkzeug‑Zeile
        const toolMatch = line.match(/^T(\d+)\s+D=([\d.]+)\s*mm/i);
        if (toolMatch) {
            currentTool = toolMatch[1];
            return;
        }

        // Koordinaten‑Zeile
        const coordMatch = line.match(/x:\s*([\d.]+)\s*mm,\s*y:\s*([\d.]+)\s*mm/i);
        if (coordMatch && currentTool) {
            const x = parseFloat(coordMatch[1]).toFixed(3);
            const y = parseFloat(coordMatch[2]).toFixed(3);
            result.push(`G00 X${x} Y${y} F300`);
            result.push('G01 Z-2 F100');
            result.push('G01 Z0 F100');
            result.push('G01 Z2 F300'); }
    });

    result.push(footer);
    return result.join('\n');
}

/* ---------------------------------------------------------------
   Hilfsfunktion: liefert eine feste Farbe für einen Durchmesser.
   --------------------------------------------------------------- */
function getColorForDiameter(dia) {
    const palette = ['#0066cc', '#ff6600', '#009900', '#cc00cc', '#ff0000', '#00cccc'];
    const idx = Math.abs(Math.round(dia * 10)) % palette.length;
    return palette[idx];
}

/* ---------------------------------------------------------------
   Zeichnet die Bohrungen auf das Canvas. Die Reihenfolge des
   übergebenen `holes`‑Arrays bestimmt die angezeigten Nummern,
   sodass sie exakt den Zeilennummern in der mittleren Textarea
   entsprechen. Die Zahlen und die Kreise erhalten die Farbe,
   die dem jeweiligen Bohrungsdurchmesser zugeordnet ist.
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

    // Für die Skalierung benötigen wir den maximalen Betrag von Y,
    // weil Y nach dem Spiegeln negativ sein kann.
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
        // Y‑Achse im Canvas wächst nach unten → wir invertieren das
        const cy = upperHeight - (marginUpper + Math.abs(h.y) * scaleUpper);

        // Weglinie
        ctx.beginPath();
        ctx.moveTo(
            marginUpper + prevUpper.x * scaleUpper,
            upperHeight - (marginUpper + Math.abs(prevUpper.y) * scaleUpper)
        );
        ctx.lineTo(cx, cy);
        ctx.stroke();

        // Farbe nach Durchmesser (falls vorhanden)
        const col = h.dia ? getColorForDiameter(h.dia) : '#0066cc';
        ctx.strokeStyle = col;
        ctx.setLineDash([]);

    
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

    const euroWidthMM  = 160;
    const euroHeightMM = 100;

    const scaleXLower = (canvas.width - 2 * marginLower) / euroWidthMM;
    const scaleYLower = (lowerHeight - 2 * marginLower) / euroHeightMM;
    const scaleLower = Math.min(scaleXLower, scaleYLower);

    // Rechteck
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

    // Bohrungen verkleinert
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

        // Kreis (Farbe nach Durchmesser)
        const col = h.dia ? getColorForDiameter(h.dia) : '#0066cc';
        ctx.strokeStyle = col;
        ctx.setLineDash([]);

        const radiusPx = 0.508 * scaleLower;
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
let lastToolMap = {};   // tool → Durchmesser (mm)
let lastBlocks   = {};  // Bohrungen gruppiert nach Werkzeug (nach Sortierung)

/* ---------------------------------------------------------------
   1️⃣  „Umwandeln“ (Konvertieren) – erzeugt den Zwischentext,
        spiegelt die Y‑Koordinate, füllt die mittlere Textarea und
        **zeichnet nicht** sofort (Zeichnen erfolgt über
        „Neu Zeichnen“ oder über das automatische Listener‑Verhalten).
   --------------------------------------------------------------- */
document.getElementById('convertBtn').addEventListener('click', () => {
    const drillTxt = document.getElementById('drillTxt').value;

    // 1. Mapping tool → Durchmesser
    lastToolMap = parseToolDefinitions(drillTxt);

    // 2. Bohrungen nach Werkzeug gruppieren
    const blocks = extractHolesByTool(drillTxt);

    // 3. Sortieren (nach x, dann y) innerhalb jedes Werkzeugs
    sortBlocks(blocks);

    // 4. **Spiegeln** – Y‑Koordinate invertieren (Bohren von unten nach oben)
    mirrorY(blocks);

    // 5. Zwischentext erzeugen und in die mittlere Textarea schreiben
    const intermediate = generateIntermediateText(blocks, lastToolMap);
    document.getElementById('gcodeTxt').value = intermediate;

    // Merken für späteres „Getrennt Speichern“
    lastBlocks = blocks;
    
    // Zeichnen
    const listText = document.getElementById('gcodeTxt').value;
    const holes = extractHolesFromIntermediate(listText);
    drawHolesOnCanvas(holes);


});

/* ---------------------------------------------------------------
   2️⃣  „Neu Zeichnen“ (ehemals Kopieren) – liest die aktuelle Liste
        aus der mittleren Textarea, extrahiert die Koordinaten (inkl.
        Durchmesser) und zeichnet das Bild neu. Die Nummerierung entspricht
        exakt den Zeilennummern in der Textarea.
   --------------------------------------------------------------- */
const copyBtn = document.getElementById('copyBtn');
copyBtn.textContent = 'Neu Zeichnen';
copyBtn.addEventListener('click', () => {
    const listText = document.getElementById('gcodeTxt').value;
    const holes = extractHolesFromIntermediate(listText);
    drawHolesOnCanvas(holes);
});

/* ---------------------------------------------------------------
   3️⃣  Änderungen in der mittleren Textarea (direktes Editieren)
        sollen sofort neu zeichnen. Wir unterstützen beide Formate:
        – das neue „x: … mm, y: … mm“-Format
        – das alte „G00 X… Y…“-Format (Fallback).
   --------------------------------------------------------------- */
document.getElementById('gcodeTxt').addEventListener('input', () => {
    const txt = document.getElementById('gcodeTxt').value;

    let holes = [];
    if (/x:\s*[\d.]+\s*mm,\s*y:\s*[\d.]+\s*mm/i.test(txt)) {
        holes = extractHolesFromIntermediate(txt);
    } else if (/G00\s+X/i.test(txt)) {
        // Fallback: alte G‑Code‑Zeilen
        const lines = txt.split('\n');
        lines.forEach(line => {
            const m = line.match(/G00\s+X([\d.]+)\s+Y([\d.]+)/i);
            if (m) holes.push({ x: parseFloat(m[1]), y: parseFloat(m[2]), dia: null });
        });
    }
    drawHolesOnCanvas(holes);
});

/* ---------------------------------------------------------------
   4️⃣  „Getrennt Speichern“ – erzeugt **eine eigene G‑Code‑Datei pro
        Durchmesser‑Block**. Der Dateiname erhält den Durchmesser als
        Zusatz (z. B. `Export_D0_508.gcode`). Die Reihenfolge der Blöcke
        entspricht ihrer Position im Zwischentext (also der Reihenfolge
        in der mittleren Textarea).
   --------------------------------------------------------------- */
document.getElementById('saveSeparateBtn').addEventListener('click', () => {
    const txt = document.getElementById('gcodeTxt').value;
    if (!txt.trim()) return;

    // Parse Zwischentext in einzelne Blöcke (Werkzeug‑Zeile + Koordinaten)
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
    if (currentBlock) blocks.push(currentBlock); // letzten Block hinzufügen

    // Header & Footer (identisch für alle Dateien)
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

    // Für jedes Block‑File erzeugen
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
        const content = out.join('\n');

        // Dateinamen mit Durchmesser‑Zusatz (Komma → Unterstrich)
        const diaStr = block.dia.toString().replace('.', '_');
        const filename = `${baseName}_D${diaStr}.gcode`;
        triggerDownload(filename, content);
    });
});

/* ---------------------------------------------------------------
   Initiales Zeichnen (falls bereits Text im linken Feld steht)
   --------------------------------------------------------------- */
window.addEventListener('load', () => {
    const drillTxt = document.getElementById('drillTxt').value;
    if (!drillTxt) return;

    // Vorbereitung – Mapping und Bohrungen gruppieren
    lastToolMap = parseToolDefinitions(drillTxt);
    const blocks = extractHolesByTool(drillTxt);
    sortBlocks(blocks);
    mirrorY(blocks);                     // initial ebenfalls spiegeln
    lastBlocks = blocks;

    // Zwischentext erzeugen und visualisieren
    const intermediate = generateIntermediateText(blocks, lastToolMap);
    document.getElementById('gcodeTxt').value = intermediate;
    const holes = extractHolesFromIntermediate(intermediate);
    drawHolesOnCanvas(holes);
});

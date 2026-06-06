/* ---------------------------------------------------------------
   Hilfsfunktion: Wandelt Gerber‑Koordinaten in Millimeter um
   --------------------------------------------------------------- */
function parseGerberCoordToMM(coord) {
    const intPart = coord.slice(0, 2);
    const decPart = coord.slice(2);
    const inches = parseFloat(intPart + '.' + decPart);
    return inches * 25.4;               // 1 inch = 25.4 mm
}

/* ---------------------------------------------------------------
   Liest die Tool‑Definitionen (TxxxCyyy) und liefert
   ein Mapping: toolNumber → Durchmesser (mm)
   --------------------------------------------------------------- */
function parseToolDefinitions(drillText) {
    const map = {};
    const lines = drillText.split('\n');

    lines.forEach(line => {
        line = line.trim();
        const m = line.match(/^T(\d+)C([\d.]+)/);   // T100C0.040000
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
   Extrahiert Bohrungen (X/Y) aus dem **Drill‑File** (inkl. Tool‑Info)
   --------------------------------------------------------------- */
function extractHoles(drillText) {
    const holes = [];
    const lines = drillText.split('\n');
    let currentTool = null;

    lines.forEach(line => {
        line = line.trim();

        // Werkzeugwechsel merken
        const toolMatch = line.match(/^T(\d+)/);
        if (toolMatch) {
            currentTool = toolMatch[1];
            return;
        }

        // Koordinatenzeile
        if (/^X\d+Y\d+/.test(line) && currentTool) {
            const xMatch = line.match(/X(\d+)/);
            const yMatch = line.match(/Y(\d+)/);
            if (xMatch && yMatch) {
                const xMM = parseGerberCoordToMM(xMatch[1]);
                const yMM = parseGerberCoordToMM(yMatch[1]);
                holes.push({ x: xMM, y: yMM, tool: currentTool });
            }
        }
    });
    return holes;
}

/* ---------------------------------------------------------------
   **NEU** – Extrahiert Bohrungen (X/Y) aus dem **G‑Code**‑Text.
   Der G‑Code enthält Zeilen wie:  G81 X12.345 Y67.890 Z-2.00 …
   --------------------------------------------------------------- */
function extractHolesFromGCode(gcodeText) {
    const holes = [];
    const lines = gcodeText.split('\n');

    lines.forEach(line => {
        const m = line.match(/X([\d.]+)\s+Y([\d.]+)/i);
        if (m) {
            const x = parseFloat(m[1]);   // bereits in mm (G‑Code nutzt mm)
            const y = parseFloat(m[2]);
            holes.push({ x, y, tool: null });   // kein Tool‑Info → Farbe wird default
        }
    });
    return holes;
}

/* ---------------------------------------------------------------
   Konvertierung von Drill‑Datei zu G‑Code (Einheiten mm)
   --------------------------------------------------------------- */
function convertToGCode(drillText) {
    const lines = drillText.split('\n');
    const gcode = [];

    // ---- Header -------------------------------------------------
    gcode.push('G21 ; set units to millimetres');
    gcode.push('G90 ; absolute positioning');
    gcode.push('M03 S2000 ; start spindle at 2000 rpm');

    // Bohrparameter (Tiefe –2 mm)
    const Z = -2.0;
    const R = 2.0;
    const F = 100;

    // ---- Bohrpositionen -----------------------------------------
    lines.forEach(line => {
        line = line.trim();

        // Bohrpositionen (X/Y) verarbeiten
        if (/^X\d+Y\d+/.test(line)) {
            const xMatch = line.match(/X(\d+)/);
            const yMatch = line.match(/Y(\d+)/);
            if (xMatch && yMatch) {
                const xMM = parseGerberCoordToMM(xMatch[1]);
                const yMM = parseGerberCoordToMM(yMatch[1]);
                gcode.push(
                    `G81 X${xMM.toFixed(3)} Y${yMM.toFixed(3)} Z${Z.toFixed(2)} R${R.toFixed(2)} F${F}`
                );
            }
        }
        // Werkzeugwechsel (falls im Gerber‑File angegeben)
        else if (/^T\d+/.test(line)) {
            gcode.push(`T${line.slice(1)} M6`);
        }
    });

    // ---- Footer -------------------------------------------------
    gcode.push('G80 ; cancel drilling cycle');
    gcode.push('M05 ; stop spindle');
    gcode.push('M30 ; program end');

    return gcode.join('\n');
}

/* ---------------------------------------------------------------
   Hilfsfunktion: liefert eine feste Farbe für einen Durchmesser
   --------------------------------------------------------------- */
function getColorForDiameter(dia) {
    const palette = ['#0066cc', '#ff6600', '#009900', '#cc00cc', '#ff0000', '#00cccc'];
    const idx = Math.abs(Math.round(dia * 10)) % palette.length;
    return palette[idx];
}

/* ---------------------------------------------------------------
   Zeichnet die Bohrungen:
   – Oberer Teil: skalieren nach tatsächlichen Max‑Werten
   – Unterer Teil: Euro‑Standard‑Rechteck (0‑160 mm × 0‑100 mm) und
     verkleinerte Bohrungen, um deren relativen Platzbedarf zu zeigen
   --------------------------------------------------------------- */
function drawHolesOnCanvas(holes, toolMap) {
    const canvas = document.getElementById('holeCanvas');
    const ctx = canvas.getContext('2d');

    // Canvas‑Größe an den Container anpassen
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Hintergrund
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // -----------------------------------------------------------
    // 1️⃣  Oberer Teil – skalieren nach tatsächlichen Max‑Werten
    // -----------------------------------------------------------
    const upperHeight = canvas.height / 2;
    const marginUpper = 20;

    const maxX = Math.max(...holes.map(h => h.x));
    const maxY = Math.max(...holes.map(h => h.y));

    const scaleXUpper = (canvas.width - 2 * marginUpper) / maxX;
    const scaleYUpper = (upperHeight - 2 * marginUpper) / maxY;
    const scaleUpper = Math.min(scaleXUpper, scaleYUpper);

    // Werkzeugwege (gelb, gestrichelt) – oberer Teil
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#ffcc00';
    ctx.lineWidth   = 1;

    let prevUpper = { x: 0, y: 0 };
    holes.forEach((h, idx) => {
        const cx = marginUpper + h.x * scaleUpper;
        const cy = upperHeight - (marginUpper + h.y * scaleUpper);

        // Weg vom vorherigen Punkt zum aktuellen Loch
        ctx.beginPath();
        ctx.moveTo(
            marginUpper + prevUpper.x * scaleUpper,
            upperHeight - (marginUpper + prevUpper.y * scaleUpper)
        );
        ctx.lineTo(cx, cy);
        ctx.stroke();

        // Kreisfarbe nach Durchmesser (falls vorhanden)
        const dia = toolMap && h.tool ? toolMap[h.tool] : null;
        ctx.strokeStyle = dia ? getColorForDiameter(dia) : '#0066cc';
        ctx.setLineDash([]);               // Kreis durchgezogen

        const radiusPx = 0.508 * scaleUpper;
        ctx.beginPath();
        ctx.arc(cx, cy, radiusPx, 0, 2 * Math.PI);
        ctx.stroke();

        // Nummerierung
        ctx.font = '12px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((idx + 1).toString(), cx, cy);

        prevUpper = h;
        ctx.strokeStyle = '#ffcc00';
        ctx.setLineDash([5, 5]);
    });

    // -----------------------------------------------------------
    // 2️⃣  Unterer Teil – Euro‑Standard‑Rechteck + verkleinerte Bohrungen
    // -----------------------------------------------------------
    const lowerY0   = upperHeight;
    const lowerHeight = canvas.height - upperHeight;
    const marginLower = 20;

    const euroWidthMM  = 160;
    const euroHeightMM = 100;

    const scaleXLower = (canvas.width - 2 * marginLower) / euroWidthMM;
    const scaleYLower = (lowerHeight - 2 * marginLower) / euroHeightMM;
    const scaleLower = Math.min(scaleXLower, scaleYLower);

    // Rechteck zeichnen
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

    // Bohrungen verkleinert darstellen
    let prevLower = { x: 0, y: 0 };
    holes.forEach((h, idx) => {
        const cx = marginLower + h.x * scaleLower;
        const cy = lowerY0 + marginLower + euroHeightMM * scaleLower - h.y * scaleLower;

        // Werkzeugweg (gelb, gestrichelt) im unteren Bereich
        ctx.beginPath();
        ctx.moveTo(
            marginLower + prevLower.x * scaleLower,
            lowerY0 + marginLower + euroHeightMM * scaleLower - prevLower.y * scaleLower
        );
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = '#ffcc00';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1;
        ctx.stroke();

        // Kreisfarbe
        const dia = toolMap && h.tool ? toolMap[h.tool] : null;
        ctx.strokeStyle = dia ? getColorForDiameter(dia) : '#0066cc';
        ctx.setLineDash([]);

        const radiusPx = 0.508 * scaleLower;
        ctx.beginPath();
        ctx.arc(cx, cy, radiusPx, 0, 2 * Math.PI);
        ctx.stroke();

        // Nummerierung
        ctx.font = '12px Arial';
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((idx + 1).toString(), cx, cy);

        prevLower = h;
    });
}

/* ---------------------------------------------------------------
   Hilfsfunktion: erzeugt einen Download‑Link und klickt ihn
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
   Event‑Handler
   --------------------------------------------------------------- */
document.getElementById('convertBtn').addEventListener('click', () => {
    const drillTxt = document.getElementById('drillTxt').value;
    const gcode = convertToGCode(drillTxt);
    document.getElementById('gcodeTxt').value = gcode;

    const toolMap = parseToolDefinitions(drillTxt);
    const holes   = extractHoles(drillTxt);
    drawHolesOnCanvas(holes, toolMap);
});

/* ---------------------------------------------------------------
   **NEU** – Änderungen im G‑Code‑Textarea führen zu automatischem
   Neuzeichnen. Der G‑Code wird geparst, Bohrungen extrahiert und
   das Canvas neu gerendert.
   --------------------------------------------------------------- */
document.getElementById('gcodeTxt').addEventListener('input', () => {
    const gcode = document.getElementById('gcodeTxt').value;
    const holes = extractHolesFromGCode(gcode);
    // Ohne Tool‑Info verwenden wir ein leeres Mapping → Standardfarbe
    drawHolesOnCanvas(holes, {});
});

/* Kopieren – der gesamte G‑Code wird in die Zwischenablage gelegt */
document.getElementById('copyBtn').addEventListener('click', () => {
    const gcodeArea = document.getElementById('gcodeTxt');
    gcodeArea.select();
    document.execCommand('copy');
    alert('G‑Code wurde in die Zwischenablage kopiert.');
});

/* ---------------------------------------------------------------
   Getrennt Speichern
   --------------------------------------------------------------- */
document.getElementById('saveSeparateBtn').addEventListener('click', () => {
    const drillTxt = document.getElementById('drillTxt').value;
    const baseName = prompt('Bitte Dateinamen (ohne Endung) eingeben:', 'GerberExport');
    if (!baseName) return;

    const toolMap = parseToolDefinitions(drillTxt);

    const header = [
        'G21 ; set units to millimetres',
        'G90 ; absolute positioning',
        'M03 S2000 ; start spindle at 2000 rpm'
    ].join('\n') + '\n';

    const footer = [
        'G80 ; cancel drilling cycle',
        'M05 ; stop spindle',
        'M30 ; program end'
    ].join('\n');

    const Z = -2.0, R = 2.0, F = 100;
    const toolLines = {};

    const lines = drillTxt.split('\n');
    let currentTool = null;

    lines.forEach(line => {
        line = line.trim();

        const toolMatch = line.match(/^T(\d+)/);
        if (toolMatch) {
            currentTool = toolMatch[1];
            if (!toolMap[currentTool]) return;          // unbekannt → ignorieren
            if (!toolLines[currentTool]) toolLines[currentTool] = [];
            return;                                      // T‑Befehl später einmalig einfügen
        }

        if (/^X\d+Y\d+/.test(line) && currentTool && toolMap[currentTool]) {
            const xMatch = line.match(/X(\d+)/);
            const yMatch = line.match(/Y(\d+)/);
            if (xMatch && yMatch) {
                const xMM = parseGerberCoordToMM(xMatch[1]);
                const yMM = parseGerberCoordToMM(yMatch[1]);
                const g81 = `G81 X${xMM.toFixed(3)} Y${yMM.toFixed(3)} Z${Z.toFixed(2)} R${R.toFixed(2)} F${F}`;
                if (!toolLines[currentTool]) toolLines[currentTool] = [];
                toolLines[currentTool].push(g81);
            }
        }
    });

    Object.entries(toolLines).forEach(([tool, g81Lines]) => {
        const diaMM = toolMap[tool];
        if (!diaMM) return;

        const filename = `${baseName}_M${diaMM.toFixed(3)}.gcode`;
        const content = [
            header,
            `T${tool} M6`,
            g81Lines.join('\n'),
            footer
        ].join('\n');

        triggerDownload(filename, content);
    });
});

/* ---------------------------------------------------------------
   Initiales Zeichnen (falls bereits Text im linken Feld steht)
   --------------------------------------------------------------- */
window.addEventListener('load', () => {
    const drillTxt = document.getElementById('drillTxt').value;
    const toolMap = parseToolDefinitions(drillTxt);
    const holes   = extractHoles(drillTxt);
    if (holes.length) drawHolesOnCanvas(holes, toolMap);
});

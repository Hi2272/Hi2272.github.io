/* -------------------------------------------------------------
Bild‑Zerschneider – Version mit Live‑Vorschau beim Ziehen
-------------------------------------------------------------
------------------------------------------------------------- */
const fileInput  = document.getElementById('fileInput');
const convertBtn = document.getElementById('convertBtn');
const canvas     = document.getElementById('canvas');
const ctx        = canvas.getContext('2d');
let img          = new Image();          // geladenes Bild
let imgName      = '';                   // Dateiname ohne Extension
let scale        = 1;                    // Bild → Canvas‑Skalierung
let lines        = [];                   // gespeicherte Linien {type:'h'|'v', pos:number}
let dragging     = null;                 // zum Verschieben vorhandener Linien
let drawState    = null;                 // Startpunkt für neue Linie
let previewLine  = null;                 // temporäre Vorschau‑Linie während des Ziehens
/* ---------- Bild laden ---------- */
fileInput.addEventListener('change', e => {
const file = e.target.files[0];
if (!file) return;
imgName = file.name.replace(/\.[^/.]+$/, '');
const reader = new FileReader();

reader.onload = ev => {
    img.onload = () => {
        const maxDim = 800;
        const ratio  = Math.min(maxDim / img.width, maxDim / img.height, 1);
        canvas.width  = img.width  * ratio;
        canvas.height = img.height * ratio;
        scale = ratio;
        draw();                     // Bild + evtl. Linien zeichnen
        convertBtn.disabled = false;
    };
    img.src = ev.target.result;
};
reader.readAsDataURL(file);

});
/* ---------- Zeichen‑Funktion ----------
Zeichnet das Bild, alle gespeicherten Linien (rot) und ggf. die
aktuelle Vorschau‑Linie (blau). */
function draw() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
// gespeicherte Linien (rot)
ctx.strokeStyle = 'red';
ctx.lineWidth   = 2;
lines.forEach(l => {
    ctx.beginPath();
    if (l.type === 'h') {
        ctx.moveTo(0, l.pos);
        ctx.lineTo(canvas.width, l.pos);
    } else {
        ctx.moveTo(l.pos, 0);
        ctx.lineTo(l.pos, canvas.height);
    }
    ctx.stroke();
});

// Vorschau‑Linie (blau)
if (previewLine) {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    if (previewLine.type === 'h') {
        ctx.moveTo(0, previewLine.pos);
        ctx.lineTo(canvas.width, previewLine.pos);
    } else {
        ctx.moveTo(previewLine.pos, 0);
        ctx.lineTo(previewLine.pos, canvas.height);
    }
    ctx.stroke();
}

}
/* ---------- Maus‑Events ---------- */
/* 1. mousedown – prüfen, ob wir eine vorhandene Linie verschieben
oder mit dem Ziehen einer neuen Linie beginnen. */
canvas.addEventListener('mousedown', e => {
const rect   = canvas.getBoundingClientRect();
const startX = e.clientX - rect.left;
const startY = e.clientY - rect.top;
// Treffer einer bestehenden Linie?
const hitIdx = lines.findIndex(l =>
    (l.type === 'h' && Math.abs(l.pos - startY) < 6) ||
    (l.type === 'v' && Math.abs(l.pos - startX) < 6)
);

if (hitIdx !== -1) {
    // Linie verschieben
    const line = lines[hitIdx];
    dragging = {
        type:   line.type,
        index:  hitIdx,
        offset: line.type === 'h' ? startY - line.pos : startX - line.pos
    };
    return;
}

// Keine vorhandene Linie → neuer Zug‑Zustand
drawState   = { startX, startY };
previewLine = null;   // sicherheitshalber zurücksetzen

});
/* 2. mousemove – entweder Linie verschieben oder Vorschau aktualisieren */
canvas.addEventListener('mousemove', e => {
const rect = canvas.getBoundingClientRect();
const curX = e.clientX - rect.left;
const curY = e.clientY - rect.top;
// Verschieben einer bestehenden Linie
if (dragging) {
    const line = lines[dragging.index];
    if (dragging.type === 'h') {
        line.pos = Math.min(Math.max(curY - dragging.offset, 0), canvas.height);
    } else {
        line.pos = Math.min(Math.max(curX - dragging.offset, 0), canvas.width);
    }
    draw();
    return;
}

// Vorschau für neue Linie
if (drawState) {
    const dx = Math.abs(curX - drawState.startX);
    const dy = Math.abs(curY - drawState.startY);

    if (dx > dy) {
        // horizontale Vorschau‑Linie (volle Breite)
        previewLine = { type: 'h', pos: drawState.startY };
    } else if (dy > dx) {
        // vertikale Vorschau‑Linie (volle Höhe)
        previewLine = { type: 'v', pos: drawState.startX };
    } else {
        previewLine = null; // kein klares Ergebnis yet
    }
    draw();
}

});
/* 3. mouseup – Linie endgültig anlegen oder Verschieben beenden */
canvas.addEventListener('mouseup', e => {
const rect = canvas.getBoundingClientRect();
const endX = e.clientX - rect.left;
const endY = e.clientY - rect.top;
// 3a) Verschieben beenden
if (dragging) {
    dragging = null;
    return;
}

// 3b) Neue Linie finalisieren
if (drawState) {
    const dx = Math.abs(endX - drawState.startX);
    const dy = Math.abs(endY - drawState.startY);

    if (dx > dy) {
        const y = drawState.startY;
        if (!lines.some(l => l.type === 'h' && Math.abs(l.pos - y) < 10)) {
            lines.push({ type: 'h', pos: y });
        }
    } else if (dy > dx) {
        const x = drawState.startX;
        if (!lines.some(l => l.type === 'v' && Math.abs(l.pos - x) < 10)) {
            lines.push({ type: 'v', pos: x });
        }
    }
    drawState   = null;
    previewLine = null;
    draw();
}

});
/* 4. mouseleave – alles abbrechen */
canvas.addEventListener('mouseleave', () => {
dragging   = null;
drawState  = null;
previewLine = null;
draw();
});

convertBtn.addEventListener('click', async () => {
    // ---- 1. Linien vorbereiten (wie bisher) ----
    const hLines = [...new Set(
        lines.filter(l => l.type === 'h')
             .map(l => l.pos)
             .sort((a, b) => a - b)
    )];
    const vLines = [...new Set(
        lines.filter(l => l.type === 'v')
             .map(l => l.pos)
             .sort((a, b) => a - b)
    )];
    hLines.unshift(0); hLines.push(canvas.height);
    vLines.unshift(0); vLines.push(canvas.width);

    // ---- 2. Original‑Canvas (volle Auflösung) ----
    const origCanvas = document.createElement('canvas');
    origCanvas.width  = img.width;
    origCanvas.height = img.height;
    const octx = origCanvas.getContext('2d');
    octx.drawImage(img, 0, 0);

    // ---- 3. ZIP‑Container vorbereiten ----
    const zip = new JSZip();

    // Hilfsfunktion: Blob → ZIP‑Eintrag
    const addBlobToZip = (blob, name) => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => {
                // reader.result ist ein ArrayBuffer → in ZIP einfügen
                zip.file(name, reader.result);
                resolve();
            };
            reader.readAsArrayBuffer(blob);
        });
    };

    // ---- 4. Alle Stücke erzeugen und zum ZIP hinzufügen ----
    const promises = []; // sammelt alle async‑Aufgaben

    for (let row = 0; row < hLines.length - 1; row++) {
        const y0Canvas = hLines[row];
        const y1Canvas = hLines[row + 1];
        const hCanvas  = y1Canvas - y0Canvas;

        const y0Orig = Math.floor(y0Canvas / scale);
        const hOrig  = Math.ceil(hCanvas / scale);
        if (hOrig === 0) continue;

        for (let col = 0; col < vLines.length - 1; col++) {
            const x0Canvas = vLines[col];
            const x1Canvas = vLines[col + 1];
            const wCanvas  = x1Canvas - x0Canvas;

            const x0Orig = Math.floor(x0Canvas / scale);
            const wOrig  = Math.ceil(wCanvas / scale);
            if (wOrig === 0) continue;

            // Canvas für das Teilstück
            const piece = document.createElement('canvas');
            piece.width  = wOrig;
            piece.height = hOrig;
            const pctx = piece.getContext('2d');
            pctx.drawImage(
                origCanvas,
                x0Orig, y0Orig, wOrig, hOrig,
                0, 0, wOrig, hOrig
            );

            // Blob erzeugen → ZIP‑Eintrag
            const fileName = `${imgName}_${row + 1}_${col + 1}.png`;
            const p = new Promise(res => {
                piece.toBlob(blob => {
                    if (blob) addBlobToZip(blob, fileName).then(res);
                    else res(); // falls Blob fehlschlägt, einfach weiter
                }, 'image/png');
            });
            promises.push(p);
        }
    }

    // ---- 5. Warten, bis alle Stücke im ZIP sind ----
    await Promise.all(promises);

    // ---- 6. ZIP erzeugen und herunterladen ----
    zip.generateAsync({ type: 'blob' }).then(zipBlob => {
        const zipUrl = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = zipUrl;
        a.download = `${imgName}_tiles.zip`;
        a.click();
        // Aufräumen
        setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);
    });
});

// Beim Laden der Seite (nach dem DOM‑Content) Listener registrieren
document.addEventListener('DOMContentLoaded', () => {
    const rowsSelect = document.getElementById('rowsSelect');
    const colsSelect = document.getElementById('colsSelect');

    rowsSelect.addEventListener('change', updateGridFromSelects);
    colsSelect.addEventListener('change', updateGridFromSelects);
});


/**
 * Erzeugt ein symmetrisches Raster aus Zeilen‑ und Spalten‑Werten.
 * Überschreibt das globale `lines`‑Array und ruft `draw()` auf.
 */
function updateGridFromSelects() {
    const rows = parseInt(document.getElementById('rowsSelect').value, 10);
    const cols = parseInt(document.getElementById('colsSelect').value, 10);

    // Leeres Linien‑Array, dann neue Linien hinzufügen
    lines = [];

    // Horizontale Linien (Zeilen‑Trennung)
    if (rows > 1) {
        const stepY = canvas.height / rows;
        for (let i = 1; i < rows; i++) {
            lines.push({ type: 'h', pos: Math.round(i * stepY) });
        }
    }

    // Vertikale Linien (Spalten‑Trennung)
    if (cols > 1) {
        const stepX = canvas.width / cols;
        for (let i = 1; i < cols; i++) {
            lines.push({ type: 'v', pos: Math.round(i * stepX) });
        }
    }

    draw(); // Bild + neue Linien neu rendern
}

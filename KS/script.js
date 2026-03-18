/* -------------------------------------------------------------
   Hilfsfunktionen
------------------------------------------------------------- */
function canvasToBlob(canvas) {
    return new Promise(resolve => canvas.toBlob(b => resolve(b), 'image/png'));
}

/* Kopieren‑Button (einmalig erzeugen) */
function createCopyButton() {
    const btn = document.createElement('button');
    btn.id = 'copyButton';
    btn.textContent = 'Kopieren';
    btn.addEventListener('click', async () => {
        const canvas = document.getElementById('coordinateSystem');
        const blob = await canvasToBlob(canvas);
        try {
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            alert('Bild wurde in die Zwischenablage kopiert.');
        } catch (e) {
            console.error(e);
            alert('Kopieren fehlgeschlagen – Browser unterstützt die Clipboard‑API evtl. nicht.');
        }
    });
    return btn;
}

/* -------------------------------------------------------------
   Hauptfunktion: Zeichnen
------------------------------------------------------------- */
document.getElementById('drawButton').addEventListener('click', () => {
    /* ---- Eingabewerte einlesen -------------------------------- */
    const xMin = parseFloat(document.getElementById('xMin').value);
    const xMax = parseFloat(document.getElementById('xMax').value);
    const xStep = parseFloat(document.getElementById('xStep').value);
    const xLabel = document.getElementById('xLabel').value;

    const yMin = parseFloat(document.getElementById('yMin').value);
    const yMax = parseFloat(document.getElementById('yMax').value);
    const yStep = parseFloat(document.getElementById('yStep').value);
    const yLabel = document.getElementById('yLabel').value;

    const canvas = document.getElementById('coordinateSystem');
    const ctx = canvas.getContext('2d');

    /* ---- Konstanten (Randbereiche) ----------------------------- */
    const left   = 50;   // linke Grenze
    const right  = 550;  // rechte Grenze
    const top    = 50;   // obere Grenze
    const bottom = 350;  // untere Grenze
    const width  = right - left;
    const height = bottom - top;

    /* ---- Mapping‑Funktionen ----------------------------------- */
    const mapX = val => left + ((val - xMin) / (xMax - xMin)) * width;
    const mapY = val => bottom - ((val - yMin) / (yMax - yMin)) * height;

    /* ---- Position der Null‑Achsen (falls im Wertebereich) ----- */
    const xZeroPos = (xMin <= 0 && 0 <= xMax) ? mapX(0) : left;   // y‑Achse
    const yZeroPos = (yMin <= 0 && 0 <= yMax) ? mapY(0) : bottom; // x‑Achse

    /* ---- Canvas leeren ---------------------------------------- */
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* ---- Gitternetz (mittelgrau) ----------------------------- */
    ctx.strokeStyle = '#505050';
    ctx.lineWidth = 0.5;

    // horizontale Gitterlinien
    for (let y = yMin; y <= yMax; y += yStep) {
        const py = mapY(y);
        ctx.beginPath();
        ctx.moveTo(left, py);
        ctx.lineTo(right, py);
        ctx.stroke();
    }

    // vertikale Gitterlinien
    for (let x = xMin; x <= xMax; x += xStep) {
        const px = mapX(x);
        ctx.beginPath();
        ctx.moveTo(px, top);
        ctx.lineTo(px, bottom);
        ctx.stroke();
    }

    /* ---- Achsen (schwarz) ------------------------------------ */
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // X‑Achse (horizontal)
    ctx.moveTo(left, yZeroPos);
    ctx.lineTo(right, yZeroPos);
    // Y‑Achse (vertikal)
    ctx.moveTo(xZeroPos, top);
    ctx.lineTo(xZeroPos, bottom);
    ctx.stroke();

    /* ---- Beschriftungen X‑Achse ------------------------------ */
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    for (let x = xMin; x <= xMax; x += xStep) {
        const px = mapX(x);
        // Tick
        ctx.beginPath();
        ctx.moveTo(px, yZeroPos - 5);
        ctx.lineTo(px, yZeroPos + 5);
        ctx.stroke();
        // Zahlen
        if (x!=0){ctx.fillText(x, px, yZeroPos + 8);}
    }

    /* ---- Beschriftungen Y‑Achse (rechtsbündig, nah am Tick) */
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = yMin; y <= yMax; y += yStep) {
        const py = mapY(y);
        // Tick
        ctx.beginPath();
        ctx.moveTo(xZeroPos - 5, py);
        ctx.lineTo(xZeroPos + 5, py);
        ctx.stroke();
        // Zahlen (5 px Abstand zum Tick)
        if (y!=0){ctx.fillText(y, xZeroPos - 7, py);}
    }

    /* ---- Titel X‑Achse --------------------------------------- */
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(xLabel, (left + right) / 2, bottom+20);

    /* ---- Titel Y‑Achse (zentriert links neben den Zahlen) ---- */
    const yTitleX = 20;
    const yTitleY = (top + bottom) / 2;    // Vertikale Mitte der Achse
    ctx.save();
    ctx.translate(yTitleX, yTitleY);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    /* ---- Kopieren‑Button einblenden (falls noch nicht vorhanden) */
    if (!document.getElementById('copyButton')) {
        const copyBtn = createCopyButton();
        const drawBtn = document.getElementById('drawButton');
        drawBtn.parentNode.insertBefore(copyBtn, drawBtn.nextSibling);
    }
});

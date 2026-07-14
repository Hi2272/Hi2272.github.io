/* -------------------------------------------------------------
Bild‑Splitter mit Kontrast‑, optionaler Graustufen‑ und
Vorschau‑Logik
------------------------------------------------------------- */
let selectedFiles = [];          // Alle ausgewählten Dateien
let contrastValue = 0;           // Aktueller Slider‑Wert (-100 … 100)
const fileInput      = document.getElementById('fileInput');
const previewCanvas  = document.getElementById('previewCanvas');
const tempCanvas     = document.getElementById('tempCanvas');
const contrastSlider = document.getElementById('contrastSlider');
const contrastLabel  = document.getElementById('contrastValue');
const startBtn       = document.getElementById('startBtn');
const grayscaleChk   = document.getElementById('grayscaleCheckbox');
// neue Variable für den Helligkeits‑Slider
const brightnessSlider = document.getElementById('brightnessSlider');
const brightnessLabel = document.getElementById('brightnessValue');
let brightnessValue = 0;   // -100 … 100, Standard 0

/* ---------- Hilfsfunktionen --------------------------------- */
// Laden einer File‑Instanz in ein HTMLImageElement
function loadImage(file) {
return new Promise((resolve, reject) => {
const reader = new FileReader();
reader.onload = ev => {
const img = new Image();
img.onload = () => resolve(img);
img.onerror = reject;
img.src = ev.target.result;
};
reader.onerror = reject;
reader.readAsDataURL(file);
});
}
// Bild (ggf. Rotation) auf ein Canvas zeichnen und Kontrast‑Filter anwenden

// Anpassung der Filter‑logik (Kontrast + Helligkeit)
function drawWithContrast(img, ctx, applyFilters) {
    const needRotate = img.height > img.width;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset Transform
    if (needRotate) {
        ctx.canvas.width  = img.height;
        ctx.canvas.height = img.width;
        ctx.translate(ctx.canvas.width, 0);
        ctx.rotate(Math.PI / 2);
    } else {
        ctx.canvas.width  = img.width;
        ctx.canvas.height = img.height;
    }

    if (applyFilters) {
        // Kontrast‑Filter (0 % … 200 %)
        const contrastPercent = 100 + contrastValue;   // -100 → 0 %, 0 → 100 %, 100 → 200 %
        // Helligkeit‑Filter (-100 … 100 → -100 % … 100 %)
        const brightnessPercent = 100 + brightnessValue; // -100 → 0 %, 0 → 100 %, 100 → 200 %
        ctx.filter = `contrast(${contrastPercent}%) brightness(${brightnessPercent}%)`;
    } else {
        ctx.filter = 'none';
    }
    ctx.drawImage(img, 0, 0);
}

// -------------------------------------------------
// Event‑Listener für die Checkbox hinzufügen
// -------------------------------------------------
grayscaleChk.addEventListener('change', () => {
    // Canvas‑Vorschau neu rendern, wenn bereits Dateien geladen sind
    if (selectedFiles.length > 0) {
        renderPreview(selectedFiles[0]);
    }
});
// Event‑Listener für Helligkeit
brightnessSlider.addEventListener('input', () => {
    brightnessValue = parseInt(brightnessSlider.value, 10);
    brightnessLabel.textContent = brightnessValue;
    if (selectedFiles.length > 0) {
        renderPreview(selectedFiles[0]);   // Vorschau aktualisieren
    }
});


// Graustufen‑Filter (nur wenn Checkbox aktiv)
function applyGrayscale(canvas) {
if (!grayscaleChk.checked) return; // nichts tun, wenn deaktiviert
const ctx = canvas.getContext('2d');
const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imgData.data;
for (let i = 0; i < data.length; i += 4) {
const r = data[i];
const g = data[i + 1];
const b = data[i + 2];
const gray = 0.299 * r + 0.587 * g + 0.114 * b; // Luminanz‑Formel
data[i] = data[i + 1] = data[i + 2] = gray;
}
ctx.putImageData(imgData, 0, 0);
}
// Vertikales Teilen eines Canvas in zwei Hälften
function splitCanvas(sourceCanvas) {
const halfW = sourceCanvas.width / 2;
const h = sourceCanvas.height;
const left = document.createElement('canvas');
left.width = halfW;
left.height = h;
left.getContext('2d').drawImage(
    sourceCanvas,
    0, 0, halfW, h,
    0, 0, halfW, h
);

const right = document.createElement('canvas');
right.width = halfW;
right.height = h;
right.getContext('2d').drawImage(
    sourceCanvas,
    halfW, 0, halfW, h,
    0, 0, halfW, h
);

return { left, right };

}
// Blob‑Download (Trigger für den Browser)
function downloadBlob(blob, name) {
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = name;
a.click();
URL.revokeObjectURL(url);
}
/* ---------- UI‑Interaktionen -------------------------------- */
contrastSlider.addEventListener('input', () => {
contrastValue = parseInt(contrastSlider.value, 10);
contrastLabel.textContent = contrastValue;
if (selectedFiles.length > 0) {
renderPreview(selectedFiles[0]); // Vorschau aktualisieren
}
});
fileInput.addEventListener('change', e => {
selectedFiles = Array.from(e.target.files);
if (selectedFiles.length > 0) {
renderPreview(selectedFiles[0]); // erstes Bild in Vorschau zeigen
}
});
startBtn.addEventListener('click', async () => {
if (selectedFiles.length === 0) {
alert('Bitte zuerst Bilddateien auswählen.');
return;
}
for (const file of selectedFiles) {
await processShowAndSave(file);
}
});
/* ---------- Kern‑Logik -------------------------------------- */
// Vorschau des ersten Bildes (Kontrast, optional Graustufen)
async function renderPreview(file) {
const img = await loadImage(file);
const ctx = previewCanvas.getContext('2d');
drawWithContrast(img, ctx, true);
applyGrayscale(previewCanvas); // spiegelt aktuelle Checkbox‑Zustand
}
// Verarbeitung eines Bildes: Anzeige → (optional) Graustufen → Split → Download
async function processShowAndSave(file) {
const img = await loadImage(file);
const ctx = tempCanvas.getContext('2d');
// Bild (inkl. Rotation) auf temporäres Canvas zeichnen und Kontrast anwenden
drawWithContrast(img, ctx, true);

// Optional Graustufen‑Umwandlung
applyGrayscale(tempCanvas);

// Kurz anzeigen (z. B. 800 ms)
tempCanvas.style.display = 'block';
await new Promise(r => setTimeout(r, 800));
tempCanvas.style.display = 'none';

// Bild teilen
const { left, right } = splitCanvas(tempCanvas);

// Dateinamen ermitteln
const baseName = file.name.replace(/\.[^/.]+$/, '');
const ext = file.type.split('/')[1] || 'png';

// Links‑Bild speichern
left.toBlob(blob => {
    const name = `0_${baseName}_l.${ext}`;
    downloadBlob(blob, name);
}, file.type);

// Rechts‑Bild speichern
right.toBlob(blob => {
    const name = `0_${baseName}_r.${ext}`;
    downloadBlob(blob, name);
}, file.type);

}

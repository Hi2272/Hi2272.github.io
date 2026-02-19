/* ------------- globale Variablen ------------- */
let video;               // p5 Video Capture
let faceapi;             // ml5 FaceAPI Instanz
let detections = [];    // Aktuelle Erkennungen
let faceGraphics;       // p5.Graphics für das ausgeschnittene Gesicht
let saveBtn;            // Button-Element

/* ------------- p5.js Setup ------------- */
function setup() {
    // Canvas wird im HTML‑Container eingefügt
    const cnv = createCanvas(640, 480);
    cnv.parent('canvas-container');

    // Kamera starten
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide(); // Wir zeichnen das Video selbst

    // FaceAPI laden (nur "face" Modell)
    const faceOptions = { withLandmarks: false, withDescriptors: false };
    faceapi = ml5.faceApi(video, faceOptions, modelReady);

    // Grafik‑Puffer für das Gesicht (initial leer)
    faceGraphics = createGraphics(width, height);

    // Button einrichten
    saveBtn = select('#saveBtn');
    saveBtn.mousePressed(saveFace);
}

/* ------------- Modell bereit ------------- */
function modelReady() {
    console.log('FaceAPI‑Modell geladen');
    // Kontinuierlich nach Gesichtern suchen
    faceapi.detect(gotResults);
}

/* ------------- Ergebnis‑Callback ------------- */
function gotResults(err, result) {
    if (err) {
        console.error(err);
        return;
    }
    detections = result; // Array von Detektionen (kann leer sein)

    // Nächste Erkennung starten
    faceapi.detect(gotResults);
}

/* ------------- p5.js Draw ------------- */
function draw() {
    // Videobild zeigen
    image(video, 0, 0, width, height);

    // Falls ein Gesicht erkannt wurde, Bounding‑Box und Ausschnitt zeichnen
    if (detections && detections.length > 0) {
        const { alignedRect } = detections[0]; // erstes Gesicht
        const { _x, _y, _width, _height } = alignedRect._box;

        // Rechteck um das Gesicht
        noFill();
        stroke(0, 255, 0);
        strokeWeight(2);
        rect(_x, _y, _width, _height);

        // Gesicht in den Grafik‑Puffer kopieren
        faceGraphics.clear();
        faceGraphics.copy(
            video,
            _x, _y, _width, _height,   // Quelle
            0, 0, _width, _height      // Ziel (oben links im Puffer)
        );

        // Button aktivieren
        saveBtn.removeAttribute('disabled');
    } else {
        // Kein Gesicht → Button deaktivieren
        saveBtn.attribute('disabled', '');
    }
}

/* ------------- Bild speichern ------------- */
function saveFace() {
    if (!detections || detections.length === 0) return;

    // Das Gesicht befindet sich im faceGraphics‑Puffer.
    // Wir speichern nur den Teil, der das Gesicht enthält.
    const { alignedRect } = detections[0];
    const { _width, _height } = alignedRect._box;

    // Erstelle ein temporäres Canvas mit exakt der Größe des Gesichts
    const tmp = createGraphics(_width, _height);
    tmp.image(faceGraphics, 0, 0, _width, _height, 0, 0, _width, _height);

    // p5.saveCanvas speichert als PNG – wir konvertieren zu JPEG
    // (p5.js unterstützt nur PNG direkt, daher nutzen wir toDataURL)
    const dataURL = tmp.canvas.toDataURL('image/jpeg', 0.92);
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'face_' + Date.now() + '.jpg';
    link.click();

    // Aufräumen
    tmp.remove();
}

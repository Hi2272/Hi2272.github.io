const width = window.innerWidth * 0.95;
const height = window.innerHeight * 0.8;

const stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
});

const layer = new Konva.Layer();
stage.add(layer);

const numTextBlocks = 10;

// Positioniere die Textblöcke horizontal
const textWidth = 75; // Breite des Textes
const textHeight = 75; // Höhe des Textes
const padding = 10; // Abstand zwischen den Textblöcken

const colors = ['blue', 'lightseagreen', 'lime', 'greenyellow', 'yellow', 'gold', 'orange', 'orangered', 'red', 'crimson']; // Farben für den Hintergrund

for (let i = 0; i < numTextBlocks; i++) {
    const number = Math.floor(Math.random() * 100);


    // Erstelle ein Label
    var label = new Konva.Label({
        x: Math.floor(width / 2) - ((5 - i) * (textWidth + padding)), // Horizontale Position
        y: (height - textHeight) / 2, // Vertikale Position zentriert
        draggable: true // Label draggable machen
       
    });
    // Füge Event-Listener für Drag-Events hinzu
label.on('dragstart', () => {
    console.log('Dragging started');
    // Hier kannst du weitere Aktionen hinzufügen, die beim Starten des Dragvorgangs ausgeführt werden sollen
});

label.on('dragend', () => {
    console.log('Dragging ended');
    // Hier kannst du weitere Aktionen hinzufügen, die beim Beenden des Dragvorgangs ausgeführt werden sollen
});

    // Füge ein Rechteck als Hintergrund hinzu
    const farbWert = Math.floor(number / 10);
    const backgroundColor = colors[farbWert]; // Zufällige Hintergrundfarbe auswählen
    const background = new Konva.Rect({
        width: textWidth,
        height: textHeight,
        fill: backgroundColor,
        stroke: 'black',
        cornerRadius: 20 // Abgerundete Ecken (optional)
    });

    // Füge den Text zur Label hinzu
    const text = new Konva.Text({
        text: number.toString(),
        fontSize: 32,
        fontStyle: 'bold',
        fontFamily: 'Calibri',
        fill: 'black',
        width: textWidth,
        height: textHeight,
        align: 'center',
        verticalAlign: 'middle'

    });

    label.add(background); // Füge den Hintergrund zum Label hinzu
    label.add(text); // Füge den Text zum Label hinzu
    layer.add(label); // Füge das Label zur Layer hinzu
}

layer.draw();

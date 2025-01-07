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

const colors = ['purple', 'darkblue', 'blue', 'green', 'olive', 'orange', 'maroon', 'orangered', 'red', 'crimson']; // Farben für den Hintergrund

layer.add(new Konva.Text({
    text: 'Index des Feldes:',
    fontSize: 32,
    fontStyle: 'bold',
    fontFamily: 'Calibri',
    fill: 'black',
    align: 'center',
    verticalAlign: 'top',
    x: Math.floor(width / 2) - ((5) * (textWidth + padding)), // Horizontale Position
    y: 20 // Vertikale Position zentriert
  
}));


for (let i = 0; i < numTextBlocks; i++) {
    layer.add(new Konva.Text({
        text: i.toString(),
        fontSize: 32,
        fontStyle: 'bold',
        fontFamily: 'Calibri',
        fill: 'black',
        width: textWidth,
        height: textHeight,
        align: 'center',
        verticalAlign: 'top',
        x: Math.floor(width / 2) - ((5 - i) * (textWidth + padding)), // Horizontale Position
        y: 20+textHeight, // Vertikale Position zentriert
    }));
   
   
    const number = Math.floor(Math.random() * 100);


    // Erstelle ein Label
    var label = new Konva.Label({
        x: Math.floor(width / 2) - ((5 - i) * (textWidth + padding)), // Horizontale Position
        y: 20+2*textHeight, // Vertikale Position zentriert
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
        fill: 'white',
        width: textWidth,
        height: textHeight,
        align: 'center',
        verticalAlign: 'middle'

    });

    label.add(background); // Füge den Hintergrund zum Label hinzu
    label.add(text); // Füge den Text zum Label hinzu
    layer.add(label); // Füge das Label zur Layer hinzu
    

}


var textmin=new Konva.Text({
    text: 'minIndex',
    fontSize: 32,
    fontStyle: 'bold',
    fontFamily: 'Calibri',
    fill: 'red',
    align: 'center',
    verticalAlign: 'bottom',
    rotation:90,
    
    x: Math.floor(width / 2) - Math.floor((4.4 ) * (textWidth +padding)), // Horizontale Position
    y: 20+4*textHeight+padding, // Vertikale Position zentriert
    draggable: true // Label draggable machen


})

layer.add(textmin);

var texti=new Konva.Text({
    text: 'i',
    fontSize: 32,
    fontStyle: 'bold',
    fontFamily: 'Calibri',
    fill: 'blue',
    align: 'center',
    verticalAlign: 'bottom',
    
    x: Math.floor(width / 2) - Math.floor((3.6 ) * (textWidth +padding)), // Horizontale Position
    y: 20+3*textHeight+padding, // Vertikale Position zentriert
    draggable: true // Label draggable machen


})

layer.add(texti);
layer.draw();

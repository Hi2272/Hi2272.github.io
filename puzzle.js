
/*
Daten aus der data.json Datei laden
Das ganze Programm läuft dann in der Ladefunktion
*/
const xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function () {

    jsonData = JSON.parse(this.responseText);

    /* 
    Titel eintragen
    */

    document.getElementById("Titel").innerHTML = jsonData.titel;
    document.getElementById("Angabe").innerHTML = jsonData.angabe;
    document.getElementById("Ueberschrift").innerHTML = jsonData.titel;

    /* 
    Variablen umwandeln 
*/
    var dateiname = jsonData.dateiname;  // Name des geladenen Bildes
    var copyright = jsonData.copyright;  // Bildquelle
    var anzX = jsonData.anzX;            // Zahl der Puzzle-Teile in x-Richtung
    var anzY = jsonData.anzY;            // Zahl der Puzzle-Teile in y-Richtung

    var nummer = 0;

    var puzzle = new Array();
    for (var x = 0; x < anzX; x++) {
        puzzle[x] = new Array()
    }
    var dx;   // Breite eines Puzzle-Teils
    var dy;   // Hoehe eines Puzzle-Teils
    /*
    Zeichenfläche vorbereiten
    */

    var width = window.innerWidth;
    var height = window.innerHeight;


    var stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height,
    });

    var layer = new Konva.Layer();
    var layerDrag = new Konva.Layer();
    var layerButton=new Konva.Layer();

    /* 
    Button für Copyright-Vermerk
    */
    var btnCopyRight = new Konva.Label({
        x: width * 0.8 + 5,   // y wird später ersetzt
        width: width * 0.2,
        opacity: 0.75
    });
    btnCopyRight.add(new Konva.Tag({
        fill: 'black',
        lineJoin: 'round',
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: 10,
        shadowOpacity: 0.5
    }));


    btnCopyRight.add(new Konva.Text({
        text: 'Quellenhinweis',
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'white'
    }));

    layerButton.add(btnCopyRight);

    btnCopyRight.on('click', () => quelleAngeben());
    btnCopyRight.on('tap', () => quelleAngeben());

    /*
    Schaltfläche zum Prüfen des Ergebnisses
    */

    var button = new Konva.Label({
        x: width * 0.8 + 5,
        y: 5,
        opacity: 0  // Unsichtbar zu Beginn
    });
    button.add(new Konva.Tag({
        fill: 'black',
        lineJoin: 'round',
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: 10,
        shadowOpacity: 0.5
    }));

    button.add(new Konva.Text({
        text: 'Prüfen',
        fontFamily: 'Calibri',
        fontSize: 18,
        padding: 5,
        fill: 'white'
    }));

    button.on('click', () => pruefen());
    button.on('tap', () => pruefen());
    layerButton.add(button);
   

    // Bild laden

    var imageObj = new Image();
    imageObj.onload = function () {
        if (width < height) {
            ausgabe("Die Seite ist auf eine Darstellung in Querformat optimiert.<br>" +
                "Bitte drehen Sie Ihr Gerät und laden Sie die Seite neu!", 3000, "error");
        }

        var img = new Konva.Image({
            x: 0,
            y: 0,
            image: imageObj,
        });

        // Bild kopieren, um Puzzleteile zu erzeugen
        var img2 = img.clone();
        dx = img2.width() / anzX;
        dy = img2.height() / anzY;

        // Puzzle-Teile erzeugen
        for (var x = 0; x < anzX; x++) {
            for (var y = 0; y < anzY; y++) {
                var img2 = img.clone();

                puzzle[x][y] = img2.crop({
                    x: x * dx,
                    y: y * dy,
                    width: dx,
                    height: dy
                });
            }
        }

        // Bild auf Seitenbreite vergrößern
        var w = img.width();
        var h = img.height();
        var f = layer.width() / w;  // Vergrößerungsfaktor 

        img.width(f * w / 2);
        img.height(f * h / 2);
        img.opacity(0);
        layer.add(img);
        dx = f * dx / 2;
        dy = f * dy / 2;

        // Puzzleteile formatieren, 

        for (var x = 0; x < anzX; x++) {
            for (var y = 0; y < anzY; y++) {
                puzzle[x][y].x(f * w / 2 + x * dx);
                puzzle[x][y].y(y * dy);

                puzzle[x][y].width(dx);
                puzzle[x][y].height(dy);

                // Drag-Funktion einbauen

                puzzle[x][y].draggable(true);
                puzzle[x][y].on('dragend', function (e) {
                    var obj = e.target;
                    console.log("Dragend: " + obj.x() + " " + obj.y());

                    if (obj.x() < layer.width() / 2) {   // Snap-Funktion gilt nicht, wenn die Karte nach rechts gezogen
                        abstandX = obj.x() - Math.floor(obj.x() / dx) * dx;
                        abstandY = obj.y() - Math.floor(obj.y() / dy) * dy;
                        if (abstandX < dx / 2) {
                            abstandX = 0;
                        } else {
                            abstandX = dx;
                        }
                        if (abstandY < dx / 2) {
                            abstandY = 0;
                        } else {
                            abstandY = dy;
                        }
                        this.x(Math.floor(obj.x() / dx) * dx + abstandX);
                        this.y(Math.floor(obj.y() / dy) * dy + abstandY);
                        /*
                        Grenzen beachten
                        */

                        if (this.x() < 0) { this.x(0); }
                        if (this.y() < 0) { this.y(0); }
                        if (this.x() > anzX * dx) { this.x(anzX * (dx - 1)); }
                        if (this.y() > anzY * dy) { this.y(anzY * (dy - 1)); }

                        /* 
                        Sind alle nach rechts verschoben => Prüfen aktivieren
                        */

                        var alle = true;
                        for (x = 0; x < anzX; x++) {
                            for (y = 0; y < anzY; y++) {
                                if (puzzle[x][y].x() > (layer.width() / 2-dx/2)) {
                                    alle = false;
                                    y = anzY + 1; x = anzX + 1;
                                }
                            }
                        }
                        if (alle) {
                            console.log("True");
                            button.opacity(0.75);
                        }
                    }
                });

                layerDrag.add(puzzle[x][y]);
            }
        }


        stage.height(img.height());  // Höhe der Zeichenflaeche anpassen

        /*
         Puzzleteile mischen
        */

        for (i = 0; i < 40; i++) {
            x1 = Math.floor(Math.random() * anzX);
            y1 = Math.floor(Math.random() * anzY);
            x2 = Math.floor(Math.random() * anzX);
            y2 = Math.floor(Math.random() * anzY);
            console.log(x1 + " " + y1 + " " + x2 + " " + y2);
            tmpX = puzzle[x1][y1].x();
            tmpY = puzzle[x1][y1].y();
            puzzle[x1][y1].x(puzzle[x2][y2].x());
            puzzle[x1][y1].y(puzzle[x2][y2].y());
            puzzle[x2][y2].x(tmpX);
            puzzle[x2][y2].y(tmpY);
        }

        // Rahmen um Zeichenfläche ziehen
        var rect = new Konva.Rect(
            {
                width: stage.width() / 2,
                height: stage.height(),
                stroke: "lightblue",
                strokeWidth: 5,

            }
        );
        layer.add(rect);
        btnCopyRight.y(stage.height() - 25);
        btnCopyRight.x(stage.width()-btnCopyRight.width()-10);    
        button.x(stage.width()-button.width()-10);

        /*
        kleine Rechtecke für die möglichen Positionen einfügen
        */

        for (x = 0; x < anzX; x++) {
            for (y = 0; y < anzY; y++) {
                layer.add(new Konva.Rect({
                    x: x * dx,
                    y: y * dy,
                    width: 10,
                    height: 10,
                    fill: "lightblue"
                }));
            }
        }

    };
    imageObj.src = dateiname;


    // add the layer to the stage
    stage.add(layer);
    stage.add(layerDrag);
    stage.add(layerButton);

    /*
    Ausgabe von Text in toast 
    */

    function ausgabe(title, msg, dauer, type) {
        VanillaToasts.create({
            title: title,
            text: msg,
            timeout: dauer,
            type: type,
        });
    }


    function quelleAngeben() {
        ausgabe("Quellenangabe", "Bildquelle: <br>" + copyright + "<br><br>"
            + "Programmierung: <br>2021 Rainer Hille<br><br>"
            + "Unter Verwendung von <br>"
            + "<a href='https://konvajs.org'>Konva.js</a><br>"
            + "<a href='https://www.cssscript.com/toast-style-web-notifications-in-vanilla-javascript-vanillatoasts/'>VanillaToasts.js</a>"
            + "", 3000, "info");
    }


    function pruefen() {
        if (button.opacity() > 0) { // Button muss sichtbar sein!
            var anzGefunden = 0;
            console.log("Prüfung");
            for (x = 0; x < anzX; x++) {
                for (y = 0; y < anzY; y++) {
                    gefunden = false;
                    var t1 = puzzle[x][y];
                    var xpos = Math.floor(t1.x() / dx);
                    var ypos = Math.floor(t1.y() / dy);
                    t1.opacity(0.9);

                    if (xpos == x && ypos == y) {
                        gefunden = true;
                        t1.fill('green');
                        anzGefunden++;
                    } else if (!gefunden) {
                     
                        t1.fill('red');
                    }
                }
            }
        }

        if (anzGefunden == anzX * anzY) {
            ausgabe("Gratulation", "Super, du hast die Aufgabe vollständig gelöst!", 3000, "success");
        } else {
            ausgabe("Hinweis", "Die grünen Teile sind richtig - die roten musst du noch korrigieren!", 3000, "error");
        }
    }
}




var href = window.location.href;
href = href.substring(0, href.lastIndexOf("/"));
xmlhttp.open("GET", href + "/data.json");
xmlhttp.send();


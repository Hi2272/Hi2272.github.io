
/*
Daten aus der data.json Datei laden
Das ganze Programm läuft dann in der Ladefunktion
*/

var img;

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
    var snap = jsonData.snap;           // true für Arbeit false für Erstellen

    var txt = jsonData.txt;               // Koordinaten der Kärtchen
    var text = new Array();               // Verschiebbare Kärtchen

    var nummer = 0;

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
    var layerButton = new Konva.Layer();

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
        img = new Konva.Image({
            x: 0,
            y: 0,
            image: imageObj,
        });
        console.log(img.width() + " " + img.height());

        // Bild auf 80% der Seitenbreite vergrößern
        var w = img.width();
        var h = img.height();
        var faktor = layer.width() * 0.8 / w;  // Vergrößerungsfaktor 

        img.width(faktor * w);
        img.height(faktor * h);

        // add the shape to the layer

        layer.add(img);
        stage.height(img.height());  // Höhe der Zeichenflaeche anpassen


        btnCopyRight.y(stage.height() - 25);
        btnCopyRight.x(stage.width() - btnCopyRight.width() - 10);

        button.x(stage.width() - button.width() - 10);




        if (!snap) {
            document.getElementById("ausgabe").style = "visibility: visible";

            var isDrawing = false;
            var drawrect;

            stage.on("mousedown", mousedownHandler);
            stage.on("mousemove", mousemoveHandler);
            stage.on("mouseup", mouseupHandler);

            function mousedownHandler() {
                isDrawing = true;
                drawrect = new Konva.Rect({
                    x: stage.getPointerPosition().x,
                    y: stage.getPointerPosition().y,
                    width: 0,
                    height: 0,
                    stroke: "red"
                });
                layerDrag.add(drawrect);
            }

            function mousemoveHandler() {
                if (!isDrawing) return false;
                const newWidth = stage.getPointerPosition().x - drawrect.x();
                const newHeight = stage.getPointerPosition().y - drawrect.y();
                drawrect.width(newWidth);
                drawrect.height(newHeight);
                layerDrag.batchDraw();
            }

            function mouseupHandler() {
                isDrawing = false;
                var img2;
                if ((drawrect.width() + drawrect.height()) > 5) {
                    var x = Math.round(drawrect.x() / img.width() * 1000) / 1000;
                    var y = Math.round(drawrect.y() / img.height() * 1000) / 1000;
                    var w = Math.round(drawrect.width() / img.width() * 1000) / 1000;
                    var h = Math.round(drawrect.height() / img.height() * 1000) / 1000;
                    var ausg = document.getElementById("txt");
                    if (ausg.innerHTML.length > 20) { ausg.innerHTML = ausg.innerHTML + ",<br>"; }
                    ausg.innerHTML = ausg.innerHTML + '{"x":' + x + ' ,"y":' + y + ',"width":' + w + ',"height":' + h + ',"pos":['+nummer+']}';
                    nummer++;
                }
            }
        } else {
            // Kärtchen erzeugen
            for (i = 0; i < txt.length; i++) {
                var img2 = img.clone();
                console.log(img2.width() + " " + img2.height() + " " + img.width() + " " + img.height());
                console.log(txt[i].x * img.width() + " " + txt[i].y * img.height() + " " + txt[i].width * img.width() + " " + txt[i].height * img.height());

                text[i] = img2.crop({
                    x: txt[i].x * img.width() / faktor,
                    y: txt[i].y * img.height() / faktor,
                    width: txt[i].width * img.width() / faktor,
                    height: txt[i].height * img.height() / faktor
                });
            }
            // Kärtchen formatieren und darstellen
            for (i = 0; i < txt.length; i++) {
                text[i].x(width * 0.8);
                text[i].y(i * img.height() / (txt.length + 1));
                text[i].stroke("lightblue");
                text[i].width(txt[i].width * img.width());
                text[i].height(txt[i].height * img.height());
                text[i].draggable(true);
                layerDrag.add(text[i]);

                /*
                Funktion, die beim Ende des Drag-Vorgangs aufgerufen wird
                */

                text[i].on('dragend', function (e) {
                    var obj = e.target;
                    var x = Math.round(obj.x() / img.width() * 1000) / 1000;
                    var y = Math.round(obj.y() / img.height() * 1000) / 1000;
                    if (obj.x() < img.width()) {   // Snap-Funktion gilt nicht, wenn die Karte nach rechts gezogen
                        var n = 9999;
                        var mindist = layer.width() * layer.width() + layer.height() * layer.height();
                        for (i = 0; i < txt.length; i++) {
                            dist = (x - txt[i].x) * (x - txt[i].x) + (y - txt[i].y) * (y - txt[i].y);
                            if (dist < mindist) {
                                mindist = dist;
                                n = i;
                            }
                        }
                        if (n != 9999) {  // Hier wird auf die Koordinaten geschoben
                            this.x(txt[n].x * img.width());
                            this.y(txt[n].y * img.height());
                            layer.add(new Konva.Rect({  // Positionspunkte überdecken
                                x: txt[n].x * img.width(),
                                y: txt[n].y * img.height(),
                                width: 5,
                                height: 5,
                                fill: "white"
                            }));
            
                        } else {
                            console.log("Objekt nicht gefunden!");
                        }
                    }
                    var alle = true;
                    for (i = 0; i < text.length; i++) {
                //        console.log("i:"+i+" x"+text[i].x()+" width"+img.width());
                        if (text[i].x() >= img.width() ) {
                            alle = false;
                            i = 99;
                        }
                    }
                    if (alle) {
                        console.log("True");
                        button.opacity(0.75);
                    }

                });


                /*
                Lücken löschen
                */
                layer.add(new Konva.Rect({
                    x: txt[i].x * img.width(),
                    y: txt[i].y * img.height(),
                    width: txt[i].width * img.width(),
                    height: txt[i].height * img.height(),
                    fill: "white"
                }));
                /* 
                Positionspunkte setzen
                */
                layer.add(new Konva.Rect({
                    x: txt[i].x * img.width(),
                    y: txt[i].y * img.height(),
                    width: 5,
                    height: 5,
                    fill: "lightgreen"
                }));

                layer.batchDraw();

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
            for (i1 = 0; i1 < text.length; i1++) { // Alle Textbausteine durchlaufen
                var t1 = text[i1];
                gefunden = false;
                var t2 = txt[i1];
                for (i3 = 0; i3 < t2.pos.length; i3++) {  // Alle alternativen Positionen durchlaufen
                    var t3 = txt[t2.pos[i3]];
                    var dx = Math.abs(t1.x() - t3.x * img.width());
                    var dy = Math.abs(t1.y() - t3.y * img.height());
                    if (dx < 2 && dy < 2) {
                        gefunden = true;
                        t1.stroke('white');
                        t1.strokeWidth(0);
                        anzGefunden++;
                        i3 = t2.pos.length;
                        i2 = txt.length;
                    } else if (!gefunden) {
                        t1.strokeWidth(2);
                        t1.stroke('red');

                    }
                }
            }
        }
        if (anzGefunden == text.length) {
            ausgabe("Gratulation", "Super, du hast die Aufgabe vollständig gelöst!", 3000, "success");
        } else {
            ausgabe("Hinweis", "Die roten Kärtchen musst du noch korrigieren!", 3000, "error");
        }
    }
}


var href = window.location.href;
href = href.substring(0, href.lastIndexOf("/"));
xmlhttp.open("GET", href + "/data.json");
xmlhttp.send();


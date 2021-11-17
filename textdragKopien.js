
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
    var snap = jsonData.snap;
    console.log(snap);
    var txt = jsonData.txt;
    var dateiname = jsonData.dateiname;
    var copyright = jsonData.copyright;
    var positionsmarken = jsonData.positionsmarken;
    var kaertchen = jsonData.kaertchen;

    var nummer = 0;


    /*
    Zeichenfläche vorbereiten
    */

    var width = window.innerWidth;
    var height = window.innerHeight;

    var xStart = width * 0.8 + 5; // Startposition für alle Karten

    var stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height,
    });

    var layer = new Konva.Layer();
    var layerText = new Konva.Layer();

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

    layerText.add(btnCopyRight);

    btnCopyRight.on('click', () => quelleAngeben());
    btnCopyRight.on('tap', () => quelleAngeben());

    /*
    Schaltfläche zum Prüfen des Ergebnisses
    */

    var button = new Konva.Label({
        y: 5,
        opacity: 0  // Unsichtbar zu Beginn
    });
    layerText.add(button);
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
    button.x(width - 15 - button.width());

    /* 
    Textbausteine zeichnen
    */
    var text = new Array();  // Schiebbare Karten rechts vom Feld

    for (i = 0; i < kaertchen.length; i++) {
        text[i] = new Konva.Text({
            x: xStart,
            text: kaertchen[i],
            fill: 'blue',
            fontSize: 4 + Math.round(width / 80),
            align: 'left'
        });
        // Breite setzen
        if (text[i].width() < width * 0.1) {   // Sehr kurze Wörter werden verlängert, um sie besser zu greifen
            text[i].width(width * 0.1)
        } else if (text[i].width() >= width * 0.2 - 20) { // Sehr lange Wörter werden umgebrochen
            text[i].width(width * 0.2 - 20);
            text[i].align('center');
        }
        // y-Positionen setzen
        if (i == 0) {
            text[i].y(10);
        } else {
            text[i].y(text[i - 1].y() + text[i - 1].height() + 10);
        }
        text[i].draggable('true');
        layerText.add(text[i]);

        text[i].on('dragstart', function (e) {
            dragstart(e);
        });

        /*
        Funktion, die beim Ende des Drag-Vorgangs aufgerufen wird
        */
        text[i].on('dragend', function (e) { dragend(e) });

    }
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

        // Bild auf 80% der Seitenbreite vergrößern
        var w = img.width();
        var h = img.height();
        var f = layer.width() * 0.8 / w;  // Vergrößerungsfaktor 

        img.width(f * w);
        img.height(f * h);

        stage.height(img.height());  // Höhe der Zeichenflaeche anpassen

        // Rahmen um Zeichenfläche ziehen
        var rect = new Konva.Rect(
            {
                width: stage.width() * 0.98,
                height: stage.height(),
                stroke: "black",

            }
        );
        layer.add(rect);
        btnCopyRight.y(stage.height() - 25);
        // add the shape to the layer
        layer.add(img);

        /*
        kleine Rechtecke für die möglichen Positionen einfügen
        */
        if (positionsmarken) {
            for (i = 0; i < txt.length; i++) {
                layer.add(new Konva.Rect({
                    x: txt[i].x * layer.width(),
                    y: txt[i].y * layer.height(),
                    width: 3,
                    height: 3,
                    fill: "lightgreen"
                }));
            }
        }

    };
    imageObj.src = dateiname;


    // add the layer to the stage
    stage.add(layer);
    stage.add(layerText);

    function dragstart(e) {
        var obj = e.target;
        if (Math.abs(obj.x() - xStart) < 2) {
            var nr = text.length;
            console.log("dragstart" + nr);
            text[nr] = new Konva.Text({
                x: xStart,
                y: obj.y(),
                text: obj.text(),
                width: obj.width(),
                fill: 'blue',
                fontSize: 4 + Math.round(width / 80),
                align: obj.align(),
                draggable: true,
            });
            text[nr].on('dragstart', function (e) { dragstart(e) });
            text[nr].on('dragend', function (e) { dragend(e) });

            layerText.add(text[nr]);
            console.log("dragstart ausgeführt: " + text.length);

        }
    }

    function dragend(e) {
        var obj = e.target;
        var x = Math.round(obj.x() / layer.width() * 1000) / 1000;
        var y = Math.round(obj.y() / layer.height() * 1000) / 1000;
        if (!snap) {    // snap false => Koordinaten ausgeben
            document.getElementById("ausgabe").style.visibility="visible";
            var s="";
            var lsg="";
            var nummer=0;
            for (i=0;i<text.length;i++){
                if (text[i].x()<xStart){
                    if (s!=""){ s=s+ "<br>";}
                    s=s 
                    + '{"x":'  + Math.round(text[i].x() / layer.width() * 1000) / 1000 
                    + ' ,"y":' +  Math.round(text[i].y() / layer.height() * 1000) / 1000
                    + ',"text":"' + text[i].text() + '","pos":[' + nummer + ']},';
                    lsg=lsg+text[i].text();
                    nummer++;
                }
            }
            s=s.substring(0,s.length-1);
            document.getElementById("txt").innerHTML = s;
            document.getElementById("loesung").innerHTML='"'+lsg+'"';
        } else {   // snap true => Texte auf die nächstliegende Koordinate schieben
            
            if (x < 0.8) {   // Snap-Funktion gilt nicht, wenn die Karte nach rechts gezogen
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
                    obj.x(txt[n].x * layer.width());
                    obj.y(txt[n].y * layer.height());
                } else {
                    console.log("Objekt nicht gefunden!");
                }
            } else { // Textbaustein nach rechts gezogen => wird gelöscht
                console.log("Löschen");
                var nr = 0;
                dx = Math.abs(text[nr].x() - obj.x());
                dy = Math.abs(text[nr].y() - obj.y());
                console.log(nr + ": " + dx + " " + dy);
                while (dx > 2 && dy > 2 && nr < text.length - 1) {
                    nr++;
                    dx = Math.abs(text[nr].x() - obj.x());
                    dy = Math.abs(text[nr].y() - obj.y());
                    console.log(nr + ": " + dx + " " + dy);

                }
                if (dx < 2 && dy < 2) {
                    text[nr].destroy();

                    for (n = nr + 1; n < text.length; n++) {
                        text[n - 1] = text[n];
                    }
                    text.pop(); // Löscht letztes Element aus Array
                }

            }
            var anzGeschoben = 0;
            for (i = 0; i < text.length; i++) {
                if (text[i].x() < xStart) {
                    anzGeschoben++;
                }
            }
            if (anzGeschoben == txt.length) {
                console.log(anzGeschoben);
                button.opacity(0.75);
            }
        }
    }
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
                if (t1.x() < xStart) { // Startkärtchen werden nicht durchsucht!
                    gefunden = false;
                    for (i2 = 0; i2 < txt.length; i2++) { // Lösungskarten werden durchsucht
                        var t2 = txt[i2];
                        if (t2.text == t1.text()) {  // Text stimmt überein
                            console.log(t1.text());
                            for (i3 = 0; i3 < t2.pos.length; i3++) {  // Alle alternativen Positionen durchlaufen
                                console.log(i3);
                                var t3 = txt[t2.pos[i3]];
                                var dx = Math.abs(t1.x() - t3.x * layer.width());
                                var dy = Math.abs(t1.y() - t3.y * layer.height());
                                console.log(t1.text() + " " + t3.text + " " + dx + " " + dy)
                                if (dx < 2 && dy < 2) {
                                    gefunden = true;
                                    t1.fill('green');
                                    anzGefunden++;
                                    i3 = t2.pos.length;
                                    i2 = txt.length;
                                } 
                            }
                        }
                    }
                    if (!gefunden) {
                        t1.fill('red');
                    }
                }
            }
            if (anzGefunden == text.length - kaertchen.length) {
                ausgabe("Gratulation", "Super, du hast die Aufgabe vollständig gelöst!", 3000, "success");
            } else {
                ausgabe("Hinweis", "Die grünen Begriffe sind richtig - die roten musst du noch korrigieren!", 3000, "error");
            }
        }
    }

}


var href = window.location.href;
href = href.substring(0, href.lastIndexOf("/"));
xmlhttp.open("GET", href + "/data.json");
xmlhttp.send();


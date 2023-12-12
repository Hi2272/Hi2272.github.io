var angabe;
var nummer;
var width = window.innerWidth;
var height = window.innerHeight;
var frage;
var zeit;
var endText;
var href;
var typ;
var txtAngabe;
var untertitel;
/*
Daten aus der data.json Datei laden
*/
const xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function () {

    jsonData = JSON.parse(this.responseText);

    document.getElementById("Titel").innerHTML = jsonData.titel;
    //   document.getElementById("btnWeiter").innerHTML = "<Button class='small' onclick='weiter()'>Weiter</button>";
    document.getElementById("quelle").innerHTML = "Bildquelle: " + jsonData.copyright +
        "<br>2022 Rainer Hille <br> Unter Verwwendung von  <a href='https://www.cssscript.com/toast-style-web-notifications-in-vanilla-javascript-vanillatoasts/'>VanillaToasts.js</a>";
    var s = "Klicken um die Vorlage herunterzuladen ⇒ Rechtsklick auf heruntergeladene Datei ⇒ Öffnen mit BlueJ<br>" +
        "<a href=\"https://Hi2272.github.io/00Informatik/" + jsonData.blueJ + "\">BlueJ Vorlage</a>";

    /* 
    Variablen umwandeln 
    */

    angabe = jsonData.angabe;      // Allgemeine Angabe
    endText = jsonData.ende;
    untertitel = jsonData.untertitel;

    nummer = 0;
    frage = true;
    start();
}


href = window.location.href;
href = href.substring(0, href.lastIndexOf("/"));
xmlhttp.open("GET", href + "/data.json");
xmlhttp.send();


function start() {
    zeichnen();
    // startNummer(0);
}

objekte = new Array();

/**
 * Zeigt 5 Sek. lang eine Fehlermeldung an
 * @param {*} i: Zeilennummer, in der der Fehler auftritt 
 * @param {*} s : Text der ausgegeben wird
 */
function error(i, s) {
    if (i != -1) {
        ausgabe("Fehler in Zeile " + (i + 1).toString(), s, 5000, "error");
    } else {
        ausgabe("Fehler", s, 5000, "error");
    }
}


/**
 * Sucht ein Objekt im Array objekte.
 * @param {*} nam: Name des Objekts, nach dem gesucht wird 
 * @returns -1, wenn Objekt nicht gefunden wird.
 * nr des Objekts im Array objekte
 */
function objektSuche(nam) {
    let nr = -1;
    for (i = 0; i < objekte.length; i++) {
        if (objekte[i].nam == nam) {
            nr = i;
        }

    }
    return nr;
}
/**
 * Wandelt den Inhalte des Text Area in Svg-Code um 
 */
function convert() {
    while (objekte.length > 0) {  // Array objekte leeren
        objekte.pop();
    }
    str = document.getElementById("editor").value;
    linie = str.split(/\r?\n|\r|\n/g);
    console.log(linie);
    for (nr = 0; nr < linie.length; nr++) {
        if (linie[nr] != "") {
            abbruch = false;
            if (linie[nr].startsWith(".") || linie[nr].startsWith(":")) {
                error(nr, "Der Objektname fehlt!");
                break;
            }

            teile = linie[nr].split(":");
            if (teile.length == 2) {  // Objektdeklaration
                if (objektSuche(teile[0]) != -1) {
                    error(nr, "Ein Objekt mit dem Namen " + teile[0] + " gibt es schon!");
                    abbruch = true;
                }

                switch (teile[1].toLowerCase()) {
                    case "rect":
                    case "rechteck":
                    case "rectangle": objekte.push(new Rect(teile[0], teile[1].toUpperCase())); break;
                    case "kreis":
                    case "circle": objekte.push(new Circle(teile[0], teile[1].toUpperCase())); break;
                    case "linie":
                    case "line": objekte.push(new Line(teile[0], teile[1].toUpperCase())); break;
                    case "dreieck":
                    case "triangle": objekte.push(new Triangle(teile[0], teile[1].toUpperCase())); break;

                    default:
                        error(nr, "Die Klasse " + teile[1] + " ist mir unbekannt.");
                        abbruch = true;

                }

            } else if (teile.length > 2) {
                error(nr, "Maximal ein Doppelpunkt!");
                abbruch = true;
            } else if (teile.length == 1) { // Kein Doppelpunkt --> Methodenaufruf
                teile = linie[nr].split(".");
                console.log(teile);
                if (teile.length == 1) { // Kein Punkt -> Fehler}
                    error(nr, "Es muss entweder ein Doppelpunkt oder ein Punkt vorkommen!");
                    abbruch = true;
                } else if (teile.length > 2) {
                    error(nr, "Maximal ein Punkt!");
                    abbruch = true;
                } else { // 2 Teile passt
                    let objektNr = objektSuche(teile[0]);
                    if (objektNr == -1) {
                        error(nr, "Ein Objekt mit dem Namen " + teile[0] + " gibt es nicht!");
                        abbruch = true;
                    } else {
                        methode = teile[1].split("(");
                        if (methode.length == 2) {
                            let parameter = methode[1].replaceAll(")", "");
                            let o = objekte[objektNr];
                            console.log(o);
                            switch (methode[0].toLowerCase()) {
                                case "verschiebex":
                                case "movex": o.moveX(parameter); break;

                                case "verschiebey":
                                case "movey": o.moveY(parameter); break;

                                case "verschiebezu":
                                case "moveto": o.moveTo(parameter); break;

                                case "setzefüllfarbe":
                                case "setzefarbe":
                                case "setfüllfarbe":
                                case "setfarbe":
                                case "setfill": o.setFill(parameter); break;

                                case "setlinienfarbe":
                                case "setzelinienfarbe":
                                case "setstroke": o.setStroke(parameter); break;

                                case "setzebreite":
                                case "setbreite":
                                case "setwidth":
                                    if (o.constructor.name == "Rect") {
                                        o.setWidth(parameter);
                                    } else {
                                        error(nr, "Das Objekt " + o.nam + " hat keine Methode setWidth().");
                                        abbruch = true;
                                    }
                                    break;

                                case "setzehöhe":
                                case "sethöhe":
                                case "setheight":
                                    if (o.constructor.name == "Rect") {
                                        o.setHeight(parameter);
                                    } else {
                                        error(nr, "Das Objekt " + o.nam + " hat keine Methode setHeight().");
                                        abbruch = true;
                                    }
                                    break;

                                case "setzeradius":
                                case "setradius":
                                    if (o.constructor.name == "Circle") {
                                        o.setRadius(parameter);
                                    } else {
                                        error(nr, "Das Objekt " + o.nam + " hat keine Methode setRadius().");
                                        abbruch = true;
                                    }
                                    break;

                                case "setzeecken":
                                case "setecken":
                                case "setpoints":
                                    o.setPoints(parameter);
                                    break;
                                case "setzelinienbreite":
                                case "setlinienbreite":
                                case "setstrokewidth":
                                    o.setStrokeWidth(parameter);
                                    break;

                                default:
                                    error(nr, "Die Methode " + teile[1] + " kenne ich nicht.");
                                    abbruch = true;

                            }
                            o.draw();
                            o.drawCard();
                        }
                        console.log(methode);


                    }
                }



            }
        }
        if (abbruch) { break; }
       
    }
    drawAll();
}
/**
 * zeichnet alle Objekte des Arrays objekte
 */
function drawAll() {
    document.getElementById("svg").innerHTML = koordinatensystem();
    for (i = 0; i < objekte.length; i++) {
        objekte[i].draw();
    }
}

function startNummer(nr) {
    nummer = nr;
    document.getElementById("Menue").style.visibility = 'hidden';
    document.getElementById("Menue").innerHTML = "";

    document.getElementById("Ueberschrift").innerHTML = untertitel;

    anzeigen();

}
function weiter() {
    var dauer = (Date.now() - zeit) / 1000;
    //  dauer=200;
    if (frage && dauer < angabe[nummer].zeit) {
        sdauer = "Gelöst in " + Math.round(dauer.toString()) + " Sekunden?";
        s = "Du solltest dich mindestens " + angabe[nummer].zeit + " Sekunden mit der Aufgabe beschäftigen!";
        ausgabe(sdauer, s, 3000, "info");
    } else {
        if (frage) {
            frage = false;
        } else {
            nummer++;
            frage = true;
        }
        if (nummer < angabe.length) {
            anzeigen();
        } else {
            endeAnzeigen();
        }
    }
}

function anzeigen() {
    var s = (nummer + 1).toString();
    var txt;
    if (!frage) {

        txt = angabe[nummer].txtL;
        if (txt != "") {
            document.getElementById("Angabe").innerHTML = txt;
        }
        txt = "<Button class='breit' onclick='weiter()'>Lösungsvorschlag: Zur nächsten Frage</button><br>";

        //       document.getElementById("Button").innerHTML = txt;

        if (angabe[nummer].svgL != "") {  // Es gibt eine SVG-Lösung
            txt = koordinatensystem() + angabe[nummer].svgL;
            document.getElementById("svg").innerHTML = txt;
            document.getElementById("editor").value = angabe[nummer].svgL;

        }

    } else {
        txt = "Aufgabe " + (nummer + 1).toString() + "/" + angabe.length + ": " + angabe[nummer].txt;
        document.getElementById("Angabe").innerHTML = txt;
        txt = "<Button class='breit' onclick='weiter()'>Lösung</button>";
        document.getElementById("Button").innerHTML = txt;

        txt = koordinatensystem() + angabe[nummer].svgA;
        document.getElementById("svg").innerHTML = txt;
        document.getElementById("editor").value = angabe[nummer].svgA;

    }
    zeit = Date.now();

}

function endeAnzeigen() {
    document.getElementById("Ueberschrift").innerHTML = "Super, du hast alle Aufgaben gelöst!";
    document.getElementById("Angabe").innerHTML = endText;
    document.getElementById("svg").innerHTML = "";
    document.getElementById("editor").value = "";

}

function ausgabe(title, msg, dauer, type) {
    VanillaToasts.create({
        title: title,
        text: msg,
        timeout: dauer,
        type: type,
    });
}
/**
 * Erzeugt den SVG-Code für ein KS
 * @returns svg-String
 */
function koordinatensystem() {
    txt = "";
    for (x = 0; x <= 200; x = x + 10) {
        txt = txt + "<line x1='" + x.toString() + "' y1='0' x2='" + x.toString() + "' y2='200' stroke='lightblue'/>";
        txt = txt + "<text font-size='0.2em' x='" + x.toString() + "' y='3'>" + x.toString() + "</text>";

    }
    txt = txt + "<text font-size='0.2em' x='195' y='9'>x</text>";
    for (y = 0; y <= 200; y = y + 10) {
        txt = txt + "<line x1='0' y1='" + y.toString() + "' x2='200' y2='" + y.toString() + "' stroke='lightblue'/>";
        txt = txt + "<text font-size='0.2em' x='-5' y='" + y.toString() + "'>" + y.toString() + "</text>";
    }
    txt = txt + "<text font-size='0.2em' x='1' y='198'>y</text>";

    return txt;
}
function zeichnen() {
    txt = koordinatensystem();

    txt = txt + document.getElementById("editor").value;
    document.getElementById("svg").innerHTML = txt;
}
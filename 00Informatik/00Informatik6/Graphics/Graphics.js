var objekte = new Array();
var pause;
/**
 * Verzögert die Ausführung des Codes 
 * muss in einer async Funktion mit await aufgerufen werden 
 * vgl. function drawAll() 
 * @param {*} ms : Zeit der Pause in Millisekunden
 * @returns 
 */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function numeric(string) {
    // Entferne alle Nicht-Ziffern aus dem String
    const ziffernString = string.replace(/[^0-9]/g, '');

    // Verwandle den bereinigten String in eine Zahl
    const zahl = parseInt(ziffernString);

    return zahl;
}


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
    for (let i = 0; i < objekte.length; i++) {
        if (objekte[i].nam.toLowerCase() == nam.toLowerCase()) {
            nr = i;
        }

    }
    return nr;
}
/**
 * Fügt ein neues Objekt in das Array objekte ein und in die Listbox Objekte
 * @param {*} o:Objekt, das neu erzeugt wird 
 */
function neu(o) {
    var listbox = document.getElementById("Objekte");
    listbox.innerHTML = "";

    if (o instanceof Group) {
        o.kinder.forEach(element => {
            objekte.push(element);
        });
    }
    objekte.push(o);
    objekte.forEach(element => {
        let opt = document.createElement("option");
        opt.text = element.nam + ":" + atl(element.klasse).toUpperCase();
        opt.value = element.nam + ":" + atl(element.klasse).toUpperCase();
        listbox.options.add(opt);
    });
}
/**
 * Stellt die Klassenkarte des aktuell angewählten Objekts der Listbox ein
 */
function selection() {
    var obj = document.getElementById("Objekte").value;
    let d = obj.split(":");
    let nr = objektSuche(d[0]);
    objekte[nr].drawCard();

}

let schrittNr = 0;

function schrittweise() {
    schrittNr++;
    convert(schrittNr);
}


function translate(s) {
    let dict = {

        "blau": "blue",
        "gruen": "green",
        "grün": "green",
        "gelb": "yellow",
        "rot": "red",
        "weiß": "white",
        "weiss": "white",
        "schwarz": "black",
        "hellblau": "lightblue",
        "hellgrün": "lightgreen",
        "violett": "violet",
        "lila": "violet",
        "hellgelb": "lightyellow",
        "hellrot": "pink",
        "braun": "brown",
        "silber": "silver",
        "dunkelblau": "darkblue",
        "olivgrün": "olive",
        "grau": "grey",
        "hellgrau": "lightgrey",
        "rosa": "pink",
        "nicht": "none",
        "nichts": "none",
        "keine": "none",
        "null": "none"
    };

    if (s in dict) {
        return dict[s];
    } else {
        return s;
    }


}



function paramCheck(nr, o, methode, param, typ) {
    let farbe = ["blau", "blue", "gruen", "green", "grün", "green", "gelb", "yellow", "rot", "red", "weiß", "white", "weiss", "white", "schwarz", "black", "hellblau", "lightblue",
        "hellgrün", "lightgreen", "violett", "violet", "lila", "violet", "hellgelb", "lightyellow", "hellrot", "pink", "braun", "brown", "silber", "silver", "dunkelblau", "darkblue",
        "olivgrün", "olive", "grau", "grey", "hellgrau", "lightgrey", "rosa", "pink", "keine", "none", "nicht", "nichts"];


    let check = true;
    let p = param.split(",");
    let t = typ.split(",");
    if (p.length != t.length) {  // Parameterzahl stimmt nicht
        error(nr, "Die Methode " + methode + " des Objekts " + o.nam + " benötigt " + t.length.toString() + " Parameter. Du hast " + p.length.toString() + " eingegeben.");
        check = false;
    } else {
        for (let i = 0; i < t.length; i++) {
            switch (t[i]) {
                case "Z": // Zahl als Parameter
                    if (isNaN(p[i])) {
                        error(nr, "Die Methode " + methode + " des Objekts " + o.nam + " benötigt eine Zahl als " + (i + 1).toString() + ". Parameter. Du hast " + p[i] + " eingegeben.");
                        check = false;
                    }
                    break;

                case "F": // Farbe als Parameter

                    if (!farbe.includes(p[i].toLowerCase()) && !p[i].startsWith("#")) {
                        error(nr, "Die Methode " + methode + " des Objekts " + o.nam + " benötigt eine Farbe als Parameter. Du hast " + p[i] + " eingegeben.");
                        check = false;
                    }
                    break;
                case "NO": //  Neues Objekt als Parameter
                    if (objektSuche(p[i]) != -1) {
                        error(nr, "Die Methode " + methode + " des Objekts " + o.nam + " benötigt ein neues Objekt als Parameter. Das Objekt " + p[i] + " gibt es schon.");
                        check = false;
                    }
                    break;

            }
        }
    }
    return check;
}


function convertLinie(linie, nr) {
    let abbruch = false;
    if (!linie.startsWith("//")) {
        if (linie.startsWith(".") || linie.startsWith(":")) {
            error(nr, "Der Objektname fehlt!");
            abbruch = true;
        }

        let teile = linie.split(":");
        if (teile.length == 2) {  // Objektdeklaration
            if (objektSuche(teile[0]) != -1) {
                error(nr, "Ein Objekt mit dem Namen " + teile[0] + " gibt es schon!");
                abbruch = true;
            }

            switch (teile[1].toLowerCase()) {
                case "rect":
                case "rechteck":
                case "rectangle": neu(new Rect(teile[0], teile[1].toUpperCase())); break;
                case "kreis":
                case "circle": neu(new Circle(teile[0], teile[1].toUpperCase())); break;
                case "linie":
                case "line": neu(new Line(teile[0], teile[1].toUpperCase())); break;
                case "dreieck":
                case "triangle": neu(new Triangle(teile[0], teile[1].toUpperCase())); break;
                case "group":
                case "gruppe": neu(new Group(teile[0], teile[1].toUpperCase())); break;
                default:
                    error(nr, "Die Klasse " + teile[1] + " ist mir unbekannt.");
                    abbruch = true;

            }

        } else if (teile.length > 2) {
            error(nr, "Maximal ein Doppelpunkt!");
            abbruch = true;
        } else if (teile.length == 1) { // Kein Doppelpunkt --> Methodenaufruf
            teile = linie.split(".");
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
                    if (methode.length == 1) {
                        error(nr, "Eine Methode benötigt Parameter in Klammern.");
                        abbruch = true;
                    } else if (methode.length > 2) {
                        error(nr, "Eine Methode hat maximal eine Klammer mit Parametern.");
                        abbruch = true;
                    } else {
                        let parameter = methode[1].replaceAll(")", "");
                        let o = objekte[objektNr];
                        console.log(o);
                        switch (methode[0].toLowerCase()) {
                            case "setzex":
                            case "setx":
                                if (o.constructor.name == "Group") {
                                    error(nr, "Die Methode " + methode[0] + " funktioniert bei Gruppen nicht! Verwende statt dessen verschiebeX(dx) oder moveX(dx)");
                                    abbruch = true
                                } else {
                                    if (paramCheck(nr, o, methode[0], parameter, "Z")) {
                                        o.setX(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                }
                                break;

                            case "setzey":
                            case "sety":
                                if (o.constructor.name == "Group") {
                                    error(nr, "Die Methode " + methode[0] + " funktioniert bei Gruppen nicht! Verwende statt dessen verschiebeY(dy) oder moveY(dy)");
                                    abbruch = true
                                } else {

                                    if (paramCheck(nr, o, methode[0], parameter, "Z")) {
                                        o.setY(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                }
                                break;

                            case "setopacity":
                            case "setdeckkraft":
                            case "setzedeckkraft":
                            case "deckkraftsetzen":
                            case "setopac":
                                if (paramCheck(nr, o, methode[0], parameter, "Z")) {
                                    o.setOpac(parameter);
                                } else {
                                    abbruch = true;
                                }
                                break;

                            case "verschiebex":
                            case "movex":
                                if (paramCheck(nr, o, methode[0], parameter, "Z")) {
                                    o.moveX(parameter);
                                } else {
                                    abbruch = true;
                                }
                                break;

                            case "verschiebey":
                            case "movey":
                                if (paramCheck(nr, o, methode[0], parameter, "Z")) {
                                    o.moveY(parameter);
                                } else {
                                    abbruch = true;
                                }
                                break;

                            case "verschiebezu":
                            case "verschiebenach":
                            case "moveto":
                            case "setxy":
                                if (o.constructor.name == "Group") {
                                    error(nr, "Die Methode " + methode[0] + " funktioniert bei Gruppen nicht! Verwende statt dessen Methoden zum Verschieben in x und y Richtung");
                                    abbruch = true
                                } else {

                                    if (paramCheck(nr, o, methode[0], parameter, "Z,Z")) {
                                        o.moveTo(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                }
                                break;

                            case "setzefüllfarbe":
                            case "füllfarbesetzen":
                            case "setzefarbe":
                            case "setfüllfarbe":
                            case "setfarbe":
                            case "setcolor":
                            case "setfill":
                                if (paramCheck(nr, o, methode[0], parameter, "F")) {
                                    o.setFill(translate(parameter));
                                } else {
                                    abbruch = true;
                                }
                                break;
                            case "setlinienfarbe":
                            case "setzelinienfarbe":
                            case "linienfarbesetzen":
                            case "setstroke":
                                if (paramCheck(nr, o, methode[0], parameter, "F")) {
                                    o.setStroke(translate(parameter));
                                } else {
                                    abbruch = true;
                                }
                                break;

                            case "setzebreite":
                            case "setbreite":
                            case "setwidth":
                            case "breitesetzen":
                                if (o.constructor.name == "Rect" || o.constructor.name == "Group") {
                                    if (paramCheck(nr, o, methode[0], parameter, "Z")) {
                                        o.setWidth(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                } else {
                                    error(nr, "Das Objekt " + o.nam + " hat keine Methode " + methode[0] + "().");
                                    abbruch = true;
                                }
                                break;

                            case "setzehöhe":
                            case "sethöhe":
                            case "setheight":
                            case "höhesetzen":
                                if (o.constructor.name == "Rect" || o.constructor.name == "Group") {
                                    if (paramCheck(nr, o, methode[0], parameter, "Z")) {
                                        o.setHeight(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                } else {
                                    error(nr, "Das Objekt " + o.nam + " hat keine Methode " + methode[0] + "().");
                                    abbruch = true;
                                }
                                break;

                            case "setzeradius":
                            case "setradius":
                            case "radiussetzen":
                                if (o.constructor.name == "Circle" || o.constructor.name == "Group") {
                                    if (paramCheck(nr, o, methode[0], parameter, "Z")) {
                                        o.setRadius(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                } else {
                                    error(nr, "Das Objekt " + o.nam + " hat keine Methode " + methode[0] + "().");
                                    abbruch = true;
                                }
                                break;

                            case "setzepunkte":
                            case "setpunkte":
                            case "punktesetzen":
                            case "setpoints":
                            case "eckensetzen":
                            case "mittelpunktsetzen":
                            case "mittesetzen":
                            case "setzemitte":
                            case "setmitte":
                            case "setmittelpunkt":
                            case "setzemittelpunkt":
                                o.setPoints(parameter);
                                break;
                            case "setzelinienbreite":
                            case "setlinienbreite":
                            case "setstrokewidth":
                            case "linienstärkesetzen":
                            case "setlinienstärke":
                            case "setzelinienstärke":
                            case "linienbreitesetzen":
                                if (paramCheck(nr, o, methode[0], parameter, "Z")) {
                                    o.setStrokeWidth(parameter);
                                } else {
                                    abbruch = true;
                                }
                                break;
                            case "skaliere":
                            case "scale":
                            case "strecke":
                            case "vergrößere":
                                if (paramCheck(nr, o, methode[0], parameter, "Z")) {
                                    o.scale(parameter);
                                } else {
                                    abbruch = true;
                                }
                                break;

                            case "dupliziere":
                            case "duplicate":
                            case "copypaste":
                            case "verdoppele":
                                if (paramCheck(nr, o, methode[0], parameter, "NO,Z,Z")) {
                                    let param = parameter.split(",");
                                    neu(o.copyPaste(param[0], parseInt(param[1]), parseInt(param[2])));
                                } else {
                                    abbruch = true;
                                }
                                break;
/*    
                      
                        let param = parameter.split(",");
                            if (param.length == 3) {
                                if (objektSuche(param[0].toLowerCase()) != -1) {
                                    error(nr, "Ein Objekt mit dem Namen " + param[0] + " gibt es schon!");
                                    abbruch = true;
                                } else {
                                    neu(o.copyPaste(param[0], parseInt(param[1]), parseInt(param[2])));
                                }
                            } else {
                                error(nr, "Zum Duplizieren eines Objekts benötigst du drei Parameter: Neuer Name, x-Verschiebung, y-Verschiebung");
                                abbruch = true;

                            }
                            break;
  */                      case "schlucke":
                            case "fügezu":
                            case "add":
                            case "fuegezu":
                            case "hinzufügen":
                            case "hinzufuegen":
                                if (o.constructor.name == "Group") {
                                    o.add(parameter);
                                } else {
                                    error(nr, "Das Objekt " + o.nam + " hat keine Methode " + methode[0] + ".");
                                    abbruch = true;
                                }
                                break;
                            default:
                                error(nr, "Die Methode " + teile[1] + " kenne ich nicht.");
                                abbruch = true;

                        }
                        o.drawCard();

                    }
                }
            }
        }
    }
    return abbruch;
}
/**
 * Wandelt den Inhalte des Text Area in Svg-Code um 
 */
async function convert(steps, pause) {
    while (objekte.length > 0) {  // Array objekte leeren
        objekte.pop();
    }
    let wdh = 0;
    let sprung = 0;
    document.getElementById("Objekte").innerHTML = "";
    document.getElementById("svg").innerHTML = koordinatensystem();
    str = document.getElementById("editor").value;
    str = str.replaceAll(" ", "");
    str = str.toLowerCase();
    linie = str.split(/\r?\n|\r|\n/g);
    console.log(linie);

    if (steps == -1) {
        steps = linie.length;
        schrittNr = 0;
        document.getElementById("btnStep").innerHTML = "Schritt 1";
    } else if (steps > linie.length) {
        steps = 0;
        schrittNr = 0;
        document.getElementById("btnStep").innerHTML = "Schritt 1";
    } else if (steps == linie.length) {
        document.getElementById("btnStep").innerHTML = "Neustart";
    } else {
        document.getElementById("btnStep").innerHTML = "Schritt " + (schrittNr + 1).toString();
    }

    for (let nr = 0; nr < steps; nr++) {

        if (linie[nr].length > 0) {
            if (linie[nr].includes("*")) { // Schleifenende
                wdh = wdh - 1;
                if (wdh > 0) {
                    nr = sprung;
                }
            } else if (linie[nr].includes("wdh") || linie[nr].includes("repeat") || linie[nr].includes("wiederhol")) {
                wdh = numeric(linie[nr]);  // Wiederholungszahl der Schleife
                sprung = nr;  // Rücksprung in Zeile
            } else {
                abbruch = convertLinie(linie[nr], nr);
                drawAll();

                if (pause) await sleep(document.getElementById("pause").value);
            }
        }
        if (abbruch) { break; }
    }

}

/**
 * Zeichnet alle Objekte des Arrays Objekte
 * @param {*} pause : True, wenn zwischen den Schritten eine Verzögerung eingehalten werden soll.
 */
async function drawAll() {
    document.getElementById("svg").innerHTML = koordinatensystem();
    for (let i = 0; i < objekte.length; i++) {
        objekte[i].draw();
    }
}


/**
 * Gibt einen Toast am rechten Rand aus
 * @param {*} title : Überschrift
 * @param {*} msg : Nachricht
 * @param {*} dauer : Dauer in ms
 * @param {*} type : Art der Botschaft error, info
 */
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
    let txt = "";
    if (document.getElementById("yAchse").checked) {

        for (let x = 0; x <= 200; x = x + 10) {
            txt = txt + "<line x1='" + x.toString() + "' y1='0' x2='" + x.toString() + "' y2='200' stroke='lightblue'/>";
            if (x < 200) {
                txt = txt + "<text font-size='0.2em' x='" + x.toString() + "' y='3'>" + x.toString() + "</text>";
            }
        }
        txt = txt + "<text font-size='0.2em' x='200' y='3'>x</text>";
        for (let y = 0; y <= 200; y = y + 10) {
            txt = txt + "<line x1='0' y1='" + y.toString() + "' x2='200' y2='" + y.toString() + "' stroke='lightblue'/>";
            if (y < 200) {
                txt = txt + "<text font-size='0.2em' x='-5' y='" + y.toString() + "'>" + y.toString() + "</text>";
            }
        }
        txt = txt + "<text font-size='0.2em' x='-5' y='198'>y</text>";
    } else {
        for (let x = 0; x <= 200; x = x + 10) {
            txt = txt + "<line x1='" + x.toString() + "' y1='0' x2='" + x.toString() + "' y2='200' stroke='lightblue'/>";
            if (x < 200) {
                txt = txt + "<text font-size='0.2em' x='" + x.toString() + "' y='199'>" + x.toString() + "</text>";
            }
        }
        txt = txt + "<text font-size='0.2em' x='200' y='199'>x</text>";
        for (let y = 0; y <= 200; y = y + 10) {
            txt = txt + "<line x1='0' y1='" + y.toString() + "' x2='200' y2='" + y.toString() + "' stroke='lightblue'/>";
            if (y < 200) {
                txt = txt + "<text font-size='0.2em' x='-5' y='" + y.toString() + "'>" + (200 - y).toString() + "</text>";
            }
        }
        txt = txt + "<text font-size='0.2em' x='-5' y='3'>y</text>";

    }
    return txt;
}

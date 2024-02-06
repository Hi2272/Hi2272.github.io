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
function error(zeile, s) {
    ausgabe("Fehler: " + zeile, s, 5000, "error");

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
        "dunkelrot": "darkred",
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



function paramCheck(linie, o, methode, param, typ, attribut) {
    let farbe = ["blau", "blue", "gruen", "green", "grün", "green", "gelb", "yellow", "rot", "red", "weiß", "white", "weiss", "white", "schwarz", "black", "hellblau", "lightblue",
        "hellgrün", "lightgreen", "violett", "violet", "lila", "violet", "hellgelb", "lightyellow", "hellrot", "pink", "braun", "brown", "silber", "silver", "dunkelblau", "darkblue",
        "dunkelrot", "olivgrün", "olive", "grau", "grey", "hellgrau", "lightgrey", "rosa", "pink", "keine", "none", "nicht", "nichts"];

    let m1 = "Die Methode ";
    let m2 = " Parameter. "
    if (attribut) {
        m1 = "Das Attribut ";
        m2 = " Wert. ";
    }
    let check = true;
    let p = param.split(",");
    if (p.includes("")) {
        error(linie, "Es darf kein leerer Wert übergeben werden.");
        check = false;
    } else {
        let t = typ.split(",");
        if (p.length != t.length) {  // Parameterzahl stimmt nicht
            error(linie, m1 + methode + " des Objekts " + o.nam + " benötigt " + t.length.toString() + m2 + "Du hast " + p.length.toString() + " eingegeben.");
            check = false;
        } else {
            for (let i = 0; i < t.length; i++) {
                switch (t[i]) {
                    case "Z": // Zahl als Parameter
                        if (isNaN(p[i])) {
                            if (t.length > 1) {
                                error(linie, m1 + methode + " des Objekts " + o.nam + " benötigt eine Zahl als " + (i + 1).toString() + "." + m2 + "Du hast " + p[i] + " eingegeben.");
                            } else {
                                error(linie, m1 + methode + " des Objekts " + o.nam + " benötigt eine Zahl als " + m2 + "Du hast " + p[i] + " eingegeben.");
                            }
                            check = false;
                        }
                        break;

                    case "F": // Farbe als Parameter

                        if (!farbe.includes(p[i].toLowerCase()) && !p[i].startsWith("#")) {
                            error(linie, m1 + methode + " des Objekts " + o.nam + " benötigt eine Farbe als " + m2 + "Die Farbe " + p[i] + " kenne ich nicht.");
                            check = false;
                        }
                        break;
                    case "NO": //  Neues Objekt als Parameter
                        if (objektSuche(p[i]) != -1) {
                            error(linie, m1 + methode + " des Objekts " + o.nam + " benötigt ein neues Objekt als " + m2 + "Das Objekt " + p[i] + " gibt es schon.");
                            check = false;
                        }
                        break;

                }
            }
        }
    }
    return check;
}

function attribut(teile, linie) {
    let abbruch = false;
    let teile2 = teile[0].split(".");
    if (teile2.length != 2) {
        error(linie, "Die Zuweisung eines Attibutwertes sieht so aus: Objektname.Attribut=Wert");
        abbruch = true;
    } else {
        let objektNr = objektSuche(teile2[0]);
        if (objektNr == -1) {
            error(linie, "Ein Objekt mit dem Namen " + teile2[0] + " gibt es nicht!");
            abbruch = true;
        } else {
            let o = objekte[objektNr];
            if (o.checkAttribut(linie, teile2[1])) {
                switch (teile2[1].toLowerCase()) {
                    case "x": if (paramCheck(linie, o, teile2[1], teile[1], "Z", true)) { o.x = parseFloat(teile[1]); } else { abbruch = true; } break;
                    case "y": if (paramCheck(linie, o, teile2[1], teile[1], "Z", true)) { o.y = parseFloat(teile[1]); } else { abbruch = true; } break;
                    case "dx": if (paramCheck(linie, o, teile2[1], teile[1], "Z", true)) { o.dx = parseFloat(teile[1]); } else { abbruch = true; } break;
                    case "dy": if (paramCheck(linie, o, teile2[1], teile[1], "Z", true)) { o.dy = parseFloat(teile[1]); } else { abbruch = true; } break;
                    case "dx1": if (paramCheck(linie, o, teile2[1], teile[1], "Z", true)) { o.dx1 = parseFloat(teile[1]); } else { abbruch = true; } break;
                    case "dy1": if (paramCheck(linie, o, teile2[1], teile[1], "Z", true)) { o.dy1 = parseFloat(teile[1]); } else { abbruch = true; } break;
                    case "dx2": if (paramCheck(linie, o, teile2[1], teile[1], "Z", true)) { o.dx2 = parseFloat(teile[1]); } else { abbruch = true; } break;
                    case "dy2": if (paramCheck(linie, o, teile2[1], teile[1], "Z", true)) { o.dy2 = parseFloat(teile[1]); } else { abbruch = true; } break;
                    case "radius": if (paramCheck(linie, o, teile2[1], teile[1], "Z", true)) { o.radius = parseFloat(teile[1]); } else { abbruch = true; } break;
                    case "width": case "breite": if (paramCheck(linie, o, teile2[1], teile[1], "Z", true)) { o.width = parseFloat(teile[1]); } else { abbruch = true; } break;
                    case "height": case "höhe": case "hoehe": if (paramCheck(linie, o, teile2[1], teile[1], "Z", true)) { o.height = parseFloat(teile[1]); } else { abbruch = true; } break;

                    case "fill": case "füllfarbe": if (paramCheck(linie, o, teile2[1], teile[1], "F", true)) { o.fill = translate(teile[1]); } else { abbruch = true; } break;
                    case "opacity": case "deckkraft": if (paramCheck(linie, o, teile2[1], teile[1], "Z", true)) { o.opacity = parseInt(teile[1]); } else { abbruch = true; } break;
                    case "linienstärke": case "strokewidth": if (paramCheck(linie, o, teile2[1], teile[1], "Z", true)) { o.strokeWidth = parseInt(teile[1]); } else { abbruch = true; } break;
                    case "linienfarbe": case "stroke": if (paramCheck(linie, o, teile2[1], teile[1], "F", true)) { o.stroke = translate(teile[1]); } else { abbruch = true; } break;

                    default: error(linie, "Das Attribut " + teile2[1] + " kenne ich nicht."); abbruch = true;

                }
                o.drawCard();
            } else {
                abbruch = true;
            }
        }
    }
    return abbruch;
}

function convertLinie(linie, nr) {
    let abbruch = false;
    if (!linie.startsWith("//")) {
        if (linie.startsWith(".") || linie.startsWith(":")) {
            error(linie, "Der Objektname fehlt!");
            abbruch = true;
        }

        let teile = linie.split("=");
        if (teile.length == 2) {// Attributzuweisung
            abbruch = attribut(teile, linie);
        } else if (teile.length > 2) {
            error(linie, "Du darfst nicht mehr als ein = Zeichen verwenden.");
            abbruch = true;
        } else {
            teile = linie.split(":");
            if (teile.length == 2) {  // Objektdeklaration
                if (objektSuche(teile[0]) != -1) {
                    error(linie, "Ein Objekt mit dem Namen " + teile[0] + " gibt es schon!");
                    abbruch = true;
                } else {

                    switch (teile[1].toLowerCase()) {
                        case "rect": case "rechteck": case "rectangle":
                            neu(new Rect(teile[0], teile[1].toUpperCase())); break;
                        case "kreis": case "circle":
                            neu(new Circle(teile[0], teile[1].toUpperCase())); break;
                        case "linie": case "line":
                            neu(new Line(teile[0], teile[1].toUpperCase())); break;
                        case "dreieck": case "triangle":
                            neu(new Triangle(teile[0], teile[1].toUpperCase())); break;
                        case "group": case "gruppe":
                            neu(new Group(teile[0], teile[1].toUpperCase())); break;
                        default:
                            error(linie, "Die Klasse " + teile[1] + " ist mir unbekannt.");
                            abbruch = true;
                    }
                }
            } else if (teile.length > 2) {
                error(linie, "Maximal ein Doppelpunkt!");
                abbruch = true;
            } else if (teile.length == 1) { // Kein Doppelpunkt --> Methodenaufruf
                teile = linie.split(".");
                console.log(teile);
                if (teile.length == 1) { // Kein Punkt -> Fehler}
                    error(linie, "Es muss entweder ein Doppelpunkt oder ein Punkt vorkommen!");
                    abbruch = true;
                } else if (teile.length > 2) {
                    error(linie, "Maximal ein Punkt!");
                    abbruch = true;
                } else { // 2 Teile passt
                    let objektNr = objektSuche(teile[0]);
                    if (objektNr == -1) {
                        error(linie, "Ein Objekt mit dem Namen " + teile[0] + " gibt es nicht!");
                        abbruch = true;
                    } else {
                        methode = teile[1].split("(");
                        if (methode.length == 1) {
                            error(linie, "Eine Methode benötigt Parameter in Klammern.");
                            abbruch = true;
                        } else if (methode.length > 2) {
                            error(linie, "Eine Methode hat maximal eine Klammer mit Parametern.");
                            abbruch = true;
                        } else {
                            let parameter = methode[1].replaceAll(")", "");
                            let o = objekte[objektNr];
                            console.log(o);
                            switch (o.methodencheck(methode[0].toLowerCase())) {
                                case "Fehler":
                                    error(linie, "Das Objekt " + o.nam + " hat keine Methode " + methode[0] + ".");
                                    abbruch = true;
                                    break;
                                case "setx":
                                    if (paramCheck(nr, o, methode[0], parameter, "Z", false)) {
                                        o.setX(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                    break;
                                case "sety":
                                    if (paramCheck(nr, o, methode[0], parameter, "Z", false)) {
                                        o.setY(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                    break;
                                case "setopac":
                                    if (paramCheck(nr, o, methode[0], parameter, "Z", false)) {
                                        o.setOpac(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                    break;

                                case "movex":
                                    if (paramCheck(nr, o, methode[0], parameter, "Z", false)) {
                                        o.moveX(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                    break;

                                case "movey":
                                    if (paramCheck(nr, o, methode[0], parameter, "Z", false)) {
                                        o.moveY(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                    break;

                                case "setxy":
                                    if (paramCheck(nr, o, methode[0], parameter, "Z,Z", false)) {
                                        o.moveTo(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                    break;

                                case "setfill":
                                    if (paramCheck(nr, o, methode[0], parameter, "F", false)) {
                                        o.setFill(translate(parameter));
                                    } else {
                                        abbruch = true;
                                    }
                                    break;
                                case "setstroke":
                                    if (paramCheck(nr, o, methode[0], parameter, "F", false)) {
                                        o.setStroke(translate(parameter));
                                    } else {
                                        abbruch = true;
                                    }
                                    break;

                                case "setwidth":
                                    if (paramCheck(nr, o, methode[0], parameter, "Z", false)) {
                                        o.setWidth(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                    break;

                                case "setheight":
                                    if (paramCheck(nr, o, methode[0], parameter, "Z", false)) {
                                        o.setHeight(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                    break;

                                case "setradius":
                                    if (paramCheck(nr, o, methode[0], parameter, "Z", false)) {
                                        o.setRadius(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                    break;

                                case "setpoints":
                                    let xyZahl = "Z";
                                    for (var i = 1; i < o.getXYZahl(); i++) {
                                        xyZahl = "Z," + xyZahl;
                                    }
                                    if (paramCheck(nr, o, methode[0], parameter, xyZahl, false)) {
                                        o.setPoints(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                    break;

                                case "setstrokewidth":
                                    if (paramCheck(nr, o, methode[0], parameter, "Z", false)) {
                                        o.setStrokeWidth(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                    break;
                                case "scale":
                                    if (paramCheck(nr, o, methode[0], parameter, "Z", false)) {
                                        o.scale(parameter);
                                    } else {
                                        abbruch = true;
                                    }
                                    break;

                                case "copypaste":
                                    if (paramCheck(nr, o, methode[0], parameter, "NO,Z,Z", false)) {
                                        let param = parameter.split(",");
                                        neu(o.copyPaste(param[0], parseInt(param[1]), parseInt(param[2])));
                                    } else {
                                        abbruch = true;
                                    }
                                    break;
                                case "add":
                                    o.add(parameter);
                                    break;
                                default:
                                    error(linie, "Die Methode " + teile[1] + " kenne ich nicht.");
                                    abbruch = true;

                            }
                            o.drawCard();

                        }
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
    let str = document.getElementById("editor").value;
    str = str.replaceAll(" ", "");
    str = str.toLowerCase();
    linie = str.split(/\r?\n|\r|\n/g);
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

function changeTextSize(){
    let size=document.getElementById("editor").style.fontSize;
    let cols=40;
    let rows=20;
    switch (size){
        case "1em":size="1.5em";cols=60;rows=23;break;
        case "1.5em":size="2em";cols=60*15/20;rows=23*15/20;break;
        case "2em":size="2.5em";cols=60*15/25;rows=23*15/25;break;
        case "2.5em":size="3em";cols=60*15/30;rows=23*15/30;break;
        case "3em": size="1em";cols=60*15/10;rows=23*15/10;break;
        
    }
    
    document.getElementById("editor").style.fontSize=size;
    document.getElementById("editor").cols=cols;
    document.getElementById("editor").rows=rows;
    
    
}

let fak = 1.0;

var objekte = new Array();

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
 * Fügt ein neues Objekt in das Array objekte ein und in die Listbox Objekte
 * @param {*} o:Objekt, das neu erzeugt wird 
 */
function neu(o) {
    objekte.push(o);
    var opt = document.createElement("option");
    var listbox = document.getElementById("Objekte");
    listbox.options.add(opt);
    opt.text = o.nam + ":" + o.klasse;
    opt.value = o.nam + ":" + o.klasse
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


/**
 * Wandelt den Inhalte des Text Area in Svg-Code um 
 * @param {*} step: true, wenn die Ausführung in Einzelschritten erfolgt. 
 */
function convert(step) {
  
    while (objekte.length > 0) {  // Array objekte leeren
        objekte.pop();
    }
    document.getElementById("Objekte").innerHTML = "";
    txt = document.getElementById("editor").value;
    txt = txt.replaceAll(" ", "");
    linie = txt.split(/\r?\n|\r|\n/g);
    console.log(linie);
    for (nr = 0; nr < linie.length; nr++) {
        if (linie[nr].length > 1) {
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
                    case "rectangle": neu(new Rect(teile[0], teile[1].toUpperCase(),fak)); break;
                    case "kreis":
                    case "circle": neu(new Circle(teile[0], teile[1].toUpperCase(),fak)); break;
                    case "linie":
                    case "line": neu(new Line(teile[0], teile[1].toUpperCase(),fak)); break;
                    case "dreieck":
                    case "triangle": neu(new Triangle(teile[0], teile[1].toUpperCase(),fak)); break;

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
                                case "verschiebex":
                                case "movex": o.moveX(parameter); break;

                                case "verschiebey":
                                case "movey": o.moveY(parameter); break;

                                case "mittelpunktsetzen":
                                case "verschiebezu":
                                case "verschiebenach":
                                case "moveto": o.moveTo(parameter); break;

                                case "setzefüllfarbe":
                                case "füllfarbesetzen":
                                case "setzefarbe":
                                case "setfüllfarbe":
                                case "setfarbe":
                                case "setcolor":
                                case "setfill": o.setFill(parameter); break;

                                case "setlinienfarbe":
                                case "setzelinienfarbe":
                                case "linienfarbesetzen":
                                case "setstroke": o.setStroke(parameter); break;

                                case "setzebreite":
                                case "setbreite":
                                case "setwidth":
                                case "breitesetzen":
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
                                case "höhesetzen":
                                    if (o.constructor.name == "Rect") {
                                        o.setHeight(parameter);
                                    } else {
                                        error(nr, "Das Objekt " + o.nam + " hat keine Methode setHeight().");
                                        abbruch = true;
                                    }
                                    break;

                                case "setzeradius":
                                case "setradius":
                                case "radiusSetzen":
                                    if (o.constructor.name == "Circle") {
                                        o.setRadius(parameter);
                                    } else {
                                        error(nr, "Das Objekt " + o.nam + " hat keine Methode setRadius().");
                                        abbruch = true;
                                    }
                                    break;

                                case "setzepunkte":
                                case "setpunkte":
                                case "punktesetzen":
                                case "setpoints":
                                case "eckensetzen":
                                    o.setPoints(parameter);
                                    break;
                                case "setzelinienbreite":
                                case "setlinienbreite":
                                case "setstrokewidth":
                                case "setstrokeweight":
                                case "Linienbreitesetzen":
                                    o.setStrokeWeight(parameter);
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
       
        if (abbruch) { break; }
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
function koordinatensystem(fak) {
    stroke('lightblue');
    strokeWeight(1);
    textSize(3 * fak);
    fill('lightblue');
    for (x = 0; x <= 200; x = x + 10) {
        line(x * fak, 0, x * fak, 200 * fak);
        text(x.toString(), x * fak, 10);

    }
    for (y = 0; y <= 200; y = y + 10) {
        line(0, y * fak, 200 * fak, y * fak);
        text(y.toString(), 3, y * fak);
    }
}

let canvas;

function setup() {
    const xm = windowWidth;
    const ym = windowHeight * 0.85;

    let fakX = xm / 200;
    let fakY = ym / 200;
    fak = fakX;
    if (fakY < fakX) { fak = fakY; }
    canvas= createCanvas(200 * fak, 200 * fak);
    
    canvas.parent('svg');
}


function draw() {
    background(255);
    koordinatensystem(fak);
    for ( i=0;i<objekte.length;i++){
           objekte[i].draw();
    }
}

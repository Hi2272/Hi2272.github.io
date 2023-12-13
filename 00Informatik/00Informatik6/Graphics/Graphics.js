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
function neu(o){
    objekte.push(o);
    var opt = document.createElement("option");
    var listbox = document.getElementById("Objekte");
    listbox.options.add(opt);
    opt.text=o.nam+":"+o.klasse;
    opt.value=o.nam+":"+o.klasse
}
/**
 * Stellt die Klassenkarte des aktuell angewählten Objekts der Listbox ein
 */
function selection() {
    var obj = document.getElementById("Objekte").value;
    let d=obj.split(":");
    let nr=objektSuche(d[0]);
    objekte[nr].drawCard();    

   }

/**
 * Wandelt den Inhalte des Text Area in Svg-Code um 
 */
function convert() {
    while (objekte.length > 0) {  // Array objekte leeren
        objekte.pop();
    }
    document.getElementById("Objekte").innerHTML="";

    str = document.getElementById("editor").value;
    linie = str.split(/\r?\n|\r|\n/g);
    console.log(linie);
    for (nr = 0; nr < linie.length; nr++) {
        if (linie[nr].length>1) {
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
                    case "rectangle": neu(new Rect(teile[0], teile[1].toUpperCase())); break;
                    case "kreis":
                    case "circle": neu(new Circle(teile[0], teile[1].toUpperCase())); break;
                    case "linie":
                    case "line": neu(new Line(teile[0], teile[1].toUpperCase())); break;
                    case "dreieck":
                    case "triangle": neu(new Triangle(teile[0], teile[1].toUpperCase())); break;

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
                        } else if ( methode.length >2) {
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

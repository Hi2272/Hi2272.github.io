var objekte = new Array();
var anz=[0,0,0,0];

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
function neu(nummer) {
    anz[nummer]++;
    switch (nummer) {
        case 0:
            var o = new Rect('r' + anz[0].toString(), 'Rechteck');
            break;
        case 1:
            var o = new Circle('k' + anz[1].toString(), "Kreis");
            break;
        case 2:
            var o = new Triangle('d' + anz[2].toString(), "Dreieck");
            break;
        case 3:
            var o = new Line('l' + anz[3].toString(), "Linie");
            break;
    }
    objekte.push(o);

    var listbox = document.getElementById("Objekte");
    listbox.innerHTML = "";
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
    if (obj!=""){
    let d = obj.split(":");
    let nr = objektSuche(d[0]);
    objekte[nr].drawCard();
} else {
    if (objekte.length>0){
        objekte[0].drawCard();
    }
}
}

function change(objektName,attrName,attrNr){
   let nr = objektSuche(objektName);
   let o=objekte[nr];
   let wert=document.getElementById("input"+attrNr.toString()).value;
   if (isNaN(wert)){
    o[attrName]=translate(wert);
   } else {
    o[attrName]=parseInt(wert);
   } 

   drawAll();
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
        "rosa": "pink"
    };

    if (s in dict) {
        return dict[s];
    } else {
        return s;
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
    txt = "";
    for (let x = 0; x <= 200; x = x + 10) {
        txt = txt + "<line x1='" + x.toString() + "' y1='0' x2='" + x.toString() + "' y2='200' stroke='lightblue'/>";
        txt = txt + "<text font-size='0.2em' x='" + x.toString() + "' y='3'>" + x.toString() + "</text>";

    }
    txt = txt + "<text font-size='0.2em' x='195' y='9'>x</text>";
    for (let y = 0; y <= 200; y = y + 10) {
        txt = txt + "<line x1='0' y1='" + y.toString() + "' x2='200' y2='" + y.toString() + "' stroke='lightblue'/>";
        txt = txt + "<text font-size='0.2em' x='-5' y='" + y.toString() + "'>" + y.toString() + "</text>";
    }
    txt = txt + "<text font-size='0.2em' x='1' y='198'>y</text>";

    return txt;
}

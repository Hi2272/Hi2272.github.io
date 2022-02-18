var angabe;
var nummer;
var width = window.innerWidth;
var height = window.innerHeight;
var frage;
var zeit;
var endText;
var href;
/*
Daten aus der data.json Datei laden
*/
const xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function () {

    jsonData = JSON.parse(this.responseText);

    document.getElementById("Titel").innerHTML = jsonData.titel;
    document.getElementById("Ueberschrift").innerHTML = jsonData.untertitel;
    document.getElementById("btnWeiter").innerHTML = "<Button onclick='weiter()'>Weiter</button>";
    document.getElementById("quelle").innerHTML = "Bildquelle: " + jsonData.copyright + 
    "<br>2022 Rainer Hille <br> Unter Verwwendung von  <a href='https://www.cssscript.com/toast-style-web-notifications-in-vanilla-javascript-vanillatoasts/'>VanillaToasts.js</a>";
    

    /* 
    Variablen umwandeln 
    */

    angabe = jsonData.angabe;
    endText=jsonData.ende;

    nummer = 0;
    frage = true;
    anzeigen();
}


href = window.location.href;
href = href.substring(0, href.lastIndexOf("/"));
xmlhttp.open("GET", href + "/data.json");
xmlhttp.send();

function weiter() {
    var dauer = (Date.now() - zeit) / 1000;
   // dauer=200;
    if (frage && dauer < angabe[nummer].zeit) {
        sdauer="Gelöst in "+Math.round(dauer.toString())+" Sekunden?";
        s="Du solltest dich mindestens " + angabe[nummer].zeit + " Sekunden mit der Aufgabe beschäftigen!";
        ausgabe(sdauer,s,3000,"info");
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
        s = s + "1";
        txt = "Lösungsvorschlag:"
    } else {
        txt = "Aufgabe " + (nummer + 1).toString() + "/" + angabe.length + ": " + angabe[nummer].txt;
    }
    document.getElementById("Angabe").innerHTML = txt;
    document.getElementById("Bild").innerHTML = '<img src="'+href+'//screenshot_' + s + '.png" ' +
        'height=' + (height / 2).toString() + '>';
    zeit = Date.now();

}

function endeAnzeigen() {
    document.getElementById("Ueberschrift").innerHTML = "Super, du hast alle Aufgaben gelöst!";
    document.getElementById("Angabe").innerHTML = endText;
    document.getElementById("Bild").innerHTML = "";
    document.getElementById("btnWeiter").innerHTML = "";
}

function ausgabe(title, msg, dauer, type) {
    VanillaToasts.create({
        title: title,
        text: msg,
        timeout: dauer,
        type: type,
    });
}
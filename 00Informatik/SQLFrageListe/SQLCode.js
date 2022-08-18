var angabe;
var nummer;
var richtig;
var endText;
var href;
var fehler;
var shuffle;
var zeit;
/*
Daten aus der data.json Datei laden
*/
const xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function () {

    jsonData = JSON.parse(this.responseText);

    document.getElementById("Ueberschrift").innerHTML = jsonData.titel;
    document.getElementById("Legende").innerHTML = "Externer Datenbank-Inhalt: " + jsonData.url;

    document.title = jsonData.titel;
    angabe = jsonData.angabe;      // Aufgaben werden gespeichert
    shuffle = jsonData.shuffle;

    start();
}


href = window.location.href;
href = href.substring(0, href.lastIndexOf("/"));
xmlhttp.open("GET", href + "/data.json");
xmlhttp.send();

function start() {
    if (shuffle) {

        for (var i = 0; i < angabe.length; i++) {
            var s = angabe[i];
            var zufall = Math.floor(Math.random() * angabe.length);
            angabe[i] = angabe[zufall];
            angabe[zufall] = s;
        }
    }
    document.getElementById("quelle").innerHTML = "2022 Rainer Hille <br> Unter Verwwendung von  <a href='https://www.cssscript.com/toast-style-web-notifications-in-vanilla-javascript-vanillatoasts/'>VanillaToasts.js</a><br>und <a href='https://www.dbiu.de'>Datenbanken im Unterricht</a>";
    document.getElementById("Eingabe").src = jsonData.url;    

    for (var i = 0; i < angabe.length; i++) {
        console.log(angabe[i].txt);
    }
    nummer = 0;
    richtig = 0;

    anzeigen();
}

function anzeigen() {
    document.getElementById("Angabe").innerHTML = "Frage " + (nummer + 1) + "/ " + angabe.length + ": " + angabe[nummer].txt;
    document.getElementById("Loesung").innerHTML = "";
    document.getElementById("Hilfe").innerHTML="";

    document.getElementById("btnWeiter").style.visibility = "hidden";
    document.getElementById("btnLsg").style.visibility = "visible";
    if (angabe[nummer].hilfe != "") {
        document.getElementById("btnHilfe").style.visibility = "visible";
    } else {
        document.getElementById("btnHilfe").style.visibility = "hidden";

    }

    document.getElementById("Eingabe").focus();
    zeit = Date.now();
    console.log(zeit);

}

function endeAnzeigen() {
    s = "<h2>Du hast alle Aufgaben bearbeitet!</h2>";
    s = s + "<br>" + "<a href='https://hi2272.github.io/00Informatik/index.html'>Zurück</a>";
    document.getElementById("Loesung").innerHTML = s;
    document.getElementById("btnWeiter").style.visibility = "hidden";
    document.getElementById("btnLsg").style.visibility = "hidden";
    document.getElementById("btnHilfe").style.visibility = "hidden";
    document.getElementById("Angabe").style.visibility = "hidden";
    document.getElementById("Eingabe").style.visibility = "hidden";
    document.getElementById("Hilfe").innerHTML="";

}

function ausgabe(title, msg, dauer, type) {
    VanillaToasts.create({
        title: title,
        text: msg,
        timeout: dauer,
        type: type,
    });
}



function weiter() {

    nummer++;
    if (nummer < angabe.length) {
        anzeigen();
    } else {
        endeAnzeigen();
    }
}

function hilfe() {
    document.getElementById("Hilfe").innerHTML = angabe[nummer].hilfe;
    document.getElementById("btnHilfe").style.visibility="hidden";
}

function loesung() {
    var dauer = (Date.now() - zeit) / 1000;
    console.log(dauer);
    //  dauer=200;
    if (dauer < angabe[nummer].zeit) {
        sdauer = "Gelöst in " + Math.round(dauer.toString()) + " Sekunden?";
        s = "Du solltest dich mindestens " + angabe[nummer].zeit + " Sekunden mit der Aufgabe beschäftigen!";
        ausgabe(sdauer, s, 3000, "info");
        document.getElementById("Eingabe").focus();

    } else {
        document.getElementById("btnHilfe").style.visibility = "hidden";
        document.getElementById("Hilfe").innerHTML = "";

        document.getElementById("btnWeiter").style.visibility = "visible";
        document.getElementById("btnLsg").style.visibility = "hidden";
        var s = angabe[nummer].lsg[0];
        if (angabe.length > 0) {
            for (var i = 1; i < angabe[nummer].lsg.length; i++) {
                s = s + "<br><b>oder</b><br>" + angabe[nummer].lsg[i];
            }
        }
        document.getElementById("Loesung").innerHTML = s;
    }
}
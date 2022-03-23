var angabe;
var nummer;
var richtig;
var endText;
var href;
/*
Daten aus der data.json Datei laden
*/
const xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function () {

    jsonData = JSON.parse(this.responseText);

    document.getElementById("Titel").innerHTML = jsonData.titel;
    document.getElementById("quelle").innerHTML = "Bildquelle: " + jsonData.copyright +
        "<br>2022 Rainer Hille <br> Unter Verwwendung von  <a href='https://www.cssscript.com/toast-style-web-notifications-in-vanilla-javascript-vanillatoasts/'>VanillaToasts.js</a>";
    document.getElementById("Ueberschrift").innerHTML = jsonData.titel;

    /* 
    Variablen umwandeln 
    */

    angabe = jsonData.angabe;      // Allgemeine Angabe


    nummer = 0;
    richtig = 0;
    start();
}


href = window.location.href;
href = href.substring(0, href.lastIndexOf("/"));
xmlhttp.open("GET", href + "/data.json");
xmlhttp.send();

function start() {
    for (i = 0; i < angabe.length; i++) {
        var s = angabe[i];
        var zufall = Math.floor(Math.random() * angabe.length);
        angabe[i] = angabe[zufall];
        angabe[zufall] = s;
    }
    anzeigen();
}

function weiter() {
    document.getElementById("btnWahr").style.visibility = "visible";
    document.getElementById("btnFalsch").style.visibility = "visible";
    document.getElementById("btnWeiter").style.visibility = "hidden";

    nummer++;
    if (nummer < angabe.length) {
        anzeigen();
    } else {
        endeAnzeigen();
    }
}

function anzeigen() {
    document.getElementById("lsg").innerHTML = "";
    s = "";
    if (angabe[nummer].bild != "") {
        s = s + '<img src="' + angabe[nummer].bild + '"><br>';
    }
    document.getElementById("Aussage").innerHTML = s + angabe[nummer].txt;
    document.getElementById("Nummer").innerHTML = "Frage-Nr.: " + (nummer + 1) + "/ " + angabe.length;
    if (nummer > 0) {
        document.getElementById("Prozent").innerHTML = "Richtig: " + Math.floor(richtig * 100 / nummer) + "%";
    }
}

function endeAnzeigen() {
    var prozent = Math.floor(richtig * 100 / nummer);
    var s = "";
    s = "Du hast " + nummer.toString() + " Fragen beantwortet.<br> Davon waren " + richtig.toString() + " richtig.<br>";
    s = s + "Das entspricht " + prozent.toString() + " Prozent.<br>";
    document.getElementById("Ueberschrift").innerHTML = s;
    s = "<h2>";

    if (prozent > 99) {
        s = s + "Super, du hast alle Aufgaben korrekt gelöst!";
    } else if (prozent > 90) {
        s = s + "Du hast fast alle Aufgaben richtig gelöst!";
    } else if (prozent > 70) {
        s = s + "Du hast die meisten Aufgaben richtig gelöst!";
    } else if (prozent > 50) {
        s = s + "Du hast alle Aufgaben bearbeitet - allerdings waren einige Lösungen nicht richtig.";
    } else {
        s = s + "Du solltest die Übung noch einmal wiederholen!";
    }
    s = s + "</h2>";
    document.getElementById("Vortext").innerHTML = "";
    document.getElementById("Aussage").innerHTML = s;
    document.getElementById("lsg").innerHTML = "";
    document.getElementById("Prozent").innerHTML = "";
    document.getElementById("Nummer").innerHTML = "";

    document.getElementById("btnWahr").style.visibility = "hidden";
    document.getElementById("btnFalsch").style.visibility = "hidden";
    document.getElementById("btnWeiter").style.visibility = "hidden";

}

function ausgabe(title, msg, dauer, type) {
    VanillaToasts.create({
        title: title,
        text: msg,
        timeout: dauer,
        type: type,
    });
}


function auswerten(wahr) {
    var korrektur = "";
    if (wahr == angabe[nummer].wahr) {
        richtig++;
        korrektur = '<hr><p style="color:green;">Deine Antwort ist richtig!</p><hr>';
    } else {
        korrektur = '<hr><p style="color:red;">Deine Antwort ist leider <b>nicht</b> richtig!</p><hr>';
    }
    document.getElementById("btnWahr").style.visibility = "hidden";
    document.getElementById("btnFalsch").style.visibility = "hidden";
    document.getElementById("btnWeiter").style.visibility = "visible";
    document.getElementById("lsg").innerHTML = korrektur + angabe[nummer].lsg;
}

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
    document.getElementById("quelle").innerHTML = "Bildquelle: " + jsonData.copyright +
        "<br>2022 Rainer Hille <br> Unter Verwwendung von  <a href='https://www.cssscript.com/toast-style-web-notifications-in-vanilla-javascript-vanillatoasts/'>VanillaToasts.js</a>";


    /* 
    Variablen umwandeln 
    */

    angabe = jsonData.angabe;      // Allgemeine Angabe


    nummer = 0;
    frage = true;
    start();
}


href = window.location.href;
href = href.substring(0, href.lastIndexOf("/"));
xmlhttp.open("GET", href + "/data.json");
xmlhttp.send();

function start() {
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
    s="";
    if (angabe[nummer].bild!=""){
        s=s+'<img src="'+angabe[nummer].bild+'"><br>';
    }
    document.getElementById("Aussage").innerHTML = s+angabe[nummer].txt;
}

function endeAnzeigen() {
    document.getElementById("Ueberschrift").innerHTML = "Super, du hast alle Aufgaben gelöst!";
    document.getElementById("Vortext").innerHTML = "";
    document.getElementById("Aussage").innerHTML = "";
    document.getElementById("lsg").innerHTML = "";
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
    if (wahr == angabe[nummer].wahr) {
        weiter();
    } else {
        document.getElementById("btnWahr").style.visibility = "hidden";
        document.getElementById("btnFalsch").style.visibility = "hidden";
        document.getElementById("btnWeiter").style.visibility = "visible";
        document.getElementById("lsg").innerHTML="<hr><ma>Fehler:</ma><br>"+angabe[nummer].lsg;
    }
}
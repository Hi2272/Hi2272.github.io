var angabe;
var nummer;
var richtig;
var endText;
var href;
var fehler;
/*
Daten aus der data.json Datei laden
*/
const xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function () {

    jsonData = JSON.parse(this.responseText);

    document.getElementById("Titel").innerHTML = jsonData.titel;
    document.getElementById("Ueberschrift").innerHTML = jsonData.titel;

    angabe = jsonData.angabe;      // Aufgaben werden gespeichert

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
    document.getElementById("quelle").innerHTML = "2022 Rainer Hille <br> Unter Verwwendung von  <a href='https://www.cssscript.com/toast-style-web-notifications-in-vanilla-javascript-vanillatoasts/'>VanillaToasts.js</a>";
    for (i = 0; i < angabe.length; i++) {
        console.log(angabe[i].txt);
    }
    nummer = 0;
    richtig = 0;

    anzeigen();
}

function loesche(txt, loeschText) {
    const teile = txt.split(loeschText);
    return teile.join("");
}

function leerZeichenLoeschen(txt) {
    var z = ["(", ")", "{", "}", "[", "]", ";", ",", "=", "+", "-", "*","/", " "];
    for (i = 0; i < z.length; i++) {
        while (txt.lastIndexOf(z[i] + " ") > 0) {
            const teile = txt.split(z[i] + " ");
            txt = teile.join(z[i]);
        }
        while (txt.lastIndexOf(" " + z[i]) > 0) {
            const teile = txt.split(" " + z[i]);
            txt = teile.join(z[i]);
        }
    }
    return txt;
}
function ersetzeAlle(txt, loeschText, ersatzText) {
    while (txt.lastIndexOf(loeschText) > 0) {
        const teile = txt.split(loeschText);
        txt = teile.join(ersatzText);
    }
    return txt;
}
function weiter() {
    document.getElementById("Eingabe").focus();
        
    var eingabe = document.getElementById("Eingabe").value;
    eingabe = leerZeichenLoeschen(eingabe);
    eingabe = eingabe.trim();
    eingabe = loesche(eingabe, "this.");
    for (i = 0; i < angabe[nummer].lsg.length; i++) {
        loesung = angabe[nummer].lsg[i];
        loesung = loesche(loesung, "this.");

        if (eingabe == loesung) {
            if (!fehler) {
                ausgabe("Gratulation", "Sehr gut - alles richtig", 1000, "info");
            }
            i = angabe[nummer].lsg.length;
            nummer++;
            if (!fehler) { richtig++; }
            if (nummer < angabe.length) {
                anzeigen();
            } else {
                endeAnzeigen();
            }

        } else if (i == angabe[nummer].lsg.length - 1) {
            ausgabe("Fehler", "Das passt noch nicht!<br><br> Beachte die Lösung:", 3000, "warning");
            document.getElementById("Korrektur").innerHTML = "Lösung:";
            var l = document.getElementById("Loesung");
            l.innerHTML = "";
            for (i = 0; i < angabe[nummer].lsg.length; i++) {
                l.innerHTML = l.innerHTML + angabe[nummer].lsg[i] + "<br>";
            }
            fehler = true;
            document.getElementById("Eingabe").focus();
        }
    }
}
function anzeigen() {
    document.getElementById("Angabe").innerHTML = angabe[nummer].txt;
    document.getElementById("Eingabe").value = "";
    document.getElementById("Korrektur").innerHTML = "";
    document.getElementById("Loesung").innerHTML = "";
    fehler = false;
    document.getElementById("Nummer").innerHTML = "Frage-Nr.: " + (nummer + 1) + "/ " + angabe.length;
    if (nummer > 0) {
        document.getElementById("Prozent").innerHTML = "Richtig: " + Math.floor(richtig * 100 / nummer) + "%";
    }
    document.getElementById("Eingabe").focus();
    
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
    document.getElementById("Angabe").innerHTML = s;
    document.getElementById("Eingabe").innerHTML = "";
    document.getElementById("Prozent").innerHTML = "";
    document.getElementById("Nummer").innerHTML = "";

    document.getElementById("Quiz").innerHTML = "";

}

function ausgabe(title, msg, dauer, type) {
    VanillaToasts.create({
        title: title,
        text: msg,
        timeout: dauer,
        type: type,
    });
}

function zeichen(s) {
    eing = document.getElementById("Eingabe");
    eing.value = eing.value + s;
    eing.focus();
}


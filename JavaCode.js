var angabe;
var nummer;
var richtig;
var endText;
var href;
var fehler;
var shuffle;
/*
Daten aus der data.json Datei laden
*/
const xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function () {

    jsonData = JSON.parse(this.responseText);

    document.getElementById("Titel").innerHTML = jsonData.titel;
    document.getElementById("Ueberschrift").innerHTML = jsonData.titel;

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
    document.getElementById("quelle").innerHTML = "2022 Rainer Hille <br> Unter Verwwendung von  <a href='https://www.cssscript.com/toast-style-web-notifications-in-vanilla-javascript-vanillatoasts/'>VanillaToasts.js</a>";
    for (var i = 0; i < angabe.length; i++) {
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
    var z = [">", "<", "(", ")", "{", "}", "[", "]", ";", ",", "=", "+", "-", "*", "/", " "];
    for (var i = 0; i < z.length; i++) {
        while (txt.lastIndexOf(z[i] + " ") > 0) {
            const teile = txt.split(z[i] + " ");
            txt = teile.join(z[i]);
        }
        while (txt.lastIndexOf(" " + z[i]) > 0) {
            const teile = txt.split(" " + z[i]);
            txt = teile.join(z[i]);
        }
    }
    txt=ersetzeAlle(txt,"for(","for (");
    txt=ersetzeAlle(txt,"if(","if (");
    return txt;
}

function ersetzeAlle(txt, loeschText, ersatzText) {
    while (txt.indexOf(loeschText) > -1) {
        const teile = txt.split(loeschText);
        txt = teile.join(ersatzText);
    }
    return txt;
}

function vergleich(txt1, txt2) {
    var s = "";
    for (var i = 0; i < txt1.length; i++) {
        s1 = txt1.charAt(i);
        s2 = txt2.charAt(i);
        if (s2 != s1) {
            s = s + "<i>";
        }
        s = s + s1;
    }
    return s;
}

function check() {
    document.getElementById("Eingabe").focus();

    var eingabe = document.getElementById("Eingabe").value;
    eingabe = leerZeichenLoeschen(eingabe);
    eingabe = eingabe.trim();
    if (angabe[nummer].thisLoeschen) {
        eingabe = loesche(eingabe, "this.");
    }
    for (var i = 0; i < angabe[nummer].lsg.length; i++) {
        loesung = angabe[nummer].lsg[i];
        if (angabe[nummer].thisLoeschen) {
            loesung = loesche(loesung, "this.");
        }
        if (eingabe == loesung) {
            if (!fehler) {
                ausgabe("Gratulation", "Sehr gut - alles richtig", 5000, "info");
            }
            i = angabe[nummer].lsg.length;
            document.getElementById("btnWeiter").style.visibility = "visible";
            document.getElementById("btnCheck").style.visibility = "hidden";
            document.getElementById("Korrektur").style.visibility = "hidden";

        } else if (i == angabe[nummer].lsg.length - 1) {
            document.getElementById("Korrektur").style.visibility = "visible";

            ausgabe("Fehler", "Das passt noch nicht!<br><br> Beachte die Lösung:", 5000, "warning");
            var l = document.getElementById("Loesung");
            var f = document.getElementById("Fehler");
            l.innerHTML = "";
            f.innerHTML = "";
            for (var i = 0; i < angabe[nummer].lsg.length; i++) {
                loesung = angabe[nummer].lsg[i];
                l.innerHTML = l.innerHTML + loesung + "<br>";
                if (angabe[nummer].thisLoeschen) {
                    loesung = loesche(loesung, "this.");
                }
                f.innerHTML = f.innerHTML + vergleich(eingabe, loesung) + "<br>";
            }
            fehler = true;
            document.getElementById("Eingabe").focus();
        }
    }
}
function anzeigen() {
    document.getElementById("Angabe").innerHTML = angabe[nummer].txt;
    document.getElementById("Eingabe").value = "";
    document.getElementById("Loesung").innerHTML = "";
    document.getElementById("Fehler").innerHTML = "";

    document.getElementById("Korrektur").style.visibility = "hidden";

    document.getElementById("btnWeiter").style.visibility = "hidden";
    document.getElementById("btnCheck").style.visibility = "visible";

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

function zeichen(s) {
    eing = document.getElementById("Eingabe");
    eing.value = eing.value + s;
    eing.focus();
}


function weiter() {
    nummer++;
    if (!fehler) { richtig++; }
    if (nummer < angabe.length) {
        anzeigen();
    } else {
        endeAnzeigen();
    }
}
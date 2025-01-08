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
 //   document.getElementById("btnWeiter").innerHTML = "<Button class='small' onclick='weiter()'>Weiter</button>";
    document.getElementById("quelle").innerHTML = "2023 Rainer Hille <br> Unter Verwwendung von:  <br><a href='https://www.online-ide.de/'>Online-IDE von Martin Pabst</a><br><a href='https://www.cssscript.com/toast-style-web-notifications-in-vanilla-javascript-vanillatoasts/'>VanillaToasts.js</a>";
    /* 
    Variablen umwandeln 
    */

    angabe = jsonData.angabe;      // Allgemeine Angabe
    endText = jsonData.ende;       
    
    untertitel= jsonData.untertitel;
    
    nummer = 0;
    frage = true;
    startNummer(0);
}


href = window.location.href;
href = href.substring(0, href.lastIndexOf("/"));
xmlhttp.open("GET", href + "/data.json");
xmlhttp.send();

function start(){
       startNummer(1);
}

function startNummer(nr){
    nummer=nr;
    document.getElementById("btnWeiter").style.visibility="visible";
    document.getElementById("Ueberschrift").innerHTML=untertitel;
   
    anzeigen();

}
function weiter() {
    var dauer = (Date.now() - zeit) / 1000;
   //  dauer=200;
    if (frage && dauer < angabe[nummer].zeit) {
        var sdauer = "Gelöst in " + Math.round(dauer.toString()) + " Sekunden?";
        s = "Du solltest dich mindestens " + angabe[nummer].zeit + " Sekunden mit der Aufgabe beschäftigen!";
        ausgabe(sdauer, s, 3000, "info");
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
        txt = "Lösungsvorschlag " + (nummer + 1).toString() + "/" + angabe.length + ":<br> " + angabe[nummer].lsg;
      
        txt = txt+"<br><br><Button class='breit' onclick='weiter()'>Zur nächsten Frage</button>";
        s=s+"L";
        document.getElementById("javaCode").title="Zahlen2.java";
        document.getElementById("javaCode").src="Zahlen2.java";
        
    } else {
        txt = "Aufgabe " + (nummer + 1).toString() + "/" + angabe.length + ": " + angabe[nummer].txt;
        txt=txt+"<br>  <Button class='breit' onclick='weiter()'>Lösung</button>";
        
    }
    document.getElementById("Angabe").innerHTML = txt;
    // Bilder darstellen
    if (angabe[nummer].typA == "Bild"||angabe[nummer].typL == "Bild") {
        pfad = '<img class="big" src="' + href + '/Screenshot_' + s + '.png" width="'+(width*0.6).toString()+'">';
        document.getElementById("Bild").innerHTML = pfad;
   
    } else {
        document.getElementById("Bild").innerHTML = "";
   
    }
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
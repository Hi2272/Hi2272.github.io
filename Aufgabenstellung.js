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
    document.getElementById("btnWeiter").innerHTML = "<Button onclick='weiter()'>Weiter</button>";
    document.getElementById("quelle").innerHTML = "Bildquelle: " + jsonData.copyright +
        "<br>2022 Rainer Hille <br> Unter Verwwendung von  <a href='https://www.cssscript.com/toast-style-web-notifications-in-vanilla-javascript-vanillatoasts/'>VanillaToasts.js</a>";


    /* 
    Variablen umwandeln 
    */

    angabe = jsonData.angabe;      // Allgemeine Angabe
    txtAngabe=jsonData.txtAngabe;  // Textaufgabe an Stelle von Bildern
    endText = jsonData.ende;       
    typ = jsonData.typ;
    untertitel= jsonData.untertitel;
    
    nummer = 0;
    frage = true;
    start();
}


href = window.location.href;
href = href.substring(0, href.lastIndexOf("/"));
xmlhttp.open("GET", href + "/data.json");
xmlhttp.send();

function start(){
    menue=document.getElementById("Menue");
    menue.style.visibility='visible';
    document.getElementById("btnWeiter").style.visibility='hidden';
    document.getElementById("Angabe").innerHTML="Klicke auf die Übung, mit der du starten willst!<br>";
    document.getElementById("Ueberschrift").innerHTML="Hauptmenue";
   
    s="";
//     typ="Hallo";
    for (i=0;i<angabe.length;i++){
        if (typ=="Bild"){
            s1='<img src="' + href + '/Screenshot_' + (i+1).toString() + '.png" height=' + (height / 4).toString() + '>';
            s=s+'<Button onclick="startNummer('+i.toString()+')">'+s1+"</Button>";
        } else {
            s1='<Button style="width:'+(width/5).toString()+'px;"';
            s=s+s1+'onclick="startNummer('+i.toString()+')">'+txtAngabe[i]+"</button>"
        }
       }
    menue.innerHTML=s;

}

function startNummer(nr){
    nummer=nr;
    document.getElementById("Menue").style.visibility='hidden';
    document.getElementById("Menue").innerHTML="";
    
    document.getElementById("btnWeiter").style.visibility="visible";
    document.getElementById("Ueberschrift").innerHTML=untertitel;
   
    anzeigen();

}
function weiter() {
    var dauer = (Date.now() - zeit) / 1000;
   //  dauer=200;
    if (frage && dauer < angabe[nummer].zeit) {
        sdauer = "Gelöst in " + Math.round(dauer.toString()) + " Sekunden?";
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
        s = s + "L";
        txt = "Lösungsvorschlag:"
    } else {
        txt = "Aufgabe " + (nummer + 1).toString() + "/" + angabe.length + ": " + angabe[nummer].txt;
    }
    document.getElementById("Angabe").innerHTML = txt;
    if (typ == "Bild"||!frage) {
        pfad = '<img src="' + href + '/Screenshot_' + s + '.png" height=' + (height / 2).toString() + '>';
    } else {
        pfad = txtAngabe[nummer];
    }
    document.getElementById("Bild").innerHTML = pfad;
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
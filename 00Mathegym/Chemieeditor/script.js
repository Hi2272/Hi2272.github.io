function umwandeln() {

    let o1 = document.getElementById("o1")
    o1.value = "<eingabe_rad>Entscheide um welchen Reaktionstyp es sich hierbei handelt:<br>▇ Stoff A reagiert zu Stoff B und Stoff C.<br>▇ Stoff A und Stoff B reagieren zu Stoff C.<br>▇ Stoff A und Stoff B reagieren zu Stoff C und Stoff D.<br>▇ Stoff A reagiert zu Stoff B.</eingabe>"
    let o2 = document.getElementById("o2")
    let o3 = document.getElementById("o3")
    let o4 = document.getElementById("o4")
    let o41 = document.getElementById("o41");


    var elem = ["k1", "f1", "k2", "f2", "k3", "f3", "k4", "f4"];
    var s = [];
    for (var i = 0; i < elem.length; i++) {
        s[i] = document.getElementById(elem[i]).value;
    }
    var loesung = "<formel>";
    var html = "<span class=nobr>";
    var felder = "<formel>";
    var koeff = "<eingabe_slc><formel>";
    var auswahl = "´(slc~ ¦2¦3¦4¦5¦6¦7¦8¦9¦10)_";

    if (s[0] != "") {
        loesung = loesung + s[0] + "_"; // Koeffizient
        html = html + s[0] + " ";
    }
    koeff = koeff + auswahl;

    var s1 = convert(s[1]);
    loesung = loesung + s1;  // 1. Formel
    koeff = koeff + s1;
    felder = felder + "▇";
    html = html + convertHMTL(s[1]);

    var fkt = "¯´(&#040;)¯" + s1 + "¯´(&#041; )";
    document.getElementById("f").value = "<formel>" + s1 + "</formel>";
    document.getElementById("n").value = "_n" + fkt;
    document.getElementById("N").value = "_N" + fkt;
    document.getElementById("V").value = "_V" + fkt;
    document.getElementById("M").value = "_M" + fkt;
    document.getElementById("m").value = "_m" + fkt;
    document.getElementById("c").value = "_c" + fkt;






    if (s[3] != "") {  // Gibt es 2. Formel?
        loesung = loesung + "+";
        html = html + " + ";
        if (s[2] != "") {
            loesung = loesung + s[2] + "_";
            html = html + s[2] + " ";
        }
        s1 = convert(s[3]);
        loesung = loesung + s1;
        html = html + convertHMTL(s[3]);
        koeff = koeff + "+" + auswahl + s1;
        felder = felder + "+▇";

    }
    loesung = loesung + "_´(→)_";
    html = html + " → ";
    felder = felder + "_´(→)_";
    koeff = koeff + "_´(→)_";
    if (s[4] != "") {
        loesung = loesung + s[4] + "_"; // Koeffizient
        html = html + s[4] + " ";
    }
    s1 = convert(s[5]);
    loesung = loesung + s1;  // 1. Formel
    koeff = koeff + auswahl + s1;
    felder = felder + "▇";
    html = html + convertHMTL(s[5]);
    if (s[7] != "") {  // Gibt es 2. Formel?
        loesung = loesung + "+";
        html = html + " + ";
        if (s[6] != "") {
            loesung = loesung + s[6] + "_";
            html = html + s[6] + " ";
        }
        s1 = convert(s[7]);
        loesung = loesung + s1;
        html = html + convertHMTL(s[7]);
        felder = felder + "+▇";
        koeff = koeff + "+" + auswahl + s1;

    }

    o2.value = felder + "</formel>";
    o3.value = koeff + "</formel></eingabe>";
    o4.value = loesung + "</formel>";
    html = html + "</span>";
    o41.value = html;
    document.getElementById("html").innerHTML = html;
}

function isTxt(c) {
    return ((c >= "A" && c <= "Z") || (c >= "a" && c <= "z"));
}
function isNum(c) {
    return ((c >= "0" && c <= "9") || (c == "+") || (c == "−"));
}

function test() {
    var s = "(NH4)2HPO4";
    document.getElementById("o1").value = convert2(s);
    s = "O2^2-";
    document.getElementById("o2").value = convert2(s);
    s = "C17H35NH3^+";
    document.getElementById("o3").value = convert2(s);

}


function convert(s1) {
    s1 = s1.replaceAll("-", "−");
    var flag = "";  // "" = Start,"L"=Index,"H"=Ladung,"T"=Text,"K"=Klammer auf
    var s = "";
    var i = 0;
    while (i < s1.length) {
        c = s1.charAt(i);
        if (c == "(") {
            if (flag == "") {
                s = s + "¯´(&#040;)";
                flag = "K"
            } else if (flag == "T") {
                s = s + ")¦¦)¯´(&#040;)";
                flag = "K"
            } else if (flag == "L") {
                s = s + "¦)¯´(&#040;)";
                flag = "K"
            }

        } else if (isTxt(c)) {
            if (flag == "" || flag == "K") { // Start 
                s = s + "¯´(idz~(" + c;
                flag = "T";
            } else if (flag == "T") { // weiterer Buchstabe
                s = s + c;
            } else if (flag == "L") { // Buchstabe nach Index
                s = s + "¦)" + "¯´(idz~(" + c;
                flag = "T";
            } else if (flag == "H") {// Buchstabe nach Ladung
                s = s + "))" + "¯´(idz~(" + c;
                flag = "T";
            }
        } else if (c == ")") {
            if (flag == "T") {// nach Text
                s = s + ")¦)¯´(idz~(¯´(&#041;)";
            } else if (flag == "L") { // Nach Index
                s = s + "¦)" + "¯´(idz~(¯´(&#041;)";
                flag = "T";
            }

        } else if (isNum(c)) {
            if (flag == "T") { // Nach Text 
                s = s + ")¦" + c;
                flag = "L";
            } else if (flag == "L" || flag == "H") { // weitere Zahl
                s = s + c;
            }
        } else if (c == "^") { // Ladung }{
            if (flag == "T") { // Nach Text 
                s = s + ")¦¦´(";
            } else if (flag == "L") { // Nach Index
                s = s + "¦´(";
            }
            flag = "H";
        }
        i++;
    }
    if (flag == "T") { // Nach Text 
        s = s + ")¦¦)";
    }
    else if (flag == "H") { // Nach Ladung
        s = s + "))";
    } else if (flag == "L") { // Nach Index
        s = s + "¦)";
    }

    return s;
}

function convertHMTL(s1) {
    s1 = s1.replaceAll("-", "−");
    var flag = "";  // "" = Start,"L"=Index,"H"=Ladung,"T"=Text,"K"=Klammer auf
    var s = "";
    var i = 0;
    while (i < s1.length) {
        c = s1.charAt(i);
        if (c == "(") {
            if (flag == "") {
                s = s + "(";
                flag = "K"
            } else if (flag == "T") {
                s = s + ")";
                flag = "K"
            } else if (flag == "L") {
                s = s + "</sub>)";
                flag = "K"
            }

        } else if (isTxt(c)) {
            if (flag == "" || flag == "K") { // Start 
                s = s + c;
                flag = "T";
            } else if (flag == "T") { // weiterer Buchstabe
                s = s + c;
            } else if (flag == "L") { // Buchstabe nach Index
                s = s + "</sub>" + c;
                flag = "T";
            } else if (flag == "H") {// Buchstabe nach Ladung
                s = s + "</sup>" + c;
                flag = "T";
            }
        } else if (c == ")") {
            if (flag == "T") {// nach Text
                s = s + ")";
            } else if (flag == "L") { // Nach Index
                s = s + "</sub>)";
                flag = "T";
            }

        } else if (isNum(c)) {
            if (flag == "T") { // Nach Text 
                s = s + "<sub>" + c;
                flag = "L";
            } else if (flag == "L" || flag == "H") { // weitere Zahl
                s = s + c;
            }
        } else if (c == "^") { // Ladung }{
            if (flag == "T") { // Nach Text 
                s = s + "<sup>";
            } else if (flag == "L") { // Nach Index
                s = s + "</sub><sup>";
            }
            flag = "H";
        }
        i++;
    }
    if (flag == "T") { // Nach Text 
        s = s + "";
    }
    else if (flag == "H") { // Nach Ladung
        s = s + "</sup>";
    } else if (flag == "L") { // Nach Index
        s = s + "</sub>";
    }

    return s;
}



function convertAlt(s1) {
    s1 = s1.replaceAll("-", "−");

    var s = "";
    var i = 0;
    var c = s1.charAt(i);
    var cVor = '';
    while (i < s1.length) { // Buchstaben + Zahlen
        c = s1.charAt(i);
        if (c == "(") {
            s = s + "¯´(&#040;)";
        } else if (c == ")") {
            s = s + "¯´(&#041;)";
        } else if (c == "^") {
            s = s + "^´(";
            i++;
            while (i < s1.length) {
                c = s1.charAt(i);
                s = s + c;
                i++;
            }
            s = s + ")";
        } else if (c > "0" && c < "9") { // Zahlen werden in der Regel tiefgestellt
            s = s + "↓" + c;
            if (i < s1.length - 1) {
                s = s + "¯";
            }
        } else {
            s = s + c;
        }
        i++;
    }
    return s;

}

function anzeige(title, msg, dauer, type) {
    VanillaToasts.create({
        title: title,
        text: msg,
        timeout: dauer,
        type: type,
    });
}

function copy(id) {

    umwandeln();
    let loesung = id.value;
    navigator.clipboard.writeText(loesung);
    anzeige("Meldung", "Die Formel wurde in die Zwischenablage kopiert.", 2000, "success");


}



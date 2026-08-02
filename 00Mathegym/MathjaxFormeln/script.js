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
    var felder = "<formel>";
    var koeff = "<eingabe_slc><formel>";
    var auswahl = "´(slc~ ¦2¦3¦4¦5¦6¦7¦8¦9¦10)_";

    if (s[0] != "") {
        loesung = loesung + s[0] + "_"; // Koeffizient
    }
    koeff = koeff + auswahl;

    var s1 = convert(s[1]);
    loesung = loesung + s1;  // 1. Formel
    koeff = koeff + s1;
    felder = felder + "▇";

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
        if (s[2] != "") {
            loesung = loesung + s[2] + "_";
        }
        s1 = convert(s[3]);
        loesung = loesung + s1;
        koeff = koeff + "+" + auswahl + s1;
        felder = felder + "+▇";
    }
    loesung = loesung + "_´(→)_";
    felder = felder + "_´(→)_";
    koeff = koeff + "_´(→)_";
    if (s[4] != "") {
        loesung = loesung + s[4] + "_"; // Koeffizient
    }
    s1 = convert(s[5]);
    loesung = loesung + s1;  // 1. Produkt
    koeff = koeff + auswahl + s1;
    felder = felder + "▇";
    if (s[7] != "") {  // Gibt es 2. Produkt?
        loesung = loesung + "+";
        if (s[6] != "") {
            loesung = loesung + s[6] + "_";
        }
        s1 = convert(s[7]);
        loesung = loesung + s1;
        felder = felder + "+▇";
        koeff = koeff + "+" + auswahl + s1;
    }

    o2.value = felder + "</formel>";
    o3.value = koeff + "</formel></eingabe>";
    o4.value = loesung + "</formel>";

    // -------------------------
    // mhchem / MathJax-Ausgabe mit convertMathJax
    // -------------------------
    // Erzeuge Teile für linke und rechte Seite unter Verwendung von convertMathJax()
    var leftParts = [];
    var rightParts = [];

    if (s[1] && s[1].trim() !== "") {
        let part = (s[0] && s[0].trim() !== "" ? s[0].trim() + " " : "") + convertMathJax(s[1]);
        leftParts.push(part);
    }
    if (s[3] && s[3].trim() !== "") {
        let part = (s[2] && s[2].trim() !== "" ? s[2].trim() + " " : "") + convertMathJax(s[3]);
        leftParts.push(part);
    }

    if (s[5] && s[5].trim() !== "") {
        let part = (s[4] && s[4].trim() !== "" ? s[4].trim() + " " : "") + convertMathJax(s[5]);
        rightParts.push(part);
    }
    if (s[7] && s[7].trim() !== "") {
        let part = (s[6] && s[6].trim() !== "" ? s[6].trim() + " " : "") + convertMathJax(s[7]);
        rightParts.push(part);
    }

    var left = leftParts.join(' + ');
    var right = rightParts.join(' + ');

    if (left.trim() === "") left = " ";
    if (right.trim() === "") right = " ";

    // Pfeil-Beschriftungen (JS-Literal mit escaped Backslashes)
    var arrowLabels = "->[\\text{Hinreaktion}][\\text{Rückreaktion}]";

    // Gesamte Reaktion als \ce{ ... }
    var ceFull = "\\ce{" + left + " " + arrowLabels + " " + right + "}";

    // Setze das Feld o41 mit dem gesamten \ce{...}-Ausdruck
    o41.value = ceFull;
    
    // Rendern in der Div #Mathjax
const mathDiv = document.getElementById("Mathjax");
if (mathDiv) {
  // Anzeige als Display-Math; ceFull enthält z.B. "\ce{...}"
  mathDiv.innerHTML = '\\[' + ceFull + '\\]';
  if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([mathDiv]).catch(function(err){ console.error(err && err.message ? err.message : err); });
  }
}


    // Setze die neuen kf1..kf4 Felder jeweils mit dem kompletten \ce{...}-Ausdruck für die jeweilige Spezies
    if (document.getElementById("kf1")) {
        let v = (leftParts.length >= 1 ? "\\ce{" + leftParts[0] + "}" : "");
        document.getElementById("kf1").value = v;
    }
    if (document.getElementById("kf2")) {
        let v = (leftParts.length >= 2 ? "\\ce{" + leftParts[1] + "}" : "");
        document.getElementById("kf2").value = v;
    }
    if (document.getElementById("kf3")) {
        let v = (rightParts.length >= 1 ? "\\ce{" + rightParts[0] + "}" : "");
        document.getElementById("kf3").value = v;
    }
    if (document.getElementById("kf4")) {
        let v = (rightParts.length >= 2 ? "\\ce{" + rightParts[1] + "}" : "");
        document.getElementById("kf4").value = v;
    }
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
function convertMathJax(s1) {
    if (!s1) return "";
    let s = s1.trim();

    // typografisches Minus für alle '-' (vorzugsweise für Ladungen)
    s = s.replace(/-/g, "−");

    // Zustand (aq, s, g, l) am Ende extrahieren, z.B. "(aq)"
    let state = "";
    let stateMatch = s.match(/\((aq|s|g|l)\)$/i);
    if (stateMatch) {
        state = stateMatch[0];           // z.B. "(aq)"
        s = s.slice(0, stateMatch.index);
    }

    // Ladung mit ^... (am Ende oder irgendwo) extrahieren, z.B. ^2- oder ^{-}
    let charge = "";
   //    let chargeMatch = s.match(/\^\{?(\d*)([+\-])\}?$/) || s.match(/\^\{?(\d*)([+\-])\}?/);
   let chargeMatch = s.match(/\^\{?(\d*)([+\-\u2212])\}?/);

   if (chargeMatch) {
        let num = chargeMatch[1] || "";
        let sign = chargeMatch[2];
        let signOut = (sign === "+") ? "+" : "−";
        charge = "^{" + num + signOut + "}";               // immer geschweifte Klammern
        // Entferne die ursprüngliche ^... Notation (mit oder ohne geschweifte Klammern)
    s = s.replace(/\^\{?\d*[+\-\u2212]\}?/, "");
    }

    // Indizes: Zahl nach Buchstabe oder ')' -> _{zahl}
    s = s.replace(/([A-Za-z\)])(\d+)/g, '$1_{$2}');

    // Falls Gruppe wie (NH4)_{2} gewünscht ist: ')' gefolgt von _{n} bleibt erhalten durch obigen Schritt

    // Zusammensetzen: \mathrm{...^{charge}}_{(state)}
    let inner = s + (charge ? charge : "");
    let result = "\\mathrm{" + inner + "}" + (state ? "_{" + state + "}" : "");

    return result;
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

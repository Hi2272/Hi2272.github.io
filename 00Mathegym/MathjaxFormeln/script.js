function convertMathJax(s1) {
    if (!s1) return "";

    let s = s1.trim();

    // ASCII-Minus in typografisches Minus umwandeln
    s = s.replace(/-/g, "−");

    // Zustand am Ende extrahieren, z. B. "(aq)", "(s)", "(l)" oder "(g)"
    let state = "";
    let stateMatch = s.match(/\((aq|s|g|l)\)$/i);

    if (stateMatch) {
        state = stateMatch[0];
        s = s.slice(0, stateMatch.index);
    }

    // Ladung extrahieren, z. B. ^2-, ^{2-}, ^+, ^−
    let charge = "";
    let chargeMatch = s.match(/\^\{?(\d*)([+\-\u2212])\}?/);

    if (chargeMatch) {
        let number = chargeMatch[1] || "";
        let sign = chargeMatch[2] === "+" ? "+" : "−";

        // Ladungen immer mit geschweiften Klammern ausgeben
        charge = "^{" + number + sign + "}";

        // Ursprüngliche Ladung aus der Formel entfernen
        s = s.replace(/\^\{?\d*[+\-\u2212]\}?/, "");
    }

    // Zahlen nach Elementen oder Klammern tiefstellen
    s = s.replace(/([A-Za-z\)])(\d+)/g, "$1_{$2}");

    // Zustand an den letzten Index anhängen:
    // SO4^2-(aq) -> \mathrm{SO_{4(aq)}^{2−}}
    if (state) {
        let indexStart = s.lastIndexOf("_{");

        if (indexStart !== -1) {
            let indexEnd = s.indexOf("}", indexStart);

            if (indexEnd !== -1) {
                s = s.slice(0, indexEnd) + state + s.slice(indexEnd);
            } else {
                s += "_{" + state + "}";
            }
        } else {
            // Beispiel: Na+(aq) -> \mathrm{Na_{(aq)}^{+}}
            s += "_{" + state + "}";
        }
    }

    return "\\mathrm{" + s + charge + "}";
}

function formelMitKoeffizient(koeffizient, formel) {
    if (!formel || formel.trim() === "") {
        return "";
    }

    let koeff = koeffizient && koeffizient.trim() !== ""
        ? koeffizient.trim() + " "
        : "";

    return koeff + convertMathJax(formel);
}

function umwandeln() {
    const k1 = document.getElementById("k1").value;
    const f1 = document.getElementById("f1").value;

    const k2 = document.getElementById("k2").value;
    const f2 = document.getElementById("f2").value;

    const k3 = document.getElementById("k3").value;
    const f3 = document.getElementById("f3").value;

    const k4 = document.getElementById("k4").value;
    const f4 = document.getElementById("f4").value;

const pfeilart = document.querySelector(
    'input[name="pfeilart"]:checked'
).value;

const textOben = document.getElementById("pfeilOben").value.trim();
const textUnten = document.getElementById("pfeilUnten").value.trim();

const pfeilSymbole = {
    "rechts": "->",
    "links": "<-",
    "gleichgewicht": "<=>",
    "gleichgewicht-links": "<<=>",
    "gleichgewicht-rechts": "<=>>"
};

const pfeilSymbol = pfeilSymbole[pfeilart] || "->";

let pfeil = pfeilSymbol;

if (textOben !== "" || textUnten !== "") {
    pfeil += "[\\text{" + textOben + "}][\\text{" + textUnten + "}]";
}

    const links = [];
    const rechts = [];

    const teil1 = formelMitKoeffizient(k1, f1);
    const teil2 = formelMitKoeffizient(k2, f2);
    const teil3 = formelMitKoeffizient(k3, f3);
    const teil4 = formelMitKoeffizient(k4, f4);

    if (teil1) links.push(teil1);
    if (teil2) links.push(teil2);
    if (teil3) rechts.push(teil3);
    if (teil4) rechts.push(teil4);

    // Einzelne MathJax-Ausdrücke für die vier Textfelder
    document.getElementById("kf1").value = teil1 ? "\\ce{" + teil1 + "}" : "";
    document.getElementById("kf2").value = teil2 ? "\\ce{" + teil2 + "}" : "";
    document.getElementById("kf3").value = teil3 ? "\\ce{" + teil3 + "}" : "";
    document.getElementById("kf4").value = teil4 ? "\\ce{" + teil4 + "}" : "";

    const linkeSeite = links.join(" + ");
    const rechteSeite = rechts.join(" + ");

    const ceFull = "\\ce{" + linkeSeite + " " + pfeil + " " + rechteSeite + "}";

    document.getElementById("o41").value = ceFull;

    // MathJax-Ausgabe zurücksetzen und neu rendern
    const mathDiv = document.getElementById("mathjax");
    mathDiv.innerHTML = "\\[" + ceFull + "\\]";

    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetClear([mathDiv]);

        MathJax.typesetPromise([mathDiv]).catch(function (error) {
            console.error("MathJax-Fehler:", error);
        });
    }
}

function copyMathJax() {
    const output = document.getElementById("o41");

    navigator.clipboard.writeText(output.value).catch(function (error) {
        console.error("Kopieren fehlgeschlagen:", error);
    });
}

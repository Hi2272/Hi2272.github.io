function convertMathJax(s1) {
    if (!s1) return "";

   let s =s1.trim();


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
    s="\\mathrm{" + s + charge + "}";
   // s= s=="\\mathrm{H_{3(aq)}O^{+}}"  ? "\\mathrm{H_{3}}\\mathrm{O_{(aq)}^{+}}" : s;
   s = korrigiereAggregatzustand(s);
    return s;
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
document.getElementById("kf1").value = formelMitGroesse(teil1);
document.getElementById("kf2").value = formelMitGroesse(teil2);
document.getElementById("kf3").value = formelMitGroesse(teil3);
document.getElementById("kf4").value = formelMitGroesse(teil4);


    const mathKf1 = document.getElementById("mathKf1");
const mathKf2 = document.getElementById("mathKf2");
const mathKf3 = document.getElementById("mathKf3");
const mathKf4 = document.getElementById("mathKf4");

mathKf1.textContent = teil1
    ? "\\(" + mathJaxFormelMitGroesse(teil1) + "\\)"
    : "";

mathKf2.textContent = teil2
    ? "\\(" + mathJaxFormelMitGroesse(teil2) + "\\)"
    : "";

mathKf3.textContent = teil3
    ? "\\(" + mathJaxFormelMitGroesse(teil3) + "\\)"
    : "";

mathKf4.textContent = teil4
    ? "\\(" + mathJaxFormelMitGroesse(teil4) + "\\)"
    : "";


if (window.MathJax && MathJax.typesetPromise) {
    MathJax.typesetPromise([
        mathKf1,
        mathKf2,
        mathKf3,
        mathKf4
    ]).catch(function(error) {
        console.error("MathJax-Fehler bei den Einzel-Formeln:", error);
    });
}


    const linkeSeite = links.join(" + ");
    const rechteSeite = rechts.join(" + ");

    const ceFull = "\\ce{" + linkeSeite + " " + pfeil + " " + rechteSeite + "}";

    document.getElementById("o41").value = ceFull;

    // MathJax-Ausgabe zurücksetzen und neu rendern
const mathDiv = document.getElementById("mathjax");

if (mathDiv) {
    // Bereits gerenderte MathJax-Inhalte vollständig entfernen
    if (window.MathJax && MathJax.typesetClear) {
        MathJax.typesetClear([mathDiv]);
    }

    // Alten Inhalt entfernen, damit nichts doppelt gerendert wird
    mathDiv.replaceChildren();

    // MathJax-Code nur einmal einsetzen
    mathDiv.textContent = "\\[" + ceFull + "\\]";

    if (window.MathJax && MathJax.typesetPromise) {
        MathJax.typesetPromise([mathDiv]).catch(function(error) {
            console.error("MathJax-Fehler:", error);
        });
    }
}

}

function copyMathJax() {
    const output = document.getElementById("o41");

    navigator.clipboard.writeText(output.value).catch(function (error) {
        console.error("Kopieren fehlgeschlagen:", error);
    });
            anzeige("Hinweis","Die MathJax-Formel wurde kopiert.",3000,"success");

}

// Ersetze copyMathJaxAsImage() vollständig durch diese Funktion:
async function copyMathJaxAsImage() {
    const original = document.getElementById("mathjax");

    if (!original || !original.querySelector("mjx-container")) {
        anzeige("Hinweis","Es ist keine gerenderte MathJax-Formel vorhanden.",3000,"error");
        return;
    }

    try {
        const clone = original.cloneNode(true);

        // Unsichtbare MathJax-Zusatzinhalte entfernen,
        // damit Text und Pfeil nicht doppelt erfasst werden.
        clone.querySelectorAll(
            ".MJX_Assistive_MathML, mjx-assistive-mml, .mjx-assistive-mml"
        ).forEach(function(element) {
            element.remove();
        });

        const wrapper = document.createElement("div");

        wrapper.style.position = "fixed";
        wrapper.style.left = "0";
        wrapper.style.top = "0";
        wrapper.style.margin = "0";
        wrapper.style.padding = "0";
        wrapper.style.background = "white";
        wrapper.style.display = "inline-block";
        wrapper.style.width = "max-content";
        wrapper.style.height = "max-content";
        wrapper.style.lineHeight = "normal";
        wrapper.style.transform = "none";
        wrapper.style.boxSizing = "border-box";

        clone.style.margin = "0";
        clone.style.padding = "0";
        clone.style.transform = "none";
        clone.style.position = "static";

        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        // Browser-Layout vor dem Erfassen aktualisieren
        await new Promise(function(resolve) {
            requestAnimationFrame(function() {
                requestAnimationFrame(resolve);
            });
        });

        const rect = clone.getBoundingClientRect();

        const canvas = await html2canvas(wrapper, {
            backgroundColor: "white",
            scale: 2,
            x: 0,
            y: 0,
            width: Math.ceil(rect.width),
            height: Math.ceil(rect.height),
            scrollX: 0,
            scrollY: 0,
            logging: false,
            useCORS: true
        });

        wrapper.remove();

        const blob = await new Promise(function(resolve) {
            canvas.toBlob(resolve, "image/png");
        });

        if (!blob) {
            throw new Error("Das Bild konnte nicht erzeugt werden.");
        }

        await navigator.clipboard.write([
            new ClipboardItem({
                "image/png": blob
            })
        ]);

        anzeige("Hinweis","Die MathJax-Formel wurde als Bild kopiert.",3000,"success");

    } catch (error) {
        console.error("Fehler beim Kopieren als Bild:", error);
        anzeige("Hinweis","Das Bild konnte nicht in die Zwischenablage kopiert werden.",3000,"error");
    }
}

function anzeige(title, msg, dauer, type) {
    VanillaToasts.create({
        title: title,
        text: msg,
        timeout: dauer,
        type: type,
    });
}

function korrigiereAggregatzustand(s) {
    if (!s || typeof s !== "string") {
        return s;
    }

    return s.replace(
        /\\mathrm\{((?:[^{}]|\{[^{}]*\})*)\}/g,
        function (gesamterAusdruck, inhalt) {
            let zustand = "";

            /*
             * Aggregatzustand aus einem fehlerhaften Index entfernen:
             *
             * O_{2(g)}     -> O_{2}
             * H_{3(aq)}O  -> H_{3}O
             */
            inhalt = inhalt.replace(
                /_\{([^{}]*?)\((aq|s|l|g)\)\}/gi,
                function (_, indexInhalt, gefundenerZustand) {
                    zustand = "(" + gefundenerZustand.toLowerCase() + ")";

                    return indexInhalt
                        ? "_{" + indexInhalt + "}"
                        : "";
                }
            );

            // Kein fehlerhafter Aggregatzustand gefunden
            if (!zustand) {
                return gesamterAusdruck;
            }

            /*
             * Letztes Atomsymbol mit optionalem Index und optionaler Ladung:
             *
             * O
             * O_{2}
             * O^{+}
             * O_{2}^{2-}
             */
            const letztesAtomMuster =
                /([A-Z][a-z]?)(?:_\{([^{}]*)\})?(?:\^\{([^{}]*)\})?$/;

            const treffer = inhalt.match(letztesAtomMuster);

            if (!treffer) {
                return gesamterAusdruck;
            }

            const atomsymbol = treffer[1];
            const vorhandenerIndex = treffer[2] || "";
            const ladung = treffer[3]
                ? "^{" + treffer[3] + "}"
                : "";

            /*
             * Falls bereits ein Index vorhanden ist, wird der
             * Aggregatzustand in diesen Index integriert:
             *
             * O_{2} -> O_{2(g)}
             *
             * Ohne vorhandenen Index:
             *
             * O^{+} -> O_{(aq)}^{+}
             */
            const neuerIndex = vorhandenerIndex
                ? vorhandenerIndex + zustand
                : zustand;

            const korrigiertesAtom =
                atomsymbol +
                "_{" +
                neuerIndex +
                "}" +
                ladung;

            return (
                "\\mathrm{" +
                inhalt.slice(0, -treffer[0].length) +
                korrigiertesAtom +
                "}"
            );
        }
    );
}

async function kopiereKfTextbox(button) {
    const zielId = button.dataset.target;
    const textbox = document.getElementById(zielId);

    if (!textbox) {
        console.error("Textbox nicht gefunden:", zielId);
        return;
    }

    try {
        await navigator.clipboard.writeText(textbox.value);

        anzeige(
            "Hinweis",
            "Der Inhalt wurde in die Zwischenablage kopiert.",
            3000,
            "success"
        );
    } catch (error) {
        console.error("Kopieren fehlgeschlagen:", error);

        // Fallback für Umgebungen ohne Clipboard API
        textbox.focus();
        textbox.select();

        try {
            document.execCommand("copy");

            anzeige(
                "Hinweis",
                "Der Inhalt wurde in die Zwischenablage kopiert.",
                3000,
                "success"
            );
        } catch (fallbackError) {
            console.error("Fallback-Kopieren fehlgeschlagen:", fallbackError);

            anzeige(
                "Fehler",
                "Der Inhalt konnte nicht kopiert werden.",
                3000,
                "error"
            );
        }

        textbox.blur();
    }
}
document.querySelectorAll(".copy-kf-btn").forEach(function(button) {
    button.addEventListener("click", function() {
        kopiereKfTextbox(button);
    });
});


document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".copy-kf-image-btn").forEach(function(button) {
        button.addEventListener("click", function() {
            kopiereMathJaxAlsBild(button.dataset.target);
        });
    });
});


async function kopiereMathJaxAlsBild(elementId) {
    const original = document.getElementById(elementId);

    if (!original || !original.querySelector("mjx-container")) {
        anzeige(
            "Hinweis",
            "Es ist keine gerenderte Formel vorhanden.",
            3000,
            "error"
        );
        return;
    }

    let wrapper = null;

    try {
        const clone = original.cloneNode(true);

        clone.querySelectorAll(
            ".MJX_Assistive_MathML, mjx-assistive-mml, .mjx-assistive-mml"
        ).forEach(function(element) {
            element.remove();
        });

        wrapper = document.createElement("div");

        wrapper.style.position = "fixed";
        wrapper.style.left = "0";
        wrapper.style.top = "0";
        wrapper.style.margin = "0";
        wrapper.style.padding = "0";
        wrapper.style.background = "white";
        wrapper.style.display = "inline-block";
        wrapper.style.width = "max-content";
        wrapper.style.height = "max-content";
        wrapper.style.lineHeight = "normal";
        wrapper.style.boxSizing = "border-box";

        clone.style.margin = "0";
        clone.style.padding = "0";
        clone.style.transform = "none";

        wrapper.appendChild(clone);
        document.body.appendChild(wrapper);

        await new Promise(function(resolve) {
            requestAnimationFrame(function() {
                requestAnimationFrame(resolve);
            });
        });

        const rect = clone.getBoundingClientRect();

        const canvas = await html2canvas(wrapper, {
            backgroundColor: "white",
            scale: 2,
            x: 0,
            y: 0,
            width: Math.ceil(rect.width),
            height: Math.ceil(rect.height),
            scrollX: 0,
            scrollY: 0,
            logging: false,
            useCORS: true
        });

        const blob = await new Promise(function(resolve) {
            canvas.toBlob(resolve, "image/png");
        });

        if (!blob) {
            throw new Error("Das Bild konnte nicht erzeugt werden.");
        }

        await navigator.clipboard.write([
            new ClipboardItem({
                "image/png": blob
            })
        ]);

        anzeige(
            "Hinweis",
            "Die Formel wurde als Bild kopiert.",
            3000,
            "success"
        );
    } catch (error) {
        console.error("Fehler beim Kopieren der Formel:", error);

        anzeige(
            "Fehler",
            "Die Formel konnte nicht als Bild kopiert werden.",
            3000,
            "error"
        );
    } finally {
        if (wrapper) {
            wrapper.remove();
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const erstesTextfeld = document.getElementById("k1");

    if (erstesTextfeld) {
        erstesTextfeld.focus();
    }
});


function formelMitGroesse(formel) {
const groesse = document.getElementById("Groesse").value.trim();

    if (!formel) {
        return "";
    }

    const mathJaxFormel = "\\ce{" + formel + "}";

    return groesse
        ? "\\text{" + groesse + "}(" + mathJaxFormel + ")"
        : mathJaxFormel;
}

function mathJaxFormelMitGroesse(formel) {
const groesse = document.getElementById("Groesse").value.trim();

    if (!formel) {
        return "";
    }

    return groesse
        ? "\\text{" + groesse + "}(" + formel + ")"
        : formel;
}

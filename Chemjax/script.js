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

function zerlegeSeite(eingabe) {
    if (!eingabe || eingabe.trim() === "") {
        return [];
    }

    /*
     * Die einzelnen Stoffe müssen – wie in der Hilfe beschrieben –
     * durch Leerzeichen, Pluszeichen und Leerzeichen getrennt sein.
     *
     * Beispiel:
     * 2 Na^+(aq) + SO4^2-(aq)
     */
    return eingabe
        .trim()
        .split(/\s+\+\s+/)
        .map(function(stoff) {
            return convertMathJax(stoff);
        })
        .filter(function(stoff) {
            return stoff !== "";
        });
}

function umwandeln() {
    // Werte direkt aus den beiden Eingabefeldern lesen
    const edukteEingabe = document.getElementById("edukte").value;
    const produkteEingabe = document.getElementById("produkte").value;

    const pfeilartElement = document.querySelector(
        'input[name="pfeilart"]:checked'
    );

    const pfeilart = pfeilartElement
        ? pfeilartElement.value
        : "rechts";

    const textOben = document.getElementById("pfeilOben").value.trim();
    const textUnten = document.getElementById("pfeilUnten").value.trim();

    const pfeilSymbole = {
        "rechts": "->",
        "links": "<-",
        "gleichgewicht": "<=>",
        "gleichgewicht-links": "<<=>",
        "gleichgewicht-rechts": "<=>>"
    };

    // Edukte und Produkte jeweils an „ + “ trennen
    const links = zerlegeSeite(edukteEingabe);
    const rechts = zerlegeSeite(produkteEingabe);

    const linkeSeite = links.join(" + ");
    const rechteSeite = rechts.join(" + ");

    let inhalt = "";

    // Einzelne Formel ohne Pfeil
    if (pfeilart === "kein-pfeil") {
        inhalt = [linkeSeite, rechteSeite]
            .filter(function(seite) {
                return seite !== "";
            })
            .join(" ");
    } else {
        let pfeil = pfeilSymbole[pfeilart] || "->";

        // Beschriftung über bzw. unter dem Reaktionspfeil
        if (textOben !== "" || textUnten !== "") {
            pfeil += "[\\text{" + textOben + "}][\\text{" + textUnten + "}]";
        }

        inhalt = linkeSeite + " " + pfeil + " " + rechteSeite;
    }

    // Vollständigen mhchem-/MathJax-Code erzeugen
    const ceFull = "\\ce{" + inhalt.trim() + "}";

    // MathJax-Code in das Ausgabefeld schreiben
    document.getElementById("o41").value = ceFull;

    // Vorhandene Ausgabe entfernen und neu rendern
    const mathDiv = document.getElementById("mathjax");

    if (mathDiv) {
        if (window.MathJax && MathJax.typesetClear) {
            MathJax.typesetClear([mathDiv]);
        }

        mathDiv.replaceChildren();
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

    /*
     * Erkennt beispielsweise:
     *
     * \mathrm{[Ag(NH_{3})_{2}]^{+}(aq)}
     * \mathrm{[Ag(NH_{3})_{2(aq)}]^{+}}
     *
     * und erzeugt:
     *
     * \mathrm{[Ag(NH_{3})_{2}]_{(aq)}^{+}}
     */

    const zustandsMatch = s.match(/\((aq|s|l|g)\)/i);

    if (!zustandsMatch) {
        return s;
    }

    const zustand = "(" + zustandsMatch[1].toLowerCase() + ")";

    // Alle bisherigen Zustandsangaben entfernen
    let formel = s.replace(/\((aq|s|l|g)\)/gi, "");

    /*
     * Komplexe in eckigen Klammern erkennen:
     *
     * [Ag(NH_{3})_{2}]
     *
     * Der Aggregatzustand wird als Index hinter der
     * eckigen Klammer und vor der Ladung eingefügt.
     */
    const komplexMuster =
        /(\\mathrm\{)(\[[\s\S]*?\])(\^\{[^{}]*\})?(\})$/;

    const komplexTreffer = formel.match(komplexMuster);

    if (komplexTreffer) {
        const einleitung = komplexTreffer[1];
        const komplex = komplexTreffer[2];
        const ladung = komplexTreffer[3] || "";
        const abschluss = komplexTreffer[4];

        return (
            einleitung +
            komplex +
            "_{" +
            zustand +
            "}" +
            ladung +
            abschluss
        );
    }

    /*
     * Allgemeiner Fall:
     *
     * O_{2(g)}       -> O_{2(g)}
     * H_{3(aq)}O^{+} -> H_{3}O_{(aq)}^{+}
     */

    const letztesAtomMuster =
        /([A-Z][a-z]?)(?:_\{([^{}]*)\})?(?:\^\{([^{}]*)\})?(\})$/;

    const atomTreffer = formel.match(letztesAtomMuster);

    if (!atomTreffer) {
        return s;
    }

    const atomsymbol = atomTreffer[1];
    const vorhandenerIndex = atomTreffer[2] || "";
    const ladung = atomTreffer[3]
        ? "^{" + atomTreffer[3] + "}"
        : "";

    const neuerIndex = vorhandenerIndex
        ? vorhandenerIndex + zustand
        : zustand;

    return (
        formel.slice(0, -atomTreffer[0].length) +
        atomsymbol +
        "_{" +
        neuerIndex +
        "}" +
        ladung +
        "}"
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
    const erstesTextfeld = document.getElementById("edukte");

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

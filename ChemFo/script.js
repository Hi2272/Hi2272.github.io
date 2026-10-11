function convertMathJax(s1) {
    if (!s1 || s1.trim() === "") {
        return "";
    }

    let eingabe = s1.trim();

    // Einheitliches Minuszeichen verwenden
    eingabe = eingabe.replace(/−/g, "-");

    /*
     * Dezimalkommas in Oxidationszahlen schützen.
     *
     * Beispiel:
     *
     * C(+4,5)O2
     *
     * wird intern zu:
     *
     * C(+4§5)O2
     *
     * Dadurch wird das Komma nicht als separates
     * Formelzeichen verarbeitet.
     */
    eingabe = eingabe.replace(
        /\(([+-]?\d+)[,.](\d+)\)/g,
        "($1§$2)"
    );

    /*
     * Abschließenden Multiplikator erkennen:
     *
     * |*2
     * | * 2
     */
    let endMultiplikator = "";

    const multiplikatorMatch = eingabe.match(
        /\*\s*(\d+)\s*$/
    );

    if (multiplikatorMatch) {
        endMultiplikator =
            "\\mathbin{\\cdot}\\," +
            multiplikatorMatch[1];

        eingabe = eingabe
            .slice(0, multiplikatorMatch.index)
            .trimEnd();
    }

    /*
     * Den Teil nach dem Formelstrich abtrennen.
     *
     * Beispiel:
     *
     * C(+4§5)O2 ->[\text{Verbrennung}]
     *
     * Der Reaktionspfeil bleibt außerhalb
     * der Formelverarbeitung.
     */
    let restNachFormel = "";

    const pfeilIndex = eingabe.indexOf("->");

    if (pfeilIndex !== -1) {
        restNachFormel =
            eingabe.slice(pfeilIndex);

        eingabe =
            eingabe
                .slice(0, pfeilIndex)
                .trimEnd();
    }

    /*
     * Den Teil nach einem senkrechten Strich abtrennen.
     *
     * Beispiel:
     *
     * H2O(l) |*2
     */
    const trennzeichenIndex =
        eingabe.indexOf("|");

    if (trennzeichenIndex !== -1) {
        const rest =
            eingabe.slice(trennzeichenIndex);

        eingabe =
            eingabe
                .slice(0, trennzeichenIndex)
                .trimEnd();

        restNachFormel += rest;
    }

    /*
     * Aggregatzustand erkennen.
     *
     * Unterstützt:
     *
     * H2O(l)
     * SO3^2-(aq)
     * SO3(aq)^2-
     */
    let zustand = "";

    const zustandsMatch = eingabe.match(
        /\((aq|s|l|g)\)/i
    );

    if (zustandsMatch) {
        zustand =
            "(" +
            zustandsMatch[1].toLowerCase() +
            ")";

        eingabe =
            eingabe.slice(0, zustandsMatch.index) +
            eingabe.slice(
                zustandsMatch.index +
                zustandsMatch[0].length
            );

        eingabe = eingabe.trim();
    }

    /*
     * Ladung erkennen:
     *
     * ^+
     * ^-
     * ^2+
     * ^{2-}
     */
    let ladung = "";

    const ladungsMatch = eingabe.match(
        /\^\{?(\d*)([+-])\}?$/
    );

    if (ladungsMatch) {
        const zahl =
            ladungsMatch[1] || "";

        const vorzeichen =
            ladungsMatch[2];

        ladung =
            zahl + vorzeichen;

        eingabe =
            eingabe
                .slice(0, ladungsMatch.index)
                .trimEnd();
    }

    /*
     * Führenden Koeffizienten erkennen.
     *
     * 2 H2O
     * 3 CO2
     */
    let koeffizient = "";

    const koeffizientenMatch =
        eingabe.match(/^(\d+)\s+/);

    if (koeffizientenMatch) {
        koeffizient =
            koeffizientenMatch[1] + " ";

        eingabe =
            eingabe.slice(
                koeffizientenMatch[0].length
            );
    }

    /*
     * Formelbestandteile zerlegen.
     *
     * Die Funktion muss Oxidationszahlen in der
     * folgenden Form erkennen:
     *
     * (+4)
     * (-2)
     * (+4§5)
     *
     * Das Sonderzeichen § wird anschließend wieder
     * als Dezimalkomma ausgegeben.
     */
    const formel =
        formelInElementeAufteilen(eingabe);

    /*
     * Geschütztes Dezimalkomma wieder in ein
     * mathematisch gesetztes Komma umwandeln.
     */
    formel.elemente.forEach(function(element) {
        if (element.tex) {
            element.tex =
                element.tex.replace(
                    /§/g,
                    ","
                );
        }

        if (element.index) {
            element.index =
                element.index.replace(
                    /§/g,
                    ","
                );
        }

        if (element.oxidationszahl) {
            element.oxidationszahl =
                element.oxidationszahl.replace(
                    /§/g,
                    ","
                );
        }
    });

    /*
     * Aggregatzustand am letzten chemischen Element
     * oder an der letzten Gruppe ergänzen.
     */
    if (
        zustand &&
        formel.elemente &&
        formel.elemente.length > 0
    ) {
        const zustandTex =
            "\\mathrm{" + zustand + "}";

        let zustandsElement = null;

        for (
            let i = formel.elemente.length - 1;
            i >= 0;
            i--
        ) {
            const element =
                formel.elemente[i];

            const tex =
                element.tex || "";

            const istLeerzeichen =
                tex === "\\text{ }" ||
                tex === "\\text{\\ }" ||
                tex.trim() === "";

            const istTrennzeichen =
                tex === "\\text{|}";

            if (
                !istLeerzeichen &&
                !istTrennzeichen
            ) {
                zustandsElement =
                    element;

                break;
            }
        }

        if (zustandsElement) {
            if (zustandsElement.index) {
                zustandsElement.index +=
                    zustandTex;
            } else {
                zustandsElement.index =
                    zustandTex;
            }
        }
    }

    /*
     * Formelbestandteile zusammensetzen.
     *
     * Index und Ladung nehmen durch \phantom
     * horizontalen Platz ein.
     */
    const ergebnis =
        formel.elemente.map(function(element, index) {
            let teil =
                element.tex || "";

            const istLetztesElement =
                index ===
                formel.elemente.length - 1;

            const hatIndex =
                Boolean(element.index);

            const hatLadung =
                Boolean(
                    ladung &&
                    istLetztesElement
                );

            if (hatIndex && hatLadung) {
                const indexTex =
                    "_{" +
                    element.index +
                    "}";

                const ladungsTex =
                    "^{" +
                    ladung +
                    "}";

                const zusatz =
                    indexTex +
                    ladungsTex;

                teil +=
                    "\\rlap{" +
                    zusatz +
                    "}" +
                    "\\phantom{" +
                    zusatz +
                    "}";

                ladung = "";
            } else if (hatIndex) {
                const indexTex =
                    "_{" +
                    element.index +
                    "}";

                teil +=
                    "\\rlap{" +
                    indexTex +
                    "}" +
                    "\\phantom{" +
                    indexTex +
                    "}";
            } else if (hatLadung) {
                const ladungsTex =
                    "^{" +
                    ladung +
                    "}";

                teil +=
                    "\\rlap{" +
                    ladungsTex +
                    "}" +
                    "\\phantom{" +
                    ladungsTex +
                    "}";

                ladung = "";
            }

            return teil;
        }).join("");

    /*
     * Sicherheitsfall für eine noch nicht verarbeitete
     * Ladung.
     */
    let ergebnisMitLadung =
        ergebnis;

    if (ladung) {
        const ladungsTex =
            "^{" +
            ladung +
            "}";

        ergebnisMitLadung +=
            "\\rlap{" +
            ladungsTex +
            "}" +
            "\\phantom{" +
            ladungsTex +
            "}";
    }

    return (
        koeffizient +
        ergebnisMitLadung +
        restNachFormel +
        endMultiplikator
    );
}
function formelInElementeAufteilen(eingabe) {
    const elemente = [];

    if (!eingabe || eingabe.trim() === "") {
        return {
            elemente: elemente,
            letztesElement: null
        };
    }

    let i = 0;

    /*
     * Sonderzeichen für geschützte Dezimalkommas
     * wieder in ein mathematisches Dezimalkomma
     * umwandeln.
     */
    function formatiereOxidationszahl(oxidationszahl) {
        return oxidationszahl.replace(
            /[,.]/g,
            ","
        );
    }

    /*
     * Chemische Elementsymbole erkennen:
     *
     * H
     * O
     * Fe
     * Cl
     */
    function istElementsymbolStart(zeichen) {
        return /^[A-Z]$/.test(zeichen);
    }

    /*
     * Ein Formelbestandteil wird als Objekt gespeichert:
     *
     * {
     *     tex: "\\mathrm{O}",
     *     index: "3"
     * }
     */
    function elementHinzufuegen(
        tex,
        index,
        istChemischesElement
    ) {
        const element = {
            tex: tex,
            index: index || ""
        };

        elemente.push(element);

        if (istChemischesElement) {
            letztesElement = element;
        }

        return element;
    }

    let letztesElement = null;

    while (i < eingabe.length) {
        const zeichen = eingabe[i];

        /*
         * Leerzeichen erhalten.
         */
        if (/\s/.test(zeichen)) {
            let leerzeichen = "";

            while (
                i < eingabe.length &&
                /\s/.test(eingabe[i])
            ) {
                leerzeichen += eingabe[i];
                i++;
            }

            elementHinzufuegen(
                "\\text{ }",
                "",
                false
            );

            continue;
        }

        /*
         * Elementsymbol erkennen.
         *
         * Beispiel:
         *
         * Fe
         * Cl
         * O
         */
        if (istElementsymbolStart(zeichen)) {
            let symbol = zeichen;
            i++;

            if (
                i < eingabe.length &&
                /^[a-z]$/.test(eingabe[i])
            ) {
                symbol += eingabe[i];
                i++;
            }

            /*
             * Oxidationszahl direkt hinter dem
             * Elementsymbol erkennen.
             *
             * Beispiele:
             *
             * C(+4)
             * C(+4,5)
             * O(-2)
             */
            let oxidationszahl = "";

            const rest =
                eingabe.slice(i);

           const oxidationszahlMatch =
    rest.match(
        /^\(([+-]?\d+(?:[,.§]\d+)?)\)/
    );

            if (oxidationszahlMatch) {
                oxidationszahl =
                    oxidationszahlMatch[1];

                i += oxidationszahlMatch[0].length;
            }

            /*
             * Index erkennen.
             *
             * Beispiele:
             *
             * O2
             * O12
             */
            let index = "";

            while (
                i < eingabe.length &&
                /\d/.test(eingabe[i])
            ) {
                index += eingabe[i];
                i++;
            }

            let elementTex =
                "\\mathrm{" + symbol + "}";

            /*
             * Oxidationszahl rot über dem
             * Elementsymbol ausgeben.
             */
            if (oxidationszahl !== "") {
                const oxidationszahlTex =
                    formatiereOxidationszahl(
                        oxidationszahl
                    );

                elementTex =
                    "\\overset{" +
                        "\\color{red}{\\scriptscriptstyle " +
                        oxidationszahlTex +
                        "}" +
                    "}{" +
                        elementTex +
                    "}";
            }

            elementHinzufuegen(
                elementTex,
                index,
                true
            );

            continue;
        }

        /*
         * Elektron e erkennen.
         *
         * Beispiel:
         *
         * e^-
         */
        if (zeichen === "e") {
            i++;

            elementHinzufuegen(
                "\\mathrm{e}",
                "",
                true
            );

            continue;
        }

        /*
         * Zahlen erkennen, falls sie nicht direkt
         * als Index verarbeitet wurden.
         *
         * Das ist beispielsweise bei Koeffizienten
         * oder isolierten Zahlen hilfreich.
         */
        if (/\d/.test(zeichen)) {
            let zahl = zeichen;
            i++;

            while (
                i < eingabe.length &&
                /\d/.test(eingabe[i])
            ) {
                zahl += eingabe[i];
                i++;
            }

            elementHinzufuegen(
                "\\text{" + zahl + "}",
                "",
                false
            );

            continue;
        }

        /*
         * Sternchen als mathematisches Malzeichen.
         *
         * Ein abschließendes *2 wird normalerweise
         * bereits in convertMathJax() verarbeitet.
         */
        if (zeichen === "*") {
            elementHinzufuegen(
                "\\mathbin{\\ast}",
                "",
                false
            );

            i++;
            continue;
        }

        /*
         * Plus- und Minuszeichen als normale
         * Formelzeichen behandeln.
         *
         * Eine Ladung am Ende wird bereits in
         * convertMathJax() erkannt.
         */
        if (zeichen === "+" || zeichen === "-") {
            elementHinzufuegen(
                "\\text{" + zeichen + "}",
                "",
                false
            );

            i++;
            continue;
        }

        /*
         * Klammern und weitere Satzzeichen als Text
         * ausgeben.
         */
        /*
 * Schließende runde Klammer mit anschließendem
 * Gruppenindex erkennen.
 *
 * Beispiele:
 *
 * (H2O)6
 * [Cu(H2O)6]
 */
if (zeichen === ")") {
    i++;

    let gruppenIndex = "";

    while (
        i < eingabe.length &&
        /\d/.test(eingabe[i])
    ) {
        gruppenIndex += eingabe[i];
        i++;
    }

    elementHinzufuegen(
        "\\text{)}",
        gruppenIndex,
        true
    );

    continue;
}

/*
 * Öffnende Klammern und sonstige Zeichen
 * als Text ausgeben.
 */
if (
    zeichen === "(" ||
    zeichen === "[" ||
    zeichen === "]" ||
    zeichen === "|" ||
    zeichen === "," ||
    zeichen === "." ||
    zeichen === ":" ||
    zeichen === ";"
) {
    elementHinzufuegen(
        "\\text{" + zeichen + "}",
        "",
        false
    );

    i++;
    continue;
}


        /*
         * Pfeilzeichen erkennen, falls die Funktion
         * direkt mit einer vollständigen Gleichung
         * aufgerufen wird.
         */
        if (eingabe.slice(i, i + 2) === "->") {
            elementHinzufuegen(
                "\\rightarrow",
                "",
                false
            );

            i += 2;
            continue;
        }

        /*
         * Sonstige Zeichen als Text ausgeben.
         */
        elementHinzufuegen(
            "\\text{" + zeichen + "}",
            "",
            false
        );

        i++;
    }

    return {
        elemente: elemente,
        letztesElement: letztesElement
    };
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
        .map(function (stoff) {
            return convertMathJax(stoff);
        })
        .filter(function (stoff) {
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
            .filter(function (seite) {
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
            MathJax.typesetPromise([mathDiv]).catch(function (error) {
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
    anzeige("Hinweis", "Die MathJax-Formel wurde kopiert.", 3000, "success");

}

// Ersetze copyMathJaxAsImage() vollständig durch diese Funktion:
async function copyMathJaxAsImage() {
    const original = document.getElementById("mathjax");

    if (!original || !original.querySelector("mjx-container")) {
        anzeige("Hinweis", "Es ist keine gerenderte MathJax-Formel vorhanden.", 3000, "error");
        return;
    }

    try {
        const clone = original.cloneNode(true);

        // Unsichtbare MathJax-Zusatzinhalte entfernen,
        // damit Text und Pfeil nicht doppelt erfasst werden.
        clone.querySelectorAll(
            ".MJX_Assistive_MathML, mjx-assistive-mml, .mjx-assistive-mml"
        ).forEach(function (element) {
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
        await new Promise(function (resolve) {
            requestAnimationFrame(function () {
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

        const blob = await new Promise(function (resolve) {
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

        anzeige("Hinweis", "Die MathJax-Formel wurde als Bild kopiert.", 3000, "success");

    } catch (error) {
        console.error("Fehler beim Kopieren als Bild:", error);
        anzeige("Hinweis", "Das Bild konnte nicht in die Zwischenablage kopiert werden.", 3000, "error");
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

 const zustandsMatch = eingabe.match(
    /\((aq|s|l|g)\)(?=\s*(?:\^\{?\d*[+-]\}?)?\s*$)/i
);



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
document.querySelectorAll(".copy-kf-btn").forEach(function (button) {
    button.addEventListener("click", function () {
        kopiereKfTextbox(button);
    });
});


document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".copy-kf-image-btn").forEach(function (button) {
        button.addEventListener("click", function () {
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
        ).forEach(function (element) {
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

        await new Promise(function (resolve) {
            requestAnimationFrame(function () {
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

        const blob = await new Promise(function (resolve) {
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

document.addEventListener("DOMContentLoaded", function () {
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

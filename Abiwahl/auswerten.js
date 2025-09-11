// Definitionen für Fächerkürzel und -gruppen
const nw = ["B", "C", "Ph", "PhA", "PhB"];
const fs = ["E", "F", "L", "Sp", "It"];
const nwInf = nw.concat(["Inf", "InfS", "WInf"]);
const nwfs = nwInf.concat(fs).concat(["SPS", "ItS", "abgelegt"]);
const gpr = ["Geo", "WR", "PuG", "Glg", "SAF"];
const kumu = ["Ku", "Mu"];
const rel = ["K", "Ev", "Eth"];
const echteNwFs = nw.concat(fs);
const nurMdl = ["SPS", "InfS", "PhB", "Glg", "WInf", "SAF"];
const keinLF = ["SPS", "PhA", "InfS", "PhB", "Glg", "WInf", "SAF"];

//const pflichtfaecher = ["D", "M", "G", "Spo"];
const pflichtfaecher = ["D, M, G, Spo"];

/**
 * @const {Array<Object>} felder - Konfiguration für die Dropdown-Menüs auf der ersten Seite.
 * Jedes Objekt definiert:
 * - id: Die HTML-ID für das <select>-Element.
 * - label: Die Beschriftung, die vor dem Dropdown angezeigt wird.
 * - options: Das Array der Fächerkürzel, die im Dropdown zur Auswahl stehen.
 */
const felder = [
    { id: "naturwissenschaft", label: "Nw:", options: nw },
    { id: "fremdsprache", label: "Fs:", options: fs },
    { id: "zweitfach", label: "Nw2/Fs2:", options: nwfs },
    { id: "gpr", label: "GPR:", options: gpr },
    { id: "kum", label: "Ku/Mu:", options: kumu },
    { id: "releth", label: "Rel/Eth:", options: rel }
];

// HTML-Snippets für den Footer und Hilfstexte
const footerStart = '<div class="footer">';
const datenSchutz = 'Alle Angaben dienen nur zur Orientierung und sind ohne Gewähr. <br></br>';
const copyright = '2025 Rainer Hille, Gymnasium Waldkraiburg</div>';
let fachkuerzel = "<hr><b>Fachkürzel:</b><br>";
fachkuerzel += "D: Deutsch, M: Mathematik,G: Geschichte, Spo: Sport,<br>";
fachkuerzel += "B: Biologie, C: Chemie, Ph: Physik, PhA: Astrophysik, PhB: Biophysik, <br>";
fachkuerzel += "Inf: Informatik, InfS: Informatik spätbeginnend, WInf: Wirtschaftsinformatik, <br>";
fachkuerzel += "E: Englisch, F: Französisch, L: Latein, Sp: Spanisch, It: Italienisch, <br>";
fachkuerzel += "SPS: Spanisch spätbeginnend, ItS Italienisch spätbeginnend <br>";
fachkuerzel += "Geo: Geographie, WR: Wirtschaft und Recht, PuG: Politik und Gesellschaft, Glg: Geologie,SAF: Sozialwissenschaftliche Arbeitsfelder<br>";
fachkuerzel += "Ku: Kunst, Mu: Musik, <br>";
fachkuerzel += "K: Katholische Religionslehre, Ev: Evangelische Religionslehre, Eth: Ethik<br>";
fachkuerzel += "<hr>";
const footerEnde = "</div>";

/**
 * Erstellt die Tabelle mit den Pflichtfächern und den Dropdown-Menüs für die Fächerwahl.
 * Die Tabelle wird dynamisch in das Element mit der ID "auswahlflaeche" eingefügt.
 * @returns {void}
 */
function createDropdownTable() {
    // Referenz auf den Container, in dem die Tabelle erstellt werden soll
    const container = document.getElementById("auswahlflaeche");
    // Vorherigen Inhalt des Containers löschen
    container.innerHTML = "";

    // Tabelle und Tabellenkörper erstellen
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    // Feste Pflichtfächer in die Tabelle einfügen
    pflichtfaecher.forEach(fach => {
        const row = document.createElement("tr"); // Zeile erstellen
        const labelCell = document.createElement("td"); // Zelle für das Fachkürzel
        labelCell.textContent = fach; // Fachkürzel als Text setzen
        const emptyCell = document.createElement("td"); // Leere Zelle für Layout
        row.appendChild(labelCell);
        row.appendChild(emptyCell);
        tbody.appendChild(row); // Zeile zum Tabellenkörper hinzufügen
    });

    // Dropdowns basierend auf der 'felder'-Konfiguration erstellen
    felder.forEach(field => {
        const row = document.createElement("tr");

        // Zelle für die Beschriftung (z.B. "Nw:")
        const labelCell = document.createElement("td");
        labelCell.textContent = field.label;
        row.appendChild(labelCell);

        // Zelle für das Dropdown-Menü
        const selectCell = document.createElement("td");
        const select = document.createElement("select");
        select.id = field.id; // ID aus der Konfiguration zuweisen

        // Optionen für das Dropdown erstellen
        field.options.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt; // Wert der Option
            option.textContent = opt; // Angezeigter Text der Option
            select.appendChild(option); // Option zum Select-Element hinzufügen
        });

        selectCell.appendChild(select); // Select-Element zur Zelle hinzufügen
        row.appendChild(selectCell); // Zelle zur Zeile hinzufügen

        tbody.appendChild(row); // Zeile zum Tabellenkörper hinzufügen
    });

    // Tabelle zum Container hinzufügen
    table.appendChild(tbody);
    container.appendChild(table);
    // Footer unter der Tabelle hinzufügen
    container.innerHTML += footerStart + fachkuerzel + copyright + footerEnde;
}

// Nach dem Laden des DOM wird die Tabelle erstellt
window.addEventListener('DOMContentLoaded', () => {
    createDropdownTable();
});


/**
 * Führt die Auswertung der Fächerwahl durch, prüft auf Doppelbelegungen
 * und bereitet die Auswahl des Leistungsfachs auf der zweiten Seite vor.
 * @returns {void}
 */
function auswerten() {
    // Werte der ausgewählten Fächer aus den Dropdowns abrufen
    const chosen_nw = document.getElementById("naturwissenschaft").value;
    const chosen_fs = document.getElementById("fremdsprache").value;
    const chosen_nwfs = document.getElementById("zweitfach").value;
    const chosen_gpr = document.getElementById("gpr").value;
    const chosen_kumu = document.getElementById("kum").value;
    const chosen_rel = document.getElementById("releth").value;

    // Prüfung auf unzulässige Doppelbelegungen
    // Das gleiche Fach darf nicht als "Naturwissenschaft" und "2. Natw. oder 2. FS." gewählt werden.
    if (chosen_nw === chosen_nwfs) {
        alert("Fehler: Du darfst bei 'Naturwissenschaft' und '2. Natw. oder 2. FS.' nicht das gleiche Fach wählen!");
        return; // Funktion beenden, wenn ein Fehler gefunden wird
    }
    // Das gleiche Fach darf nicht als "Fremdsprache" und "2. Natw. oder 2. FS." gewählt werden.
    if (chosen_fs === chosen_nwfs) {
        alert("Fehler: Du darfst bei 'Fremdsprache' und '2. Natw. oder 2. FS.' nicht das gleiche Fach wählen!");
        return; // Funktion beenden, wenn ein Fehler gefunden wird
    }

    // Anzeige der Seiten wechseln: Seite 1 ausblenden, Seite 2 einblenden
    document.getElementById("Seite1").style.display = "none";
    document.getElementById("Seite2").style.display = "block";

    document.getElementById("Seite2").innerHTML = "<h1>Wähle dein Leistungsfach</h1>";
    document.getElementById("Seite2").innerHTML+="<div id='abiwahlflaeche'></div>";
    document.getElementById("Seite2").innerHTML+="<button onclick='zurueckZuSeite1()'>Zurück</button>";
document.getElementById("Seite2").innerHTML+="<button onclick='abiwahl()'>Weiter</button>";
    
    // Erstelle eine Liste der möglichen Leistungsfächer aus den gewählten Fächern und Pflichtfächern
    const options = [
        chosen_nw,
        chosen_fs,
        chosen_nwfs,
        chosen_gpr,
        chosen_kumu,
        chosen_rel,
        "G", // Geschichte ist immer eine Option
        "Spo" // Sport ist immer eine Option
    ];
    // Fächer entfernen, die nicht als Leistungsfach gewählt werden können (gemäß 'keinLF' Array)
    if (
        chosen_nwfs === "abgelegt" || // "abgelegt" ist keine gültige Leistungsfachoption
        isIn(chosen_nwfs, keinLF) // Fächer, die grundsätzlich kein LF sein können
    ) {
        remove(options, chosen_nwfs);
    }
    if (
        isIn(chosen_nw, keinLF) // Auch das gewählte Haupt-Naturwissenschaftsfach prüfen
    ) {
        remove(options, chosen_nw);
    }


    // Dropdown-Menü für die Leistungsfach-Auswahl erzeugen
    const abiwahlflaeche = document.getElementById("abiwahlflaeche");
    abiwahlflaeche.innerHTML = ""; // Vorherigen Inhalt löschen

    // Label für das Dropdown
    const label = document.createElement("label");
    label.textContent = "Leistungsfach:";
    label.setAttribute("for", "leistungsfach");

    // Select-Element erstellen
    const select = document.createElement("select");
    select.id = "leistungsfach";

    // Optionen zum Select-Element hinzufügen
    options.forEach(fach => {
        const option = document.createElement("option");
        option.value = fach;
        option.textContent = fach;
        select.appendChild(option);
    });

    // Label und Select-Element zur Seite hinzufügen
    abiwahlflaeche.appendChild(label);
    abiwahlflaeche.appendChild(select);
    // Footer zur Seite hinzufügen
    abiwahlflaeche.innerHTML += footerStart + fachkuerzel + copyright + footerEnde;

}

/**
 * Überprüft, ob ein Wert in einem Array enthalten ist.
 * @param {any} value - Der zu suchende Wert.
 * @param {Array} array - Das Array, in dem gesucht werden soll.
 * @returns {boolean} - True, wenn der Wert gefunden wurde, sonst False.
 */
function isIn(value, array) {
    return array.indexOf(value) !== -1;
}

/**
 * Überprüft, ob ein Wert mehrfach in einem Array vorkommt.
 * @param {any} value - Der zu suchende Wert.
 * @param {Array} array - Das Array, in dem gesucht werden soll.
 * @returns {boolean} - True, wenn der Wert mehr als einmal vorkommt, sonst False.
 */
function isDouble(value, array) {
    return array.indexOf(value) !== array.lastIndexOf(value);
}

/**
 * Überprüft, ob das gegebene Array Duplikate enthält.
 * @param {Array} array - Das zu prüfende Array.
 * @returns {boolean} - True, wenn das Array Duplikate enthält, sonst False.
 */
function containsDouble(array) {
    let doppelt = false;
    for (let i = 0; i < array.length; i++) {
        if (isDouble(array[i], array)) {
            doppelt = true;
            break;
        }
    }
    return doppelt;
}

/**
 * Entfernt die erste gefundene Instanz eines Elements aus einem Array.
 * @param {Array} array - Das Array, aus dem das Element entfernt werden soll.
 * @param {any} item - Das zu entfernende Element.
 * @returns {void}
 */
function remove(array, item) {
    const index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

/**
 * Überprüft, ob mindestens ein Element aus array1 in array2 enthalten ist.
 * @param {Array} array1 - Das Array, dessen Elemente gesucht werden sollen.
 * @param {Array} array2 - Das Array, in dem gesucht werden soll.
 * @returns {boolean} - True, wenn ein gemeinsames Element gefunden wurde, sonst False.
 */
function isInArray(array1, array2) {
    for (let i = 0; i < array1.length; i++) {
        if (isIn(array1[i], array2)) {
            return true;
        }
    }
    console.log(anz);
    return false;
}
/**
 * Prüft, wie oft die Elemente des Arrays1 im Array2 enthalten sind.
 * 0: Array2 enthält kein Element aus Array1
 * @returns Zahl der Übereinstimmungen
 */

function anzInArray(array1,array2){
    int anz=0;
    for (let i = 0; i < array1.length; i++) {
        if (isIn(array1[i], array2)) {
            anz++;
        }
    }
    return anz;
}
    
/**
 * Verarbeitet die Auswahl des Leistungsfachs, generiert mögliche Abiturfächerkombinationen
 * und zeigt diese zur Auswahl auf der dritten Seite an.
 * @returns {void}
 */
function abiwahl() {
    // Seitenanzeige wechseln: Seite 2 ausblenden, Seite 3 einblenden
    document.getElementById("Seite2").style.display = "none";
    document.getElementById("Seite3").style.display = "block";

    document.getElementById("Seite3").innerHTML = "<h1>Wähle deine Abiturfächer</h1>";

    // Leistungsfach und zuvor gewählte Fächer abrufen
    const lf = document.getElementById("leistungsfach").value;
    const chosen_nw = document.getElementById("naturwissenschaft").value;
    const chosen_fs = document.getElementById("fremdsprache").value;
    const chosen_nwfs = document.getElementById("zweitfach").value;
    const chosen_gpr = document.getElementById("gpr").value;
    const chosen_kumu = document.getElementById("kum").value;
    const chosen_rel = document.getElementById("releth").value;

    // Initialisiere die Listen für die Abiturfächer nach den Regeln der GSO (G8/G9 je nach Bundesland/Regelwerk)
    // Fach 1: Deutsch oder LF (wenn LF eine Fremdsprache ist und eine zweite FS belegt wird)
    let fach1 = ["D"];
    if (isIn(lf, fs) && isIn(chosen_nwfs, fs)) {
        fach1.push(lf);
    }
    // Fach 2: Mathematik oder LF (wenn LF eine NW/Inf ist und eine zweite NW/FS belegt wird)
    let fach2 = ["M"];
    if (isIn(lf, nwInf) && isIn(chosen_nwfs, nwInf)) {
        fach2.push(lf);
    }
    // Fach 3: GPR, Religion/Ethik, Geschichte
    let fach3 = [chosen_gpr, chosen_rel, "G"];
    // Fach 4: Naturwissenschaft, Fremdsprache, 2.Nw/2.Fs
    let fach4 = [chosen_nw, chosen_fs, chosen_nwfs];
    // Fach 5: Fremdsprache, 2.Nw/2.Fs, Ku/Mu, GPR, Religion/Ethik, Geschichte
    let fach5 = [chosen_fs, chosen_nwfs, chosen_kumu, chosen_gpr, chosen_rel, "G"];

    // Sonderfall: Wenn Sport als Leistungsfach gewählt wurde, ist es das fünfte Fach
    if (lf === "Spo") {
        fach5 = ["Spo"];
    }
    // Wenn "abgelegt" gewählt wurde, muss es aus den Fachlisten entfernt werden
    if (chosen_nwfs === "abgelegt") {
        remove(fach4, chosen_nwfs);
        remove(fach5, chosen_nwfs);
    }

    // Array zur Speicherung einer einzelnen Abiturkombination
    let abi = new Array(5);
    // Set zur Speicherung eindeutiger Kombinationen (als sortierte Strings)
    let uniqueCombinations = new Set();
    // Array zur Speicherung der gültigen Kombinationen (als Arrays)
    let combinations = [];

    // Verschachtelte Schleifen zur Generierung aller möglichen Fächerkombinationen
    for (let f1 = 0; f1 < fach1.length; f1++) {
        for (let f2 = 0; f2 < fach2.length; f2++) {
            for (let f3 = 0; f3 < fach3.length; f3++) {
                for (let f4 = 0; f4 < fach4.length; f4++) {
                    for (let f5 = 0; f5 < fach5.length; f5++) {
                        // Eine mögliche Kombination zusammenstellen
                        abi[0] = fach1[f1];
                        abi[1] = fach2[f2];
                        abi[2] = fach3[f3];
                        abi[3] = fach4[f4];
                        abi[4] = fach5[f5];

                        // Prüfen der Kombinationsregeln:
                        // 1. Keine Doppelbelegung innerhalb der fünf Fächer
                        if (!containsDouble(abi)) {
                            // 2. Das Leistungsfach muss in der Kombination enthalten sein
                            if (isIn(lf, abi)) {
                                // 3. Substitutionsregel für Mathematik: Wenn M nicht dabei ist, muss eine FS und eine NW/Inf dabei sein
                                if (abi[1] !== "M" && 
                                    (!isInArray(abi, fs)|| (anzInArray(abi, nwInf)<2))) {
                                    // Diese Kombination ist ungültig, falls M nicht dabei ist und die Ersatzbedingungen nicht erfüllt sind.
                                    // Weiter zur nächsten Kombination (nichts tun, da der Fall unten geprüft wird)
                                } else {
                                    // 4. Substitutionsregel für Deutsch: Wenn D nicht dabei ist, muss eine Fremdsprache dabei sein
                                    if (abi[0] !== "D" && anzInArray(abi, fs)<2) {
                                        // Diese Kombination ist ungültig.
                                    } else {
                                        // 5. Mindestens eine "echte" Naturwissenschaft oder Fremdsprache muss im Abi enthalten sein
                                        if (isInArray(echteNwFs, abi)) {
                                            // Wenn alle Regeln erfüllt sind, die Kombination hinzufügen
                                            const sortedAbi = [...abi].sort().join(","); // Kombination sortieren und als String speichern
                                            if (!uniqueCombinations.has(sortedAbi)) { // Nur neue, eindeutige Kombinationen aufnehmen
                                                uniqueCombinations.add(sortedAbi);
                                                combinations.push([...abi]); // Die tatsächliche Kombination speichern
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Anzeige der generierten Kombinationen auf der Seite
    const listeDiv = document.getElementById("Seite3");
    listeDiv.innerHTML = "<h1>Wähle deine Abiturfächer</h1>";

    const radioGroup = document.createElement("div");
    radioGroup.id = "abiKombiGroup";

    // Jede gültige Kombination als Radio-Button anzeigen
    combinations.forEach((kombi, idx) => {
        const optionLabel = document.createElement("label");
        optionLabel.style.display = "block"; // Jede Option in einer neuen Zeile
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "abiKombi"; // Gleicher Name für alle Radio-Buttons, damit nur einer gewählt werden kann
        radio.value = kombi.join(","); // Wert ist die Komma-separierte Liste der Fächer
     
        optionLabel.appendChild(radio);
        optionLabel.appendChild(document.createTextNode(" " + kombi.join(", "))); // Angezeigter Text
        radioGroup.appendChild(optionLabel);
    });

    listeDiv.appendChild(radioGroup);
    // Zusätzlicher Inhalt (z.B. eine Regelübersicht) einbetten
    listeDiv.innerHTML += '<iframe src="GSO48-1.html" width="100%"></iframe><br>';

    // Weiter-Button erstellen
    const weiterBtn = document.createElement("button");
    weiterBtn.textContent = "Weiter";
    weiterBtn.onclick = function () {
        const selected = document.querySelector('input[name="abiKombi"]:checked'); // Ausgewählte Kombination abrufen
        if (selected) {
            skWahl(selected.value); // Nächsten Schritt (S/K-Wahl) starten
        } else {
            alert("Bitte wähle eine Kombination aus."); // Warnung, falls nichts ausgewählt wurde
        }
    };
   
    const zurueckBtn = document.createElement("button");
    zurueckBtn.textContent = "Zurück";
    zurueckBtn.onclick = function () {
        document.getElementById("Seite3").style.display = "none";
        document.getElementById("Seite2").style.display = "block";
    };
    listeDiv.appendChild(zurueckBtn);
 listeDiv.appendChild(weiterBtn);

}

/**
 * Überprüft, ob ein Fach, das nur mündlich geprüft werden darf, fälschlicherweise als schriftlich (S) ausgewählt wurde.
 * @param {string} txt - Ein String der Form "Fach1 (S), Fach2 (K)", der die Fächer und deren Prüfungsart enthält.
 * @returns {boolean} - True, wenn ein Fehler (mündliches Fach als schriftlich) vorliegt, sonst False.
 */
function nurMdlFehler(txt) {
    const faecher = txt.split(", "); // Fächerpaare aufsplitten
    for (let i = 0; i < faecher.length; i++) {
        const fachUndTyp = faecher[i].split(" ("); // Fach und Prüfungsart aufsplitten
        const fach = fachUndTyp[0]; // Fachkürzel
        const abiTyp = fachUndTyp[1].slice(0, -1); // Prüfungsart (z.B. "S" oder "K")

        // Prüfen, ob das Fach im Array der nur mündlichen Fächer ist UND als schriftlich (S) ausgewählt wurde
        if (isIn(fach, nurMdl) && abiTyp === "S") {
            return true; // Fehler gefunden
        }
    }
    return false; // Kein Fehler gefunden
}

/**
 * Verarbeitet die gewählte Abiturfächerkombination und ermöglicht die Auswahl der Prüfungsarten
 * (schriftlich 'S' oder Kolloquium 'K') für jedes Fach. Es müssen 3 schriftliche und 2 Kolloquien sein.
 * @param {string} selectedValue - Die als Komma-getrennter String gewählte Abiturfächerkombination.
 * @returns {void}
 */
function skWahl(selectedValue) {
    const selectedCombination = selectedValue.split(","); // Gewählte Fächer als Array
    const listeDiv = document.getElementById("Seite3");
    listeDiv.innerHTML = "<h1>Schriftlich oder Kolloquium</h1>"; // Überschrift aktualisieren

    /**
     * Generiert alle möglichen Permutationen von 3 'S' (schriftlich) und 2 'K' (Kolloquium).
     * @returns {string[][]} - Ein Array von Arrays, wobei jedes innere Array eine Permutation darstellt.
     */
    function getSKPermutations() {
        const arr = ["S", "S", "S", "K", "K"]; // Basis-Array für 3x S und 2x K
        const results = new Set(); // Set zum Speichern eindeutiger Permutationen

        /**
         * Hilfsfunktion für die Permutationsgenerierung (rekursiv).
         * @param {Array} a - Das aktuelle Array, dessen Permutationen generiert werden.
         * @param {number} l - Der linke Index des zu permutierenden Bereichs.
         * @param {number} r - Der rechte Index des zu permutierenden Bereichs.
         */
        function permute(a, l, r) {
            if (l === r) {
                results.add(a.join(",")); // Permutation gefunden, als String zum Set hinzufügen
            } else {
                for (let i = l; i <= r; i++) {
                    // Elemente tauschen
                    [a[l], a[i]] = [a[i], a[l]];
                    // Rekursiver Aufruf für den nächsten Bereich
                    permute(a, l + 1, r);
                    // Elemente zurücktauschen (Backtracking)
                    [a[l], a[i]] = [a[i], a[l]];
                }
            }
        }
        permute(arr, 0, arr.length - 1); // Start der Permutationsgenerierung
        return Array.from(results).map(str => str.split(",")); // Set in Array von String-Arrays umwandeln
    }

    const skPerms = getSKPermutations(); // Alle S/K-Permutationen generieren
    const lf = document.getElementById("leistungsfach").value; // Das zuvor gewählte Leistungsfach

    // Gültige Kombinationen filtern: D, M und das Leistungsfach müssen mindestens 2x S (schriftlich) haben
    const validCombinations = skPerms.filter(skArr => {
        let sCount = 0; // Zähler für schriftliche Prüfungen von D, M und LF
        selectedCombination.forEach((fach, idx) => {
            // Wenn das Fach D, M oder das Leistungsfach ist UND es als 'S' gewählt wurde
            if ((fach === "D" || fach === "M" || fach === lf) && skArr[idx] === "S") {
                sCount++; // Zähler erhöhen
            }
        });
        return sCount >= 2; // Die Kombination ist gültig, wenn mindestens 2 dieser Fächer schriftlich sind
    });

    // Label für die Auswahl der S/K-Kombination
    const label = document.createElement("label");
    label.textContent = "Wähle eine Kombination von 3 schriftlichen Prüfungen (S) und 2 Kolloquien (K):";
    listeDiv.appendChild(label);
    const radioGroup = document.createElement("div");
    radioGroup.id = "skKombiGroup";

    // Anzeige der gültigen S/K-Kombinationen als Radio-Buttons
    validCombinations.forEach((skArr, idx) => {
        const optionLabel = document.createElement("label");
        optionLabel.style.display = "block";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "skKombi"; // Gleicher Name für alle, um nur eine Auswahl zu erlauben
        radio.value = skArr.join(",");
       
        // Text für die Anzeige der Kombination (Fachname + (S/K))
        const fachText = selectedCombination.map((fach, i) => {
            let extra = (fach === lf) ? " LF" : ""; // Markierung für das Leistungsfach
            return `${fach}${extra} (${skArr[i]})`;
        }).join(", ");
        // console.log(fachText); // Für Debugging

        // Zusätzliche Filterung für ungültige S/K-Zuweisungen (spezifische Regeln):
        // - Ku/Mu nur S, wenn es Leistungsfach ist, und nur K, wenn es nicht Leistungsfach ist
        // - Fächer aus 'nurMdl' (spätbeginnende Sprachen, bestimmte Naturwissenschaften) dürfen nicht S sein.
        if (
            (fachText.includes("Ku (S)") && !(lf === "Ku")) || // Ku als S, aber nicht LF
            (fachText.includes("Mu (S)") && !(lf === "Mu")) || // Mu als S, aber nicht LF
            (fachText.includes("Ku LF (K)")) || // Ku als LF, aber als K
            (fachText.includes("Mu LF (K)")) || // Mu als LF, aber als K
            nurMdlFehler(fachText) // Überprüft, ob ein nur mündliches Fach als S gewählt wurde
        ) {
            // Diese Kombination wird nicht angezeigt, da sie ungültig ist
        } else {
            // Gültige Kombination wird zur Auswahl hinzugefügt
            optionLabel.appendChild(radio);
            optionLabel.appendChild(document.createTextNode(" " + fachText));
            radioGroup.appendChild(optionLabel);
        }
    });

    listeDiv.appendChild(radioGroup);
    listeDiv.innerHTML += '<iframe src="GSO48-1.html" width="100%"></iframe><br>';
    listeDiv.innerHTML += footerStart + datenSchutz + copyright + footerEnde;

    // Weiter-Button für die finale Auswahl
    const weiterBtn = document.createElement("button");
    weiterBtn.textContent = "Weiter";
    weiterBtn.onclick = function () {
        const selected = document.querySelector('input[name="skKombi"]:checked');
        if (selected) {
            const skArr = selected.value.split(","); // Gewählte S/K-Kombination
            // Finale Anzeige der gewählten Abiturfächer mit Prüfungsart
            
            const finalFachText = selectedCombination.map((fach, i) => `${fach} (${skArr[i]})`).join(", ");
            listeDiv.innerHTML = "<h1>Gewählte Abitur-Kombination:</h1><h1>" + finalFachText + "</h1>";
            listeDiv.innerHTML += "<h1>Übermittle diese Wahl bitte an deinen OSK.</h1>";
            // Finaler Footer mit allen Informationen
            listeDiv.innerHTML += footerStart + datenSchutz + fachkuerzel + copyright + footerEnde;

        } else {
            alert("Bitte wähle eine S/K-Kombination aus."); // Warnung, falls nichts ausgewählt wurde
        }
    };
  
    const zurueckBtn2 = document.createElement("button");
    zurueckBtn2.textContent = "Zurück";
    zurueckBtn2.onclick = function () {
        // Zeige wieder die Abiturfächer-Auswahl
        abiwahl();
    };
    listeDiv.appendChild(zurueckBtn2);
    listeDiv.appendChild(weiterBtn);

}

// Hilfsfunktion für Seite1
function zurueckZuSeite1() {
    document.getElementById("Seite2").style.display = "none";
    document.getElementById("Seite1").style.display = "block";
}




// Arrays mit den Fächerkürzeln
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

// Fixe Pflichtfächer:
const pflichtfaecher = ["D", "M", "G", "Spo"];

// Definition für die Dropdowns: id, Beschriftung, Optionsarray
const felder = [
    { id: "naturwissenschaft", label: "Nw:", options: nw },
    { id: "fremdsprache", label: "Fs:", options: fs },
    { id: "zweitfach", label: "Nw2/Fs2:", options: nwfs },
    { id: "gpr", label: "GPR:", options: gpr },
    { id: "kum", label: "Ku/Mu:", options: kumu },
    { id: "releth", label: "Rel/Eth:", options: rel }
];
const footerStart = '<div id="footer">';
const datenSchutz = 'Alle Angaben dienen nur zur Orientierung und sind ohne Gewähr. <br></br>';
const copyright = '2025 Rainer Hille, Gymnasium Waldkraiburg</div>';
fachkuerzel = "<hr><b>Fachkürzel:</b><br>";
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

// Tabelle dynamisch erstellen, inkl. Pflichtfächer und Dropdowns
function createDropdownTable() {
    const container = document.getElementById("auswahlflaeche");
    container.innerHTML = "";

    const table = document.createElement("table");
    const tbody = document.createElement("tbody");

    // Erst die Pflichtfächer in die Tabelle einfügen
    pflichtfaecher.forEach(fach => {
        const row = document.createElement("tr");
        const labelCell = document.createElement("td");
        labelCell.textContent = fach;
        const emptyCell = document.createElement("td");
        row.appendChild(labelCell);
        row.appendChild(emptyCell);
        tbody.appendChild(row);
    });

    // Jetzt die Dropdowns wie gewohnt:
    felder.forEach(field => {
        const row = document.createElement("tr");

        // Zelle für die Beschriftung
        const labelCell = document.createElement("td");
        labelCell.textContent = field.label;
        row.appendChild(labelCell);

        // Zelle für das Dropdown-Menü
        const selectCell = document.createElement("td");
        const select = document.createElement("select");
        select.id = field.id;

        field.options.forEach(opt => {
            const option = document.createElement("option");
            option.value = opt;
            option.textContent = opt;
            select.appendChild(option);
        });

        selectCell.appendChild(select);
        row.appendChild(selectCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
    container.innerHTML += footerStart + fachkuerzel + copyright + footerEnde;
}

// Nach dem Laden der Seite wird die Tabelle angezeigt
window.addEventListener('DOMContentLoaded', () => {
    createDropdownTable();
});


// Auswertung mit Doppelbelegungsprüfung
function auswerten() {

    // Variablen für die gewählten Fächer
    const chosen_nw = document.getElementById("naturwissenschaft").value;
    const chosen_fs = document.getElementById("fremdsprache").value;
    const chosen_nwfs = document.getElementById("zweitfach").value;
    const chosen_gpr = document.getElementById("gpr").value;
    const chosen_kumu = document.getElementById("kum").value;
    const chosen_rel = document.getElementById("releth").value;

    // Prüfung auf Doppelbelegung bei Naturwissenschaft und 2. Natw./2. FS.
    if (chosen_nw === chosen_nwfs) {
        alert("Fehler: Du darfst bei 'Naturwissenschaft' und '2. Natw. oder 2. FS.' nicht das gleiche Fach wählen!");
        return;
    }
    if (chosen_fs === chosen_nwfs) {
        alert("Fehler: Du darfst bei 'Fremdsprache' und '2. Natw. oder 2. FS.' nicht das gleiche Fach wählen!");
        return;
    }

    document.getElementById("Seite1").style.display = "none";
    document.getElementById("Seite2").style.display = "block";

    document.getElementById("Seite2").innerHTML = "<h1>Wähle dein Leistungsfach</h1><div id='abiwahlflaeche'></div><button onclick='abiwahl()'>Weiter</button>";

    // Erstelle die Optionsliste
    const options = [
        chosen_nw,
        chosen_fs,
        chosen_nwfs,
        chosen_gpr,
        chosen_kumu,
        chosen_rel,
        "G",
        "Spo"
    ];
    // Fächer, die es nicht als Leistungsfach geben kann, werden entfernt
    if (
        chosen_nwfs === "abgelegt" ||
        isIn(chosen_nwfs, keinLF)
    ) {
        remove(options, chosen_nwfs);
    }
    if (
        isIn(chosen_nw, keinLF)
    ) {
        remove(options, chosen_nw);
    }


    // Dropdown-Menü erzeugen
    const abiwahlflaeche = document.getElementById("abiwahlflaeche");
    abiwahlflaeche.innerHTML = ""; // Vorherigen Inhalt löschen

    const label = document.createElement("label");
    label.textContent = "Leistungsfach:";
    label.setAttribute("for", "leistungsfach");

    const select = document.createElement("select");
    select.id = "leistungsfach";

    options.forEach(fach => {
        const option = document.createElement("option");
        option.value = fach;
        option.textContent = fach;
        select.appendChild(option);
    });

    abiwahlflaeche.appendChild(label);
    abiwahlflaeche.appendChild(select);
    abiwahlflaeche.innerHTML += footerStart + fachkuerzel + copyright + footerEnde;

}

function isIn(value, array) {
    return array.indexOf(value) !== -1;
}

function isDouble(value, array) {
    return array.indexOf(value) !== array.lastIndexOf(value);
}

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

function remove(array, item) {
    const index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

function isInArray(array1, array2) {
    for (let i = 0; i < array1.length; i++) {
        if (isIn(array1[i], array2)) {
            return true;
        }
    }
    return false;
}

function abiwahl() {
    document.getElementById("Seite2").style.display = "none";
    document.getElementById("Seite3").style.display = "block";

    const lf = document.getElementById("leistungsfach").value;
    const chosen_nw = document.getElementById("naturwissenschaft").value;
    const chosen_fs = document.getElementById("fremdsprache").value;
    const chosen_nwfs = document.getElementById("zweitfach").value;
    const chosen_gpr = document.getElementById("gpr").value;
    const chosen_kumu = document.getElementById("kum").value;
    const chosen_rel = document.getElementById("releth").value;

    let fach1 = new Array("D");
    // Option Leistungfach Fremdsprache, wenn Fs als LF und 2 FS belegt
    if (isIn(lf, fs) && isIn(chosen_nwfs, fs)) {
        fach1.push(lf);
    }
    let fach2 = new Array("M");
    // Option Leistungfach Naturwissenschaft/Inf, wenn Nw/Inf als LF und 2.Nw/2.Fs belegt 
    if (isIn(lf, nwInf) && isIn(chosen_nwfs, nwInf)) {
        fach2.push(lf);
    }
    let fach3 = new Array(chosen_gpr, chosen_rel, "G");
    let fach4 = new Array(chosen_nw, chosen_fs, chosen_nwfs);
    let fach5 = new Array(chosen_fs, chosen_nwfs, chosen_kumu, chosen_gpr, chosen_rel, "G");
    if (lf == "Spo") {
        fach5 = new Array("Spo");
    }
    if (chosen_nwfs == "abgelegt") {
        remove(fach4, chosen_nwfs);
        remove(fach5, chosen_nwfs);
    }
    let abi = new Array(5);
    let uniqueCombinations = new Set();
    let combinations = [];

    for (let f1 = 0; f1 < fach1.length; f1++) {
        for (let f2 = 0; f2 < fach2.length; f2++) {
            for (let f3 = 0; f3 < fach3.length; f3++) {
                for (let f4 = 0; f4 < fach4.length; f4++) {
                    for (let f5 = 0; f5 < fach5.length; f5++) {
                        abi[0] = fach1[f1];  // D,LF Fs
                        abi[1] = fach2[f2];  // M, LF Nw,Inf
                        abi[2] = fach3[f3];  // GPR,Rel,Eth
                        abi[3] = fach4[f4];  // Nw,Fs,2.Nw,2.Fs
                        abi[4] = fach5[f5];  // Fs,2.Nw,2.Fs,Ku/Mu,GPR,Rel,Eth

                        if (!containsDouble(abi)) { // Keine Doppelbelegung
                            if (isIn(lf, abi)) { // Leistungfach muss enthalten sein
                                if (abi[1] != "M" && (!isInArray(abi, fs) || !(isIn(abi[3], nwInf) || isIn(abi[4], nwInf)))) {
                                    // Wenn Mathe substiuiert ist, muss eine Fremdsprache und eine Nw geprüft werden.
                                } else {
                                    if (abi[0] != "D" && !isIn(abi[3], fs) && !isIn(abi[4], fs)) {
                                        // Wenn Deutsch substituiert ist, muss noch eine Fremdsprache geprüft werden.
                                    } else {
                                        if (isInArray(echteNwFs, abi)) {
                                            // Mindestens eine NW oder FS im Abi
                                            const sortedAbi = [...abi].sort().join(","); // Sortiere die Fächer
                                            if (!uniqueCombinations.has(sortedAbi)) { // Nur neue Kombination aufnehmen
                                                uniqueCombinations.add(sortedAbi);
                                                combinations.push([...abi]);
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

    const listeDiv = document.getElementById("Seite3");
    listeDiv.innerHTML = "<h1>Wähle deine Abiturfächer</h1>";

    const radioGroup = document.createElement("div");
    radioGroup.id = "abiKombiGroup";

    combinations.forEach((kombi, idx) => {
        const optionLabel = document.createElement("label");
        optionLabel.style.display = "block";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "abiKombi";
        radio.value = kombi.join(",");
        if (idx === 0) radio.checked = true; // Erstes Element vorauswählen
        optionLabel.appendChild(radio);
        optionLabel.appendChild(document.createTextNode(" " + kombi.join(", ")));
        radioGroup.appendChild(optionLabel);
    });

    listeDiv.appendChild(radioGroup);
    listeDiv.innerHTML += '<iframe src="GSO48-1.html" width="100%"></iframe><br>';



    // Weiter-Button
    const weiterBtn = document.createElement("button");
    weiterBtn.textContent = "Weiter";
    weiterBtn.onclick = function () {
        const selected = document.querySelector('input[name="abiKombi"]:checked');
        if (selected) {
            skWahl(selected.value);
            // Hier kann die nächste Aktion erfolgen
        } else {
            alert("Bitte wähle eine Kombination aus.");
        }
    };
    listeDiv.innerHTML += footerStart + datenSchutz + copyright + footerEnde;

    listeDiv.appendChild(weiterBtn);

}

function nurMdlFehler(txt) {
    const faecher = txt.split(", ");
    for (let i = 0; i < faecher.length; i++) {
        fach=faecher[i].split(" (")[0];
        abi=faecher[i].split(" (")[1];
        if (isIn(fach, nurMdl)&&abi=="S)") {
            return true;    
        }  
    }
}

function skWahl(selectedValue) {
    const selectedCombination = selectedValue.split(",");
    const listeDiv = document.getElementById("Seite3");
    listeDiv.innerHTML = "<h1>Schriftlich oder Kolloquium</h1>"; // Vorherigen Inhalt löschen

    // Hilfsfunktion: Erzeuge alle Permutationen von S/K mit 3x S und 2x K
    function getSKPermutations() {
        const arr = ["S", "S", "S", "K", "K"];
        const results = new Set();

        function permute(a, l, r) {
            if (l === r) {
                results.add(a.join(","));
            } else {
                for (let i = l; i <= r; i++) {
                    [a[l], a[i]] = [a[i], a[l]];
                    permute(a, l + 1, r);
                    [a[l], a[i]] = [a[i], a[l]];
                }
            }
        }
        permute(arr, 0, arr.length - 1);
        return Array.from(results).map(str => str.split(","));
    }

    const skPerms = getSKPermutations();
    const lf = document.getElementById("leistungsfach").value;

    // Filtere gültige Kombinationen
    const validCombinations = skPerms.filter(skArr => {
        let sCount = 0;
        // D, M und LF müssen mindestens 2x S haben
        selectedCombination.forEach((fach, idx) => {
            if ((fach === "D" || fach === "M" || fach === lf) && skArr[idx] === "S") {
                sCount++;
            }
        });
        return sCount >= 2;
    });

    // Ausgabe als Radiobuttons
    const label = document.createElement("label");
    label.textContent = "Wähle eine Kombination von 3 schriftlichen Prüfungen (S) und 2 Kolloquien (K):";
    listeDiv.appendChild(label);
    const radioGroup = document.createElement("div");
    radioGroup.id = "skKombiGroup";
    validCombinations.forEach((skArr, idx) => {
        const optionLabel = document.createElement("label");
        optionLabel.style.display = "block";
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "skKombi";
        radio.value = skArr.join(",");
        if (idx === 0) radio.checked = true;

        // Zeige Fächer und S/K nebeneinander, Leistungsfach mit (LF)
        const fachText = selectedCombination.map((fach, i) => {
            let extra = (fach === lf) ? " LF" : "";
            return `${fach}${extra} (${skArr[i]})`;
        }).join(", ");
        console.log(fachText);
        // Ku,Mu nur S wenn LF und nur K wenn nicht LF, SPS,InfS nur K
      
        if ((fachText.indexOf("Ku (S)") != -1)
            || (fachText.indexOf("Mu (S)") != -1)
            || (fachText.indexOf("Ku LF (K)") != -1)
            || (fachText.indexOf("Mu LF (K)") != -1)
        // Nur mündliche Prüfung bei SPS, InfS, PhB, Glg, WInf, SAF
            || (nurMdlFehler(fachText))
      ) {
        }
        else {
            optionLabel.appendChild(radio);
            optionLabel.appendChild(document.createTextNode(" " + fachText));
            radioGroup.appendChild(optionLabel);
        }
    });

    listeDiv.appendChild(radioGroup);
    listeDiv.innerHTML += '<iframe src="GSO48-1.html" width="100%"></iframe><br>';
    listeDiv.innerHTML += footerStart + datenSchutz + copyright + footerEnde;

    // Weiter-Button
    const weiterBtn = document.createElement("button");
    weiterBtn.textContent = "Weiter";
    weiterBtn.onclick = function () {
        const selected = document.querySelector('input[name="skKombi"]:checked');
        if (selected) {
            const skArr = selected.value.split(",");
            const fachText = selectedCombination.map((fach, i) => `${fach} (${skArr[i]})`).join(", ");
            listeDiv.innerHTML = "<h1>Gewählte Abitur-Kombination:</h1><h1>" + fachText + "</h1>";
            listeDiv.innerHTML += "Übermittle diese Wahl bitte an den OSK.";
            listeDiv.innerHTML += footerStart + datenSchutz + fachkuerzel + copyright + footerEnde;

        } else {
            alert("Bitte wähle eine S/K-Kombination aus.");
        }
    };
    listeDiv.appendChild(weiterBtn);

}
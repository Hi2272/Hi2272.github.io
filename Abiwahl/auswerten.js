// Arrays mit den Fächerkürzeln
const nw = ["B", "C", "Ph", "PhA"];
const fs = ["E", "F", "L", "Sp"];
const nwfs = ["B", "C", "Ph", "PhA", "Inf", "InfS", "E", "F", "L", "Sp", "SPS"];
const gpr = ["Geo", "WR", "PuG"];
const kumu = ["Ku", "Mu"];
const rel = ["K", "Ev", "Eth"];

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
}

// Nach dem Laden der Seite wird die Tabelle angezeigt
window.addEventListener('DOMContentLoaded', () => {
    createDropdownTable();
});

// Auswertung mit Doppelbelegungsprüfung
function auswerten() {
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
    if (chosen_fs=== chosen_nwfs) {
        alert("Fehler: Du darfst bei 'Fremdsprache' und '2. Natw. oder 2. FS.' nicht das gleiche Fach wählen!");
        return;
    }
    // Weitere Auswertung hier...
    console.log("Naturwissenschaft:", chosen_nw);
    console.log("Fremdsprache:", chosen_fs);
    console.log("2. Natw. oder 2. FS.:", chosen_nwfs);
    console.log("GPR:", chosen_gpr);
    console.log("Ku/Mu:", chosen_kumu);
    console.log("Rel/Eth:", chosen_rel);
}

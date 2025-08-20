// Arrays mit den Fächerkürzeln
const nw = ["B", "C", "Ph", "PhA"];
const fs = ["E", "F", "L", "Sp"];
const nwfs = ["B", "C", "Ph", "PhA", "Inf", "InfS", "E", "F", "L", "Sp", "SPS"];
const gpr = ["Geo", "WR", "PuG"];
const kumu = ["Ku", "Mu"];
const rel = ["K", "Ev", "Eth"];

// Definition, wie Dropdowns dargestellt werden sollen
const felder = [
    { id: "naturwissenschaft", label: "Naturwissenschaft:", options: nw },
    { id: "fremdsprache", label: "Fremdsprache:", options: fs },
    { id: "zweitfach", label: "2. Natw. oder 2. FS.:", options: nwfs },
    { id: "gpr", label: "GPR:", options: gpr },
    { id: "kum", label: "Ku/ Mu:", options: kumu },
    { id: "releth", label: "Rel/Eth:", options: rel }
];

// Diese Funktion erstellt die Auswahlmenüs dynamisch
function createDropdowns() {
    const container = document.getElementById("auswahlflaeche");
    container.innerHTML = ""; // Sicherheitsmaßnahme: Leeren

    felder.forEach(field => {
        const div = document.createElement('div');
        div.className = "select-group";

        // Label anlegen
        const label = document.createElement('label');
        label.htmlFor = field.id;
        label.textContent = " " + field.label + " ";

        // Select-Element
        const select = document.createElement('select');
        select.id = field.id;
        field.options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            select.appendChild(option);
        });

        label.appendChild(select);
        div.appendChild(label);
        container.appendChild(div);
    });
}

// Ruft die Funktion nach dem Laden der Seite auf
window.addEventListener('DOMContentLoaded', () => {
    createDropdowns();
});

// Auswertung
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
        return; // Auswertung abbrechen
    }

    // Prüfung auf Doppelbelegung bei Naturwissenschaft und 2. Natw./2. FS.
    if (chosen_fs === chosen_nwfs) {
        alert("Fehler: Du darfst bei 'Fremdsprache' und '2. Natw. oder 2. FS.' nicht das gleiche Fach wählen!");
        return; // Auswertung abbrechen
    }
    // Beispielhafte Ausgabe in der Konsole
    console.log("Naturwissenschaft:", chosen_nw);
    console.log("Fremdsprache:", chosen_fs);
    console.log("2. Natw. oder 2. FS.:", chosen_nwfs);
    console.log("GPR:", chosen_gpr);
    console.log("Ku/Mu:", chosen_kumu);
    console.log("Rel/Eth:", chosen_rel);

    // Weitere Logik kann hier ergänzt werden
}

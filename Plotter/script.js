// ------------------------------------------------------------
// Hilfsfunktion: fügt M‑Befehle nur bei echten "G0 " bzw.
// "G1 " Zeilen ein (Leerzeichen nach dem G‑Code). Die einzufügenden
// Zeilen werden aus den PenUp / PenDown Textboxen gelesen.
// ------------------------------------------------------------
function insertConversionLines(text) {
    const lines   = text.split('\n');
    const result  = [];

    let insertedG0 = false;   // PenUp‑Befehl bereits gesetzt?
    let insertedG1 = false;   // PenDown‑Befehl bereits gesetzt?

    const penUp   = document.getElementById('penUpInput').value.trim();
    const penDown = document.getElementById('penDownInput').value.trim();

    const g0Pattern = /^G0\s/;
    const g1Pattern = /^G1\s/;

    lines.forEach(line => {
        const trimmed = line.trim();

        if (g0Pattern.test(trimmed)) {
            if (!insertedG0) {
                result.push(penUp);
                insertedG0 = true;
            }
            insertedG1 = false;
            result.push(line);
        } else if (g1Pattern.test(trimmed)) {
            if (!insertedG1) {
                result.push(penDown);
                insertedG1 = true;
            }
            insertedG0 = false;
            result.push(line);
        } else {
            result.push(line);
        }
    });

    // Abschließendes PenUp‑Kommando am Ende des gesamten Textes
    result.push(penUp);
    return result.join('\n');
}

// ------------------------------------------------------------
// Button‑Handler
// ------------------------------------------------------------

// Einfügen – Textarea vorher leeren, dann Clipboard‑Inhalt einfügen
document.getElementById('pasteBtn').addEventListener('click', async () => {
    const textarea = document.getElementById('myTextarea');
    textarea.value = '';                     // vorhandenen Inhalt entfernen
    try {
        const text = await navigator.clipboard.readText();
        textarea.value = text;
    } catch (err) {
        alert('Einfügen fehlgeschlagen: ' + err);
    }
});

document.getElementById('copyBtn').addEventListener('click', async () => {
    const textarea = document.getElementById('myTextarea');
    try {
        await navigator.clipboard.writeText(textarea.value);
        alert('Inhalt kopiert!');
    } catch (err) {
        alert('Kopieren fehlgeschlagen: ' + err);
    }
});

document.getElementById('convertBtn').addEventListener('click', () => {
    const textarea   = document.getElementById('myTextarea');
    const original   = textarea.value;
    const converted  = insertConversionLines(original);
    textarea.value   = converted;
});

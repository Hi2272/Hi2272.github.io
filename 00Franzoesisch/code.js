const speakBtn = document.getElementById('speak'); // Button zum Starten/Stoppen der Sprachausgabe
const textarea = document.getElementById('text'); // Textbereich zur Anzeige des Lückentexts

let voices = []; // Array zur Speicherung der verfügbaren Stimmen
let stopp = true; // Flag zur Steuerung des Vorlesens
let lang = 'fr-FR'; // Standard Sprache, wird beim Laden von Steuerung.json überschrieben

// Sofort nach Laden von Steuerung.json einlesen und UI / lang setzen
(async function loadSteuerung() {
    try {
        const res = await fetch('Steuerung.json'); // JSON-Datei abrufen
        if (!res.ok) throw new Error('Steuerung.json nicht gefunden'); // Fehlerbehandlung
        const cfg = await res.json(); // JSON-Inhalt parsen
        if (cfg.titel) {
            const el = document.getElementById('title');
            if (el) el.innerHTML = cfg.titel;
            const seitentitel = document.getElementById('pagetitle');
            if (seitentitel) seitentitel.innerHTML = cfg.titel;
            
        }
        if (cfg.untertitel || cfg.untertitel) {
            const subKey = cfg.untertitel ? 'untertitel' : 'untertitel'; // Untertitel-Schlüssel ermitteln
            const elSub = document.getElementById('subtitle'); // Element für den Untertitel
            if (elSub) {
                elSub.innerHTML = cfg[subKey]; // Untertitel setzen
            }
        }
        if (cfg.sprache) lang = cfg.sprache; // Sprache setzen, falls angegeben
    } catch (e) {
        console.warn('Fehler beim Laden von Steuerung.json:', e); // Fehlerprotokollierung
    }
})();

/**
 * Lädt verfügbare Stimmen und gibt das Array zurück.
 */
function loadVoices() {
    voices = speechSynthesis.getVoices() || []; // Stimmen abrufen
    console.log('Verfügbare Stimmen:', voices); // Verfügbare Stimmen protokollieren
    return voices; // Stimmen zurückgeben
}

/**
 * Wartet, bis Stimmen verfügbar sind oder ein Timeout erreicht ist.
 */
function waitForVoices(timeout = 2000) {
    return new Promise(resolve => {
        const v = loadVoices(); // Stimmen laden
        if (v && v.length) {
            resolve(v); // Stimmen sofort zurückgeben, wenn verfügbar
            return;
        }
        let resolved = false; // Flag zur Überwachung des Auflösungsstatus
        const timer = setTimeout(() => {
            if (!resolved) {
                resolved = true; // Timer abgelaufen
                resolve(loadVoices()); // Stimmen nach Timeout zurückgeben
            }
        }, timeout);

        if ('onvoiceschanged' in speechSynthesis) {
            const handler = () => {
                if (!resolved) {
                    resolved = true; // Stimmen wurden geändert
                    clearTimeout(timer); // Timer stoppen
                    speechSynthesis.onvoiceschanged = null; // Handler entfernen
                    resolve(loadVoices()); // Stimmen zurückgeben
                }
            };
            speechSynthesis.onvoiceschanged = handler; // Event-Handler für Stimmenänderung setzen
        }
    });
}

/**
 * Wählt die französische Stimme aus den verfügbaren Stimmen aus.
 */
function selectFrenchVoice() {
    return voices.find(v => v.lang && v.lang.toLowerCase().startsWith('fr')) || // Stimme mit französischer Sprache finden
        voices.find(v => v.name && /franc|french|français/i.test(v.name)); // Stimme mit französischem Namen finden
}

/**
 * Hilfsfunktion: spricht einen Utterance und wartet auf Ende/Fehler.
 */
function speakUtterance(utterance) {
    return new Promise((resolve) => {
        const onEnd = () => { cleanup(); resolve(); }; // Callback für das Ende der Sprachausgabe
        const onError = () => { cleanup(); resolve(); }; // Callback für Fehler bei der Sprachausgabe
        function cleanup() {
            utterance.removeEventListener('end', onEnd); // Event-Listener entfernen
            utterance.removeEventListener('error', onError); // Event-Listener entfernen
        }
        utterance.addEventListener('end', onEnd); // Event-Listener für das Ende hinzufügen
        utterance.addEventListener('error', onError); // Event-Listener für Fehler hinzufügen
        speechSynthesis.speak(utterance); // Sprachausgabe starten
    });
}

/**
 * Wartet für eine bestimmte Zeit in Millisekunden.
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms)); // Promise zur Verzögerung
}

/**
 * Lädt den Text aus der Datei und gibt ihn als Lückentext zurück.
 */
async function loadText() {
    const response = await fetch('text.md'); // Textdatei abrufen
    const text = await response.text(); // Textinhalt parsen
    return text.split('\n').map(line => line.trim()).filter(line => line.length > 0); // Zeilen in ein Array umwandeln
}

/**
 * Erstellt den Lückentext, indem Wörter zwischen '*' durch '____' ersetzt werden.
 */
function createGapText(sentence, asHTML) {
    if (!asHTML) {
        let s=sentence.replace(/\*(.*?)\*/g, '?');
        s=s.replaceAll("J'","Je");
        return s.replaceAll("'", ""); // Apostroph entfernen

    }   else { 
        return "<strong>"+sentence.replace(/\*(.*?)\*/g, '')+"</strong>";
    }
}

/**
 * Ersetzt jedes zweite <b> Tag durch </b>.
 */
function replaceEverySecondBold(inputString) {
    let count = 0; // Zähler für <b> Tags
    const modifiedString = inputString.replace(/<b>/g, () => {
        count++; // Zähler erhöhen
        return count % 2 === 0 ? '</b>' : '<b>'; // Jedes zweite <b> Tag ersetzen
    });
    return modifiedString; // Modifizierten String zurückgeben
}

/**
 * Entfernt alle Inhalte in runden Klammern (inkl. Klammern) 
 * sowie alle Sternchen (*) aus dem übergebenen Satz.
 *
 * @param {string} sentence – Eingabestring, z. B. "Hallo ich (und du), willkommen"
 * @returns {string} – Bereinigter String, z. B. "Hallo ich, willkommen"
 */
function createSolutionText(sentence, asHTML) {
    if (sentence == null) return ''; // Überprüfen, ob der Satz null ist
    let s = "";
    if (asHTML) {
        s = String(sentence).replace(/\*/g, '<b>'); // Sternchen in <b> Tags umwandeln
    } else {
        s = String(sentence).replace(/\*/g, '');
        s=s.replaceAll("J' ","J");
        s=s.replaceAll("'","");
    }
    let out = ''; // Ausgabestring
    let depth = 0; // Tiefe der Klammernestung

    for (const ch of s) {
        if (ch === '(') { depth++; continue; } // Klammeröffnung: Tiefe erhöhen
        if (ch === ')') { if (depth > 0) depth--; else out += ch; continue; } // Klammerabschluss: Tiefe verringern
        if (depth === 0) out += ch; // Zeichen hinzufügen, wenn nicht in Klammern
    }
    out = replaceEverySecondBold(out); // Jedes zweite <b> Tag ersetzen

    return out
        .replace(/\s+([,.;:!?])/g, '$1') // Überflüssige Leerzeichen vor Satzzeichen entfernen
        .replace(/\s{2,}/g, ' ') // Mehrere Leerzeichen durch ein einzelnes ersetzen
        .trim(); // Leerzeichen am Anfang und Ende entfernen
}

/**
 * Hauptfunktion für das Sprechen und Anzeigen der Texte.
 */
async function speak(text) {
    if (!text || !text.trim()) {
        textarea.focus(); // Textbereich fokussieren, wenn kein Text vorhanden ist
        return;
    }

    await waitForVoices(); // Auf verfügbare Stimmen warten
    speechSynthesis.cancel(); // Aktuelle Sprachausgabe abbrechen
    const voice = selectFrenchVoice(); // Französische Stimme auswählen

    const paragraphs = text.split(/\r?\n{1,}/).map(p => p.trim()).filter(p => p.length > 0); // Text in Absätze aufteilen
    for (let i = paragraphs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Zufälligen Index für den Tausch ermitteln
        // Elemente vertauschen
        [paragraphs[i], paragraphs[j]] = [paragraphs[j], paragraphs[i]]; // Absätze zufällig mischen
    }

    for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
        if (stopp) { return; } // Abbrechen, wenn Stopp-Flag gesetzt ist
        const para = paragraphs[pIndex]; // Aktuellen Absatz speichern
        const gapText = createGapText(para, false); // Lückentext erstellen
        const gapHTML = createGapText(para, true); // HTML Lückentext erstellen
        const solutionText = createSolutionText(para, false); // Lösungstext erstellen
        const solutionHTML = createSolutionText(para, true); // HTML Lösungstext erstellen

        // Lückentext anzeigen
        textarea.innerHTML = gapHTML + "<br>" + textarea.innerHTML; // Lückentext im Textbereich anzeigen
        // Erstes Vorlesen
        const u = new SpeechSynthesisUtterance(gapText); // Utterance für den Lückentext erstellen
        u.lang = lang; // Sprache der Utterance setzen

        if (stopp) { return; } // Abbrechen, wenn Stopp-Flag gesetzt ist
        if (voice) u.voice = voice; // Stimme setzen, falls vorhanden
        await speakUtterance(u); // Lückentext vorlesen
        if (stopp) { return; } // Abbrechen, wenn Stopp-Flag gesetzt ist
        // Pause vor dem Anzeigen der Lösung
        await sleep(3000); // 3 Sekunden warten
        if (stopp) { return; } // Abbrechen, wenn Stopp-Flag gesetzt ist

        // Lösung anzeigen
        textarea.innerHTML = textarea.innerHTML.replace(gapHTML, solutionHTML); // Lückentext durch Lösung ersetzen
        // Lösung vorlesen
        const ul = new SpeechSynthesisUtterance(solutionText); // Utterance für den Lösungstext erstellen
        ul.lang = lang; // Sprache der Utterance setzen
        if (voice) ul.voice = voice; // Stimme setzen, falls vorhanden
        if (stopp) { return; } // Abbrechen, wenn Stopp-Flag gesetzt ist
        await speakUtterance(ul); // Lösung vorlesen
        await sleep(500); // 0,5 Sekunden warten
    }
    speakBtn.innerHTML = "Start";
    speakBtn.style.backgroundColor="#FF8";
    stopp=true;
}

// Event-Listener für den Speak-Button
speakBtn.addEventListener('click', async () => {
    stopp = !stopp; // Stopp-Flag umschalten
    if (!stopp) {
        speakBtn.innerHTML = "Stopp";
        textarea.innerHTML = "";
        speakBtn.style.backgroundColor="#F55";
        const text = await loadText();
        await speak(text.join('\n'));
    } else {
        speakBtn.innerHTML = "Start";
        speakBtn.style.backgroundColor="#FF8";
        
    }
});
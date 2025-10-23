const speakBtn = document.getElementById('speak');
const stoppBtn=document.getElementById('stopp');
const textarea = document.getElementById('text');
let voices = [];
let stopp=false;

/**
 * Lädt verfügbare Stimmen und gibt das Array zurück.
 */
function loadVoices() {
    voices = speechSynthesis.getVoices() || [];
    console.log('Verfügbare Stimmen:', voices);
    return voices;
}

/**
 * Wartet, bis Stimmen verfügbar sind oder ein Timeout erreicht ist.
 */
function waitForVoices(timeout = 2000) {
    return new Promise(resolve => {
        const v = loadVoices();
        if (v && v.length) {
            resolve(v);
            return;
        }
        let resolved = false;
        const timer = setTimeout(() => {
            if (!resolved) {
                resolved = true;
                resolve(loadVoices());
            }
        }, timeout);

        if ('onvoiceschanged' in speechSynthesis) {
            const handler = () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timer);
                    speechSynthesis.onvoiceschanged = null;
                    resolve(loadVoices());
                }
            };
            speechSynthesis.onvoiceschanged = handler;
        }
    });
}

function selectFrenchVoice() {
    return voices.find(v => v.lang && v.lang.toLowerCase().startsWith('fr')) ||
           voices.find(v => v.name && /franc|french|français/i.test(v.name));
}

/**
 * Hilfsfunktion: spricht einen Utterance und wartet auf Ende/Fehler.
 */
function speakUtterance(utterance) {
    return new Promise((resolve) => {
        const onEnd = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); resolve(); };
        function cleanup() {
            utterance.removeEventListener('end', onEnd);
            utterance.removeEventListener('error', onError);
        }
        utterance.addEventListener('end', onEnd);
        utterance.addEventListener('error', onError);
        speechSynthesis.speak(utterance);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Lädt den Text aus der Datei und gibt ihn als Lückentext zurück.
 */
async function loadText() {
    const response = await fetch('text.md');
    const text = await response.text();
    return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
}

/**
 * Erstellt den Lückentext, indem Wörter zwischen '*' durch '____' ersetzt werden.
 */
function createGapText(sentence) {
    return sentence.replace(/\*(.*?)\*/g, '____');
}

function replaceEverySecondBold(inputString) {
    // Zähle die <b> Tags
    let count = 0;

    // Ersetze jedes <b> Tag durch eine spezielle Markierung
    const modifiedString = inputString.replace(/<b>/g, () => {
        count++;
        // Ersetze jedes zweite <b> durch </b>
        return count % 2 === 0 ? '</b>' : '<b>';
    });

    return modifiedString;
}

/**
 * Erstellt den Lösungstext, indem die Wörter zwischen '*' hervorgehoben werden.
 */
/**
 * Entfernt alle Inhalte in runden Klammern (inkl. Klammern) 
 * sowie alle Sternchen (*) aus dem übergebenen Satz.
 *
 * @param {string} sentence – Eingabestring, z. B. "Hallo ich (und du), willkommen"
 * @returns {string} – Bereinigter String, z. B. "Hallo ich, willkommen"
 */
function createSolutionText(sentence) {
    if (sentence == null) return '';
    const s = String(sentence).replace(/\*/g, '<b>');
    let out = '';
    let depth = 0;
  
    for (const ch of s) {
      if (ch === '(') { depth++; continue; }
      if (ch === ')') { if (depth > 0) depth--; else out += ch; continue; }
      if (depth === 0) out += ch;
    }
    out=replaceEverySecondBold(out);
    
    return out
      .replace(/\s+([,.;:!?])/g, '$1')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
  
/**
 * Hauptfunktion für das Sprechen und Anzeigen der Texte.
 */
async function speak(text) {
    if (!text || !text.trim()) {
        textarea.focus();
        return;
    }

    await waitForVoices();
    speechSynthesis.cancel();
    const voice = selectFrenchVoice();

    const paragraphs = text.split(/\r?\n{1,}/).map(p => p.trim()).filter(p => p.length > 0);
    for (let i = paragraphs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Elemente vertauschen
        [paragraphs[i], paragraphs[j]] = [paragraphs[j], paragraphs[i]];
    }

    for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
        if (stopp){return;}
        const para = paragraphs[pIndex];
        const gapText = createGapText(para);
        const solutionText = createSolutionText(para);

        // Lückentext anzeigen
        textarea.innerHTML += "<tr><td>"+gapText+"</td>";
    
        // Erstes Vorlesen
        const u = new SpeechSynthesisUtterance(gapText);
        u.lang = 'fr-FR';
        if (stopp){return;}
       
        if (voice) u.voice = voice;
        await speakUtterance(u);
        if (stopp){return;}
       
        // Pause vor dem Anzeigen der Lösung
        await sleep(3000);
        if (stopp){return;}
       
        // Lösung anzeigen
        textarea.innerHTML += "<td> "+solutionText+"</td></tr>";
        
        // Lösung vorlesen

        const ul = new SpeechSynthesisUtterance(solutionText);
        ul.lang = 'fr-FR';
        if (voice) ul.voice = voice;
        if (stopp){return;}
       
        await speakUtterance(ul);
        await sleep(500);
     
    }
}

// Event-Listener für den Speak-Button
speakBtn.addEventListener('click', async () => {
    stopp=false;
    pause=false;
    textarea.innerHTML="";
    const text = await loadText();
    await speak(text.join('\n'));
});
// Event-Listener für den Stopp-Button

stoppBtn.addEventListener('click', () => {
    stopp=true;
    if ( speechSynthesis.speaking) {
        speechSynthesis.cancel(); // Stoppt die Sprachausgabe
    }
});

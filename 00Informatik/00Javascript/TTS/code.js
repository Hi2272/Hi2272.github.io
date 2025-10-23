// ...existing code...
const speakBtn = document.getElementById('speak');
const textarea = document.getElementById('text');

let voices = [];

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
    // Bevorzugt Stimmen mit fr- prefix, ansonsten Name-matching
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
 * Neuer Ablauf:
 * - Zerlege den Text an Absatzmarken (eine oder mehrere Leerzeilen).
 * - Für jeden Absatz nacheinander:
 *   * Teile an '*' auf.
 *   * Sammle (alt)-Wörter, entferne sie aus dem Text.
 *   * Erstes Vorlesen: an Sternstellen jeweils ~1s Pause (Stern-Wort nicht gesprochen),
 *     am Absatzende die gesammelten (alt)-Wörter sprechen.
 *   * 3s Pause.
 *   * Zweites Vorlesen: kompletter Absatz mit den Stern-Wörtern (ohne Klammerinhalte).
 */
async function speak(text) {
    if (!text || !text.trim()) {
        textarea.focus();
        return;
    }

    await waitForVoices();
    speechSynthesis.cancel();
    const voice = selectFrenchVoice();

    // Absätze (mehrere Leerzeilen als Trenner) -> trim und leere entfernen
    const paragraphs = text.split(/\r?\n{1,}/).map(p => p.trim()).filter(p => p.length > 0);

    for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
        const para = paragraphs[pIndex];

        // Split an '*' -> even indices: normal text; odd indices: zwischen Sternen (main)
        const parts = para.split('*');

        const secondParts = [];  // für zweites Vorlesen (Stern-Wörter)
        const altList = [];      // gesammelte (alt)-Wörter

        // Durchlauf um (alt) zu extrahieren und secondParts aufzubauen
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i % 2 === 0) {
                // normaler Text
                secondParts.push(part);
                continue;
            }
            // Stern-Teil (main)
            const main = part;
            let alt = null;
            if (i + 1 < parts.length) {
                const next = parts[i + 1];
                const m = next.match(/^\s*\(([^)]+)\)/);
                if (m) {
                    alt = m[1].trim();
                    // entferne die (alt) aus dem nächsten Part
                    parts[i + 1] = next.slice(next.indexOf(')') + 1);
                }
            }
            if (alt !== null) altList.push(alt);
            secondParts.push(main);
        }

        // --- Erstes Vorlesen: sukzessiv sprechen, an Stern-Stellen 1s Pause ---
        let buffer = '';
        for (let i = 0; i < parts.length; i++) {
            if (i % 2 === 0) {
                // normalen Text anhäufen
                buffer += parts[i];
            } else {
                // Stern-Stelle: zuerst den gepufferten Text sprechen
                if (buffer.trim()) {
                    const u = new SpeechSynthesisUtterance(buffer);
                    u.lang = 'fr-FR';
                    if (voice) u.voice = voice;
                    u.rate = 1;
                    u.pitch = 1;
                    await speakUtterance(u);
                }
                buffer = '';
                // ca. 1s Pause anstelle des Stern-Wortes
                await sleep(1000);
            }
        }
        // letzten gepufferten Text sprechen
        if (buffer.trim()) {
            const u = new SpeechSynthesisUtterance(buffer);
            u.lang = 'fr-FR';
            if (voice) u.voice = voice;
            u.rate = 1;
            u.pitch = 1;
            await speakUtterance(u);
        }

        // Am Absatzende die gesammelten (alt)-Wörter sprechen (falls vorhanden)
        if (altList.length > 0) {
            const altText = altList.join(', ');
            const uAlt = new SpeechSynthesisUtterance(altText);
            uAlt.lang = 'fr-FR';
            if (voice) uAlt.voice = voice;
            uAlt.rate = 1;
            uAlt.pitch = 1;
            await speakUtterance(uAlt);
        }

        // 3 Sekunden Pause vor zweitem Vorlesen dieses Absatzes
        await sleep(3000);

        // --- Zweites Vorlesen: kompletter Absatz mit den Stern-Wörtern ---
        const secondText = secondParts.join('');
        if (secondText.trim()) {
            const u2 = new SpeechSynthesisUtterance(secondText);
            u2.lang = 'fr-FR';
            if (voice) u2.voice = voice;
            u2.rate = 1;
            u2.pitch = 1;
            await speakUtterance(u2);
        }

        // Optional: kurze Pause zwischen Absätzen
        if (pIndex < paragraphs.length - 1) {
            await sleep(600);
        }
    }
}

// Button aktivieren sobald DOM geladen ist (Script liegt am Ende, sollte bereits verfügbar sein)
speakBtn.addEventListener('click', () => speak(textarea.value));

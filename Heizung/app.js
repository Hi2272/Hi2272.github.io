// Web Serial API Anycubic I3 Mega controller
// Baudrate: 250000

const connectBtn = document.getElementById('connectBtn');
const heatBtn = document.getElementById('heatBtn');
const shakeBtn = document.getElementById('shakeBtn');
const statusEl = document.getElementById('status');
const logArea = document.getElementById('logArea');

const bedTempInput = document.getElementById('bedTemp');
const bedTempStatus = document.getElementById('bedTempStatus');

let port = null;
let writer = null;
let reader = null;
let keepReading = false;
let bedHeating = false; // neuer Zustand: ob Bett geheizt wird


let tempPollInterval = null; // interval id for polling M105
const TEMP_POLL_MS = 2000; // poll alle 2 Sekunden

// Shaking state
let shaking = false;        // whether continuous shaking is active
let shakeLoopRunning = false; // prevents parallel loops
const SHAKE_FEEDRATE = 1500; // mm/min
const SHAKE_MOVE_MM = 10;     // mm of each move
const SHAKE_DELAY_MS = 300;   // delay between moves (ms) - adjust as needed

// Utility logging
function log(...args){
  const line = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  const time = new Date().toLocaleTimeString();
  logArea.textContent += `[${time}] ${line}\n`;
  logArea.scrollTop = logArea.scrollHeight;
}

// Update status badge
function setStatus(text, color){
  statusEl.textContent = text;
  statusEl.style.background = color || '#fff7cc';
}

// Try to auto-connect to CP2102 if possible
// Returns true if a port was opened and assigned to `port`
async function tryAutoConnectCP2102(){
  if (!('serial' in navigator)) {
    log('Web Serial API nicht verfügbar; kein automatischer Versuch möglich.');
    return false;
  }

  try {
    // getPorts() returns ports that the origin already has permission to access.
    const ports = await navigator.serial.getPorts();
    if (!ports || ports.length === 0) {
      log('Keine bereits erlaubten seriellen Ports gefunden (navigator.serial.getPorts() leer).');
      return false;
    }

    log(`Gefundene erlaubte Ports: ${ports.length}. Prüfe auf CP2102...`);

    // Known CP2102 identifiers (vendor/product) — common Silicon Labs vendorId is 0x10C4 (hex) = 4292 (dec)
    // CP210x family product IDs vary (e.g. CP2102 often 0xEA60 etc). We check vendorId 0x10C4 as primary hint.
    // Note: USB ids are available in port.getInfo() in browsers that support it.
    for (const p of ports) {
      try {
        const info = p.getInfo ? p.getInfo() : {};
        // info may contain usbVendorId and usbProductId
        const vid = info.usbVendorId;
        const pid = info.usbProductId;
        log(`Port info: usbVendorId=${vid || 'n/a'} usbProductId=${pid || 'n/a'}`);

        // Check vendor id for Silicon Labs 0x10C4 (decimal 4292)
        if (vid === 0x10C4 || vid === 4292) {
          log('Port scheint ein Silicon Labs (CP210x) Gerät zu sein. Versuch zu öffnen...');
          // try open
          try {
            await p.open({ baudRate: 250000 });
            port = p;
            log('Automatische Verbindung zu CP2102-Port erfolgreich.');
            return true;
          } catch (openErr) {
            log('Automatisches Öffnen dieses Ports fehlgeschlagen:', openErr.message || openErr);
            // try next port
          }
        } else {
          // Some browsers might not expose usbVendorId; we can also check manufacturer/product strings if available via serial.getPorts metadata,
          // but getInfo is typically the way. We'll still try to open ports if usb ids are not present but the port name contains "CP210" in a label? Not possible reliably.
          // So skip ports without matching vendor id.
          log('Port ist kein CP210x (vendor id passt nicht).');
        }
      } catch (innerErr) {
        console.warn('Fehler beim Prüfen eines Ports', innerErr);
      }
    }

    log('Kein passender CP2102-Port unter erlaubten Ports gefunden oder alle Open-Versuche fehlgeschlagen.');
    return false;
  } catch (err) {
    console.error('Fehler beim automatischen Prüfen von Ports:', err);
    return false;
  }
}

// Request and open serial port (will try auto CP2102 first)
async function connectSerial(){
  if (!('serial' in navigator)) {
    setStatus('Web Serial API nicht verfügbar', '#ffdede');
    log('Web Serial API nicht verfügbar. Verwende Chrome/Edge und https oder localhost.');
    return;
  }

  try {
    setStatus('Verbindung läuft...', '#fff3cd');
    log('Verbindungsversuch gestartet: Zuerst automatische Suche nach CP2102...');

    // First try to auto-connect to CP2102 among already-permitted ports
    const autoOk = await tryAutoConnectCP2102();

    if (!autoOk) {
      // Fallback: ask user to choose a port via the listbox
      log('Öffne Port-Auswahl (Benutzer muss Port wählen)...');
      // Optional: you can pass filter options to requestPort to propose devices, but filters must be explicit and reduce choices.
      // For broad compatibility we call requestPort() without filters and let the user pick.
      try {
        const requestedPort = await navigator.serial.requestPort();
        if (!requestedPort) {
          log('Kein Port ausgewählt.');
          setStatus('Nicht verbunden', '#ffdede');
          return;
        }
        await requestedPort.open({ baudRate: 250000 });
        port = requestedPort;
        log('Manuelle Verbindung aufgebaut.');
      } catch (reqErr) {
        console.error('Fehler bei manueller Port-Auswahl:', reqErr);
        setStatus('Verbindungsfehler', '#ffdede');
        log('Fehler beim Öffnen des gewählten Ports:', reqErr.message || reqErr);
        return;
      }
    }

    // If we reach here, port should be set and open
    if (!port) {
      setStatus('Nicht verbunden', '#ffdede');
      log('Kein Port offen nach automatischem Versuch und manueller Auswahl.');
      return;
    }

    setStatus('Verbunden', '#e6ffed');
    log('Port geöffnet mit Baudrate 250000');

    // Create writer
    writer = port.writable.getWriter();

    // Start reading responses from printer
    keepReading = true;
    readLoop();

    // Enable action buttons
    heatBtn.disabled = false;
    shakeBtn.disabled = false;
    connectBtn.textContent = 'Trennen';

    // If the printer expects an initial wake / line, send an empty line to get "start" or "ok" responses
    await sendLine('');

    // Start polling temperatures
    startTempPolling();
  } catch (err) {
    console.error(err);
    setStatus('Verbindungsfehler', '#ffdede');
    log('Fehler beim Verbinden:', err.message || err);
  }
}

// Close serial connection
async function disconnectSerial(){
  try {
    // Stop shaking if active
    if (shaking) {
      await stopShaking();
    }

    // Stop polling
    stopTempPolling();

    keepReading = false;

    if (reader) {
      try { await reader.cancel(); } catch(e){}
      try { reader.releaseLock(); } catch(e){}
      reader = null;
    }

    if (writer) {
      try { await writer.close(); } catch(e){}
      try { writer.releaseLock(); } catch(e){}
      writer = null;
    }

    if (port) {
      try { await port.close(); } catch(e){}
      port = null;
    }

    setStatus('Nicht verbunden', '#fff7cc');
    log('Port geschlossen');
    heatBtn.disabled = true;
    // Reset heat button state on disconnect
    bedHeating = false;
    heatBtn.textContent = 'Heizen';
    heatBtn.style.background = '';

    shakeBtn.disabled = true;
    connectBtn.textContent = 'Verbinden';

    // Reset temp display
    bedTempInput.value = '—';
    bedTempStatus.textContent = 'keine Daten';
    bedTempStatus.className = 'temp-status offline';
  } catch (err) {
    console.error(err);
    log('Fehler beim Trennen:', err.message || err);
  }
}

// Send a single line (G-Code) terminated by newline
async function sendLine(line){
  if (!writer) {
    log('Nicht verbunden. Kann nicht senden.');
    return;
  }
  try {
    const data = `${line}\n`;
    const enc = new TextEncoder();
    await writer.write(enc.encode(data));
    log('>>>', line);
  } catch (err) {
    console.error(err);
    log('Fehler beim Senden:', err.message || err);
  }
}

// Read loop: read incoming bytes and append to log, also parse temp replies
async function readLoop(){
  if (!port) return;
  try {
    const textDecoder = new TextDecoder();
    const readable = port.readable;
    if (!readable) {
      log('Keine lesbaren Daten vom Port');
      return;
    }
    reader = readable.getReader();

    let buffer = '';

    while (keepReading) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        const chunk = textDecoder.decode(value);
        buffer += chunk;

        // Split lines by newline (handle \r\n or \n)
        let lines = buffer.split(/\r?\n/);
        // keep last partial line in buffer
        buffer = lines.pop();

        for (let line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          log('<<<', trimmed);

          // If line contains temperature info, try to parse
          parseTemperatureLine(trimmed);
        }
      }
    }
  } catch (err) {
    if (err.name !== 'NetworkError' && err.name !== 'AbortError') {
      console.error('Lese-Fehler', err);
      log('Lese-Fehler:', err.message || err);
    }
  } finally {
    if (reader) {
      try { reader.releaseLock(); } catch(e){}
      reader = null;
    }
  }
}

// Parse common M105 response formats and update display
function parseTemperatureLine(line){
  let bedMatch = line.match(/B:?\s*([0-9]+(?:\.[0-9]+)?)/i);
  if (!bedMatch) {
    bedMatch = line.match(/bed[:=]\s*([0-9]+(?:\.[0-9]+)?)/i);
  }
  if (bedMatch) {
    const bedTemp = parseFloat(bedMatch[1]);
    updateBedTempDisplay(bedTemp);
    return;
  }
  let altMatch = line.match(/\bB\s+([0-9]+(?:\.[0-9]+)?)/i);
  if (altMatch) {
    const bedTemp = parseFloat(altMatch[1]);
    updateBedTempDisplay(bedTemp);
    return;
  }
}

// Update the temperature UI
function updateBedTempDisplay(temp){
  const formatted = `${temp.toFixed(1)} °C`;
  bedTempInput.value = formatted;

  const target = 60;
  const delta = Math.abs(temp - target);

  bedTempStatus.classList.remove('ok','warning','offline');
  if (isNaN(temp)) {
    bedTempStatus.textContent = 'keine Daten';
    bedTempStatus.classList.add('offline');
  } else if (delta <= 2) {
    bedTempStatus.textContent = 'Ziel erreicht';
    bedTempStatus.classList.add('ok');
  } else {
    bedTempStatus.textContent = 'Heizvorgang';
    bedTempStatus.classList.add('warning');
  }
}

// Start polling temperatures by sending M105 at interval
function startTempPolling(){
  if (tempPollInterval) return;
  pollTempOnce();
  tempPollInterval = setInterval(pollTempOnce, TEMP_POLL_MS);
  bedTempStatus.textContent = 'Abfrage läuft';
  bedTempStatus.className = 'temp-status';
}

// Stop polling
function stopTempPolling(){
  if (tempPollInterval) {
    clearInterval(tempPollInterval);
    tempPollInterval = null;
  }
}

// send M105 once
async function pollTempOnce(){
  if (!writer) return;
  await sendLine('M105');
}

// Heizen: Set bed temperature to 60°C
async function heatBedTo60(){
  await sendLine('M140 S60'); // set bed temperature (non-blocking)
  await pollTempOnce();
}

// Schütteln: toggle continuous shaking
shakeBtn.addEventListener('click', async () => {
  if (!port) { log('Nicht verbunden'); return; }

  if (!shaking) {
    startShaking();
  } else {
    stopShaking();
  }
});

// Start shaking loop
function startShaking(){
  if (shaking) return;
  shaking = true;
  shakeBtn.textContent = 'Schütteln stoppen';
  shakeBtn.style.background = 'linear-gradient(#fff0f6,#fff5f9)'; // optional visual cue
  log('Starte Schütteln (kontinuierlich)');
  // Launch async loop but don't await it here
  continuousShakeLoop().catch(err => {
    console.error('Shake loop error', err);
    log('Fehler im Schüttel-Loop:', err.message || err);
    shaking = false;
    shakeBtn.textContent = 'Schütteln starten';
  });
}

// Stop shaking loop
async function stopShaking(){
  if (!shaking) return;
  log('Stoppe Schütteln...');
  shaking = false;
  // Reset button UI
  shakeBtn.textContent = 'Schütteln starten';
  shakeBtn.style.background = '';
}

// The continuous loop that sends alternating moves while `shaking` is true
async function continuousShakeLoop(){
  // Prevent running multiple parallel loops
  if (shakeLoopRunning) return;
  shakeLoopRunning = true;

  try {
    // ensure relative mode at start
    await sendLine('G91');

    // We alternate between +SHAKE_MOVE_MM and -SHAKE_MOVE_MM
    let direction = 1;

    while (shaking) {
      const move = direction > 0 ? SHAKE_MOVE_MM : -SHAKE_MOVE_MM;
      // Send move
      await sendLine(`G1 Y${move} F${SHAKE_FEEDRATE}`);
      // Wait a bit to give the printer time to execute/queue the move.
      await sleep(SHAKE_DELAY_MS);

      // Flip direction
      direction = -direction;

      // Small safety check: if port closed externally, stop
      if (!port) {
        log('Port geschlossen, Schütteln beendet');
        break;
      }
    }

    // After loop: return to absolute mode
    await sendLine('G90');
    log('Schütteln beendet');
  } finally {
    shakeLoopRunning = false;
    shaking = false;
    // Ensure button UI is reset (in case stop was triggered externally)
    shakeBtn.textContent = 'Schütteln starten';
    shakeBtn.style.background = '';
  }
}

// small helper sleep
function sleep(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

// Button handlers for connect / heat are unchanged
connectBtn.addEventListener('click', async () => {
  if (port) {
    await disconnectSerial();
  } else {
    await connectSerial();
  }
});

// Heat-Button: togglet Heizen ein/aus
heatBtn.addEventListener('click', async () => {
  if (!port) { log('Nicht verbunden'); return; }

  if (!bedHeating) {
    // Starte Heizen: sende M140 S60 und ändere Button-UI
    await sendLine('M140 S60');
    bedHeating = true;
    heatBtn.textContent = 'Heizen beenden';
    heatBtn.style.background = 'linear-gradient(#e6f0ff,#cfe7ff)'; // blaues Aussehen
    // optional: direkt einmal Temperatur abfragen
    await pollTempOnce();
    log('Heizen gestartet (Bett 60°C)');
  } else {
    // Beende Heizen: sende M140 S0 (Bett aus) oder M140 S<aktuell 0>
    await sendLine('M140 S0');
    bedHeating = false;
    heatBtn.textContent = 'Heizen';
    heatBtn.style.background = ''; // zurücksetzen auf Standard
    log('Heizen gestoppt (Bett ausgeschaltet)');
  }
});


// If user closes page, try to clean up
window.addEventListener('beforeunload', async (e) => {
  if (port) {
    try {
      // stop shaking
      shaking = false;
      stopTempPolling();
      keepReading = false;
      if (reader) await reader.cancel();
      if (writer) await writer.close();
      await port.close();
    } catch (err){}
  }
});

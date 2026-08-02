let port = null;
let keepReading = false;
let reader = null;

const connectBtn = document.getElementById('connectBtn');
const startBtn   = document.getElementById('startBtn');
const stopBtn    = document.getElementById('stopBtn');

const decimalBox = document.getElementById('decimalBox');
const hexBox     = document.getElementById('hexBox');
const charBox    = document.getElementById('charBox');

/* -------------------------------------------------
   Verbinden – öffnet die erste vom Nutzer gewählte
   COM‑Schnittstelle mit 115200 Bd.
   ------------------------------------------------- */
connectBtn.addEventListener('click', async () => {
  try {
    // Sicherheitsbeschränkung: Der Browser muss den Nutzer
    // zur Auswahl einer seriellen Schnittstelle auffordern.
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    connectBtn.disabled = true;
    startBtn.disabled   = false;
    stopBtn.disabled    = false;
  } catch (e) {
    console.error('Verbindung fehlgeschlagen:', e);
  }
});

/* -------------------------------------------------
   Start – liest kontinuierlich Daten und schreibt
   sie in die drei Textfelder.
   ------------------------------------------------- */
startBtn.addEventListener('click', async () => {
  if (!port) return;
  keepReading = true;

  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  const inputStream = textDecoder.readable;
  reader = inputStream.getReader();

  while (keepReading) {
    try {
      const { value, done } = await reader.read();
      if (done) break;
        charBox.value    += value;
        charBox.value    += '\n';
     
      for (let i = 0; i < value.length; i++) {
        const byte = value.charCodeAt(i);
        decimalBox.value += byte + '\n';
        hexBox.value     += '0x' + byte.toString(16).toUpperCase().padStart(2, '0') + '\n';
     //   charBox.value    += (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.';
     //   charBox.value    += '\n';
      }

      // Scroll automatisch nach unten
      decimalBox.scrollTop = decimalBox.scrollHeight;
      hexBox.scrollTop     = hexBox.scrollHeight;
      charBox.scrollTop    = charBox.scrollHeight;
    } catch (err) {
      console.error('Lesefehler:', err);
      break;
    }
  }
});

/* -------------------------------------------------
   Stopp – beendet das Lesen und schließt die
   serielle Verbindung.
   ------------------------------------------------- */
stopBtn.addEventListener('click', async () => {
  keepReading = false;
  if (reader) {
    await reader.cancel();
    await reader.releaseLock();
  }
  if (port) {
    await port.close();
  }
  connectBtn.disabled = false;
  startBtn.disabled   = true;
  stopBtn.disabled    = true;
});

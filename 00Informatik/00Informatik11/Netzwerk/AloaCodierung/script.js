const startBtn = document.getElementById('startBtn');
const sendBtn = document.getElementById('sendBtn');
const collisionBtn = document.getElementById('collisionBtn');
const initialDiv = document.getElementById('initial');
const situationDiv = document.getElementById('situation');
const timerDiv = document.getElementById('timerSection');
const collisionDiv = document.getElementById('collision');
const countdownEl = document.getElementById('countdown');
const stationNrEl = document.getElementById('stationNr');
const sendTextEl = document.getElementById('sendText');
const optimierungsBtn=document.getElementById('optimierungBtn');


let timerId = null;
// ---------- Hilfsfunktionen ----------
function getRandomInt(min, max) {
    // inkl. min und max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateMeasurements() {
    const temperature = getRandomInt(25, 35);      // °C
    const pressure = getRandomInt(960, 1100);   // hPa
    const humidity = getRandomInt(50, 85);      // %
    return { temperature, pressure, humidity };
}
function buildSendText(stationNr, { temperature, pressure, humidity }) {
    s="";
    if (stationNr<10) s='0';
    s=s+String(stationNr)+' 00 '+String(temperature)
    if (pressure<1000)  {s=s+' 0';} else {s=s+' ';}
    return s    +String(pressure)+" "+String(humidity);
}

function startCountdown(seconds) {
    clearInterval(timerId);
    let remaining = seconds;
    countdownEl.textContent = remaining;
    timerDiv.classList.remove('hidden');
    timerId = setInterval(() => {
        remaining--;
        countdownEl.textContent = remaining;
        if (remaining <= 0) {
            clearInterval(timerId);
            timerDiv.classList.add('hidden');
            collisionDiv.classList.remove('hidden');
        }
    }, 1000);

}
// ---------- Event‑Handler ----------
startBtn.addEventListener('click', () => {
    // Stations‑Nummer vom Lehrer einholen
    const nr = prompt('Bitte geben Sie die Stations‑Nummer ein:', '');
    // Zufällige Messwerte erzeugen und Text vorbereiten
    const measurements = generateMeasurements();
    const sendText = buildSendText(nr || '—', measurements);
    sendTextEl.innerHTML = sendText;
    sendTextEl.classList.remove('hidden');

    // UI umschalten
    initialDiv.classList.add('hidden');
    situationDiv.classList.remove('hidden');

});
sendBtn.addEventListener('click', () => {
    sendBtn.classList.add('hidden');
    const seconds = getRandomInt(5, 30);
    startCountdown(seconds);
});
collisionBtn.addEventListener('click', () => {
    collisionDiv.classList.add('hidden');
    const seconds = getRandomInt(5, 30);
    startCountdown(seconds);
});

optimierungsBtn.addEventListener('click', () => {
    // Öffnet die Datei Optimierung.html in einem neuen Tab/Fenster
    window.open('03Pakete.html', '_blank');
});

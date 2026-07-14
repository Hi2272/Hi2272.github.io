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
const fehlerDiv=document.getElementById('fehler');
const lsgBtn=document.getElementById("loesungBtn");

const slotLaenge=5;


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
    return String(stationNr)+'001'+String(temperature);
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
    const seconds = getRandomInt(1, 5)*slotLaenge;
    startCountdown(seconds);
});

lsgBtn.addEventListener('click',()=>{
    alert("Die Zeit-Slots verschieben sich, da nicht alle Stationen zur exakt gleichen Zeit eine Kollision melden.\n\nBei Slotted-Aloa ist es wichtig, dass alle Stationen ihre Sendezeiten mit einem zentralen Zeit-Server abstimmen.");
})
collisionBtn.addEventListener('click', () => {
    collisionDiv.classList.add('hidden');
    fehlerDiv.classList.remove('hidden');

    const seconds = getRandomInt(1,5)*slotLaenge;
    startCountdown(seconds);
});
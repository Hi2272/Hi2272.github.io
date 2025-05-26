const gameWidth = window.innerWidth * 0.25;
const gameHeight = gameWidth;


const config = {
    type: Phaser.AUTO,
    width:  gameWidth,
    height: gameHeight,
    parent: 'phaser-game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // Set to true to see physics bodies and velocities
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);


const NUM_PARTICLES = 10;
const PARTICLE_RADIUS = 8;
const PARTICLE_COLOR = 0xff0000; // Red
const HELIUM_MASS_U = 4; // Atomic mass units

const KELVIN_OFFSET = 273.15;
const CELSIUS_TO_KELVIN_INT_OFFSET = 273;
const REFERENCE_TEMP_K = 298;
const BASE_SPEED_PIXELS_PER_SECOND = 150;

let particles;
let currentTemperatureKelvin = REFERENCE_TEMP_K;

// HTML Elemente für die Steuerung und Anzeige
let tempSlider;
let tempValueDisplay;
let showSpeedsButton; // NEU: Referenz für den Button
let speedInfoDisplay; // NEU: Referenz für das Textfeld

function preload() {
    // Keine Assets zum Laden für einfache Kreise
}

function create() {
    this.physics.world.setBounds(0, 0, gameWidth, gameHeight);

    particles = this.physics.add.group();

    for (let i = 0; i < NUM_PARTICLES; i++) {
        const x = Phaser.Math.Between(PARTICLE_RADIUS, gameWidth - PARTICLE_RADIUS);
        const y = Phaser.Math.Between(PARTICLE_RADIUS, gameHeight - PARTICLE_RADIUS);

        const particleGraphics = this.add.graphics();
        particleGraphics.fillStyle(PARTICLE_COLOR, 1);
        particleGraphics.fillCircle(PARTICLE_RADIUS, PARTICLE_RADIUS, PARTICLE_RADIUS);
        const textureKey = `particleTexture${i}`;
        particleGraphics.generateTexture(textureKey, PARTICLE_RADIUS * 2, PARTICLE_RADIUS * 2);
        particleGraphics.destroy();

        const particle = particles.create(x, y, textureKey);

        particle.setCircle(PARTICLE_RADIUS);
        particle.setCollideWorldBounds(true);
        particle.setBounce(1);
        setParticleVelocity(particle, currentTemperatureKelvin);
    }

    this.physics.add.collider(particles, particles, onParticleCollide);

    // HTML-Elemente holen
    tempSlider = document.getElementById('tempSlider');
    tempValueDisplay = document.getElementById('tempValue');
    showSpeedsButton = document.getElementById('showSpeedsButton'); // NEU
    speedInfoDisplay = document.getElementById('speedInfoParagraph'); // NEU

    const initialCelsius = Math.round(currentTemperatureKelvin - CELSIUS_TO_KELVIN_INT_OFFSET);
    tempSlider.value = initialCelsius;
    tempValueDisplay.textContent = `${initialCelsius} °C`;

    tempSlider.addEventListener('input', (event) => {
        const tempCelsius = parseInt(event.target.value);
        tempValueDisplay.textContent = `${tempCelsius} °C`;
        currentTemperatureKelvin = tempCelsius + CELSIUS_TO_KELVIN_INT_OFFSET;
        if (currentTemperatureKelvin < 0) currentTemperatureKelvin = 0;
        adjustAllParticleSpeeds(currentTemperatureKelvin);
    });

    // NEU: Event Listener für den "Geschwindigkeiten anzeigen" Button
    if (showSpeedsButton && speedInfoDisplay) {
        showSpeedsButton.addEventListener('click', () => {
            displayParticleSpeeds();
        });
    } else {
        if (!showSpeedsButton) console.error("Button 'showSpeedsButton' wurde nicht im DOM gefunden!");
        if (!speedInfoDisplay) console.error("Absatz 'speedInfoParagraph' wurde nicht im DOM gefunden!");
    }
}

function update() {
    // Die Physik-Engine kümmert sich um die Bewegung und Kollisionen.
}

function setParticleVelocity(particle, temperatureKelvin) {
    const speed = calculateSpeedForTemperature(temperatureKelvin);
    const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI);

    particle.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
    );
}

function calculateSpeedForTemperature(temperatureKelvin) {
    if (temperatureKelvin <= 0) return 0;
    return BASE_SPEED_PIXELS_PER_SECOND * Math.sqrt(temperatureKelvin / REFERENCE_TEMP_K);
}

function adjustAllParticleSpeeds(newTemperatureKelvin) {
    const newSpeedMagnitude = calculateSpeedForTemperature(newTemperatureKelvin);

    particles.getChildren().forEach(particle => {
        const currentVelocity = particle.body.velocity;
        const currentSpeed = currentVelocity.length();

        if (newSpeedMagnitude === 0) {
            particle.setVelocity(0, 0);
        } else if (currentSpeed > 0) {
            const factor = newSpeedMagnitude / currentSpeed;
            particle.setVelocity(currentVelocity.x * factor, currentVelocity.y * factor);
        } else {
            setParticleVelocity(particle, newTemperatureKelvin);
        }
    });
}

function onParticleCollide(particleA, particleB) {
    // Für diese Simulation nicht weiter relevant, da Bounce=1 die Stöße handhabt.
}

// NEUE FUNKTION: Zeigt die Geschwindigkeiten der Teilchen an
function displayParticleSpeeds() {
    if (!particles || !speedInfoDisplay) {
        console.warn("Partikelgruppe oder Anzeigeelement nicht initialisiert.");
        return;
    }

    // 1. Geschwindigkeiten sammeln
    const speedsArray = [];
    let sumOfSpeeds = 0; // NEU: Variable für die Summe der Geschwindigkeiten

    particles.getChildren().forEach(particle => {
        const speed = particle.body.velocity.length(); // Betrag des Geschwindigkeitsvektors
        speedsArray.push(speed);
        sumOfSpeeds += speed; // NEU: Geschwindigkeit zur Summe addieren
    });

    // 2. Mittlere Geschwindigkeit berechnen
    let averageSpeed = 0; // NEU
    if (speedsArray.length > 0) { // NEU: Division durch Null vermeiden
        averageSpeed = sumOfSpeeds / speedsArray.length;
    }

    // 3. Geschwindigkeiten aufsteigend sortieren
    speedsArray.sort((a, b) => a - b); // Numerische Sortierung

    // 4. HTML-String erstellen
    let speedsHTML = "<strong>Teilchengeschwindigkeiten:</strong><br>";
    // NEU: Mittlere Geschwindigkeit hinzufügen
    speedsHTML += `Mittlere Geschwindigkeit: ${averageSpeed.toFixed(2)}<br><br>`;
    speedsHTML += "<strong>Einzelgeschwindigkeiten:</strong><br>";

    speedsArray.forEach((speed, index) => {
        // Ohne Einheit "px/s"
        speedsHTML += `Teilchen ${index + 1}: ${speed.toFixed(2)}<br>`;
    });

    // .innerHTML verwenden, damit <br> und <strong> interpretiert werden
    speedInfoDisplay.innerHTML = speedsHTML;
}

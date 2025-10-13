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
const RED = 0xff0000; // Red
const BLUE= 0x0000FF;
const masse = 4; // Atomic mass units

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
        if (i%2==0){
            particleGraphics.fillStyle(RED, 1);
        } else {
            particleGraphics.fillStyle(BLUE, 1);
    
        }
            particleGraphics.fillCircle(PARTICLE_RADIUS, PARTICLE_RADIUS, PARTICLE_RADIUS);
        const textureKey = `particleTexture${i}`;
        particleGraphics.generateTexture(textureKey, PARTICLE_RADIUS * 2, PARTICLE_RADIUS * 2);
        particleGraphics.destroy();

        const particle = particles.create(x, y, textureKey);

        particle.setCircle(PARTICLE_RADIUS);
        particle.setCollideWorldBounds(true);
        particle.setBounce(1);
        if (i%2==0){
            particle.setMass(masse);
        } else{
            particle.setMass(masse*10);
        }
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
    adjustAllParticleSpeeds(currentTemperatureKelvin);
    displayParticleSpeeds();

}

function update() {
    // Die Physik-Engine kümmert sich um die Bewegung und Kollisionen.
}

function setParticleVelocity(particle, temperatureKelvin) {
    console.log(particle.body.mass);
    const speed = vMittel(temperatureKelvin,particle.body.mass);
    const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI);
    console.log(particle.body.mass+" "+speed+" "+angle);
 
    particle.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
    );
    
}

function adjustAllParticleSpeeds(newTemperatureKelvin) {
    particles.getChildren().forEach(particle => {
        setParticleVelocity(particle, newTemperatureKelvin);
    });
    displayParticleSpeeds();
}

function onParticleCollide(particleA, particleB) {
    // Für diese Simulation nicht weiter relevant, da Bounce=1 die Stöße handhabt.
}

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
    speedsHTML += `Mittlere Geschwindigkeit: ${averageSpeed.toFixed(2)} m/s<br><br>`;
    speedsHTML += "<strong>Einzelgeschwindigkeiten:</strong><br>";
    speedsHTML+="<table><tr>"
    speedsArray.forEach((speed, index) => {
        // Ohne Einheit "px/s"
        speedsHTML += `<td> ${speed.toFixed(2)}  m/s</td> `;
        if (index%3==2){speedsHTML+='</tr><tr>';}
    });
    speedsHTML+="</tr></table>"
    
    // .innerHTML verwenden, damit <br> und <strong> interpretiert werden
    speedInfoDisplay.innerHTML = speedsHTML;
}


function vMittel(temperaturK, masseU) {
    const kB = 1.380649e-23; // Boltzmann-Konstante in J/K
    const uInKg = 1.66053906660e-27; // 1 u in kg
  
    // Masse in Kilogramm umrechnen
    const masseKg = masseU * uInKg;
  
    // Formel für die mittlere Geschwindigkeit
    const vMittlere = Math.sqrt((8 * kB * temperaturK) / (Math.PI * masseKg));
  
    return vMittlere; // Ergebnis in m/s
  }
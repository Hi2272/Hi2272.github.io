// Größe des Spielfelds (wie in deiner Version)
const gameWidth = window.innerWidth * 0.25;
const gameHeight = gameWidth;

const config = {
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    parent: 'phaser-game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // Auf true setzen, um Kollisionskörper zu sehen
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

const NUM_PARTICLES_TOTAL = 10;
const NUM_PARTICLES_TYPE1 = 5; // Leichtere Teilchen
// NUM_PARTICLES_TYPE2 ergibt sich aus TOTAL - TYPE1 (Schwerere Teilchen)

const PARTICLE_RADIUS = 8;
const COLOR_TYPE1 = 0xff0000; // Rot
const COLOR_TYPE2 = 0x0000ff; // Blau

// Temperaturkonstanten
const CELSIUS_TO_KELVIN_INT_OFFSET = 273;
const REFERENCE_TEMP_K = 298;
const BASE_SPEED_PIXELS_PER_SECOND = 150;
const REFERENCE_MASS_U = 4; // Referenzmasse für BASE_SPEED

let particles;
let currentTemperatureKelvin = REFERENCE_TEMP_K;

// HTML Elemente
let tempSlider, tempValueDisplay;
let massSlider1, massValue1;
let massSlider2, massValue2;

// Aktuelle Massen (in u)
let massType1 = 4;  // z.B. Helium
let massType2 = 32; // z.B. Sauerstoff O2
const MIN_MASS = 0.001; // Minimale Masse, um Division durch Null zu vermeiden

function preload() {
    // Nichts zu laden
}

function create() {
    this.physics.world.setBounds(0, 0, gameWidth, gameHeight);

    particles = this.physics.add.group();

    for (let i = 0; i < NUM_PARTICLES_TOTAL; i++) {
        const x = Phaser.Math.Between(PARTICLE_RADIUS, gameWidth - PARTICLE_RADIUS);
        const y = Phaser.Math.Between(PARTICLE_RADIUS, gameHeight - PARTICLE_RADIUS);

        let particleColor;
        let particleMassValue;
        let particleType;

        if (i < NUM_PARTICLES_TYPE1) {
            particleColor = COLOR_TYPE1;
            particleMassValue = massType1;
            particleType = 1;
        } else {
            particleColor = COLOR_TYPE2;
            particleMassValue = massType2;
            particleType = 2;
        }

        const particleGraphics = this.add.graphics();
        particleGraphics.fillStyle(particleColor, 1);
        particleGraphics.fillCircle(PARTICLE_RADIUS, PARTICLE_RADIUS, PARTICLE_RADIUS);
        const textureKey = `particleTexture_${particleType}_${i}`;
        particleGraphics.generateTexture(textureKey, PARTICLE_RADIUS * 2, PARTICLE_RADIUS * 2);
        particleGraphics.destroy();

        const particle = particles.create(x, y, textureKey);
        // Wichtig: Der Sprite-Ursprung ist standardmäßig (0.5, 0.5), d.h. x,y ist der Mittelpunkt
        particle.setCircle(PARTICLE_RADIUS); // Setzt die Kollisionsform auf einen Kreis mit dem gegebenen Radius

        // Wandkollisionen werden weiterhin von Arcade Physics gehandhabt
        particle.setCollideWorldBounds(true);
        particle.setBounce(1); // Elastische Wandkollisionen

        particle.setData('mass_u', particleMassValue > MIN_MASS ? particleMassValue : MIN_MASS);
        particle.setData('type', particleType);
        // particle.setMass() von Phaser wird für Partikel-Partikel nicht mehr dominieren,
        // aber für Wandkollisionen und andere Interaktionen ist es gut, es konsistent zu halten.
        particle.setMass(particleMassValue > MIN_MASS ? particleMassValue : MIN_MASS);

        setParticleVelocityByTemperatureAndMass(particle, currentTemperatureKelvin);
    }

    // Manuelle Handhabung von Partikel-Partikel-Kollisionen
    this.physics.add.overlap(particles, particles, handleParticleOverlap, checkParticleApproach, this);

    // UI Elemente holen und Listener initialisieren
    tempSlider = document.getElementById('tempSlider');
    tempValueDisplay = document.getElementById('tempValue');
    massSlider1 = document.getElementById('massSlider1');
    massValue1 = document.getElementById('massValue1');
    massSlider2 = document.getElementById('massSlider2');
    massValue2 = document.getElementById('massValue2');

    const initialCelsius = Math.round(currentTemperatureKelvin - CELSIUS_TO_KELVIN_INT_OFFSET);
    tempSlider.value = initialCelsius;
    tempValueDisplay.textContent = `${initialCelsius} °C`;
    massSlider1.value = massType1;
    massValue1.textContent = `${massType1} u`;
    massSlider2.value = massType2;
    massValue2.textContent = `${massType2} u`;

    tempSlider.addEventListener('input', (event) => {
        const tempCelsius = parseInt(event.target.value);
        tempValueDisplay.textContent = `${tempCelsius} °C`;
        currentTemperatureKelvin = tempCelsius + CELSIUS_TO_KELVIN_INT_OFFSET;
        if (currentTemperatureKelvin < 0) currentTemperatureKelvin = 0;
        adjustAllParticleSpeeds(currentTemperatureKelvin);
    });
    massSlider1.addEventListener('input', (event) => {
        massType1 = parseFloat(event.target.value);
        if (massType1 <= MIN_MASS) massType1 = MIN_MASS;
        massValue1.textContent = `${massType1.toFixed(1)} u`;
        updateParticleProperties(1, massType1);
    });
    massSlider2.addEventListener('input', (event) => {
        massType2 = parseFloat(event.target.value);
        if (massType2 <= MIN_MASS) massType2 = MIN_MASS;
        massValue2.textContent = `${massType2.toFixed(1)} u`;
        updateParticleProperties(2, massType2);
    });
}

function updateParticleProperties(type, newMassU) {
    const effectiveMass = newMassU > MIN_MASS ? newMassU : MIN_MASS;
    particles.getChildren().forEach(particle => {
        if (particle.getData('type') === type) {
            particle.setData('mass_u', effectiveMass);
            particle.setMass(effectiveMass); // Phasers Masse auch aktualisieren
            adjustSingleParticleSpeed(particle, currentTemperatureKelvin, effectiveMass);
        }
    });
}

function adjustSingleParticleSpeed(particle, temperatureKelvin, particleMassU) {
    let newSpeedMagnitude = 0;
    if (temperatureKelvin > 0 && particleMassU > 0) {
        newSpeedMagnitude = BASE_SPEED_PIXELS_PER_SECOND * Math.sqrt((temperatureKelvin / REFERENCE_TEMP_K) * (REFERENCE_MASS_U / particleMassU));
    }

    const currentVelocity = particle.body.velocity;
    const currentSpeed = currentVelocity.length();

    if (newSpeedMagnitude === 0) {
        particle.setVelocity(0, 0);
    } else if (currentSpeed > 0) {
        const factor = newSpeedMagnitude / currentSpeed;
        particle.setVelocity(currentVelocity.x * factor, currentVelocity.y * factor);
    } else {
        const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI);
        particle.setVelocity(Math.cos(angle) * newSpeedMagnitude, Math.sin(angle) * newSpeedMagnitude);
    }
}

function setParticleVelocityByTemperatureAndMass(particle, temperatureKelvin) {
    const particleMassU = particle.getData('mass_u');
    adjustSingleParticleSpeed(particle, temperatureKelvin, particleMassU);
}

function adjustAllParticleSpeeds(newTemperatureKelvin) {
    particles.getChildren().forEach(particle => {
        const particleMassU = particle.getData('mass_u');
        adjustSingleParticleSpeed(particle, newTemperatureKelvin, particleMassU);
    });
}

// Prozess-Callback für physics.add.overlap:
// Gibt true zurück, wenn handleParticleOverlap für dieses Paar ausgeführt werden soll.
function checkParticleApproach(particleA, particleB) {
    if (particleA === particleB) return false; // Ein Teilchen kann nicht mit sich selbst kollidieren

    // Vektor von Partikel A zu Partikel B
    const collisionVector = new Phaser.Math.Vector2(particleB.x - particleA.x, particleB.y - particleA.y);
    // Relative Geschwindigkeit von Partikel A gegenüber Partikel B
    const relativeVelocity = new Phaser.Math.Vector2(
        particleA.body.velocity.x - particleB.body.velocity.x,
        particleA.body.velocity.y - particleB.body.velocity.y
    );

    // Wenn das Skalarprodukt von relativer Geschwindigkeit und Kollisionsvektor positiv ist,
    // bewegen sie sich voneinander weg (entlang der Linie, die sie verbindet).
    // Wir wollen nur reagieren, wenn sie sich aufeinander zubewegen (Skalarprodukt < 0).
    // Ein kleiner Schwellenwert verhindert "Jitter", wenn sie sich fast parallel bewegen.
    if (relativeVelocity.dot(collisionVector) >= -1e-3) { // -1e-3 ist ein kleiner negativer Schwellenwert
        return false;
    }
    return true;
}

// Hauptkollisionsbehandlung, aufgerufen durch physics.add.overlap
function handleParticleOverlap(particleA, particleB) {
    // Massen aus setData holen (unsere logischen Massen)
    const m1 = particleA.getData('mass_u');
    const m2 = particleB.getData('mass_u');

    // Aktuelle Geschwindigkeiten als Vektoren
    const v1 = new Phaser.Math.Vector2(particleA.body.velocity.x, particleA.body.velocity.y);
    const v2 = new Phaser.Math.Vector2(particleB.body.velocity.x, particleB.body.velocity.y);

    // --- 1. Elastische Kollisionsberechnung ---
    // Vektor von particleA zu particleB (definiert die Kollisionsachse)
    const collisionNormal = new Phaser.Math.Vector2(particleB.x - particleA.x, particleB.y - particleA.y);
    collisionNormal.normalize(); // Normalisieren auf Einheitslänge

    // Geschwindigkeiten in Komponenten entlang der Kollisionsnormalen projizieren
    const v1n_scalar = v1.dot(collisionNormal);
    const v2n_scalar = v2.dot(collisionNormal);

    // Tangentiale Komponenten (bleiben bei reibungsfreiem Stoß unverändert)
    const v1t_vec = new Phaser.Math.Vector2(v1.x - v1n_scalar * collisionNormal.x, v1.y - v1n_scalar * collisionNormal.y);
    const v2t_vec = new Phaser.Math.Vector2(v2.x - v2n_scalar * collisionNormal.x, v2.y - v2n_scalar * collisionNormal.y);

    // Neue Normalengeschwindigkeiten nach dem 1D elastischen Stoß (Impuls- und Energieerhaltung)
    const new_v1n_scalar = (v1n_scalar * (m1 - m2) + 2 * m2 * v2n_scalar) / (m1 + m2);
    const new_v2n_scalar = (v2n_scalar * (m2 - m1) + 2 * m1 * v1n_scalar) / (m1 + m2);

    // Neue Normalengeschwindigkeitsvektoren
    const new_v1n_vec = collisionNormal.clone().scale(new_v1n_scalar);
    const new_v2n_vec = collisionNormal.clone().scale(new_v2n_scalar);

    // Endgültige Geschwindigkeitsvektoren zusammensetzen (Normal + Tangential)
    const final_v1 = new_v1n_vec.add(v1t_vec);
    const final_v2 = new_v2n_vec.add(v2t_vec);

    particleA.body.setVelocity(final_v1.x, final_v1.y);
    particleB.body.setVelocity(final_v2.x, final_v2.y);

    // --- 2. Manuelle Trennung der überlappenden Teilchen ---
    // Notwendig, da physics.overlap keine automatische Trennung vornimmt.
    const dist = Phaser.Math.Distance.Between(particleA.x, particleA.y, particleB.x, particleB.y);
    const targetDist = PARTICLE_RADIUS * 2;
    const overlap = targetDist - dist;

    if (overlap > 0.01) { // Nur trennen, wenn Überlappung signifikant ist
        // Normalenvektor von A nach B (identisch zu collisionNormal, wenn Positionen unverändert)
        const separationNormal = collisionNormal; // Bereits normalisiert

        // Wie viel jedes Teilchen verschoben wird, proportional zur inversen Masse
        // (Schwerere Teilchen bewegen sich weniger)
        const totalInverseMass = (1 / m1) + (1 / m2);
        
        let pushA, pushB;
        if (totalInverseMass <= 0) { // Sollte nicht passieren wegen MIN_MASS
            pushA = overlap / 2;
            pushB = overlap / 2;
        } else {
            pushA = overlap * (1 / m1) / totalInverseMass;
            pushB = overlap * (1 / m2) / totalInverseMass;
        }
        
        // Teilchen auseinanderschieben
        particleA.x -= separationNormal.x * pushA;
        particleA.y -= separationNormal.y * pushA;
        particleB.x += separationNormal.x * pushB;
        particleB.y += separationNormal.y * pushB;

        // Wichtig: Arcade Physics Body Positionen an die neuen Sprite-Positionen anpassen.
        // Da der Sprite-Ursprung (0.5,0.5) ist, ist x/y der Mittelpunkt.
        // body.x/y ist die linke obere Ecke des Kollisionskörpers.
        particleA.body.position.set(particleA.x - PARTICLE_RADIUS, particleA.y - PARTICLE_RADIUS);
        particleB.body.position.set(particleB.x - PARTICLE_RADIUS, particleB.y - PARTICLE_RADIUS);
    }
}

function update() {
    // Physik (Bewegung der Teilchen, Wandkollisionen) läuft automatisch durch Arcade Physics.
    // Unsere Partikel-Partikel-Kollisionen werden durch den overlap-Callback in handleParticleOverlap gehandhabt.
}
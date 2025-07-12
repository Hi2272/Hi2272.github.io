Okay, das ist eine spannende Erweiterung! Die Kollisionsphysik zwischen Teilchen unterschiedlicher Masse ist der interessanteste Teil hier. Phaser's Arcade Physics behandelt `setMass()` nicht out-of-the-box für benutzerdefinierte Kollisionsantworten zwischen zwei dynamischen Körpern mit unterschiedlichen Massen auf eine Weise, die einen perfekten elastischen Stoß mit korrekter Energie- und Impulserhaltung simuliert. Wir müssen das manuell im `onParticleCollide` Callback implementieren.

Hier sind die Schritte und der Code:

**1. Neue HTML-Datei: `masse.html`**

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teilchenbewegung & Masse Simulation</title>
    <link rel="stylesheet" href="style.css"> <!-- Wir können das alte CSS wiederverwenden -->
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
</head>
<body>
    <h1>Teilchenbewegung im Gas mit variabler Masse</h1>
    <div class="controls">
        <div>
            <label for="tempSlider">Temperatur:</label>
            <input type="range" id="tempSlider" min="-272" max="727" value="25">
            <span id="tempValue">25 °C</span>
        </div>
        <hr>
        <div>
            <label for="massSlider1">Masse Teilchen Typ 1 (Rot):</label>
            <input type="range" id="massSlider1" min="1" max="235" value="4"> <!-- Min auf 1u gesetzt, um 0u zu vermeiden -->
            <span id="massValue1">4 u</span>
        </div>
        <div>
            <label for="massSlider2">Masse Teilchen Typ 2 (Blau):</label>
            <input type="range" id="massSlider2" min="1" max="235" value="32"> <!-- Min auf 1u gesetzt -->
            <span id="massValue2">32 u</span>
        </div>
    </div>
    <div id="phaser-game"></div>
    <script src="gameMasse.js"></script> <!-- Verweis auf neues JS -->
</body>
</html>
```

**Änderungen in `style.css` (optional, für bessere Darstellung der neuen Slider):**

Du kannst die vorhandene `style.css` verwenden. Wenn du die Steuerelemente etwas übersichtlicher gestalten möchtest, könntest du hinzufügen:

```css
/* In style.css, am Ende hinzufügen oder anpassen */
.controls div {
    margin-bottom: 10px;
}

.controls hr {
    margin: 15px 0;
    border: 0;
    border-top: 1px solid #ccc;
}

.controls label {
    display: inline-block; /* Stellt sicher, dass Labels eine Breite haben */
    width: 220px; /* Anpassen für längere Labels */
    vertical-align: middle;
}

.controls input[type="range"] {
    width: 180px; /* Etwas schmaler, wenn mehr Platz für Label gebraucht wird */
}
```

**2. Neue JavaScript-Datei: `gameMasse.js`**

Diese Datei wird umfangreicher, insbesondere die `onParticleCollide`-Funktion.

```javascript
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
const NUM_PARTICLES_TYPE1 = 5;
// NUM_PARTICLES_TYPE2 ergibt sich aus TOTAL - TYPE1

const PARTICLE_RADIUS = 8;
const COLOR_TYPE1 = 0xff0000; // Rot
const COLOR_TYPE2 = 0x0000ff; // Blau

// Temperaturkonstanten (wie gehabt)
const CELSIUS_TO_KELVIN_INT_OFFSET = 273;
const REFERENCE_TEMP_K = 298;
const BASE_SPEED_PIXELS_PER_SECOND = 150; // Basisgeschwindigkeit für v ~ sqrt(T)

let particles; // Gruppe für alle Teilchen
let currentTemperatureKelvin = REFERENCE_TEMP_K;

// HTML Elemente
let tempSlider, tempValueDisplay;
let massSlider1, massValue1;
let massSlider2, massValue2;

// Aktuelle Massen (in u)
let massType1 = 4;
let massType2 = 32;
const MIN_MASS = 0.001; // Minimale Masse, um Division durch Null zu vermeiden, wenn Slider auf 0 könnte

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
        let particleMass;
        let particleType;

        if (i < NUM_PARTICLES_TYPE1) {
            particleColor = COLOR_TYPE1;
            particleMass = massType1;
            particleType = 1;
        } else {
            particleColor = COLOR_TYPE2;
            particleMass = massType2;
            particleType = 2;
        }
        
        // Grafik für das Teilchen erstellen
        const particleGraphics = this.add.graphics();
        particleGraphics.fillStyle(particleColor, 1);
        particleGraphics.fillCircle(PARTICLE_RADIUS, PARTICLE_RADIUS, PARTICLE_RADIUS);
        const textureKey = `particleTexture_${particleType}_${i}`;
        particleGraphics.generateTexture(textureKey, PARTICLE_RADIUS * 2, PARTICLE_RADIUS * 2);
        particleGraphics.destroy();

        const particle = particles.create(x, y, textureKey);
        particle.setCircle(PARTICLE_RADIUS);
        particle.setCollideWorldBounds(true);
        particle.setBounce(1); // Für Wandkollisionen immer noch nützlich

        // Benutzerdefinierte Daten für Masse und Typ speichern
        particle.setData('mass', particleMass > 0 ? particleMass : MIN_MASS);
        particle.setData('type', particleType);
        // Phaser's setMass() hat in Arcade wenig Einfluss auf Kollisionen zwischen zwei dynamischen Körpern
        // particle.setMass(particleMass);

        setParticleVelocityByTemperature(particle, currentTemperatureKelvin);
    }

    // Kollisionshandler für Teilchen-Teilchen-Stöße
    this.physics.add.collider(particles, particles, handleParticleCollision);

    // UI Elemente holen
    tempSlider = document.getElementById('tempSlider');
    tempValueDisplay = document.getElementById('tempValue');
    massSlider1 = document.getElementById('massSlider1');
    massValue1 = document.getElementById('massValue1');
    massSlider2 = document.getElementById('massSlider2');
    massValue2 = document.getElementById('massValue2');

    // Initiale UI Werte setzen
    const initialCelsius = Math.round(currentTemperatureKelvin - CELSIUS_TO_KELVIN_INT_OFFSET);
    tempSlider.value = initialCelsius;
    tempValueDisplay.textContent = `${initialCelsius} °C`;

    massSlider1.value = massType1;
    massValue1.textContent = `${massType1} u`;
    massSlider2.value = massType2;
    massValue2.textContent = `${massType2} u`;

    // Event Listener
    tempSlider.addEventListener('input', (event) => {
        const tempCelsius = parseInt(event.target.value);
        tempValueDisplay.textContent = `${tempCelsius} °C`;
        currentTemperatureKelvin = tempCelsius + CELSIUS_TO_KELVIN_INT_OFFSET;
        if (currentTemperatureKelvin < 0) currentTemperatureKelvin = 0;
        adjustAllParticleSpeeds(currentTemperatureKelvin);
    });

    massSlider1.addEventListener('input', (event) => {
        massType1 = parseInt(event.target.value);
        massValue1.textContent = `${massType1} u`;
        updateParticleMasses(1, massType1);
    });

    massSlider2.addEventListener('input', (event) => {
        massType2 = parseInt(event.target.value);
        massValue2.textContent = `${massType2} u`;
        updateParticleMasses(2, massType2);
    });
}

function updateParticleMasses(type, newMass) {
    const effectiveMass = newMass > 0 ? newMass : MIN_MASS;
    particles.getChildren().forEach(particle => {
        if (particle.getData('type') === type) {
            particle.setData('mass', effectiveMass);
            // particle.setMass(effectiveMass); // Wie gesagt, Arcade's setMass() ist hier nicht der Hauptakteur
        }
    });
}


function setParticleVelocityByTemperature(particle, temperatureKelvin) {
    // Die Geschwindigkeit ist proportional zu sqrt(T).
    // Für eine exaktere Darstellung müsste hier auch die Masse rein: v ~ sqrt(T/m)
    // Wir halten es einfach: Die Temperatur skaliert eine Basisgeschwindigkeit.
    // Die unterschiedlichen Massen wirken sich dann in den Kollisionen aus.
    let speed = 0;
    if (temperatureKelvin > 0) {
        speed = BASE_SPEED_PIXELS_PER_SECOND * Math.sqrt(temperatureKelvin / REFERENCE_TEMP_K);
    }
    
    const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI);
    particle.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
}

function adjustAllParticleSpeeds(newTemperatureKelvin) {
    particles.getChildren().forEach(particle => {
        let newSpeedMagnitude = 0;
        if (newTemperatureKelvin > 0) {
            newSpeedMagnitude = BASE_SPEED_PIXELS_PER_SECOND * Math.sqrt(newTemperatureKelvin / REFERENCE_TEMP_K);
        }

        const currentVelocity = particle.body.velocity;
        const currentSpeed = currentVelocity.length();

        if (newSpeedMagnitude === 0) {
            particle.setVelocity(0, 0);
        } else if (currentSpeed > 0) {
            const factor = newSpeedMagnitude / currentSpeed;
            particle.setVelocity(currentVelocity.x * factor, currentVelocity.y * factor);
        } else { // Particle was at rest, give it a new random direction
            setParticleVelocityByTemperature(particle, newTemperatureKelvin);
        }
    });
}

function handleParticleCollision(particleA, particleB) {
    // Hole Massen. Stelle sicher, dass sie nicht 0 sind für die Formel.
    let m1 = particleA.getData('mass');
    let m2 = particleB.getData('mass');
    if (m1 <= 0) m1 = MIN_MASS;
    if (m2 <= 0) m2 = MIN_MASS;

    // Aktuelle Geschwindigkeiten als Vektoren
    const v1 = new Phaser.Math.Vector2(particleA.body.velocity.x, particleA.body.velocity.y);
    const v2 = new Phaser.Math.Vector2(particleB.body.velocity.x, particleB.body.velocity.y);

    // Vektor von particleA zu particleB (Kollisionsnormale)
    const collisionNormal = new Phaser.Math.Vector2(particleB.x - particleA.x, particleB.y - particleA.y);
    collisionNormal.normalize();

    // Geschwindigkeiten in Komponenten entlang der Kollisionsnormalen projezieren
    // v1n = v1 . collisionNormal
    const v1n_scalar = v1.dot(collisionNormal);
    // v2n = v2 . collisionNormal
    const v2n_scalar = v2.dot(collisionNormal);

    // Tangentiale Komponenten (bleiben bei reibungsfreiem Stoß unverändert)
    // v1t_vec = v1 - v1n_scalar * collisionNormal
    const v1t_vec = new Phaser.Math.Vector2(
        v1.x - v1n_scalar * collisionNormal.x,
        v1.y - v1n_scalar * collisionNormal.y
    );
    // v2t_vec = v2 - v2n_scalar * collisionNormal
    const v2t_vec = new Phaser.Math.Vector2(
        v2.x - v2n_scalar * collisionNormal.x,
        v2.y - v2n_scalar * collisionNormal.y
    );
    
    // Neue Normalengeschwindigkeiten nach dem 1D elastischen Stoß
    const new_v1n_scalar = (v1n_scalar * (m1 - m2) + 2 * m2 * v2n_scalar) / (m1 + m2);
    const new_v2n_scalar = (v2n_scalar * (m2 - m1) + 2 * m1 * v1n_scalar) / (m1 + m2);

    // Neue Normalengeschwindigkeitsvektoren
    const new_v1n_vec = new Phaser.Math.Vector2(new_v1n_scalar * collisionNormal.x, new_v1n_scalar * collisionNormal.y);
    const new_v2n_vec = new Phaser.Math.Vector2(new_v2n_scalar * collisionNormal.x, new_v2n_scalar * collisionNormal.y);

    // Endgültige Geschwindigkeitsvektoren zusammensetzen
    const final_v1 = new_v1n_vec.add(v1t_vec);
    const final_v2 = new_v2n_vec.add(v2t_vec);

    particleA.body.setVelocity(final_v1.x, final_v1.y);
    particleB.body.setVelocity(final_v2.x, final_v2.y);

    // Manchmal können sich Teilchen durch die diskrete Physik-Engine leicht überlappen.
    // Ein kleiner "Kick" auseinander entlang der Normalen kann helfen, ist aber oft nicht nötig,
    // da Arcade Physics bereits eine Trennung durchführt, bevor dieser Callback aufgerufen wird.
    // Wenn man Probleme mit "klebenden" Teilchen sieht, kann man das hier aktivieren:
    /*
    const overlap = PARTICLE_RADIUS * 2 - Phaser.Math.Distance.Between(particleA.x, particleA.y, particleB.x, particleB.y);
    if (overlap > 0) {
        const pushFactor = 0.5; // Wie stark sie auseinander gedrückt werden
        particleA.x -= collisionNormal.x * overlap * pushFactor;
        particleA.y -= collisionNormal.y * overlap * pushFactor;
        particleB.x += collisionNormal.x * overlap * pushFactor;
        particleB.y += collisionNormal.y * overlap * pushFactor;
    }
    */
}


function update() {
    // Physik läuft automatisch
}
```

**Wichtige Punkte in `gameMasse.js`:**

1.  **Zwei Teilchentypen**:
    *   `NUM_PARTICLES_TYPE1` und die Differenz zu `NUM_PARTICLES_TOTAL` bestimmen die Anzahl.
    *   `COLOR_TYPE1`, `COLOR_TYPE2` für die Farben.
    *   Teilchen speichern ihren Typ und ihre Masse mit `particle.setData('type', ...)` und `particle.setData('mass', ...)`.
2.  **Massen-Slider**:
    *   `massSlider1`, `massSlider2` und die zugehörigen `massValue` Spans werden initialisiert.
    *   Event-Listener aktualisieren `massType1`, `massType2` und rufen `updateParticleMasses` auf.
    *   `updateParticleMasses` iteriert durch die Teilchen und aktualisiert die `mass` Daten der betroffenen Teilchen.
    *   **Minimale Masse**: Der Slider in `masse.html` hat `min="1"`. Wenn du `min="0"` erlauben würdest, wäre `MIN_MASS` (z.B. 0.001) wichtig, um Division durch Null in den Kollisionsformeln zu verhindern. Mit `min="1"` ist das weniger kritisch, aber es ist eine gute Praxis, die gespeicherte Masse immer > 0 zu halten.
3.  **`handleParticleCollision(particleA, particleB)`**:
    *   Dies ist das Herzstück für die korrekte Kollision.
    *   Es implementiert die 2D-elastische Kollision, indem es die Geschwindigkeiten in Komponenten entlang der Kollisionsnormalen und tangential dazu zerlegt.
    *   Die tangentialen Geschwindigkeitskomponenten bleiben unverändert (für reibungsfreie Stöße).
    *   Die normalen Geschwindigkeitskomponenten werden nach den 1D-Formeln für elastische Stöße berechnet.
    *   Die neuen Geschwindigkeitsvektoren werden dann zusammengesetzt und auf die Teilchen angewendet.
4.  **Temperatur und Geschwindigkeit**:
    *   Die Funktion `setParticleVelocityByTemperature` und `adjustAllParticleSpeeds` skaliert die Geschwindigkeit aller Teilchen basierend auf der Temperatur.
    *   Eine physikalisch exaktere Implementierung würde die Geschwindigkeit auch von der Masse jedes Teilchens abhängig machen (`v ~ sqrt(T/m)`), sodass leichtere Teilchen bei gleicher Temperatur im Mittel schneller sind. Der aktuelle Ansatz ist eine Vereinfachung, bei der die Temperatur eine allgemeine "Energie" ins System pumpt und die Massenunterschiede sich primär in den Kollisionen auswirken. Dies ist oft ausreichend für eine Visualisierung.
5.  **Phaser `setBounce(1)`**: Ist immer noch nützlich für die Kollisionen mit den Weltgrenzen. Für Teilchen-Teilchen-Kollisionen wird unsere `handleParticleCollision` Funktion die `setBounce`-Logik von Arcade Physics effektiv überschreiben, da wir die Geschwindigkeiten direkt setzen.

**Testen:**

1.  Speichere `masse.html`, `style.css` (ggf. mit den optionalen Anpassungen) und `gameMasse.js` im selben Ordner.
2.  Öffne `masse.html` über einen lokalen Webserver in deinem Browser.

Du solltest nun zwei Arten von Teilchen sehen. Wenn du ihre Massen mit den Slidern veränderst, sollten sich ihre Kollisionsverhalten ändern (z.B. ein leichtes Teilchen prallt stark von einem schweren ab, während das schwere kaum beeinflusst wird). Die Temperatur beeinflusst weiterhin die allgemeine Bewegungsenergie.
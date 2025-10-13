Okay, hier ist eine komplette Lösung für deine Simulation. Wir erstellen drei Dateien: `index.html`, `style.css` und `game.js`.

**1. `index.html`**

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teilchenbewegung Simulation</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
</head>
<body>
    <h1>Teilchenbewegung im Gas</h1>
    <div class="controls">
        <label for="tempSlider">Temperatur:</label>
        <input type="range" id="tempSlider" min="1" max="1000" value="298">
        <span id="tempValue">298 K</span>
    </div>
    <div id="phaser-game"></div>
    <script src="game.js"></script>
</body>
</html>
```

**2. `style.css`**

```css
body {
    font-family: sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
}

.controls {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.controls label {
    margin-right: 10px;
}

.controls input[type="range"] {
    width: 200px;
    vertical-align: middle;
}

.controls span {
    margin-left: 10px;
    font-weight: bold;
    min-width: 50px; /* Ensure space for "1000 K" */
    display: inline-block;
}

#phaser-game {
    border: 2px solid #333;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
```

**3. `game.js`**

```javascript
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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

// Konstanten für die Geschwindigkeitsberechnung
// Wir verwenden eine vereinfachte Proportionalität: v ~ sqrt(T)
// Basisgeschwindigkeit bei Referenztemperatur (z.B. 298K) in Pixel/Sekunde
const REFERENCE_TEMP_K = 298;
const BASE_SPEED_PIXELS_PER_SECOND = 150; // Anpassen für gute Visualisierung

let particles;
let currentTemperature = REFERENCE_TEMP_K;

// HTML Elemente für die Steuerung
let tempSlider;
let tempValueDisplay;

function preload() {
    // Keine Assets zum Laden für einfache Kreise
}

function create() {
    // Weltgrenzen für Kollisionen setzen
    this.physics.world.setBounds(0, 0, config.width, config.height);

    particles = this.physics.add.group();

    for (let i = 0; i < NUM_PARTICLES; i++) {
        // Zufällige Startposition, vermeide Überlappung mit Rand
        const x = Phaser.Math.Between(PARTICLE_RADIUS, config.width - PARTICLE_RADIUS);
        const y = Phaser.Math.Between(PARTICLE_RADIUS, config.height - PARTICLE_RADIUS);

        // Teilchen als Kreisgrafik erstellen und Physik hinzufügen
        const particleGraphics = this.add.graphics();
        particleGraphics.fillStyle(PARTICLE_COLOR, 1);
        particleGraphics.fillCircle(PARTICLE_RADIUS, PARTICLE_RADIUS, PARTICLE_RADIUS);
        // Textur aus Grafik generieren, damit wir sie einem Sprite zuweisen können
        const textureKey = `particleTexture${i}`;
        particleGraphics.generateTexture(textureKey, PARTICLE_RADIUS*2, PARTICLE_RADIUS*2);
        particleGraphics.destroy(); // Grafikobjekt wird nicht mehr gebraucht

        const particle = particles.create(x, y, textureKey);

        // Physik-Eigenschaften
        particle.setCircle(PARTICLE_RADIUS); // Kollisionskörper anpassen
        particle.setCollideWorldBounds(true);
        particle.setBounce(1); // Voll elastische Stöße
        // Die Masse wird in Arcade Physics standardmäßig als 1 behandelt,
        // was für gleichartige Teilchen für elastische Stöße ausreicht.
        // Wenn man unterschiedliche Massen simulieren wollte, müsste man
        // die Kollisionsbehandlung komplexer gestalten.
        // particle.setMass(HELIUM_MASS_U); // Hat in Arcade nur begrenzten Effekt ohne Custom Collider

        // Initiale Geschwindigkeit basierend auf Temperatur
        setParticleVelocity(particle, currentTemperature);
    }

    // Kollisionen zwischen Teilchen aktivieren
    this.physics.add.collider(particles, particles, onParticleCollide);

    // UI Elemente holen und Event Listener hinzufügen
    tempSlider = document.getElementById('tempSlider');
    tempValueDisplay = document.getElementById('tempValue');

    tempSlider.addEventListener('input', (event) => {
        currentTemperature = parseInt(event.target.value);
        tempValueDisplay.textContent = `${currentTemperature} K`;
        adjustAllParticleSpeeds(currentTemperature);
    });

    // Initialwert des Sliders setzen (falls vom HTML abweichend)
    tempSlider.value = currentTemperature;
    tempValueDisplay.textContent = `${currentTemperature} K`;
}

function update() {
    // Die Physik-Engine kümmert sich um die Bewegung und Kollisionen.
    // Wir müssen hier nichts tun, außer wir wollen pro Frame etwas prüfen/ändern.
}

function setParticleVelocity(particle, temperature) {
    const speed = calculateSpeedForTemperature(temperature);
    const angle = Phaser.Math.FloatBetween(0, 2 * Math.PI); // Zufälliger Winkel

    particle.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
    );
}

function calculateSpeedForTemperature(temperature) {
    // Einfache Proportionalität: v ist proportional zu sqrt(T)
    // v_new / v_ref = sqrt(T_new / T_ref)
    // v_new = v_ref * sqrt(T_new / T_ref)
    if (temperature <= 0) return 0; // Keine Bewegung bei 0K
    return BASE_SPEED_PIXELS_PER_SECOND * Math.sqrt(temperature / REFERENCE_TEMP_K);
}

function adjustAllParticleSpeeds(newTemperature) {
    const newSpeedMagnitude = calculateSpeedForTemperature(newTemperature);

    particles.getChildren().forEach(particle => {
        const currentVelocity = particle.body.velocity;
        const currentSpeed = currentVelocity.length(); // Magnitude des Geschwindigkeitsvektors

        if (newSpeedMagnitude === 0) {
            particle.setVelocity(0, 0);
        } else if (currentSpeed > 0) {
            // Skaliere die aktuelle Geschwindigkeit auf die neue Magnitude,
            // behalte aber die Richtung bei.
            const factor = newSpeedMagnitude / currentSpeed;
            particle.setVelocity(currentVelocity.x * factor, currentVelocity.y * factor);
        } else {
            // Wenn das Teilchen stand (z.B. bei 0K gestartet), gib ihm eine neue zufällige Richtung
            setParticleVelocity(particle, newTemperature);
        }
    });
}

function onParticleCollide(particleA, particleB) {
    // In Arcade Physics mit setBounce(1) werden elastische Stöße
    // zwischen gleich schweren Teilchen bereits korrekt simuliert (Impuls- und Energieerhaltung).
    // Man könnte hier Sounds abspielen oder andere Effekte hinzufügen.
    // Für eine exaktere Simulation mit unterschiedlichen Massen wäre eine
    // manuelle Berechnung der Geschwindigkeiten nach dem Stoß nötig.
}

```

**Erläuterungen zum Code:**

1.  **`index.html`:**
    *   Lädt die Phaser-Bibliothek von einem CDN.
    *   Definiert einen `div` mit der ID `phaser-game`, in den das Spiel gerendert wird.
    *   Enthält einen Slider (`input type="range"`) und eine Anzeige (`span`) für die Temperatur.

2.  **`style.css`:**
    *   Einfaches Styling für die Seite und die Steuerelemente.

3.  **`game.js`:**
    *   **`config`**: Grundkonfiguration für das Phaser-Spiel (Größe, Physik-Engine).
    *   **Konstanten**:
        *   `NUM_PARTICLES`: Anzahl der Teilchen.
        *   `PARTICLE_RADIUS`, `PARTICLE_COLOR`: Visuelle Eigenschaften.
        *   `HELIUM_MASS_U`: Masse der Heliumatome (wird hier nicht direkt für die Kollisionsphysik in Arcade genutzt, da Arcade `setMass` anders behandelt, aber gut für die konzeptionelle Korrektheit).
        *   `REFERENCE_TEMP_K` und `BASE_SPEED_PIXELS_PER_SECOND`: Diese sind entscheidend. Anstatt die komplexe Umrechnung von Boltzmann-Konstante, Masse in kg etc. in Pixel pro Sekunde durchzuführen, definieren wir eine "Basisgeschwindigkeit" (z.B. 150 Pixel/Sekunde) bei einer "Referenztemperatur" (298 K). Die Geschwindigkeit bei anderen Temperaturen wird dann proportional zur Quadratwurzel des Temperaturverhältnisses berechnet (`v ~ sqrt(T)`). Dies ist eine übliche Vereinfachung für Visualisierungen.
    *   **`preload()`**: Normalerweise zum Laden von Bildern, Sounds etc. Hier nicht nötig, da wir Kreise dynamisch zeichnen.
    *   **`create()`**:
        *   Setzt die Weltgrenzen für Kollisionen.
        *   Erstellt eine Physikgruppe `particles`.
        *   **Teilchenerstellung**:
            *   Für jedes Teilchen wird eine `Phaser.GameObjects.Graphics` Instanz verwendet, um einen Kreis zu zeichnen.
            *   Diese Grafik wird dann in eine Textur umgewandelt (`generateTexture`).
            *   Ein Physik-Sprite wird mit dieser Textur erstellt und der `particles`-Gruppe hinzugefügt.
            *   `setCircle(PARTICLE_RADIUS)` stellt sicher, dass der Kollisionskörper ein Kreis ist.
            *   `setCollideWorldBounds(true)` und `setBounce(1)` sorgen für elastische Wandstöße.
            *   `setParticleVelocity()` weist eine initiale Geschwindigkeit basierend auf `currentTemperature` zu.
        *   `this.physics.add.collider(particles, particles, onParticleCollide)` aktiviert Kollisionen zwischen den Teilchen. `onParticleCollide` ist eine Callback-Funktion, die bei einer Kollision aufgerufen wird (hier leer, da `setBounce(1)` für gleichartige Teilchen ausreicht).
        *   Verknüpft die HTML-Slider-Elemente und fügt einen Event-Listener hinzu, der `currentTemperature` aktualisiert und `adjustAllParticleSpeeds()` aufruft.
    *   **`update()`**: Diese Funktion wird von Phaser in jedem Frame aufgerufen. Hier ist sie leer, da die Physik-Engine die Bewegung und Kollisionen automatisch handhabt.
    *   **`setParticleVelocity(particle, temperature)`**: Weist einem Teilchen eine zufällige Richtung mit einer Geschwindigkeit zu, die von `calculateSpeedForTemperature` bestimmt wird.
    *   **`calculateSpeedForTemperature(temperature)`**: Berechnet die Geschwindigkeit in Pixeln pro Sekunde basierend auf der Formel `v_neu = v_basis * sqrt(T_neu / T_basis)`.
    *   **`adjustAllParticleSpeeds(newTemperature)`**: Wird aufgerufen, wenn sich die Temperatur ändert. Sie passt die Geschwindigkeit jedes Teilchens an:
        *   Die *Richtung* der Bewegung bleibt erhalten.
        *   Die *Magnitude* (der Betrag) der Geschwindigkeit wird auf den neuen Wert skaliert.
        *   Wenn ein Teilchen vorher stand (Geschwindigkeit 0), bekommt es eine neue zufällige Richtung.
    *   **`onParticleCollide(particleA, particleB)`**: Callback für Teilchen-Teilchen-Kollisionen. Da alle Teilchen "gleich schwer" sind in der Arcade-Physik-Standardbehandlung und `setBounce(1)` gesetzt ist, werden Impuls und Energie (kinetische) korrekt zwischen ihnen ausgetauscht, was einen elastischen Stoß simuliert.

**Wie man es ausführt:**

1.  Speichere die drei Dateien (`index.html`, `style.css`, `game.js`) im selben Ordner.
2.  Öffne die `index.html`-Datei in einem modernen Webbrowser (Chrome, Firefox, Edge etc.).
    *   **Wichtig**: Da `game.js` Module oder andere fortgeschrittene JS-Features verwenden könnte (obwohl dieses Beispiel einfach ist), ist es am besten, die Dateien über einen lokalen Webserver bereitzustellen. Einfache Optionen hierfür sind:
        *   Python: `python -m http.server` (Python 3) oder `python -m SimpleHTTPServer` (Python 2) im Ordner ausführen und dann `http://localhost:8000` im Browser öffnen.
        *   Node.js: `npx http-server` installieren (`npm install -g http-server`) und dann im Ordner ausführen.
        *   VS Code Extension: "Live Server".

Du solltest nun ein Feld mit 10 roten Kugeln sehen, die sich bewegen. Mit dem Slider kannst du ihre Geschwindigkeit (Temperatur) anpassen.
# Breakout-Game Tutorial mit Phaser.io

## Schritt 2: Ball hinzufügen und an Spielfeldränder abprallen lassen

Im zweiten Schritt fügen wir unserem Breakout-Spiel den Ball hinzu. Dieser Ball wird aus dem Asset `ball.png` geladen und soll von allen Spielfeldrändern abprallen, damit er innerhalb des Spielfeldes bleibt.

---

### 2.1 Vorbereitung: Asset `ball.png`

Für dieses Beispiel kannst du dieses einfache Ball-Bild verwenden (ca. 16x16 Pixel, transparenter Hintergrund):

![ball.png](https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/shinyball.png)

Speichere die Datei als `ball.png` in einem Ordner namens `assets` im gleichen Verzeichnis wie deine anderen Dateien.

---

### 2.2 Code-Anpassung in `game.js`

Wir passen die Phaser-Szene wie folgt an:

```js
window.onload = function() {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        backgroundColor: '#000',
        parent: 'game-container',
        physics: {                      
            default: 'arcade',           
            arcade: {
              gravity: { y: 0 },
              debug: false
            }
          },
        scene: {
          preload: preload,
          create: create,
          update: update
        },
      };

  let ball;

  const game = new Phaser.Game(config);

  function preload() {
    // Lade den Ball als Bild-Asset
    this.load.image('ball', 'assets/ball.png');
  }

  function create() {
    // Erstelle den Ball in der Mitte des Spielfeldes
    ball = this.physics.add.image(400, 300, 'ball');

    // Ball bewegt sich zu Beginn diagonal mit einer Geschwindigkeit von 150
    ball.setVelocity(150, 150);

    // Ball prallt an den Spielfeldgrenzen ab
    ball.setCollideWorldBounds(true);

    // Ball bleibt nicht stehen, sondern prallt ab
    ball.setBounce(1);
  }

  function update() {
    // Im Moment keine zusätzliche Logik notwendig
  }
};
```

---

### Erläuterung des Codes
- `physics: {...`  
`physics` übernimmt die gesamte Steuerung der Spielphysik für unsere Sprites, d.h. ihre Bewegung und ihr Verhalten bei der Kollision mit den Wänden oder anderen Objekten.
Wir verwenden in diesem Spiel den `arcade`-Modus, der für einfache 2D-Spiele optimiert ist.
- `gravity: { y: 0 },`  
Hiermit schalten wir die Schwerkraft aus - unser Ball soll sich im schwerelosen Raum bewegen.  
Bei einem Platformer-Game würden wir y:300 wählen, damit die Schwerkraft unsere Objekte nach unten zieht.
- `debug: false`  
Im Debug-Modus werden zusätzliche Informationen zu den Sprites eingeblendet, die bei der Fehlersuche helfen. Wir benötigen dies nicht und schalten den Modus aus.        
- `let ball`  
  Wir erzeugen eine globale Variable ball, in dem wir später die Referenz auf unseren Ball speichern.
- `preload()`  
  `this.load.image('ball', 'assets/ball.png');` lädt das Bild `ball.png` und ordnet ihm die Referenz `ball` zu. Im weiteren Code können wir das Bild jetzt über diese Referenz ansprechen.
- `create()`  
  - Mit `ball = this.physics.add.image(400, 300, 'ball');`
erstellen wir Sprite namens `ball` und setzen es in die Mitte des Spielfeldes. Wir verwenden die Referenz auf `ball`, die wir in `preload()` definiert haben, um dem Sprite ein Bild zuzuordnen.  
Außerdem ordnen wir das Sprite des `physics`-Attribut unseres Spieles zu.   
  - Die Methode `setVelocity(150, 150)` legt fest, dass der Ball diagonal nach rechts unten startet.
  - Mit `setCollideWorldBounds(true)` wird dafür gesorgt, dass der Ball an den Spielfeldrändern erkannt wird.
  - `setBounce(1)` sorgt für eine elastische Kollision, d.h. der Ball prallt exakt im gleichen Winkel ab.

---

## Zusammenfassung

Du hast gelernt, wie man in Phaser:

- ein externes Bild-Asset lädt,
- mit Arcade-Physik eine Spielfigur (Ball) per Velocity bewegt,
- und wie man Kollision an den Spielfeldgrenzen einrichtet, damit der Ball abprallt.

---

## Nächster Schritt

Im nächsten Schritt fügen wir das Paddle ein, das du mit der Maus oder Tastatur bewegen kannst.

---

### Live-Test

<iframe 
  src="01Ball/index.html" 
  width="820" 
  height="700" 
  frameborder="0" 
  sandbox="allow-scripts allow-same-origin">
</iframe>
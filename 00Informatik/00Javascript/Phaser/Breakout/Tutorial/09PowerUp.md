  <meta charset="utf-8" />
  <title>Breakout</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">

# Breakout-Game Tutorial mit Phaser.io

## Schritt 10: PowerUp – Kugel fällt und schenkt ein Leben

In diesem Schritt fügen wir einen neuen Steintyp `brick5` hinzu. Wird dieser Stein vom Ball getroffen, verschwindet er und eine Kugel (`sphere1`) fällt vom getroffenem Brick nach unten. Trifft die Kugel das Paddle, erhält der Spieler ein zusätzliches Leben.

---

### 10.1 Vorbereitung

- Füge im Ordner `assets` die Grafikdatei `brick5.png` für den neuen Steintyp hinzu.
- Füge ebenfalls eine neue Grafikdatei `sphere1.png` für die PowerUp-Kugel hinzu (z.B. eine kleine Kugel oder ein Herz-Symbol).

---

### 10.2 Anpassung der Level-Datei: `assets/level3.json`

Zum Testen des neuen Steintyps erstelle eine neue Datei `level3.json` mit folgendem Beispielinhalt:

```json
{
  "layout": [
    [0,0,0,5,5,5,0,0,0],
    [0,1,1,1,1,1,1,1,0],
    [2,2,2,2,2,2,2,2,2],
    [0,3,3,3,3,3,3,3,0],
    [0,0,0,4,4,4,0,0,0]
  ]
}
```

Hier steht `5` für den neuen Brick-Typ.

---

### 10.3 Code-Erweiterungen in `game.js`

### 10.3.1 Variablen

```js
  const maxLevel = 3;  // Level 3 mit brick5 hinzugefügt
...
  // Neuer Physik-Sprite für die fallende Kugel (PowerUp)
  let powerUp;  
```

### 10.3.2 Preload

```js

  function preload() {
    this.load.image('sphere1', 'assets/sphere1.png');  // PowerUp Kugel laden
    ...
  }
```
### 10.3.3 Create
```js

  function create() {
    ...
    powerUp = this.physics.add.image(-100, -100, 'sphere1'); // erstmal ausblenden, außerhalb vom Bildschirm
    powerUp.setVelocity(0, 0);
    powerUp.setCollideWorldBounds(true);
    powerUp.setBounce(0.5);
    powerUp.setVisible(false);
    powerUp.body.allowGravity = false;

    // Kollisionsprüfung PowerUp - Paddle
    this.physics.add.overlap(powerUp, paddle, collectPowerUp, null, this);

    loadLevel.call(this, currentLevel);

    this.physics.add.collider(ball, paddle, ballPaddleCollision, null, this);
    this.physics.add.collider(ball, bricks, ballBrickCollision, null, this);
  }
```
### 10.3.4 Update

```js

  function update() {
    ...

    if (ball.y > this.sys.game.config.height - ball.height) {
      loseLife();
    }
    // PowerUp fällt nach unten, wenn sichtbar
    if (powerUp.visible) {
      // Kugel fällt mit konstanter Geschwindigkeit nach unten
      powerUp.setVelocityY(200);

      // Kugel geht verloren, wenn sie den Boden berührt (außerhalb des Bildschirms)
      if (powerUp.y > this.sys.game.config.height - powerUp.height) {
        resetPowerUp();
      }
    }
  }
```
### 10.3.5 PowerUp-Funktionen
```Js
  // PowerUp erzeugen an Position x,y
  function spawnPowerUp(x, y) {
    powerUp.setPosition(x, y);
    powerUp.setVelocity(0, 200);
    powerUp.setVisible(true);
  }

  // PowerUp verschwindet, wenn es Paddle berührt
  function collectPowerUp(sphere, paddle) {
    resetPowerUp();

    lives++;
    livesText.setText('Leben: ' + lives);
  }

  // PowerUp zurücksetzen wenn verloren oder eingesammelt
  function resetPowerUp() {
    powerUp.setVisible(false);
    powerUp.setVelocity(0, 0);
    powerUp.x = -100;
    powerUp.y = -100;
  }

```

---

### 10.4 Erklärung

- **Neuer Brick-Typ 5:** Wird der Ball auf `brick5` treffen, verschwindet der Brick und das PowerUp (die Kugel `sphere1`) wird an dieser Position erzeugt.
- **PowerUp Kugel:**  
  Die Kugel fällt mit konstanter Geschwindigkeit nach unten.
- **Kollision PowerUp – Paddle:**  
  Wenn die Kugel das Paddle berührt, wird sie unsichtbar und der Spieler bekommt ein zusätzliches Leben.
- **PowerUp geht verloren, wenn es den unteren Bildschirmrand verlässt:**  
  Die Kugel wird dann unsichtbar und dient nicht mehr.

---

### 10.5 Live-Test

<iframe 
  src="09PowerUp/index.html" 
  width="820" 
  height="700" 
  frameborder="0" 
  sandbox="allow-scripts allow-same-origin">
</iframe>

---
### Dateien
[Zip-Datei](09Powerup.zip)

---

### [weiter](10Background.html)  

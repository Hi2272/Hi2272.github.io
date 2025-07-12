  <meta charset="utf-8" />
  <title>Breakout</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">

# Breakout-Game Tutorial mit Phaser.io

## Schritt 12: Neuer Steintyp: Verringert Zahl der Leben

### 12.1 Allgemeines
Um den gewünschten neuen Steintyp zu ergänzen, gehen wir wie folgt vor:

- Wir definieren in der JSON-Level-Datei einen neuen Steintyp, z.B. Typ 6.
- Bei Kollision mit dem Ball auf einen Brick des Typs 6 soll dieser Brick zerstört werden.
- Danach soll eine neue Kugel (PowerDown) am Ort des Bricks erstellt werden, die nach unten fällt.
- Trifft diese Kugel auf das Paddle, reduziert sich die Anzahl der Leben um 1.
- Wie beim normalen Lebenverlust wird geprüft, ob das Spiel beendet wird.

Im Code müssen wir also:

1. Einen neuen Physik-Sprite `powerDown` deklarieren und laden (ähnlich wie `powerUp`).
2. Die Kollision PowerDown - Paddle behandeln.
3. Im `ballBrickCollision`-Handler für Typ 6 den Brick zerstören und `spawnPowerDown` aufrufen.
4. Funktionen zum Spawnen, Zurücksetzen des PowerDown hinzufügen.
5. Das Leben reduzieren, wenn PowerDown eingesammelt wird, ggf. Spiel beenden.

---

### 12.2 Schritt-für-Schritt-Ergänzungen im Code

### 12.2.2 Variablen

```js
let powerDown;
```

### 12.2.2 Preload

Lade eine neue Sprite für PowerDown, z.B. `sphere2.png`.

```js
this.load.image('sphere2', 'assets/sphere2.png');  // PowerDown Kugel laden
```

### 12.2.3 Create

```js
powerDown = this.physics.add.image(-100, -100, 'sphere2'); // erstmal ausblenden, außerhalb vom Bildschirm
powerDown.setVelocity(0, 0);
powerDown.setCollideWorldBounds(true);
powerDown.setBounce(0.5);
powerDown.setVisible(false);
powerDown.body.allowGravity = false;

// Kollisionsprüfung PowerDown - Paddle
this.physics.add.overlap(powerDown, paddle, collectPowerDown, null, this);
```

### 12.2.4. update

```js
if (powerDown.visible) {
  powerDown.setVelocityY(200);

  if (powerDown.y > this.sys.game.config.height - powerDown.height) {
    resetPowerDown();
  }
}
```

### 12.2.5 BallBrickCollision

In ballBrickCollision für Typ 6 ergänzen:

```js
case 6:
  // Brick zerstören und PowerDown erzeugen
  brick.disableBody(true, true);
  brickHealth.delete(brick);
  decrementBricksRemaining.call(this);

  spawnPowerDown.call(this, brick.x, brick.y);
  break;
```

### 12.2.6 PowerDown entstehen lassen

```js
// PowerDown erzeugen an Position x,y
function spawnPowerDown(x, y) {
  powerDown.setPosition(x, y);
  powerDown.setVelocity(0, 200);
  powerDown.setVisible(true);
}
```
### 12.2.7 PowerDown einsammeln

```js
// PowerDown auf Paddle trifft -> Leben verlieren
function collectPowerDown(sphere, paddle) {
  resetPowerDown();
  
  loseLife(); // Wie wenn Ball verloren wurde, ein Leben abziehen
}
```
### 12.2.8 PowerDown entfernen

```js
// PowerDown zurücksetzen wenn verloren oder eingesammelt
function resetPowerDown() {
  powerDown.setVisible(false);
  powerDown.setVelocity(0, 0);
  powerDown.x = -100;
  powerDown.y = -100;
}
```

---
### [weiter](12PaddleBreiter.html)  

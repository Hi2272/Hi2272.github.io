### 13. Neuer Steintyp: Paddle wird schmaler

---
### 13.1 Allgemeines

In diesem Abschnitt fügen wir einen weiteren Steintyp hinzu, der beim Zerstören eine spezielle Kugel (PowerUp) erzeugt. Wenn das PowerUp eingesammelt wird, wird das Paddle für **10 Sekunden doppelt so breit**!

---

### 13.2 Anpassungen am Code
### 13.2.1 JSON-Dateien
Wir nehmen nun an, dass der neue Steintyp die Zahl **7** hat. Diesen kannst du in deinen Level-JSON-Dateien verwenden, um entsprechende Bricks zu definieren.

---
### 13.2.2 Variablen anlegen

Im oberen Bereich deiner Skriptdatei definieren wir entsprechende Variablen:

```js
let powerUpExpand;           // PowerUp-Sprite für Paddle-Erweiterung
let paddleOriginalWidth;     // Speicher für Breite vor Veränderung
let paddleExpanded = false;  // Status: Paddle ist erweitert?
let paddleExpandTimer;       // Timer zum Zurücksetzen
```
---
### 13.2.3 Assets laden

Zunächst laden wir im `preload()` eine neue Grafik für die PowerUp-Kugel, die das Paddle vergrößert, z.B. `sphere3.png`:

```js
this.load.image('sphere3', 'assets/sphere3.png'); // Kugel zum Vergrößern des Paddles
```




---

### 13.2.4 PowerUp-Sprite in `create()` erstellen

Im `create()`-Funktionsblock fügen wir den neuen PowerUp-Sprite hinzu und konfigurieren die Kollisionsabfrage mit dem Paddle:

```js
powerUpExpand = this.physics.add.image(-100, -100, 'sphere3');
powerUpExpand.setVelocity(0, 0);
powerUpExpand.setCollideWorldBounds(true);
powerUpExpand.setBounce(0.5);
powerUpExpand.setVisible(false);
powerUpExpand.body.allowGravity = false;

this.physics.add.overlap(powerUpExpand, paddle, collectPowerUpExpand, null, this);
```

Vergiss nicht, die Variable `paddleOriginalWidth` direkt nach Erstellung des Paddles zu speichern:

```js
paddleOriginalWidth = paddle.displayWidth;
```

---

### 13.2.5 PowerUpExpand in `update()` bewegen und ggf. zurücksetzen

Analog zu den anderen PowerUps sorgen wir dafür, dass die Kugel nach unten fällt und außerhalb des Bildschirms verschwindet:

```js
if (powerUpExpand.visible) {
  powerUpExpand.setVelocityY(200);

  if (powerUpExpand.y > this.sys.game.config.height - powerUpExpand.height) {
    resetPowerUpExpand();
  }
}
```

---

### 13.2.6 Neues Brick-Verhalten bei Kollision mit Ball

Im `ballBrickCollision()` ergänzen wir die Behandlung für Steintyp **7**:

```js
case 7:
  brick.disableBody(true, true);
  brickHealth.delete(brick);
  decrementBricksRemaining.call(this);

  spawnPowerUpExpand.call(this, brick.x, brick.y);
  break;
```

---

### 13.2.7 Helferfunktionen zum PowerUpExpand

Füge folgende Funktionen hinzu:

```js
// PowerUpExpand erzeugen an Position x,y
function spawnPowerUpExpand(x, y) {
  powerUpExpand.setPosition(x, y);
  powerUpExpand.setVelocity(0, 200);
  powerUpExpand.setVisible(true);
}

// PowerUpExpand auf Paddle trift -> Paddle wird doppelt so breit für 10 Sekunden
function collectPowerUpExpand(sphere, paddle) {
  resetPowerUpExpand();

  if (paddleExpanded) {
    // Timer erneuern, wenn Paddle schon erweitert ist
    if (paddleExpandTimer) {
      paddleExpandTimer.remove(false);
    }
  } else {
    // Paddle Breite verdoppeln
    paddle.setDisplaySize(paddleOriginalWidth * 2, paddle.displayHeight);
    paddle.refreshBody();
    paddleExpanded = true;
  }

  // Timer starten bzw. neu starten
  paddleExpandTimer = this.time.delayedCall(10000, () => {
    // Paddle auf Originalgröße zurücksetzen
    paddle.setDisplaySize(paddleOriginalWidth, paddle.displayHeight);
    paddle.refreshBody();
    paddleExpanded = false;
  }, null, this);
}

// PowerUpExpand zurücksetzen wenn verloren oder eingesammelt
function resetPowerUpExpand() {
  powerUpExpand.setVisible(false);
  powerUpExpand.setVelocity(0, 0);
  powerUpExpand.x = -100;
  powerUpExpand.y = -100;
}
```

---

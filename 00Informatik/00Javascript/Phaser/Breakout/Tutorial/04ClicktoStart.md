# Breakout-Game Tutorial mit Phaser.io

## Schritt 5: Ball per Tastendruck/Maus starten

Im bisherigen Spiel fliegt der Ball direkt beim Start los. Jetzt sorgen wir dafür, dass der Ball zunächst auf dem Paddle „liegt“ und erst nach einem Tastendruck (Leertaste) oder Mausklick losfliegt. Solange der Ball noch nicht gestartet ist, bewegt er sich synchron mit dem Paddle.   


### 5.1 Code-Anpassungen in `game.js`


### 5.1.1 Variablen

Wir erzeugen eine Variable um zu speichern, ob der Ball bereits gestartet ist:  

```js

  let ballLaunched = false;  // Neuer Zustand: Ball ist gestartet oder nicht
```


### 5.1.2 Create
  Der Ball wird zu Beginn in der Mitte auf dem Paddle positioniert und startet beim Drücken der Leertaste oder beim Klicken mit der Maus.

```js
  function create() {
    ...

    // Ball erstellen - Position zunächst auf dem Paddle
    ball = this.physics.add.image(paddle.x, paddle.y - paddle.height / 2 - 10, 'ball');
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);

    // Ball noch nicht starten -> keine Geschwindigkeit
    ball.setVelocity(0, 0);

    cursors = this.input.keyboard.createCursorKeys();

    // Event-Maus: Ball starten beim Klick, falls noch nicht gestartet
    this.input.on('pointerdown', () => {
      if (!ballLaunched) {
        launchBall();
      }
    });

    // Event-Tastatur: Leertaste zum Ball-Start
    this.input.keyboard.on('keydown-SPACE', () => {
      if (!ballLaunched) {
        launchBall();
      }
    });

    ...
    }
```
### 5.1.3 Update
   
  Solange `ballLaunched == false` ist, wird die Ball-Position in jedem Frame auf das Paddle angepasst (X und Y), sodass er mitbewegt wird. 

  Bei Klick auf die Maus (`pointerdown`) oder bei Drücken der Leertaste (`keydown-SPACE`) wird die Funktion `launchBall()` ausgeführt, die den Ball mit Startgeschwindigkeit losfliegen lässt.

```js

  function update() {
    ...
    // Solange der Ball nicht gestartet ist, wird er an das Paddle gekoppelt
    if (!ballLaunched) {
      ball.x = paddle.x;
      ball.y = paddle.y - paddle.height / 2 - 10; // leicht oberhalb vom Paddle positionieren
      ball.setVelocity(0, 0);
    }
  }
```
# 5.1.4 Funktion launchBall
  Der Ball bekommt eine feste Geschwindigkeit und Richtung beim Start. (hier: nach oben und leicht nach rechts). Diese kannst du anpassen.

```js

  // Funktion um den Ball zu starten
  function launchBall() {
    ballLaunched = true;    
    // Starte den Ball mit definierter Geschwindigkeit nach oben und leicht seitlich
    ball.setVelocity(150, -300);
  }

```

---

### 5.2 Live-Test

<iframe 
  src="04ClicktoStart/index.html" 
  width="820" 
  height="700" 
  frameborder="0" 
  sandbox="allow-scripts allow-same-origin">
</iframe>

---
### Dateien
[Zip-Datei](04ClicktoStart.zip)

---

### [weiter](05Leben.html)  

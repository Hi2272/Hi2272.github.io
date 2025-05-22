# Breakout-Game Tutorial mit Phaser.io

## Schritt 4: Ball prallt vom Paddle ab 
Der Ball soll jetzt nicht mehr durch das Paddle hindurchfliegen, sondern dynamisch abprallen:
  - Trifft der Ball das Paddle in der Mitte, prallt er senkrecht nach oben ab.
  - Trifft er das Paddle seitlich, wird der Ball entsprechend schräg abgelenkt.

---

### 4.1 Code-Anpassungen in `game.js`

```js

  ...
 
  function create() {
    ...
    // Neue Ergänzung: Kollision zwischen Ball und Paddle
    this.physics.add.collider(ball, paddle, ballPaddleCollision, null, this);
  }

  function update() {
    ...
  }

  /**
   * Funktion, die ausgeführt wird, wenn Ball das Paddle trifft.
   * Berechnet die neue Reflexionsrichtung abhängig vom Treffpunkt
   */
  function ballPaddleCollision(ball, paddle) {
    // Berechne Abstand X des Balls vom Mittelpunkt des Paddles
    const relativeIntersectX = ball.x - paddle.x;

    // Normiere diesen Wert auf [-1, 1]
    const normalizedIntersectX = relativeIntersectX / (paddle.width / 2);

    // Maximaler Winkel in Grad (z.B. 75° von Vertikal)
    const maxBounceAngle = Phaser.Math.DegToRad(75);

    // Berechne Winkel zwischen -maxBounceAngle (links) und +maxBounceAngle (rechts)
    const bounceAngle = normalizedIntersectX * maxBounceAngle;

    // Geschwindigkeit des Balls behalten
    const speed = ball.body.velocity.length();

    // Neue Geschwindigkeitskomponenten setzen
    ball.body.velocity.x = speed * Math.sin(bounceAngle);
    ball.body.velocity.y = -speed * Math.cos(bounceAngle);
  }
};
```

---

### 4.2 Erläuterungen zum neuen Code

#### `this.physics.add.collider(ball, paddle, ballPaddleCollision, null, this);`
Registriert die Funktion **ballPaddleCollision** als  Kollisions-Handler-Funktion. Sie wird automatisch aufgerufen, wenn Ball und Paddle sich berühren.

#### Funktion `ballPaddleCollision(ball, paddle)`

Die Funktion berechnet zunächst ziemlich aufwändig den Winkel, in dem der Ball zurückprallt:
1. `const relativeIntersectX = ball.x - paddle.x;`
ermittelt zunächst den horizontalen Abstand des Balls zum Mittelpunkt des Paddles.
2. `const normalizedIntersectX = relativeIntersectX / (paddle.width / 2);` normiert diesen Wert auf den Bereich [-1, 1], wobei `-1` die linke Kante, `0` die Mitte und `1` die rechte Kante repräsentiert.
- `const bounceAngle = normalizedIntersectX * maxBounceAngle;` verwendet diesen Wert, um den Winkel des zurückprallenden Balls zu berechnen. So erzeugen wir eine Drehung des Balls abhängig vom Trefferpunkt.
- `ball.body.velocity.x = speed * Math.sin(bounceAngle);` berechnet die x-Kompononente des Winkels über die Sinus-Funktion.
- `ball.body.velocity.y = -speed * Math.cos(bounceAngle);` berechnet analog die y-Komponenten über die Cosinus-Funktion.
---

### 4.3 Live-Test

<iframe 
  src="03Squash/index.html" 
  width="820" 
  height="700" 
  frameborder="0" 
  sandbox="allow-scripts allow-same-origin">
</iframe>

---
### Datei

[Zip-Datei](03Squash.zip)

---

### [weiter](04ClicktoStart.html)  

  <meta charset="utf-8" />
  <title>Breakout</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">


# Breakout-Game Tutorial mit Phaser.io

## Schritt 6: Leben hinzufügen und Game Over bei Verlust aller Leben

Der Spieler soll zu Beginn 3 Leben haben. Diese Leben werden oben links im Spiel als Text angezeigt. Wenn der Ball unten am Paddle vorbei fliegt, verliert der Spieler ein Leben. Sind alle Leben aufgebraucht, wird „Game Over“ angezeigt und das Spiel endet.

---

### 6.1 Code-Anpassungen in `game.js`

### 6.1.1 Variablen

Die Variablen **lives, livesText, gameOverText** und **gameEnded** dienen zur Steuerung des Spiels und Anzeige wichtiger Informationen.

```js

  let lives = 3;               // Neue Variable für Leben
  let livesText;               // Textobjekt für Anzeige Lives
  let gameOverText;            // Textobjekt für Game Over
  let gameEnded = false;       // Zustand, ob Spiel beendet ist
```
### 6.1.2 Create

  Mit `this.add.text()` werden Textfelder eingefügt. Das Game-Over-Textfeld ist zunächst unsichtbar.


```js

  function create() {
...
    cursors = this.input.keyboard.createCursorKeys();

    // Text für Leben oben links
    livesText = this.add.text(10, 10, 'Leben: 3', {
      font: '20px Arial',
      fill: '#ffffff',
    });

    // Text für "Game Over" (unsichtbar bis benötigt)
    gameOverText = this.add.text(width / 2, height / 2, 'GAME OVER', {
      font: '50px Arial',
      fill: '#ff0000',
      fontStyle: 'bold',
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

 ...
  }
```
### 6.1.3 Update
#### update()-Funktion
- **Ball aus dem Feld gefallen:**  
  Im `update()` prüfen wir, ob das Spiel beendet wurde. Dann bewegen sich das Paddle und der Ball nicht mehr.  
  Außerdem wird getestet, ob der Ball die untere Spielfeldgrenze (minus Ballhöhe) überschritten hat. In diesem Fall verliert der Spieler ein Leben.


```js

  function update() {
    if (gameEnded) {
      paddle.setVelocityX(0);
      ball.setVelocity(0, 0);
      return;  // Spiel gestoppt, nichts mehr bewegen
    }

    ...

    // Prüfen, ob Ball unten aus dem Spielfeld gefallen ist
    if (ball.y > this.sys.game.config.height - ball.height) {
      loseLife();
    }
  }
```
### 6.1.4 LooseLife

  Nach Verlust eines Lebens wird der Ball wieder auf das Paddle gesetzt und wartet auf einen neuen Start.  
  Die Leben-Anzeige wird aktualisiert.

  Wenn keine Leben übrig sind, wird `gameOver()` aufgerufen. 

```js

  function loseLife() {
    lives--;
    livesText.setText('Leben: ' + lives);

    if (lives > 0) {
      // Ball zurück auf Paddle setzen und für neuen Start anhalten
      ballLaunched = false;
      ball.setVelocity(0, 0);
      ball.x = paddle.x;
      ball.y = paddle.y - paddle.height / 2 - 10;
    } else {
      // Keine Leben mehr – Game Over
      gameOver();
    }
  }
  ```
### 6.1.5 GameOver
  
  Es wird der "GAME OVER"-Text sichtbar gemacht und das Spiel gestoppt (Ball und Paddle bewegen sich nicht mehr).

  Mit der Variable `gameEnded` verhindern wir, dass das Spiel nach Game Over noch weiter läuft oder Eingaben verarbeitet werden.

```js
  // Game Over Funktion
  function gameOver() {
    gameEnded = true;
    ball.setVelocity(0, 0);
    paddle.setVelocity(0, 0);
    gameOverText.setVisible(true);
  }

```

---

### 6.2 Live-Test

<iframe 
  src="05Leben/index.html" 
  width="820" 
  height="700" 
  frameborder="0" 
  sandbox="allow-scripts allow-same-origin">
</iframe>
---

### Dateien
[Zip-Datei](05Leben.zip)  

---

### [weiter](06Bricks.html)  

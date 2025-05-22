# Breakout-Game Tutorial mit Phaser.io

## Schritt 9: Levelwechsel

In diesem Schritt ergänzen wir unser Breakout-Spiel so, dass die Anzahl der noch zerstörbaren Steine (Bricks) gezählt wird. Sobald alle zerstörbaren Bricks verschwunden sind, wird das nächste Level gestartet.

---

### 9.1 Neue Level-Dateien anlegen

Lege mindestens zwei Level-Dateien an, z.B. `assets/level1.json` und `assets/level2.json`, analog zu den bisherigen.

Beispiel `assets/level1.json` (nur Steintyp 1):

```json
{
  "layout": [
    [0,0,0,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,0],
    [0,0,0,1,1,1,0,0,0]
  ]
}
```

Beispiel `assets/level2.json` (mit unterschiedlichen Bricktypen, wie Schritt 8):

```json
{
  "layout": [
    [0,0,0,4,4,4,0,0,0],
    [0,3,3,3,3,3,3,3,0],
    [2,2,2,2,2,2,2,2,2],
    [0,1,1,1,1,1,1,1,0],
    [0,0,0,1,1,1,0,0,0]
  ]
}
```

Du kannst beliebig viele Level anlegen (z.B. level3.json, ...), beachte aber unten die maximale Level-Anzahl.

---

### 9.2 Erweiterung des Codes in `game.js`

#### Übersicht der wichtigsten Änderungen

- Verwaltung aktuelles Level `currentLevel`, maximale Levelanzahl `maxLevel`
- Dynamisches Laden der Leveldaten per Schlüssel `levelX` (z.B. `level1`, `level2`, ...)
- Zählschleife der noch zerstörbaren Bricks (Typ 1,2,3) nach jedem Treffer
- Automatischer Levelwechsel, wenn alle zerstörbaren Bricks entfernt sind
- Anzeige einer Gratulationsnachricht am Spielende

---

### 9.3 Vollständiger geänderter/erweiterter Codeausschnitt für `game.js`

```js
window.onload = function () {
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
        debug: false,
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };

  let ball;
  let paddle;
  let cursors;
  let ballLaunched = false;

  let lives = 3;
  let livesText;
  let gameOverText;
  let gameEnded = false;

  let bricks;
  let brickHealth = new Map();

  // Levelmanagement: Start bei Level 1, max Level 2 (anpassbar)
  let currentLevel = 1;
  const maxLevel = 2;
  let levelText;

  let bricksRemaining = 0;
  let bricksText;
  let congratsText;

  const game = new Phaser.Game(config);

  function preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('paddle', 'assets/paddle.png');
    for (let i = 1; i <= 4; i++) {
      this.load.image('brick' + i, 'assets/brick' + i + '.png');
    }

    // Lade alle Leveldateien im Voraus (kann auch on-demand optimiert werden)
    for (let lvl = 1; lvl <= maxLevel; lvl++) {
      this.load.json('level' + lvl, 'assets/level' + lvl + '.json');
    }

  }

  function create() {
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;

    paddle = this.physics.add.image(width / 2, height - 100, 'paddle');
    paddle.setImmovable(true);
    paddle.setCollideWorldBounds(true);

    ball = this.physics.add.image(paddle.x, paddle.y - paddle.height / 2 - 10, 'ball');
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);
    ball.setVelocity(0, 0);

    cursors = this.input.keyboard.createCursorKeys();

    livesText = this.add.text(10, 10, 'Leben: 3', {
      font: '20px Arial',
      fill: '#ffffff',
    });

    bricksText = this.add.text(10, 40, 'Verbleibende Steine: 0', {
      font: '20px Arial',
      fill: '#ffffff',
    });

    levelText = this.add.text(
      this.sys.game.config.width - 10, // X-Position: rechts innen
      10,                              // Y-Position: 10 px von oben
      'Level: ' + currentLevel,        // Starttext
      {
        font: '20px Arial',
        fill: '#ffffff',
      }
    );

    levelText.setOrigin(1, 0); // Rechts oben ausrichten

    gameOverText = this.add.text(width / 2, height / 2, 'GAME OVER', {
      font: '50px Arial',
      fill: '#ff0000',
      fontStyle: 'bold',
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

    congratsText = this.add.text(width / 2, height / 2, 'Gratulation,\ndu hast das Spiel erfolgreich beendet!', {
      font: '40px Arial',
      fill: '#00ff00',
      fontStyle: 'bold',
      align: 'center',
    });
    congratsText.setOrigin(0.5);
    congratsText.setVisible(false);

    this.input.on('pointerdown', () => {
      if (!ballLaunched && !gameEnded) {
        launchBall();
      }
    });
    this.input.keyboard.on('keydown-SPACE', () => {
      if (!ballLaunched && !gameEnded) {
        launchBall();
      }
    });
    this.input.on('pointermove', pointer => {
      paddle.x = Phaser.Math.Clamp(pointer.x, paddle.width / 2, width - paddle.width / 2);
    });

    // Erster Levelaufbau
    loadLevel.call(this, currentLevel);

    this.physics.add.collider(ball, paddle, ballPaddleCollision, null, this);
    this.physics.add.collider(ball, bricks, ballBrickCollision, null, this);
  }

  function update() {
    if (gameEnded) {
      paddle.setVelocityX(0);
      ball.setVelocity(0, 0);
      return;
    }

    if (cursors.left.isDown) {
      paddle.setVelocityX(-300);
    } else if (cursors.right.isDown) {
      paddle.setVelocityX(300);
    } else {
      paddle.setVelocityX(0);
    }

    if (!ballLaunched) {
      ball.x = paddle.x;
      ball.y = paddle.y - paddle.height / 2 - 10;
      ball.setVelocity(0, 0);
    }

    if (ball.y > this.sys.game.config.height - ball.height) {
      loseLife();
    }
  }

  function launchBall() {
    ballLaunched = true;
    ball.setVelocity(150, -300);
  }

  function loseLife() {
    lives--;
    livesText.setText('Leben: ' + lives);

    if (lives > 0) {
      ballLaunched = false;
      ball.setVelocity(0, 0);
      ball.x = paddle.x;
      ball.y = paddle.y - paddle.height / 2 - 10;
    } else {
      gameOver();
    }
  }

  function gameOver() {
    gameEnded = true;
    ball.setVelocity(0, 0);
    paddle.setVelocity(0, 0);
    gameOverText.setVisible(true);
  }

  function loadLevel(levelNumber) {
    if (bricks) {
      bricks.clear(true, true);
    }
    brickHealth.clear();
    bricks = this.physics.add.staticGroup();

    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;

    const levelKey = 'level' + levelNumber;
    const levelData = this.cache.json.get(levelKey).layout;

    const brickWidth = width * 0.09;
    const brickHeight = height * 0.05;
    const offsetTop = height * 0.10;
    const offsetLeft = (width - (brickWidth * levelData[0].length)) / 2;

    bricksRemaining = 0;

    for (let row = 0; row < levelData.length; row++) {
      for (let col = 0; col < levelData[row].length; col++) {
        const brickType = levelData[row][col];
        if (brickType >= 1 && brickType <= 4) {
          const brickX = offsetLeft + col * brickWidth + brickWidth / 2;
          const brickY = offsetTop + row * brickHeight + brickHeight / 2;
          const brick = bricks.create(brickX, brickY, 'brick' + brickType);

          brick.setDisplaySize(brickWidth * 0.95, brickHeight * 0.9);
          brick.refreshBody();

          brickHealth.set(brick, brickType);

          // Steine mit Typ 1,2,3 sind zerstörbar — zählen wir mit
          if (brickType !== 4) {
            bricksRemaining++;
          }
        }
      }
    }

    bricksText.setText('Verbleibende Steine: ' + bricksRemaining);

    levelText.setText('Level ' + levelNumber + ' von ' + maxLevel);
    // Neue Kollision mit dem neuen Brick-Set registrieren:
    this.physics.add.collider(ball, bricks, ballBrickCollision, null, this);
  }

  function ballPaddleCollision(ball, paddle) {
    const relativeIntersectX = ball.x - paddle.x;
    const normalizedIntersectX = relativeIntersectX / (paddle.width / 2);
    const maxBounceAngle = Phaser.Math.DegToRad(75);
    const bounceAngle = normalizedIntersectX * maxBounceAngle;
    const speed = ball.body.velocity.length();

    ball.body.velocity.x = speed * Math.sin(bounceAngle);
    ball.body.velocity.y = -speed * Math.cos(bounceAngle);
  }

  function ballBrickCollision(ball, brick) {
    const currentType = brickHealth.get(brick);

    switch (currentType) {
      case 1:
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining.call(this);
        break;
      case 2:
        brickHealth.set(brick, 1);
        brick.setTexture('brick1');
        break;
      case 3:
        brickHealth.set(brick, 2);
        brick.setTexture('brick2');
        break;
      case 4:
        // unzerstörbar, nichts tun
        break;
      default:
        // Fallback: zerstören
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining.call(this);
    }
  }

  // Hilfsfunktion: Zähler verringern, ggf. Level wechseln
  function decrementBricksRemaining() {
    bricksRemaining--;
    bricksText.setText('Verbleibende Steine: ' + bricksRemaining);

    // Wenn keine zerstörbaren Bricks mehr übrig sind:
    if (bricksRemaining <= 0) {
      ballLaunched = false;
      ball.setVelocity(0, 0);
      ball.x = paddle.x;
      ball.y = paddle.y - paddle.height / 2 - 10;

      // Nächstes Level laden oder Spiel beenden
      if (currentLevel < maxLevel) {
        currentLevel++;
        loadLevel.call(this, currentLevel);
      } else {
        winGame.call(this);
      }
    }
  }

  function winGame() {
    gameEnded = true;
    ball.setVelocity(0, 0);
    paddle.setVelocity(0, 0);
    congratsText.setVisible(true);
  }
};

```

---

### 9.4 Erläuterungen

- **Levelwechsel:**  
  Die Variable `currentLevel` hält den aktuellen Level, `maxLevel` definiert, wie viele Levels es gibt.  
  Die Funktion `loadLevel(levelNumber)` lädt das Level dynamisch neu. Alle Brick-Daten werden eingelesen.

- **Zählung:**  
  `bricksRemaining` zählt alle zerstörbaren Bricks (Typ 1, 2, 3). Diese Zahl wird bei jedem Treffer durch `decrementBricksRemaining()` verringert.

- **Bricks vom Typ 4 (unzerstörbar):**  
  Diese werden nicht mitgezählt und bleiben auf dem Spielfeld stehen.

- **Levelende & Spielende:**  
  Sind keine zerstörbaren Bricks mehr da, wird das nächste Level geladen.  
  Ist das letzte Level abgeschlossen, erscheint die Gratulationsmeldung, und das Spiel wird beendet (`gameEnded = true`).

- **UI:**  
  Der Text `bricksText` zeigt immer die verbliebenen Bricks an.

---

### 9.5 Live-Test

<iframe 
  src="08BreakoutLevels/index.html" 
  width="820" 
  height="700" 
  frameborder="0" 
  sandbox="allow-scripts allow-same-origin">
</iframe>

---

### 9.6 Nächste Ideen

- Lebensanzeige für unterschiedliche Brick-Typen einblenden
- PowerUps und Boni für schnelleres Level-Überwinden
- Score-System integrieren und Highscore speichern

---

Herzlichen Glückwunsch! Du hast jetzt ein mehrstufiges Breakout-Spiel mit dynamischem Level-Ladevorgang, verschiedenen Brick-Typen und endlichem Spielende erstellt! Weiter so!
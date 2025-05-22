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

Ergänze bzw. ändere deinen Code wie folgt:

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

  let currentLevel = 1;
  const maxLevel = 3;  // Level 3 mit brick5 hinzugefügt

  let bricksRemaining = 0;
  let bricksText;
  let congratsText;
  let levelText;

  // Neuer Physik-Sprite für die fallende Kugel (PowerUp)
  let powerUp;  

  const game = new Phaser.Game(config);

  function preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('paddle', 'assets/paddle.png');
    for (let i = 1; i <= 5; i++) {
      this.load.image('brick' + i, 'assets/brick' + i + '.png');
    }
    this.load.image('sphere1', 'assets/sphere1.png');  // PowerUp Kugel laden

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

    levelText = this.add.text(
      width - 10,
      10,
      'Level ' + currentLevel + ' von ' + maxLevel,
      {
        font: '20px Arial',
        fill: '#ffffff',
      }
    );
    levelText.setOrigin(1, 0);

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

  function update() {
    if (gameEnded) {
      paddle.setVelocityX(0);
      ball.setVelocity(0, 0);
      powerUp.setVelocity(0, 0);
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

    // PowerUp fällt nach unten, wenn sichtbar
    if (powerUp.visible) {
      // Kugel fällt mit konstanter Geschwindigkeit nach unten
      powerUp.setVelocityY(200);

      // Kugel geht verloren, wenn sie den Boden berührt (außerhalb des Bildschirms)
      if (powerUp.y > this.sys.game.config.height - powerUp.height) {
        resetPowerUp();
      }
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
    powerUp.setVisible(false);
    powerUp.setVelocity(0,0);
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
        if (brickType >= 1 && brickType <= 5) {
          const brickX = offsetLeft + col * brickWidth + brickWidth / 2;
          const brickY = offsetTop + row * brickHeight + brickHeight / 2;
          const brick = bricks.create(brickX, brickY, 'brick' + brickType);

          brick.setDisplaySize(brickWidth * 0.95, brickHeight * 0.9);
          brick.refreshBody();

          brickHealth.set(brick, brickType);

          if (brickType !== 4) {
            bricksRemaining++;
          }
        }
      }
    }

    bricksText.setText('Verbleibende Steine: ' + bricksRemaining);

    levelText.setText('Level ' + levelNumber + ' von ' + maxLevel);

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
      case 5:
        // spezieller Brick: zerstören und PowerUp erzeugen
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining.call(this);

        spawnPowerUp.call(this, brick.x, brick.y);
        break;
      default:
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining.call(this);
    }
  }

  // PowerUp erzeugen an Position x,y
  function spawnPowerUp(x, y) {
    powerUp.setPosition(x, y);
    powerUp.setVelocity(0, 200);
    powerUp.setVisible(true);
  }

  // PowerUp fleht nach unten, wenn es Paddle berührt
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

  // Zählt remaining Bricks runter, wechselt Level oder beendet Spiel
  function decrementBricksRemaining() {
    bricksRemaining--;
    bricksText.setText('Verbleibende Steine: ' + bricksRemaining);

    if (bricksRemaining <= 0) {
      ballLaunched = false;
      ball.setVelocity(0, 0);
      ball.x = paddle.x;
      ball.y = paddle.y - paddle.height / 2 - 10;

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
    powerUp.setVisible(false);
    powerUp.setVelocity(0, 0);
    congratsText.setVisible(true);
  }
};
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


# Breakout-Game Tutorial mit Phaser.io

## Schritt 8: Verschiedene Steintypen mit Lebensenergie

In diesem Schritt erweitern wir unser Spiel um unterschiedliche Steintypen mit verschiedenem Verhalten bei Balltreffern:

- **Typ 1** wird nach einem Treffer zerstört.
- **Typ 2** verwandelt sich nach dem ersten Treffer in Typ 1.
- **Typ 3** verwandelt sich nach dem ersten Treffer in Typ 2.
- **Typ 4** ist unzerstörbar.

---

### 8.1 Level-Datei anpassen: `assets/level2.json`

Erstelle eine neue Level-Datei `level2.json` im `assets`-Ordner mit der Angabe der Steintypen als Zahlen:

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
### 8.2 Code-Anpassungen in `game.js`

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

  let bricks;        // Gruppe für Bricks
  let brickHealth = new Map(); // Map für den Zustand der Bricks

  const game = new Phaser.Game(config);

  function preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('paddle', 'assets/paddle.png');
    // Mehrere Brick-Sprites laden
    for (let i = 1; i <= 4; i++) {
      this.load.image('brick' + i, 'assets/brick' + i + '.png');
    }
    this.load.json('level2', 'assets/level2.json');  // Neues Level laden
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

    gameOverText = this.add.text(width / 2, height / 2, 'GAME OVER', {
      font: '50px Arial',
      fill: '#ff0000',
      fontStyle: 'bold',
    });
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);

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

    bricks = this.physics.add.staticGroup();

    const levelData = this.cache.json.get('level2').layout;

    const brickWidth = width * 0.09;    
    const brickHeight = height * 0.05;  
    const offsetTop = height * 0.10;    
    const offsetLeft = (width - (brickWidth * levelData[0].length)) / 2;

    for (let row = 0; row < levelData.length; row++) {
      for (let col = 0; col < levelData[row].length; col++) {
        const brickType = levelData[row][col];
        if (brickType >= 1 && brickType <= 4) {
          const brickX = offsetLeft + col * brickWidth + brickWidth / 2;
          const brickY = offsetTop + row * brickHeight + brickHeight / 2;
          const brick = bricks.create(brickX, brickY, 'brick' + brickType);

          brick.setDisplaySize(brickWidth * 0.95, brickHeight * 0.9);
          brick.refreshBody();

          // Jeder Brick bekommt eine eindeutige ID (z.B. durch die Phaser intern id)
          // und seinen Typ als Health bzw. Lebenszustand
          brickHealth.set(brick, brickType);
        }
      }
    }

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

  function ballPaddleCollision(ball, paddle) {
    const relativeIntersectX = ball.x - paddle.x;
    const normalizedIntersectX = relativeIntersectX / (paddle.width / 2);
    const maxBounceAngle = Phaser.Math.DegToRad(75);
    const bounceAngle = normalizedIntersectX * maxBounceAngle;
    const speed = ball.body.velocity.length();

    ball.body.velocity.x = speed * Math.sin(bounceAngle);
    ball.body.velocity.y = -speed * Math.cos(bounceAngle);
  }

  // Aktualisierte Funktion für Ball trifft Brick
  function ballBrickCollision(ball, brick) {
    const currentType = brickHealth.get(brick);

    switch(currentType) {
      case 1:
        // Typ 1 zerstört nach Treffer
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        break;
      case 2:
        // Typ 2 wird zu Typ 1
        brickHealth.set(brick, 1);
        brick.setTexture('brick1');
        break;
      case 3:
        // Typ 3 wird zu Typ 2
        brickHealth.set(brick, 2);
        brick.setTexture('brick2');
        break;
      case 4:
        // Typ 4 unzerstörbar - nichts passiert
        // Optional: Ball kann abprallen, keine Änderung
        break;
      default:
        // Fallback, falls Typ undefiniert
        brick.disableBody(true, true);
        brickHealth.delete(brick);
    }
  }
};
```

---

### 8.3 Erklärung der Änderungen

- Im `preload()` laden wir alle vier Brick-Bilder mit Hilfe einer Zählschleife.

- Für jeden Brick speichern wir seinen Typ in der zusammengesetzten Variable `brickHealth`:  
      `brickHealth.set(brick, brickType);`  
      Hierbei ist jedem brick-Objekt ein brickType-Wert zugeordnet.  

    
- Im `ballBrickCollision`-Handler wird geprüft, welcher Typ der Brick hat:
  - Typ 1: sofort zerstören.
  - Typ 2: Brick wird zu Typ 1, indem wir Textur und brickHealth-Wert ändern.
  - Typ 3: Brick wird zu Typ 2 (gleicher Mechanismus).
  - Typ 4: unzerstörbar, daher keine Aktion.

---

### 8.4 Live-Test

<iframe 
  src="07BrickTypen/index.html" 
  width="820" 
  height="700" 
  frameborder="0" 
  sandbox="allow-scripts allow-same-origin">
</iframe>
---

### Dateien

[Zip-Datei](07Bricktypen.zip)    
---  
### [weiter](08Level.html)  

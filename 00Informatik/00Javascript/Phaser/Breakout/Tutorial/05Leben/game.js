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

  let lives = 3;               // Neue Variable für Leben
  let livesText;               // Textobjekt für Anzeige Lives
  let gameOverText;            // Textobjekt für Game Over
  let gameEnded = false;       // Zustand, ob Spiel beendet ist

  const game = new Phaser.Game(config);

  function preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('paddle', 'assets/paddle.png');
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

    // Starte Ball auf Mausklick oder Leertaste
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

    this.physics.add.collider(ball, paddle, ballPaddleCollision, null, this);
  }

  function update() {
    if (gameEnded) {
      paddle.setVelocityX(0);
      ball.setVelocity(0, 0);
      return;  // Spiel gestoppt, nichts mehr bewegen
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

    // Prüfen, ob Ball unten aus dem Spielfeld gefallen ist
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

  // Game Over Funktion
  function gameOver() {
    gameEnded = true;
    ball.setVelocity(0, 0);
    paddle.setVelocity(0, 0);
    gameOverText.setVisible(true);
  }

  // Kollisionsfunktion Ball-Paddle aus Schritt 4/5
  function ballPaddleCollision(ball, paddle) {
    const relativeIntersectX = ball.x - paddle.x;
    const normalizedIntersectX = relativeIntersectX / (paddle.width / 2);
    const maxBounceAngle = Phaser.Math.DegToRad(75);
    const bounceAngle = normalizedIntersectX * maxBounceAngle;
    const speed = ball.body.velocity.length();

    ball.body.velocity.x = speed * Math.sin(bounceAngle);
    ball.body.velocity.y = -speed * Math.cos(bounceAngle);
  }
};


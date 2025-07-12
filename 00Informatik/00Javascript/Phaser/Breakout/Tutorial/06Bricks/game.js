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

  let bricks; // Gruppe für Bricks
  
  const game = new Phaser.Game(config);

  function preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('paddle', 'assets/paddle.png');
    this.load.image('brick1', 'assets/brick1.png');
    this.load.json('level1', 'assets/level1.json');  // Level laden
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
    // Mausbewegung erfassen – X-Position übernimmt Paddle (Y bleibt fix)
    this.input.on('pointermove', pointer => {
      paddle.x = Phaser.Math.Clamp(pointer.x, paddle.width / 2, width - paddle.width / 2);
    });

    // Bricks-Gruppe erstellen
    bricks = this.physics.add.staticGroup();

    // Level-Daten aus JSON holen
    const levelData = this.cache.json.get('level1').layout;

    // Relative Größen und Positionen der Bricks
    const brickWidth = width * 0.09;    // 9% der Gesamtbreite
    const brickHeight = height * 0.05;  // 5% der Gesamthöhe
    const offsetTop = height * 0.10;    // 10% Abstand von oben
    const offsetLeft = (width - (brickWidth * levelData[0].length)) / 2; // horizontal zentrieren
  
    for (let row = 0; row < levelData.length; row++) {
      for (let col = 0; col < levelData[row].length; col++) {
        if (levelData[row][col] === 1) {
          const brickX = offsetLeft + col * brickWidth + brickWidth / 2;
          const brickY = offsetTop + row * brickHeight + brickHeight / 2;
          const brick = bricks.create(brickX, brickY, 'brick1');
  
          // Brick-Größe anpassen (Skalierung), falls das Bild eine andere Größe hat
          brick.setDisplaySize(brickWidth*0.95, brickHeight*0.9);
          brick.refreshBody();
        }
      }
    }

    // Kollision Paddle - Ball
    this.physics.add.collider(ball, paddle, ballPaddleCollision, null, this);

    // Kollision Ball - Bricks
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

  // Neue Funktion: Ball trifft Brick
  function ballBrickCollision(ball, brick) {
    brick.disableBody(true, true);
  
  }
};

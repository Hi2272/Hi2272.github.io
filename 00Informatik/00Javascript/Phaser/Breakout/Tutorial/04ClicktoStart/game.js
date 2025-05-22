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
  let ballLaunched = false;  // Neuer Zustand: Ball ist gestartet oder nicht

  const game = new Phaser.Game(config);

  function preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('paddle', 'assets/paddle.png');
  }

  function create() {
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;

    // Paddle erstellen
    paddle = this.physics.add.image(width / 2, height - 50, 'paddle');
    paddle.setImmovable(true);
    paddle.setCollideWorldBounds(true);

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

    // Kollisions-Callback zwischen Ball und Paddle
    this.physics.add.collider(ball, paddle, ballPaddleCollision, null, this);
  }

  function update() {
    // Paddle mit Pfeiltasten bewegen
    if (cursors.left.isDown) {
      paddle.setVelocityX(-300);
    } else if (cursors.right.isDown) {
      paddle.setVelocityX(300);
    } else {
      paddle.setVelocityX(0);
    }

    // Solange der Ball nicht gestartet ist, wird er an das Paddle gekoppelt
    if (!ballLaunched) {
      ball.x = paddle.x;
      ball.y = paddle.y - paddle.height / 2 - 10; // leicht oberhalb vom Paddle positionieren
      ball.setVelocity(0, 0);
    }
  }

  // Funktion um den Ball zu starten
  function launchBall() {
    ballLaunched = true;    
    // Starte den Ball mit definierter Geschwindigkeit nach oben und leicht seitlich
    ball.setVelocity(150, -300);
  }

  // Kollisionsfunktion Ball-Paddle mit Winkelberechnung (aus Schritt 4)
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
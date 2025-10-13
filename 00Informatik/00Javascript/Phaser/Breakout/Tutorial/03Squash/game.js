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

  const game = new Phaser.Game(config);

  function preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('paddle', 'assets/paddle.png');
  }

  function create() {
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;

    // Ball in der Mitte erstellen
    ball = this.physics.add.image(width / 2, height / 2, 'ball');
    ball.setVelocity(150, 150);
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);

    // Paddle an unteren Rand setzen, mittig horizontal
    paddle = this.physics.add.image(width / 2, height - 50, 'paddle');
    paddle.setImmovable(true);
    paddle.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    this.input.on('pointermove', pointer => {
      paddle.x = Phaser.Math.Clamp(pointer.x, paddle.width / 2, width - paddle.width / 2);
    });

    // Neue Ergänzung: Kollision zwischen Ball und Paddle
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

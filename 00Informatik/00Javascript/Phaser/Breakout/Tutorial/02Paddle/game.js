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
    paddle.setImmovable(true);         // Paddle soll sich nicht durch Kollision bewegen
    paddle.setCollideWorldBounds(true); // Paddle bleibt im Spielfeld

    // Cursor-Tasten einlesen
    cursors = this.input.keyboard.createCursorKeys();

    // Mausbewegung erfassen – X-Position übernimmt Paddle (Y bleibt fix)
    this.input.on('pointermove', pointer => {
      paddle.x = Phaser.Math.Clamp(pointer.x, paddle.width / 2, width - paddle.width / 2);
    });
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

    // Ball prallt noch nicht am Paddle ab
    // Ball kann also weiterhin frei im Spielfeld herumfliegen
  }
};

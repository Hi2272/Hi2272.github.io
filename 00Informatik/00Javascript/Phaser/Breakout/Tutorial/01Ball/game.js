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
              debug: false
            }
          },
        scene: {
          preload: preload,
          create: create,
          update: update
        },
      };

  let ball;

  const game = new Phaser.Game(config);

  function preload() {
    // Lade den Ball als Bild-Asset
    this.load.image('ball', 'assets/ball.png');
  }

  function create() {
    // Erstelle den Ball in der Mitte des Spielfeldes
    ball = this.physics.add.image(400, 300, 'ball');

    // Ball bewegt sich zu Beginn diagonal mit einer Geschwindigkeit von 150
    ball.setVelocity(150, 150);

    // Ball prallt an den Spielfeldgrenzen ab
    ball.setCollideWorldBounds(true);

    // Ball bleibt nicht stehen, sondern prallt ab
    ball.setBounce(1);
  }

  function update() {
    // Im Moment keine zusätzliche Logik notwendig
  }
};

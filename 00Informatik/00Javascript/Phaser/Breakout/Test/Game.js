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
let paddle;
let cursors;

const game = new Phaser.Game(config);

function preload() {
  // Lade den Ball als Bild-Asset
  this.load.image('ball', 'assets/ball.png');
  this.load.image('paddle', 'assets/paddle.png');
}

function create() {
  const width = this.sys.game.config.width;
  const height = this.sys.game.config.height;


  // Ball in der Mitte erstellen
  ball = this.physics.add.image(width / 2, height / 2, 'ball');

  // Ball bewegt sich zu Beginn diagonal mit einer Geschwindigkeit von 150
  ball.setVelocity(150, 150);

  // Ball prallt an den Spielfeldgrenzen ab
  ball.setCollideWorldBounds(true);

  // Ball bleibt nicht stehen, sondern prallt ab
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
  // Im Moment keine zusätzliche Logik notwendig
}
};

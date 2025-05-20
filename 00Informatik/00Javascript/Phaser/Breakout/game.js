const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

let messageText;  // Textobjekt für Meldungen
let paddle;
let ball;
let bricks;
let cursors;
let lives = 3;
let livesText;
let level = 0;
let levels = ['level1.json', 'level2.json', 'level3.json'];
let brickHits = new Map();
let background;

function preload() {
    // Paddle und Ball
    this.load.image('paddle', 'assets/paddle.png');
    this.load.image('ball', 'assets/ball.png');

    // Steine
    this.load.image('brick1', 'assets/bricks/brick1.png');
    this.load.image('brick2', 'assets/bricks/brick2.png');
    this.load.image('brick3', 'assets/bricks/brick3.png');

    // Hintergründe
    this.load.image('bg1', 'assets/backgrounds/bg1.png');
    this.load.image('bg2', 'assets/backgrounds/bg2.png');
    this.load.image('bg3', 'assets/backgrounds/bg3.png');

    // Level JSONs
    this.load.json('level1', 'levels/level1.json');
    this.load.json('level2', 'levels/level2.json');
    this.load.json('level3', 'levels/level3.json');
}

function create() {
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Hintergrund als TileSprite (oder als Image) laden
    background = this.add.image(400, 300, 'bg1');

    // Paddle
    paddle = this.physics.add.image(400, 550, 'paddle').setImmovable();
    paddle.body.allowGravity = false;
    paddle.setCollideWorldBounds(true);

    // Ball
    ball = this.physics.add.image(400, 535, 'ball').setCollideWorldBounds(true).setBounce(1);
    ball.setData('onPaddle', true);

    // Lives Text
    livesText = this.add.text(10, 10, 'Leben: ' + lives, { fontSize: '20px', fill: '#fff' });

    // Bricks-Gruppe
    bricks = this.physics.add.staticGroup();

     // Message Text initial versteckt
     messageText = this.add.text(config.width/2, config.height/2, '', {
        fontSize: '40px',
        fill: '#fff',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: { x: 20, y: 10 },
        align: 'center'
    }).setOrigin(0.5).setDepth(10);
    messageText.setVisible(false);

    // Steuerung
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', () => {
        if (ball.getData('onPaddle')) {
            ball.setVelocity(-75, -300);
            ball.setData('onPaddle', false);
        }
    });

    // Kollisionen
    this.physics.add.collider(ball, paddle, hitPaddle, null, this);
    this.physics.add.collider(ball, bricks, hitBrick, null, this);

    loadLevel(this, level);
}

// Funktion um Nachrichten anzuzeigen
function showMessage(text, duration = 2000) {
    messageText.setText(text);
    messageText.setVisible(true);

    // clear vorherige Timer (falls vorhanden)
    if (messageText.hideTimer) {
        messageText.hideTimer.remove(false);
    }
    messageText.hideTimer = messageText.scene.time.delayedCall(duration, () => {
        messageText.setVisible(false);
    });
}

function update() {
    if (ball.getData('onPaddle')) {
        ball.x = paddle.x;
        ball.y = 535;
    }

    // Paddle-Steuerung
    if (cursors.left.isDown) {
        paddle.setVelocityX(-500);
    } else if (cursors.right.isDown) {
        paddle.setVelocityX(500);
    } else {
        paddle.setVelocityX(0);
    }

    // Ball fällt runter (unter Bestimmte Höhe)
    if (ball.y > 600) {
        loseLife(this);
    }

    // Alle Steine zerstört => nächstes Level
    if (bricks.countActive() === 0) {
        nextLevel(this);
    }
}

function loadLevel(scene, lvl) {
    // Bricks löschen
    bricks.clear(true, true);
    brickHits.clear();

    let lvlData = scene.cache.json.get('level'+(lvl+1));

    // Hintergrund wechseln
    if (background) {
        background.setTexture(lvlData.background.replace('.png',''));
        background.setDisplaySize(config.width, config.height);
    
    }

    // Steine hinzufügen
    lvlData.bricks.forEach(b => {
        let key = 'brick' + b.type;
        let brick = bricks.create(b.x, b.y, key).setOrigin(0.5, 0.5);
        brick.setData('hitsLeft', b.type); // 1,2,3 Hits entsprechend
        brick.refreshBody();

        // Speichere Hits in Map wenn nötig (brauchst für debug/Info)
        brickHits.set(brick, b.type);
    });

    resetBallAndPaddle(scene);
}

function hitPaddle(ball, paddle) {
    // Ball wird je nach Einschlagwinkel am Paddle abprallen
    let diff = 0;

    if (ball.x < paddle.x) {
        // links vom Zentrum des Paddles
        diff = paddle.x - ball.x;
        ball.setVelocityX(-10 * diff);
    } else if (ball.x > paddle.x) {
        // rechts vom Zentrum des Paddles
        diff = ball.x - paddle.x;
        ball.setVelocityX(10 * diff);
    } else {
        // gerade nach oben
        ball.setVelocityX(Phaser.Math.Between(-10, 10));
    }
}

function hitBrick(ball, brick) {
    // Treffer abziehen
    let hitsLeft = brick.getData('hitsLeft') - 1;
    brick.setData('hitsLeft', hitsLeft);

    if (hitsLeft <= 0) {
        bricks.killAndHide(brick);
        bricks.remove(brick);
    } else {
        // Optional: optische Rückmeldung für Treffer, z.B. alpha reduzieren oder Frame wechseln
        // Wir können bspw. halbtransparent machen je nach HitsLeft
        if (hitsLeft === 2) {
            brick.setTexture('brick2');
        } else if (hitsLeft === 1){
            brick.setTexture('brick1');
        }
    }
}

function loseLife(scene) {
    lives--;
    livesText.setText('Leben: ' + lives);

    if (lives === 0) {
        // GameOver
        showMessage('Game Over', 3000);
        level = 0;
        lives = 3;
        livesText.setText('Leben: ' + lives);
        loadLevel(scene, level);
    } else {
        resetBallAndPaddle(scene);
    }
}

function resetBallAndPaddle(scene) {
    ball.setVelocity(0);
    ball.setPosition(paddle.x, 535);
    ball.setData('onPaddle', true);
}

function nextLevel(scene) {
    level++;
    if (level >= levels.length) {
        showMessage('Gewonnen! Alle Level sind geschafft.', 3000);
    
        level = 0;
        lives = 3;
        livesText.setText('Leben: ' + lives);
    }
    loadLevel(scene, level);
}

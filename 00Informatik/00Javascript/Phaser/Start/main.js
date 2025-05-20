const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let ball, paddle, bricks;
let cursors;
let gameOver = false;
let gameOverText;
let level = 0;
let levelText;
let backgroundImage;
let levelsData;

const game = new Phaser.Game(config);

function preload() {
    this.load.json('levels', 'levels.json');

    this.load.image('ball', 'ball.png');
    this.load.image('brick', 'brick.png');
    this.load.image('paddle', 'schlaeger.png');
    this.load.image('bg1.png','bg1.png');
    this.load.image('bg2.png','bg2.png');
    

}

function create() {
    levelsData = this.cache.json.get('levels');
    if (!levelsData || !levelsData.levels || levelsData.levels.length === 0) {
        console.error('Keine Level-Daten gefunden!');
        return;
    }

    cursors = this.input.keyboard.createCursorKeys();

    this.input.on('pointermove', pointer => {
        if (!gameOver && paddle) {
            paddle.x = Phaser.Math.Clamp(pointer.x, paddle.width / 2, config.width - paddle.width / 2);
        }
    });

    gameOverText = this.add.text(config.width / 2, config.height / 2, 'Game over', {
        fontSize: '64px',
        fill: '#ff0000',
        fontStyle: 'bold'
    }).setOrigin(0.5);
    gameOverText.setVisible(false);

    levelText = this.add.text(10, 10, `Level: ${level + 1}`, { fontSize: '24px', fill: '#ffffff' });
    this.loadLevel = loadLevel.bind(this); // bind(this) wichtig!

    // Level laden
    this.loadLevel(level);
}

function update() {
    if (gameOver) {
        ball.setVelocity(0);
        paddle.setVelocity(0);
        return;
    }

    if (paddle) {
        if (cursors.left.isDown) {
            paddle.setVelocityX(-400);
        } else if (cursors.right.isDown) {
            paddle.setVelocityX(400);
        } else {
            paddle.setVelocityX(0);
        }
    }

    if (ball && ball.y > config.height) {
        endGame.call(this);
    }
}

// --- Neue Methode innerhalb der Szene ---
function loadLevel(levelIndex) {
    const scene = this; // Szene referenz

    const levelData = levelsData.levels[levelIndex];

    if (backgroundImage) {
        backgroundImage.destroy();
    }

    backgroundImage = scene.add.image(config.width / 2, config.height / 2, levelData.background).setOrigin(0.5);
    backgroundImage.setDisplaySize(config.width, config.height);
    if (!paddle) {
        paddle = scene.physics.add.image(config.width / 2, config.height - 50, 'paddle');
        paddle.setImmovable(true);
        paddle.body.allowGravity = false;
        paddle.setCollideWorldBounds(true);
    } else {
        paddle.setPosition(config.width / 2, config.height - 50);
        paddle.body.enable = true;
        paddle.setActive(true).setVisible(true);
    }
    scene.children.bringToTop(paddle);
    if (!ball) {
        ball = scene.physics.add.image(config.width / 2, config.height - 80, 'ball');
        ball.setCollideWorldBounds(true);
        ball.setBounce(1);
        ball.setCircle(ball.width / 2);
    }
    resetBall.call(scene);
    scene.children.bringToTop(ball);
    if (bricks) {
        bricks.clear(true, true);
    }
    bricks = scene.physics.add.staticGroup();

    const brickWidth = 64;
    const brickHeight = 32;
    const cols = levelData.bricks[0].length;
    const rows = levelData.bricks.length;
    const offsetX = (config.width - (cols * brickWidth)) / 2;
    const offsetY = 50;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (levelData.bricks[row][col] === 1) {
                const x = offsetX + col * brickWidth + brickWidth / 2;
                const y = offsetY + row * brickHeight + brickHeight / 2;
                bricks.create(x, y, 'brick');
            }
        }
    }

    scene.physics.add.collider(ball, paddle, hitPaddle, null, scene);
    scene.physics.add.collider(ball, bricks, hitBrick, null, scene);

    scene.physics.world.setBoundsCollision(true, true, true, false);

    gameOver = false;
    if (gameOverText) gameOverText.setVisible(false);
    scene.children.bringToTop(gameOverText);

    levelText.setText(`Level: ${levelIndex + 1}`);
    scene.children.bringToTop(levelText);

}

function resetBall() {
    const angle = Phaser.Math.Between(-60, -120);
    const speed = 200;
    ball.setPosition(config.width / 2, config.height - 80);
    ball.setVelocity(speed * Math.cos(angle * Phaser.Math.DEG_TO_RAD), speed * Math.sin(angle * Phaser.Math.DEG_TO_RAD));
}

function hitBrick(ball, brick) {
    brick.disableBody(true, true);
    if (bricks.countActive() === 0) {
        level++;
        if (level >= levelsData.levels.length) {
            level = 0; // zurück auf Level 1
        }
        this.loadLevel(level);
    }
}

function hitPaddle(ball, paddle) {
    const diff = ball.x - paddle.x;
    const normalized = diff / (paddle.width / 2);
    const bounceAngle = normalized * (Math.PI / 3);

    let speed = ball.body.speed || 300;
    speed = Math.max(speed, 300);

    ball.body.velocity.x = speed * Math.sin(bounceAngle);
    ball.body.velocity.y = -Math.abs(speed * Math.cos(bounceAngle));
}

function endGame() {
    gameOver = true;
    gameOverText.setVisible(true);
}

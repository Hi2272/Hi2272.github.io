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

let messageText;  
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

/**
 * Lädt alle benötigten Assets vor dem Spielstart.
 */
function preload() {
    this.load.image('paddle', 'assets/paddle.png');
    this.load.image('ball', 'assets/ball.png');

    this.load.image('brick1', 'assets/bricks/brick1.png');
    this.load.image('brick2', 'assets/bricks/brick2.png');
    this.load.image('brick3', 'assets/bricks/brick3.png');

    this.load.image('bg1', 'assets/backgrounds/bg1.png');
    this.load.image('bg2', 'assets/backgrounds/bg2.png');
    this.load.image('bg3', 'assets/backgrounds/bg3.png');

    this.load.json('level1', 'levels/level1.json');
    this.load.json('level2', 'levels/level2.json');
    this.load.json('level3', 'levels/level3.json');
}

/**
 * Initialisiert das Spiel: Physik, Objekte, Steuerung und lädt das erste Level.
 */
function create() {
    // Aktiviere Kollision an den linken, rechten und oberen Rändern des Spielfelds, nicht am unteren Rand
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Hintergrundbild hinzufügen
    background = this.add.image(400, 300, 'bg1');

    // Paddle

    // Erstelle das Paddle-Objekt, positioniere es und mache es unbeweglich bei Kollisionen
    paddle = this.physics.add.image(400, 550, 'paddle').setImmovable(); 
    // Deaktiviere die Schwerkraft für das Paddle, damit es nicht nach unten fällt
    paddle.body.allowGravity = false; 
    // Verhindere, dass das Paddle das Spielfeld verlässt (Kollision mit Bildschirmrändern aktivieren)
    paddle.setCollideWorldBounds(true); 

    // Ball 

    // Erstelle das Ball-Objekt, aktiviere Kollision mit Spielfeldrändern und setze den Rückprallwert auf 1 (voller Rückprall)
    ball = this.physics.add.image(400, 535, 'ball').setCollideWorldBounds(true).setBounce(1); 
    // Markiere den Ball als "auf dem Paddle liegend", damit er noch nicht im Spiel ist
    ball.setData('onPaddle', true); 
    
    // Anzeige der verbleibenden Leben
    livesText = this.add.text(10, 10, 'Leben: ' + lives, { fontSize: '20px', fill: '#fff' });

    // Gruppe für die Steine anlegen
    bricks = this.physics.add.staticGroup();

    // Text für Nachrichten erstellen, zunächst unsichtbar
    messageText = this.add.text(config.width/2, config.height/2, '', {
        fontSize: '40px',
        fill: '#fff',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: { x: 20, y: 10 },
        align: 'center'
    }).setOrigin(0.5).setDepth(10);
    messageText.setVisible(false);

    // Tastatursteuerung initialisieren
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', () => {
        if (ball.getData('onPaddle')) {
            ball.setVelocity(-75, -300);
            ball.setData('onPaddle', false);
        }
    });

    // Kollisionen zwischen Ball, Paddle und Steinen aktivieren
    this.physics.add.collider(ball, paddle, hitPaddle, null, this);
    this.physics.add.collider(ball, bricks, hitBrick, null, this);

    loadLevel(this, level);
}

/**
 * Zeigt eine Nachricht für eine bestimmte Dauer in der Bildschirmmitte an.
 * @param {string} text - Der anzuzeigende Text
 * @param {number} duration - Zeit in Millisekunden, wie lange die Nachricht angezeigt wird (Standard: 2000)
 */
function showMessage(text, duration = 2000) {
    messageText.setText(text);
    messageText.setVisible(true);

    if (messageText.hideTimer) {
        messageText.hideTimer.remove(false);
    }
    messageText.hideTimer = messageText.scene.time.delayedCall(duration, () => {
        messageText.setVisible(false);
    });
}

/**
 * Spiel-Loop: Bewegt Paddle, verfolgt Ballposition und prüft Spielstatus.
 */
function update() {
    // Ball bleibt auf Paddle liegen falls noch nicht gestartet
    if (ball.getData('onPaddle')) {
        ball.x = paddle.x;
        ball.y = 535;
    }

    // Paddle nach links oder rechts bewegen
    if (cursors.left.isDown) {
        paddle.setVelocityX(-500);
    } else if (cursors.right.isDown) {
        paddle.setVelocityX(500);
    } else {
        paddle.setVelocityX(0);
    }

    // Ball außerhalb des Spielfelds (unten) -> Leben verlieren
    if (ball.y > 600) {
        loseLife(this);
    }

    // Wenn alle Steine zerstört wurden, nächstes Level starten
    if (bricks.countActive() === 0) {
        nextLevel(this);
    }
}

/**
 * Lädt die Daten eines Levels und erstellt die Steine sowie den Hintergrund.
 * @param {Phaser.Scene} scene - Aktuelle Spielszene
 * @param {number} lvl - Index des Levels
 */
function loadLevel(scene, lvl) {
    // Alle vorhandenen Steine entfernen
    bricks.clear(true, true);
    brickHits.clear();

    let lvlData = scene.cache.json.get('level'+(lvl+1));

    // Hintergrundbild des Levels setzen und skalieren
    if (background) {
        background.setTexture(lvlData.background.replace('.png',''));
        background.setDisplaySize(config.width, config.height);
    }

    // Steine aus Daten erzeugen und Trefferanzahl speichern
    lvlData.bricks.forEach(b => {
        let key = 'brick' + b.type;
        let brick = bricks.create(b.x, b.y, key).setOrigin(0.5, 0.5);
        brick.setData('hitsLeft', b.type);
        brick.refreshBody();

        brickHits.set(brick, b.type);
    });

    // Ball und Paddle zurücksetzen
    resetBallAndPaddle(scene);
}

/**
 * Reagiert auf die Kollision Ball-Paddle und ändert die Flugbahn entsprechend.
 * @param {Phaser.Physics.Arcade.Image} ball - Ballobjekt
 * @param {Phaser.Physics.Arcade.Image} paddle - Paddleobjekt
 */
function hitPaddle(ball, paddle) {
    let diff = 0;

    if (ball.x < paddle.x) {
        diff = paddle.x - ball.x;
        ball.setVelocityX(-10 * diff);
    } else if (ball.x > paddle.x) {
        diff = ball.x - paddle.x;
        ball.setVelocityX(10 * diff);
    } else {
        ball.setVelocityX(Phaser.Math.Between(-10, 10));
    }
}

/**
 * Verarbeitet Treffer auf einen Stein: Treffer reduzieren, Stein ggf. entfernen oder visuell anpassen.
 * @param {Phaser.Physics.Arcade.Image} ball - Ballobjekt
 * @param {Phaser.Physics.Arcade.Sprite} brick - Objekt des getroffenen Steins
 */
function hitBrick(ball, brick) {
    let hitsLeft = brick.getData('hitsLeft') - 1;
    brick.setData('hitsLeft', hitsLeft);

    if (hitsLeft <= 0) {
        bricks.killAndHide(brick);
        bricks.remove(brick);
    } else {
        // Textur entsprechend dem verbleibenden Treffer anpassen
        if (hitsLeft === 2) {
            brick.setTexture('brick2');
        } else if (hitsLeft === 1){
            brick.setTexture('brick1');
        }
    }
}

/**
 * Behandelt das Verlieren eines Lebens, aktualisiert Anzeige und setzt Ball/Paddle zurück.
 * @param {Phaser.Scene} scene - Aktuelle Spielszene
 */
function loseLife(scene) {
    lives--;
    livesText.setText('Leben: ' + lives);

    if (lives === 0) {
        showMessage('Game Over', 3000);
        level = 0;
        lives = 3;
        livesText.setText('Leben: ' + lives);
        loadLevel(scene, level);
    } else {
        resetBallAndPaddle(scene);
    }
}

/**
 * Setzt Position und Status von Ball und Paddle zurück, um das Spiel neu zu starten oder fortzusetzen.
 * @param {Phaser.Scene} scene - Aktuelle Spielszene
 */
function resetBallAndPaddle(scene) {
    ball.setVelocity(0);
    ball.setPosition(paddle.x, 535);
    ball.setData('onPaddle', true);
}

/**
 * Lädt das nächste Level oder zeigt Gewinnmeldung an, falls alle Level abgeschlossen sind.
 * @param {Phaser.Scene} scene - Aktuelle Spielszene
 */
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

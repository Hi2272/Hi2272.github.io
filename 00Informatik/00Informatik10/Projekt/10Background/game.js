window.onload = function () {
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

  let balls = [];
  let paddle;
  let cursors;
  let lives = 99;
  let livesText;
  let gameOverText;
  let gameEnded = false;
  let ballLaunched = false;

  let bricks;
  let brickHealth = new Map();
  let brick4Health = new Map(); // NEW: To track hits for brick4

  let currentLevel = 1;
  const maxLevel = 20; // Assuming 21 levels based on asset loading loop

  let bricksRemaining = 0;
  let bricksText;
  let congratsText;
  let levelText;

  // Extra Power Ups
  let powerUp; // Life power-up
  let slowPowerUp; // Slow ball power-up
  let multiPowerUp; // Multi ball power-up
  let sizePowerUp; // Paddle size power-up

  let background;

  // Slowball variables
  let slowActive = false;
  let slowTimer = null;
  let slowText;
  const SLOW_DURATION = 15000;
  const NORMAL_BALL_SPEED = { x: 150, y: -300 };
  const SLOW_BALL_SPEED = { x: 300, y: -400 };

  // Paddle Size PowerUp Timer
  let paddleSizeTimer = null;
  let paddleSizeActive = false;
  let paddleNormalWidth = null;
  let paddleNormalDisplayWidth = null;
  let paddleSizeText;
  const PADDLE_SIZE_DURATION = 15000;

  const game = new Phaser.Game(config);

  function preload() {
    this.load.image('ball', 'assets/ball.png');
    this.load.image('paddle', 'assets/paddle.png');
    for (let i = 1; i <= 7; i++) {
      this.load.image('brick' + i, 'assets/brick' + i + '.png');
    }
    this.load.image('brick8', 'assets/brick8.png'); // NEU: PaddleSize-Brick

    this.load.image('sphere1', 'assets/sphere1.png'); // Life
    this.load.image('sphere2', 'assets/sphere2.png'); // Slow ball
    this.load.image('sphere3', 'assets/sphere3.png'); // Multi ball
    this.load.image('sphere4', 'assets/sphere4.png'); // Paddle size

    for (let lvl = 1; lvl <= maxLevel; lvl++) {
      this.load.json('level' + lvl, 'assets/level' + lvl + '.json');
    }
    for (let i = 1; i <= maxLevel; i++) {
      let s= 'assets/bg' + i + '.png';
      this.load.image('bg' + i,s);
      console.log(s+" geladen!");
    }
  }

  function create() {
    const width = this.sys.game.config.width;
    const height = this.sys.game.config.height;

    background = this.add.image(width / 2, height / 2, 'bg' + currentLevel);
    background.setDisplaySize(width, height);

    paddle = this.physics.add.image(width / 2, height - 100, 'paddle');
    paddle.setImmovable(true);
    paddle.setCollideWorldBounds(true);

    paddleNormalWidth = paddle.width;
    paddleNormalDisplayWidth = paddle.displayWidth;

    balls = []; // Ensure balls array is empty at start of create
    createInitialBall(this);

    cursors = this.input.keyboard.createCursorKeys();

    livesText = this.add.text(10, 10, 'Leben: '+lives.toString(), {
      font: '20px Arial',
      fill: '#ffffff',
    });

    bricksText = this.add.text(10, 40, 'Verbleibende Steine: 0', {
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

    congratsText = this.add.text(width / 2, height / 2, 'Gratulation,\ndu hast das Spiel erfolgreich beendet!', {
      font: '40px Arial',
      fill: '#00ff00',
      fontStyle: 'bold',
      align: 'center',
    });
    congratsText.setOrigin(0.5);
    congratsText.setVisible(false);

    levelText = this.add.text(
      width - 10,
      10,
      'Level ' + currentLevel + ' von ' + maxLevel,
      {
        font: '20px Arial',
        fill: '#ffffff',
      }
    );
    levelText.setOrigin(1, 0);

    slowText = this.add.text(width / 2, height - 48, '', {
      font: '25px Arial',
      fill: '#ffff00',
      fontStyle: 'bold',
      align: 'center',
    });
    slowText.setOrigin(0.5);
    slowText.setVisible(false);

    paddleSizeText = this.add.text(width / 2, height - 80, '', {
      font: '25px Arial',
      fill: '#00aaff',
      fontStyle: 'bold',
      align: 'center',
    });
    paddleSizeText.setOrigin(0.5);
    paddleSizeText.setVisible(false);

    this.input.on('pointerdown', () => {
      if (!ballLaunched && !gameEnded) {
        launchMainBall();
      }
    });
    this.input.keyboard.on('keydown-SPACE', () => {
      if (!ballLaunched && !gameEnded) {
        launchMainBall();
      }
    });
    this.input.on('pointermove', pointer => {
      const paddleHalfWidth = paddle.displayWidth / 2; // Dynamische Breite des Paddles berücksichtigen
      const clampedX = Phaser.Math.Clamp(pointer.x, paddleHalfWidth, width - paddleHalfWidth);
      paddle.x = clampedX;
    });

    powerUp = this.physics.add.image(-100, -100, 'sphere1');
    powerUp.setVelocity(0, 0);
    powerUp.setCollideWorldBounds(true);
    powerUp.setBounce(0.5);
    powerUp.setVisible(false);
    powerUp.body.allowGravity = false;
    this.physics.add.overlap(powerUp, paddle, collectPowerUp, null, this);

    slowPowerUp = this.physics.add.image(-100, -100, 'sphere2');
    slowPowerUp.setVelocity(0, 0);
    slowPowerUp.setCollideWorldBounds(true);
    slowPowerUp.setBounce(0.5);
    slowPowerUp.setVisible(false);
    slowPowerUp.body.allowGravity = false;
    this.physics.add.overlap(slowPowerUp, paddle, collectSlowPowerUp, null, this);

    multiPowerUp = this.physics.add.image(-100, -100, 'sphere3');
    multiPowerUp.setVelocity(0, 0);
    multiPowerUp.setCollideWorldBounds(true);
    multiPowerUp.setBounce(0.5);
    multiPowerUp.setVisible(false);
    multiPowerUp.body.allowGravity = false;
    this.physics.add.overlap(multiPowerUp, paddle, collectMultiPowerUp, null, this);

    sizePowerUp = this.physics.add.image(-100, -100, 'sphere4');
    sizePowerUp.setVelocity(0, 0);
    sizePowerUp.setCollideWorldBounds(true);
    sizePowerUp.setBounce(0.5);
    sizePowerUp.setVisible(false);
    sizePowerUp.body.allowGravity = false;
    this.physics.add.overlap(sizePowerUp, paddle, collectSizePowerUp, null, this);

    loadLevel.call(this, currentLevel);
  }

  //--- Registriere für einen Ball die Collider ---
  function registerBallColliders(scene, ballObj) {
    scene.physics.add.collider(ballObj.sprite, paddle, function (ball, pad) {
      onBallPaddleCollision(ball, pad);
    }, null, scene);

    scene.physics.add.collider(ballObj.sprite, bricks, function (ball, brick) {
      onBallBrickCollision(ball, brick, scene);
    }, null, scene);
  }

  //--- Registriere für ALLE Bälle die Collider (nach Neuladen des Levels) ---
  function registerAllBallColliders(scene) {
    if (!scene) scene = game.scene.keys.default;
    balls.forEach(obj => {
      registerBallColliders(scene, obj);
    });
  }

  function createInitialBall(phaserScene) {
    if (balls.length > 0) {
      balls.forEach(obj => obj.sprite.destroy());
    }
    balls = [];
    let ballSprite = phaserScene.physics.add.image(paddle.x, paddle.y - paddle.height / 2 - 10, 'ball');
    ballSprite.setCollideWorldBounds(true);
    ballSprite.setBounce(1);
    ballSprite.setVelocity(0, 0);
    let obj = { sprite: ballSprite, launched: false };
    balls.push(obj);
    ballLaunched = false;
    registerBallColliders(phaserScene, obj); // <---- Neue Collider nach jedem Leben!
  }

  function update() {
    if (gameEnded) {
      paddle.setVelocityX(0);
      balls.forEach(obj => obj.sprite.setVelocity(0, 0));
      powerUp.setVelocity(0, 0);
      slowPowerUp.setVelocity(0, 0);
      multiPowerUp.setVelocity(0, 0);
      sizePowerUp.setVelocity(0, 0);
      return;
    }

    if (cursors.left.isDown) {
      paddle.setVelocityX(-300);
    } else if (cursors.right.isDown) {
      paddle.setVelocityX(300);
    } else {
      paddle.setVelocityX(0);
    }

    if (!ballLaunched && balls.length > 0) {
      let mainBall = balls[0].sprite;
      mainBall.x = paddle.x;
      mainBall.y = paddle.y - paddle.height / 2 - 10;
      mainBall.setVelocity(0, 0);
    }

    [powerUp, slowPowerUp, multiPowerUp, sizePowerUp].forEach(power => {
      if (power && power.visible) {
        power.setVelocityY(200);
        if (power.y > this.sys.game.config.height - power.height) {
          if (power === powerUp) resetPowerUp();
          if (power === slowPowerUp) resetSlowPowerUp();
          if (power === multiPowerUp) resetMultiPowerUp();
          if (power === sizePowerUp) resetSizePowerUp();
        }
      }
    });

    let removeList = [];
    balls.forEach((obj, i) => {
      if (obj.launched && (obj.sprite.y > this.sys.game.config.height - obj.sprite.height)) {
        removeList.push(i);
      }
    });
    if (removeList.length > 0) {
      for (let j = removeList.length - 1; j >= 0; --j) {
        let idx = removeList[j];
        balls[idx].sprite.destroy();
        balls.splice(idx, 1);
      }
      if (balls.length === 0) {
        loseLife();
      }
    }
  }

  function launchMainBall() {
    if (!balls.length) return;
    balls[0].launched = true;
    ballLaunched = true;
    setBallVelocity(balls[0].sprite);
  }

  function setBallVelocity(ball) {
    let speedObj = slowActive ? SLOW_BALL_SPEED : NORMAL_BALL_SPEED;
    // Set an initial angle slightly randomized to prevent direct vertical bounce
    let initialXVelocity = Phaser.Math.Between(100, 200) * (Math.random() < 0.5 ? 1 : -1); // Random left/right initial direction
    ball.setVelocity(initialXVelocity, speedObj.y);
  }

  function setBallVelocityAngle(ball, angle) {
    let speed = slowActive
      ? Math.sqrt(SLOW_BALL_SPEED.x * SLOW_BALL_SPEED.x + SLOW_BALL_SPEED.y * SLOW_BALL_SPEED.y)
      : Math.sqrt(NORMAL_BALL_SPEED.x * NORMAL_BALL_SPEED.x + NORMAL_BALL_SPEED.y * NORMAL_BALL_SPEED.y);
    ball.setVelocity(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed
    );
  }

  function loseLife() {
    lives--;
    livesText.setText('Leben: ' + lives);

    if (lives > 0) {
      createInitialBall(game.scene.keys.default);
      // Reset power-up states/timers when losing a life to prevent carry-over effects
      clearSlowTimer();
      slowActive = false;
      slowText.setVisible(false);
      clearPaddleSizeTimer();
      resetPaddleSize();
      paddleSizeText.setVisible(false);
    } else {
      gameOver();
    }
  }

  function gameOver() {
    gameEnded = true;
    balls.forEach(obj => obj.sprite.setVelocity(0, 0));
    paddle.setVelocity(0, 0);
    powerUp.setVisible(false); powerUp.setVelocity(0, 0);
    slowPowerUp.setVisible(false); slowPowerUp.setVelocity(0, 0);
    multiPowerUp.setVisible(false); multiPowerUp.setVelocity(0, 0);
    sizePowerUp.setVisible(false); sizePowerUp.setVelocity(0, 0);
    gameOverText.setVisible(true);
    slowText.setVisible(false);
    paddleSizeText.setVisible(false);
    clearSlowTimer();
    clearPaddleSizeTimer();
    resetPaddleSize();
  }

  function loadLevel(levelNumber) {
    if (background) background.setTexture('bg' + levelNumber);

    if (bricks) bricks.clear(true, true); // Destroy existing bricks
    brickHealth.clear();
    brick4Health.clear(); // NEW: Clear brick4 health on new level load

    bricks = game.scene.keys.default.physics.add.staticGroup();

    const width = game.config.width;
    const height = game.config.height;

    const levelKey = 'level' + levelNumber;
    const levelData = game.scene.keys.default.cache.json.get(levelKey).layout;

    const brickWidth = width * 0.09;
    const brickHeight = height * 0.05;
    const offsetTop = height * 0.10;
    const offsetLeft = (width - (brickWidth * levelData[0].length)) / 2;

    bricksRemaining = 0;

    for (let row = 0; row < levelData.length; row++) {
      for (let col = 0; col < levelData[row].length; col++) {
        const brickType = levelData[row][col];
        if (brickType >= 1 && brickType <= 8) {
          const brickX = offsetLeft + col * brickWidth + brickWidth / 2;
          const brickY = offsetTop + row * brickHeight + brickHeight / 2;
          let brickImg = 'brick' + brickType;
          const brick = bricks.create(brickX, brickY, brickImg);

          brick.setDisplaySize(brickWidth * 0.95, brickHeight * 0.9);
          brick.refreshBody();

          brickHealth.set(brick, brickType);
          // NEW: Initialize brick4 specific health
          if (brickType === 4) {
            brick4Health.set(brick, 10); // Brick4 needs 10 hits
          }

          // Brick type 4 is indestructible and doesn't count towards bricksRemaining
          if (brickType !== 4) {
            bricksRemaining++;
          }
        }
      }
    }

    bricksText.setText('Verbleibende Steine: ' + bricksRemaining);

    levelText.setText('Level ' + levelNumber + ' von ' + maxLevel);

    createInitialBall(game.scene.keys.default); // Always create a single ball for new level
    // Ensure all existing ball sprites are removed before creating new one
    // createInitialBall handles this by destroying existing balls first.

    // Reset all power-up states and clear timers when loading a new level
    clearSlowTimer();
    slowActive = false;
    slowText.setVisible(false);

    clearPaddleSizeTimer();
    resetPaddleSize();
    paddleSizeText.setVisible(false);

    resetPowerUp();
    resetSlowPowerUp();
    resetMultiPowerUp();
    resetSizePowerUp();

    registerAllBallColliders(game.scene.keys.default);
  }

  function onBallPaddleCollision(ball, paddle) {
    const relativeIntersectX = ball.x - paddle.x;
    const normalizedIntersectX = relativeIntersectX / (paddle.width / 2);
    const maxBounceAngle = Phaser.Math.DegToRad(75);
    const bounceAngle = normalizedIntersectX * maxBounceAngle;
    const speed = slowActive
      ? Math.sqrt(SLOW_BALL_SPEED.x * SLOW_BALL_SPEED.x + SLOW_BALL_SPEED.y * SLOW_BALL_SPEED.y)
      : Math.sqrt(NORMAL_BALL_SPEED.x * NORMAL_BALL_SPEED.x + NORMAL_BALL_SPEED.y * NORMAL_BALL_SPEED.y);

    ball.body.velocity.x = speed * Math.sin(bounceAngle);
    ball.body.velocity.y = -speed * Math.cos(bounceAngle);
  }

  function onBallBrickCollision(ball, brick, scene) {
    // Reverse ball velocity if it hits the brick from the top/bottom
    // or from the sides. This simplifies collision logic for a simple brick game.
    if (ball.body.velocity.y > 0 && ball.y < brick.y) { // hit from top
      ball.body.velocity.y *= -1;
    } else if (ball.body.velocity.y < 0 && ball.y > brick.y) { // hit from bottom
      ball.body.velocity.y *= -1;
    } else if (ball.body.velocity.x > 0 && ball.x < brick.x) { // hit from left
      ball.body.velocity.x *= -1;
    } else if (ball.body.velocity.x < 0 && ball.x > brick.x) { // hit from right
      ball.body.velocity.x *= -1;
    } else { // general case or corner hit
      ball.body.velocity.y *= -1;
      ball.body.velocity.x *= -1;
    }

    const currentType = brickHealth.get(brick);

    switch (currentType) {
      case 1: // Standard brick, breaks on one hit
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining(scene);
        break;
      case 2: // Two-hit brick
        brickHealth.set(brick, 1);
        brick.setTexture('brick1');
        break;
      case 3: // Three-hit brick
        brickHealth.set(brick, 2);
        brick.setTexture('brick2');
        break;
      case 4: // Indestructible brick (now destructible after 10 hits)
        let hits = brick4Health.get(brick);
        if (hits !== undefined) { // Check if it's a brick4 we are tracking
          hits--;
          if (hits <= 0) {
            brick.disableBody(true, true); // Destroy the brick
            brickHealth.delete(brick);     // Remove from main health map
            brick4Health.delete(brick);    // Remove from brick4 specific health map
            // DO NOT call decrementBricksRemaining(scene) here, as brick4 doesn't count towards total
          } else {
            brick4Health.set(brick, hits); // Update remaining hits
            // Optional: Add visual feedback for hits on brick4 if you have more textures
          }
        }
        break; // Exit switch after handling brick4 collision
      case 5: // Life power-up brick
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining(scene);
        spawnPowerUp(brick.x, brick.y);
        break;
      case 6: // Slow ball power-up brick
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining(scene);
        spawnSlowPowerUp(brick.x, brick.y);
        break;
      case 7: // Multi ball power-up brick
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining(scene);
        spawnMultiPowerUp(brick.x, brick.y);
        break;
      case 8: // Paddle size power-up brick
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining(scene);
        spawnSizePowerUp(brick.x, brick.y);
        break;
      default: // Should not happen, but for safety
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining(scene);
    }
  }

  //////////// LEBEN-POWERUP /////////////
  function spawnPowerUp(x, y) {
    powerUp.setPosition(x, y);
    powerUp.setVelocity(0, 200);
    powerUp.setVisible(true);
  }
  function collectPowerUp(sphere, paddle) {
    resetPowerUp();
    lives++;
    livesText.setText('Leben: ' + lives);
  }
  function resetPowerUp() {
    powerUp.setVisible(false);
    powerUp.setVelocity(0, 0);
    powerUp.x = -100;
    powerUp.y = -100;
  }

  //////////// SLOW-BALL-POWERUP /////////////
  function spawnSlowPowerUp(x, y) {
    slowPowerUp.setPosition(x, y);
    slowPowerUp.setVelocity(0, 200);
    slowPowerUp.setVisible(true);
  }
  function collectSlowPowerUp(sphere, paddle) {
    resetSlowPowerUp();
    activateSlowBall();
  }
  function resetSlowPowerUp() {
    slowPowerUp.setVisible(false);
    slowPowerUp.setVelocity(0, 0);
    slowPowerUp.x = -100;
    slowPowerUp.y = -100;
  }
  function activateSlowBall() {
    if (slowActive) {
      clearSlowTimer(); // Clear existing timer if another slow-powerup is collected
    }
    slowActive = true;
    slowText.setText('Ball beschleunigt! (' + (SLOW_DURATION / 1000).toFixed(0) + 's)');
    slowText.setVisible(true);

    balls.forEach(obj => {
      // Preserve current direction, just change speed
      let v = obj.sprite.body.velocity;
      let angle = Math.atan2(v.y, v.x);
      setBallVelocityAngle(obj.sprite, angle);
    });

    slowTimer = setTimeout(() => {
      slowActive = false;
      slowText.setVisible(false);

      balls.forEach(obj => {
        let v = obj.sprite.body.velocity;
        let angle = Math.atan2(v.y, v.x);
        setBallVelocityAngle(obj.sprite, angle);
      });
    }, SLOW_DURATION);
  }
  function clearSlowTimer() {
    if (slowTimer) {
      clearTimeout(slowTimer);
      slowTimer = null;
    }
  }

  //////////////////// MULTIBALL POWERUP ////////////////////
  function spawnMultiPowerUp(x, y) {
    multiPowerUp.setPosition(x, y);
    multiPowerUp.setVelocity(0, 200);
    multiPowerUp.setVisible(true);
  }
  function collectMultiPowerUp(sphere, paddle) {
    resetMultiPowerUp();
    spawnExtraBall();
  }
  function resetMultiPowerUp() {
    multiPowerUp.setVisible(false);
    multiPowerUp.setVelocity(0, 0);
    multiPowerUp.x = -100;
    multiPowerUp.y = -100;
  }
  function spawnExtraBall() {
    let scene = game.scene.keys.default;
    let newBall = scene.physics.add.image(paddle.x, paddle.y - paddle.height / 2 - 10, 'ball');
    newBall.setCollideWorldBounds(true);
    newBall.setBounce(1);

    // Give the new ball a slightly random upward velocity
    let angle = Phaser.Math.DegToRad(Phaser.Math.Between(200, 340)); // Angle between 200 and 340 degrees (upwards)
    setBallVelocityAngle(newBall, angle);

    let obj = { sprite: newBall, launched: true };
    balls.push(obj);

    registerBallColliders(scene, obj); // <--- IMPORTANT: Register colliders for the new ball
  }

  //////////////// PADDLE SIZE POWERUP ///////////////////
  function spawnSizePowerUp(x, y) {
    sizePowerUp.setPosition(x, y);
    sizePowerUp.setVelocity(0, 200);
    sizePowerUp.setVisible(true);
  }
  function collectSizePowerUp(sphere, paddleSprite) {
    resetSizePowerUp();
    activatePaddleSize();  
  }
  function resetSizePowerUp() {
    sizePowerUp.setVisible(false);
    sizePowerUp.setVelocity(0, 0);
    sizePowerUp.x = -100;
    sizePowerUp.y = -100;
  }
  function activatePaddleSize() {
    clearPaddleSizeTimer(); // Clear existing timer if another paddle-size-powerup is collected
    paddleSizeActive = true;
      paddle.displayWidth = paddleNormalDisplayWidth / 2;
      paddleSizeText.setText("Paddle halb so breit! (" + (PADDLE_SIZE_DURATION / 1000).toFixed(0) + "s)");
    paddleSizeText.setVisible(true);

    // Update the physics body size to match the display size
    paddle.body.setSize(paddle.displayWidth, paddle.body.height, true);

    paddleSizeTimer = setTimeout(function () {
      resetPaddleSize();
      paddleSizeText.setVisible(false);
    }, PADDLE_SIZE_DURATION);
  }
  function resetPaddleSize() {
    paddle.displayWidth = paddleNormalDisplayWidth;
    paddle.body.setSize(paddleNormalDisplayWidth, paddle.body.height, true);
    paddleSizeActive = false;
  }
  function clearPaddleSizeTimer() {
    if (paddleSizeTimer) {
      clearTimeout(paddleSizeTimer);
      paddleSizeTimer = null;
    }
  }

  /////////// LEVEL & SPIELENDE /////////////
  function decrementBricksRemaining(scene) {
    bricksRemaining--;
    bricksText.setText('Verbleibende Steine: ' + bricksRemaining);
    if (bricksRemaining <= 0) {
      // Destroy all balls when level is cleared
      balls.forEach(obj => obj.sprite.destroy());
      balls = [];
      ballLaunched = false;

      if (currentLevel < maxLevel) {
        currentLevel++;
        loadLevel.call(scene, currentLevel); // Load next level
      } else {
        winGame.call(scene); // Player won the game
      }
      // Reset all power-up states and clear timers when advancing level
      slowText.setVisible(false);
      clearSlowTimer();
      slowActive = false;
      paddleSizeText.setVisible(false);
      clearPaddleSizeTimer();
      resetPaddleSize();
    }
  }

  function winGame() {
    gameEnded = true;
    balls.forEach(obj => obj.sprite.setVelocity(0, 0));
    paddle.setVelocity(0, 0);
    powerUp.setVisible(false); powerUp.setVelocity(0, 0);
    slowPowerUp.setVisible(false); slowPowerUp.setVelocity(0, 0);
    multiPowerUp.setVisible(false); multiPowerUp.setVelocity(0, 0);
    sizePowerUp.setVisible(false); sizePowerUp.setVelocity(0, 0);
    congratsText.setVisible(true);
    slowText.setVisible(false);
    paddleSizeText.setVisible(false);
    clearSlowTimer();
    clearPaddleSizeTimer();
    resetPaddleSize();
  }

  // --- HTML Interaction ---
  const startLevelInput = document.getElementById('start-level');
  const startGameButton = document.getElementById('start-game');

  if (startGameButton && startLevelInput) { // Check if HTML elements exist
    startGameButton.addEventListener('click', () => {
      let levelToStart = parseInt(startLevelInput.value, 10);

      // Input validation
      if (isNaN(levelToStart) || levelToStart < 1) {
        levelToStart = 1; // Default to level 1 if input is invalid
      }
      if (levelToStart > maxLevel) {
        levelToStart = maxLevel; // Cap at maxLevel if input is too high
      }

      // Ensure the Phaser scene is active and ready
      if (game.scene.keys.default && game.scene.keys.default.scene.settings.active) {
        const scene = game.scene.keys.default;

        // Reset core game state variables
        gameEnded = false;
        lives = 999; // Reset lives
        livesText.setText('Leben: ' + lives);
        gameOverText.setVisible(false); // Hide game over text
        congratsText.setVisible(false); // Hide congratulations text

        // Clear and reset all active power-up states and their timers/visuals
        clearSlowTimer();
        slowActive = false;
        slowText.setVisible(false);

        clearPaddleSizeTimer();
        resetPaddleSize(); // Reset paddle size to normal
        paddleSizeText.setVisible(false);

        // Reset power-up sprites' positions and visibility (make them disappear from screen)
        resetPowerUp();
        resetSlowPowerUp();
        resetMultiPowerUp();
        resetSizePowerUp();

        // Set the new current level and load it
        currentLevel = levelToStart;
        loadLevel.call(scene, currentLevel); // Call loadLevel with the context of the scene

        // Ensure the ball is not launched immediately
        ballLaunched = false; // createInitialBall (called by loadLevel) also sets this, but for clarity
      } else {
        console.warn("Phaser scene not ready or active. Cannot start new level.");
      }
    });
  } else {
    console.warn("HTML elements 'start-level' or 'start-game' not found. Make sure they are in your HTML.");
  }

}; // End of window.onload block

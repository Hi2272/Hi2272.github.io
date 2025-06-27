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

  let balls = [];
  let paddle;
  let cursors;
  let lives = 3;
  let livesText;
  let gameOverText;
  let gameEnded = false;
  let ballLaunched = false;

  let bricks;
  let brickHealth = new Map();

  let currentLevel = 1;
  const maxLevel = 3;

  let bricksRemaining = 0;
  let bricksText;
  let congratsText;
  let levelText;

  // Extra Power Ups
  let powerUp;
  let slowPowerUp;
  let multiPowerUp;
  let sizePowerUp;

  let background;

  // Slowball variables
  let slowActive = false;
  let slowTimer = null;
  let slowText;
  const SLOW_DURATION = 30000;
  const NORMAL_BALL_SPEED = { x: 150, y: -300 };
  const SLOW_BALL_SPEED = { x: 80, y: -160 };

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

    this.load.image('sphere1', 'assets/sphere1.png');
    this.load.image('sphere2', 'assets/sphere2.png');
    this.load.image('sphere3', 'assets/sphere3.png');
    this.load.image('sphere4', 'assets/sphere4.png');

    for (let lvl = 1; lvl <= maxLevel; lvl++) {
      this.load.json('level' + lvl, 'assets/level' + lvl + '.json');
    }
    for (let i = 1; i <= maxLevel; i++) {
      this.load.image('bg' + i, 'assets/bg' + i + '.png');
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

    balls = [];
    createInitialBall(this);

    cursors = this.input.keyboard.createCursorKeys();

    livesText = this.add.text(10, 10, 'Leben: 3', {
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

    slowText = this.add.text(width/2, height-48, '', {
      font: '25px Arial',
      fill: '#ffff00',
      fontStyle: 'bold',
      align: 'center',
    });
    slowText.setOrigin(0.5);
    slowText.setVisible(false);

    paddleSizeText = this.add.text(width/2, height-80, '', {
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
      paddle.x = Phaser.Math.Clamp(pointer.x, paddle.width / 2, width - paddle.width / 2);
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
    scene.physics.add.collider(ballObj.sprite, paddle, function(ball, pad) {
      onBallPaddleCollision(ball, pad);
    }, null, scene);

    scene.physics.add.collider(ballObj.sprite, bricks, function(ball, brick) {
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
      balls.forEach(obj=>obj.sprite.destroy());
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
      for (let j = removeList.length-1; j >= 0; --j) {
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
    ball.setVelocity(speedObj.x, speedObj.y);
  }

  function setBallVelocityAngle(ball, angle) {
    let speed = slowActive
      ? Math.sqrt(SLOW_BALL_SPEED.x*SLOW_BALL_SPEED.x+SLOW_BALL_SPEED.y*SLOW_BALL_SPEED.y)
      : Math.sqrt(NORMAL_BALL_SPEED.x*NORMAL_BALL_SPEED.x+NORMAL_BALL_SPEED.y*NORMAL_BALL_SPEED.y);
    ball.setVelocity(
      Math.cos(angle)*speed,
      Math.sin(angle)*speed
    );
  }

  function loseLife() {
    lives--;
    livesText.setText('Leben: ' + lives);

    if (lives > 0) {
      createInitialBall(game.scene.keys.default);
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

    if (bricks) bricks.clear(true, true);
    brickHealth.clear();
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

          if (brickType !== 4) {
            bricksRemaining++;
          }
        }
      }
    }

    bricksText.setText('Verbleibende Steine: ' + bricksRemaining);

    levelText.setText('Level ' + levelNumber + ' von ' + maxLevel);

    createInitialBall(game.scene.keys.default);

    clearSlowTimer();
    slowText.setVisible(false);
    slowActive = false;

    clearPaddleSizeTimer();
    resetPaddleSize();
    paddleSizeText.setVisible(false);

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
    const currentType = brickHealth.get(brick);

    switch (currentType) {
      case 1:
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining(scene);
        break;
      case 2:
        brickHealth.set(brick, 1);
        brick.setTexture('brick1');
        break;
      case 3:
        brickHealth.set(brick, 2);
        brick.setTexture('brick2');
        break;
      case 4:
        break;
      case 5:
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining(scene);
        spawnPowerUp(brick.x, brick.y);
        break;
      case 6:
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining(scene);
        spawnSlowPowerUp(brick.x, brick.y);
        break;
      case 7:
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining(scene);
        spawnMultiPowerUp(brick.x, brick.y);
        break;
      case 8:
        brick.disableBody(true, true);
        brickHealth.delete(brick);
        decrementBricksRemaining(scene);
        spawnSizePowerUp(brick.x, brick.y);
        break;
      default:
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
      clearSlowTimer();
    }
    slowActive = true;
    slowText.setText('Ball verlangsamt! (' + (SLOW_DURATION/1000).toFixed(0) + 's)');
    slowText.setVisible(true);

    balls.forEach(obj => {
      let v = obj.sprite.body.velocity;
      let angle = Math.atan2(v.y, v.x);
      setBallVelocityAngle(obj.sprite, angle);
    });

    slowTimer = setTimeout(()=>{
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
    let newBall = scene.physics.add.image(paddle.x, paddle.y - paddle.height/2 - 10, 'ball');
    newBall.setCollideWorldBounds(true);
    newBall.setBounce(1);

    let upAngle = Phaser.Math.Between(-60, 60) * (Math.PI/180);
    setBallVelocityAngle(newBall, upAngle);

    let obj = { sprite: newBall, launched: true };
    balls.push(obj);

    registerBallColliders(scene, obj); // <--- WICHTIG: Damit jeder Ball Collider bekommt!
  }

  //////////////// PADDLE SIZE POWERUP ///////////////////
  function spawnSizePowerUp(x, y) {
    sizePowerUp.setPosition(x, y);
    sizePowerUp.setVelocity(0, 200);
    sizePowerUp.setVisible(true);
  }
  function collectSizePowerUp(sphere, paddleSprite) {
    resetSizePowerUp();
    let makeWider = Phaser.Math.Between(0, 1) === 0;
    activatePaddleSize(makeWider);
  }
  function resetSizePowerUp() {
    sizePowerUp.setVisible(false);
    sizePowerUp.setVelocity(0, 0);
    sizePowerUp.x = -100;
    sizePowerUp.y = -100;
  }
  function activatePaddleSize(doubleWidth) {
    clearPaddleSizeTimer();
    paddleSizeActive = true;
    if (doubleWidth) {
      paddle.displayWidth = paddleNormalDisplayWidth * 2;
      paddle.body.width = paddle.displayWidth;
      paddleSizeText.setText("Paddle doppelt so breit! (" + (PADDLE_SIZE_DURATION/1000).toFixed(0) + "s)");
    } else {
      paddle.displayWidth = paddleNormalDisplayWidth / 2;
      paddle.body.width = paddle.displayWidth;
      paddleSizeText.setText("Paddle halb so breit! (" + (PADDLE_SIZE_DURATION/1000).toFixed(0) + "s)");
    }
    paddleSizeText.setVisible(true);

    paddle.body.setSize(paddle.displayWidth, paddle.body.height, true);

    paddleSizeTimer = setTimeout(function() {
      resetPaddleSize();
      paddleSizeText.setVisible(false);
    }, PADDLE_SIZE_DURATION);
  }
  function resetPaddleSize() {
    paddle.displayWidth = paddleNormalDisplayWidth;
    paddle.body.width = paddleNormalDisplayWidth;
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
      balls.forEach(obj => obj.sprite.destroy());
      balls = [];
      ballLaunched = false;

      if (currentLevel < maxLevel) {
        currentLevel++;
        loadLevel.call(scene, currentLevel);
      } else {
        winGame.call(scene);
      }
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

}
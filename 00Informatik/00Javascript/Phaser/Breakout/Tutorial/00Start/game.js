window.onload = function() {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      backgroundColor: '#000',
      parent: 'game-container',
      scene: {
        preload: preload,
        create: create,
        update: update
      },
    };
  
    const game = new Phaser.Game(config);
  
    function preload() {
      // Hier laden wir später Assets
    }
  
    function create() {
      // Hier bauen wir später die Spielobjekte auf
    }
  
    function update() {
      // Hier kommt später die Spiel-Logik rein
    }
  };
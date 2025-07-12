  <meta charset="utf-8" />
  <title>Breakout</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">

# Breakout-Game Tutorial mit Phaser.io

## Schritt 8: Verschiedene Steintypen mit Lebensenergie

In diesem Schritt erweitern wir unser Spiel um unterschiedliche Steintypen mit verschiedenem Verhalten bei Balltreffern:

- **Typ 1** wird nach einem Treffer zerstört.
- **Typ 2** verwandelt sich nach dem ersten Treffer in Typ 1.
- **Typ 3** verwandelt sich nach dem ersten Treffer in Typ 2.
- **Typ 4** ist unzerstörbar.

---

### 8.1 Level-Datei anpassen: `assets/level2.json`

Erstelle eine neue Level-Datei `level2.json` im `assets`-Ordner mit der Angabe der Steintypen als Zahlen:

```json
{
  "layout": [
    [0,0,0,4,4,4,0,0,0],
    [0,3,3,3,3,3,3,3,0],
    [2,2,2,2,2,2,2,2,2],
    [0,1,1,1,1,1,1,1,0],
    [0,0,0,1,1,1,0,0,0]
  ]
}
```
### 8.2 Code-Anpassungen in `game.js`
### 8.2.1 Neue Variablen

Die Variable **bricks** soll eine Referenz auf alle Bricks im Spielfeld halten.  
Die Anzahl der Leben eines Bricks speichern wir in einer sogenannten **Map**. In diesem Datentyp kann ich Schlüsseln (hier: bricks) Werte (hier: Zahl der Leben des Bricks) zuordnen.

```js
let bricks;
let brickHealth = new Map();
```


### 8.2.2 Laden der Bricks


Im `preload()` laden wir alle vier Brick-Bilder mit Hilfe einer Zählschleife.

```js
function preload() {
  ...
  // Neu: Mehrere Brick-Sprites laden
  for (let i = 1; i <= 4; i++) {
    this.load.image('brick' + i, 'assets/brick' + i + '.png');
  }
// Neu: Neues Level laden
  this.load.json('level2', 'assets/level2.json');
}
```
### 8.2.3 Erzeugen der Bricks

Die Größe und Position der Bricks auf dem Spielfeld wird automatisch aus den Maßen des Spielfeldes berechnet.  
Außerdem wird die Funktion **ballPaddleCollision** registriert, so dass sie bei eine Kollision von Ball und Brick aufgerufen wird.

```js
function create() {
  ...
  // Neu: Gruppe für Steine initialisieren
  bricks = this.physics.add.staticGroup();

  // Neu: Level-Daten aus JSON laden
  const levelData = this.cache.json.get('level2').layout;

  // Neu: Maße und Positionierung der Steine berechnen
  const brickWidth = width * 0.09;
  const brickHeight = height * 0.05;
  const offsetTop = height * 0.10;
  const offsetLeft = (width - (brickWidth * levelData[0].length)) / 2;

  // Neu: Steine mit Typ aus Level laden
  for (let row = 0; row < levelData.length; row++) {
    for (let col = 0; col < levelData[row].length; col++) {
      const brickType = levelData[row][col];
      if (brickType >= 1 && brickType <= 4) {
        const brickX = offsetLeft + col * brickWidth + brickWidth / 2;
        const brickY = offsetTop + row * brickHeight + brickHeight / 2;
        const brick = bricks.create(brickX, brickY, 'brick' + brickType);

        brick.setDisplaySize(brickWidth * 0.95, brickHeight * 0.9);
        brick.refreshBody();

        // Neu: Typ in Map speichern
        brickHealth.set(brick, brickType);
      }
    }
  }

  // Neu: Collider für Ball und Steine hinzufügen
  this.physics.add.collider(ball, bricks, ballBrickCollision, null, this);

  // Unveränderter Collider für Ball und Paddle 
  this.physics.add.collider(ball, paddle, ballPaddleCollision, null, this);
}
``` 
### 8.2.4 Funktion zur Kollisionsverarbeitung

In der Funktion wird der Typ des Bricks aus der Map ausgelesen. Abhängig von seinem Typ reagiert der Brick unterschiedlich auf die Kollision.  
Wenn du weitere Bricktypen erzeugst, musst du ihr Verhalten an dieser Stelle einprogrammieren.  

```js
function ballBrickCollision(ball, brick) {
  // Neu: aktueller Typ aus Map
  const currentType = brickHealth.get(brick);

  switch(currentType) {
    case 1:
      // Typ 1: Stein sofort zerstören
      brick.disableBody(true, true);
      brickHealth.delete(brick);
      break;
    case 2:
      // Typ 2: wird zu Typ 1
      brickHealth.set(brick, 1);
      brick.setTexture('brick1');
      break;
    case 3:
      // Typ 3: wird zu Typ 2
      brickHealth.set(brick, 2);
      brick.setTexture('brick2');
      break;
    case 4:
      // Typ 4: unzerstörbar, keine Änderung
      break;
    default:
      // Fallback: Stein zerstören
      brick.disableBody(true, true);
      brickHealth.delete(brick);
  }
}
```
---

### 8.3 Live-Test

<iframe 
  src="07BrickTypen/index.html" 
  width="820" 
  height="700" 
  frameborder="0" 
  sandbox="allow-scripts allow-same-origin">
</iframe>
---

### Dateien

[Zip-Datei](07Bricktypen.zip)    

---  

### [weiter](08Level.html)  

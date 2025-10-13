  <meta charset="utf-8" />
  <title>Breakout</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">

# Breakout-Game Tutorial mit Phaser.io

## Schritt 7: Steine - Bricks 

Jetzt erweitern wir unser Spiel um Steine (Bricks), von denen der Ball abprallt. Wird ein Brick vom Ball getroffen, verschwindet dieser Brick. 

Die Brick-Anordnung wird in einer Datei `assets/level1.json` abgelegt.

---

### 7.1 Level-Datei: `assets/level1.json`

Erstelle im Ordner `assets` eine neue Datei `level1.json` mit folgendem Inhalt:

```json
{
  "layout": [
    [0,0,0,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,0],
    [0,0,0,1,1,1,0,0,0]
  ]
}
```
**json** steht für **J**ava**S**cript**O**bject**N**otation. Dieses Dateiformat ist ein Standard, der im Internet häufig für die Speicherung von Daten verwendet wird.  
Unsere json-Datei enthält ein Feld mit dem Namen **layout**, in dem der Aufbau des Levels gespeichert ist.  
 `1` steht für einen Brick und `0` für leeren Raum.

---

### 7.2 Code-Anpassungen in `game.js`
### 7.2.1 Variablen

  Wir erzeugen eine Variable **bricks**, die die gesamte Gruppe der Brick speichert.
```js

let bricks; // Gruppe für Bricks
```
### 7.2.2 Preload der Levels und Bricks

Das Bild des ersten Bricks (brick1) wird wieder in den Speicher geladen.  
  Außerdem laden wir die Level-Daten aus der json-Datei und belegen sie mit der Referenz "level1".
  
```js
  function preload() {
    ...
    this.load.image('brick1', 'assets/brick1.png');
    this.load.json('level1', 'assets/level1.json');  // Level laden
  }
```
### 7.2.3 Create bricks

  Die Steine werden als statische Gruppe, d.h. als Gruppe von unbeweglichen Objekten eingefügt. Dies erleichtert dem System das Erkennen von Kollisionen des Balls mit den Steinen.

 Das Feld **layout** wird aus den json-Daten ausgelesen und mit der Refernz levelData versehen.  
 Anschließend werden die Höhe und Breite der Steine festgelegt und sie in zwei Schleifen in die **bricks**-Gruppe eingefügt und auf dem Bildschirm dargestellt. Die Größe der Steine wird dabei an die Bildschirmgröße angepasst.

  Bei der Kollision des Balls mit einem Brick soll die Funktion **ballBrickCollision**  aufgerufen werden. 


```js

  function create() {
    ...

    // Bricks-Gruppe erstellen
    bricks = this.physics.add.staticGroup();

    // Level-Daten aus JSON holen
    const levelData = this.cache.json.get('level1').layout;

    // Relative Größen und Positionen der Bricks
    const brickWidth = width * 0.09;    // 9% der Gesamtbreite
    const brickHeight = height * 0.05;  // 5% der Gesamthöhe
    const offsetTop = height * 0.10;    // 10% Abstand von oben
    const offsetLeft = (width - (brickWidth * levelData[0].length)) / 2; // horizontal zentrieren
  
    for (let row = 0; row < levelData.length; row++) {
      for (let col = 0; col < levelData[row].length; col++) {
        if (levelData[row][col] === 1) {
          const brickX = offsetLeft + col * brickWidth + brickWidth / 2;
          const brickY = offsetTop + row * brickHeight + brickHeight / 2;
          const brick = bricks.create(brickX, brickY, 'brick1');
  
          // Brick-Größe anpassen (Skalierung), falls das Bild eine andere Größe hat
          brick.setDisplaySize(brickWidth*0.95, brickHeight*0.9);
          brick.refreshBody();
        }
      }
    }

    // Kollision Paddle - Ball
    this.physics.add.collider(ball, paddle, ballPaddleCollision, null, this);

    // Kollision Ball - Bricks
    this.physics.add.collider(ball, bricks, ballBrickCollision, null, this);
  }
```

### 7.2.4 Kollision Ball-Brick
  In dieser Funktion wird der Brick deaktiviert (`disableBody` mit `true, true` verbirgt und deaktiviert den Brick). Der Ball prallt automatisch ab, da wir eine Kollision erkannt haben.


```js

  // Neue Funktion: Ball trifft Brick
  function ballBrickCollision(ball, brick) {
    brick.disableBody(true, true);
  
  }


```

---


---

### 7.3 Live-Test

<iframe 
  src="06Bricks/index.html" 
  width="820" 
  height="700" 
  frameborder="0" 
  sandbox="allow-scripts allow-same-origin">
</iframe>

---
### Dateien

[Zip-Datei](06Bricks.zip)

---

### [weiter](07Bricktypen.html)  

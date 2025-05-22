# Breakout-Game Tutorial mit Phaser.io

## Schritt 11: Unterschiedliche Hintergründe pro Level

In diesem Schritt erweitern wir das Spiel um verschiedene Hintergrundbilder, die je nach aktuellem Level automatisch geladen und angezeigt werden. 

---

### 11.1 Vorbereitung

- Lege im Ordner `assets` drei Hintergrundbilder an:
  - `bg1.png` für Level 1
  - `bg2.png` für Level 2
  - `bg3.png` für Level 3

Die Bilder sollten idealerweise die Spielfeldgröße von `800x600` Pixeln haben oder in Phaser so skaliert werden, dass sie den ganzen Spielbereich ausfüllen.

---

### 11.2 Code-Erweiterungen in `game.js`

Wir passen den Preload-Prozess an, sodass die Hintergründe per Schleife geladen werden, und fügen eine Variable für den aktuellen Hintergrund-Sprite hinzu. Beim Laden eines Levels wird dann der jeweilige Hintergrund angezeigt.

#### 11.2.1 Variablendeklaration erweitern

```js
let background;
```

#### 11.2.2 Preload: Hintergründe mit Schleife laden

Ersetze im `preload`-Abschnitt das Laden der Hintergründe durch eine Schleife:

```js
function preload() {
  this.load.image('ball', 'assets/ball.png');
  this.load.image('paddle', 'assets/paddle.png');
  for (let i = 1; i <= 5; i++) {
    this.load.image('brick' + i, 'assets/brick' + i + '.png');
  }
  this.load.image('sphere1', 'assets/sphere1.png');

  // Lade Level-Dateien
  for (let lvl = 1; lvl <= maxLevel; lvl++) {
    this.load.json('level' + lvl, 'assets/level' + lvl + '.json');
  }

  // Lade Hintergründe per Schleife
  for (let i = 1; i <= maxLevel; i++) {
    this.load.image('bg' + i, 'assets/bg' + i + '.png');
  }
}
```

#### 11.2.3 Hintergrund beim Spielstart erstellen

Im `create()`-Abschnitt legen wir den Hintergrundsprite an und skalieren ihn so, dass er den Spielbereich komplett ausfüllt:

```js
function create() {
  const width = this.sys.game.config.width;
  const height = this.sys.game.config.height;

  // Hintergrund erstellen, anfangs Level 1
  background = this.add.image(width / 2, height / 2, 'bg' + currentLevel);
  background.setDisplaySize(width, height);
  
  // ... restlicher create() Code unverändert
```

#### 11.2.4 Hintergrund beim Levelwechsel aktualisieren

Im `loadLevel()`-Funktion fügen wir vor dem Laden der Steine folgenden Code ein, um den Hintergrund zu aktualisieren:

```js
function loadLevel(levelNumber) {
  if (background) {
    background.setTexture('bg' + levelNumber);
  }

  // ... bestehender loadLevel Code
}
```

---

### 11.3 Live-Test

<iframe 
  src="10Background/index.html" 
  width="820" 
  height="700" 
  frameborder="0" 
  sandbox="allow-scripts allow-same-origin">
</iframe>

---
### Dateien
[Zip-Datei](10Background.zip)
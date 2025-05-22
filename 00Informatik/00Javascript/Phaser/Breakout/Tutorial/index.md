# Breakout-Game Tutorial mit Phaser.io

In diesem Tutorial lernst du Schritt für Schritt, wie du ein einfaches Breakout-Game mit HTML, CSS und JavaScript unter Verwendung des Phaser.io Frameworks erstellst.
---

## Vorbereitung: Installation der Entwicklungsumgebung
Für den Test von HTML-, CSS- und Javascript-Dateien benötigst du in der Regel einen Webserver, der diese Seiten hostet. Anschließend kannst du sie mit einem Internetbrowser anzeigen lassen.    
Die Entwicklungsumgebung **VisualStudioCode** bietet eine Live-Server-Erweiterung, mit der dieses Problem elegant umgangen werden kann:
1. Installiere die Software [VisualStudioCode](https://code.visualstudio.com/Download).
2. Starte VSCode und installiere die Erweiterung **Live Server**.
3.  Wenn du jetzt mit der rechten Maustaste auf eine HTML-Datei klickst, kannst du sie vom Live Server lokal hosten lassen.   
VSCode startet dann automatisch einen Webbrowser und zeigt die Datei an.   
Änderungen an der Datei werden in der Regel automatisch vom Live Server verarbeitet.

---

## Schritt 1: Projektgrundlage einrichten (HTML, CSS, JS)

Zu Beginn erstellen wir die grundlegenden Dateien, die wir später für unser Spiel brauchen:

- `index.html`
- `style.css`
- `game.js`

---

### 1.1 HTML-Datei: `index.html`

Unsere HTML-Datei bindet Phaser.io ein, lädt die CSS-Datei und unser JavaScript-Game-Script.

```html
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Breakout mit Phaser.io</title>
    <link rel="stylesheet" href="style.css" />
    <!-- Phaser 3 CDN -->
    <script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
</head>
<body>
    <h1>Breakout-Game mit Phaser.io</h1>
    <div id="game-container"></div>

    <script src="game.js"></script>
</body>
</html>
```
### Erläuterungen zum Code
#### `<script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>`  
Diese Zeile lädt die Phaser-3-Bibliothek von einem Server aus dem Internet. Unser eigenes Spiel-Skript kann damit alle Methoden verwenden, die in dieser Bibliothek definiert wurden.

#### ` <div id="game-container"></div>`  
In diesem Bereich wird das Spielfeld automatisch eingefügt.  

#### `<script src="game.js"></script> `  
Die Javascript-Datei **game.js** enthält den Code für unser Spiel.

---

### 1.2 CSS-Datei: `style.css`

Wir geben dem Body eine helle Hintergrundfarbe und stellen die Größe des Spielbereichs ein. 

```css
body {
    margin: 0;
    padding: 0;
    background-color: #222;
    color: #fff;
    font-family: Arial, sans-serif;
    text-align: center;
}

#game-container {
    margin: 20px auto;
    width: 800px;
    height: 600px;
    border: 2px solid white;
}
```

---

### 1.3 JavaScript-Datei: `game.js`

In dieser Datei programmieren wir den gesamten Code des Spieles. Derzeit stellt es nur ein leeres Spiel-Fenster mit einer Breite von 800, einer Höhe von 600 Pixel und einem schwarzen Hintergrund dar.

```js
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
```
### Erläuterungen zum Code

Phaser verwendet in jedem Spiel-Szenario (Scene) drei zentrale Methoden, um das Spiel zu steuern:

### 1. `preload()`

Hier werden Assets wie Bilder, Sounds oder Sprite-Sheets geladen, bevor das Spiel startet. Dies stellt sicher, dass alle benötigten Dateien bereit sind, sobald das Spiel beginnt.

---

### 2. `create()`

Hier werden Spielobjekte erstellt und initialisiert — z.B. der Ball, die Steine oder das Paddle. Die Funktion wird direkt nach dem erfolgreichen Laden aller Assets in `preload()` aufgerufen und bereitet die Szene für das eigentliche Spiel vor.

---

### 3. `update()`

Hier läuft die eigentliche Spielmechanik ab. Die `update()`-Funktion wird viele Male pro Sekunde aufgerufen und aktualisiert die Darstellung. Sie stellt die zentrale "Spielschleife" - den game-loop dar.
## Nächster Schritt

Im nächsten Tutorial-Schritt fügen wir den Paddle und Ball zum Spiel hinzu und machen diese bewegbar.

### Live-Test

<iframe 
  src="00Start/index.html" 
  width="820" 
  height="700" 
  frameborder="0" 
  sandbox="allow-scripts allow-same-origin">
</iframe>


---

### Dateivorlagen (Rechte Maustaste, Link speichern unter)  

[index.html](00Start/index.html)    
[style.css](00Start/style.css)  
[game.js](00Start/game.js)  

---

### [Weiter](01ball.html)  

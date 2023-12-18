 <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">

# p5.js
## Der p5-Web-Editor
Quelle: [TheCodingTrain](https://thecodingtrain.com/tracks/code-programming-with-p5-js/code/1-intro/2-web-editor)  
p5.js ist eine Javascript-Bibliothek, mit der Grafiken programmiert werden können.  
Unter [https://editor.p5js.org](https://editor.p5js.org)   kann ein Web-Editor aufgerufen werden, in dem der Code direkt ausgeführt wird.  
Zum Speichern und Veröffentlichen von Code muss sich der Nutzer auf der Seite mit einer E-Mail-Adresse registrieren.  
## p5.js in eine Webseite einbinden
p5.js kann in jedes HTML-Element eingebunden werden. Folgende HTML-Datei definiert hierfür ein DIV-Element:
```HTML
<html>
<head>
  <title>P5.js Demo</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.js"></script>
  <script src="p5jsDemo.js"></script>
</head>
<body>
  <h1>P5.js in HMTL</h1>
  <div id="p5js"></div>
</body>
</html>
```
### Erläuterungen zum Code
``` HTML
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.js"></script>
```
 fügt die p5.js-Bibliothek zur Seite hinzu.  
``` HTML
<script src="p5jsDemo.js"></script>
```
 ruft das eigentliche Skript auf.
 ### Javascript-Datei  
``` Javascript
function setup() {
    var canvas = createCanvas(400, 400);
    canvas.parent('p5js');
  }

  function draw() {
    background(127);
    stroke("white");
    line(0,0,400,400);

  }
  ```
  **canvas.parent('p5js');** sorgt dafür, dass das p5js-Objekt in der DIV mit der id "p5js" eingebunden wird.

    



## Mausereignisse in p5.js
```JavaScript
function mousePressed() {
  for (let i = 0; i < objekte.length; i++) {
    objekte[i].clicked(mouseX, mouseY);
  }
}
```
p5.js stellt eine globale Methode **mousePressed()** zur Verfügung, die ausgelöst wird, sobalb der Nutzer auf das p5.js-Canvas Objekt klickt. Diese Methode kann mit eigenem Code überschrieben werden. 
Die Variablen **mouseX** und **mouseY** enthalten die Koordinaten der Maus.  
In diesem Beispiel werden bei einem Mausklick für alle Objekte im Array **objekte** die Methode **clicked(x,y)** aufgerufen. In dieser Methode muss jetzt jeweils überprüft werden, ob die Koordinaten des Mausklicks im Inneren des Objekts liegen.  





[zurück](../index.html)

  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 
 # Minesweeper

### 3. Die Klasse Mine

Damit die Mine beim Linksklick explodiert, musst du eine Methode **public void onMouseDown(double x, double y, int key) {** erstellen.  
Diese Methode wird beim Mausklick aufgerufen. Die Parameter werden automatisch mit Werten gefüllt:  
- x,y: Koordinaten des Mauszeigers
- key: Maustaste, die geklickt wurde:  
  - 0: Links
  - 1: Mitte
  - 2: Rechts

In dieser Methode soll folgender Algorithmus ablaufen:  
Wenn die linke Taste geklickt wurde,  
- dann soll die Methode **setFillColor(Color.red);** aufgerufen werden.  
- Anschließend soll eine Schleife alle Kacheln durchlaufen und immer dann, wenn eine Mine vorliegt, ihre Füllfarbe auf rot setzen.  
- Zum Schluss soll mit **TextField t = new TextField(100, 100, 400, 50, "GAME OVER");** das Spielende angezeigt und mit **stopActing();** das Spiel beendet werden.  

Wenn die rechte Maustaste geklickt wurde, soll geprüft werden, ob das Attribut **markiert** false ist.  
-  Wenn das der Fall ist, werden die Füllfarbe der Kachel auf orange und das Attribut **markiert** auf true gesetzt.
-  Sonst wird die Füllfarbe auf **lightgrey** und **markiert** auf false gesetzt.
   
 
<section>
   <iframe
    srcdoc="<script>window.jo_doc = window.frameElement.textContent;</script><script src='https://Hi2272.github.io/include/js/includeide/includeIDE.js'></script>"
    width="100%" height="600" frameborder="0">
    {'id': 'Java', 'speed': 'max', 
    'withBottomPanel': true ,'withPCode': false ,'withConsole': true ,
    'withFileList': true ,'withErrorList': true}
    <script id="javaCode" type="plain/text" title="Mine.java" src="03Mine.java"></script>
    <script id="javaCode" type="plain/text" title="Platte.java" src="03Platte.java"></script>
    <script id="javaCode" type="plain/text" title="Kachel.java" src="Kachel.java"></script>
    <script id="javaCode" type="plain/text" title="Spielfeld.java" src="Spielfeld.java"></script>
    
  
  </script>
  
   </iframe>
</section>

 [weiter](07Platte.html)
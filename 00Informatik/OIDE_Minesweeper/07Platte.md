  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 
 # Minesweeper

### 4. Die Klasse Platte
#### onMouseDown
Die Platte soll durch Linksklick aufgedeckt werden. Wir benötigen also wieder die Methode **public void onMouseDown(double x, double y, int key)**.  

Du kannst sie direkt aus der Klasse Mine kopieren und musst nur eine Kleinigkeit ändern:  
- Beim Linksklick soll die Methode **aufdecken()** aufgerufen werden.
-  Beim Rechtsklick wird sie genauso markiert wie eine Mine.  
#### aufdecken
In der Methode aufdecken soll diese Sequenz umgesetzt werden:  
1. Wenn das Attribut **aufgedeckt** falsch ist,
   1. soll das Attribut auf wahr gesetzt werden und 
   2. ein Textfeld erzeugt werden, das die Zahl der Nachbarn anzeigt:  
       TextField t = new TextField(x * breite, y * hoehe, breite - 3, 30, String.valueOf(nachbarn));
   3. Wenn die Zahl der Nachbarn größer null ist, 
     1. soll die Textfarbe von t auf gelb gesetzt werden:    
        **t.setFillColor(Color.yellow, 0.3);**
      
   4. Sonst soll die Textfarbe von t auf grün gesetzt werden:  
        **t.setFillColor(Color.green, 0.3);**
     
   
     Und die Nachbarzellen sollen aufgedeckt werden:
  ```C++
        for (int i = -1; i <= 1; i++) {
               if(feld.isInGrid(x + i, y - 1)) { feld.getKachel(x + i, y - 1).aufdecken(); }
               if(feld.isInGrid(x + i, y + 1)) { feld.getKachel(x + i, y + 1).aufdecken(); }
            }
            if(feld.isInGrid(x - 1, y)) { feld.getKachel(x - 1, y).aufdecken(); }
            if(feld.isInGrid(x + 1, y)) { feld.getKachel(x + 1, y).aufdecken(); }
  ```
      Analysiere diesen Code. Welche Zellen werden nacheinander aufgedeckt?  

<section>
   <iframe
    srcdoc="<script>window.jo_doc = window.frameElement.textContent;</script><script src='https://Hi2272.github.io/include/js/includeide/includeIDE.js'></script>"
    width="100%" height="600" frameborder="0">
    {'id': 'Java', 'speed': 'max', 
    'withBottomPanel': true ,'withPCode': false ,'withConsole': true ,
    'withFileList': true ,'withErrorList': true}
    <script id="javaCode" type="plain/text" title="Platte.java" src="03Platte.java"></script>
    <script id="javaCode" type="plain/text" title="Kachel.java" src="Kachel.java"></script>
    <script id="javaCode" type="plain/text" title="Spielfeld.java" src="Spielfeld.java"></script>
    <script id="javaCode" type="plain/text" title="Mine.java" src="Mine.java"></script>
  
  
  </script>
  
   </iframe>
</section>

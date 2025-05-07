  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 
 # Minesweeper

### 3. Erstelle die Klasse Spielfeld II

  <section>
    <iframe
    srcdoc="<script>window.jo_doc = window.frameElement.textContent;</script><script src='https://Hi2272.github.io/include/js/includeide/includeIDE.js'></script>"
    width="100%" height="600" frameborder="0">
    {'id': 'Java', 'speed': 2000, 
    'withBottomPanel': true ,'withPCode': false ,'withConsole': true ,
    'withFileList': true ,'withErrorList': true}
    <script id="javaCode" type="plain/text" title="Spielfeld.java" src="04Spielfeld.java"></script>
    <script id="javaCode" type="plain/text" title="Kachel.java" src="03Kachel.java"></script>
  <script id="javaCode" type="plain/text" title="Platte.java" src="03Platte.java"></script>
  <script id="javaCode" type="plain/text" title="Mine.java" src="03Mine.java"></script>
  
  </script>

   </iframe>
</section>

#### Konstruktor
1. In einer weiteren Schleife sollen die leeren Kacheln mit Platten initialisiert werden. 
2.  Als letztes wird diese Schleife eingefügt:
```C++
    for (int i = 0; i < kachel.length; i++) {
         if(kachel[i] instanceof Platte) {
            kachel[i].setNachbarn(anzNachbarn(i));
         }
      }
  ```
3. Erläutere diese Schleife
#### Methoden
1.  **isInGrid(x,y)**  
   Die Methode soll wahr zurückgeben, wenn sich x und y innerhalb der Grenzen des Gitters befinden. x muss also größer gleich 0 und kleiner als die Zahl der spalten sein. y muss analog größer als 0 und kleiner als die Zahl der zeilen sein.
   
2.  **getKachel-Methoden**  
Programmiere drei Methoden mit dem gleichen Namen, die sich in ihren Parametern unterscheiden:  
a) int nr: gibt die Kachel mit dem Index nr zurück.  
b) int x, int y: gibt die Kachel in der Spalte x und der Zeile y zurück. Hierzu muss die Nummer dieser Kache berechnet werden.  
c) ohne Parameter: gibt das gesamte Feld **kachel** zurück.

3.  **isMine(int x, int y)**  
Die Methode soll wahr zurückgeben, wenn x und y im Gitter liegen und die Kachel eine Mine ist.
4. **getNachbarn(int nr)**  
   Setze dieses Struktogramm um:  
   ![alt text](StruktugrammNachbarn.png)

Teste das Programm - das Spielfeld müsste jetzt vollständig aufgebaut werden.


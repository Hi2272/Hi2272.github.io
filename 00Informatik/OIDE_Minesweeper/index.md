  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 
 # Minesweeper
## Spielprinzip
Die Versionen 3.1 bis 7 von Microsoft Windows enthielten das Spiel Minesweeper:  
  ![alt text](2025-03-29_17-03.png)


Das Spielprinzip kannst du hier nachvollziehen, ggf. musst du Code-Reset anklicken.
  
  <section>
   <iframe
    srcdoc="<script>window.jo_doc = window.frameElement.textContent;</script><script src='https://Hi2272.github.io/include/js/includeide/includeIDE.js'></script>"
    width="100%" height="600" frameborder="0">
    {'id': 'Java', 'speed': 'max', 
    'withBottomPanel': false ,'withPCode': false ,'withConsole': true ,
    'withFileList': false ,'withErrorList': false}
    <script id="javaCode" type="plain/text" title="Hilfe.java" src="Hilfe.java"></script>
    <script id="javaCode" type="plain/text" title="Kachel.java" src="Kachel.java"></script>
    <script id="javaCode" type="plain/text" title="Spielfeld.java" src="Spielfeld.java"></script>
    <script id="javaCode" type="plain/text" title="Platte.java" src="Platte.java"></script>
    <script id="javaCode" type="plain/text" title="Mine.java" src="Mine.java"></script>
  
  
  </script>
  
   </iframe>
</section>

## Aufgabenstellung

Erstelle Sequenzdiagramme für folgende Fälle:
1. Rechtsklick auf eine Kachel (k:Kachel) [Lsg](SequenzRechts.html)
2. Linksklick auf eine Mine (m: Mine, s:Spielfeld) [Lsg](SequenzMine.html)
3. Linksklick auf eine Platte 
   1. mit benachbarten Minen (p:Platte) [Lsg](SequenzLinksPlatte.html)
   2. ohne benachbarte Minen (p:Platte, nachbarn: Platte[]) [Lsg](SequenzLinksPlatteLeer.html)  

| [zurück](../index.html) | [weiter](01Klassendiagramm.html) | 
| --- | ---- |

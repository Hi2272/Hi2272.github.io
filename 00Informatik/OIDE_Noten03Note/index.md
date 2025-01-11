  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 
 # Eine Notenverwaltung
## 5. Methoden für die Berechnung der Gesamtnote

### 1. Berechnung des Mittelwertes des Faches.
1. Um den Mittelwert zu berechnen, müssen wir zunächst festlegen, ob der Schnitt der großen LN einfach oder doppelt gewichtet wird.  

-  Deklariere ein Attribut **gewichtung** vom Typ **int**.
-  Erweitere die Parameterliste des Konstruktors um einen Parameter **gewichtung**.
-  Initialisiere das Attribut **gewichtung** im Konstruktor.
2. Erstelle eine Methode **getGesMw()** und setze folgendes Struktogramm um:  
  ![alt text](StruktogrammGesMW.png)  
### 2. Berechnung der Note
Erstelle eine Methode **getNote()** vom Typ **int**, die folgendes Struktogramm umsetzt:  
     ![alt text](StruktogrammNote.png)  

<div id="quelle" style="font-size: x-small; text-align: right;">
    2025 Rainer Hille  Unter Verwendung der  <a href='https://www.online-ide.de/'>Online-IDE von Martin Pabst</a><br>Hinweis: Der Code-Editor muss erst geladen werden. Klicke ggf. auf <b>Code Reset</b> um den Programmcode neu zu laden.

  </div>
  
  <section>
    <iframe
    srcdoc="<script>window.jo_doc = window.frameElement.textContent;</script><script src='https://Hi2272.github.io/include/js/includeide/includeIDE.js'></script>"
    width="100%" height="600" frameborder="0">
    {'id': 'Java', 'speed': 2000, 
    'withBottomPanel': true ,'withPCode': false ,'withConsole': true ,
    'withFileList': true ,'withErrorList': true}
    <script id="javaCode" type="plain/text" title="Fach.java" src="Fach.java"></script>
    <script id="javaCode" type="plain/text" title="Schueler.java" src="Schueler.java"></script>
  </script>
   </iframe>
</section>



[zurück](../OIDE_Noten03Noten/index.html)  
[Index](../index.html)
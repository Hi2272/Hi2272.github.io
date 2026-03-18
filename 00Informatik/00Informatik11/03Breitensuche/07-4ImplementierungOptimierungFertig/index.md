  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 

# Breitensuche
## Optimierung der Implementierung

Damit die Breitensuche schneller abläuft, soll jeder Knoten seinen Index speichern.  
1. Erstelle ein Attribut **index** in der Klasse Knoten.
2. Füge dem Konstruktor einen Parameter **index** hinzu.
3. Initialisiere das Attribut **index** im Konstruktor mit dem Wert des Parameters.
4. Passe die Aufrufe des Konstruktors in der Klasse **Main** so an, dass die Index-Werte mitgegeben werden.
5. Passe die Methode **breitensuche** in der Klasse **Graph** so an, dass die Methode getIndex des Knotens verwendet wird.


6. Wandele das Attribut **queue** in eine lokale Variable um, die im Rumpf der Methode **breitenSuche** deklariert und initialisiert wird. 
7. Lösche den Methodenaufruf zum Leeren der queue. 


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
    <script id="javaCode" type="plain/text" title="Knoten.java" src="Knoten.java"></script>
    <script id="javaCode" type="plain/text" title="Graph.java" src="Graph.java"></script>
    <script id="javaCode" type="plain/text" title="Main.java" src="Main.java"></script>
  </script>
   </iframe>
</section>

## [Index](../../../index.html)


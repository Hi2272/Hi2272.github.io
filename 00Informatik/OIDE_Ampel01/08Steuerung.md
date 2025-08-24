  <meta charset="utf-8" />
  <title>AmpelSteuerung</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 
 # Die Steuerung
## Attribute
 Die Steuerung benötigt 3 Attribute:
 1. Eine Referenz **anlage** auf die Ampelanlage, die sie steuert.
 2. Ein Feld **vAmpeln** für die Verkehrsampeln dieser Anlage.
 3. Ein Feld **fAmpeln** für die Fußgängerampeln dieser Anlage.
## Konstruktor
Der Konstruktor benötigt einen Parameter mit der Referenz auf die Anlage, die gesteuert wird.  
Im Konstruktor wird das Attribut **anlage** mit dem Parameter-Wert initialisiert.  
Die Felder **vAmpeln** und **fAmpeln** werden durch den Aufruf der entsprechenden get-Methoden der Anlage initialisiert. 
## Die Methoden schalten()
Programmiere eine Methode **schalten()**, die den gesamten Schaltzyklus der Ampelanlage ablaufen lässt.  
Verwende hierbei Schleifen, um alle Verkehrs- und Fußgängerampeln zu schalten.  
Der Schaltablauf umfasst folgende Schritte:
1. Alle Verkehrsampeln werden gelb.
2. 1 Sekunde Pause:  
    SystemTools.pause(1000);
3. Alle Verkehrsampeln werden rot.
4. 1 Sekunde Pause.
5. Alle Fußgängerampeln werden grün.
6. 3 Sekunden Pause.
7. Alle Fußgängerampeln werden rot.
8. 1 Sekunde Pause.
9. Alle Verkehrsampeln werden gelb.
10. 1 Sekunde Pause.
11. Alle Verkehrsampeln werden grün.

Die Methode schalten() wird durch einen Klick auf den Taster aufgerufen. Teste jetzt deine Ampelanlage.

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
    <script id="javaCode" type="plain/text" title="Steuerung.java" src="08Steuerung.java"></script>
    <script id="javaCode" type="plain/text" title="Ampelanlage.java" src="08Ampelanlage.java"></script>
    <script id="javaCode" type="plain/text" title="Taster.java" src="08Taster.java"></script>
    <script id="javaCode" type="plain/text" title="Lampe.java" src="07Lampe.java"></script>
    <script id="javaCode" type="plain/text" title="Verkehrsampel.java" src="07Verkehrsampel.java"></script>
    <script id="javaCode" type="plain/text" title="Ampel.java" src="07Ampel.java"></script>
    <script id="javaCode" type="plain/text" title="Fussgaengerampel.java" src="07Fussgaengerampel.java"></script>
   
   </iframe>
</section>

 [zurück](../index.html) 
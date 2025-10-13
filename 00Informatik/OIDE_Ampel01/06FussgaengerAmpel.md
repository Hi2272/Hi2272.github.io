  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 
 # Die Fußgängerampel
 
 Um die Fußgängerampel zu programmieren, kannst du einfach den Code der Verkehrsampel kopieren und an zwei Stellen anpassen:

 1. Ändere den Namen des Klasse.
 2. Ändere den Namen des Konstruktors.
 3. Initialisiere mit dieser Zeile die beiden Lampen der Ampel:  
         lampe[i] = new Lampe(x + b / 2, y + h / 4 + i * h / 2, h / 5, farbe[i]);
 

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
    <script id="javaCode" type="plain/text" title="Lampe.java" src="Lampe.java"></script>
      <script id="javaCode" type="plain/text" title="Verkehrsampel.java" src="06Verkehrsampel.java"></script>
      <script id="javaCode" type="plain/text" title="Ampel.java" src="05Ampel.java"></script>
      <script id="javaCode" type="plain/text" title="Fussgaengerampel.java" src="06FussgaengerampelLeer.java"></script>
   </iframe>
</section>

| [zurück](../index.html) | [weiter](07Ampelanlage.html) | 
| --- | ---- |

  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 
 # Eine abstrakte Ampel
 
 Die Verkehrsampel und die Fußgängerampel haben viele gemeinsame Methoden. Der einzige Unterschied zwischen beiden ist die Anzahl der Lampen.

 Um Code-Duplikation zu vermeiden setzen wir dieses Klassendiagramm um:  
 ![alt text](KlassendiagrammAmpelAbstrakt.png)  
 Die Klasse **Ampel** wird hierbei als **abstrakte Klasse** deklariert. Von einer abstrakten Klasse können keine Objekte erzeugt werden.  

 In der Biologie wäre zum Beispiel die Klasse **Säugetiere** eine abstrakte Klasse. Mensch, Hund oder Pottwal sind Unterklassen dieser abstrakten Oberklasse. Ein Mensch ist ein konkretes Objekt, d.h. eine Instanz der Klasse **Mensch**. Es gibt aber kein konkretes Säugetier. Abstrakte Klassen sind daher allgemein Sammel- oder Oberklassen.  
 In der abstrakten Klasse **Säugetier** werden alle Eigenschaften oder Attribute gesammelt, die typisch für Säugetiere sind. Also zum Beispiel die Tatsache, dass sie ein Fell aus Haaren haben, lebende Nachkommmen gebären und diese mit Milch säugen.   

 Analog können wir alle Attribute und Methoden, die in der Verkehrs- und der Fußgängerampel gemeinsam auftreten in die abstrakte Klasse Ampel auslagern.


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
      <script id="javaCode" type="plain/text" title="Ampel.java" src="AmpelLeer.java"></script>
      <script id="javaCode" type="plain/text" title="Fussgaengerampel.java" src="06FussgaengerampelLeer.java"></script>
   </iframe>
</section>

| [zurück](../index.html) | [weiter](../04Verkehrsampel.html) | 
| --- | ---- |

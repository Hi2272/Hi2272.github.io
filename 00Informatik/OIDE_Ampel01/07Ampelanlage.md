  <meta charset="utf-8" />
  <title>AmpelSteuerung</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 
 # Die Ampelanlage
## Attribute
 Die Anlage benötigt 4 Attribute:
 1. Eine Referenz **steuerung** auf die Steuerung, die sie steuert.
 2. Ein Feld **vAmpeln** für die Verkehrsampeln dieser Anlage.
 3. Ein Feld **fAmpeln** für die Fußgängerampeln dieser Anlage.
 4. Ein Feld **taster** für die Taster dieser Anlage.

## Konstruktor
Der Konstruktor benötigt 5 Parameter vom Typ int: 
- x,y: Koordinaten der ersten Ampel
- breite, hoehe: Größe der Ampeln
- anzAmpeln: Zahl der Ampeln in der Anlage 

Im Konstruktor werden die Felder **vAmpeln**, **fAmpeln** und **taster** mit der Länge **anzAmpeln** initialisiert.  
Die einzelnen Elemente der Felder werden in einer Zählschleife mit dieser Sequenz initialisiert:  
```C++
   vAmpel[i] = new Verkehrsampel(x + i * 2 * breite + 20, y, breite - 10, hoehe, new Color[] { Color.red, Color.yellow, Color.green });
   fAmpel[i] = new Fussgaengerampel(x + i * 2 * breite + breite + 20, y, breite - 10, hoehe, new Color[] { Color.red, Color.green });
   taster[i] = new Taster(steuerung, x + i * 2 * breite + breite + 20, y + hoehe + 20, breite - 5, breite - 5);
```
## Get-Methoden
Programmiere eine get-Methode für das Feld **vAmpeln** und eine für das Feld **fAmpeln**.

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
         <script id="javaCode" type="plain/text" title="Ampelanlage.java" src="07Ampelanlage.java"></script>
        <script id="javaCode" type="plain/text" title="Steuerung.java" src="07Steuerung.java"></script>
        <script id="javaCode" type="plain/text" title="Taster.java" src="07Taster.java"></script>
     <script id="javaCode" type="plain/text" title="Lampe.java" src="07Lampe.java"></script>
      <script id="javaCode" type="plain/text" title="Verkehrsampel.java" src="07Verkehrsampel.java"></script>
      <script id="javaCode" type="plain/text" title="Ampel.java" src="07Ampel.java"></script>
      <script id="javaCode" type="plain/text" title="Fussgaengerampel.java" src="07Fussgaengerampel.java"></script>
   
      
   </iframe>
</section>

| [zurück](../index.html) | [weiter](08Steuerung.html) | 
| --- | ---- |

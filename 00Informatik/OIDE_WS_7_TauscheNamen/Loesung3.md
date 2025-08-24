<meta charset="utf-8" />
 <title>Informatik</title>
 <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 
 # Suchen von Elementen und Ändern von Inhalten
 Mit der Methode **tauscheNamen("Bergschuh","Bergschuh Meindl")** soll der Name eines Artikel ausgetauscht werden.


## 4. Methode zum Tauschen eines Wertes im gesamten Feld:
### 1. Prinzip:
|index i|0|1|2|3|4|5|6|
|--|--|--|--|--|--|--|--|
wert[i]|5|**3**|2|**3**|6|7|**3**|

tausche(3,9):

|index i|0|1|2|3|4|5|6|
|--|--|--|--|--|--|--|--|
wert[i]|5|**9**|2|**3**|6|7|**3**|

tausche(3,9):

|index i|0|1|2|3|4|5|6|
|--|--|--|--|--|--|--|--|
wert[i]|5|**9**|2|**9**|6|7|**3**|

tausche(3,9):

|index i|0|1|2|3|4|5|6|
|--|--|--|--|--|--|--|--|
wert[i]|5|**9**|2|**9**|6|7|**9**|

### 2. Algorithmus
Plane einen Algorithmus für eine Methode **tauscheNamenAlle**. Verwende hierzu die Methode **tauscheNamen** und überlege, wie lange diese Methode aufgerufen werden muss.

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
    <script id="javaCode" type="plain/text" title="Webshop.java" src="Webshop.java"></script>
    <script id="javaCode" type="plain/text" title="Artikel.java" src="Artikel.java"></script>
  </script>
   </iframe>
</section>

|[zurück](Loesung2.html)|[Index](../index.html)|
|---|---|


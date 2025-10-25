  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 

# Ändern von Kanten
```C++
public void changeKante(int start, int ziel, int neuerWert) {
      kanten[start][ziel] = neuerWert;
}

public void changeKante(String start, String ziel, int wert){
      int iStart = getIndex(start);
      int iZiel = getIndex(ziel);
      if(iStart != -1 && iZiel != -1){
         changeKante(iStart, iZiel, wert);
      }
}
```

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
    <script id="javaCode" type="plain/text" title="GraphArray.java" src="GraphArray.java"></script>
    <script id="javaCode" type="plain/text" title="Knoten.java" src="Knoten.java"></script>
    <script id="javaCode" type="plain/text" title="Main.java" src="Main.java"></script>
  </script>
   </iframe>
</section>

## [Index](../../../index.html)


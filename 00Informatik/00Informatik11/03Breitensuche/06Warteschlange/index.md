  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 

# Breitensuche
## Die Datenstruktur Queue
Die Datenstruktur **Queue** ist ein sogenannter FIFO-Speicher: 
<b>F</b>irst <b>I</b>n <b>F</b>irst <b>O</b>ut<br>

|Schritt|Out|Queue|In|
|---|---|---|---|
|1|||Wkb|
|2||Wkb||
|3|Wkb|||
|4|||MÜ|
|5||MÜ|W|
|6||MÜ,W||
|7|MÜ|W||
|8||W|M|
|9||W,M|LA|
|10||W,M,LA||

## Fragestellungen
1. An welche Stelle werden neue Elemente in die Queue eingefügt?
2. An welcher Stelle werden Elemente aus der Queue entnommen?

## Implementierung in Java
Eine Queue kann mit der Datenstruktur **LinkedList** implementiert werden.<br>
Hierbei muss der Datentyp der Listenelemente angegeben werden. Zunächst wollen wir Zeichenketten speichern.<br>
Diese Zeile deklariert und initialisiert eine leere Queue, in der Zeichenketten gespeichert werden können:<br>
```Java
private LinkedList<String> queue = new LinkedList<String>();
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
    <script id="javaCode" type="plain/text" title="Main.java" src="Main.java"></script>
  </script>
   </iframe>
</section>



## [weiter](../07Implementierung/index.html)  
## [Index](../../../index.html)


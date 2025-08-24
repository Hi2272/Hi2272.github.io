  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 
# Polymorphie
## Klassendiagramm
![alt text](KlassendiagrammLsg.png)
  <section>
    <iframe
    srcdoc="<script>window.jo_doc = window.frameElement.textContent;</script><script src='https://Hi2272.github.io/include/js/includeide/includeIDE.js'></script>"
    width="100%" height="600" frameborder="0">
    {'id': 'Java', 'speed': 2000, 
    'withBottomPanel': true ,'withPCode': false ,'withConsole': true ,
    'withFileList': true ,'withErrorList': true}
    <script id="javaCode" type="plain/text" title="Mannschaft.java" src="MannschaftLsg.java"></script>
    <script id="javaCode" type="plain/text" title="Mitglied.java" src="MitgliedLsg.java"></script>
    <script id="javaCode" type="plain/text" title="Manager.java" src="Manager.java"></script>
    <script id="javaCode" type="plain/text" title="Spieler.java" src="Spieler.java"></script>
    <script id="javaCode" type="plain/text" title="Trainer.java" src="Trainer.java"></script>
    </script>
   </iframe>
</section>

## Aufruf-Reihenfolge von Methoden

Wenn in einer Unterklasse eine Methode aufgerufen wird, sucht der Compiler zuerst in dieser Unterklasse nach dieser Methode.  
- Wenn er sie findet, wird sie ausgeführt.  
- Wenn er sie nicht findet, sucht er in der Oberklasse nach der gleichnamige Methode und führt diese aus.

  
 [Index](../index.html)

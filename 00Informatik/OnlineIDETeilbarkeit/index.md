  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 
 # Der Modulo-Operator
  Untersuche diesen Code:  
  1. Durch welchen Operator wird der Rest einer ganzzahligen Division ermittelt?
  2. Mit welcher Methode der Klasse String wird eine int-Variable in eine Zeichenkette umgewandelt?
  3. Was bewirkt der "+"-Operator bei Zeichenketten?
    
  Scrolle nach unten für die nächste Aufgabe...
 
<div id="quelle" style="font-size: x-small; text-align: right;">
    2024 Rainer Hille  Unter Verwendung der  <a href='https://www.online-ide.de/'>Online-IDE von Martin Pabst</a><br>Hinweis: Der Code-Editor muss erst geladen werden. Klicke ggf. auf <b>Code Reset</b> um den Programmcode neu zu laden.

  </div>
  
  <section>
    <iframe
    srcdoc="<script>window.jo_doc = window.frameElement.textContent;</script><script src='https://Hi2272.github.io/include/js/includeide/includeIDE.js'></script>"
    width="100%" height="300" frameborder="0">
    {'id': 'Java', 'speed': 2000, 
    'withBottomPanel': false ,'withPCode': false ,'withConsole': true ,
    'withFileList': false ,'withErrorList': true}
    <script id="javaCode" type="plain/text" title="Zahlen.java" src="Zahlen.java"></script>
  </script>
   </iframe>
</section>

# Teilbarkeit durch 2 bis 10
Verändere den Code so, dass geprüft wird, ob die eingegebene Zahl durch alle Zahlen zwischen 2 und 10 teilbar ist.  
<div id="quelle" style="font-size: x-small; text-align: right;">
    2024 Rainer Hille  Unter Verwendung der  <a href='https://www.online-ide.de/'>Online-IDE von Martin Pabst</a><br>Hinweis: Der Code-Editor muss erst geladen werden. Klicke ggf. auf <b>Code Reset</b> um den Programmcode neu zu laden.

  </div>
  
  <section>
    <iframe
    srcdoc="<script>window.jo_doc = window.frameElement.textContent;</script><script src='https://Hi2272.github.io/include/js/includeide/includeIDE.js'></script>"
    width="100%" height="300" frameborder="0">
    {'id': 'Java', 'speed': 2000, 
    'withBottomPanel': false ,'withPCode': false ,'withConsole': true ,
    'withFileList': false ,'withErrorList': true}
    <script id="javaCode" type="plain/text" title="Zahlen.java" src="Zahlen.java"></script>
  </script>
   </iframe>
</section>

## Lösungsvorschlag
Scrolle nach unten für die nächste Aufgabe...  

```Java
public class Zahlen {

   public Zahlen() {
      rechnen();
   }

   public void rechnen() {
      int zahl = Input.readInt("Geben Sie eine Zahl ein:");
      for (int teiler = 2; teiler < 11; teiler = teiler + 1) {
         int rest = zahl % teiler;
         System.out.println("Wir untersuchen die Zahl " + String.valueOf(zahl));
         System.out.println("auf die Teilbarkeit durch " + String.valueOf(teiler) + ".");
         System.out.println("Der Rest beträgt: " + String.valueOf(rest));
      }
   }
  
}

new Zahlen();
```
# Verbesserte Ausgabe
Die Ausgabe unseres Systems ist sehr unübersichtlich.  
Verbessere den Code so, dass nur noch dann ein Text ausgegeben wird, wenn eine Zahl durch einen bestimmten Teiler teilbar ist.  
Die Ausgabe soll zum Beispiel so aussehen:  
```Java
Geben Sie eine Zahl ein:  
15  
Wir untersuchen die Zahl 15  
Sie ist durch 3 teilbar.  
Sie ist durch 5 teilbar.   
```


<div id="quelle" style="font-size: x-small; text-align: right;">
    2024 Rainer Hille  Unter Verwendung der  <a href='https://www.online-ide.de/'>Online-IDE von Martin Pabst</a><br>Hinweis: Der Code-Editor muss erst geladen werden. Klicke ggf. auf <b>Code Reset</b> um den Programmcode neu zu laden.

  </div>
  
  <section>
    <iframe
    srcdoc="<script>window.jo_doc = window.frameElement.textContent;</script><script src='https://Hi2272.github.io/include/js/includeide/includeIDE.js'></script>"
    width="100%" height="300" frameborder="0">
    {'id': 'Java', 'speed': 2000, 
    'withBottomPanel': false ,'withPCode': false ,'withConsole': true ,
    'withFileList': false ,'withErrorList': true}
    <script id="javaCode" type="plain/text" title="Zahlen2.java" src="Zahlen2.java"></script>
  </script>
   </iframe>
</section>

## Lösungsvorschlag
```Java
public class Zahlen {

   public Zahlen() {
      rechnen();
   }

   public void rechnen() {
      int zahl = Input.readInt("Geben Sie eine Zahl ein:");
      System.out.println("Wir untersuchen die Zahl " + String.valueOf(zahl));
      for (int teiler = 2; teiler < 11; teiler = teiler + 1) {
         int rest = zahl % teiler;
         if(rest == 0) {
            System.out.println("Sie ist durch " + String.valueOf(teiler) + " teilbar.");
         }
      }
   }
}

new Zahlen();
```

# Nur noch Zahlen bis 99
Ändere den Code so ab, dass nur noch Zahlen zwischen 2 und 99 akzeptiert werden.  
Verwende hierzu eine While-Schleife und eine logische Verknüpfung (UND = &&, ODER = ||)  

<div id="quelle" style="font-size: x-small; text-align: right;">
    2024 Rainer Hille  Unter Verwendung der  <a href='https://www.online-ide.de/'>Online-IDE von Martin Pabst</a><br>Hinweis: Der Code-Editor muss erst geladen werden. Klicke ggf. auf <b>Code Reset</b> um den Programmcode neu zu laden.

  </div>
  
  <section>
    <iframe
    srcdoc="<script>window.jo_doc = window.frameElement.textContent;</script><script src='https://Hi2272.github.io/include/js/includeide/includeIDE.js'></script>"
    width="100%" height="300" frameborder="0">
    {'id': 'Java', 'speed': 2000, 
    'withBottomPanel': false ,'withPCode': false ,'withConsole': true ,
    'withFileList': false ,'withErrorList': true}
    <script id="javaCode" type="plain/text" title="Zahlen3.java" src="Zahlen3.java"></script>
  </script>
   </iframe>
</section>

## Lösungsvorschlag
```Java

public class Zahlen {

   public Zahlen() {
      rechnen();
   }

   public void rechnen() {
      int zahl = Input.readInt("Geben Sie eine Zahl zwischen 2 und 99 ein:");
      while (zahl > 99 || zahl < 2) {
         zahl = Input.readInt("Geben Sie eine Zahl zwischen 2 und 99 ein:");
      }
      System.out.println("Wir untersuchen die Zahl " + String.valueOf(zahl));
      for (int teiler = 2; teiler < 11; teiler = teiler + 1) {
         int rest = zahl % teiler;
         if(rest == 0) {
            System.out.println("Sie ist durch " + String.valueOf(teiler) + " teilbar.");
         }
      }
   }
}

new Zahlen();
```
# Primzahlerkennung
Mit dem bisherigen Programm können wir relativ leicht erkennen, ob es sich bei der eingegebenen Zahl um eine Primzahl handelt.  
Ändere das Programm so ab, dass am Ende ausgegeben wird, ob es sich bei der Zahl um eine Primzahl handelt.  

<div id="quelle" style="font-size: x-small; text-align: right;">
    2024 Rainer Hille  Unter Verwendung der  <a href='https://www.online-ide.de/'>Online-IDE von Martin Pabst</a><br>Hinweis: Der Code-Editor muss erst geladen werden. Klicke ggf. auf <b>Code Reset</b> um den Programmcode neu zu laden.

  </div>
  
  <section>
    <iframe
    srcdoc="<script>window.jo_doc = window.frameElement.textContent;</script><script src='https://Hi2272.github.io/include/js/includeide/includeIDE.js'></script>"
    width="100%" height="300" frameborder="0">
    {'id': 'Java', 'speed': 2000, 
    'withBottomPanel': false ,'withPCode': false ,'withConsole': true ,
    'withFileList': false ,'withErrorList': true}
    <script id="javaCode" type="plain/text" title="Zahlen4.java" src="Zahlen4.java"></script>
  </script>
   </iframe>
</section>

## Lösungsvorschlag
```Java
public class Zahlen {

   public Zahlen() {
      rechnen();
   }

   public void rechnen() {
      boolean primzahl = true;
      int zahl = Input.readInt("Geben Sie eine Zahl zwischen 2 und 99 ein:");
      while (zahl > 99 || zahl < 2) {
         zahl = Input.readInt("Geben Sie eine Zahl zwischen 2 und 99 ein:");
      }
      System.out.println("Wir untersuchen die Zahl " + String.valueOf(zahl));
      for (int teiler = 2; teiler < zahl; teiler = teiler + 1) {
         int rest = zahl % teiler;
         if(rest == 0) {
            // Es muss nicht geprüft werden, ob der Teiler gleich der Zahl ist,
            // da die Schleife abbricht, bevor zahl erreicht wird.
            System.out.println("Sie ist durch " + String.valueOf(teiler) + " teilbar.");
            primzahl = false;
         }
      }
      if(primzahl) {
         System.out.println("Sie ist eine Primzahl!");
      }
   }
}

new Zahlen();
```
# Bewertung des Primzahl-Algorithmus
Das Programm erkennt die Primzahlen zwischen 2 und 99 sicher. Allerdings benötigt der Algorithmus vor allem bei größeren Zahl zu viel Zeit dazu.  
Erläutere, weshalb für die Erkennung der Primzahlen zu viele Tests durchgeführt werden und passe den Code so an, dass er möglichst wenig Teiler prüft und Primzahlen erkennt.  
Die Ausgabe könnte zum Beispiel so aussehen:  
```Java
Geben Sie eine Zahl ein:
98
Wir untersuchen die Zahl 98
Sie ist durch 2 teilbar.
```
<div id="quelle" style="font-size: x-small; text-align: right;">
    2024 Rainer Hille  Unter Verwendung der  <a href='https://www.online-ide.de/'>Online-IDE von Martin Pabst</a><br>Hinweis: Der Code-Editor muss erst geladen werden. Klicke ggf. auf <b>Code Reset</b> um den Programmcode neu zu laden.

  </div>
  
  <section>
    <iframe
    srcdoc="<script>window.jo_doc = window.frameElement.textContent;</script><script src='https://Hi2272.github.io/include/js/includeide/includeIDE.js'></script>"
    width="100%" height="300" frameborder="0">
    {'id': 'Java', 'speed': 2000, 
    'withBottomPanel': false ,'withPCode': false ,'withConsole': true ,
    'withFileList': false ,'withErrorList': true}
    <script id="javaCode" type="plain/text" title="Zahlen5.java" src="Zahlen5.java"></script>
  </script>
   </iframe>
</section>

# Lösungsvorschlag
```Java
public class Zahlen {

   public Zahlen() {
      rechnen();
   }

   public void rechnen() {
      boolean primzahl = true;
      int zahl = Input.readInt("Geben Sie eine Zahl zwischen 2 und 99 ein:");
      while (zahl > 99 || zahl < 2) {
         zahl = Input.readInt("Geben Sie eine Zahl zwischen 2 und 99 ein:");
      }
      System.out.println("Wir untersuchen die Zahl " + String.valueOf(zahl));
      for (int teiler = 2; teiler < zahl; teiler = teiler + 1) {
         int rest = zahl % teiler;
         if(rest == 0) {
            // Es muss nicht geprüft werden, ob der Teiler gleich der Zahl ist,
            // da die Schleife abbricht, bevor zahl erreicht wird.
            System.out.println("Sie ist durch " + String.valueOf(teiler) + " teilbar.");
            primzahl = false;
            teiler = 99;
         }
      }
      if(primzahl) {
         System.out.println("Sie ist eine Primzahl!");
      }
   }
}

new Zahlen();
```

[Weitere Übungsaufgaben auf LearnJ](https://www.learnj.de/doku.php?id=einstieg:wiederholung:start)  



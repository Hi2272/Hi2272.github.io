 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

 # Daten über die serielle Schnittstelle empfangen

 Der Arduino sendet die Messdaten über den Befehl **Serial.println(wert);** an die serielle Schnittstelle.  
 In diesem Kapitel programmieren wir den Rechner in Processing so, dass er diese Daten einliest und im Display darstellt.  
 ## 1. Import der serial-Bibliothek
Erstelle einen neuen Sketch mit folgendem Inhalt:
 ```Java
import processing.serial.*;

Serial myPort;

// Läuft einmal ab
void setup() {
  printArray(Serial.list());
}

// Läuft wiederholt ab
void draw() {
}
```
### Erklärung des Codes
### import processing.serial.*;
Importiert die passende Bibliothek. Diese wird automatisch bei der Installation von Processing installiert und muss daher nicht extra gesucht werden.
### Serial myPort
Erzeugt ein neues Objekt der Klasse Serial. Mit diesem Objekt kann auf die Serielle Schnittstelle zugegriffen werden.
### printArray(Serial.list());
Dieser Befehl gibt eine Liste aller verfügbarer Serieller Ports aus. Das Ergebnis sieht zum Beispiel so aus:  
**[0] "/dev/ttyACM0"**
Für die weitere Programmierung benötigst du die Nummer der Schnittstelle, an die dein Arduino angeschlossen ist. In diesem Fall ist das die **[0]**.
## 2. Ansteuern der passenden Schnittstelle
Ergänze die **setup**-Methode um folgende Zeile:
```Java
  String port=Serial.list()[0];
  serial=new Serial(this,port,9600);
```
### Erklärung des Codes
### String port=Serial.list()[0];
Wir definieren eine lokale Variable port, die den Namen der Seriellen Schnittstelle übernimmt, mit der wir uns verbinden wollen.  
Den Index [0] erhalten wir aus der Liste der printArray-Methode.  
### serial=new Serial(this,port,9600);
In dieser Zeile wird ein neues Objekt der Klasse Serial erzeugt. Die Parameter haben folgende Bedeutung:
- this: Das Objekt hängt an diesem Programm.
- port: Der Name des Ports der Seriellen Schnittstelle.
- 9600: Die Übertragungsrate in Baud. Diese muss mit dem Wert des Arduinos übereinstimmen.

## 3. Einlesen und Ausgeben von Messwerten
Ergänze deinen Code im Bereich der **draw**-Methode um diese Zeilen:  
```Java
String input="";
int wert=0;

// Läuft wiederholt ab
void draw() {
  while (serial.available()>0) {
    input=serial.readStringUntil(10);
    if (input!=null) {
      wert=int(input);
      print(wert);
    }
  }
}
```
### Erklärung des Codes
###   while (serial.available()>0) {}
Solange Daten an der Seriellen Schnittstelle verfügbar sind, soll der Rechner diese einlesen.
###  input=serial.readStringUntil(10);
Die Daten werden als Zeichenkette gelesen.  
Da wir im Arduino die **Serial.println()**-Methode verwenden, wird jeder Datensatz durch einen Zeilenumbruch beendet. Der Code für diesen Zeilenumbruch entspricht der Zahl 10.  
Mit diesem Befehl liest das Programm einen vollständigen Datensatz ein und speichert ihn in der Variable **input**.
###     if (input!=null) {}
Wenn die Variable **input** nicht leer ist, d.h. wenn Daten eingelesen wurden, sollen diese angezeigt werden.
###       wert=int(input);
Hier wird die Zeichenkette in die entsprechende ganze Zahl umgewandelt. Dieser Schritt ist für die spätere grafische Darstellung wichtig.
### print(wert);
Und an dieser Stelle wird der Wert auf der Console ausgegeben.

## 4. Testen des Codes
Wenn du das Programm startest, müssten auf der Console die Temperatur-Werte des Arduinos angezeigt werden.  
Es kann sein, dass der Rechner mit einem Fehlercode antwortet:  
**failed-to-open-dev-ttyacm0-port-busy**  
In diesem Fall musst du die Serielle Schnittstelle erst freigeben:  
1. Öffne die Linux-Konsole
2. Tippe folgenden Befehl ein:   
   **fuser -k /dev/ttyACM0**  
Wenn du das Programm erneut startest, sollte es die Verbindung zur Schnittstelle aufbauen können.
## 5. Grafische Ausgabe der Daten
Um die Messdaten grafisch darzustellen, musst du den neuen Code zum Einlesen der Daten mit dem alten Code zur Darstellung der Daten kombinieren.

[Lösung](Loesung.html)  

[zurück](../index.html)
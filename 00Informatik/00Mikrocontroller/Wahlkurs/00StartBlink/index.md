 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">


# Blink - das erste Programm
Der Arduino Uno hat eine eingebaute LED. Diese ist am Pin 13 angeschlossen. Mit folgendem Programm lassen wir diese LED blinken.

## 1. Blockbasierte Programmierung des Arduino Unos

Auf der Internetseite <a href="https://sensebox.github.io/blockly/" target="_blank">https://sensebox.github.io/blockly/</a>  steht ein Editor zur blockbasierten Programmierung des Arduino Unos zur Verfügung.

Erstelle folgendes Block-Programm:  
![Alt text](2024-06-14_10-06.png)  
Auf der rechten Seite wird dir der automatisch erzeugt Arduino-Quellcode angezeigt:  

```C++
void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}
```
Diesen Code können wir jetzt in die Arduino-IDE kopieren.

## 2. Textbasierte Programmierung des Arduino Unos.
1. Starte das Programm Arduino-IDE
2. Kopiere den Code aus der Internetseite in das Editorfeld
3. Stelle ggf. das passende Board ein: [vgl. Start](../00Start/index.html)
4. Klicke auf den Pfeil in der linken oberen Ecke, um  
   1. Das Programm in Maschinensprache zu übersetzen (Kompilieren des Programms).
   2. Den Maschinencode über das USB-Kabel auf den Mikrocontroller zu laden (Flashen des Programmcodes).  
![Alt text](sc4.png)
1. Warte bis die Meldung **Done uploading** (Hochladen erfolgreich) erscheint.  
Die LED auf dem Arduino Uno blinkt jetzt schnell.

## Erläuterungen zum Code

### void setup(){  }
Die setup-Methode wird nur einmal durchlaufen, wenn der Mikrocontroller gestartet wird. In dieser Methode werden grundlegende Einstellungen für den Betrieb des Mikrocontrollers vorgenommen. 


**Merke:**   

Die geschweiften Klammern {  } umfassen den Code, der beim Aufruf der Methode ausgeführt wird. Man bezeichnet diese Einheit auch als Block im Code.


### pinMode(13,OUTPUT);
**pinMode()** ist eine Methode, d.h. ein in der Programmiersprache festgelegter Befehl. 

Mit ihm kann ein bestimmter Anschluss (Pin) des Arduinos entweder als Eingang (**I**NPUT) und als Ausgang (**O**UTPUT) geschaltet werden kann. Man bezeichnet die Anschlüsse daher auch als **IO**-Pins.  

Die Methode **pinMode(13, OUTPUT);** legt fest, dass der Pin 13 als Ausgang verwendet wird.  
**pinMode(6,INPUT);** würde Pin 6 als Eingang festlegen.

### void loop(){}
Die loop-Methode wird beim Betrieb des Arduinos immer wieder durchlaufen. Sie stellt also eine Endlosschleife dar.

### digitalWrite(13,HIGH);
Diese Methode legt am Pin 13 ein positives Potential (+5 V) an. Die mit dem Pin 13 verbundene interne LED beginnt zu leuchten.
###  delay(1000);
Das Programm pausiert 1000 ms lang. So lange leuchtet die LED.
### digitalWrite(13,LOW);
Der Pin 13 wird mit Masse verschaltet, d.h. sein Potential wird auf 0 V festgelegt. Die interne LED leuchtet nicht mehr, da keine Spannung mehr anliegt.
### delay(1000);
Die zweite Pause bedingt, dass die LED 1000 ms lang ausgeschaltet bleibt.  
Da die loop()-Methode immer wieder durchlaufen wird, beginnt sie anschließend wieder zu leuchten. Sie blinkt also ungefähr einmal pro Sekunde.

## Experimentieraufgabe

Ändere das Programm so ab, dass die LED langsamer blinkt und lade es erneut hoch.
    
[Weiter zur Ampel](../01LEDs/05Ampel/index.html)  

[zurück zur Übersicht](../index.html)
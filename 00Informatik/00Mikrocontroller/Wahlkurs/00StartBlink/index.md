# Blink - das erste Programm
Der Arduino Uno hat eine eingebaute LED. Diese ist am Pin 13 angeschlossen. Mit folgendem Programm lassen wir die LED blinken.
1. Schreibe dieses Programm ab:
```C++
void setup() {
  pinMode(13,OUTPUT);
}

void loop() {
  digitalWrite(13,HIGH);
  delay(500);
  digitalWrite(13,LOW);
  delay(500);
}
```
2. Klicke auf den Pfeil in der linken oberen Ecke, um  
   1. Das Programm in Maschinensprache zu übersetzen (Kompilieren des Programms).
   2. Den Maschinencode über das USB-Kabel auf den Mikrocontroller zu laden (Flashen des Programmcodes).  
![Alt text](sc4.png)
3. Warte bis die Meldung **Done uploading** (Hochladen erfolgreich) erscheint.  
Die LED auf dem Arduino Uno blinkt jetzt schnell.

## Erläuterungen zum Code

### void setup(){  }
Die setup-Methode wird nur einmal durchlaufen, wenn der Mikrocontroller gestartet wird. In dieser Methode werden grundlegende Einstellungen für den Betrieb des Mikrocontrollers vorgenommen. 


**Merke:**   

Die geschweiften Klammern {  } umfassen den Code, der beim Aufruf der Methode ausgeführt wird. Man bezeichnet diese Einheit auch als Block im Code.


### pinMode(13,OUTPUT);
Die Anschlüsse (Pins) des Arduinos können als Eingang (**I**NPUT) und als Ausgang (**O**UTPUT) programmiert werden. Man bezeichnet sie daher auch als **IO**-Pins.  

Die Methode pinMode(13, OUTPUT) legt fest, dass der Pin 13 als Ausgang verwendet wird. (pinMode(6,INPUT) würde Pin 6 als Eingang festlegen.)

### void loop(){}
Die loop-Methode wird beim Betrieb des Arduinos immer wieder durchlaufen. Sie stellt also eine Endlosschleife dar.

### digitalWrite(13,HIGH);
Diese Methode legt am Pin 13 ein positives Potential (+5 V) an. Die mit dem Pin 13 verbundene interne LED beginnt zu leuchten.
###  delay(500);
Das Programm pausiert 500 ms lang. So lange leuchtet die LED.
### digitalWrite(13,LOW);
Der Pin 13 wird mit Masse verschaltet, d.h. sein Potential wird auf 0 V festgelegt. Die interne LED leuchtet nicht mehr, da keine Spannung mehr anliegt.
### delay(500);
Die zweite Pause bedingt, dass die LED 500 ms lang ausgeschaltet bleibt.  
Da die loop()-Methode immer wieder durchlaufen wird, beginnt sie anschließend wieder zu leuchten. Sie blinkt also ungefähr einmal pro Sekunde.

## Experimentieraufgabe

Ändere das Programm so ab, dass die LED langsamer blinkt und lade es erneut hoch.
    

   
[zurück](../index.html)
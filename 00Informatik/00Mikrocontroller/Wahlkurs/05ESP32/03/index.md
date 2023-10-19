   <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Bluetooth
## 1. Allgemeines 
Der ESP32 verfügt über ein eingebautes Bluetooth-Modul.   
Beim Arduino Uno kann ein Bluetooth-Modul eingebaut werden. Diese Module werden auf folgender Seite beschrieben: [Funduino HC05 und HC06](https://funduino.de/tutorial-hc-05-und-hc-06-bluetooth)  
  

Über Bluetooth kannst du Daten von deinem Mikrocontroller ans Handy senden oder den Mikrocontroller vom Handy aus steuern.  
Über die Internet-Plattform [MIT App Inventor](https://appinventor.mit.edu) kannst du relativ einfach Bluetooth-Apps für dein Handy entwickeln.

## 2. Senden von Daten über Bluetooth
Mit dem folgenden Programm senden wir jede Sekunde eine Zahl an die Bluetooth-Schnittstelle.  
Kopiere diesen Code in dein Programm:  

```C++
#include "BluetoothSerial.h"

BluetoothSerial SerialBT;

void setup() {
  SerialBT.begin("Name",true); 
  SerialBT.setPin(123456);
}

int anz=0;

void loop() {
    SerialBT.println(anz);
    anz=anz+1;
    delay(1000);
 }
```
## Erläuterung des Codes
### #include "BluetoothSerial.h"
Diese Zeile bindet eine Bibliothek ein, die Befehle zum Senden und Empfangen über Bluetooth bereit stellt.
###  BluetoothSerial SerialBT;
Damit wir auf die Bluetooth-Schnittstelle zugreifen können, erzeugen wir ein Objekt **SerialBT** aus der Klasse **BluetoothSerial**.
###   SerialBT.begin("Name",true);
Mit diesem Befehl starten wir die Bluetooth-Schnittstelle. Die beiden Parameter haben folgende Bedeutung:
- "Name": Unter dieser Bezeichnung ist der ESP32 im Kopplungsmodus für dein Handy sichtbar.  
 Verwendet bitte unterschiedliche Namen, damit klar ist, mit welchem Gerät euer Handy gekoppelt werden soll.
- true: Dieser Parameter gibt an, dass bei der Kopplung am Handy ein Pin abgefragt wird. Damit wird sicher gestellt, dass sich kein fremdes Gerät mit eurem ESP32 koppeln kann.  
Der ESP32 bleibt so lange im Kopplungsmodus, bis er sich mit einem Handy verbunden hat.
### SerialBT.setPin(123456);
In dieser Zeile wird der Pin festgelegt, der zur Kopplung eingegeben werden muss. Bei eurem Programm solltet ihr etwas kreativer sein...  
###   SerialBT.println(anz);
SerialBT stellt vier verschiedene Befehle zum Senden von Daten über die Bluetooth-Schnittstelle zur Verfügung:
| <!-- -->      | <!-- -->        | 
|:-------------|:---------------|
|SerialBT.print(anz);  |Schreibt Text ohne Zeilenumbruch|
|SerialBT.println(anz);|Schreibt Text mit Zeilenumbruch|
|SerialBT.write(anz);|Schreibt Bytes ohne Zeilenumbruch|  
|SerialBT.writeln(anz);|Schreibt Bytes mit Zeilenumbruch|

## 4. Empfangen der Daten mit dem Handy
### 4.1 Vorbereiten des Handys
#### 4.1.1 Installation einer Bluetooth-App
Um die Bluetooth-Daten am Handy zu anzuzeigen, musst du eine App auf dem Handy installieren.  

Suche dazu im AppStore nach folgenden Begriffen **Bluetooth Terminal** oder **Bluetooth Serial Monitor** und installiere eine kostenfreie App.
#### 4.1.2 Kopplung des Handys mit dem ESP
- Aktiviere Bluetooth bei deinem Handy
- Suche nach neuen Bluetooth-Geräten
- Koppele das Gerät mit dem passenden Namen mit deinem Handy.   
### 4.2 Darstellen der Daten
- Starte die App, die du vorher installiert hast.
- Verbinde dich mit dem ESP32.   
  In der App müsste jetzt jede Sekunde eine neue Zahl angezeigt werden.



  
[weiter](weiter.html)  

[zurück](../../index.html)   
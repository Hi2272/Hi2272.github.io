 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Ausgabe der Messwerte an einem OLED-Display
##  1. Anschluss
Das OLED-Display verfügt über 4 Anschlüsse:

|Display|Arduino Uno|Erklärung|
|---|---|---|
|VCC|5V|Spannung|
|GND|GND|Spannung|
|SCL|SCL|Clock = Taktgeber|
|SDA|SDA|Daten|

## 2. Installation der SSD1306Ascii-Biblitothek
Zum Betrieb des OLED-Displays müssen wir zunächst eine Bibliothek installieren.  
1. Öffne den Bibliotheksmanager: 
2. Suche nach **SSD1306As**.
3. Installiere die OneWire-Bibliothek von Jim Studt:    
   ![Alt text](2023-10-25_18-14.png)

## 3. Test des Displays
Zum Testen des Displays schreiben wir zunächst einen neuen Sketch, der nur ein Wort auf dem Display ausgibt.
1. Erstelle einen neuen Sketch und speichere ihn unter dem Namen Display.
2. Kopiere folgende Coden in den Sketch:
   
```C++
#include <Wire.h>               
#include "SSD1306Ascii.h"
#include "SSD1306AsciiWire.h"
#define I2C_ADDRESS 0x3C      // Adresse des Displays

SSD1306AsciiWire oled;

void setup() {
  Wire.begin();
  Wire.setClock(400000L);
  oled.begin(&Adafruit128x64, I2C_ADDRESS);
}

void loop() 
{
  oled.setFont(System5x7);  // Schriftart festlegen
  oled.clear();             //Display löschen
  oled.println("Temperatur"); 
  delay (1000);
}
```
### Erläuterungen zu den Codezeilen
1. Das Display wird über den sogenannten I²C-Bus angesteuert. Um ihn zu verwenden, müssen wir zunächst die entsprechende Bibliothek **Wire.h** importieren.
2. Die beiden folgenden Bibliotheken stellen die Funktionen zum Schreiben auf dem Display zur Verfügung.
3. Am I²C-Bus können mehrere verschiedene Geräte angeschlossen werden. Diese Geräte unterscheiden sich in ihrer Adresse. Unsere Displays haben die Adresse 0x3C.
4. In der nächsten Zeile wird das Objekt **oled** aus der Klasse **SSD1306AsciiWire** erzeugt. Mit Hilfe dieses Objektes können wir jetzt das Display ansteuern.
5. In der **setup**-Methode wird die Datenrate festgelegt, mit der Daten zum Display geschickt werden. Anschließend wird das Display gestartet.
6. In der **loop**-Methode wird jede Sekunde das Display gelöscht und neu beschrieben. 
### 4. Testen des Programms
Wenn du den Sketch hochgeladen hast, müsste der Text **Temperatur** auf dem Display erscheinen und im Sekundentakt blinken.
### 5. Kombination mit dem Sketch zur Temperaturmessung
Kopiere den neuen Sketch in den alten zur Temperaturmessung und ändere diesen so ab, dass die aktuelle Temperatur am OLED-Display angezeigt wird.  
<br>[Lösung](weiter.html)
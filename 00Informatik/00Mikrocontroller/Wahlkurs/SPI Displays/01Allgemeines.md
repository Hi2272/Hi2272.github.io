<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# SPI Displays
## Allgemeines
**SPI** steht für **Serial Peripheral Interface**. Mit diesem Standard ist es möglich, Geräte wie Displays oder Sensoren über einen seriellen Anschluss mit dem Arduino zu verbinden.   
Leider ist die Bezeichnung der Pins bei SPI-Geräten nicht einheitlich geregelt. Die folgende Tabelle kann als Hilfestellung verwendet werden:  

| Pin-Name    | Alternative | Bedeutung |
| -------- | ------- | ---- |
SCK|SCLK, CLK| Serial Clock|
CS|SS|Chip Select|
MISO|SDO, DO, CIPO, RS|Master in Slave Out|
MOSI|SDI, DI, COPI|Master out Slave In|

Beim SPI-Protokoll kommuniziert **ein Master- oder Controller-Gerät** (z.B. ein Arduino) mit **einem oder mehreren Slave- oder Peripheral-Geräten** (z.B. ein Sensor und ein Display).
## Bedeutung der Pins
### SCK
Die Serial-Clock-Pin dient als Taktgeber für die Datenübertragung. Er legt also fest, mit welcher Geschwindigkeit die einzelnen Datenbits übertragen werden. Bei der Datenübertragung erzeugt der **Master** die CLK-Impulse und legt damit die Datenrate fest.
### CS
Der Chip-Select-Pin dient dazu festzulegen, welches Slave-Gerät vom Master-Gerät angesprochen wird.
### MISO, SDO, CIPO
Der Master-In-Slave-Out-Pin (Controller-In-Peripheral-Out) dient zur Datenübertragung vom Slave- zum Master-Gerät. Sobald das Slave-Gerät ein CLK-Signal empfängt, muss es ein Signal über den MISO-Pin schicken.
### MOSI, SDI, COPI
Der Master-Out-Slave-In-Pin (Controller-Out-Peripheral-In) dient zur Datenübertragung vom Master- zum Slave-Gerät.  
Da im SPI-Protokoll also für jede Richtung ein eigener Kanal vorliegt, könnnen Daten gleichzeitig in beide Rictungen übertragen werden.
## SPI-Pins am Arduino Uno
Am Arduino sind folgende SPI-Pins als Standard festgelegt:
|Pin-Nr.|SPI-Pin|
|----|----|
|10|CS, SS|
|11|MOSI, SDI, DI, COPI|
|12|MISO, SDO, DO, CIPO, RS|
|13|SCK, CLK|  

Für die Verwendung muss die SPI.h Bibliothek in den Sketch eingebunden werden:  
``` C++
#include <SPI.h>
```  

## Weitere Pins am Display
Am Display sind in der Regel weitere Pins vorhanden, die wie folgt verkabelt werden müssen:  
|Display|Arduino|Bedeutung|
|---|---|---|
|VCC|5V|+ Pol|
|GND|GND|- Pol|
|LED, BL|3,3 V|Hintergrundbeleuchtung|
|RES, RST|Pin 8|Reset|

Der LED-Pin kann auch mit einem PWM-Pin am Arduino (3, 5, 6, 9) verbunden werden. Dann kann die Helligkeit reguliert werden.  

Manche Displays haben einen SDA-Pin. Dies ist ein SPI-Pin, der Daten senden und empfangen kann. Am Arduino sollte er mit dem MOSI-Pin (11) verbunden werden, das das Dislay als Slave nur Daten vom Master empfängt. Der MISO-Pin (12) bleibt in diesem Fall frei.  



[zurück](index.html)

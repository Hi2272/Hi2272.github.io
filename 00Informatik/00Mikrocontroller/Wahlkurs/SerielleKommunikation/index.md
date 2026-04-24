# Serielle Kommunikation

## I²C

### Quellen
https://fmh-studios.de/theorie/informationstechnik/i2c-bus/

### Grundprinzip
I²C ist ein Protokoll zum seriellen Übertragen von Daten.   
Hierzu werden nur 2 Kabel benötigt:
- SDA: Serial Data  
Kabel auf dem die Daten übertragen werden.
- SCL/CLK: Serial Clock  
Kabel auf dem die Impulse des Taktes gesendet werden.
Dieser Takt wird von allen Teilnehmern verwendet. Man spricht von einem synchronen Bus.
### Aufbau
I²C benötigt einen **Master**, der die Datenübertragung steuert. Dies ist in der Regel der Mikrocontroller.  
Die Sensoren oder Aktoren sind **Slaves**. Im System können bis zu 127 Slaves mit einem Master verbunden werden.  
Nur der Master kann die Kommunikation starten. Das heißt er kann Daten an die Slaves schicken und Daten von den Slaves anfordern.

## Kodierung einer Nachricht
SDA und SCL sind über Pullup-Widerstände mit HIGH verbunden. Damit sind die Potentiale beider Leitungen in in Ruhe HIGH.    
Jede Nachricht startet mit einem Start-Signal. Hierzu schaltet der Master den SDA-Pin auf LOW und lässt den SCL-Pin HIGH. Durch das Start-Signal werden alle Slaves aktiv und warten auf die weitere Nachricht.      
Nach dem Start-Signal wird der SCL-Pin in der festgelegten Datenrate regelmäßig LOW und HIGH geschaltet. Ein Takt besteht immer aus einer LOW- und einer anschließenden HIGH-Phase der SCL-Leitung. Damit kann auch ein dauernder HIGH- oder LOW-Pegel der SDA-Leitung in einzelne 1 oder 0 Bits aufgeteilt werden.

Nach dem Start-Signal wird mit 7 Bits die Adresse des Slaves übermittelt. Durch diese 7 Bits können maximal 127 Slaves angesprochen werden (Adressen 1-127).   
Mit dem 8. Bit wird codiert, ob die Nachricht vom Master zum Slave (HIGH = write) oder vom Slave zum Master (LOW = read) gesendet wird. Bei HIGH liest der passende Slave die Daten von der SDA-Leitung ein. Bei LOW schickt der Slave die Daten in die SDA-Leitung. Die Nachricht endet mit einem End-Signal: Hierzu beendet die SCL-Leitung ihre Pulsierung und bleibt dauerhaft HIGH. Anschließend wird die SDA-Leitung auf HIGH gezogen.

## One-Wire
### Grundaufbau
Bei der One-Wire-Technologie werden nur 3 Kabel verwendet:
- VCC
- GND
- SDA: Datenleitung
Die SDA-Leitung ist mit einem Pullup-Widerstand mit VCC verbunden. Im Ruhezustand ist das SDA-Potential daher HIGH.  
Im Vergleich zu I²C und den meisten anderen Seriellen Leitungen fehlt die Clock-Leitung (SCL).



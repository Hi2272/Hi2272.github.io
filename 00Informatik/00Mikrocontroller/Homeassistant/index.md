# Home Assistant

## Quellen


## Allgemeines
Home Assistant ist eine kostenlose Softwarelösung zum Aufbau eines Smarthomes. 

## ESP Home
### Quellen
- [Getting startet Tutorial](https://esphome.io/guides/getting_started_hassio/)
- [ESP über Thread](https://esphome.io/components/openthread/)  

### Grundlagen

Esp Home ist ein Add-On zu Home Assistant, mit dem ESP32-Module so programmiert werden können, dass sie in ein Home Assistant System eingebunden werden können. Der ESP muss hierzu über ein USB-Kabel mit dem Rechner verbunden sein, auf dem Home Assistant läuft. In der Regel ist das ein Raspberry Pi.  
   
Die angeschlossenen Sensoren oder Aktoren werden in Yaml-Dateien konfiguriert. Die Software kompiliert mit diesen Daten Code und flasht diesen auf den über USB angeschlossenen Mikrocontroller. Das Kompilieren dauert relativ lang und wird immer wieder durch Pausen unterbrochen, in denen das System scheinbar nichts tut. Geduld ist gefragt.

### Kommunikation über Wifi
Über Wifi können grundsätzlich alle ESP32-Typen eingebunden werden. Die Voraussetzung zum Senden von Daten ist eine bestehende Wifi-Verbindung. Wird das Wifi nachts ausgeschaltet, dann werden keine Daten mehr empfangen.   
Die Geräte verbinden sich aber automatisch wieder, sobald das Netz wieder verfügbar ist.

### Kommunikation über Thread
Über Thread können nur ESP32-C5, ESP32-C6 oder ESP32-H2-Chips kommunizieren. Die Geräte bauen ein eigenes Netz auf, das unabhängig vom WLan funktioniert und weniger Energie benötigt.

Das Thread-Device benötigt die Daten vom Thread-Border-Router, um sich anmelden zu können. Diese Daten können in einem einzelnen tlv-Attribut übermittelt werden:  
```YAML
# Example OpenThread TLV value from the Thread information in Home Assistant
openthread:
  tlv: 0e080000000000010000000300001035060004001fffe00208e227ac6a7f24052f0708fdb753eb517cb4d3051062b2442a928d9ea3b947a1618fc4085a030f4f70656e5468726561642d393837330102987304105330d857354330133c05e1fd7ae81a910c0402a0f7f8
```
Dieser Wert kann in Home Assistant unter **Einstellungen.Geräte.Thread Border Router** ausgelesen werden.



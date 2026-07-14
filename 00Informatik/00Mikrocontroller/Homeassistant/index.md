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

### YAML-Datei für BME280

https://esphome.io/components/sensor/bme280/

```YAML
esphome:
  name: bme280
  friendly_name: BME280
  min_version: 2024.6.0

esp32:
  board: esp32-c6-devkitc-1
  variant: esp32c6
  framework:
    type: esp-idf
    version: recommended

# Enable Home Assistant API
api:
  encryption:
    key: "..." # Geheimer Code, der beim Einbinden des Sensors in Home Assistant benötigt wird

# Example OpenThread component configuration
network:
  enable_ipv6: true
  
# Matter over Thread
openthread:
  tlv: 
  # Wert aus Thread Border Router kopieren

# I2C-Bus für BME280
i2c:
  sda: GPIO5  # Pins, an die der Sensor angeschlossen ist
  scl: GPIO4
  scan: true
  id: bus_a

# BME280-Sensoren
sensor:
  - platform: bme280_i2c
    i2c_id: bus_a
    address: 0x76
    temperature:
      name: "Temperatur"
      # Matter-Mapping: TemperatureMeasurement Cluster
      device_class: temperature
      state_class: measurement
      accuracy_decimals: 1
    pressure:
      name: "Luftdruck"
      # Matter-Mapping: PressureMeasurement Cluster (als Sensor)
      device_class: atmospheric_pressure
      state_class: measurement
      accuracy_decimals: 1
    humidity:
      name: "Feuchtigkeit"
      # Matter-Mapping: RelativeHumidityMeasurement Cluster
      device_class: humidity
      state_class: measurement
      accuracy_decimals: 1
    update_interval: 60s

# Logging (seriell/USB)
logger:

```

### H-Brücke für Ventilator
https://esphome.io/components/fan/hbridge/


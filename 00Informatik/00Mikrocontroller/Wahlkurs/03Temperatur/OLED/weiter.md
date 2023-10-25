 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

```C++
#include <OneWire.h>
#include <DallasTemperature.h>

// Anschluss des Sensors an Pin2
int tempPin=2;
OneWire oneWire(tempPin);
DallasTemperature sensors(&oneWire);

#include <Wire.h>               
#include "SSD1306Ascii.h"
#include "SSD1306AsciiWire.h"
#define I2C_ADDRESS 0x3C      // Adresse des Displays

SSD1306AsciiWire oled;


void setup()
{
  Serial.begin(9600);
  sensors.begin();

  Wire.begin();
  Wire.setClock(400000L);
  oled.begin(&Adafruit128x64, I2C_ADDRESS);
}

void loop()
{ 
  // Sende Signal zum Abfragen der Temperatur
  sensors.requestTemperatures(); 
  // Lese den Wert des Sensors mit dem Index 0 (es können mehrere Sensoren angeschlossen werden)
  float tempC = sensors.getTempCByIndex(0); 
  // Ausgabe des Wertes an die Serielle Schnittstelle
  Serial.println(tempC);

  oled.setFont(System5x7);  // Schriftart festlegen
  oled.clear();             //Display löschen
  oled.println("Temperatur"); 
  oled.println(tempC);
  delay(1000); 
}
```
<br>

[zurück](../../index.html)


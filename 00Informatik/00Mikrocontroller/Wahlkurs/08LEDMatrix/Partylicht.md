<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Partylicht
## Allgemeines
Auf der LED-Matrix sollen umso mehr LEDs leuchten, je lauter der Ton ist, der vom Mikrofon aufgezeichnet wird.  
Überprüfe vor dem Start noch einmal die Verkabelung:  
- LED-Matrix:
  - Rotes Kabel : + Pol der externen Spannungsquelle (+5 V)
  - Schwarzes Kabel: - Pol der externen Spannungsquelle (GND)
  - Gelbes Kabel: Datenkabel: Port 6 am Arduino
- Mikrofon
  - V : + Pol am Arduino oder an der externen Spannungsquelle (+5 V)
  - G : - Pol am Arduino oder an der externen Spannungsquelle (GND)
  - S : Signal- oder Datenkabel: Pin A0 am Arduino
## Programmcode

```C++
#include <Adafruit_NeoPixel.h>

// Pin für die WS2812 LEDs
#define DATA_PIN 6

// Anzahl der LEDs in der Matrix
#define NUM_LEDS 64

// Erstellen eines NeoPixel-Objekts
Adafruit_NeoPixel matrix = Adafruit_NeoPixel(NUM_LEDS, DATA_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  matrix.begin();           // Initialisieren der NeoPixel-Matrix
  matrix.show();            // Alle LEDs ausschalten
  Serial.begin(9600);      // Serielle Kommunikation starten
  randomSeed(analogRead(0)); // Zufallsgenerator initialisieren
}

void loop() {
  int micValue = analogRead(MIC_PIN);  // Mikrofonwert lesen
  int ledCount = map(micValue, 0, 1023, 0, NUM_LEDS);  // Mikrofonwert auf LED-Anzahl abbilden

  for (int i = 0; i < NUM_LEDS; i++) {
    // Zufällig RGB-Farbe erzeugen
    int red = random(0, 256);    
    int green = random(0, 256);
    int blue = random(0, 256);
    matrix.setPixelColor(i, matrix.Color(red, green, blue));  // LED einschalten mit zufälliger Farbe
  }

  matrix.show();  // Aktualisieren der LEDs
  delay(500);    // Kurze Pause
}
```
### Erläuterung des Codes
####   int ledCount = map(micValue, 0, 1023, 0, NUM_LEDS); 
Mit dem **map**-Befehl werden die Messwerte des Mikrofons (0-1023) in Werte für die LED-Matrix (0-63) umgeschrieben.  
Alternativ hätten wir auch einfach jeden Wert durch 4 teilen können. Der map-Befehl ist aber leichter zu programmieren. 
 

[zurück](../index.html)



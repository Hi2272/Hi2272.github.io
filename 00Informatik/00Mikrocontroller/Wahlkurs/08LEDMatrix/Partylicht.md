<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Partylicht
## Allgemeines
Auf der LED-Matrix sollen umso mehr LEDs leuchten, je lauter der Ton ist, der vom Mikrofon aufgezeichnet wird.  
Überprüfe vor dem Start noch einmal die Verkabelung:  
- LED-Matrix:
  Ist durch das Aufstecken automatisch mit dem Arduino verbunden. Der Datenpin ist Pin 13. Alle anderen Pins können an den gelben Buchsen verwendet werden.
- Mikrofon
  - V : + Pol am Arduino oder an der externen Spannungsquelle (+5 V)
  - G : - Pol am Arduino oder an der externen Spannungsquelle (GND)
  - S : Signal- oder Datenkabel: Pin A0 am Arduino
## Programmcode

```C++
#include <Adafruit_NeoPixel.h>

// Mikrofon-Pin
const int MIC_PIN = A0;

// Pin für die WS2812 LEDs
#define DATA_PIN 13

// Anzahl der LEDs in der Matrix
#define NUM_LEDS 40

// Erstellen eines NeoPixel-Objekts
Adafruit_NeoPixel matrix = Adafruit_NeoPixel(NUM_LEDS, DATA_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  matrix.begin();           // Initialisieren der NeoPixel-Matrix
  matrix.show();            // Alle LEDs ausschalten
  Serial.begin(9600);      // Serielle Kommunikation starten
  randomSeed(analogRead(0)); // Zufallsgenerator initialisieren
}

void loop() {
  int micValue = analogRead(MIC_PIN); 
  Serial.print(micValue);
  Serial.print(": ");
  
   // Mikrofonwert lesen
  int ledCount = map(micValue, 0, 1023, 0, NUM_LEDS);  // Mikrofonwert auf LED-Anzahl abbilden
  Serial.println(ledCount);
  for (int i = 0; i < ledCount; i++) {
    // Zufällig RGB-Farbe erzeugen
    int red = random(0, 256);    
    int green = random(0, 256);
    int blue = random(0, 256);
    matrix.setPixelColor(i, matrix.Color(red, green, blue));  // LED einschalten mit zufälliger Farbe
  }
  for (int i=ledCount;i<NUM_LEDS;i++){
    matrix.setPixelColor(i, matrix.Color(0,0,0));  // LED einschalten mit zufälliger Farbe
    
  }

  matrix.show();  // Aktualisieren der LEDs
  delay(1);    // Kurze Pause
}
```
### Erläuterung des Codes
####   int ledCount = map(micValue, 0, 1023, 0, NUM_LEDS); 
Mit dem **map**-Befehl werden die Messwerte des Mikrofons (0-1023) in Werte für die LED-Matrix (0-63) umgeschrieben.  
Alternativ hätten wir auch einfach jeden Wert durch 4 teilen können. Der map-Befehl ist aber leichter zu programmieren.   

Teste das Programm durch Klatschen.

### Verbesserungen
#### a) Ständig leuchtende Pixel
Abhängig vom Grundgeräusch-Pegel leuchten die ersten LEDs ständig.  
Um dies zu beseitigen, sind folgende Schritte nötig:  
1. Ermittele in der **setup**-Methode durch 10 Messungen mit 10 ms Pause den Grund-Pegel.
2. Speichere diesen Wert in einer globalen Variable.
3. Ziehe diesen Wert von jedem Messwert ab. 
#### b) Empfindlichkeit verändern.
Experimentiere mit den Messwerten oder der map-Funktion, damit die Matrix empfindlicher wird.






[zurück](../index.html)



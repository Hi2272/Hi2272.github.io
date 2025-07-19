<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# LED Matrix

## Matrix Shield
Im Kurs arbeiten wir mit einem LED-Matrix-Shield, das einfach auf den Arduino Uno aufgesteckt wird.  
Die 40 LEDs sind intern an den Pin13 des Unos angeschlossen.

## 64 LED Matrix
Auf dieser Seite wird eine Matrix mit 64 LEDs programmiert. Hierbei können mehrere Matrizes aneinander gekettet werden:  
[64LED](64LED.html)  


## Allgemeines
Die LED-Matrix besteht aus vielen RGB-LEDs, die alle einzeln über eine einzige Datenleitung programmiert werden können. 

## Adafruit-Bibliothek
Für die Ansteuerung der Matrix benötigen wir die Adafruit_Neopixel Bibliothek, die wir wie üblich in der Arduino-IDE installieren.
## Programm-Code
Programmiere folgenden Code:
  
```C++
#include <Adafruit_NeoPixel.h>

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
#### #include <Adafruit_NeoPixel.h>
Bindet die Neopixel-Bibliothek von Adafruit ein. Die WS2812-LEDs werden auch als Neopixel bezeichnet. 
#### Adafruit_NeoPixel matrix = Adafruit_NeoPixel(NUM_LEDS, DATA_PIN, NEO_GRB + NEO_KHZ800);
Erzeugt das Objekt matrix, mit dem die LED-Matrix angesprochen werden kann.  
Die Parameter haben folgende Bedeutung:  
- NUM_LEDS: Anzahl der LEDs (64)
- DATA_PIN: Digitalpin, über den die Matrix angeschlossen ist (6)
- NEO_GRB: Die Reihenfolge in der Farbkanäle unserer LEDs angesteuert werden (**G**rün, **R**ot, **B**lau)
- NEO_KHZ800: Die LEDs werden mit einer Frequenz von **800 kHz** angesteuert.


####   randomSeed(analogRead(0)); 
Mit diesem Befehl wird der Zufallsgenerator auf einen zufälligen Wert gesetzt. Hierzu verwendet man den Wert zwischen 0 und 1023 der gerade zufällig an Pin 0 anliegt.

#### int red = random(0, 256);    
Setzt den Rot-Wert der Farbe auf eine Zufallszahl zwischen 0 und 255. Die obere Grenze wird 256 wird generell nicht erreicht.


#### matrix.setPixelColor(i, matrix.Color(red, green, blue));
Setzt die Farbe des Pixels mit der Nr. i auf den Farbwert, der in matrix.Color(r,g,b) definiert wird.

####  matrix.show(); 
Mit diesem Befehl werden die neuen Farben auf den LEDs angezeigt.

[weiter zum Mikrofon](mikrofon.html)  
[zurück](../index.html)

<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# LED Matrix

Die LED-Matrix wird an Pin6 am Arduino angeschlossen. Da die Matrix relativ viel Strom benötigt, schließen wir sie an eine externe Spannungsquelle an:
- Rotes Kabel : + Pol der externen Spannungsquelle (+5 V)
- Schwarzes Kabel: - Pol der externen Spannungsquelle (GND)
- Gelbes Kabel: Datenkabel: Pin 6 am Arduino

## Test-Code für 4 Matrizes

```C++
#include <Adafruit_NeoPixel.h>

// Pin für die WS2812 LEDs: Pin6
#define DATA_PIN 6

// Anzahl der LEDs (64 pro Matrix * 4 Matrizes)
#define NUM_LEDS 64*4
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
    int red = random(0, 30);    
    int green = random(0,30);
    int blue = random(0, 30);
    matrix.setPixelColor(i, matrix.Color(red, green, blue));  // LED einschalten mit zufälliger Farbe
  }

  matrix.show();  // Aktualisieren der LEDs
  delay(500);    // Kurze Pause
}
```

## Text über die Matrix scrollen

Die Bibliothek Adafruit NeoMatrix ermöglicht das Scrollen von Text über die Matrix. Der folgende Code ist das Beispiel MatrixGFXDemo:

```C++
// Adafruit_NeoMatrix example for single NeoPixel Shield.
// Scrolls Text across the matrix in a portrait (vertical) orientation.

#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>

#define PIN 6
#define text "Hallo!"
// MATRIX DECLARATION:
// Parameter 1 = width of NeoPixel matrix
// Parameter 2 = height of matrix
// Parameter 3 = pin number (most are valid)
// Parameter 4 = matrix layout flags, add together as needed:
//   NEO_MATRIX_TOP, NEO_MATRIX_BOTTOM, NEO_MATRIX_LEFT, NEO_MATRIX_RIGHT:
//     Position of the FIRST LED in the matrix; pick two, e.g.
//     NEO_MATRIX_TOP + NEO_MATRIX_LEFT for the top-left corner.
//   NEO_MATRIX_ROWS, NEO_MATRIX_COLUMNS: LEDs are arranged in horizontal
//     rows or in vertical columns, respectively; pick one or the other.
//   NEO_MATRIX_PROGRESSIVE, NEO_MATRIX_ZIGZAG: all rows/columns proceed
//     in the same order, or alternate lines reverse direction; pick one.
//   See example below for these values in action.
// Parameter 5 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_GRBW    Pixels are wired for GRBW bitstream (RGB+W NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)


// Example for NeoPixel Shield.  In this application we'd like to use it
// as a 5x8 tall matrix, with the USB port positioned at the top of the
// Arduino.  When held that way, the first pixel is at the top right, and
// lines are arranged in columns, progressive order.  The shield uses
// 800 KHz (v2) pixels that expect GRB color data.
Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(8*4, 8, PIN,
  NEO_MATRIX_TOP     + NEO_MATRIX_RIGHT +
  NEO_MATRIX_COLUMNS + NEO_MATRIX_PROGRESSIVE,
  NEO_GRB            + NEO_KHZ800);

const uint16_t colors[] = {
  matrix.Color(255, 0, 0), matrix.Color(0, 255, 0), matrix.Color(0, 0, 255) };

void setup() {
  matrix.begin();
  matrix.setTextWrap(false);
  matrix.setBrightness(40);
  matrix.setTextColor(colors[0]);
}

int x    = matrix.width();
int pass = 0;

void loop() {
  matrix.fillScreen(0);
  matrix.setCursor(x, 0);
  matrix.print(F(text));
  if(--x < -36) {
    x = matrix.width();
    if(++pass >= 3) pass = 0;
    matrix.setTextColor(colors[pass]);
  }
  matrix.show();
  delay(100);
}
```

## Anschluss an ESP32

Die LED-Matrices können auch an +5V und GND an einen ESP32-Controller angeschlossen werden:


Als Datenpin dient hier der GPIO23:

```C++
#include <Adafruit_NeoPixel.h>

// Pin für die WS2812 LEDs: Pin6
#define DATA_PIN 23

// Anzahl der LEDs (64 pro Matrix * 4 Matrizes)
#define NUM_LEDS 64*4
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
    int red = random(0, 30);    
    int green = random(0,30);
    int blue = random(0, 30);
    matrix.setPixelColor(i, matrix.Color(red, green, blue));  // LED einschalten mit zufälliger Farbe
  }

  matrix.show();  // Aktualisieren der LEDs
  delay(500);    // Kurze Pause
}
```
### Scroll-Text
```C++
// Adafruit_NeoMatrix example for single NeoPixel Shield.
// Scrolls Text across the matrix in a portrait (vertical) orientation.

#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>

#define PIN 23
#define text "Hallo!"
// MATRIX DECLARATION:
// Parameter 1 = width of NeoPixel matrix
// Parameter 2 = height of matrix
// Parameter 3 = pin number (most are valid)
// Parameter 4 = matrix layout flags, add together as needed:
//   NEO_MATRIX_TOP, NEO_MATRIX_BOTTOM, NEO_MATRIX_LEFT, NEO_MATRIX_RIGHT:
//     Position of the FIRST LED in the matrix; pick two, e.g.
//     NEO_MATRIX_TOP + NEO_MATRIX_LEFT for the top-left corner.
//   NEO_MATRIX_ROWS, NEO_MATRIX_COLUMNS: LEDs are arranged in horizontal
//     rows or in vertical columns, respectively; pick one or the other.
//   NEO_MATRIX_PROGRESSIVE, NEO_MATRIX_ZIGZAG: all rows/columns proceed
//     in the same order, or alternate lines reverse direction; pick one.
//   See example below for these values in action.
// Parameter 5 = pixel type flags, add together as needed:
//   NEO_KHZ800  800 KHz bitstream (most NeoPixel products w/WS2812 LEDs)
//   NEO_KHZ400  400 KHz (classic 'v1' (not v2) FLORA pixels, WS2811 drivers)
//   NEO_GRB     Pixels are wired for GRB bitstream (most NeoPixel products)
//   NEO_GRBW    Pixels are wired for GRBW bitstream (RGB+W NeoPixel products)
//   NEO_RGB     Pixels are wired for RGB bitstream (v1 FLORA pixels, not v2)


// Example for NeoPixel Shield.  In this application we'd like to use it
// as a 5x8 tall matrix, with the USB port positioned at the top of the
// Arduino.  When held that way, the first pixel is at the top right, and
// lines are arranged in columns, progressive order.  The shield uses
// 800 KHz (v2) pixels that expect GRB color data.
Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(8*4, 8, PIN,
  NEO_MATRIX_TOP     + NEO_MATRIX_RIGHT +
  NEO_MATRIX_COLUMNS + NEO_MATRIX_PROGRESSIVE,
  NEO_GRB            + NEO_KHZ800);

const uint16_t colors[] = {
  matrix.Color(255, 0, 0), matrix.Color(0, 255, 0), matrix.Color(0, 0, 255) };

void setup() {
  matrix.begin();
  matrix.setTextWrap(false);
  matrix.setBrightness(40);
  matrix.setTextColor(colors[0]);
}

int x    = matrix.width();
int pass = 0;

void loop() {
  matrix.fillScreen(0);
  matrix.setCursor(x, 0);
  matrix.print(F(text));
  if(--x < -36) {
    x = matrix.width();  
    if(++pass >= 3) pass = 0;
    matrix.setTextColor(colors[pass]);
  }
  matrix.show();
  delay(100);
}
```
[zurück](index.html)

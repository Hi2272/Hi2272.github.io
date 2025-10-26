#include <Adafruit_NeoPixel.h>

// Definiere die Anzahl der Pixel
#define NUMPIXELS 256 // 8x32 Matrix
#define PIN 2 // Datenpin D2

Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  pixels.begin(); // Initialisierung der Neopixel
  pixels.show();  // Alle Pixel auf "aus" setzen
}

void loop() {
  // Überblende von Rot zu Blau zu Grün
  for (int j = 0; j < 256; j++) {
    for (int i = 0; i < NUMPIXELS; i++) {
      // Setze die Farbe jedes Pixels
      pixels.setPixelColor(i, pixels.Color(j, 0, 255 - j)); // Rot zu Blau
    }
    pixels.show();
    delay(20);
  }

  for (int j = 0; j < 256; j++) {
    for (int i = 0; i < NUMPIXELS; i++) {
      // Setze die Farbe jedes Pixels
      pixels.setPixelColor(i, pixels.Color(255 - j, j, 0)); // Blau zu Grün
    }
    pixels.show();
    delay(20);
  }
}

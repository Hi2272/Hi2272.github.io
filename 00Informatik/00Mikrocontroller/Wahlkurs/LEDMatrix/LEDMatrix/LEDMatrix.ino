#include <Adafruit_NeoPixel.h> // Bibliothek für Steuerung von NeoPixel LEDs
#ifdef __AVR__
#include <avr/power.h> // AVR spezifische Funktionen für die Energieverwaltung
#endif

#define PIN 13 // Definition des Arduino-Pins, an dem die LED-Leiste angeschlossen ist
int nr = 0; // Variable zur Speicherung des aktuellen Effektes
unsigned long zeit; // Variable zur Speicherung der Zeit
Adafruit_NeoPixel matrix = Adafruit_NeoPixel(40, PIN, NEO_GRB + NEO_KHZ800); // Initialisierung des NeoPixel Objekts

void setup() {
#if defined(__AVR_ATtiny85__)
  if (F_CPU == 16000000) clock_prescale_set(clock_div_1); // Anpassung der Taktfrequenz für bestimmte Mikrocontroller
#endif
  pinMode(7, INPUT_PULLUP); // Setzen des Pin 7 als Eingang mit internem Pull-Up-Widerstand
  zeit = millis(); // Startzeit speichern
  matrix.begin(); // Initialisierung der LED-Leiste
  matrix.show(); // Alle LEDs ausschalten (initialisieren)
}

void loop() {
  while (digitalRead(7) == HIGH && millis() - zeit < 600000) { delay(1); } // Warten auf einen Tastendruck oder 10 Minuten
  zeit = millis(); // Zeit zurücksetzen
  nr++; // Nächsten Effekt auswählen
  nr = nr % 5; // Sicherstellen, dass der Wert von nr zwischen 0 und 4 bleibt
  switch (nr) {
    case 0: // Effekt 0
      ausfuellen(matrix.Color(255, 0, 0), 50); // Füllen mit roter Farbe
      ausfuellen(matrix.Color(0, 255, 0), 50); // Füllen mit grüner Farbe
      ausfuellen(matrix.Color(0, 0, 255), 50); // Füllen mit blauer Farbe
      break;
    case 1: // Effekt 1
      regenTropfen(matrix.Color(127, 127, 127), 50); // Regen-Tropfen mit weißer Farbe
      regenTropfen(matrix.Color(127, 0, 0), 50); // Regen-Tropfen mit roter Farbe
      regenTropfen(matrix.Color(0, 0, 127), 50); // Regen-Tropfen mit blauer Farbe
      break;
    case 2: // Effekt 2
      regenbogen(20); // Regenbogen-Effekt
      break;
    case 3: // Effekt 3
      regenbogenKreis(20); // Regenbogen-Kreis-Effekt
      break;
    case 4: // Effekt 4
      regenTropfenFarbig(50); // Farbige Regen-Tropfen
      break;
  }
  ausfuellen(matrix.Color(0, 0, 0), 1); // Matrix schnell löschen
}

// Füllt die LEDs mit einer bestimmten Farbe
void ausfuellen(uint32_t c, uint8_t wait) {
  for (uint16_t i = 0; i < matrix.numPixels(); i++) {
    matrix.setPixelColor(i, c); // Setzt die Farbe für die aktuelle LED
    matrix.show(); // Aktualisiert die LEDs
    delay(wait); // Kurze Pause
  }
}

// Regenbogen-Effekt
void regenbogen(uint8_t wait) {
  uint16_t i, j;

  for (j = 0; j < 256; j++) { // 256 Farbübergänge
    for (i = 0; i < matrix.numPixels(); i++) {
      matrix.setPixelColor(i, Wheel((i + j) & 255)); // Setzt die Farbe der LEDs mit dem Wheel-Funktionswert
    }
    matrix.show(); // Aktualisiert die Farbdarstellung
    delay(wait); // Kurze Pause
  }
}

// Regenbogen-Effekt über die Länge der LED-Leiste
void regenbogenKreis(uint8_t wait) {
  uint16_t i, j;

  for (j = 0; j < 256 * 5; j++) { // 5 Zyklen durch alle Regenbogenfarben
    for (i = 0; i < matrix.numPixels(); i++) {
      matrix.setPixelColor(i, Wheel(((i * 256 / matrix.numPixels()) + j) & 255)); // Setzt die Farbe basierend auf der Position
    }
    matrix.show(); // Aktualisiert die LEDs
    delay(wait); // Kurze Pause
  }
}

// Regen-Tropfen-Effekt
void regenTropfen(uint32_t c, uint8_t wait) {
  for (int j = 0; j < 10; j++) { // 10 Zyklen von Regen-Tropfen
    for (int q = 0; q < 3; q++) {
      for (int i = 0; i < matrix.numPixels(); i = i + 3) {
        matrix.setPixelColor(i + q, c); // Setzt jede dritte LED auf die gegebene Farbe
      }
      matrix.show(); // Aktualisiert die LEDs
      delay(wait); // Kurze Pause
      for (int i = 0; i < matrix.numPixels(); i = i + 3) {
        matrix.setPixelColor(i + q, 0); // Schaltet jede dritte LED wieder aus
      }
    }
  }
}

// Farbige Regen-Tropfen-Effekt
void regenTropfenFarbig(uint8_t wait) {
  for (int j = 0; j < 256; j++) { // Zyklus durch alle 256 Farben im Regenbogen
    for (int q = 0; q < 3; q++) {
      for (int i = 0; i < matrix.numPixels(); i = i + 3) {
        matrix.setPixelColor(i + q, Wheel((i + j) % 255)); // Setzt jede dritte LED auf eine andere Farbe
      }
      matrix.show(); // Aktualisiert die LEDs
      delay(wait); // Kurze Pause
      for (int i = 0; i < matrix.numPixels(); i = i + 3) {
        matrix.setPixelColor(i + q, 0); // Schaltet jede dritte LED wieder aus
      }
    }
  }
}

// Gibt einen Farbwert basierend auf der Eingabe von 0 bis 255 zurück.
uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos; // Umkehrung des Farbwerts
  if (WheelPos < 85) {
    return matrix.Color(255 - WheelPos * 3, 0, WheelPos * 3); // Rote bis blaue Übergänge
  }
  if (WheelPos < 170) {
    WheelPos -= 85;
    return matrix.Color(0, WheelPos * 3, 255 - WheelPos * 3); // Blaue bis grüne Übergänge
  }
  WheelPos -= 170;
  return matrix.Color(WheelPos * 3, 255 - WheelPos * 3, 0); // Grüne bis rote Übergänge
}

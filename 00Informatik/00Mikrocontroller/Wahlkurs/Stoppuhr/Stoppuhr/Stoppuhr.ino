#include <Adafruit_NeoPixel.h>  // Importiere die Adafruit NeoPixel-Bibliothek für die Steuerung von RGB-LEDs

// Definiere die Pins für die Neopixel-Matrix, den Taster und den Bewegungsmelder
#define PIN_NEOPIXEL 6          // Pin, an dem die Neopixel-Matrix angeschlossen ist
#define PIN_TASTER 2            // Pin, an dem der Taster angeschlossen ist
#define PIN_BEWEGUNGSMELDER 10  // Pin, an dem der Bewegungsmelder angeschlossen ist

// Initialisiere die Neopixel-Matrix mit 64 Pixeln (8x8 Matrix) und definiere die Farbanordnung
Adafruit_NeoPixel matrix = Adafruit_NeoPixel(64, PIN_NEOPIXEL, NEO_GRB + NEO_KHZ800);

// Variablen zur Steuerung der Stoppuhr
unsigned long startZeit = 0;         // Startzeit der Stoppuhr in Millisekunden
bool laeuft = false;                 // Status, ob die Stoppuhr läuft (true/false)
bool bewegungErkannt = false;        // Status, ob eine Bewegung erkannt wurde (true/false)
unsigned long bewegungAktivBis = 0;  // Zeit, bis zu der die Matrix aktiv bleibt (Millisekunden)

void setup() {
  // Initialisiere die NeoPixel-Matrix
  matrix.begin();
  matrix.show();  // Initialisiere alle Pixel auf 'aus'

  // Setze den Taster-Pin als Eingang mit Pull-up Widerstand
  pinMode(PIN_TASTER, INPUT_PULLUP);

  // Setze den Bewegungsmelder-Pin als Eingang
  pinMode(PIN_BEWEGUNGSMELDER, INPUT);

  Serial.begin(9600);  // Starte die serielle Kommunikation (optional, für Debugging)
}

void loop() {
  // Überprüfe den Zustand des Tasters
  if (digitalRead(PIN_TASTER) == LOW) {
    // Taster gedrückt, zurücksetzen oder starten
    if (!laeuft) {
      // Stoppuhr zurücksetzen
      startZeit = millis();  // Setze die Startzeit auf die aktuelle Zeit
      laeuft = true;         // Setze den Status auf 'läuft'
    } else {
      // Stoppuhr stoppen
      laeuft = false;  // Setze den Status auf 'stopped'
    }
    while (digitalRead(PIN_TASTER) == LOW) {  // Jeder Tastendruck wird nur einmal wahrgenommen
      delay(1);
    }
  }
  // Überprüfe den Bewegungsmelder
  if (digitalRead(PIN_BEWEGUNGSMELDER) == HIGH) {
    bewegungErkannt = true;                       // Bewegung erkannt
    bewegungAktivBis = millis() + 5 * 60 * 1000;  // Setze die Zeit, bis die Matrix aktiv bleibt (5 Minuten)
  }

  // Wenn Bewegung erkannt wurde, die Matrix aktiv halten
  if (bewegungErkannt && millis() < bewegungAktivBis) {
    if (laeuft) {
      aktualisiereStoppuhr();  // Aktualisiere die Stoppuhr
    }
  } else {
    fuelleMatrix(0);          // Matrix ausschalten, wenn keine Bewegung
    bewegungErkannt = false;  // Zurücksetzen der Bewegungserkennung
  }

  delay(100);  // Update alle 100 ms
}

// Update der Stoppuhr und Anzeige auf der Matrix
void aktualisiereStoppuhr() {
  unsigned long vergangen = (millis() - startZeit) / 1000;  // Berechne die vergangene Zeit in Sekunden
  if (vergangen >= 86400) {                                 // mehr als 24 Stunden
    startZeit = millis();                                   // Zurücksetzen der Stoppuhr
  }

  int stunden = vergangen / 3600;         // Berechne die Stunden
  int minuten = (vergangen % 3600) / 60;  // Berechne die Minuten
  int sekunden = vergangen % 60;          // Berechne die Sekunden

  fuelleMatrix(0);  // Matrix löschen

  // LEDs für Sekunden anzeigen
  zeigeSekunden(sekunden);

  // LEDs für Minuten anzeigen
  zeigeMinuten(minuten);

  // LEDs für Stunden anzeigen
  zeigeStunden(stunden);
  matrix.show();  // Aktualisiere die Matrix
}

// Funktion zum Anzeigen der Sekunden auf der Matrix
void zeigeSekunden(int sekunden) {
  // Einerstelle der Sekunden
  int einerSekunde = sekunden % 10;  // Berechne die Einerstelle
  for (int i = 0; i < einerSekunde; i++) {
    matrix.setPixelColor(i, matrix.Color(255, 0, 0));  // Rot für die Einerstelle
  }

  // Zehnerstelle der Sekunden
  int zehnerSekunde = (sekunden / 10) % 10;  // Berechne die Zehnerstelle
  for (int i = 10; i < 10 + zehnerSekunde; i++) {
    matrix.setPixelColor(i, matrix.Color(255, 255, 0));  // Geld für die Zehnerstelle
  }
}

// Funktion zum Anzeigen der Minuten auf der Matrix
void zeigeMinuten(int minuten) {
  // Einerstelle der Minuten
  int einerMinute = minuten % 10;  // Berechne die Einerstelle
  for (int i = 17; i < 17 + einerMinute; i++) {
    matrix.setPixelColor(i, matrix.Color(0, 255, 0));  // Grün für die Einerstelle der Minuten
  }
  // Zehnerstelle der Minuten
  int zehnerMinute = (minuten / 10) % 10;  // Berechne die Zehnerstelle
  for (int i = 28; i < 28 + zehnerMinute; i++) {
    matrix.setPixelColor(i, matrix.Color(0, 0, 255));  // Blau für die Zehnerstelle
  }
}

// Funktion zum Anzeigen der Stunden auf der Matrix
void zeigeStunden(int stunden) {
  // Stunden werden in 24 Stunden angezeigt, daher max 24 LEDs
  for (int i = 35; i < 35 + stunden; i++) {
    matrix.setPixelColor(i, matrix.Color(255, 255, 255));  // Weiß für die Stunden
  }
}

// Funktion zum Füllen der Matrix mit einer Farbe (optional, nicht verwendet hier)
void fuelleMatrix(uint32_t farbe) {
  for (int i = 0; i < matrix.numPixels(); i++) {
    matrix.setPixelColor(i, farbe);  // Setze die Farbe für jedes Pixel
  }
  matrix.show();  // Aktualisiere die Matrix
}
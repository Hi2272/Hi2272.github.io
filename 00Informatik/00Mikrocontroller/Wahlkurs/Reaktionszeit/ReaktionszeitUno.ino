#include <Adafruit_GFX.h>  // Einbinden der Adafruit-Grafikbibliothek
#include <Adafruit_ST7735.h> // Einbinden der hardware-spezifischen ST7735-Bibliothek
#include <SPI.h> // Einbinden der SPI-Bibliothek
#define TFT_CS 10 // Chip Select Pin für TFT
#define TFT_RST 8 // Reset Pin für TFT
#define TFT_DC 9 // Data/Command Pin für TFT
Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RST); // Initialisierung des TFT Displays

// Definition der Pins für die LEDs
int pinGruen = 6;
int pinGelb = 7;
int pinRot = 12;

int taster = 5; // Pin für den Taster

// Variablen zur Speicherung der Reaktionszeiten
unsigned long zeit; 
unsigned long zeiten[100]; // Array zur Speicherung von maximal 100 Reaktionszeiten
unsigned long anz = 0; // Zähler für die Anzahl der Messungen

int minZeit = 100000; // Variable für die minimal gemessene Reaktionszeit
boolean fehlstart = false; // Flag für Fehlstarts

void setup(void) {
  Serial.begin(9600); // Initialisierung der seriellen Kommunikation
  tft.initR(INITR_BLACKTAB); // Initialisierung des TFT-Displays
  tft.fillScreen(ST77XX_BLACK); // Hintergrund auf Schwarz setzen
  Serial.println("Setup abgeschlossen!"); // Debug-Ausgabe
  pinMode(pinRot, OUTPUT); // Roten LED-Pin als Ausgang festlegen
  pinMode(pinGelb, OUTPUT); // Gelben LED-Pin als Ausgang festlegen
  pinMode(pinGruen, OUTPUT); // Grünen LED-Pin als Ausgang festlegen
  pinMode(taster, INPUT_PULLUP); // Taster-Pin mit internem Pull-Up-Widerstand als Eingang festlegen
  randomSeed(analogRead(0)); // Zufallszahlengenerator initialisieren
  ausgabeStandby(); // Standby-Anzeige auf dem TFT
}

// Funktion, die auf das Drücken des Tasters wartet
bool warteAufTaste(bool blink) {
  int pause = 0; // Initialisiere den Blink-Zähler
  while (digitalRead(taster) == HIGH) { // Warte, bis der Taster gedrückt wird
    if (millis() - zeit > 300000) { // Timeout von 5 Minuten
      ausgabeStandby(); // Zeige Standby-Anzeige an
      zeit = millis(); // Setze die aktuelle Zeit
      while (digitalRead(taster) == LOW) { delay(1); } // Warten, bis der Taster losgelassen wird
      return false; // Rückgabe bei Timeout
    }
    if (blink) {
      pause = pause + 1; // Erhöhe den Blink-Zähler
      pause = pause % 2000; // Zyklische Begrenzung auf 2000
      if (pause % 2000 > 1000) { // Blinkfunktion implementieren
        aus(); // Schalte alle LEDs aus
      } else {
        gelb(); // Schalte die gelbe LED ein
      }
    }
    delay(1); // Kurze Verzögerung
  }
  while (digitalRead(taster) == LOW) { delay(1); } // Warten, bis der Taster losgelassen wird

  return true; // Rückgabe bei erfolgreichem Tastendruck
}

void loop() {
  zeit = millis(); // Startzeit speichern
  fehlstart = false; // Fehlstart-Flag zurücksetzen
  bool b = warteAufTaste(true); // Warten auf den Taster mit Blinkfunktion
  ausgabeStart(); // Anzeige für den Start
  b = warteAufTaste(false); // Warten auf den Taster ohne Blinkfunktion
  ausgabeMessung(); // Anzeige für die Messung
  gruen(); // Schalte die grüne LED ein
  int warteZeit = 1000 + random(6000); // Wartezeit zwischen 1 und 7 Sekunden
  while (warteZeit > 0 && !fehlstart) { // Während der Wartezeit
    if (digitalRead(taster) == LOW) { // Überprüfe, ob der Taster gedrückt wurde
      ausgabeFehlstart(); // Fehlstart anzeigen
      fehlstart = true; // Setze Fehlstart-Flag
      warteZeit = 0; // Breche die Wartezeit ab
      while (digitalRead(taster) == LOW) { delay(1); } // Warten, bis der Taster losgelassen wird
    }
    delay(1); // Kurze Verzögerung
    warteZeit--; // Verringere die Wartezeit
  }

  if (!fehlstart) { // Wenn kein Fehlstart
    while (digitalRead(taster) == LOW) { delay(1); } // Warten, bis der Taster losgelassen wird
    rot(); // Schalte die rote LED ein
    zeit = millis(); // Speichere die aktuelle Zeit vor dem Tastendruck
    while (digitalRead(taster) == HIGH) { delay(1); } // Warten, bis der Taster gedrückt wird
    zeit = millis() - zeit; // Berechne die Reaktionszeit

    zeiten[anz % 100] = zeit; // Speichere die Reaktionszeit im Array
    anz++; // Erhöhe die Anzahl der Messungen
    ausgabeErgebnis(mw()); // Zeige das Ergebnis auf dem Display an
    while (digitalRead(taster) == LOW) { delay(1); } // Warten, bis der Taster losgelassen wird
  }
}

// Funktion zum Zeichnen von Text auf dem TFT-Display
void drawtext(String text, uint16_t color) {
  drawtext(text, 0, 50, color, 2); // Text zentral in der Höhe positionieren
}

void drawtext(String text, int x, int y, uint16_t color, int size) {
  tft.setCursor(x, y); // Setze den Zeichencursor
  tft.setTextColor(color); // Setze die Textfarbe
  tft.setTextSize(size); // Setze die Textgröße
  tft.setTextWrap(true); // Textumbruch aktivieren
  tft.print(text); // Text auf dem Display ausgeben
}

// Funktion zur Anzeige des Reaktionsergebnisses
void ausgabeErgebnis(double mw) {
  tft.fillScreen(ST77XX_BLACK); // Hintergrund auf Schwarz setzen
  drawtext("Deine Reaktionszeit:", 5, 3, ST77XX_WHITE, 1); // Reaktionszeit-Anzeige
  drawtext(String(zeit) + " ms", 30, 20, ST77XX_RED, 2); // Zeige die gemessene Reaktionszeit an
  if (anz < 100) {
    drawtext("Statistik", 30, 45, ST77XX_WHITE, 1);
    drawtext("aus " + String(anz) + " Messungen:", 10, 55, ST77XX_WHITE, 1);
  } else {
    drawtext("Statistik", 30, 45, ST77XX_WHITE, 1);
    drawtext("aus 100 Messungen:", 10, 55, ST77XX_WHITE, 1);
  }
  if (zeit < minZeit) {
    drawtext("Neue Rekordzeit!", 15, 71, ST77XX_RED, 1);
    minZeit = zeit; // Aktualisiere die minimale Zeit
  } else {
    drawtext("Geringste Zeit:", 10, 71, ST77XX_WHITE, 1);
    drawtext(String(minZeit) + " ms", 40, 86, ST77XX_YELLOW, 1);
  }
  drawtext("Mittlere Zeit:", 12, 101, ST77XX_WHITE, 1);
  drawtext(String(mw) + " ms", 40, 116, ST77XX_YELLOW, 1); // Zeige die mittlere Zeit an
  drawtext("Taste", 28, 133, ST77XX_RED, 2); // Starthinweis
  drawtext("-> Neue Messung", 15, 150, ST77XX_RED, 1); // Hinweis für eine neue Messung
}

// Funktion für die Anzeige während der Messung
void ausgabeMessung() {
  tft.fillScreen(ST77XX_BLACK); // Hintergrund auf Schwarz setzen
  drawtext("Wenn die", 23, 5, ST77XX_WHITE, 2);
  drawtext("Ampel", 38, 25, ST77XX_WHITE, 2);
  drawtext("ROT", 38, 48, ST77XX_RED, 3); // Farbe Rot für die Ampel
  drawtext("wird,", 38, 75, ST77XX_WHITE, 2);
  drawtext("TASTE", 18, 105, ST77XX_RED, 3); // Hinweis, die Taste zu drücken
  drawtext("druecken!", 18, 140, ST77XX_WHITE, 2);
}

// Funktion zur Anzeige am Start
void ausgabeStart() {
  tft.fillScreen(ST77XX_BLACK); // Hintergrund auf Schwarz setzen
  drawtext("Zum Start", 10, 5, ST77XX_WHITE, 2);
  drawtext("bitte", 34, 35, ST77XX_WHITE, 2);
  drawtext("TASTE", 18, 70, ST77XX_RED, 3); // Hinweis, die Taste zu drücken
  drawtext("druecken!", 12, 105, ST77XX_WHITE, 2);
}

// Funktion zur Anzeige eines Fehlstarts
void ausgabeFehlstart() {
  tft.fillScreen(ST77XX_BLACK); // Hintergrund auf Schwarz setzen
  drawtext("Fehl-", 18, 25, ST77XX_RED, 3);
  drawtext("start!", 18, 60, ST77XX_RED, 3);
  drawtext("Taste", 28, 133, ST77XX_RED, 2); // Hinweis für neuen Versuch
  drawtext("-> Neue Messung", 15, 150, ST77XX_RED, 1);
}

// Funktion zur Anzeige im Standby-Zustand
void ausgabeStandby() {
  uint16_t farben[] = { ST77XX_RED, ST77XX_YELLOW, ST77XX_WHITE, ST77XX_BLUE, ST77XX_GREEN }; // Farbpalette
  int zaehler = 0; // Zähler für die Blinkzeit
  while (digitalRead(taster) == HIGH) { // Solange der Taster nicht gedrückt wird
    zaehler = zaehler + 1; // Zähler erhöhen
    if (zaehler > 1000) { // Wenn Zähler einen Schwellenwert erreicht
      tft.fillScreen(ST77XX_BLACK); // Hintergrund auf Schwarz setzen
      drawtext("TASTE druecken!", random(38), random(150), farben[random(5)], 1); // Zeige zufällige Nachricht
      zaehler = 0; // Zähler zurücksetzen
    }
    delay(1); // Kurze Verzögerung
  }
}

// Funktion zum Steuern der gelben LED
void gelb() {
  digitalWrite(pinGruen, LOW); // Grüne LED ausschalten
  digitalWrite(pinRot, LOW); // Rote LED ausschalten
  digitalWrite(pinGelb, HIGH); // Gelbe LED einschalten
}

// Funktion zum Steuern der roten LED
void rot() {
  digitalWrite(pinGruen, LOW); // Grüne LED ausschalten
  digitalWrite(pinRot, HIGH); // Rote LED einschalten
  digitalWrite(pinGelb, LOW); // Gelbe LED ausschalten
}

// Funktion zum Steuern der grünen LED
void gruen() {
  digitalWrite(pinGruen, HIGH); // Grüne LED einschalten
  digitalWrite(pinRot, LOW); // Rote LED ausschalten
  digitalWrite(pinGelb, LOW); // Gelbe LED ausschalten
}

// Funktion zum Ausschalten aller LEDs
void aus() {
  digitalWrite(pinGruen, LOW); // Grüne LED ausschalten
  digitalWrite(pinRot, LOW); // Rote LED ausschalten
  digitalWrite(pinGelb, LOW); // Gelbe LED ausschalten
}

// Funktion zur Berechnung der mittleren Reaktionszeit
double mw() {
  int summe = 0; // Summe der Reaktionszeiten
  if (zeiten[0] == 0) {
    return 0.0; // Rückgabe 0.0, wenn keine Messungen vorliegen
  }
  for (int i = 0; i < 100; i++) {
    if (zeiten[i] > 0) {
      summe = summe + zeiten[i]; // Summiere die gültigen Zeiten
    } else {
      return summe * 1.0 / i; // Berechne den Durchschnitt der bis hierhin gültigen Zeiten
    }
  }
  return summe * 1.0 / 100; // Durchschnitt über 100 Messungen
}

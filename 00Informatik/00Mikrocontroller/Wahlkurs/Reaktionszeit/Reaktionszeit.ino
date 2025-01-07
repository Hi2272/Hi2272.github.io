#include <Adafruit_GFX.h>     // Core graphics library
#include <Adafruit_ST7735.h>  // Hardware-specific library for ST7735
#include <SPI.h>
/* Verkabelung des Displays
Display	  Arduino	Bedeutung
LED	      3,3 V	  Hintergrundbeleuchtung
SCK	      13	    Taktgeber
SDA	      11	    MOSI: Datenübetragung Arduino - Display
A0	      9       DC s.u.	
RES, RST	8     	Reset RST s.u.
CS	      10	    Chip Select CS s.u.
GND	      GND	
VCC	      5V
*/

#define TFT_CS 10
#define TFT_RST 8
#define TFT_DC 9
Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RST);

// Pin-Definitionen für LEDs und Taster
const int pinLedGruen = 8;  // Pin für die grüne LED
const int pinLedRot = 9;    // Pin für die rote LED
const int pinTaster = 6;    // Pin für den Taster

unsigned long displayStartZeit;  // Variable zur Speicherung der Zeit, wann das Display aktiviert wurde

void setup() {
  pinMode(pinLedGruen, OUTPUT);      // Pin für die grüne LED als Ausgang festlegen
  pinMode(pinLedRot, OUTPUT);        // Pin für die rote LED als Ausgang festlegen
  pinMode(pinTaster, INPUT_PULLUP);  // Pin für den Taster als Eingang mit Pull-up-Widerstand festlegen

  // OLED-Display über SPI initialisieren
  tft.initR(INITR_BLACKTAB);  // Init ST7735S chip, black tab
  tft.fillScreen(ST77XX_BLACK); // Bildschirm löschen
  tft.setTextColor(ST7735_WHITE); // Weiße Schrift 

  Serial.begin(9600);  // Serielle Kommunikation starten
  digitalWrite(pinLedGruen, HIGH); // Grüne LED einschalten
  digitalWrite(pinLedRot, LOW);  // Rote LED ausschalten
  displayStartZeit = millis() + 60000;
}

void loop() {
  // Überprüfen, ob der Taster gedrückt wurde und keine Reaktion aufgetreten ist
  if (digitalRead(pinTaster) == LOW) {
    reaktionszeitMessen();  // Test durchführen
  }
  if (millis() - displayStartZeit >= 60000) {
    tft.fillScreen(ST7735_BLACK);  // Display löschen
  }
  delay(1);
}

void reaktionszeitMessen() {
  // Grüne LED einschalten
  digitalWrite(pinLedGruen, HIGH);
  digitalWrite(pinLedRot, LOW);  // Rote LED ausschalten

  // Warten für eine zufällige Zeit zwischen 5 und 15 Sekunden
  delay(random(5000, 15000));

  // Rote LED einschalten
  digitalWrite(pinLedGruen, LOW);
  digitalWrite(pinLedRot, HIGH);

  // Startzeit speichern
  unsigned long startZeit = millis();  // Variable zur Speicherung der Startzeit

  while (digitalRead(pinTaster) == HIGH) {  // Warten bis erneut die Taste gedrückt wurde
  }
  unsigned long reaktionsZeit = millis() - startZeit;  // Reaktionszeit berechnen
  digitalWrite(pinLedRot, LOW);                        // Rote LED ausschalten

  // Reaktionszeit auf dem Display anzeigen
  tft.fillScreen(ST7735_BLACK);
  tft.setCursor(0, 0);  // Cursor an die obere linke Ecke setzen
  tft.setTextSize(2);
  tft.print("Reaktionszeit: ");  // Text ausgeben
  tft.setCursor(0, 70);          // Cursor in 2. Zeile
  tft.setTextSize(4);
  tft.print(reaktionsZeit);  // Reaktionszeit ausgeben
  tft.setCursor(0, 100);
  tft.print(" ms");                        // Einheit ausgeben
  while (digitalRead(pinTaster == LOW)) {  // Warten bis der Taster losgelassen ist
    delay(1);
  }
  // Display für 60 Sekunden aktivieren
  displayStartZeit = millis();  // Startzeit für das Display speichern
}


#include <WiFi.h>          // Bibliothek für die WiFi-Verbindung
#include <WiFiUdp.h>      // Bibliothek für die UDP-Kommunikation (benötigt für NTP)
#include <NTPClient.h>    // Bibliothek für den NTP-Client, um die Zeit von einem NTP-Server abzurufen
#include <Adafruit_NeoPixel.h> // Bibliothek für die Steuerung von NeoPixel-LEDs

// Konfiguration
const char* wlanSsid = "DEIN_SSID";       // SSID des WLANs, mit dem der ESP32 sich verbinden soll
const char* wlanPasswort = "DEIN_PASSWORT"; // Passwort des WLANs
const int tasterPin = 12;                  // GPIO-Pin, an den der Taster angeschlossen ist
const int ledPin = 13;                     // GPIO-Pin, an den die NeoPixelmatrix angeschlossen ist
const int anzahlPixel = 64;                // Anzahl der Pixel in der NeoPixelmatrix (8x8 Matrix hat 64 Pixel)

// NTP Client Setup
WiFiUDP ntpUdp;                            // Erstellen eines UDP-Objekts für die NTP-Kommunikation
NTPClient zeitClient(ntpUdp, "pool.ntp.org", 3600, 60000); // Initialisierung des NTP-Clients mit Serveradresse, Zeitzone und Aktualisierungsintervall

// NeoPixel Setup
Adafruit_NeoPixel pixelMatrix(anzahlPixel, ledPin, NEO_GRB + NEO_KHZ800); // Initialisierung der NeoPixelmatrix mit der Anzahl der Pixel und dem Datenpin

// Variablen
bool zeitAnzeigen = false;                 // Boolesche Variable, die angibt, ob die Zeit angezeigt werden soll
unsigned long anzeigeStartZeit = 0;       // Speichert die Startzeit der Anzeige (in Millisekunden)

void setup() {
  Serial.begin(115200);                    // Serielle Kommunikation starten
  pinMode(tasterPin, INPUT_PULLUP);       // Taster-Pin als INPUT mit Pull-Up-Widerstand einstellen
  pixelMatrix.begin();                     // NeoPixelmatrix initialisieren
  WiFi.begin(wlanSsid, wlanPasswort);     // Verbindung zum WLAN herstellen

  // Warte auf die Verbindung
  while (WiFi.status() != WL_CONNECTED) { // Solange warten, bis die Verbindung hergestellt ist
    delay(1000);
    Serial.println("Verbinde zu WiFi..."); // Ausgabe in der seriellen Konsole
  }
  Serial.println("Verbunden!");             // Bestätigung der WLAN-Verbindung

  zeitClient.begin();                       // NTP-Client starten
}

void loop() {
  zeitClient.update();                      // Aktualisiere die Zeit vom NTP-Server

  // Überprüfe den Taster
  if (digitalRead(tasterPin) == LOW) {    // Wenn der Taster gedrückt wird
    zeitAnzeigen = true;                   // Setze die Anzeige-Flag auf true
    anzeigeStartZeit = millis();           // Speichere die aktuelle Zeit in Millisekunden
    delay(200);                            // Entprellung des Tasters
  }

  if (zeitAnzeigen) {                      // Wenn die Zeit angezeigt werden soll
    unsigned long aktuelleMillis = millis(); // Hole die aktuelle Zeit in Millisekunden
    
    // Aktualisiere die Anzeige für 5 Minuten (300000 ms)
    if (aktuelleMillis - anzeigeStartZeit < 300000) {
      zeigeBinärZeitAn();                  // Zeige die Zeit im Binärformat an
    } else {
      zeitAnzeigen = false;                // Stoppe die Anzeige nach 5 Minuten
      löscheAnzeige();                     // Lösche die Anzeige
    }
  }
}

void zeigeBinärZeitAn() {
  // Hole die aktuelle Zeit
  int tag = zeitClient.getDay();          // Hole den aktuellen Tag (1-31)
  int monat = zeitClient.getMonth();      // Hole den aktuellen Monat (1-12)
  int jahr = zeitClient.getYear() % 100;  // Hole das aktuelle Jahr (00-99)
  int stunde = zeitClient.getHours();     // Hole die aktuelle Stunde (0-23)
  int minute = zeitClient.getMinutes();    // Hole die aktuelle Minute (0-59)
  int sekunde = zeitClient.getSeconds();   // Hole die aktuelle Sekunde (0-59)

  // Setze die Pixel für das Datum und die Uhrzeit im Binärformat an
  löscheAnzeige();                         // Lösche vorherige Anzeige

  // Zeige Tag, Monat, Jahr, Stunde, Minute, Sekunde in Binärformat an
  zeigeBinär(tag, 0);                     // Zeige den Tag im Binärformat an
  zeigeBinär(monat, 8);                   // Zeige den Monat im Binärformat an
  zeigeBinär(jahr, 16);                   // Zeige das Jahr im Binärformat an
  zeigeBinär(stunde, 24);                 // Zeige die Stunde im Binärformat an
  zeigeBinär(minute, 32);                 // Zeige die Minute im Binärformat an
  zeigeBinär(sekunde, 40);                 // Zeige die Sekunde im Binärformat an
  
  pixelMatrix.show();                      // Aktualisiere die Pixelmatrix, um die neue Anzeige darzustellen
}

void zeigeBinär(int zahl, int startReihe) {
  for (int i = 0; i < 8; i++) {           // Schleife für 8 Bits der Zahl
    if (bitRead(zahl, i)) {               // Überprüfe, ob das i-te Bit 1 ist
      pixelMatrix.setPixelColor(startReihe + i, pixelMatrix.Color(0, 255, 0)); // Grün für 1
    } else {
      pixelMatrix.setPixelColor(startReihe + i, pixelMatrix.Color(255, 0, 0)); // Rot für 0
    }
  }
}

void löscheAnzeige() {
  for (int i = 0; i < anzahlPixel; i++) { // Schleife über alle Pixel
    pixelMatrix.setPixelColor(i, pixelMatrix.Color(0, 0, 0)); // Alle Pixel ausschalten
  }
  pixelMatrix.show();                      // Aktualisiere die Pixelmatrix, um die Änderungen darzustellen
}
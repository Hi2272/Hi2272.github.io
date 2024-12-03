#include <WiFi.h>          // Bibliothek fuer die WiFi-Verbindung
#include <WiFiUdp.h>      // Bibliothek fuer die UDP-Kommunikation (benoetigt fuer NTP)
#include <NTPClient.h>    // Bibliothek fuer den NTP-Client, um die Zeit von einem NTP-Server abzurufen
#include <Adafruit_NeoPixel.h> // Bibliothek fuer die Steuerung von NeoPixel-LEDs

#include "TimeLib.h"

// Konfiguration
const char* wlanSsid = "Deine SSID";       // SSID des WLANs, mit dem der ESP32 sich verbinden soll
const char* wlanPasswort = "DeinPW"; // Passwort des WLANs
const int ledPin = 22;                     // GPIO-Pin, an den die NeoPixelmatrix angeschlossen ist
const int anzahlPixel = 64;                // Anzahl der Pixel in der NeoPixelmatrix (8x8 Matrix hat 64 Pixel)

// NTP Client Setup
WiFiUDP ntpUdp;                            // Erstellen eines UDP-Objekts fuer die NTP-Kommunikation
NTPClient zeitClient(ntpUdp, "pool.ntp.org", 3600, 60000); // Initialisierung des NTP-Clients mit Serveradresse, Zeitzone und Aktualisierungsintervall

// NeoPixel Setup
Adafruit_NeoPixel pixelMatrix(anzahlPixel, ledPin, NEO_GRB + NEO_KHZ800); // Initialisierung der NeoPixelmatrix mit der Anzahl der Pixel und dem Datenpin

// Variablen
bool zeitAnzeigen = false;                 // Boolesche Variable, die angibt, ob die Zeit angezeigt werden soll
unsigned long anzeigeStartZeit = 0;       // Speichert die Startzeit der Anzeige (in Millisekunden)

void setup() {
  Serial.begin(115200);                    // Serielle Kommunikation starten
  pixelMatrix.begin();                     // NeoPixelmatrix initialisieren
  WiFi.begin(wlanSsid, wlanPasswort);     // Verbindung zum WLAN herstellen

  // Warte auf die Verbindung
  while (WiFi.status() != WL_CONNECTED) { // Solange warten, bis die Verbindung hergestellt ist
    delay(1000);
    Serial.println("Verbinde zu WiFi..."); // Ausgabe in der seriellen Konsole
  }
  Serial.println("Verbunden!");             // Bestaetigung der WLAN-Verbindung

  zeitClient.begin();                       // NTP-Client starten
}

void loop() {

  zeitClient.update();                      // Aktualisiere die Zeit vom NTP-Server
      zeigeBinaerZeitAn();                  // Zeige die Zeit im Binaerformat an
  delay(1000);
}

void zeigeBinaerZeitAn() {
  // Hole die aktuelle Zeit
  time_t  zeit=zeitClient.getEpochTime();
  int tag = day(zeit);          // Hole den aktuellen Tag (1-31)
  int monat = month(zeit);      // Hole den aktuellen Monat (1-12)
  int jahr = year(zeit) % 100;  // Hole das aktuelle Jahr (00-99)
  int stunde = hour(zeit);     // Hole die aktuelle Stunde (0-23)
  int minuten = minute(zeit);    // Hole die aktuelle Minute (0-59)
  int sekunden = second(zeit);   // Hole die aktuelle Sekunde (0-59)

  // Setze die Pixel fuer das Datum und die Uhrzeit im Binaerformat an
  loescheAnzeige();
  int uhrzeit=stunde*60+minuten;                         // Loesche vorherige Anzeige
if (uhrzeit>7*60+29&&uhrzeit<16*60){  // 7.30  bis 15.59
  // Zeige Tag, Monat, Jahr, Stunde, Minute, Sekunde in Binaerformat an
  zeigeBinaer(tag, 0);                     // Zeige den Tag im Binaerformat an
  zeigeBinaer(monat, 8);                   // Zeige den Monat im Binaerformat an
  zeigeBinaer(jahr, 16);                   // Zeige das Jahr im Binaerformat an
  zeigeBinaer(stunde, 40);                 // Zeige die Stunde im Binaerformat an
  zeigeBinaer(minuten, 48);                 // Zeige die Minute im Binaerformat an
  zeigeBinaer(sekunden, 56);                 // Zeige die Sekunde im Binaerformat an
  
  pixelMatrix.show();                      // Aktualisiere die Pixelmatrix, um die neue Anzeige darzustellen
}
}

void zeigeBinaer(int zahl, int startReihe) {
 
 byte an[]={0,30,0};
 byte aus[]={30,0,0};
 if (startReihe<40){
  an[0]=30;an[1]=30;an[2]=0;
  aus[0]=0;aus[1]=0;aus[2]=30;
 }

  for (int i = 7; i >=0; i=i-1) {           // Schleife fuer 8 Bits der Zahl
    if (bitRead(zahl, i)) {               // ueberpruefe, ob das i-te Bit 1 ist
      pixelMatrix.setPixelColor(startReihe + i, pixelMatrix.Color(an[0],an[1],an[2])); // Gruen fuer 1
      Serial.print(1);
    } else {
      pixelMatrix.setPixelColor(startReihe + i, pixelMatrix.Color(aus[0], aus[1], aus[2])); // Rot fuer 0
      Serial.print(0);
    }
  }
  Serial.println();
}

void loescheAnzeige() {
  for (int i = 0; i < anzahlPixel; i++) { // Schleife ueber alle Pixel
    pixelMatrix.setPixelColor(i, pixelMatrix.Color(0, 0, 0)); // Alle Pixel ausschalten
  }
  pixelMatrix.show();                      // Aktualisiere die Pixelmatrix, um die aenderungen darzustellen
}

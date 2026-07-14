<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">
<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Leitfähigkeitsmessung
## Allgemeines
Die Leitfähigkeit einer Lösung entspricht dem Kehrwert ihres elektrischen Widerstands.  
Sie ist umso größer, je größer der Ionengehalt dieser Lösung ist.  
Zur Messung der Leitfähigkeit verwenden ein TDS-Modul, das auf dieser Seite beschrieben ist:  

https://wiki.keyestudio.com/KS0429_keyestudio_TDS_Meter_V1.0

Der Sketch von dieser Seite wurde mit Kommentaren und deutschen Variablennamen versehen:

```C++

/*
* Arduino‑Sketch zur Messung des TDS‑Werts (Total Dissolved Solids) mit
* einem analogen Sensor. Der Code liest periodisch den analogen Eingang,
* wendet Median‑Filterung an, kompensiert die Temperatur und wandelt die
* Spannung in einen TDS‑Wert (ppm) um.
*/

/* -------------------------- Pin‑ und Konstantendefinitionen -------------------------- */
#define TDS_SENSOR_PIN A1  // Analoger Pin, an dem der TDS‑Sensor angeschlossen ist
#define VREF 5.0           // Referenzspannung des ADC in Volt
#define SCOUNT 30          // Anzahl der Messwerte, die für den Median‑Filter verwendet werden

/* -------------------------- Globale Variablen -------------------------- */
// Puffer für die rohen ADC‑Messwerte
int analogPuffer[SCOUNT];      // Ring‑Puffer, füllt sich zyklisch mit Messwerten
int analogPufferTemp[SCOUNT];  // Kopie des Puffers für die Median‑Berechnung
int analogPufferIndex = 0;     // Aktuelle Schreibposition im Ring‑Puffer
int kopierIndex = 0;           // Laufvariable zum Kopieren des Puffers
// Ergebnisvariablen
float durchschnittSpannung = 0.0;  // Gemittelte Spannung nach Median‑Filterung (Volt)
float tdsWert = 0.0;               // Berechneter TDS‑Wert (ppm)
float temperatur = 25.0;           // Aktuelle Temperatur (°C); hier als Konstante angenommen

/* -------------------------- Setup -------------------------- /
/*
@brief Initialisiert die serielle Schnittstelle und den Analogeingang.
Die serielle Kommunikation wird mit 9600 baud gestartet, um Messwerte
an den PC zu senden. Der Pin des TDS‑Sensors wird als Eingang konfiguriert.
*/

void setup() {
  Serial.begin(9600);
  pinMode(TDS_SENSOR_PIN, INPUT);
}

/* -------------------------- Hauptschleife -------------------------- /
/*

@brief Liest periodisch den Sensor aus, filtert die Werte und gibt den TDS‑Wert aus.
Alle 40 ms wird ein neuer ADC‑Wert eingelesen und im Ring‑Puffer abgelegt.
Alle 800 ms wird der Puffer kopiert, median‑gefiltert und in einen TDS‑Wert umgerechnet.
Der TDS‑Wert wird über die serielle Schnittstelle ausgegeben.
*/

void loop() {
  static unsigned long messZeitpunkt = millis();                                                // Zeitstempel des letzten Samples
  if (millis() - messZeitpunkt > 40U) {                                                         // Prüfen, ob 40 ms vergangen sind
    messZeitpunkt = millis();                                                                   // Zeitstempel aktualisieren
    analogPuffer[analogPufferIndex] = analogRead(TDS_SENSOR_PIN);                               // ADC‑Wert einlesen und speichern
    analogPufferIndex++;                                                                        // Index für nächsten Schreibvorgang erhöhen
    if (analogPufferIndex == SCOUNT) {                                                          // Ring‑Puffer‑Wrap‑Around
      analogPufferIndex = 0;
    }
  }



  /* ---- 2. Berechnung und Ausgabe alle 800 ms ---- */
  static unsigned long ausgabeZeitpunkt = millis();  // Zeitstempel der letzten Ausgabe
  if (millis() - ausgabeZeitpunkt > 800U) {          // Prüfen, ob 800 ms vergangen sind
    ausgabeZeitpunkt = millis();                     // Zeitstempel aktualisieren
    // Puffer in temporäres Array kopieren, um ihn für die Median‑Berechnung zu fixieren
    for (kopierIndex = 0; kopierIndex < SCOUNT; kopierIndex++) {
      analogPufferTemp[kopierIndex] = analogPuffer[kopierIndex];
    }

    // Median‑Filter anwenden und in Spannung (Volt) umrechnen
    durchschnittSpannung = berechneMedian(analogPufferTemp, SCOUNT) * (float)VREF / 1024.0;

    // Temperaturkompensation (0,02 % pro °C über 25 °C)
    float kompensationsFaktor = 1.0 + 0.02 * (temperatur - 25.0);
    float kompensationsSpannung = durchschnittSpannung / kompensationsFaktor;  // Spannung nach Kompensation

    // Umrechnung von Spannung in TDS‑Wert (ppm) mittels Kalibrierungsformel
    tdsWert = (133.42 * kompensationsSpannung * kompensationsSpannung * kompensationsSpannung
               - 255.86 * kompensationsSpannung * kompensationsSpannung
               + 857.39 * kompensationsSpannung)
              * 0.5;

    // Ergebnis über serielle Schnittstelle ausgeben
    Serial.print("TDS Value: ");
    Serial.print(tdsWert, 0);
    Serial.println(" ppm");
  }
}
/* -------------------------- Hilfsfunktion -------------------------- /
/*

@brief Berechnet den Median eines Integer‑Arrays.

Der Algorithmus sortiert das übergebene Array (Kopie) mittels Bubble‑Sort
und liefert anschließend den Medianwert. Für gerade Längen wird der Mittelwert
der beiden mittleren Elemente zurückgegeben.

@param bArray Zeiger auf das zu sortierende Array.
@param iFilterLen Anzahl der Elemente im Array.
@return Medianwert des Arrays.
*/
int berechneMedian(int bArray[], int iFilterLen) {
  int bTab[iFilterLen];  // Lokale Kopie des Eingabearrays
  for (byte i = 0; i < iFilterLen; i++) {
    bTab[i] = bArray[i];
  }

  // Bubble‑Sort: Aufsteigende Ordnung erzeugen
  for (int j = 0; j < iFilterLen - 1; j++) {
    for (int i = 0; i < iFilterLen - j - 1; i++) {
      if (bTab[i] > bTab[i + 1]) {
        int bTemp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = bTemp;
      }
    }
  }
  // Median bestimmen
  int bTemp;
  if ((iFilterLen & 1) > 0) {  // Ungerade Anzahl: mittleres Element
    bTemp = bTab[(iFilterLen - 1) / 2];
  } else {  // Gerade Anzahl: Mittelwert der beiden mittleren Elemente
    bTemp = (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;
  }
  return bTemp;
}
```

  

[zurück](../index.html)


#include <HX711_ADC.h>

/*--------------------------------------------------------------
  Pin‑Belegung für den HX711
--------------------------------------------------------------*/
const int HX711_dout = 4;  // Datenleitung (DOUT) des HX711, verbunden mit Pin 4 des MCU
const int HX711_sck = 5;   // Taktleitung (SCK) des HX711, verbunden mit Pin 5 des MCU

/*--------------------------------------------------------------
  Objektinstanz des HX711‑ADC
--------------------------------------------------------------*/
HX711_ADC sensor(HX711_dout, HX711_sck);

/**
 * @brief Initialisiert die serielle Schnittstelle und den HX711,
 *        führt die Start‑Sequenz inkl. Tara‑Durchführung aus
 */

void setup() {
  Serial.begin(9600);  // Serielle Kommunikation mit 9600 baud starten

  sensor.begin();  // HX711‑Modul initialisieren
  delay(500);
  /*
  Sensor wird eingeschaltet und tariert, d.h. auf 0 gesetzt
  2000 = Pause zum Stabilisieren
  true = Tarierung soll durchgeführt werden.
*/
  sensor.start(2000, true);

  // Prüfen, ob beim Start ein Timeout aufgetreten ist
  if (sensor.getTareTimeoutFlag() || sensor.getSignalTimeoutFlag()) {
    Serial.println("Sensor antwortet nicht, prüfe die Verkabelung und die Pins");
    while (true)
      ;  // Endlosschleife bei Fehlfunktion
  } else {
    sensor.setCalFactor(1.0);  // Anfangs‑Kalibrierungsfaktor (kann später überschrieben werden)
    Serial.println("Kalbrierungsfaktor auf 1.0 gesetzt");
  }
}

/**
 * @brief Hauptschleife: Liest Messwerte aus, gibt sie seriell aus
 */

void loop() {
  float wert = 0.0;    
  for (int i = 0; i < 10; i++) {
    while (!sensor.update()) {}  // Solange keine neuen Daten verfügbar sind: warten
    float w = sensor.getData();  // Messwert als Kommazahl
    w = w / 1000;  // Messwert durch 1000 teilen, um Schwankungen zu reduzieren
    wert = wert + w;          // Messwert addieren
    while (sensor.update()) {}  // Solange warten, bis keine Daten mehr verfügbar sind -> Daten werden nur einmal gelesen
  }
  wert = wert / 10;  // Mittelwert aus den 10 Messungen

  Serial.println((int)wert);   // Messwert als ganze Zahl ausgeben
}

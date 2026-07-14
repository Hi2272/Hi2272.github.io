# Wägesensor

## Quellen

Die Theorie zum Wägesensor ist auf folgenden Internetseiten von Wolfgang Ewald erklärt:  
[Dehnungsmessstreifen](https://wolles-elektronikkiste.de/dehnungsmessstreifen)  
[HX711 basierte Waage](https://wolles-elektronikkiste.de/hx711-basierte-waage)  

Eine Druckvorlage für eine einfache Waage findest du hier:   
[Load cell housing](https://www.thingiverse.com/thing:5448276)

## Messprinzip
Der Sensor wird an einem Ende fest mit der Bodenplatte verschraubt. Das andere Ende schwebt frei in der Luft. Wird auf dieses Ende ein Gewicht aufgelegt, dann verbiegt sich der Sensor leicht. Die Dehnungsmessstreifen verändern ihren Abstand. Diese Änderung bewirkt eine geringe Änderung des elektrischen Widerstands des Systems.

## Sketch

Der Sketch verwendet die **HX711_ADC**-Bibliothekt von **Olav Kalthovd**. Sie kann über den Bibliotheksmanager installiert werden.  

```C++
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
  // Prüfen, ob neue Messdaten verfügbar sind
  if (sensor.update()) {
    float i = sensor.getData();  // Messwert lesen
    Serial.println(i);
    delay(1);
  }
}
```

## Glättung der Messwerte 
Um die Messwerte zu glätten, werden
- alle Werte durch 1000 geteilt.
- immer 10 Werte addiert und daraus ein Mittelwert gebildet.
- das Ergebnis auf eine ganze Zahl abgerundet.
  

```C++

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
```


## Experimente
1. Notiere den Wert, den der Sensor ohne Belastung liefert.
2. Lege anschließend bekannte Gewichte auf den Sensor und notiere ihre Messwerte.  
**ACHTUNG: Der Sensor darf höchstens mit 1kg belastet werden!**
3. Erstelle ein Diagramm aus Gewicht- und Sensorwerten und leite ab, wie sie zusammenhängen.
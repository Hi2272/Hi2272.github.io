#include <DHT.h>

#define DHTPIN1 2     // Pin für den ersten DHT11
#define DHTPIN2 3     // Pin für den zweiten DHT11
#define FAN_PIN 9     // Pin für den PWM-Lüfter

DHT dht1(DHTPIN1, DHT11);
DHT dht2(DHTPIN2, DHT11);

void setup() {
  Serial.begin(9600);
  dht1.begin();
  dht2.begin();
  pinMode(FAN_PIN, OUTPUT);
}

void loop() {
  // Temperatur und Feuchtigkeit vom ersten Sensor lesen
  float h1 = dht1.readHumidity();
  float t1 = dht1.readTemperature();

  // Temperatur und Feuchtigkeit vom zweiten Sensor lesen
  float h2 = dht2.readHumidity();
  float t2 = dht2.readTemperature();

  // Überprüfen, ob die Werte gültig sind
  if (isnan(h1) || isnan(t1) || isnan(h2) || isnan(t2)) {
    Serial.println("Fehler beim Lesen der Sensoren!");
    return;
  }

  // Ausgabe der Werte auf dem Serial Monitor
  Serial.print("Sensor 1 - Feuchtigkeit: ");
  Serial.print(h1);
  Serial.print("%, Temperatur: ");
  Serial.print(t1);
  Serial.println("°C");

  Serial.print("Sensor 2 - Feuchtigkeit: ");
  Serial.print(h2);
  Serial.print("%, Temperatur: ");
  Serial.print(t2);
  Serial.println("°C");

  // Lüftersteuerung basierend auf der Feuchtigkeits- und Temperaturkombination
  bool isSensor1Better = (h1 < h2 && t1 > t2); // Sensor 1 ist besser
  bool isSensor2Better = (h2 < h1 && t2 > t1); // Sensor 2 ist besser

  if (isSensor1Better) {
    analogWrite(FAN_PIN, 255); // Lüfter einschalten (volle Leistung)
  } else if (isSensor2Better) {
    analogWrite(FAN_PIN, 0); // Lüfter ausschalten
  } else {
    analogWrite(FAN_PIN, 0); // Lüfter ausschalten, wenn keine Seite besser ist
  }

  delay(2000); // Warte 2 Sekunden vor der nächsten Messung
}

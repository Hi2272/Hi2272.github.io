<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

```C++
int sensorPin = 8; // Pin, an dem der Ausgang der Lichtschranke angeschlossen ist
int sensorValue = 0; // Variable zum Speichern des Sensorwerts

void setup() {
  Serial.begin(9600); // Startet die serielle Kommunikation mit 9600 Baud
  pinMode(sensorPin, INPUT); // Setzt den Pin als Eingang
}

void loop() {
  sensorValue = digitalRead(sensorPin); // Liest den Wert der Lichtschranke
  Serial.print("Lichtschrankensignal = "); // Ausgabe im seriellen Monitor
  Serial.println(sensorValue); // Ausgabe des Sensorwerts (0 oder 1)
  delay(200); // Kurze Pause, um die Ausgabe lesbar zu machen
}
``` 

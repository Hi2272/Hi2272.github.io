<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Der Ventilator
## Direkter Anschluss an den Arduino
Kleine Motoren, die wenig Leistung ziehen, können direkt an den Arduino Uno angeschlossen werden.
Schließe den Lüfter wie folgt an:
- schwarzes Kabel: GND
- Rotes Kabel: Pin 3

## Maximale Drehzahl
Programmiere den Arduino mit diesem Code:
```C++
// Definiere den Pin, an den der Motor angeschlossen ist
int motorPin = 3;
int speed=255;
void setup() {
  // Setze den Motor-Pin als Ausgang
  pinMode(motorPin, OUTPUT);
  // Schalte den Motor ein
  analogWrite(motorPin,speed);
  // Kurze Pause, damit der Motor wirklich läuft
  delay(1000);
}

void loop(){

}
```
## Experimentieraufgabe
### Kühlrichtung
Ermittele die Seite des Lüfters, auf der er kühlt.
### Minimale Geschwindigkeit
Bestimme den minimalen Wert für **speed**, bei dem der Motor von selbst losläuft.  
  

### [zurück](../index.html)  

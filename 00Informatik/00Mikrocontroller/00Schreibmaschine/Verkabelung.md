# Anschluss des Schrittmotors für die Papierwalze

## Widerstandsmessungen am Schrittmotor
| Kabel1 | Kabel2 | Widerstand in Ohm |
| ------ | ------ | ----------------- |
| grün   | rot    | 27                |
| grün   | weiß   | 27                |
| weiß   | rot    | 52                |
| grau   | blau   | 27                |
| grau   | gelb   | 27                |
| blau   | gelb   | 52                |

## Anschlüsse der vier Spulen
| Spule | Kabel1 | Kabel 2 |
| ----- | ------ | ------- |
| 1     | grün   | rot     |
| 2     | grün   | weiß    |
| 3     | grau   | blau    |
| 4     | grau   | gelb    |

## Verkabelung der Steuerplatine

| Kabel Schrittmotor | Kabel Steuerplatine |
| ------------------ | ------------------- |
| grün + grau        | rot                 |
| rot                | orange              |
| blau               | blau                |
| weiß               | rosa                |
| gelb               | gelb                |

```C++
#include <AccelStepper.h>

const byte Fullstep = 4;
const byte Halfstep = 8;
const short fullRevolution = 2038;
const float SteppDegree = 11.32;  // Half/Full 11.32 / 5.66
// Pins IN1-IN3-IN2-IN4
AccelStepper stepper(Halfstep, 11, 9, 10, 8);
void setup() {
  stepper.setMaxSpeed(250.0);
  stepper.setAcceleration(100.0);
  Serial.begin(9600);

  blattEinziehen();
  delay(2000);

  for (int i = 0; i < 3; i++) {
    zeileEinziehen(1);
    delay(1000);
  }
  blattAuswerfen();
}

void einziehen(float wert) {
  Serial.print(stepper.currentPosition());
  stepper.runToNewPosition(stepper.currentPosition() - 1 * wert);  // Cause an overshoot then back to 0
  Serial.println("->"+String(stepper.currentPosition()));
}

void blattEinziehen() {
  stepper.setCurrentPosition(0);
  einziehen(800);
}

void zeileEinziehen(float abstand) {
  einziehen(abstand * 80);
}

void blattAuswerfen() {
  stepper.runToNewPosition(-5000);
}


void loop() {
}
```

Motor dreht langsam.   
Negative Parameter-Werte führen zum Einzug von Papier.

# Verkabelung des Schrittmotors für den Schlitten

Da die gleiche Farbcodierung vorliegt, werden die Kabel identisch angeschlossen.  
Der Schlitten bewegt sich problemlos.  
Die negativen Parameter-Werte bewirken hier eine Bewegung von rechts nach links.

# Verkabelung des Schrittmotors für das Typenrad
Auch dieses Kabel hat die gleiche Farbcodierung und wird identisch angeschlossen.   
Die Drehung erfolgt mit negativen Parameter-Werten gegen den Uhrzeigersinn.

# Untersuchung der weiteren Stecker

## Roter Stecker: rot, schwarzes Kabel

| Rot  | Schwarz |
| ---- | ------- |
| +5 V | GND     |

Elektromotor im Schlitten dreht dauerhaft, treibt Getriebe mit mehreren Zahnrädern an. Diese führen zu zwei Zylindern, die gebremst sind und sich nicht bewegen.

## Blauer Stecker mit 2 blauen Kabeln
2 blaue Kabel führen zu Elektromagneten. 
Mit +5V wird Bremse gelöst und der schwarze Zylinder dreht sich. Hierbei wird der Kontakt zwischen dem grauen und schwarzen Kabel gedrückt und wieder losgelassen.

## Weißer Stecker mit 2 weißen Kabeln
2 weiße Kabel führen zum Elektromagneten. Mit +5V wird die Bremse gelöst, der weiße Zylinder dreht sich und die Maschine tippt ein Zeichen.

Über einen Hebel wird das Farbband weitertransportiert.

# Verkabelung am Arduino
Anschluss der Schrittmotoren über DRV8825 Module:   
     (https://starthardware.org/stepper-motor-mit-dem-drv8825-steuern/)  
Pro Modul sind nur 2 Pins nötig.
- Schrittmotor Walze
  - D2
  - D3 
- Schrittmotor Schlitten
  - D4
  - D5
- Schrittmotor Typenrad
  - D6
  - D7
  
Der Elektromotor und der Elektromagnet zum Tippen sollen ebenfalls elektronisch geschaltet werden.  
Hierzu können MOSFETs verwendet werden (https://wolles-elektronikkiste.de/der-mosfet-als-schalter)

- Elektromagnet Tippen
  - D8
- Elektromotor Tippen
  - D9
- Serieller Anschluss
  - RX 0
  - TX 1
- Taster für linken Rand-Sensor
  - A0 
- Taster für Bedienfeld (Einzug, Auswurf, Start)
  - A1
- Derzeit noch frei:
  - D10, D11, D12, A2, A3, A4, A5

# CNC Shield mit A4988 Treibern
Die Verkabelung mit einem CNC-Shield, das einfach auf den Arduino Uno aufgesteckt wird, ist deutlich einfacher. Außerdem werden viel weniger Pins benötigt.
An den A4988-Treibern werden nur noch folgende Kabel der Schrittmotoren angeschlossen:
- gelb + blau: Spule 1
- weiß + rot: Spule 2  

Die Originalstecker werden durch weibliche Dupont-Kontakte ersetzt.

Folgender Code steuert die Motoren an:
```C++
// Pin-Belegung für die Motoren festlegen
const int pinStep[3] = { 2, 3, 4 };  // 0 = Walze, 1 = Typenrad, 2 = Schlitten (Schlitten = Wagen)
const int pinDir[3] = { 5, 6, 7 };
const int pinEn = 8;

/**
 * Führt eine Bewegungssequenz eines Motors aus.
 * @param motorNr Nummer des Motors (0=Walze, 1=Typenrad, 2=Schlitten)
 * @param dir Bewegungsrichtung (HIGH oder LOW)
 * @param steps Anzahl der Schritte, die bewegt werden sollen
 * @param speed Geschwindigkeit in Mikrosekunden Verzögerung zwischen den Schritten
 */
void move(int motorNr, int dir, int steps, int speed) {
  digitalWrite(pinDir[motorNr], dir);
  for (int i = 0; i < steps; i++) {
    digitalWrite(pinStep[motorNr], HIGH);
    delayMicroseconds(speed);
    digitalWrite(pinStep[motorNr], LOW);
    delayMicroseconds(speed);
  }
}

/**
 * Initialisiert die Pins und die serielle Schnittstelle.
 */
void setup() {
  for (int i = 0; i < 3; i++) {
    pinMode(pinStep[i], OUTPUT);
    pinMode(pinDir[i], OUTPUT);
  }
  pinMode(pinEn, OUTPUT);
  digitalWrite(pinEn, LOW);
  Serial.begin(9600);
}

/**
 * Bewegt den Schlitten (Wagen) nach rechts.
 * @param steps Anzahl der Schritte
 */
void wagenLaufRechts(int steps) {
  move(2, HIGH, steps, 2000);
}

/**
 * Bewegt den Schlitten (Wagen) nach links.
 * @param steps Anzahl der Schritte
 */
void wagenLaufLinks(int steps) {
  move(2, LOW, steps, 2000);
}

/**
 * Dreht das Typenrad im Uhrzeigersinn.
 * @param steps Anzahl der Schritte
 */
void typenRadImUhr(int steps) {
  move(1, HIGH, steps, 1000);
}

/**
 * Dreht das Typenrad gegen den Uhrzeigersinn.
 * @param steps Anzahl der Schritte
 */
void typenRadGegenUhr(int steps) {
  move(1, LOW, steps, 1000);
}

/**
 * Bewegt die Walze vorwärts.
 * @param steps Anzahl der Schritte
 */
void walzeVor(int steps) {
  move(0, HIGH, steps, 25000);
}

/**
 * Bewegt die Walze rückwärts.
 * @param steps Anzahl der Schritte
 */
void walzeRueck(int steps) {
  move(0, LOW, steps, 25000);
}

/**
 * Hauptprogramm läuft in Endlosschleife.
 * Fährt den Wagen 40 mal 5 Steps nach rechts und dreht dabei das Typenrad
 * Fährt anschließend 200 Steps nach links zurück
 */
void loop() {
  for (int i=0;i<40;i++){
     wagenLaufRechts(5);
     typenRadImUhr(10);
     delay(100);
  }
  delay(1000);
  wagenLaufLinks(200);
  delay(1000);
}
```
## Probleme
Der Walzenmotor dreht erst bei sehr hohen Verzögerungswerten. Dann läuft er aber nicht mehr rund, sondern stottert. Teilweise bleibt er auch stecken.  
Aus diesem Grund versuche ich die Motoren wieder mit der AccelMotor Bibliothek anzusteuern.


# Grundaufbau
  - Arduino Uno steuert 
      - Walze, 
      - Schlitten, 
      - Typenrad, 
      - Druckkopf
   
  - ESP32 steuert 
    - Tastatur, 
    - Einlesen serieller Daten über USB,
    - Einlesen von Daten über Bluetooth, WLan?
    - Ausgabe serieller Befehle an Arduino Uno

# Ablauf
1. ESP sendet Sigmal (1 Byte)
2. Uno liest Signal über Serielle Schnittstelle ein
3. Uno dekodiert das Signal
   1. Papier auswerfen
   2. Zeilenumbruch
      1. Schlitten zurückfahren
      2. Walze weiterdrehen
      3. Wenn Papierende erreicht ist, Papier auswerfen
   3. Zeichen
      1. Typenrad in Position drehen
      2. Elektromagnet zum Schlagen aktivieren
      3. Schlitten eins weiter fahren
      4. Wenn Zeilenende erreicht ist, Zeilenumbruch.
   
# Ungelöste Probleme

- Positionserkennung Typenrad beim Start  
Auf dem Typenrad ist ein kleiner Metallstift. Dieser scheint für die Positionserkennung wichtig zu sein (vgl.: https://support.brother.ca/app/answers/detail/a_id/133688)
- Positionserkennung Schlitten beim Start  
  Auf der linken Seite einen Taster oder eine Reflexlichtschranke einbauen. Bis zum Kontakt zurückfahren und Position auf 0 setzen.  
  Alternativ: Mit Reflexlichtschranke Helligkeit vom Papier messen.

- Tastatur einlesen
- Serielle Daten einlesen
- Serielle Kommunikation ESP -> Uno


<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">


# Multiplexer
## Grundlagen
Die Anzahl der Pins am Arduino ist begrenzt. Am Uno können 18 Pins verwendet werden: D2-D13 und A0-A5.   
Um mehr Sensoren oder Aktoren anzuschließen, kann ein Multiplexer verwendet werden. Mit diesem Bauteil werden 4 Pins (S0-S3) auf 16 Pins (Y0-Y15) verschaltet. Die 16 Pins werden binär codiert:  
| S0 | S1 | S2 | S3 | Y-Pin |
|----|----|----|----|-------|
| 0  | 0  | 0  | 0  | Y0    |
| 1  | 0  | 0  | 0  | Y1    |
| 0  | 1  | 0  | 0  | Y2    |
| 1  | 1  | 0  | 0  | Y3    |
| 0  | 0  | 1  | 0  | Y4    |
| 1  | 0  | 1  | 0  | Y5    |
| 0  | 1  | 1  | 0  | Y6    |
| 1  | 1  | 1  | 0  | Y7    |
| 0  | 0  | 0  | 1  | Y8    |
| 1  | 0  | 0  | 1  | Y9    |
| 0  | 1  | 0  | 1  | Y10   |
| 1  | 1  | 0  | 1  | Y11   |
| 0  | 0  | 1  | 1  | Y12   |
| 1  | 0  | 1  | 1  | Y13   |
| 0  | 1  | 1  | 1  | Y14   |
| 1  | 1  | 1  | 1  | Y15   |

## Beschreibung der Pins
- S0 bis S3: Codierung der Ausgänge (s.o.).
- Y0 bis Y15: Ausgänge (s.o.)
- SIG oder Z, COM = Anschluss zur Ausgabe des Signals am gewählten Pin
- E: Enabled: Über diesen Pin kann der Multiplexer ein- oder ausgeschaltet werden.     
LOW: Multiplexer ist aktiv: Signal vom Yx-Pin wird auf den SIG-Pin durchgeschaltet.  
HIGH: Multiplexer ist nicht aktiv: Der Yx-Pin ist vom SIG-Pin getrennt.
- VCC: +5 V: Spannungsversorgung des Multiplexers
- GND oder VSS: GND
## Ansteuern von 16 LEDs 
- Die LEDs werden mit dem Pluspol an die Pins Y0 bis Y15 angeschlossen.  Die Minuspole werden über einen 1 KOhm-Widerstand mit GND verbunden.  
- Die Pins S0 bis S3 werden mit D2 bis D5 verbunden.  
- SIG wird mit +5V verbunden. Über diesen Pin erhalten die LEDs die Spannung.  
- EN wird mit D6 verbunden

Mit diesem Code leuchten die LEDs nacheinander auf:  
```C++
// Pins Definition
const int pinS0 = 2;
const int pinS1 = 3;
const int pinS2 = 4;
const int pinS3 = 5;
const int pinEN = 6;

void setup() {
  // Steuerpins als Output definieren
  pinMode(pinS0, OUTPUT);
  pinMode(pinS1, OUTPUT);
  pinMode(pinS2, OUTPUT);
  pinMode(pinS3, OUTPUT);
  pinMode(pinEN, OUTPUT);

  // Multiplexer deaktiviert starten
  digitalWrite(pinEN, HIGH);
}

void loop() {
  for (int channel = 0; channel < 16; channel++) {
    setMuxChannel(channel); // Kanal wählen
    digitalWrite(pinEN, LOW);  // Multiplexer aktivieren → LED an
    delay(300);                // 300 ms warten

    digitalWrite(pinEN, HIGH); // Multiplexer deaktivieren → LEDs aus
    delay(300);                // 300 ms warten, LED aus
  }
}

// Funktion zum Setzen des Kanals
void setMuxChannel(int channel) {
  digitalWrite(pinS0, (channel & 0x01) ? HIGH : LOW);
  digitalWrite(pinS1, (channel & 0x02) ? HIGH : LOW);
  digitalWrite(pinS2, (channel & 0x04) ? HIGH : LOW);
  digitalWrite(pinS3, (channel & 0x08) ? HIGH : LOW);
}
```
### Erläuterungen zum Code
#### setMuxChannel(int channel)

Die Methode **setMuxChannel(int channel)** aktiviert den Kanal mit der Nummer **channel**.
Hierzu schaltet sie die entsprechenden Pins S0 bis S3 HIGH, bzw. LOW.   
Die Anweisung **channel & 0x01** prüft, ob das Bit 0001 gesetzt ist. Wenn das der Fall ist, wird der Pins S0 HIGH geschaltet, sonst LOW. Analog wird das 2. Bit (2), das 3. Bit(4) und das vierte Bit(8) untersucht.
####   digitalWrite(pinEN, LOW / HIGH)
Über den **Enabled**-Pin wird die Spannung vom Z-Pin auf die Ausgänge durchgeschaltet (LOW) oder gesperrt (HIGH). Die LED wird damit ein- oder ausgeschaltet. 

## Einlesen von 16 Sensoren

- Die Sensoren werden an die Pins Y0 bis Y15 angeschlossen.
- Die Pins S0 bis S3 werden mit D2 bis D5 verbunden.  
- EN wird mit D6 verbunden
- SIG wird mit A0 verbunden. Über diesen Pin kann über **analogRead** der analoge oder über**digitalRead** der digitale Messwert des gewählten Sensors eingelesen werden. Alternativ kann auch Pin D7 für digitale Werte verwendet werden.  
Der folgende Sketch liest nacheinander 16 analoge Werte von den Sensoren ein.  
```C++
// Pin-Definitionen
const int pinS0 = 2;
const int pinS1 = 3;
const int pinS2 = 4;
const int pinS3 = 5;
const int pinEN = 6;
const int pinAnalog = A0;   // Analogeingang für SIG / COM
const int pinDigital = 7;   // Optional für digitale Werte, falls benötigt

void setup() {
  Serial.begin(9600);
  
  // Steuerpins als Ausgang definieren
  pinMode(pinS0, OUTPUT);
  pinMode(pinS1, OUTPUT);
  pinMode(pinS2, OUTPUT);
  pinMode(pinS3, OUTPUT);

  pinMode(pinEN, OUTPUT);
  digitalWrite(pinEN, LOW);      // Multiplexer aktivieren
  
  pinMode(pinDigital, INPUT);    // Optional digitaler Pin
}

void loop() {
  for (int channel = 0; channel < 16; channel++) {
    setMuxChannel(channel);             // Kanal setzen
    delay(5);                          // Kurze Wartezeit für Signalstabilisierung

    int analogValue = analogRead(pinAnalog);             // Analogwert lesen
    // int digitalValue = digitalRead(pinDigital);       // Optional digital lesen

    // Ausgabe über Serial
    Serial.print("Kanal ");
    Serial.print(channel);
    Serial.print(": Analog = ");
    Serial.println(analogValue);

    delay(200); // Zeit zwischen den Messungen, optional anpassen
  }
}

// Funktion: setzt die 4 Steuerleitungen S0..S3 zum gewünschten Kanal
void setMuxChannel(int channel) {
  digitalWrite(pinS0, (channel & 0x01) ? HIGH : LOW);
  digitalWrite(pinS1, (channel & 0x02) ? HIGH : LOW);
  digitalWrite(pinS2, (channel & 0x04) ? HIGH : LOW);
  digitalWrite(pinS3, (channel & 0x08) ? HIGH : LOW);
}
``` 

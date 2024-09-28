<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Blinken ohne Blockieren
## 1. Grundlagen
Bei unserem bisherigen Blink-Sketch wartet der Mikrocontroller die meiste Zeit in einem **delay(..)**-Befehl:
```C++
void loop() {
  digitalWrite(13, HIGH); // Pin 13 = Pluspol -> LED ein
  delay(500);            // 500 ms Pause: LED leuchtet
  digitalWrite(13, LOW);  // Pin 13 = Minuspol -> LED aus
  delay(500);            // 500 ms Pause: LED leuchtet nicht.
}
```
In dieser Zeit kann er keine anderen Aufgaben erfüllen, also zum Beispiel auf einen Tastendruck des Nutzers reagieren.  
## 2. Blinken mit Zähler
Bei folgendem Sketch tritt dieses Problem nicht mehr auf:
```C++
int zaehler=0; // Zählvariable
int zeit=500;  // Pausenzeit fürs Blinken
bool ledState=LOW; // Zustand der LED: LOW=aus

void setup() {
  pinMode(13, OUTPUT);
  digitalWrite(13,ledState);
}

void loop() {
  zaehler=zaehler+1;
  if (zaehler>zeit){
    zaehler=0;
    ledState=!ledState;
    digitalWrite(13,ledState);
  } 
  delay(1); // 1 ms Pause
}
```
### Erläuterung des Codes
#### int zaehler=0;
Wir definieren eine Zählvariable, die wir zunächst auf 0 setzen.
#### zaehler=zaehler+1;
Bei jedem Durchlauf wird die Variable um eins erhöht.
#### if (zaehler>zeit){
Wenn der Wert der Zählvariable größer als unsere Pausenzeit ist, dann wird:  

1.  Die Zählvariable wieder auf 0 gesetzt.
2.  Die LED aus- oder eingeschaltet.
#### ledState=!ledState;
In dieser Zeile wird der Wert der Variable ledState umgekehrt:  
- Wenn ledState HIGH (1, true) ist, dann wird ledState LOW(0, false) gesetzt.  
- Wenn ledState LOW(0, false) ist, dann wird ledState HIGH (1, true) gesetzt.
 
#### delay(1);
Bei jedem Durchgang wird eine Pause von 1 ms eingehalten. Insgesamt blinkt unsere LED damit wieder ungefähr zweimal pro Sekunde.
## 3. Blinken mit Interrupt
Eine sehr elegante Methode unsere LED blinken zu lassen verwendet einen **Interrupt**. Hierbei unterbricht der Prozessor regelmäßig seine Aufgaben und führt eine vorher definerte **Interrupt-Service-Routine (ISR)** aus. Diese ISRs müssen relativ kurz sein, damit der Prozessor nicht zu sehr ausgebremst wird.  
Der Sketch verwendet die **TimerOne Bibliothek** von **Stoyko Dimitrov**, die wir ggf. installieren müssen.
```C++
#include <TimerOne.h> // TimerOne-Bibliothek einbinden

const int ledPin = 13; // LED an Pin 13
volatile bool ledState = LOW; // LED-Status

void setup() {
  pinMode(ledPin, OUTPUT); // LED-Pin als Ausgang setzen
  Timer1.initialize(1000000); // Timer1 auf 500 ms (500000 µs) einstellen
  Timer1.attachInterrupt(toggleLED); // Interrupt-Funktion zuweisen
}

void loop() {
  // Hauptprogramm bleibt leer, da alles über den Interrupt gesteuert wird
}

void toggleLED() {
  ledState = !ledState; // LED-Status umschalten
  digitalWrite(ledPin, ledState); // LED ein- oder ausschalten
}

```
### Erläuterung des Codes
#### volatile bool ledState = LOW;
Das Schlüsselwort **volatile** muss verwendet werden, da sich der Wert der Variable ledState  jederzeit ändern kann, ohne dass der Code dies explizit tut. Dies ist besonders wichtig bei Variablen, die von Interrupt-Service-Routinen (ISRs) oder von Hardware geändert werden können. Der Compiler wird dadurch daran gehindert, Optimierungen durchzuführen, die davon ausgehen, dass sich der Wert der Variable zwischen zwei Zugriffen nicht ändert.  
**Merke:**  
 Alle Variablen, die von einem Interrupt geändert werden, müssen **volatile** deklariert werden.  

## 4. Taster über Interrupt abfragen
### a) Prinzip
Für den folgenden Sketch muss ein Taster an Pin 2 und GND des Arduinos angeschlossen werden.  
Die interne LED soll durch einen Druck auf den Taster ein- und wieder ausgeschaltet werden.  
### b) Sketch
```C++
const int ledPin = 13; // LED an Pin 13
const int buttonPin = 2; // Taster an Pin 2
volatile bool ledState = false; // Zustand der LED

void setup() {
  pinMode(ledPin, OUTPUT); // LED als Ausgang
  pinMode(buttonPin, INPUT_PULLUP); // Taster als Eingang mit Pullup-Widerstand
  attachInterrupt(digitalPinToInterrupt(buttonPin), toggleLED, CHANGE); // Interrupt bei Zustandsänderung des Tasters
}

void loop() {
  // Hauptschleife bleibt leer, da die LED im Interrupt gesteuert wird
}

void toggleLED() {
  ledState = !ledState; // LED-Zustand umschalten
  digitalWrite(ledPin, ledState); // LED ein- oder ausschalten
}
```

### Erläuterung des Sketchs
####   attachInterrupt(digitalPinToInterrupt(buttonPin), toggleLED, CHANGE);

Hier wird ein Interrupt erzeugt, der regelmäßig prüft, ob sich der Zustand eines Pins am Arduino ändert (**CHANGE**).  
Der Pin wird über die Variable buttonPin definert - bei uns ist das die Nummer 2.  
Wenn sich der Zustand ändert, wird die Methode **toggleLED** aufgerufen, die dafür sorgt, dass die LED aus- oder eingeschaltet wird.  
**Merke:**  

Beim Arduino Uno können **nur die Pins 2 und 3** als **Interrupt-Pins** verwendet werden.  

[zurück](../index.html)


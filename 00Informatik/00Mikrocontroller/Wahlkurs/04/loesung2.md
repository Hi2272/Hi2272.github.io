```C++
#include <IRremote.h>

int ledRot = 7;
int ledGruen = 8;
int sensor = 6;
int buzzer = 5;
int fern = 3;
int fernCode;

void setup() {
  pinMode(ledRot, OUTPUT);
  pinMode(ledGruen, OUTPUT);
  pinMode(sensor, INPUT);
  pinMode(buzzer, OUTPUT);
  pinMode(fern, INPUT);
  Serial.begin(9600);
  IrReceiver.begin(fern);
}

void loop() {
  if (IrReceiver.decode()) {
    IrReceiver.resume();
    fernCode=IrReceiver.decodedIRData.command;
    Serial.println(fernCode);
}
```
Um die Codes auszuwerten, verwenden wir einen **switch-case**-Block. Füge nach **Serial.println(fernCode);** folgende Zeilen ein:  
```C++
    switch(fernCode){
      case 22:
        Serial.println("0");
        break;
      case 12:
        Serial.println("1");
        break;
    }
```
Für die Tasten 0 und 1 gibt das System jetzt immer nach dem Code auf die korrekte Nummer der Taste aus.  
Erweitere den Code so, dass alle Zifferntasten erkannt werden.

[zurück](../index.html)


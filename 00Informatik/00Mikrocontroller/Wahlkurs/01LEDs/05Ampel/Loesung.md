 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">


```c++
void setup() {
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
  digitalWrite(8,LOW);
  digitalWrite(9,LOW);
  digitalWrite(10,LOW);  
}

void rot(){
  digitalWrite(8,LOW);
  digitalWrite(9,LOW);
  digitalWrite(10,HIGH);
}
void gelb(){
  digitalWrite(8,LOW);
  digitalWrite(9,HIGH);
  digitalWrite(10,LOW);
}
void gruen(){
  digitalWrite(8,HIGH);
  digitalWrite(9,LOW);
  digitalWrite(10,LOW);
}


void loop() {
  rot();
  delay(500);
  
  gelb();
  delay(500);
  
  gruen();
  delay(500);
  
  gelb();
  delay(500);
  }
```
## Experimente
Wenn die Ampel funktioniert, kannst du folgende Änderungen ausprobieren:
1. Die Rot- und Grün-Phasen sollen doppelt so lang dauern wie die Gelb-Phasen.
2. Die Ampel soll nur gelb blinken.
3. Vor dem Schalten von grün zu gelb soll die Ampel 4 x grün blinken und damit das Schalten ankündigen.  
Diese Schaltung ist in Österreich umgesetzt.

[zurück](index.html)
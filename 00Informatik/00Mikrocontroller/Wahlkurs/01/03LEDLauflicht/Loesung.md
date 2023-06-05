 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">


```c++
void setup() {
  pinMode(7, OUTPUT);
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
  pinMode(10, OUTPUT);
  pinMode(11, OUTPUT);
  pinMode(12, OUTPUT);
}

void loop() {
  digitalWrite(7, HIGH);
  delay(500);
  digitalWrite(7, LOW);
 
  digitalWrite(8, HIGH);
  delay(500);
  digitalWrite(8, LOW);
 
  digitalWrite(9, HIGH);
  delay(500);
  digitalWrite(9, LOW);
 
  digitalWrite(10, HIGH);
  delay(500);
  digitalWrite(10, LOW);
 
  digitalWrite(11, HIGH);
  delay(500);
  digitalWrite(11, LOW);
 
  digitalWrite(12, HIGH);
  delay(500);
  digitalWrite(12, LOW);
  }
```

Wenn das Lauflicht funktioniert, kannst du mit dem Code experimentieren:
1. Das Licht soll schneller laufen.
2. Bei jedem Durchlauf sollen zunächst alle LEDs ausgeschaltet werden. Anschließend sollen sie der Reihe nach eingeschaltet werden und bis zum Ende des Durchlaufs leuchten.

Auf der nächsten Seite werden wir den Code viel kürzer machen.  
[weiter](Arrays.html)
[zurück](index.html)
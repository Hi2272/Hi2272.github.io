 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">


```C++
int ledRot = 7;
int ledGruen = 8;
int sensor = 6;

void setup() {
  pinMode(ledRot, OUTPUT);
  pinMode(ledGruen,OUTPUT);
  pinMode(sensor, INPUT);
}

void loop() {
  int wert = digitalRead(sensor);
  if (wert == HIGH) {
    digitalWrite(ledGruen, HIGH);
    digitalWrite(ledRot, LOW);
    delay(1000);
  } else {
    digitalWrite(ledGruen, LOW);
    digitalWrite(ledRot, HIGH);
  }
  delay(10);
}
```
***
[weiter zum Piepser](../03/index.html)   
***
[zurück](../index.html)


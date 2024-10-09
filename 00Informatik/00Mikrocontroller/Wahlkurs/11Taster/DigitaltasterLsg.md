<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Taster

## Ein Taster als digitaler Sensor
![alt text](2024-10-09_09-01.png)

#### Blink-Code:
```C++
void setup() {
  pinMode(6, OUTPUT);
  digitalWrite(6,LOW);  // aus
}

void loop() {
  digitalWrite(6, HIGH); // ein
  delay(500);            // 500 ms Pause: LED leuchtet
  digitalWrite(6, LOW);  // aus
  delay(500);            // 500 ms Pause: LED leuchtet nicht.
}
```
Als nächstes bauen wir den Taster in unseren Sketch ein:  
```C++
bool zustand=LOW;
int taster=2;
int ledPin=6

void setup() {
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin,LOW);  // aus
  
  pinMode(taster,INPUT);  
}

void loop() {
  if (digitalRead(taster)==HIGH){
    if (zustand==LOW){
        zustand=HIGH;
    } else {
        zustand=LOW;
    }
   digitalWrite(6, zustand); // ein
   delay(1000);
  }  
}
```
### Erläuterungen zum Code
#### bool zustand=LOW;
Wir definieren eine Variable, die den Zustand unserer LED speichert. Zu Beginn soll sie ausgeschaltet (LOW) sein.



[Lösung](DigitaltasterLsg.html)
  
  

[zurück](../index.html)

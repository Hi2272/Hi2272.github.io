 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

## Piepser bei der Alarmanlage

Der folgende Code schaltet bei Alarm einen Ton ein:  

```C++
int ledRot = 7;
int ledGruen = 8;
int sensor = 6;
int buzzer = 5;

void setup() {
  pinMode(ledRot, OUTPUT);
  pinMode(ledGruen, OUTPUT);
  pinMode(sensor, INPUT);
  pinMode(buzzer, OUTPUT);
  noTone(buzzer);
  Serial.begin(9600);
}

void loop() {
  int wert = digitalRead(sensor);
  Serial.println(wert);
  if (wert == HIGH) {
    digitalWrite(ledGruen, LOW);
    digitalWrite(ledRot, HIGH);
    tone(buzzer, 500);
    delay(500);
    tone(buzzer, 700);
    delay(500);
  } else {
    digitalWrite(ledGruen, HIGH);
    digitalWrite(ledRot, LOW);
    noTone(buzzer);
    delay(10);
  }
}

```
***
Zum Abspielen von Tönen verwenden wir die **tone()**-Methode. Sie benötigt zwei Parameter:
- int **pin**: Pin an dem der Buzzer angeschlossen ist.
- int **tonhoehe**: Tonhöhe, die abgespielt wird: 0-1023  

Um die Nerven aller Beteiligten zu schonen, kannst du die **tone**-Zeilen durch // auskommentieren:
```C++
//tone(buzzer,500);
delay(500);
//tone(buzzer,700);
delay(500);
noTone(buzzer);
```
***
["Musik" mit dem Buzzer](Musik.html)   
***
[zurück](../index.html)

 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

Code wird noch erweitert...

```C++
void loop(){

if (isAktiv){
    int wert = digitalRead(sensor);
    if (wert == HIGH) {
        digitalWrite(ledGruen, HIGH);
        digitalWrite(ledRot, LOW);
        tone(6, 500);
        delay(500);
        tone(6, 700);
        delay(500);
        noTone();
    } else {
        digitalWrite(ledGruen, LOW);
        digitalWrite(ledRot, HIGH);
    }
} else {
    digitalWrite(ledGruen, HIGH);
    digitalWrite(ledRot, HIGH);
}
}
```


[zurück](../index.html)
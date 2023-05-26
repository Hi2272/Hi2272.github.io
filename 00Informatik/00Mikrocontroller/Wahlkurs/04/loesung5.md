 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">


```C++
    case 71:
        if (code == geheimcode) {
          Serial.println("Code stimmt!");
          isAktiv=!isAktiv;
        } else {
          Serial.println("Code stimmt nicht!");
          code = "";
        }
        break;
```

Zum Schluss müssen wir jetzt noch unsere Alarmanlage einschalten, wenn **isAktiv** wahr ist und ausschalten, wenn **isAktiv** falsch ist.  
Hierzu ändern wir den Teil der **loop()**-Methode, den wir vorher auskommentiert haben:
```C++
 /*
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
  */
```
1. Schreibe an Stelle der /* Zeile folgenden Code:
```C++
if (isAktiv){
```
2. Schreibe an Stelle der */ Zeile folgenden Code:  
```C++
} else {
  digitalWrite(ledGruen, HIGH);
  digitalWrite(ledRot, HIGH);
}
```

Damit arbeitet die Alarmanlage nur, wenn die Variable **isAktiv** wahr ist (true). In diesem Fall leuchtet die LED grün so lange sie keine Bewegung erkennt und rot, wenn sie eine Bewegung wahrnimmt.  
Wenn die Variable **isAktiv** falsch ist (false), schaltet sich die LED aus.  
Über die Fernbedienung kann die Alarmanlage immer noch aus- und eingeschaltet werden.

[Gesamter Code](loesung6.html)  

[zurück](../index.html)


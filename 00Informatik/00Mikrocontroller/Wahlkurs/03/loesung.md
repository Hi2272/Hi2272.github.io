```C++
int led = 7;
int sensor = 6;
int buzzer = 5;

void setup(){
    pinMode(led,OUTPUT);
    pinMode(sensor,INPUT);
    pinMode(buzzer,OUTPUT);
}

```
***
Zum Abspielen von Tönen verwenden wir die **tone()**-Methode. Sie benötigt drei Parameter:
- int **pin**: Pin an dem der Buzzer angeschlossen ist.
- int **tonhoehe**: Tonhöhe, die abgespielt wird: 0-1023
- int **dauer**: Dauer des Tons in ms  

Erweitere deine Code jetzt so, dass er neben dem Lichtsignal auch einen wechselnden Ton abgibt, wenn er der Bewegungsmelder eine Bewegung registriert.  

1. Ersetze die **delay(1000)**-Anweisung in der **loop**-Methode durch folgenden Code:  
```C++
tone(buzzer,500);
delay(500);
tone(buzzer,700);
delay(500);
noTone(buzzer);
```
2. Teste deine Alarmanlage - sie müsste jetzt bei Bewegung leuchten und Krach machen.
3. Um die Nerven aller Beteiligten zu schonen, solltest du die **tone**-Zeilen durch // auskommentieren:
```C++
//tone(buzzer,500);
delay(500);
//tone(buzzer,700);
delay(500);
noTone(buzzer);
```
["Musik" mit dem Buzzer](weiter.html)   
[zurück](../index.html)

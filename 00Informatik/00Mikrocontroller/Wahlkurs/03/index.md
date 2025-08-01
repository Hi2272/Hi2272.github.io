 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Der passive Buzzer
En passiver Buzzer erzeugt Töne. Die Tonhöhe kann hierbei über den Arduino gesteuert werden.  
## 1. Die Schaltung
Erweitere die Schaltung deiner Alarmanlage um den Buzzer:  
- Pluspol -> Pin 5
- Minuspol -> GND   
![Buzzer auf GND und Pin5](Screenshot_1.png)
## 2. Die Programmierung
Der passive Buzzer muss an einen Pin angeschlossen werden, der mit einem ~ gekennzeichnet ist. Über diese Pins können analoge Signale zwischen 0 und 1024 augegeben werden. Je höher dieser Wert ist, desto höher ist der Ton, den der Buzzer aussendet.  
1. Deklariere eine Variable **buzzer** und weise ihr den Wert 5 zu.
2. Setze in der **setup()**-Methode die pinMode des buzzer-Pins auf OUTPUT.
   
[Lösung](loesung.html)   
[Musik mit dem Piepser](Musik.html)    
[zurück](../index.html)

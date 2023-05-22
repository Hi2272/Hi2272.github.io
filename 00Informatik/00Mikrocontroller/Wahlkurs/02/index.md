# Der Bewegungsmelder
Der PIR-Sensor gibt über einen Pin ein Signal aus, sobald er eine Bewegung registriert.
## 1. Die Schaltung
Die Pins des PIR-Sensors sind meistens unter der weißen Plastikhaube beschriftet. Diese Haube ist nur aufgesteckt - du kannst sie vorsichtig nach oben abziehen.  
Verbinde jetzt die Pins passend zur Beschriftung:
1. GND -> GND
2. VCC -> +5V
3. OUT -> Pin 6
   
![Alt text](../03/Screenshot_1.png)

## 2. Der Code
Definiere zunächst für die Pins Variablen und setze in der  **setup()**-Methode den Modus für die Pins.
```C++
int led = 7;
int sensor = 6;

void setup(){
    pinMode(led,OUTPUT);
    pinMode(sensor,INPUT);
}

```
In der **loop()**-Methode wird der Wert des Sensors ausgelesen.  
Wenn dieser Wert **HIGH** ist, wird die LED eingeschaltet, sonst wird sie ausgeschaltet.
```C++
void loop(){
    int wert=digitalRead(sensor);
    if (wert==HIGH){
        digitalWrite(led,HIGH);
        delay(1000);
    } else {
        digitalWrite(led,LOW);
    }
    delay(10);
}
``` 
## 3. Der Test
Teste deine Alarmanalage. 

## 4. Die Zweifarb-LED
Wenn die Alarmanlage eingeschaltet ist, soll die LED grün leuchten.  
Sobald eine Bewegung wahrgenommen wird, soll die Farbe der LED von grün auf rot wechseln.  
### Die Schaltung
Ersetze die rote LED auf dem Breadboard durch eine Zweifarb-LED.  
Achtung: Bei unseren Zweifarb-LEDs muss der gemeinsame Pol an den Pluspol angeschlossen werden. Du musst deine Schaltung daher etwas stärker umbauen:  
  
![Alt text](Screenshot_2.png)
### Der Programmcode
Ändere dein Programm wie folgt ab:
1. Benenne die Variable led in ledRot um.
2. Deklariere eine neue Variable ledGruen vom Typ int und weise ihr den Wert 8 zu.
3. Setze in der **setup()**-Methode den pinMode von ledGruen auf **OUTPUT**
4. Ändere die Sequenz, die ausgeführt wird, wenn eine Bewegung wahrgenommen wird:
   1. Die grüne LED soll ausgeschaltet werden.  
      Hierzu muss der Pin auf **HIGH** gestellt werden.  
      (Beide Pole der LED sind jetzt HIGH. Es liegt also kein Spannungsunterschied vor und kein Strom fließt.)
   2. Die rote LED soll eingeschaltet werden.  
   Hierzu muss der Pin auf **LOW** gestellt werden.
5. Ändere die Sequenz, die ausgeführt wird, wenn keine Bewegung wahrgenommen wird:
   1. die rote LED soll ausgeschaltet werden.
   2. die grüne LED soll eingechaltet werden.
6. Teste deine Alarmanlage


[Lösung](loesung.html)  

[zurück](../index.html)

***

<footer style="font-size:x-small;text-align: center;
    padding: 10px;
    margin: 10px;
    height: 10%;
    ">


  Die Schaltpläne sind mit <a href="https://www.tinkercad.com/dashboard">Tinkercad</a> erstellt. 
</footer>
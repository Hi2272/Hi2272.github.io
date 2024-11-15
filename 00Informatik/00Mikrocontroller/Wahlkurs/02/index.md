 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">


# Der Bewegungsmelder
Der PIR-Sensor gibt über einen Pin ein Signal aus, sobald er eine Bewegung registriert.
## 1. Die Schaltung
Die Pins des PIR-Sensors sind meistens unter der weißen Plastikhaube beschriftet. Diese Haube ist nur aufgesteckt - du kannst sie vorsichtig nach oben abziehen.  
Verbinde jetzt die Pins passend zur Beschriftung:
1. GND -> GND
2. VCC -> +5V
3. OUT -> Pin 6  

Auf der Vorderseite des Sensor befinden sich zwei Potentiometer:  
![alt text](IMG_20241115_165157.jpg)  
- Das linke regelt die Ausschaltverzögerung des Sensors.
- Das rechte regelt seine Empfindlichkeit.  
  
Sie können mit einem kleinen Schraubenzieher verstellt werden. 
- Drehe beide Potentiometer gegen den Uhrzeigersinn auf den minimalen Wert.

## 2. Der Code
Definiere zunächst für den Sensor-Pin eine Variable und setze in der  **setup()**-Methode diesen Pin als Eingang. 
Außerdem schalten wir den seriellen Monitor ein und stellen seine Datenrate auf 9600 Baud. Die serielle Schnittstelle überträgt jetzt maximal 9600 Zeichen pro Sekunde.

```C++
int sensor = 6;

void setup(){
    pinMode(sensor,INPUT);
    Serial.begin(9600);
}

```
In der **loop()**-Methode wird der Wert des Sensors ausgelesen.  
Wenn dieser Wert **HIGH** ist, wird eine entsprechende Nachricht über die serielle Schnittstelle ausgegeben.
```C++
void loop(){
    int wert=digitalRead(sensor);
    if (wert==HIGH){
        Serial.println("Bewegung");
        delay(1000);
    } 
    delay(10);
}
``` 
## 3. Der Test
Teste deine Alarmanalage. Nach dem Hochladen des Programms musst du den Seriellen Monitor einschalten:  
![alt text](<Serieller Monitor.png>)  


## 4. Die Zweifarb-LED
Wenn die Alarmanlage eingeschaltet ist, soll die LED grün leuchten.  
Sobald eine Bewegung wahrgenommen wird, soll die Farbe der LED von grün auf rot wechseln.  
### Die Schaltung
Baue eine Zweifarb-LED ein und schließe die 3 Beinchen wie folgt an:
- links -> Pin 8
- Mitte -> 1 kOhm-Widerstand -> +5V
- rechts -> Pin 7  
  
![Alt text](Screenshot_2.png)
### Der Programmcode
Ändere dein Programm wie folgt ab:
1. Deklariere zwei Variablen für die LED-Pins:
   1. ledRot = 8
   2. ledGruen = 7
2. Setze in der **setup()**-Methode den pinMode der beiden LED-Pins auf **OUTPUT**
3. Ändere die Sequenz, die ausgeführt wird, wenn eine Bewegung wahrgenommen wird:
   1. Die grüne LED soll ausgeschaltet werden.  
      Hierzu muss der Pin auf **HIGH** gestellt werden.  
      (Beide Pole der LED sind jetzt HIGH. Es liegt also kein Spannungsunterschied vor und kein Strom fließt.)
   2. Die rote LED soll eingeschaltet werden.  
   Hierzu muss der Pin auf **LOW** gestellt werden.
4. Ändere die Sequenz, die ausgeführt wird, wenn keine Bewegung wahrgenommen wird:
   1. die rote LED soll ausgeschaltet werden.
   2. die grüne LED soll eingechaltet werden.
5. Teste deine Alarmanlage


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
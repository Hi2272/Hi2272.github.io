# Der Bewegungsmelder
Der PIR-Sensor gibt über einen Pin ein Signal aus, sobald er eine Bewegung registriert.
## 1. Die Schaltung
Baue diese Schaltung auf:
![Alt text](Screenshot_1.png)
## 2. Der Code
Definiere zunächst für die Pins Variablen und setze in der  **setup()**-Methode den Modus für die Pins.
```C++
int led = 7;
int sensor = 6;

void setup{
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
 
[zurück](../index.html)

***

<footer style="font-size:x-small;text-align: center;
    padding: 10px;
    margin: 10px;
    height: 10%;
    ">


  Die Schaltpläne sind mit <a href="https://www.tinkercad.com/dashboard">Tinkercad</a> erstellt. 
</footer>
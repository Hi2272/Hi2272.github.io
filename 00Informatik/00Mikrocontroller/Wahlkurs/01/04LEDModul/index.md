# Die 3-Farben-LED
## 1. Schaltung
Auf dem Modul sind die nötigen Vorwiderstände bereits verlötet. Wir können es daher sehr einfach an den Arduino UNO anschließen:
- B : Pin 3
- R : Pin 5
- G : Pin 9
- Minus: GND

Die drei Pins 3,5 und 9 sind mit einem ~ gekennzeichnet. Das bedeutet, dass der Arduino an dieser Stelle analoge Werte zwischen 0 und 255 ausgeben kann. Wir können unsere LEDs also dimmen.

## 2. Programmierung
1. Schreibe folgenden Sketch und lade ihn auf den Arduino hoch:
```C++
int blau=3;
int rot=5;
int gruen=9;

void setup(){
    pinMode(rot,OUTPUT);
    pinMode(gruen,OUTPUT);
    pinMode(blau,OUTPUT);
    analogWrite(rot,255);
    analogWrite(gruen,0);
    analogWrite(blau,0);
}

void loop(){

}
```
2. Programmiere folgende Sequenz in der loop()-Methode 
   1. Die LED leuchtet 500 ms lang grün.
   2. Die LED leuchtet 500 ms lang blau.
   3. Die LED leuchtet 500 ms lang weiß (Mischung aus rot,grün und blau).
   4. Die LED leuchtet 500 ms lang rot.
   5. Die LED leuchtet 500 ms schwach rot (50 Einheiten).
 
[Lösung](Loesung.html)
       
[zurück](../index.html)

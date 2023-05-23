 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">


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
    analogWrite(rot,0);
    analogWrite(gruen,255);
    analogWrite(blau,0);
    delay(500);
    analogWrite(rot,0);
    analogWrite(gruen,0);
    analogWrite(blau,255);
    delay(500);
    analogWrite(rot,255);
    analogWrite(gruen,255);
    analogWrite(blau,255);
    delay(500);
    analogWrite(rot,255);
    analogWrite(gruen,0);
    analogWrite(blau,0);
    delay(500);
    analogWrite(rot,50);
    analogWrite(gruen,0);
    analogWrite(blau,0);
    delay(500);
}
```
## Vereinfachung des Codes
Um den Code einfacher zu gestalten, definieren wir eine neue Methode **farbe**, mit der die LED in einer bestimmten Farbe leuchten soll.  
1. Schreibe diesen Code zwischen die setup()- und die loop()-Methode
``` C++
void farbe(int r,int g,int b){
    analogWrite(rot,r);
    analogWrite(gruen,g);
    analogWrite(blau,b);
}
```
2. Ersetze jetzt in der loop()-Methode die analogWrite(...)-Blöcke durch den Aufruf der neuen Methode farbe() mit den passenden Parameterwerten.  
Bsp.: farbe(255,0,0); für rot

[Lösung](Loesung2.html)
       
[zurück](../index.html)

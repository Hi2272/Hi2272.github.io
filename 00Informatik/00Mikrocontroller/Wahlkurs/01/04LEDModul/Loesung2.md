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

void farbe(int r,int g,int b){
    analogWrite(rot,r);
    analogWrite(gruen,g);
    analogWrite(blau,b);
}


void loop(){
    farbe(0,255,0);
    delay(500);
    farbe(0,0,255);
    delay(500);
    farbe(255,255,255);
    delay(500);
    farbe(255,0,0);
    delay(500);
    farbe(50,0,0);
    delay(500);
}
```
## Dimmen der LEDs
1. Mit einer neuen Methode **fadeIn** soll die LED langsam aufgeblendet werden:
``` C++
void fadeIn(int r,int g,int b){
    for (int i=0;i<=100;i++){
        farbe(r*i/100,g*i/100,b*i/100);
        delay(10);
    }
}
```
2. Ersetze jetzt in der **loop()**-Methode die Aufrufe der Methode **farbe** durch Aufrufe der Methode **fadeIn**.   
    
[Lösung](Loesung3.html)
       
[zurück](../index.html)

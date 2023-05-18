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

void fadeIn(int r,int g,int b){
    for (int i=0;i<=100;i++){
        farbe(r*i/100,g*i/100,b*i/100);
        delay(10);
    }
}


void loop(){
    fadeIn(0,255,0);
    delay(500);
    fadeIn(0,0,255);
    delay(500);
    fadeIn(255,255,255);
    delay(500);
    fadeIn(255,0,0);
    delay(500);
    fadeIn(50,0,0);
    delay(500);
}
```

## Abdimmmen der LED
1. Erstelle eine Methode **fadeOut**, die die LED langsam wieder abdimmt:
```C++
void fadeOut(int r,int g,int b){
    for (int i=100;i>=0;i--){
        farbe(r*i/100,g*i/100,b*i/100);
        delay(10);
    }
}
```
2. Ersetze in der **loop()**-Methode die **delay(500)**-Aufrufe durch Aufrufe der Methode **fadeOut**.

[Lösung](Loesung4.html)
       
[zurück](../index.html)

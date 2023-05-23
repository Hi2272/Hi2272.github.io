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

void fadeOut(int r,int g,int b){
    for (int i=100;i>=0;i--){
        farbe(r*i/100,g*i/100,b*i/100);
        delay(10);
    }
}


void loop(){
    fadeIn(0,255,0);
    fadeOut(0,255,0);
    
    fadeIn(0,0,255);
    fadeOut(0,0,255);

    fadeIn(255,255,255);
    fadeOut(255,255,255);
    
    fadeIn(255,0,0);
    fadeOut(255,0,0);
    
    fadeIn(50,0,0);
    fadeOut(50,0,0);
}
```

       
[zurück](../index.html)

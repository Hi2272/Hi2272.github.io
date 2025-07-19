 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">


```c++
int ledPin[] = {7,8,9,10,11,12};

void setup() {
    for (int i=0;i<6;i++){
        pinMode(ledPin[i], OUTPUT);
    }
}

void loop() {
    for (int i=0;i<6;i++){
      digitalWrite(ledPin[i], HIGH);
      delay(500);
      digitalWrite(ledPin[i], LOW);
    }
}
```
  
[zurück](../index.html)
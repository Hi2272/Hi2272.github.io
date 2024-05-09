<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Lösung Joystick


```C++
int pinX = 12;
int pinY = 14;

void setup() {
  pinMode(pinX, INPUT);
  pinMode(pinY, INPUT);
  Serial.begin(115200);
}

void loop() {
  int x = analogRead(pinX);
  int y = analogRead(pinY);

  if (x > 3000) {
    Serial.println("Links");
    delay(50);
  } else if (x < 1000) {
    Serial.println("Rechts");
    delay(50);
  }

  if (y < 1000) {
    Serial.println("Hoch");
    delay(50);
  } else if (y > 3000) {
    Serial.println("Runter");
    delay(50);
  }
}
```

[weiter](BLEKeyboard.html)  

[zurück](../../index.html)   


   <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Kabelloser Game-Controller I
## 1. Problemstellung
Das klassische Computerspiel Pac Man kann online unter folgender Adresse gespielt werden:  
[Google Pac Man](https://www.google.com/logos/2010/pacman10-i.html)  
Die Steuerung erfolgt dabei mit den Cursortasten der Tastatur.  
In dieser Übung bauen wir mit dem ESP32 und einem Joystick-Modul ein einfaches Gamepad, das über Bluetooth mit dem Computer verbunden wird und diese Tastatursignale erzeugt.
## 2. Das Joystick-Modul
### 2.1 Anschluss
Wir schließen das Joystick-Modul direkt an den ESP32 an:
- Joystick  -> ESP32
- GND       -> GND
- +5V       -> 3,3V
- VRx       -> G12
- VRy       -> G14
### 2.2 Programmierung
Kopiere folgenden Code in einen neuen Sketch und lade ihn auf den ESP32 hoch:
```C++
int pinX=12;
int pinY=14;

void setup() {
  pinMode(pinX,INPUT);
  pinMode(pinY,INPUT);
  Serial.begin(115200);
}

void loop() {
    int x = analogRead(pinX);
    int y = analogRead(pinY);
    Serial.println("x: "+String(x)+", y: "+String(y));
    delay(50);
}
```
## Erläuterungen zum Code
Der Joystick gibt über die Pins VRx und VRy analoge Werte aus, die in diesem Programm ausgelesen und auf dem seriellen Monitor dargestellt werden.  
1. Untersuche, wie sich die Werte ändern, wenn du den Joystick nach oben, unten, rechts oder links bewegst.
2. Verändere das Programm so, dass es nicht mehr die Werte von x und y ausgibt, sondern nur noch als Text ausgibt, ob der Joystick nach links, rechts, oben oder unten bewegt wurde. Verwende hierzu bedingte Anweisungen:  
```C++
   if (x>...){
      ...
   } else if (x<...){
      ...
   }
   if (y>...){
      ...
   } else if (y<...){
      ...
   }
```

[Lösung](Loesung.html)  

[zurück](../../index.html)   

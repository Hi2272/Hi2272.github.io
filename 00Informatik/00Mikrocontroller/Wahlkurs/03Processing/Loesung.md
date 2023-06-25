```Java
import meter.*;
import processing.serial.*;

Meter m;
Serial serial;

// Läuft einmal ab
void setup() {
  printArray(Serial.list());
  String port=Serial.list()[0];
  serial=new Serial(this, port, 9600);
  size(500, 400);
  background(0, 0, 0);
  m=new Meter(this, 25, 10);
  m.setTitle("Temperatur in °C");
  String[] labels={"-30", "-20", "-10", "0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100", "110"};
  m.setScaleLabels(labels);
}

String input="";
int wert=0;

// Läuft wiederholt ab

void draw() {
  while (serial.available()>0) {
    input=serial.readStringUntil(10);
    if (input!=null) {
      wert=int(input);
      m.updateMeter(wert);
    }
  }
}
```
[zurück](../index.html)
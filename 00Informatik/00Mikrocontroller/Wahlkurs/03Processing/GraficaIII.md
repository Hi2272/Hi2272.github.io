 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

```Java
import grafica.*;
import processing.serial.*;

GPlot plot;
Serial serial;

int startZeit;
float ymin=30;
float ymax=31;

int sekunden() {
  return hour()*3600+minute()*60+second();
}

void setup() {
  printArray(Serial.list());
  String port=Serial.list()[0];
  serial=new Serial(this, port, 9600);

  size(500, 350);
  background(0, 0, 0);

  plot=new GPlot(this, 25, 25);
  plot.setTitleText("Temperaturmessung");
  plot.getXAxis().setAxisLabelText("Zeit in Sekunden");
  plot.getYAxis().setAxisLabelText("Temp. in °C");
  plot.setXLim(0, 10);
  plot.setYLim(ymin,ymax);
  plot.defaultDraw();

  startZeit=sekunden();
}

void draw() {
  while (serial.available()>0) {
    String input=serial.readStringUntil(10);
    if (input!=null) {
      float wert=float(input);
      int x=sekunden()-startZeit;
      if (wert<ymin+10) {
        ymin=wert-10;
      }
      if (wert>ymax-10) {
        ymax=wert+10;
      }
      plot.setYLim(ymin, ymax);
      plot.setXLim(0, x+10);

      plot.addPoint(x, wert);
      plot.defaultDraw();
    }
  }
}
```



[zurück](../index.html)


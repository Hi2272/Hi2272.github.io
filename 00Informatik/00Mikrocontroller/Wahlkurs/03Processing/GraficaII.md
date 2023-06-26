 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">
 
# Darstellung der Daten der Seriellen Schnittstelle
## 1. Einfache Darstellung
Wir können viel Code aus dem ersten Programm zum Ansprechen der Seriellen Schnittstelle kopieren:
```Java
import grafica.*;
import processing.serial.*;

GPlot plot;
Serial serial;


int startZeit;

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
  plot.setXLim(0, 100);
  plot.setYLim(-30, 110);
  plot.defaultDraw();
  
  startZeit=sekunden();
}

void draw() {
  while (serial.available()>0) {
    String input=serial.readStringUntil(10);
    if (input!=null) {
      float wert=float(input);
      int x=sekunden()-startZeit;
      plot.addPoint(x, wert);
      plot.defaultDraw();
    }
  }
}
```
Das Attribut **aktuelleZeit** benötigen wir jetzt nicht mehr, da das System nur dann zeichnet, wenn über die Serielle Schnittstelle Daten gesendet werden. Der Arduino gibt jetzt den Takt für unser Programm vor.

## Automatische Anpassung der Achsen
Mit **plot.setXLim(0, 100);** und **plot.setYLim(-30, 110);** legen wir die Skalierung der Achsen in der **setup**-Methode starr fest. Wenn unsere Daten außerhalb dieses Rahmens liegen, werden sie nicht gezeichnet.  
Im Folgenden werden wir das Programm so ändern, dass die Achsen sich an die Daten anpassen.  
1. Deklariere zwei neue Attribut ymin und ymax vom Typ float (Dezimalzahl).
2. Initialisiere diese Attribute mit den Werten ymin=30 und ymax=31.
3. Programmiere folgende Sequenz in der **draw**-Methode:
   1. Wenn wert größer als ymax-10 ist, soll ymax auf wert+10 gesetzt werden.
   2. Wenn wert kleiner als ymin+10 ist, soll ymin auf wert-10 gesetzt werden.
   3. plot.setYLim(ymin,ymax) soll aufgerufen werden.
   4. plot.setXLim(0,x+10) soll aufgerufen werden.

Wenn du das Programm ablaufen lässt, müssten sich die Achsen automatisch an die Messwerte anpassen.

[Lösung](GraficaIII.html)

[zurück](../index.html)


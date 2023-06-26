 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

``` Java
import grafica.*;

GPlot plot;

int startZeit;
int aktuelleZeit;

int sekunden() {
  return hour()*3600+minute()*60+second();
}

void setup() {
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
  aktuelleZeit=sekunden();
}

void draw() {
  if (aktuelleZeit<sekunden()) {
    aktuelleZeit=sekunden();
    int x=aktuelleZeit-startZeit;
    plot.addPoint(x, x);
    plot.defaultDraw();
  }
}
```

[weiter](GraficaII.html)

[zurück](../index.html)

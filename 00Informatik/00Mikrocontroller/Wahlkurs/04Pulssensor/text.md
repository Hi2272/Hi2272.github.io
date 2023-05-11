# Wir messen unseren Puls

## 1. Der Pulssensor
Wir arbeiten mit einem KY-039 Herzschlag-Sensor.  
Er besteht aus einer Infrarot-LED und einem Infratrot-Sensor.  
## 2. Das Messprinzip
Wenn du deinen Finger zwischen die Infrarot-LED und den Sensor hältst, dann wird er vom IR-Licht durchstrahlt. Durch den Pulsschlag weiten und verengen sich die Adern in deinem Finger. Damit ändert sich auch die Menge an IR-Licht, die im Finger zurückgehalten (=absorbiert) wird.  Der Sensor misst den Anteil des Lichtes, der nicht absorbiert wird.  
Pulsuhren basieren auf dem gleichen Prinzip. Hier wird in der Regel eine grün leuchtende LED eingesetzt und bestimmt, wie viel Licht von der Haut reflektiert wird.

## 3. Die Verkabelung
Stecke das KY-039-Modul auf das Breadboard und schließe es wie folgt an den Arduino Uno an:  
- Pin bei R1: A0 
- mittlere Pin: +5V
- Pin bei R2:  GND  

Über den analogen Eingang A0 messen wir die Lichtintensität, die auf den Sensor fällt.

##


[Quelle](https://projecthub.arduino.cc/Johan_Ha/8c660b94-ae6c-4b1b-b8c9-477facc50262)

[zurück](../index.html)

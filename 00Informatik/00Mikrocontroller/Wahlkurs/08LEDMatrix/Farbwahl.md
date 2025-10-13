<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Neopixel-Matrix
## Farbwahl

Im folgenden Code werden über die Serielle Schnittstelle Farbwerte eingegeben, die anschließend auf der Matrix dargestellt werden.  
Bsp.: Eingabe: 255,0,0 -> Rot


```C++
#include <Adafruit_NeoPixel.h>
#define LED_PIN 13
#define NUM_LED 40

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LED, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  Serial.begin(9600);
  strip.begin();  // INITIALIZE NeoPixel strip object (REQUIRED)
  strip.setPixelColor(0, 255, 255, 0);
  strip.show();  // Turn OFF all pixels ASAP
}

void setPixels(int r, int g, int b) {
  for (int i = 0; i < NUM_LED; i++) {
    strip.setPixelColor(i, r, g, b);
  }
  strip.show();
}


void loop() {
  int r = 0, g = 0, b = 0;
  if (Serial.available()) {
      String input = Serial.readStringUntil('\n');  // Zeile einlesen
      input.trim();                                 // Leerzeichen entfernen
      int firstComma = input.indexOf(',');
      int secondComma = input.indexOf(',', firstComma + 1);

      if (firstComma > 0 && secondComma > firstComma) {
        String rStr = input.substring(0, firstComma);
        String gStr = input.substring(firstComma + 1, secondComma);
        String bStr = input.substring(secondComma + 1);

        r = rStr.toInt();
        g = gStr.toInt();
        b = bStr.toInt();

        strip.setPixelColor(0, r, g, b);
        Serial.println(input);
      }
      strip.show();
    }
}
```

[zurück](index.html)
<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Neopixel-Matrix
## Regenbogen

Der folgende Code blendet die Farben eines Regenbogens langsam ineinander über.

```C++
#include <Adafruit_NeoPixel.h>
#define LED_PIN 13
#define NUM_LED 40

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LED, LED_PIN, NEO_GRB + NEO_KHZ800);

void setup() {
  Serial.begin(115200);
  strip.begin();  // INITIALIZE NeoPixel strip object (REQUIRED)
  strip.setPixelColor(0, 255, 255, 0);
  strip.show();  // Turn OFF all pixels ASAP
}

int farben[6][3] = {
  { 255, 0, 0 },    // rot
  { 255, 50, 0 },   // orange
  { 255, 140, 0 },  // gelb
  { 0, 255, 0 },    //gruen
  { 0, 0, 255 },    // blau
  { 20, 0, 40 }     // violett
};


void fade(int c1, int c2, int steps, int pause) {
  float stepR = ((farben[c2][0] - farben[c1][0]) * 1.0) / steps;
  float stepG = ((farben[c2][1] - farben[c1][1]) * 1.0) / steps;
  float stepB = ((farben[c2][2] - farben[c1][2]) * 1.0) / steps;
  for (int step = 0; step < steps; step++) {
    int rNeu = farben[c1][0] + stepR * step;
    int gNeu = farben[c1][1] + stepG * step;
    int bNeu = farben[c1][2] + stepB * step;
    setPixels(rNeu, gNeu, bNeu);
    delay(pause);
  }
  setPixels(farben[c2][0], farben[c2][1], farben[c2][2]);
}

void setPixels(int r, int g, int b) {
  for (int i = 0; i < NUM_LED; i++) {
    strip.setPixelColor(i, r, g, b);
  }
  strip.show();
}

void regenbogen(int anz){
  for (int i=0;i<anz;i++){
    fade(i,(i+1)%anz,50,200);
  }
}

void loop() {
  regenbogen(6);
}
```

[zurück](index.html)
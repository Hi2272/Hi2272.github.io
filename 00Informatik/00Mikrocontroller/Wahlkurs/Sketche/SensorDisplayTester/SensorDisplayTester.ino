#include <Adafruit_GFX.h>     // Core graphics library
#include <Adafruit_ST7735.h>  // Hardware-specific library for ST7735
#include <SPI.h>
#define TFT_CS 10
#define TFT_RST 8
#define TFT_DC 9
Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RST);

int trigger = 6;  // Trigger zum Senden des Signals
int echo = 7;     // Echo zum Empfangen des relektierten Signals
int sensor = 5;   // PIR Sensor


void setup(void) {
  Serial.begin(9600);
  tft.initR(INITR_BLACKTAB);  // Init ST7735S chip, black tab
  tft.fillScreen(ST77XX_BLACK);
  drawText("Display OK!", 0, 50, ST77XX_RED, 1);
  pinMode(trigger, OUTPUT);  // Trigger-Pin ist ein Ausgang
  pinMode(echo, INPUT);      // Echo-Pin ist ein Eingang
  pinMode(sensor, INPUT);
  Serial.println("Setup abgeschlossen!");
}

void loop() {
  drawText("Display OK!", 0, 10, ST77XX_RED, 1);

  digitalWrite(trigger, LOW);
  delay(5);
  digitalWrite(trigger, HIGH);
  delay(10);
  digitalWrite(trigger, LOW);

  int dauer = pulseIn(echo, HIGH);
  int entfernung = (dauer / 2) * 0.03432;
  drawText(String(entfernung), 0, 30, ST77XX_RED, 1);
  drawText("cm", 0, 60, ST77XX_RED, 1);
  Serial.println("Entfernung: " + String(entfernung));
  int wert = digitalRead(sensor);
  if (wert == HIGH) {
    drawText("Bewegung: " + String(wert), 0, 90, ST77XX_RED, 1);
    Serial.println("Bewegung: " + String(wert));
  }
  delay(1000);
  tft.fillScreen(ST77XX_BLACK);
}

void drawText(String text, uint16_t color) {
  drawText(text, 0, 50, color, 2);
}

void drawText(String text, int x, int y, uint16_t color, int size) {
  tft.setCursor(x, y);
  tft.setTextColor(color);
  tft.setTextSize(size);
  tft.setTextWrap(true);
  tft.print(text);
}

void fillScreenBlink(uint16_t color1, uint16_t color2) {
  tft.fillScreen(color1);
  delay(1000);
  tft.fillScreen(color2);
}
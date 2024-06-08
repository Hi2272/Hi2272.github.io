<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# SPI Displays
## Allgemeines
**SPI** steht für **Serial Peripheral Interface**. Mit diesem Standard ist es möglich, Geräte wie Displays oder Sensoren über einen seriellen Anschluss mit dem Arduino zu verbinden.   
Leider ist die Bezeichnung der Pins bei SPI-Geräten nicht einheitlich geregelt. Die folgende Tabelle kann als Hilfestellung verwendet werden:  

| Pin-Name    | Alternative | Bedeutung |
| -------- | ------- | ---- |
SCK|SCLK, CLK| Serial Clock|
CS|SS|Chip Select|
MISO|SDO, DO, CIPO, RS|Master in Slave Out|
MOSI|SDI, DI, COPI|Master out Slave In|

Beim SPI-Protokoll kommuniziert **ein Master- oder Controller-Gerät** (z.B. ein Arduino) mit **einem oder mehreren Slave- oder Peripheral-Geräten** (z.B. ein Sensor und ein Display).
## Bedeutung der Pins
### SCK
Die Serial-Clock-Pin dient als Taktgeber für die Datenübertragung. Er legt also fest, mit welcher Geschwindigkeit die einzelnen Datenbits übertragen werden. Bei der Datenübertragung erzeugt der **Master** die CLK-Impulse und legt damit die Datenrate fest.
### CS
Der Chip-Select-Pin dient dazu festzulegen, welches Slave-Gerät vom Master-Gerät angesprochen wird.
### MISO, SDO, CIPO
Der Master-In-Slave-Out-Pin (Controller-In-Peripheral-Out) dient zur Datenübertragung vom Slave- zum Master-Gerät. Sobald das Slave-Gerät ein CLK-Signal empfängt, muss es ein Signal über den MISO-Pin schicken.
### MOSI, SDI, COPI
Der Master-Out-Slave-In-Pin (Controller-Out-Peripheral-In) dient zur Datenübertragung vom Master- zum Slave-Gerät.  
Da im SPI-Protokoll also für jede Richtung ein eigener Kanal vorliegt, könnnen Daten gleichzeitig in beide Rictungen übertragen werden.
## SPI-Pins am Arduino Uno
Am Arduino sind folgende SPI-Pins als Standard festgelegt:
|Pin-Nr.|SPI-Pin|
|----|----|
|10|CS, SS|
|11|MOSI, SDI, DI, COPI|
|12|MISO, SDO, DO, CIPO, RS|
|13|SCK, CLK|  

Für die Verwendung muss die SPI.h Bibliothek in den Sketch eingebunden werden:  
``` C++
#include <SPI.h>
```  
## Weitere Pins am Display
Am Display sind in der Regel weitere Pins vorhanden, die wie folgt verkabelt werden müssen:  
|Display|Arduino|Bedeutung|
|---|---|---|
|VCC|5V|+ Pol|
|GND|GND|- Pol|
|LED, BL|3,3 V|Hintergrundbeleuchtung|
|RES, RST|Pin 8|Reset|

Der LED-Pin kann auch mit einem PWM-Pin am Arduino (3, 5, 6, 9) verbunden werden. Dann kann die Helligkeit reguliert werden.  

Manche Displays haben einen SDA-Pin. Dies ist ein SPI-Pin, der Daten senden und empfangen kann. Am Arduino sollte er mit dem MOSI-Pin (11) verbunden werden, das das Dislay als Slave nur Daten vom Master empfängt. Der MISO-Pin (12) bleibt in diesem Fall frei.  

## 1,77 Zoll 160x128 RGB Display (blau)
### Anschluss
Diese Displays dürfen nur an 3,3V angeschlossen werden. Da der Arduino Uno auf seinen GPIO-Pins 5 V ausgibt, müssen die Pins über einen Logic-Level-Converter (LLC) auf 3,3V reduziert werden.

|Display|LLC|Arduino|
|---|---|---|
|SCK|A1 - B1|13|
|SDA|A2 - B2|11|
|RES|A3-B3|8|
|RS|A4 . B4|9|
|CS|A5 - B5|10|
LEDA|VA|3,3 V|
VCC|VB|5V|
|OE (via 1kOhm)|3,3 V|
### Code
```C++
#include <Adafruit_GFX.h>
// Core graphics library
#include <Fonts/FreeSansBold9pt7b.h>
#include <Adafruit_ST7735.h> // Hardware-specific library
#include <SPI.h>

Adafruit_ST7735 tft = Adafruit_ST7735(10, 8, 9);

void setup(void) {
    tft.initR(INITR_GREENTAB);
    tft.fillScreen(ST77XX_BLACK);
    delay(500);
    testbild();
    delay(1000);
    tft.setTextColor(ST77XX_WHITE, ST77XX_BLACK);
    tft.setTextSize(2);
    tft.setFont(); // reset font to default
}

void loop() {
    for(uint8_t i = 0; i < 100; i++) {
        changing_value(i);
        delay(100);
    }
}

void testbild() {
    tft.setFont(&FreeSansBold9pt7b);
    tft.fillScreen(ST77XX_BLACK);
    tft.setTextColor(ST77XX_RED);
    tft.setCursor(14, 22);
    tft.print("Testbild");
    tft.drawFastHLine(0, 35, 128, ST77XX_GREEN);
    tft.drawTriangle(1, 45, 28, 70, 55, 45, ST77XX_WHITE);
    tft.fillTriangle(78, 70, 104, 45, 127, 70, 0xA3F6);
    tft.drawRect(1, 80, 50, 30, ST77XX_BLUE);
    tft.fillRoundRect(78, 80, 50, 30, 5, 0x2D4E);
    tft.fillCircle(25, 135, 15, 0x5BA9);
    tft.drawCircle(102, 135, 15, ST77XX_GREEN);
    tft.drawLine(45, 150, 80, 40, ST77XX_ORANGE);
}

void changing_value(uint8_t value) {
    if(value < 10) {
        tft.setCursor(15, 88);
        tft.print("0");
        tft.print(value);
    } else {
        tft.setCursor(15, 88);
        tft.print(value);
    }
}
```

## 1,8 Zoll 128x160 RGB Display (rot)
### Anschluss
|Display|Arduino|Bedeutung|
|---|---|---|
|LED|3,3 V|Hintergrundbeleuchtung|
|SCK|13|Taktgeber|
|SDA|11|MOSI: Datenübetragung Arduino - Display|
|A0|9||
|RES, RST|Pin 8|Reset|
|CS|10|Chip Select|
|GND|GND|
|VCC|5V|

### Code
``` C++
#include <Adafruit_GFX.h> // Core graphics library
#include <Adafruit_ST7735.h> // Hardware-specific library for ST7735
#include <SPI.h>
#define TFT_CS 10
#define TFT_RST 8
#define TFT_DC 9
Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RST);

void setup(void){
    Serial.begin(9600);
    tft.initR(INITR_BLACKTAB); // Init ST7735S chip, black tab
    tft.fillScreen(ST77XX_BLACK);
    drawtext("Hallo!", ST77XX_RED);
    Serial.println("Setup abgeschlossen!");
}

void loop() {
    tft.invertDisplay(true);
    delay(500);
    tft.invertDisplay(false);
    delay(500);
}

void drawtext(char *text, uint16_t color) {
    tft.setCursor(0, 50);
    tft.setTextColor(color);
    tft.setTextSize(2);
    tft.setTextWrap(true);
    tft.print(text);
}

void fillScreenBlink(uint16_t color1, uint16_t color2) {
    tft.fillScreen(color1);
    delay(1000);
    tft.fillScreen(color2);
}
```

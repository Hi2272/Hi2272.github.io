#include <BleKeyboard.h>

BleKeyboard bleKeyboard;

int pinX = 12;
int pinY = 14;

void setup() {
  pinMode(pinX, INPUT);
  pinMode(pinY, INPUT);
  Serial.begin(115200);
  // Bluetooth einschalten -> Wartet auf Kopplung
  bleKeyboard.begin();
}

void loop() {
  if (bleKeyboard.isConnected()) {
    int x = analogRead(pinX);
    int y = analogRead(pinY);

    if (x > 3000) {
      Serial.println("Links");
      bleKeyboard.press(KEY_LEFT_ARROW);
      delay(50);
 
    } else if (x < 1000) {
      Serial.println("Rechts");
      bleKeyboard.press(KEY_RIGHT_ARROW);
      delay(50);
 
    }
    if (y < 1000) {
      Serial.println("Hoch");
      bleKeyboard.press(KEY_UP_ARROW);
     delay(50);
 
    } else if (y > 3000) {
      Serial.println("Runter");
      bleKeyboard.press(KEY_DOWN_ARROW);
      delay(50);
 
   }
     bleKeyboard.releaseAll();
  }
}
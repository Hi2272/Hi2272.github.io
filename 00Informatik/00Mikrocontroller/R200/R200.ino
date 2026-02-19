/**
 * R200 RFID demonstration
 * Copyright (c) 2023 Alastair Aitchison, Playful Technology
 */ 

// INCLUDES

#include "R200.h"

// GLOBALS
unsigned long lastResetTime = 0;
R200 rfid;

void setup() {

  // Intitialise Serial connection (for debugging)
  Serial.begin(115200);
  Serial.println(__FILE__ __DATE__);

  rfid.begin(&Serial2, 115200, 16, 17);
  rfid.setMultiplePollingMode(true);
  
  // Get info
  rfid.dumpModuleInfo();
  Serial.println("Setup abgeschlossen!");
}

void loop() {
  rfid.loop();

  // Periodically re-send the read command
  if(millis() - lastResetTime > 10){
    digitalWrite(LED_BUILTIN, HIGH);
    rfid.poll();
    int res=0;
    for (int i=0;i<12;i++){
      res=res+rfid.uid[i]<<i;
    }

    if (res>0){
     Serial.println(res);
    } 
   // rfid.dumpUIDToSerial();
    digitalWrite(LED_BUILTIN, LOW);
    lastResetTime = millis();
   // Serial.println();
  }
  delay(10);
}
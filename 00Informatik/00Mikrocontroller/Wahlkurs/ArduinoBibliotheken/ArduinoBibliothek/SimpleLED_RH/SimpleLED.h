#ifndef SIMPLE_LED_H
#define SIMPLE_LED_H

#include <Arduino.h>

class SimpleLED {
public:
    SimpleLED(int pinNummer); 
    SimpleLED(int pinNumber,int onLevel);
 
    void an();
    void aus();

protected:
    int pin;
    int onLevel;
};

#endif

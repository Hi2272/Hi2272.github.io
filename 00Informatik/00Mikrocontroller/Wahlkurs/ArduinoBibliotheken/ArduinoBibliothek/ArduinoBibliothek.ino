#include <SimpleLED.h>

SimpleLED led=SimpleLED(2);

void setup(){}

void loop(){
    led.an();
    delay(500);
    led.aus();
    delay(500);
}

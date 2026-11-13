#include "SimpleLED.h"

SimpleLED::SimpleLED(int pinNummer) {
    pin=pinNummer;
    pinMode(pin, OUTPUT);
    onLevel=HIGH;
}

SimpleLED::SimpleLED(int pinNummer, int onLevelWert) {
    pin=pinNummer;
    pinMode(pin, OUTPUT);
    onLevel=onLevelWert;
}

void SimpleLED::an() {
    digitalWrite(pin, onLevel);
}

void SimpleLED::aus() {
    digitalWrite(pin, !onLevel);
}



#include <AccelStepper.h>

const byte Fullstep = 4;
const byte Halfstep = 8;
const short fullRevolution = 2038;
const float SteppDegree = 11.32;  // Half/Full 11.32 / 5.66
// Pins IN1-IN3-IN2-IN4
AccelStepper stepper(Halfstep, 11, 9, 10, 8);
void setup() {
  stepper.setMaxSpeed(250.0);
  stepper.setAcceleration(100.0);
  Serial.begin(9600);

  blattEinziehen();
  delay(2000);

  for (int i = 0; i < 3; i++) {
    zeileEinziehen(1);
    delay(1000);
  }
  blattAuswerfen();
}

void einziehen(float wert) {
  Serial.print(stepper.currentPosition());
  stepper.runToNewPosition(stepper.currentPosition()-1 * wert);  // Cause an overshoot then back to 0
  Serial.println("->"+String(stepper.currentPosition()));
}

void blattEinziehen() {
  stepper.setCurrentPosition(0);
  einziehen(800);
}

void zeileEinziehen(float abstand) {
  einziehen(abstand * 80);
}

void blattAuswerfen() {
  stepper.runToNewPosition(-5000);
}


void loop() {
}

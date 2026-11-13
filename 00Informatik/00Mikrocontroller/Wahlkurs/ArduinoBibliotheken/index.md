# Eigene Bibliotheken für Arduino entwickeln
## Grundlagen
Wolfgang Ewald beschreibt auf seiner Internetseite die Grundlagen zur Objektorientierten Programmierung und zu Bibliotheken für Arduino:  
https://wolles-elektronikkiste.de/bibliotheken-und-klassen-erstellen-teil-i

## Ordnerstruktur
### Gezippter Ordner
Eine Arduino-Bibliothek kann als gezippter Ordner gespeichert, heruntergeladen und installiert werden:  
- SimpleRobot_RH.zip
  
Der Name muss eindeutig sein, deshalb hängen wir das Kürzel **_RH** an.

In diesem Ordner müssen mindestens zwei Dateien enthalten sein:
### Header-Datei: SimpleRobot.h
```C++
#ifndef SIMPLE_ROBOT
#define SIMPLE_ROBOT
#include <Arduino.h>

class SimpleRobot{
    public:
        SimpleRobot();  // Konstruktur
        

}

````

## Quell-Datei: MeineNeueBib.cpp

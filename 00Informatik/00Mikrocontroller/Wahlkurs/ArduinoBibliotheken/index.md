# Eigene Bibliotheken für Arduino entwickeln
## Grundlagen
Wolfgang Ewald beschreibt auf seiner Internetseite die Grundlagen zur Objektorientierten Programmierung und zu Bibliotheken für Arduino:  
https://wolles-elektronikkiste.de/bibliotheken-und-klassen-erstellen-teil-i

## Ordnerstruktur
### Gezippter Ordner
Eine Arduino-Bibliothek kann als gezippter Ordner gespeichert, heruntergeladen und installiert werden:  
- SimpleLED_RH.zip
  
Der Name muss eindeutig sein, deshalb hängen wir das Kürzel **_RH** an.

In diesem Ordner müssen mindestens zwei Dateien enthalten sein:
### Header-Datei: SimpleLED.h

Die Header-Datei enthält die Köpfe aller Klassen, Methoden und Attribute innerhalb der Bibliothek.  
Mit dieser Datei bekommt der Programmierer einen schnellen Überblick über die Eigenschaften und Fähigkeiten der in der Bibliothek definierten Klassen.  
Außerdem können hier erläuternde Kommentare hinterlegt werden.



```C++
#ifndef SIMPLE_LED
#define SIMPLE_LED
#include <Arduino.h>

/*
Klasse zum Ansteuern einer LED, die mit dem Pluspol an einen Pin angeschlossen ist.
*/

class SimpleLed{
    public:
        SimpleLed(int pin);  // Konstruktur
        
        void an();
        void aus();

    protected:
        int pin;
}
#endif

```

**Erläuterungen zum Code**  
```C++
#ifndef SIMPLE_LED
#define SIMPLE_LED
...
#endif
```
Die Klasse SimpleLed darf im Code nur einmal definiert werden.  
Mit der Bedingung **#ifndef SIMPLE_LED**  wird sichergestellt, dass sie nur definiert wird wenn sie noch nicht definiert ist.

```C++
#include <Arduino.h>
```
Bei der Programmierung einer Bibliothek muss die Grundbibliothek mit den Arduino-Befehle von Hand eingebunden werden. Bei normalen Arduino-Programmen macht das System diesen Schritt automatisch.

```C++
class SimpleLed{
...
}
```
Um in unserem Programm eine LED ansteuern zu können, müssen wir ein Objekt der Klasse **SimpleLED** erzeugen.  
Die Attibute (EIgenschaften) und Methode (Fähigkeiten) der Objekte dieser Klasse werden in der Bibliothek definiert.
```C++
public:
   ...
protected:
   ...
```
Attribute und Methoden, die **public** definiert sind, sind öffentlich sichtbar. Damit können sie im Programm außerhalb der Klasse  aufgerufen und verändert werden. In der Regel definiert man nur die Methoden public, um die Werte der Attribute vor unkontrollierten Änderungen zu schützen.  

Mit **protected** definierte Attribute und Methoden sind vor einem Zugriff von außen geschützt. Sie können nur innerhalb der Klasse verwendet werden.

```C++
    SimpleLed(int pin);  // Konstruktur
```
Der Konstruktor der Klasse wird aufgerufen, sobald ein neues Objekt der Klasse erzeugt wird. In unserem Fall hat er als Parameter die Nummer des Pins, an dem die Led angeschlossen ist.

## Quell-Datei: MeineNeueBib.cpp

In der Quell-Datei steht der eigentliche Quellcode, d.h. die in der Header-Datei definierten Klassen und Methoden müssen hier programmiert werden.

```C++
#include <SimpleLED.h>

/* 
Konstruktor
*/

SimpleLED::SimpleLED(int pin){
  this.pin=pin;
  pinMode(pin,OUTPUT);
}

/*
öffentliche Methoden
*/
void an(){
    digitalWrite(pin,HIGH);
}

void aus(){
    digitalWrite(pin,LOW);
}
```

### Erläuterungen zum Code
```C++
#include <SimpleLED.h>
```
Die Header-Datei muss in der ersten Zeile eingebunden werden. Damit weiß das System, welche Klassen, Methoden und Attribute definiert werden müssen.


```C++
SimpleLED::SimpleLED(int pin){
    ...
}
```
In diesem Block wird der Konstruktor der Klasse definiert. Die **::**-Zeichen legt die Zuordnung fest: Der Konstruktor und alle folgenden Methoden werden der Klasse SimpleLED zugeordnet.


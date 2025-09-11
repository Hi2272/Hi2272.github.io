<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">


# Schalten größerer Spannungen und Ströme mit einem Relais
## Allgemeines
Mikrocontroller können nur niedrige Gleichspannungen schalten. In der Regel sind dies 3,3 V oder 5 V. Die Pins können außerdem nur geringe Stromstärken abgeben.  
Um größere Spannungen und höhere Ströme zu schalten, kann ein Relais-Modul verwendet werden. Das Relais dient dabei als elektrischer Schalter.    


**Warnung:   
Im Internet findet man Schaltungen, bei denen über ein Relais 240 V Wechselspannung geschaltet werden. Diese Spannung ist lebensgefährlich und darf nur von ausgebildeten Elektrikern geschaltet werden.**

## Verkabelung
- 3 Schraubklemmen am Relais:  
  - Anschluss des Stromkreises, der geschaltet werden soll.  
  - Grundsätzlich wird immer der **mittlere** gegen den **linken oder rechten** Anschluss geschaltet:
    - rechts: geschlossen, wenn Relais unter Strom, sonst offen.
    - links: offen, wenn Relais unter Strom, sonst geschlossen.
- Steuerungsblock: GND, IN, VCC 
  - VCC: +5V am Arduino
  - GND: GND am Arduino
  - IN: Pin6 am Arduino
- Spannungsversorgung Relais-Spule: VCC, VCC, GND
  - Im Inneren des Relais ist eine Spule. Wenn diese unter Strom steht, wirkt sie als Elektromagnet und zieht ein Metallblättchen an. Das Relais schaltet.  
  Hierzu benötigt die Spule 5V Spannung, die entweder vom Arduino oder von einer externen Quelle geliefert werden kann.  
  Es ist sinnvoll, den Jumper zu entfernen und VCC und GND mit einer externen Spannungsquelle zu verbinden, da nur dann der Arduino elektrisch vollständig vom Relais getrennt ist. Beim Schalten des Relais entstehen Stromspitzen, die die Elektronik im Arduino stören können.

## Programmierung

Der Code ist sehr einfach:  
```C++
const int REL_PIN=6;

void setup() {
 pinMode(REL_PIN,OUTPUT);
}

void loop() {
  digitalWrite(REL_PIN,HIGH);
  delay(2000);
  digitalWrite(REL_PIN,LOW);
  delay(2000); 
}
```

## Forschungsauftrag
Untersuche mit einem Multimeter, wie sich der Widerstand zwischen den drei Schraubanschlüssen des Relais beim Schalten ändert.  


[zurück](../index.html)

# Programmieren mit Robot Karol
## 1. [Einstieg](01Start/index.html)
## 2. [Schleifen](02Schleifen/index.html)
## 3. [Karol räumt auf](https://karol.arrrg.de/#Z5TZ)
Lösung:   
```C++
anweisung nachNorden
  wiederhole solange NichtIstNorden
    LinksDrehen
  endewiederhole
endeAnweisung

Anweisung ziegelweg
  wiederhole solange IstZiegel
    Aufheben
  endewiederhole
  Schritt
endeAnweisung

anweisung zurwand
  wiederhole solange NichtIstWand
    ziegelweg
  endewiederhole
endeAnweisung

anweisung indieEcke
  nachNorden
  zurwand
  linksDrehen
  zurwand
  linksDrehen
endeAnweisung

indieEcke
zurwand
linksdrehen

wiederhole solange nichtistwand
  wenn NichtIstWand dann
    ziegelweg
    LinksDrehen
    zurwand
    RechtsDrehen
    wenn NichtIstWand dann
      ziegelweg
      RechtsDrehen
      zurwand
      linksdrehen
  endewenn
endewenn
endewiederhole
```

    
    
  


## 5. [Karol lernt schreiben](https://karol.arrrg.de/#PCKB)
   

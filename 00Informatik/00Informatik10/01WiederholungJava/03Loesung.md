<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Wiederholung Grundstrukturen Java
![](2024-10-22_13-16.png)

## 4. Bedingte Anweisung
### Allgemeine Struktur einer bedingten Anweisung:  
```C++
if (Bedingung) {  
  Sequenz-Block für den WAHR-Fall  
} else {  
  Sequenz-Block für den FALSCH-Fall
}
```
Der Else-Block kann weiter geschachtelt sein:
```C++
if (Bedingung1) {  
  Sequenz-Block für den WAHR-Fall  
} else if (Bedingung2){  
  Sequenz-Block für den Fall, dass Bedingung1 falsch und Bedingung2 wahr ist.
} else {
 Sequenz-Block für den Fall, dass Bedingung1 und Bedingung2 falsch sind.
}
```
### Programm-Code
```C++
class Programm {
  Robot karol = new Robot();

  void main() {
    for (int i = 0; i < 40; i++) {
      mauerBisZurWand();
      karol.linksDrehen();
    }
  }

  void mauerBisZurWand() {
    while (karol.nichtIstWand()) {
      schrittStein();
    }
  }

  void schrittStein() {
    tauschen();
    karol.schritt();
  }

  void tauschen() {
    if (karol.nichtIstZiegel()) {
      karol.hinlegen();
    } else {
      karol.aufheben();
    }
  }
}
```


[zurück](../../index.html)  




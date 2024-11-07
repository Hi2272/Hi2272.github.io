<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Wiederholung Grundstrukturen Java
![](2024-10-22_13-16.png)
## 3. Die Definition von Methoden
### 3.1 Grundstruktur einer Methode

```C++
public Datentyp methodenName(Parameterliste mit Datentypen){
  Sequenzblock der beim Aufruf der Methode ausgeführt wird.
}
```
### 3.2 Das Schlüsselwort void
**void** bedeutet, dass die Methode keinen Wert zurückgibt. In Rumpf der Methode gibt es keine **return**-Zeile.

Bei Methoden, die einen Wert zurückgeben, steht an Stelle von **void** der Datentyp dieses Wertes. Im Rumpf muss eine **return**-Zeile enthalten sein.

### 3.3 Der Zugriffsmodifikator
Methoden sind in der Regel **public** deklariert. Damit können auch Objekte anderer Klassen auf diese Methoden zugreifen.

### 3.2 Programm-Code
```C++
class Programm {
  Robot karol = new Robot();

  void main() {
    for (int i = 0; i < 4; i++) {
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
    karol.hinlegen();
    karol.schritt();
  }
}
```

[Bedingte Anweisung](03BedingteAnweisung.html)  

[zurück](../../index.html)  




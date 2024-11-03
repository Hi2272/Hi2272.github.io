<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Wiederholung Grundstrukturen Java
![](2024-10-22_13-16.png)

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
}```

[Methoden](02Methoden.html)  

[zurück](../../index.html)  




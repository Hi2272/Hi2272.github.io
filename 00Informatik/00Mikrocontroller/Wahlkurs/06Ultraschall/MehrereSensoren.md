 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Mehrere Sensoren anschließen
## 1. Festlegen der Pins
Wir schließen 5 Ultraschall-Sensoren an einen Arduino an.  
Die Anschluss-Pins speichern wir hierzu in einem Feld (eng. Array):  
```C++
int trigger[]={2,4,6,8,10};  // Trigger zum Senden des Signals 
int echo[]={3,5,7,9,11};     // Echo zum Empfangen des relektierten Signals
```
Die einzelnen Werte des Feldes könnten wir auch durch die Angabe ihres Index-Wertes zuweisen:
```C++  
trigger[0] = 2;
trigger[1] = 4;
trigger[2] = 6;
...
```

### 2. Die setup()-Methode
In der **setup()**-Methode müssen wir jetzt allen Trigger- und Echo-Pins die INPUT oder OUTPUT-Eigenschaft zuweisen.  
Hierzu verwenden wir eine Zählschleife:
```C++
void setup() {
  Serial.begin(9600);
  for (int i = 0; i < 5; i++) {
    pinMode(trigger[i], OUTPUT);  // Trigger-Pin ist ein Ausgang
    pinMode(echo[i], INPUT);      // Echo-Pin ist ein Eingang
  }
}
```
**Erklärung der Zählschleife**
- **for**    
  Schlüsselwort für eine Zählschleife (for-Schleife)
- **(int i=0;**  
  Deklariert eine Zählvariable i und weist ihr den Start-Wert 0 zu.
- **i < 5;**  
  Die Schleife soll solange laufen, wie die Zählvariable i kleiner als die Länge der Felder **trigger** und **echo** ist. In unserem Fall also kleiner als 5.  
  Insgesamt gibt es 5 Durchläufe:  
  i=0 ⇒ i=1 ⇒ i=2 ⇒ i=3 ⇒i=4 ⇒ Abbruch, da i nicht mehr kleiner als 5 ist!
- **i=i+1)**  
  Bei jedem Schritt soll i um eins erhöht werden.
- **{**  
 In den geschweiften Klammern (AltGr 7, AltGr 9) steht der Code, der wiederholt ausgeführt werden soll.
- **pinMode(trigger[i], OUTPUT);**  
  In der Schleife wird die Zählvariable i verwendet, um auf jeden Wert des Feldes **trigger** zuzugreifen.
- **pinMode(echo[i], INPUT);**    
  Genauso greifen wir auf die Elemente des Feldes **echo** zu.
- **}**  
     
   
### 3. Die loop()-Methode

```C++
void loop() {
  for (int i = 0; i < 5; i = i + 1) {
    digitalWrite(trigger[i], LOW);
    delay(5);
    digitalWrite(trigger[i], HIGH);
    delay(10);
    digitalWrite(trigger[i], LOW);

    int dauer = pulseIn(echo[i], HIGH);
    int entfernung = (dauer / 2) * 0.03432;
    Serial.print("Sensor Nr.:");
    Serial.print(i);
    Serial.print(entfernung);
    Serial.println(" cm");
  }
  Serial.println("--------------");
  delay(1000);
}
```
### Erklärung des Codes
Auch hier verwenden wir wieder eine Zählschleife, um alle Sensoren nacheinander anzusprechen. Die Messergebnisse werden über die Serielle Schnittstelle ausgegeben.     

[zurück](../index.html)

<footer style="font-size:x-small;text-align: center;
    padding: 10px;
    margin: 10px;
    height: 10%;
    ">


  Die Schaltpläne sind mit <a href="https://www.tinkercad.com/dashboard">Tinkercad</a> erstellt. 
</footer>


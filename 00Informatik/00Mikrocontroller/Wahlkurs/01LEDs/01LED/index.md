 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">


## 1. Eine LED zum Leuchten bringen
1. Baue folgende Schaltung auf:  
   ![SchaltungLED](Screenshot_4.png)  
   Jede LED muss immer mit einem Vorwiderstand geschützt werden. Sonst besteht die Gefahr, dass sie durchbrennt.
2. Programmiere auf https://sensebox.github.io/blockly/  folgenden Code:  
![alt text](Blockly.png)  
3. Kopiere den Arduino-Code in die Arduino IDE.

```C++
void setup() {
  pinMode(8, OUTPUT);
  pinMode(9, OUTPUT);
  digitalWrite(9,LOW);  // Pin 9 = Minuspol der LED
  digitalWrite(8, LOW); // Pin 8 = Minuspol -> LED aus  
}

void loop() {
}
```
## 2. Experimente
1. Verändere die Werte für Pin8 und Pin9 in Zeile 4 und 5, bis die LED leuchtet:
   |Pin8|Pin9|LED|
   |----|----|----|
   |LOW|LOW||
   |HIGH|LOW||
   |LOW|HIGH||
   |HIGH|HIGH||
2. Durch HIGH bekommt der PIN ein positives Potential (+ Pol).  
     Durch LOW bekommt er kein Potential (- POL).  
   Leite ab, unter welchen Bedingungen die LED leuchtet:  

   |Pol:|langes/kurzes Bein|   
   |-----|-----|
   |Pluspol:||
   |Minuspol:||



[Weiter zum Blinklicht](../02LEDBlink/index.html)       
[zurück](../index.html)
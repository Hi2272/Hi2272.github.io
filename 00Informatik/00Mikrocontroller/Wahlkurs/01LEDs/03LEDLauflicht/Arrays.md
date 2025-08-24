 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Verkürzen von Code durch Felder und Schleifen

In unserem Code wiederholt sich sechsmal der fast gleiche Block:
```C++

void loop() {
  digitalWrite(7, HIGH);
  delay(500);
  digitalWrite(7, LOW);
 
  digitalWrite(8, HIGH);
  delay(500);
  digitalWrite(8, LOW);
 ...
```
Die einzelnen **digitalWrite** Aufrufe unterscheiden sich nur in der Nummer des Pins, der angesprochen wird.  
## Felder (Arrays)

Im Folgenden verkürzen wir den Code, indem wir zuerst ein Feld (engl. Array) definieren, in dem wir die Pin-Nummer speichern.

Schreibe folgende Codezeile an den Anfang deines Programms:
```C++
int ledPin[] = {7,8,9,10,11,12};
```
Mit dieser Zeile definierst du ein Feld von Integer-Variablen. Den ersten Wert kannst du mit der Zeile **Serial.println(ledPin[0]);** ausgeben, den zweiten mit **Serial.println(ledPin[1]);** und den letzten mit **Serial.println(ledPin[5]);**.  
Die Zahl in eckigen Klammern bezeichnet man als **Index** des Feldes. Sie läuft für ein Feld mit **6** Elementen immer von **0 bis 5**.  
## Zählschleife (For-Schleife)

Um den Code mit dem Feld zu verkürzen, benötigen wir noch eine zweite Struktur, die sogenannte Zählschleife (For-Schleife).   
Ändere deine **setup**-Methode wie folgt ab:
```C++
void setup() {
    for (int i=0;i<6;i++){
        pinMode(ledPin[i], OUTPUT);
    }
}
```
Die Zeile **for (int i=0;i<6;i=i+1){** ist der **Kopf** der Zählschleife.  
- for (   
    Dies ist der Hinweis auf die For-Schleife
- int i=0;  
Hier wird eine Zählvariable i definiert und mit dem Startwert 0 belegt.  
- i<6;  
  Die Schleife wird solange durchlaufen, wie i kleiner als 6 ist. Der letzte Wert für i ist also 5 und das entspricht genau dem letzten Index-Wert für unser Array.
- i=i+1;  
  Mit jedem Durchlauf wird der Wert von i um eins erhöht:  
  1. Durchlauf: i=0
  2. Durchlauf: i=1
  3. Durchlauf: i=2
  4. Durchlauf: i=3
  5. Durchlauf: i=4
  6. Durchlauf: i=5
  7. Durchlauf: i=6!  
  Die Schleife bricht vor dem 7. Durchlauf ab, da i nicht mehr kleiner als 6 ist.
- ){...}  
  Es folgt der Rumpf der Schleife. Alle Befehle innerhalb der geschweiften Klammern werden wiederholt ausgeführt.  
  ## Aufgabenstellung
  Verkürze jetzt auch die **loop()**-Methode deines Programms mit einer Zählschleife. Du benötigst insgesamt nur noch 5 Zeilen Code.  

  [Lösung](loesung2.html)
  [zurück](../index.html)



   
    


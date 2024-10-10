<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Taster

## Verbesserter Code
![alt text](2024-10-09_09-01.png)

Der Code kann an zwei Stellen verbessert werden.  
```C++
bool zustand=LOW;
int taster=2;
int ledPin=6

void setup() {
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin,LOW);  // aus
  
  pinMode(taster,INPUT);  
}

void loop() {
  if (digitalRead(taster)==HIGH){
   zustand=!zustand; 
   digitalWrite(6, zustand); 
   while (digitalRead(taster)==HIGH){
    delay(1);
   }
  }  
  delay(1);
}
```
### Erläuterungen zum Code
#### zustand=!zustand; 

Das **!**-Symbol bedeutet **NOT** oder **Nicht**. Mit dieser Zeile wird der Wert der Variable **zustand** umgekehrt:  
- zustand = HIGH = true   
  ⇒!zustand = LOW = false
- zustand = LOW = false   
  ⇒ !zustand = HIGH = true
#### while (digitalRead(taster)==HIGH){...}  
Diese Schleife wird so lange ausgeführt, wie der Taster gedrückt ist. Damit wird garantiert, dass ein Tastendruck nur einmal registriert wird.  

## Vereinfachte Schaltung
Der Pull-Down-Widerstand kann auch weggelassen werden, da der Arduino über interne Widerstände verfügt, die über Software geschaltet werden können:  
![alt text](2024-10-09_21-22.png)  
Im Code muss nur angegeben werden, dass der taster jetzt über einen internen Pull-Down-Widerstand geschaltet ist.   
Dies geschieht in der **setup()**-Methode:   

```C++
bool zustand=LOW;
int taster=2;
int ledPin=6;

void setup() {
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin,LOW);  // aus
  
  pinMode(taster,INPUT_PULLDOWN);  
}

void loop() {
  if (digitalRead(taster)==HIGH){
   zustand=!zustand; 
   digitalWrite(6, zustand); 
   while (digitalRead(taster)==HIGH){
    delay(1);
   }
  }  
  delay(1);
}
```
Analog kann auch ein interner **Pull-Up-Widerstand** geschaltet werden.

  

[zurück](../index.html)

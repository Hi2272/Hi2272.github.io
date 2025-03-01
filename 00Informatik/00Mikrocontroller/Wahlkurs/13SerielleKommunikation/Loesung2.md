<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Daten an den Arduino senden
## Zeichen darstellen

```C++
int zeichen = 0;  // Datenbyte vom Seriellen Eingang

void setup() {
  Serial.begin(9600);  // Serielle Schnittstelle öffnen
}

void loop() {

  if (Serial.available() > 0) {   // Serielle Daten liegen an
    zeichen = Serial.read();      // Die Zeichen werden einzeln gelesen
    if (zeichen != 10) {          // 10 = Return
        Serial.println(char(zeichen)); // zeichen ausgeben
    } 
  }
}
```
## Zeichen zum Text zusammensetzen
Derzeit werden die einzelnen Zeichen untereinander ausgegeben. Im nächsten Schritt ändern wir den Code so ab, dass er die Zeichen wieder zu einer Zeichenkette, also einem String zusammensetzt.
1. Deklariere eine Variable txt vom Datentyp String und initialisiere sie mit einem leeren String ""
2. Füge das gelesene Zeichen zum String txt hinzu.
3. Wenn das Zeichen RETURN entspricht (10), dann soll die Variable txt ausgegeben werden und wieder auf "" gesetzt werden.

[weiter](Loesung3.html)  
[zurück](../index.html)

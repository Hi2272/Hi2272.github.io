<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Daten an den Arduino senden
## Zeichen zu String zusammensetzen

```C++
int zeichen = 0;  // Datenbyte vom Seriellen Eingang
String txt = "";  // Ausgabe als Text

void setup() {
  Serial.begin(9600);  // Serielle Schnittstelle öffnen
}

void loop() {

  if (Serial.available() > 0) {   // Serielle Daten liegen an
    zeichen = Serial.read();      // Die Zeichen werden einzeln gelesen
    if (zeichen != 10) {          // 10 = Return
      txt = txt + char(zeichen);  // zeichen zusammensetzen
    } else {
      Serial.println(txt);
      txt = "";  // Neustart
    }
  }
}

```
## Zahlen einlesen

Um eine Zahl einzulesen, gehen wir vom Prinzip genauso vor. 
Wir lesen die einzelnen Ziffern ein und speichern sie in der String-Variable txt.  
Anschließend wandeln wir die Zeichenkette txt mit der Methode **txt.toInt();** wieder in eine Zahl um.
1.  Passe dein Programm entsprechend an.
2.  Untersuche was geschieht, wenn du Buchstaben eingibst.

[weiter](Loesung4.html)  
[zurück](../index.html)

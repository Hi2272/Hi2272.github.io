<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Daten an den Arduino senden
## Zahlen ausgeben

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
      int zahl = txt.toInt();  // txt zu Zahl umwandeln
      Serial.println(zahl);   // Zahl ausgeben
      txt = "";  // Neustart
    }
  }
}
```

## Nur Zahlen akzeptieren

Derzeit werden Buchstaben oder andere Zeichen einfach ignoriert. Mit der Methode **istZahl()** können wir prüfen, ob eine Zeichenkette fehlerfrei in eine Zahl umgewandelt werden kann.
```C++
boolean istZahl(String str) {
  for (byte i = 0; i < str.length(); i++) {
    if (isDigit(str.charAt(i))) return true;
  }
  return false;
}
```
Mit dieser Funktion sieht das Gesamtprogramm so aus:
```C++
int zeichen = 0;  // Datenbyte vom Seriellen Eingang
String txt = "";  // Ausgabe als Text

void setup() {
  Serial.begin(9600);  // Serielle Schnittstelle öffnen
}

boolean istZahl(String str) {
  for (byte i = 0; i < str.length(); i++) {
    if (isDigit(str.charAt(i))) return true;
  }
  return false;
}

void loop() {

  if (Serial.available() > 0) {   // Serielle Daten liegen an
    zeichen = Serial.read();      // Die Zeichen werden einzeln gelesen
    if (zeichen != 10) {          // 10 = Return
      txt = txt + char(zeichen);  // zeichen zusammensetzen
    } else {
      if (istZahl(txt)) {
        int zahl = txt.toInt();
        Serial.println(zahl);
      } else {
        Serial.println(txt+ " ist keine Zahl!");
      }
      txt = "";  // Neustart
    }
  }
}
```

[zurück](../index.html)

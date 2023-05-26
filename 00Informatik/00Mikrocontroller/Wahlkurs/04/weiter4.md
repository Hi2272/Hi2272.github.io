 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

## Definition einer Variablen zum Speichern des Zustands
Die Alarmanlage kann an- oder ausgeschaltet sein. Dieser Zustand soll in einer Variablen **isAktiv** gespeichert werden.  
Diese Variable kann zwei Werte haben:
- true = wahr, die Anlage ist eingeschaltet und aktiv.
- false = falsch, die Anlage ist ausgeschaltet und nicht aktiv.  

Der Datentyp für eine solche Variable ist **bool**. Man bezeichnet diese Variablen als **boolsche Variablen** oder **Boolean-Variablen**.

Beim Einschalten soll die Alarmanlage nicht aktiv sein - wir setzen den Wert von **isAktiv** daher bei der Definition auf **false**.  

```C++
int ledRot = 7;
int ledGruen = 8;
int sensor = 5;
int buzzer = 6;
int fern = 3;
int fernCode;
String geheimcode="0815";
String code="";
bool isAktiv = false;
```
## Wechsel des Zustands bei der Eingabe des richtigen Codes
Wenn der richtige Code eingegeben wurde, soll folgendes passieren:
- wenn die Alarmanlage aktiv ist, soll sie ausgeschaltet werden.
- wenn die Alarmanlage ausgeschaltet ist, soll sie eingeschaltet werden.
  
Die Variable **isAktiv** soll also einfach ihren Wert wechseln:
-  isAktiv = true ⇒ isAktiv = false
-  isAktiv = false ⇒ isAktiv = true
  
In Programmmiersprachen erreicht man dies am einfachsten durch die **NOT** oder **NICHT** - Funktion: 

- wahr = NICHT falsch
- falsch = NICHT wahr

In unserer Programmiersprache C++ wird **NOT** durch ein einfaches **Ausrufezeichen** abgekürzt:
```C++
isAktiv = !isAktiv
```
Füge diese Zeile so in den Programmcode ein, dass sie ausgeführt wird, wenn der richtige Code eingegeben wurde.

[Lösung](loesung5.html)  

[zurück](../index.html)
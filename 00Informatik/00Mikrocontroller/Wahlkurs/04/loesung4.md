 <link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">


## Deklaration und Initalisierung der Variablen

```C++
int ledRot = 7;
int ledGruen = 8;
int sensor = 5;
int buzzer = 6;
int fern = 3;
int fernCode;
String geheimcode="0815";
String code="";
```

## Speichern der Code-Eingabe
In unserer Switch-Case-Sequenz geben wir bisher die Codes nur an den Seriellen Monitor aus.  
Jetzt wollen wir sie zusätzlich an die Variable **code** anhängen:
```C++
 switch(fernCode){
      case 22:
        Serial.println("0");
        code=code+"0";
        break;
      case 12:
        Serial.println("1");
        code=code+"1";
        break;
      ...
    }
``` 
## Definition einer Taste zum Löschen der Code-Eingabe
Wenn der Nutzer sich vertippt hat, soll er mit einer Taste die gesamte Eingabe löschen können.  
Wir verwenden hierzu die **CH-** Taste mit dem Code 69.  
Füge diesen Code in deine switch-case-Sequenz ein:
```C++
    case 69:
        code="";
        Serial.println("Code gelöscht!");
        break;
``` 
Mit der **CH+** Taste soll der Code mit dem Geheimcode verglichen werden. Der Code dieser Taste lautet 71.
```C++
    case 71:
        if (code == geheimcode) {
          Serial.println("Code stimmt!");
        } else {
          Serial.println("Code stimmt nicht!");
          code = "";
        }
        break;
```
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



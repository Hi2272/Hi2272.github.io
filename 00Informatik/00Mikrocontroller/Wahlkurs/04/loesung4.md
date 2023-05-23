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



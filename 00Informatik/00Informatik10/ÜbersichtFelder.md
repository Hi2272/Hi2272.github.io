# Übersicht zu Feldern in Java

## Deklaration von Feldern

Um ein Feld eines Datentyps zu deklarieren, muss eine eckige Klammer nach dem Datentyp stehen.

Deklaration einer einzelnen Variable:
```C++
int nummer;
``` 
Deklaration eines Feldes:

```C++
int[] nummern;
``` 

Wenn das Feld als **Attribut** deklariert wird, sollte vor dem Datentyp der Zugriffsmodifikator **private** (Zugriff nur in dieser Klasse möglich) oder **protected** (Zugriff in dieser Klasse und ihren Unterklasen möglich) stehen:
```C++
private int[] nummern;  
protected int[] nummern;
``` 

Felder können aus primitiven Datentypen (int, boolean, char, byte) oder aus Referenzen bestehen. Referenzen verweisen auf Objekte anderer Klassen:

```C++
private Ampel[] ampeln;
```

## Initialisieren von Feldern

Nach dem Deklarieren des Feldes muss angegeben werden, wie viele Elemente dieses Feld enthalten soll. Dies geschieht beim Initialisieren des Feldes.  

Das Initalisieren des Feldes erfolgt mit dem **new**-Operator. Die Zahl der Elemente wird in eckigen Klammern hinter dem Datentyp angeeben.
```C++
this.nummer = new int[3];
this.ampel = new Ampeln[3];
```
## Initialisieren der Elemente des Feldes
Nach dem Initialisieren des Feldes sind seine Elemente leer.  
Bei Feldern von primitiven Datentypen steht in jedem Element der Wert 0.  
Bei Feldern von Referenzen verweist jedes Element auf **null**.

Zum Initialisieren der Elemente verwendet man häufig diese for-Schleife:
```C++
for (int i=0;i<nummern.length;i++){
    nummern[i]=i;
}

for (int i=0;i<ampeln.length;i++){
    ampeln[i] = new Ampel(i);
}
```

[zurück](../index.html)

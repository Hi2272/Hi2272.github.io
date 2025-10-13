# Ein automatisch gefüllter Webshop

## Problemstellung:
Für Testzwecke soll ein Webshop erstellt werden, der automatisch 10 Lieferanten und 100 Turnschuhe verschiedener Arten, Preise und Lieferanten enthält.
Wir verwenden hierzu lokale Felder mit konstantem Inhalt und Zufallszahlen.
## Vorgehen:
1.	Öffne die Klasse Webshop im Editor.
2.	Importiere die Bibliothek java.util.Random, um Zufallszahlen zu erzeugen.
3.	Schreibe eine private Methode zufallszahl mit einem ganzzahligen Parameter max, die mit folgender Zeile eine Zufallszahl zwischen 0 und max-1 zurückgibt:  
```Java
return new Random().nextInt(max);
```
4.	Füge folgende Zeile in den Konstruktor ein und erzeuge ein lokales Feld mit konstanten Lieferantennamen:
```Java
String[] lieferantenNamen = {
"Adidas","Nike","Puma","Assics","Rebook",
"Kangaroos","Sketchers","CMP","Meindl","Lowa"};
```
5.	Verwende eine Zählschleife, um das Feld lieferanten[] automatisch zu füllen.
6.	Erstelle ein weiteres lokales Feld mit Schuharten:
```Java
String[] schuhArten={
"Laufschuhe","Fußballschuhe - Halle","Fußballschuhe - Rasen","Basketballstiefel",
"Wanderschuhe","Volleyballschuhe","Hallenschuhe"};
``` 
7.	Verwende eine weitere Zählschleife, um die 100 Artikel zu deklarieren und zu initalisieren.  
    1.  Deklariere eine lokale Variable **schuhNr** und initialisiere sie mit einer Zufallszahl zwischen 0 und **schuhArten.length**-1.  
    2.  Deklariere eine lokale Variable **preis** und weise ihr einen Wert zwischen 39.95 und 229.95 zu. Hierbei sollen nur Schritte von 10 EUR möglich sein.  
    3.  Deklariere eine lokale Variable **lieferNr** und initialisiere sie mir einer Zufallszahl zwischen 0 und **lieferanten.length**-1.
    4.  Initialisiere die Artikel mit diesen Werten.  
8.	Rufe die printAlles-Methode zur Kontrolle auf.  

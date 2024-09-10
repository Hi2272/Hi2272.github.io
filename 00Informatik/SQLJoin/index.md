  <meta charset="utf-8" />
  <title>SQL</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">

# Abfragen über zwei Tabellen
(Einstieg im Schulbuch, "Informatik 4 (Oldenbourg), ISBN 978-3-637-02470-0, Cornelsen-Verlag)
## Vorbereitung der Datenbank

1. Kopiere den SQL-Code in die Zwischenablage

````SQL

CREATE TABLE Schueler (
  schueler_nr int,
  name text,
  vorname text,
  kurswahl text
);

CREATE TABLE Wahlkurs (
  name text,
  ort text,
  lehrer text
);
  
INSERT INTO Wahlkurs VALUES("Bouldern","Turnhalle 1","Hr. Schlaukopf");
INSERT INTO Wahlkurs VALUES("Big Band","Musiksaal","Fr. Kluge");


INSERT INTO Schueler VALUES(4347653,"Ellmann","Heinz","Big Band");
INSERT INTO Schueler VALUES(4357451,"Diener","Bernhard","Big Band");
INSERT INTO Schueler VALUES(5643611,"Nette","Marion","Bouldern");
````

2. Öffne die Internetseite (https://www.db-fiddle.com)

3. Füge den kopierten Code in die linke Fläche ein:

## Abfragen über beide Tabellen

Trage die folgenden SQL-Anweisungen ins rechte Feld ein und klicke oben auf Run, um das Ergebnis zu sehen.
1. Kreuzprodukt
```` SQL
Select * 
FROM Schueler s,Wahlkurs w
`````
2. Einschränkung auf sinnvolle Ergebnisse
```` SQL
Select * 
FROM Schueler s,Wahlkurs w
WHERE s.kurswahl=w.name;
`````

3. Einschränkung auf sinnvolle Attribute
```` SQL
Select s.name,s.vorname,s.kurswahl,w.ort,w.lehrer 
FROM Schueler s,Wahlkurs w
WHERE s.kurswahl=w.name;
`````
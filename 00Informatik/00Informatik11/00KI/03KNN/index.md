# Der K-nächste-Nachbarn-Algorithmus

## 1. Vorbereiten der Daten
1. Öffne diese Datei in Excel:
[Daten.csv](Daten.csv)
2. Entscheide, welche Spalte die Labels enthält.
3. Sortiere die Daten nach den Labels
4. Stelle die Daten der Angestellten graphisch dar (x,y Diagramm).
5. Füge die Daten der Minijobber hinzu (rechte Maustaste auf Diagramm, Daten auswählen, hinzufügen)
6. Füge die Daten der Selbständigen hinzu.
7. Füge eine Legende zum Diagramm hinzu.
## 2. Normalisierung der Daten
1. Schreibe je eine Funktion zur Ermittlung von 
   1. Minimum der Altersdaten
   2. Maximum der Altersdaten
   3. Differenz max-min

   4. Minimum der Gehaltesdaten
   5. Maximum der Gehaltsdaten
   6. Differenz max-min
2. Schreibe eine Funktion mit der die Altersdaten auf den Wertebereich 0-1 normiert werden.  
 Verwende hierbei teilweise absolute Bezüge (Bsp.: C$5: relativ für Spalte C, absolut für Zeile 5).
1. Schreibe die analoge Funktion zur Normierung der Gehaltsdaten.
2. Stelle die normierten Daten wie oben graphisch dar.

## 3. Analyse der Daten
Analysiere die Daten nach folgenden Aspekten:
1. Welcher Parameter (Alter, Monatseinkommen) eignet sich besser zur Klassifizierung der Daten?
2. Gibt es Ausreißer, d.h. besonders hohe oder besonders niedrige Daten?
3. Wie stören diese Daten die Auswertung.

## 4. Berechnen der Abstände zu einem neuen Punkt
1. Trage in die Tabelle einen neuen Datenpunkt mit Alter und Monatseinkommen ein.
2. Normiere diese Einträge mit der passenden Formel.
3. Erzeuge zwei neue Spalten:
   1. Berechnung des Abstands des neuen Datenpunkts von jedem gelabelten Datenpunkt mit der Formel dAlter² + dMonatseinkommen²
   2. Label des gelabelten Datenpunkts.
## 5. Markieren der 3 nächsten Nachbarn
1. Markiere die Spalte mit den Abstände und wähle über das Menü **Bedingte Formatiereung** die Regel, mit der die untersten 3 Abstände farbig markiert werden sollen. 
2. Der neue Punkt bekommt das Label, das bei den meisten markierten Abständen steht. 

## Exkurs: Festlegen von K

Um K automatisch festzulegen wird für alle gelabelten Daten untersucht, wie gut sie mit Hilfe ihrer k-nächsten Nachbarn bestimmt werden.  
Es wird der k-Wert verwendet, bei dem die wenigsten Fehler auftreten.  
K muss hierbei deutlich kleiner als die Gesamtzahl der Datenpunkte sein.  

[AB Festlegen von K](<AB Automatisches Festlegen von K.pdf>)


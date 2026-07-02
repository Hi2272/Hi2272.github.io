# Wir programmieren einen einfachen Spielautomaten

## Analyse des Projekts

### 1.	Analyse des Projekts
![alt text](<Screenshot 2026-07-02 105935.png>)  
Das Programm besteht aus _______________ Objekten.
Diese stammen aus ____________ verschiedenen _______________: **Titel, Anzeige, Knopf**
### 2.	Programmieren des Startknopfes
<a href="https://scratch.mit.edu/projects/398768768/" target="_blank">Startpunkt</a>    
Erstelle für den Startknopf ein Skript: Wenn er angeklickt wird, soll er die neue Nachricht „Start“ an alle schicken.
### 3.	Progammieren der Zufallsanzeige
#### a) Zufälliges Startbild
Erstelle für das Objekt „Anzeige“ ein Skript:
- Wenn die grüne Startflagge angeklickt wird, soll eine Wiederhole Schleife starten. 
- Setze für die Wiederholungszahl eine Zufallszahl (grüner Bereich) von 1 bis 10 ein.
- Füge in die Schleife den Befehl „Aussehen.Nächstes Kostüm“ein.
- Teste dein Skript
#### b)	Reaktion auf die Nachricht „Start“
	Erstelle für das Objekt „Anzeige“  ein weiteres Skript: 
- Wenn das Objekt die Nachricht „Start“ empfängt, soll es wie oben zwischen 10 und 50 mal sein Kostüm wechseln.
- Teste durch Klicken auf den Start-Knopf, ob dein Skript funktioniert
#### 4.	Duplizieren der Zufallsanzeige
Klicke mit der Rechten Maustaste auf das Objekt „Anzeige“ und duplizere es drei mal.
Ziehe die Objekte auf der Bühne in eine Reihe nebeneinander.
Teste dein Programm
#### 5. Zusatzaufgabe: Blinkender Startkopf
Erstelle für den Startknopf ein Skript:
- Wenn die grüne Fahne angeklickt wird, soll eine fortlaufende Wiederholungsschleife starten. Füge in die Schleife den Befehl „Aussehen.ÄndereFarbeEffekt um 5“ ein.
 
#### 6.	Geld kommt ins Spiel
- Erstelle eine neue Variable mit dem Namen **Geld**. 
Die Variable soll für alle Figuren gelten.
- Programmiere ein Skript mit dem die Variable Geld auf 100 gesetzt wird, sobald die grüne Fahne angeklickt wird. Das Skript kannst du bei einem beliebigen Objekt erstellen.
#### 7.	Kein, ein, zwei, drei oder vier Richtige?
##### a) Speichern der Kostümnummer in einer Variablen
- Erstelle vier neue Variablen mit den Namen **nummer1, nummer2, nummer3 und nummer4**.  
Die Variablen sollen für alle Figuren gelten.  
Sie sollen nicht angezeigt werden – klicke das Häkchen vor der Variablen weg.  
- Ergänze das Skript von Anzeige, das abläuft, wenn das Objekt die Nachricht „Start“ empfängt,  um eine Zeile:  
Setze den Wert von nummer1 auf die Kostümnummer (unten Bereich „Aussehen“)
- Ergänze auch die Skripten von Anzeige2 bis Anzeige4 um diese Zeile, wobei du die Variablen nummer2, nummer3 und nummer4 verwendest.
#### b)	Senden einer „Fertig“ Nachricht an alle
Ergänze das Skript von Anzeige, das abläuft, wenn das Objekt die Nachricht „Start“ empfängt, um eine Zeile:
- Sende die neue Nachricht „Fertig1“ an alle.  
Ergänze dieses Skript bei allen Anzeigen, wobei die Nachrichten „Fertig2“, „Fertig3“ und „Fertig4“ heißen.
#### c) Zählen der gleichen Symbole
Untersuche die Skripte der Figur „Titel“ und erkläre wie die das Objekt erkennt, dass
1.	alle Anzeige-Objekte ihre „Fertig“-Nachricht geschickt haben.
2.	erkennt, ob zwei, drei oder vier gleiche Symbole angezeigt werden.
3.	auf zwei Paare (Bsp.: Kirsche,Kirsche,Banane,Banane) reagiert.
#### d) Ändern der Gewinnchancen
Erläutere durch welche Änderungen die Gewinnchancen bei diesem Spiel erhöht oder verringert werden können.

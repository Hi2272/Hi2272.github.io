# Programmieren mit Scratch
## Allgemeines
https://scratch.mit.edu/projects/editor/ 

Zum Speichern deiner eigenen Scratch-Programme musst du dich bei Scratch registrieren.  
Für den Unterricht ist dies nicht nötig.  
https://scratch.mit.edu/join


## Breakout - ein einfaches Spiel in Scratch

Ein Scratch-Programm besteht immer aus Objekten von zwei verschiedenen Klassen:
- Klasse Sprite: Bewegliche Spielfigur
- Klasse Bühne: Hintergrund, auf der sich die Sprites bewegen.

Die Sprites können innerhalb eines Spieles wieder verschiedenen Klassen zugeordnet werden.

Untersuche dies an folgendem Spiel:  
https://scratch.mit.edu/projects/173183056/

## Programmieren von Breakout
### 1. Der Schläger

   1. Bewegen mit den Pfeiltasten
   2. Bewegen mit der Maus
### 2. Der Ball
   [Startpunkt: Schläger programmiert](https://scratch.mit.edu/projects/1332984043)
   1. Bewegung des Balles
      Wenn die grüne Fahne angeklickt wurde, soll 
      - der Ball zu x=0 und y=0 gehen.
      - die Bewegungsrichtung auf 45° gesetzt werden.
      - fortlaufend wiederholt werden:
        - der Ball geht einen 10er-Schritt
        - der Ball prallt vom Rand ab
   2. Abprallen des Balles vom Schläger
      - Der Ball prüft fortlaufend:
        - Falls wird Schläger berührt (Fühlen)
         -   drehe dich um 90°
   3. Ball geht ins Aus
      - Der Ball prüft fortlaufend:
        - Falls y-Position < -155 
         -   stoppe alles
   4. Ein "Game Over" Objekt soll am Spielende aufgeblendet werden.    
   Zeichne ein neues Objekt: Ein großes Rechteck (Schild) mit dem Text "Game over".  
   Programmiere folgenden Code:
   - Wenn die grüne Fahne geklickt wird  
     - wird das Schild unsichtbar (Verstecke dich).
   - Wenn der Ball ins aus geht,
     - sendet er die Botschaft "GameOver" an alle (Stoppe alles wird hier entfernt!)
   - Wenn das Schild die Botschaft "GameOver" erhält,
     - wird es sichtbar (zeige dich)
     - stoppt alles
   
### 3. Die Steine
[Startpunkt Ball, Schläger, GameOver programmiert](https://scratch.mit.edu/projects/1334332963)  
1. Abprallen des Balles vom Stein  
      Wenn der Ball den Stein berührt, soll er sich um 90° drehen.
2. Viele Kopien (Klone) des Steins erzeugen  
      - **Eine Zeile von Steinen:**  
      Programmiere für den Stein folgendes Skript:
        - Wenn die grüne Fahne angeklickt wird, 
        - geht der Stein auf die Position x=-200, y=130 (links oben)
        - Wiederhole 8 mal: 
          - Erzeuge einen Klon von mir selbst (Steuerung)
          - Ändere x um 50  
      - **Vier Zeilen von Steinen**    
      -  Wiederhole 4 mal:
         -  Setze x auf -200
         -  Ändere y um -20
         -  Wiederhole 8 mal Schleife von oben zum Erzeugen einer Stein-Reihe.
3. Steine verschwinden, wenn sie getroffen werden.
   Programmiere für den Stein folgendes Skript:  
      - Wenn ich als Klon entstehe
      - Wiederhole fortlaufend:
        - Falls ich vom Ball berührt werden,
          - lösche diesen Klon   
4. Suche Fehler im Spiel und bessere sie aus.
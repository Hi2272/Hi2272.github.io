<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">

# Leiterplatten-Design mit Fritzing
Wir entwickeln eine einfache Leiterplatte, mit der zwei Batteriekästen hintereinandergeschaltet werden können.
## Entwurf auf dem virtuellen Steckbrett
![alt text](2024-10-24_16-42.png)  
1. Scrolle in den Bauteilen bis zur Rubrik **Verbindung** herunter.
2. Wähle einen Schraubverbinder und ziehe ihn auf das Steckbrett.
3. Füge zwei weitere Verbinder hinzu - du kannst auch mit *copy-paste* arbeiten (Strg C, Strg V).
4. Verbinde die Anschlüsse mit Kabeln, die du aus den Steckrett-Anschlüssen zur Seite ziehst.

## Kontrolle in der Schaltplan-Ansicht
Überprüfe, ob die Verbindungen passen:  
![alt text](2024-10-24_16-51.png)
## Design der Leiterplatte
![alt text](2024-10-24_16-54.png)  
1. Wechsele in die Leiterplatten-Ansicht:  
2. Markiere einen Schraubverbinder
3. Überprüfe, on der passender Beinchenabstand eingestellt ist: 5 mm
4. Wähle im Menü *Bauteil* den Punkt *Bauteilbeschriftung ausblenden*.
5. Wiederhole dies für alle Schraubverbinder.  
 (Mit gedrückter Strg-Taste kannst du auch mehrere gleichzeitg markieren.) 

## Leiterplatte in CNC-System selbst erstellen

### Software
Neben Fritzing sind noch zwei Programme nötig:
1. Flatcam: Wandelt die Gerber-Dateien aus Fritzing in GCode-Dateien um, mit denen die Fräse gesteuert werden kann.  
Die Software ist leider schon sehr alt und die Installation scheitert an veralteten Python-Bibliotheken, die nicht mehr geladen werden können.  
Unter https://drive.google.com/drive/folders/1sCBYOjP_K2XKYgDagDPQqvY4xDjRxZQf kann eine Installationsdatei für Windows heruntergeladen werden.  

2. Universal Gode Sender: Schickt die GCOde-Dateien an die Fräse und steuert sie.  
(https://github.com/winder/Universal-G-Code-Sender?tab=readme-ov-file)  

### Fritzing
 Datei.Export für Produktion: Gerber files
### FlatCam
#### Dateien laden
1. File.Open.Gerber Files
   1.   ...copperTop.gtl
   2.   ...contour.gml
2. File.Open.Excellon
   1. ...drill.txt

#### GCode erzeugen
1. Doppelklick auf ...copperTop.gtl  
   1. Durchmesser des Fräswerkzeuges einstellen:  
   Tool dia: 0,4  
   Bei einem zu großen Durchmesser fährt die Fräse nicht mehr alle Kreisbögen aus.  
   2. Isolierungsgeometrie erzeugen:  
   Klick auf "Generate Isolationgeometrie"

   3. Einstellungen prüfen: 
      1. CutZ: -0.4   
      Frästiefe: 0.4 mm
      2. Spindle Speed: 35000  
      Drehzahl der Spindel 

   4. GCode erzeugen
      1. Generate CNCJob Object
      2. Save CNCCode  
      Dateityp: GCode
2. Doppelklick auf ...contour.gml
   1. Durchmesser des Fräswerkzeuges einstellen:  
   Tool dia: 0,4
   2. Bounding Box erzeugen:  
      1. Boundary Margin: 1,5  
      Abstand vom Rand

      2. Boxgeometrie erzeugen:  
        Klick auf "Generate Geo"
 3. Einstellungen prüfen: 
      1. CutZ: -1,6   
      Frästiefe: 1,6 mm
      2. Spindle Speed: 35000  
      Drehzahl der Spindel 

   1. GCode erzeugen
      1. Generate CNCJob Object
      2. Save CNCCode  

      Dateityp: GCode

3. Doppelklick auf ...drill.txt
   1. Einstellungen überprüfen
      1. CutZ: -1,6   
      Frästiefe: 1,6 mm
      2. Spindle Speed: 35000  
      Drehzahl der Spindel 
      3. Drill tool dia: 0,8  
      Durchmesser des Bohrers
      4. Z-Feed: 50  
      Geschwindigkeit in der Z-Achse
   2. GCode erzeugen
      1. Klicke auf Create Drills GCode
      2. Save CNCCode  
      Dateityp: GCode

## Universal GCode Sender
### Z-Achse nivellieren
### Dateien laden und drucken


   



<link rel="stylesheet" href="https://hi2272.github.io/StyleMD.css">


# Leiterplatte in CNC-System selbst erstellen

## Hardware
Die folgende Anleitung basiert auf einer 3018Pro CNC Maschine. Die Geräte können als güsntige Bausätze im Internet bestellt werden.

## Kalibrierung der Hardware
Im Mikroconrtoller der CNC-Maschine sind verschiedene Konstanten gespeichert, mit denen die Maschine kalibriert wird.  
Unter Window.Console kann die Bedienkonsole geöffnet werden.  
Mit dem Befehl **$$** werden die Konstanten angezeigt.  
Zur Sicherheit kopieren wir diese Angaben und speichern sie in einer Textdatei.

### x-Achse kalibrieren
Wir ermitteln, wie viele Rotationsschritte der Schrittmotor machen muss, um die Spindel 1 mm nach rechts oder links zu bewegen.
1. Lege ein Brett auf die Fläche.
2. Klebe einen 22 cm langen Streifen Malerkrepp auf das Holz.
3. Steche die Spindel an der linken Seite des Krepps ein.
4. Hebe die Spindel an.
5. Lasse sie **200 mm** nach rechts fahren
6. Steche sie wieder in den Krepp.
7. Messe den Abstand zwischen den beiden Punkten auf dem Krepp. (Bsp.: **203 mm**)
8. Ermittle den Umrechnungsfaktor nach folgender Formel:  
**U(neu)=U(alt) * 200/203**
9. Trage den neuen Wert mit **$100 = U(neu)** ein.
10. Überprüfe den Eintrag mit **$$**

### y-Achse kalibrieren
Analog kalibrieren wir die y-Achse und tragen den Wert mit **$101** ein.

## Software

Neben Fritzing sind noch zwei Programme nötig:
1. Flatcam: Wandelt die Gerber-Dateien aus Fritzing in GCode-Dateien um, mit denen die Fräse gesteuert werden kann.  
Die Software ist leider schon sehr alt und die Installation scheitert an veralteten Python-Bibliotheken, die nicht mehr geladen werden können.  
Unter https://drive.google.com/drive/folders/1sCBYOjP_K2XKYgDagDPQqvY4xDjRxZQf kann eine Installationsdatei für Windows heruntergeladen werden.  

1. Universal Gode Sender: Schickt die GCOde-Dateien an die Fräse und steuert sie.  
(https://github.com/winder/Universal-G-Code-Sender?tab=readme-ov-file)  

## Entwurf und Erstellen der PCBs
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
- Spindel mit Krokoklemme mit A5 verbinden.
- Cu-Platte mit Krokoklemme mit GND verbiden
- Unter Tools.Plugins.Installed prüfen, ob Probe Manager aktiviert ist.
- Machine.Probe.Probe and Zero Z
  - Prüfen, ob Touch plate Thickness auf 0 eingestellt ist.
  - Probe durchführen lassen
### X- und Y-Achse nivellieren
- Spindel in die linke vordere Ecke der Platine fahren (-X, -Y)
- Zero X und Zero Y anklicken

### Dateien laden und drucken



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
Beim Entwurf der Platine sind folgende Punkte zu beachten:  
1. Die Leiterbahnen dürfen sich nicht kreuzen. Wenn es nicht anders geht, müssen zwei Endpins gesetzt werden, zwischen die später ein isoliertes Kabel gelötet wird.
2. Alle Leiterbahnen müssen auf der Unterseite liegen, da wir später die Unterseite fräsen:  
   1. Routing.AlleLeiterbahnenAuswählen
   2. Routing.AufAnderePlatinenseiteVerschieben
3. Alle Leiterbahnen müssen extradick sein:  
   1. Routing.AlleLeiterbahnenAuswählen
   2. Im Inspektorfenster Extradick (48 mil) einstellen.
4. Die Abstände zwischen den Leiterbahnen sollten möglichst genauso groß sein, wie ihre Dicke
5. Die Löcher von Schraubsockeln müssen groß sein. Im Inspektorfenster unter Lochgröße:  
   1. Lochdurchmesser: 2 mm
   2. Ringdicke: 1 mm
   
Datei.Export für Produktion: Gerber files
### FlatCam
#### Dateien laden
1. File.Open.Gerber Files
   1.   ...copperBottom.gtl
2. File.Open.Excellon
   1. ...drill.txt

#### GCode erzeugen
1. Doppelklick auf ...copperBottom.gtl  
   1. Durchmesser des Fräswerkzeuges einstellen:  
      1. Tool dia: 0,1
      2. Passes: 4
      3. Pass overlay: 10%  
   Bei einem zu großen Durchmesser fährt die Fräse nicht mehr alle Kreisbögen aus. Durch die vier Durchgänge wird das gesamte Kupfer zwischen benachbarten Kontakten entfernt.  

   2. Isolierungsgeometrie erzeugen:  
   Klick auf "Generate Isolationgeometrie"

   3. Einstellungen prüfen: 
      1. CutZ: -0,1   
      Frästiefe: 0,1 mm
      2. Spindle Speed: 35000  
      Drehzahl der Spindel 

   4. GCode erzeugen
      1. Generate CNCJob Object
      2. Save CNCCode  
      Dateityp: GCode

2. Doppelklick auf ...drill.txt
   1. Einstellungen überprüfen
      1. CutZ: -2   
      Frästiefe: 2 mm
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

3. Ausscheidepfad erzeugen
   1. Doppelklick auf ...copperBottom.gtl  
   2. Klick auf **Cutout tool**
      1. Fräsetiefe überprüfen
      2. Generate Rectangular Geometrie
   3. Doppelklick auf Geometrie...cutout
      1. Frästiefe -2
      2. Spindelgeschwindigkeit 35000
      3. Generate CNCJob object
 

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
 


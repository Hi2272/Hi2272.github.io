# CNC-Fräsen

## Allgemeines
Die CNC-Fräse an unserer Schule wurde von der [Wilhelm Stemmer Stiftung](https://www.wilhelm-stemmer-stiftung.de/) finanziert.   


**Da sie ein sehr leistungsfähiges und damit gefährliches Gerät. darf die CNC-Fräse nur in Anwesenheit einer Lehrkraft verwendet werden.**  

Eine CNC-Tischfräse ist vereinfacht gesagt eine Bohrmaschine, die über den Computer gesteuert werden kann. Der Computer kann:
- den Bohrer ein- und ausschalten
- den Bohrer nach links und rechts bewegen (x-Achse).
- den Bohrer nach oben und unten bewegen (z-Achse).
- den Tisch mit dem Werkstück vor- und zurückbewegen (y-Achse).

Der Bohrer kann durch einen Fräser ersetzt werden, der Material aus einem Werkstück entfernen kann.  
Damit können Löcher an exakt festgelegte Stellen gebohrt werden oder Werkstücke aus größeren Platten ausgefräst werden.

Der Steuer-Code wird hierbei mit GCode-Befehlen übermittelt:

|GCode-Befehl|Bedeutung|
|----|----|
|M03 S2000|Startet die Bohrspindel mit 2000 U/min|
|G21|Setzt die Maßeinheit auf Millimeter|
|G90|Absolute Maßeinheiten. Die Einheiten beziehen sich auf einen festgelegten Startpunkt (x=0,y=0, z=0) in der vorderen linken Ecke des Werkstücks.|
|G91|Relative Maßeinheiten. Die Einheiten beziehen sich auf den aktuellen Standort der Spindel.|
|G0 X10|Schnelle Fahrt zu x=10 mm. Im absoluten Modus (G90) fährt die Spindel so lange, bis die x-Koordinate 10 mm erreicht ist. Im relativen Modus (G91) fährt die Spindel 10 mm nach rechts.|
|G1 Z-2 F100|Langsame Fahrt zu z=-2 mm. Über F100 wird die Geschwindigkeit (Feedrate) mit 100 mm pro Minute eingestellt. Mit diesem Befehl bohrt die Fräse langsam ein 2mm tiefes Loch ins Werkstück, wenn absolute Maßeinheiten eingestellt sind.|
|M05|Stoppt die Spindel|
|M30|Ende des Programms|

## Hilfsprogramme
### [GCode Simulator](../../../../GCodeSimulator/index.html)  
Simuliert einfache GCode-Befehle auf dem Computer. Ideal zum Lernen von GCode.

### [GCode Plotter Konverter](../../../../Plotter/index.html)
Wandelt GCode-Befehle so um, dass sie einen Stiftplotter ansteuern können. 
### [Gerber GCode Konverter](../../../../GerberToGCode/index.html)
Wandelt Gerber-Dateien direkt in GCode um. Damit können zum Beispiel Schaltungen automatisch gezeichnet werden.
### [Drill Konverter](../../../../SVGtoGCode/index.html)  
Wandelt die ...drill.txt aus einem Gerber-Paket in GCodes zum Ansteuern der CNC-Fräse um.
### [Kontur Konverter](../../../../GerberKontur/index.html)
Wandelt die ..._contour.gb1-Datei aus einem Geber-Paket in GCodes zum Ansteuern der CNC-Fräse um.
### [Gerber zu GCode](../../../../GerberGCode/index.html)
Wandelt die ...drill.txt und die ..._contour.gb1-Datei aus einem Gerber-Paket in GCode-Dateien um.

## Arbeitsgang zum Fräsen und Ätzen von Platinen

### Konstruktion der Platine

1. [Konstruktion der Platine in Fritzing](Fritzing/CNC/index.html)
   
### 1. Export der relevanten Dateien
1. Export zur Produktion als Gerber.
2. Export zur Produktion als Ätzbar(SVG)

### 2. GCode für Bohrungen 
1. Öffnen der Datei mit den Bohrungen (**...drill.txt**) mit einem Editor.
2. Kopieren des Code und einfügen auf der Internetseite [Gerber zu GCode](https://hi2272.github.io/GeberGCode/index.html).
3. Öffnen der Datei mit der Kontur: (**..._contour.bm1**) mit einem Editor.
4. Kopieren des Code und einfügen auf der Internetseite.
5. Konvertieren und als GCOde-Dateien speichern.

### 3. SVG für Belichtung
1. Öffnen der Datei **..._etch_copperTop_mirror.svg** mit Inkscape
2. Alles markieren und Füllung auf schwarz stellen
3. Gruppierung aufheben (Strg U)
4. Hintergrund markieren und Füllung auf weiß stellen
5. Ggf. weitere Bereiche mit Rechtecken maskieren.
6. Alles markieren und gruppieren (Strg A, Strg G)
7. Alles markieren und kopierne (Strg A, Strg C)
8. Neue Datei erstellen (DIN A4) (Strg N)
9. Einfügen (Strg V) und sinnvoll auf der Seite positionieren.
10. Auf OHP-Folie ausdrucken

### 4. Bohren und Fräsen    

11. Starten von UniversalGCodeSender (https://universalgcodesender.com/).
12. Laden der GCode-Dateien und Bohren bzw. Fräsen der Platine.  
**WICHTIG: Die Platine wird mit Kupferseite nach oben gebohrt und gefräst.**

### 5. Belichten der Platine

1. OHP-Folie passend ausschneiden
2. Rückseite mit weißer Kerze einreiben (Wachs verhindert das Anhaften des Kunststoffes)
3. Platine dünn mit UV-härtendem Harz bestreichen (3D-Drucker Resin)  
   1. Arbeit unter LED-Licht, kein Sonnenlicht wegen UV-Strahlung.
   2. **Vorsicht, giftig - Handschuhe und Schutzbrille und Atemschutz tragen**
4. Folie auflegen , an Bohrungen ausrichten
5. 10 Sekunden lang mit UV-Taschenlampe belichten.
   1. **Vorsicht, gefährlich, Augen schützen**
6. Nicht gehärtetes Harz abwaschen.
   1. **Vorsicht, giftig - Handschuhe und Schutzbrille und Atemschutz tragen** 

### Alternativ: Zeichnen der Leiterbahnen mit einem Edding auf der Kupferseite.

### 6. Ätzen der Platine mit Natriumperoxodisulfat. 
1. Temp. 50°C
2. vorsichtig schütteln
3. **Vorsicht, ätzend - Handschuhe und Schutzbrille und Atemschutz tragen**


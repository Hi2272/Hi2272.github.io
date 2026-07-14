# CNC-Fräsen
## Allgemeines
Eine CNC-Tischfräse ist vereinfacht gesagt eine Bohrmaschine, die über den Computer gesteuert werden kann. Der Computer kann:
- den Bohrer ein- und ausschalten
- den Bohrer nach links und rechts bewegen (x-Achse).
- den Bohrer nach oben und unten bewegen (z-Achse).
- den Tisch mit dem Werkstück vor- und zurückbewegen (y-Achse).

Damit können Löcher an exakt festgelegte Stellen gebohrt werden oder Werkstücke ausgefräst werden.

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

## Arbeitsgang zum Fräsen und Ätzen von Platinen

1. [Konstruktion der Platine in Fritzing](Fritzing/CNC/index.html)
2. Export zur Produktion als Gerber.
3. Öffnen der Datei mit den Bohrungen (...drill.txt) mit einem Editor.
4. Kopieren des Code und einfügen auf der Internetseite [DrillKonverter](https://hi2272.github.io/SVGtoGCode/).
5. Konvertieren, sortieren und als GCOde-Dateien speichern.
6. Starten von UniversalGCodeSender (https://universalgcodesender.com/).
7. Laden der Dateien und Bohren der Platine.
8. Zeichnen der Leiterbahnen mit einem Edding auf der Kupferseite.
9. Ätzen der Platine mit Natriumperoxodisulfat.

  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">

# Graphix-Editor

[Erzeugen neuer Objekte](#1-erzeugen-neuer-objekte)|
[Aufruf von Methoden](#2-aufruf-von-methoden)|
[Alle Klassen](#alle-klassen)|
[Linie](#linie-line)|
[Rechteck](#rechteck-rect-rectangle)|
[Dreieck](#dreieck-triangle)|
[Kreis](#kreis-circle)  

## 1. Erzeugen neuer Objekte
Vor der Verwendung müssen Objekte erzeugt werden. Dies geschieht nach folgendem Muster:  
  
  **Objektname:Klassenname**  
  
Graphix kennt folgende Klassen:
- Rechteck (Rect, Rectangle)
- Kreis (Circle)
- Linie (Line)
- Dreieck (Triangle) 
   
Es können sowohl die deutschen, als auch die englischen Klassenbezeichner verwendet werden.  
Groß- und Kleinschreibung wird allgemein nicht beachtet.  
**re:rect, Re:Rect, re:Rectangle** oder **re:Rechteck** erzeugen alle ein Objekt mit dem Namen **re** aus der Klasse **Rechteck**.
## 2. Aufruf von Methoden
Methoden werden nach folgendem Muster aufgerufen:  
  
  **Objektname.Methodenname(Parameter)**  
    
Auch bei den Methodennamen können deutsche oder englische Bezeichnungen verwendet werden.  
## 3. Klassen und Methoden
### Alle Klassen
#### Attribute
- x,y: Koordinaten des Objekts
- stroke: Linienfarbe 
- strokeWidth: Linienbreite
- fill: Füllfarbe (außer bei der Klasse Linie)
#### Methoden
- **setFill(color), setColor(farbe), füllfarbeSetzen(farbe), setzeFüllfarbe(farbe), setFüllfarbe(farbe)**  
  Setzt die Füllfarbe eines geschlossenen Objekts.   
- **setStroke(color),  linienfarbeSetzen(farbe), setzeLinienfarbe(farbe), setLinienfarbe(farbe)**  
  Setzt die Linienfarbe des Objekts.
- **setStrokeWidth(width), linienbreiteSetzen(breite), setzeLinienbreite(breite), setLinienbreite(breite)**  
  Setzt die Breite der Linie des Objekts.
- **moveX(dx), verschiebeX(dx)**  
  Verschiebt das Objekt um dx Einheiten nach rechts (postives dx) oder links (negatives dx)
- **moveY(dy), verschiebeY(dy)**  
   Verschiebt das Objekt um dy Einheiten nach unten (positives dy) oder oben (negatives dy)
- **moveTo(x,y), verschiebeZu(x,y), verschiebeNach(x,y)**  
  Verschiebt das Objekt auf die Position mit den Koordinaten (x,y)  
#### Parameter
Farben werden als englische Wörter ohne Anführungszeichen eingetragen: 
### Linie (Line)
#### Attribute
- x,y,x1,y1 : Koordinaten der beiden Endpunkte der Linie
- stroke: Linienfarbe
- strokeWidth: Linienbreite  
  
*Achtung:  
 Eine Linie ist keine geschlossene Figur. Sie hat daher auch kein Attribut Füllfarbe.*

#### Zusätzliche Methoden
- **setPoints(x1,y1,x2,y2), punkteSetzen(x1,y1,x2,y2), setzePunkte(x1,y1,x2,y2), setPunkte(x1,y1,x2,y2)**  
  Setzt die Koordinaten der beiden Endpunkte der Linie.  
  
### Rechteck (Rect, Rectangle)
#### Attribute
- x,y : Koordinaten der linken oberen Ecke
- width : Breite
- height: Höhe
- fill: Füllfarbe
- stroke: Linienfarbe
- strokeWidth: Linienbreite
#### Zusätzliche Methoden
- **setWidth(width), breiteSetzen(breite), setzeBreite(breite), setBreite(breite)**    
  Setzt den Wert des Attributs Breite.
- **setHeight(height), höheSetzen(höhe), setzeHöhe(höhe), setHöhe(höhe)**  
  Setzt den Wert des Attributs Höhe.
- **setPoints(x1,y1,x2,y2), punkteSetzen(x1,y1,x2,y2), setzePunkte(x1,y1,x2,y2), setPunkte(x1,y1,x2,y2),eckenSetzen(x1,y1,x2,y2)**  
  Setzt die Koordinaten der linken unteren und der rechten oberen Ecke des Rechtecks.

### Dreieck (Triangle)
#### Attribute
- x,y,x1,y1,x2,y2 : Koordinaten der drei Ecken
- fill: Füllfarbe
- stroke: Linienfarbe
- strokeWidth: Linienbreite
#### Zusätzliche Methoden
- **setPoints(x1,y1,x2,y2,x3,y3), punkteSetzen(x1,y1,x2,y2,x3,y3), setzePunkte(x1,y1,x2,y2,x3,y3), setPunkte(x1,y1,x2,y2,x3,y3), eckensetzen(x1,y1,x2,y2,x3,y3)**  
  Setzt die Koordinaten der drei Ecken.

### Kreis (Circle)
#### Attribute
- x,y : Koordinaten des Mittelpunkts
- radius : Radius
- fill: Füllfarbe
- stroke: Linienfarbe
- strokeWidth: Linienbreite
#### Zusätzliche Methoden
- **setRadius(radius), setzeRadius(radius), radiusSetzen(radius)**    
  Setzt den Wert des Attributs Radius.
- **setPoints(x,y), mittelpunktSetzen(x,y), setzeMittelpunkt(x,y), setMittelpunkt(x,y)**  
  Setzt die Koordinaten des Mittelpunkts.
  
[zurück](index.html)  

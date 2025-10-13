  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">
 
# Flugverbindungen als Graphen
## Beschreibung des Problems
Am späten Abend gehen nur noch wenige Flüge von den Flugplätzen ab.  
Von München (M) geht ein Flug nach Frankfurt (F). Von dort kannst du nach Hamburg (H), Paris (P) oder zurück nach München fliegen. Von Hamburg geht ein Flug nach München. Von Paris erreichst die London(L). Dort gibt es keine Anschlüsse mehr.  
## Aufgabenstellung
1. Modelliere dieses Problem mit einem geeigneten Graphen.
2. Beschreibe den Typen des Graphen.
3. Zeiche eine Adjazenzmatrix des Graphen.
4. Leite aus der Matrix ab, ob der Graph stark, schwach oder nicht zusammenhängend ist.
5. Markiere in der Matrix alle Kanten, die von M ausgehen.
6. Markiere in der Matrix alle Kanten, die in M enden.
7. Implementiere die Knoten als eindimensionales Feld **knoten** von Zeichenketten.
8. Implementiere die Matrix als zweidimensionales Feld **kanten**.
9. Gib die Indexpaare (Bsp..: kanten[3][2]) aller Kanten an, die vom Knoten mit dem Index **start** ausgehen.
10. Gib die Indexpaare aller Kanten an, die am Knoten mit dem Index **ziel** enden.
11. Implementiere eine Methode **printKantenZiel**, die den Index eines Startknotens als Parameter übernimmt, und die Gewichte aller Kanten ausdruckt, die vom diesem Knoten ausgehen. 
Mögliche Ausgabe: 0 1 0 1 0
12. Implementiere eine Methode **printKantenStart**, die den Index eines Zielknotens als Parameter übernimmt, und die Gewichte aller Kanten ausdruckt, die an diesem Knoten enden.
Mögliche Ausgabe: 0 1 0 1 0  
## [weiter](../02Loesung/index.html)    
## [Index](../../../index.html)


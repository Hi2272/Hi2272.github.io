  <meta charset="utf-8" />
  <title>Informatik</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">

# Breitensuche

## Fragestellungen zum Algorithmus
1. Welcher Knoten wird im Schritt 0 in die Warteschlange  eingefügt?  
*Der Startknoten*
2. Welcher Knoten wird jeweils aus der Warteschlange entfernt?  
*Der erste*
3. An welcher Position werden neue Knoten in die Warteschlange eingefügt?  
*Am Ende*
4. Welche Knoten werden jeweils in die Warteschlange eingefügt?  
*Die Nachbarknoten des aktuellen Knotens, die noch nicht besucht worden sind.*
5. Warum endet die Breitesuche nach Schritt 7?  
*Die Warteschlange ist leer*
6. Wann würde die Breitensuche früher enden?  
*Wenn der gesuchte Knoten gefunden wurde.*

## Formuliere den Algorithmus in eigenen Worten
1. Füge den Startknoten in die Warteliste ein.
2. Solange die Warteliste nicht leer ist 
   1. Entferne den ersten Knoten aus der Warteliste.
   2. Wenn dieser Knoten dem Zielknoten entspricht,  
      1. beende die Suche
   3. Sonst:  
      1. Füge alle Nachbarknoten dieses Knotens, die noch nicht besucht worden sind, am Ende der Warteliste ein.
      2. Markiere diese Knoten als besucht.


## [weiter](../06Warteschlange/index.html)  
## [Index](../../../index.html)


  <meta charset="utf-8" />
  <title>Implementierung</title>
  <link rel="stylesheet" href="https://Hi2272.github.io/StyleMD.css">

```Java
   public boolean breitenSuche(Knoten start, Knoten ziel) {
      LinkedList<Knoten> queue= new LinkedList<Knoten>();
      for (int i = 0; i < anzahlKnoten; i++) {
         knoten[i].setVisited(false);
      }
      start.setVisited(true);
      queue.addLast(start);
      while (!queue.isEmpty()) {
         Knoten aktuell = queue.removeFirst();
         println("Aktueller Knoten: " + aktuell.getName());
         if (aktuell == ziel) {
            println("Ziel gefunden");
            return true;
         }  
         int index = aktuell.getIndex();
         for (int i = 0; i < anzahlKnoten; i++) {
            if (kanten[index][i] != 0) { 
               Knoten nachbar = knoten[i];
               if (!nachbar.isVisited()) {
                  nachbar.setVisited(true); 
                  queue.addLast(nachbar); 
               }
            }
         }
      }
      return false;  
   }
```
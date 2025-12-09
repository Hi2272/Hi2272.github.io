public class Graph { 
   private Knoten[] knoten;
   private int anzahlKnoten;

   // Deklariere eine Attribut queue
   // vom Typ LinkedList
   // Die Elemente der Liste sollen
   // Objekte vom Typ Knoten sein
   private LinkedList<Knoten> queue;

   int[][] kanten = 
      {
      { 0, 80, 0, 60, 40, 150, 52 },
      { 80, 0, 10, 0, 50, 0, 0 },
      { 0, 10, 0, 0, 0, 0, 23 },
      { 60, 0, 0, 0, 0, 0, 26 },
      { 40, 50, 0, 0, 0, 130, 0 },
      { 150, 0, 0, 0, 130, 0, 0 },
      { 52, 0, 23, 26, 0, 0, 0 }
   };
      
   public Graph(int maxKnoten) {
      knoten = new Knoten[maxKnoten];
      anzahlKnoten = 0;
         // Initialisiere die Warteschlange queue
      queue = new LinkedList<Knoten>();
   }

   public void addKnoten(Knoten k) {
      knoten[anzahlKnoten] = k;
      anzahlKnoten++;
   }
   
     public void drawKante(int start, int ziel) {
      if(kanten[start][ziel] > 0) { 

         Line l = new Line(knoten[start].getCenterX(), knoten[start].getCenterY(), knoten[ziel].getCenterX(), knoten[ziel].getCenterY());
         l.setBorderColor(Color.darkblue);
         l.setBorderWidth(1);
         String gew = kanten[start][ziel];
         Text txt = new Text(l.getCenterX(), l.getCenterY(), 25, gew);
      }
   }
   
   public void drawKanten() {
      for (int i = 0; i < kanten[0].length; i++) {
         for (int j = 0; j < kanten[0].length; j++) {
            drawKante(i, j);
         }
      }
   }
   
   public Knoten getKnoten(int i) {
      return knoten[i];
   }

   public Knoten getKnoten(String name) {
      if(getIndex(name) != -1) {
         return knoten[getIndex(name)];
      } else {
         println("Knoten " + name + " nicht gefunden!");
         return null;
      }
   }

   public int getIndex(String name) {
      for (int i = 0; i < anzahlKnoten; i++) {
         if(knoten[i].getName().equals(name)) {
            return i;
         }
      }
      return -1;
   }
   
   public int getIndex(Knoten k) {
      for (int i = 0; i < anzahlKnoten; i++) {
         if(knoten[i] == k) {
            return i;
         }
      }
      return -1;
   }

   // Schreibe die Methode breitenSuche
   // mit den Parametern start und ziel vom Typ Knoten
   // Sie soll wahr zurückgeben, wenn das Ziel gefunden wurde
   public boolean breitenSuche(Knoten start, Knoten ziel) {
      // Setze bei allen knoten 
      // das Attribut visited auf false
      for (int i = 0; i < anzahlKnoten; i++) {
         knoten[i].setVisited(false);
      }

      // Leere die warteschlange 
      // mit der Methode clear()
      queue.clear();
      // Setze beim Startknoten das 
      // Attribut visited auf true
      start.setVisited(true);
      // Füge den Startknoten am Ende
      // der Warteschlange hinzu
      queue.addLast(start);
      // Solange die Warteschlang nicht leer ist
      while (!queue.isEmpty()) {
         // Entferne den ersten Knoten 
         // aus der Warteschlange 
         // und speichere ihn in einer lokalen
         // Variable aktuell
         Knoten aktuell = queue.removeFirst();

         // Drucke den Namen des aktuellen Knotens aus
         println("Aktueller Knoten: " + aktuell.getName());
         // Wenn der aktuelle Knoten gleich dem Ziel ist,
         // dann drucke "Ziel gefunden" aus
         // und gib den Wert true zurück
         if (aktuell == ziel) {
            println("Ziel gefunden");
            return true;
         }  

         // Speichere den Index des 
         // aktuellen Knotens in der Variablen index
         int index = getIndex(aktuell);
         // Durchlaufe alle Nachbarknoten des aktuellen Knotens
         // wenn sie eine Kante zum aktuellen Knoten haben
         // und noch nicht besucht wurden,
         // damm markiere sie als besucht
         // füge sie am Ende der Warteschlange hinzu
         for (int i = 0; i < anzahlKnoten; i++) {
            if (kanten[index][i] != 0) { // Es gibt eine Kante
               Knoten nachbar = knoten[i];
               if (!nachbar.isVisited()) { // Noch nicht besucht
                  nachbar.setVisited(true); // Markiere als besucht
                  queue.addLast(nachbar); // Füge zur Warteschlange hinzu
               }
            }
         }
      }
      // Drucke einen Zeilenumbruch
      println();
      // gib false zurück
      return false;  
   }
}

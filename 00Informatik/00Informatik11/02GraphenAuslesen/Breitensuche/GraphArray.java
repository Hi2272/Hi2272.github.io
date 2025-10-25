public class Graph { 
   private Knoten[] knoten;
   private int anzahlKnoten;
   private Knoten[] warteschlange;

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
    //  warteschlange = new LinkedList<Knoten>();
      warteschlange = new Knoten[maxKnoten];
   }

   public void changeKante(int start, int ziel, int neuerWert) {
      kanten[start][ziel] = neuerWert;
   }

   public void changeKante(String start, String ziel, int wert) {
      int iStart = getIndex(start);
      int iZiel = getIndex(ziel);
      if(iStart != -1 && iZiel != -1) {
         changeKante(iStart, iZiel, wert);
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

   public void breitenSuche(String start) {
      
      if(anzahlKnoten == 0) return;
      
      int indexVorne = 0;
      int indexHinten = 0;
      
      for (int i = 0; i < anzahlKnoten; i++) {
         knoten[i].setVisited(false);
      }
      
      int index = getIndex(start);
      
      knoten[index].setVisited(true);
      warteschlange[indexHinten] = knoten[index];
      indexHinten = indexHinten + 1;

      while (indexVorne < indexHinten) {
         Knoten current = warteschlange[indexVorne];
         indexVorne = indexVorne + 1;
         print(current.getName() + " ");
         int index = getIndex(current.getName());
         for (int i = 0; i < kanten[index].length; i++) {
            if(kanten[index][i] > 0 && !knoten[i].isVisited()) {
               knoten[i].setVisited(true);
               warteschlange[indexHinten] = knoten[i];
               indexHinten = indexHinten + 1;
            }
         }
      }
      println();
   }
   
   public void printNachbarn(String name) {
      int index = getIndex(name);
      if(index != -1) {
         print("Nachbarn von " + name + ": ");
         for (int i = 0; i < kanten[index].length; i++) {
            if(kanten[index][i] > 0) {
               print(knoten[i].getName() + " ");
            }
         }
         println();
      } else {
         println("Knoten " + name + " nicht gefunden.");
      }
   }
   
   public void printAlleNachbarn() {
      for (int i = 0; i < anzahlKnoten; i++) {
         printNachbarn(knoten[i].getName());
      }
   }
   
   public void addKnoten(Knoten k) {
      if(anzahlKnoten < knoten.length) {
         knoten[anzahlKnoten] = k;
         anzahlKnoten++;
      }
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
}

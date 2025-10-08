public class Graph { 
   private Knoten[] knoten;
   private int anzahlKnoten;
    
   public Graph(int maxKnoten) {
      knoten = new Knoten[maxKnoten];
      anzahlKnoten = 0;
   }
 

   public void addKnoten(Knoten k) {
      if(anzahlKnoten < knoten.length) {
         knoten[anzahlKnoten] = k;
         anzahlKnoten++;
      }
   }

}

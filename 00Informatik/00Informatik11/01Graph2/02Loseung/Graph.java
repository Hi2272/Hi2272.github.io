public class Graph { 
  
   private String[] knoten = { "M", "F", "H", "P", "L" };

   private int[][] kanten = {
      { 0, 1, 0, 0, 0 },
      { 1, 0, 1, 1, 0 },
      { 1, 0, 0, 0, 0 },
      { 0, 0, 0, 0, 1 },
      { 0, 0, 0, 0, 0 }
   };

   
   public void printKantenZiel(int start) {
      for (int ziel = 0; ziel < knoten.length; ziel++) {
         print(kanten[start][ziel]);
         print(" ");
      }
      println();
   }


   public void printKantenStart(int ziel) {
      for (int start = 0; start < knoten.length; start++) {
         print(kanten[start][ziel]);
         print(" ");
      }
      println();
   }
}


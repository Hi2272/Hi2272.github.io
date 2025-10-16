public class Graph { 
  
   private String[] knoten = { "M", "F", "H", "P", "L" };

   private int[][] kanten = {
      { 0, 1, 0, 0, 0 },
      { 1, 0, 1, 1, 0 },
      { 1, 0, 0, 0, 0 },
      { 0, 0, 0, 0, 1 },
      { 0, 0, 0, 0, 0 }
   };

public void printKantenZiel(int start){
  print("Kanten gehen von ");
  print(knoten[start]);
  print(" nach ");
  for (int ziel=0;ziel<knoten.length;ziel++){
    if (kanten[start][ziel]>0){
       print(knoten[ziel]);
       print(", ");
    }
  }
  println();
}

public void printKantenStart(int ziel){
  print("Kanten enden in ");
  print(knoten[ziel]);
  print(" aus ");
  for (int start=0;start<knoten.length;start++){
    if (kanten[start][ziel]>0){
       print(knoten[start]);
       print(", ");
    }
  }
  println();
}

   public boolean hatNachfolger(int start) {
      int summe = 0;
      for (int ziel = 0; ziel < knoten.length; ziel++) {
         summe = summe + kanten[start][ziel];
      }
      return !(summe == 0);
   }
}


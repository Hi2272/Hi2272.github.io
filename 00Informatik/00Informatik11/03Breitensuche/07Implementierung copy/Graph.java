public class Graph { 
   private Knoten[] knoten;
   private int anzahlKnoten;
   private LinkedList<Knoten> warteschlange;
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
      warteschlange = new LinkedList<Knoten>();
   }

   public int getIndex(String name){
      for(int i=0; i<anzahlKnoten; i++){
         if(knoten[i].getName().equals(name)){
            return i;
         }
      }
      return -1;
   }

   public void breitenSuche(String start, String ziel){
            
      for(int i=0; i<anzahlKnoten; i++){
         knoten[i].setVisited(false);
      }
      warteschlange.clear();
      int index= getIndex(start);
      int indexZiel=getIndex(ziel);

      knoten[index].setVisited(true);
      warteschlange.addLast(knoten[index]);
      while(!warteschlange.isEmpty()){
         Knoten current = warteschlange.removeFirst();
         int index = getIndex(current.getName());
         print(current.getName() + " ");

         if (index==indexZiel){
            print("Ziel gefunden!");
            return
         }
         for(int i=0; i<kanten[index].length; i++){
            if(kanten[index][i] > 0 && !knoten[i].isVisited()){
               knoten[i].setVisited(true);
               warteschlange.addLast(knoten[i]);
            }
         }
      }
      println();
   }
}

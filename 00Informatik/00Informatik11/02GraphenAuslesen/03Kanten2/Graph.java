public class Graph { 
   private Knoten[] knoten;
   private int anzahlKnoten;

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
   }

   public void changeKante(int start, int ziel, int neuerWert) {
      kanten[start][ziel] = neuerWert;
   }

   public int getIndex(String name){
      for(int i=0; i<anzahlKnoten; i++){
         if(knoten[i].getName().equals(name)){
            return i;
         }
      }
      return -1;
   }

   public void printNachbarn(String name){
      int index = getIndex(name);
      if(index != -1){
         print("Nachbarn von " + name + ": ");
         for(int i=0; i<kanten[index].length; i++){
            if(kanten[index][i] > 0){
               print(knoten[i].getName() + " ");
            }
         }
         println();
      } else {
         println("Knoten " + name + " nicht gefunden.");
      }
   }
   
   public void printAlleNachbarn(){
      for(int i=0; i<anzahlKnoten; i++){
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

public class Graph { 
   private Knoten[] knoten;
   private int anzahlKnoten;

   // Deklariere eine Attribut queue
   // vom Typ LinkedList
   // Die Elemente der Liste sollen
   // Objekte vom Typ Knoten sein


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
      queue = new LinkedList<Knoten>();
   }

   public void addKnoten(Knoten k) {
      knoten[anzahlKnoten] = k;
      anzahlKnoten++;
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

   
      // Setze bei allen knoten 
      // das Attribut visited auf false


      // Leere die warteschlange 
      // mit der Methode clear()

      // Setze beim Startknoten das 
      // Attribut visited auf true

      // Füge den Startknoten am Ende
      // der Warteschlange hinzu

      // Solange die Warteschlang nicht leer ist

         // Entferne den ersten Knoten 
         // aus der Warteschlange 
         // und speichere ihn in einer lokalen
         // Variable aktuell

         // Drucke den Namen des aktuellen Knotens aus

         // Wenn der aktuelle Knoten gleich dem Ziel ist,
         // dann drucke "Ziel gefunden" aus
         // und gib den Wert true zurück


         // Speichere den Index des 
         // aktuellen Knotens in der Variablen index

         // Durchlaufe alle Nachbarknoten des aktuellen Knotens
         // wenn sie eine Kante zum aktuellen Knoten haben
         // und noch nicht besucht wurden,
         // damm markiere sie als besucht
         // füge sie am Ende der Warteschlange hinzu


      // Drucke einen Zeilenumbruch

      // gib false zurück


 

}

public class Main {

   private LinkedList<String> queue = new LinkedList<String>();
   
   public Main() {
      String s;
      
      // Einen Buchstaben am Ende der Queue einfügen
      queue.addLast("A");
      // Queue ausgeben
      println(queue.toString());
    
      // Füge die Buchstaben B bis E jeweils am Ende hinzzu
      // und lasse die Queue nach jedem Schritt ausgeben
      


      // Den ersten Buchstaben entfernen
      s = queue.removeFirst();
      // Verkürzte Queue wieder ausgeben
      println(queue.toString());
      
      // Entferne schrittweise alle Buchstaben von vorne
      // und lasse die Queue jeweils anzeigen
      

      
   }
}

new Main();
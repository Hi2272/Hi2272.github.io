public class Knoten extends Circle {
   private String name;
   private Text txt;

// Deklariere eine Variable visited 
// und initialisiere sie mit dem Wert false
   private boolean visited = false;

   public Knoten(String name, int x, int y) {
      super(x, y, 50);
      this.name = name;
      int laenge = name.length();
      setFillColor(Color.bisque);
      setBorderColor(Color.darkblue);
      txt = new Text(x - laenge * 10, y - 25, 30, name);
      txt.setFillColor(Color.black);
   }

   
   // Schreibe eine get-Methode isVisited
   public boolean isVisited() {
      return this.visited;
   }

   // Schreibe eine set-Methode setVisited
   public void setVisited(boolean wert) {
      this.visited=wert;
   }


   public String getName() {
      return name;
   }
}


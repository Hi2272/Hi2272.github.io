public class Knoten extends Circle {
   private String name;
   private Text txt;

// Deklariere eine Variable visited 
// und initialisiere sie mit dem Wert false
   
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


   // Schreibe eine set-Methode setVisited



   public String getName() {
      return name;
   }
}


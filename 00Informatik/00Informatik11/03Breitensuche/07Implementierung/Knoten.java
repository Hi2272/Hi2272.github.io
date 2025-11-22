public class Knoten extends Circle {
   private String name;
   private Text txt;

// Deklariere ein Attribut visited 
// vom Typ boolean
  

   public Knoten(String name, int x, int y) {
      super(x, y, 50);
      this.name = name;
      int laenge = name.length();
      setFillColor(Color.bisque);
      setBorderColor(Color.darkblue);
      txt = new Text(x - laenge * 10, y - 25, 30, name);
      txt.setFillColor(Color.black);
   
// Initialisiere das Attribut visited 
// mit dem Wert false


     }

   public String getName() {
      return name;
   }


// Erzeuge eine Methode isVisited, 
// die den Wert des Attributs ausgibt 


// Erzeuge eine Methode setVisited, 
// mit der der Wert des Attributs gesetzt werden kann. 

  
}
// Die Klasse Auge erweitert die Klasse Circle

public class Auge extends Circle {
   
   // Konstruktor mit den Paramtern x,y,radius
   
   public Auge(double x, double y, double radius, Color farbe) {
      // Aufruf des Konstruktors der Oberklasse
      super(x, y, radius);
      // Aufruf der Methode setFillColor mit dem Parameter-Wert 
      // farbe
      this.setFillColor(farbe);
      // Aufruf der Methode setBorderColor mit dem Parameter-Wert Color.black
      this.setBorderColor(Color.black);
      // Aufruf der Methode setBorderWidth() mit dem Parameter-Wert radius/10+1
      this.setBorderWidth(radius / 10 + 1);
   }
  
   // Methode aus ohne Parameter
   public void aus() {
      // Aufruf der Methode setVisible mit dem
      // Parameter-Wert false
      this.setVisible(false);
   }
  
   // Methode an ohne Parameter
   public void an() {
      // Aufruf der Methode setVisible mit dem
      // Parameter-Wert true
      this.setVisible(true);
   }
}



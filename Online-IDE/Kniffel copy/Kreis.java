public class Kreis extends Circle{
   private double x, y, radius;
   private Color farbe;

   public Kreis(double x, double y, double radius, Color farbe) {
      super(x, y, radius);
      this.setFillColor(farbe);
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.farbe = farbe;
   }
   
   public double getX() {
      return this.x;
   }
   public double getY() {
      return this.y;
   }
   public double getRadius() {
      return this.radius;
   }
   public Color getFarbe() {
      return this.farbe;
   }
   

   public void setX(double x) {
      this.x = x;
   }
   public void setY(double y) {
      this.y = y;
   }
   public void setRadius(double radius) {
      this.radius = radius;
   }
   public void setFarbe(Color farbe) {
      this.farbe = farbe;
   }

/**
 * act-Methode wird 60x pro Sekunde aufgerufen
 * Aktualisiert das Bild des Rechtecks nach 
 * den gespeicherten Attribut-Werten
 */
   public void act() {
      this.setFillColor(this.farbe);
      this.moveTo(this.x, this.y);
      this.setRadius(this.radius);
   } 
}


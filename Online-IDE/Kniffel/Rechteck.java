public class Rechteck extends Rectangle
{
   private double x, y, breite, hoehe;
   private Color farbe;

   public Rechteck(double x, double y, double breite, double hoehe, Color farbe) {
      super(x, y, breite, hoehe);
      this.setFillColor(farbe);
      this.setBorderColor(Color.black);
      this.setBorderWidth(1);
      this.x = x;
      this.y = y;
      this.breite = breite;
      this.hoehe = hoehe;
      this.farbe = farbe;
   }
   
   public double getX() {
      return this.x;
   }
   public double getY() {
      return this.y;
   }
   public double getBreite() {
      return this.breite;
   }
   public double getHoehe() {
      return this.hoehe;
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
   public void setBreite(double breite) {
      this.breite = breite;
   }
   public void setHoehe(double hoehe) {
      this.hoehe = hoehe;
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
      this.setWidth(this.breite);
      this.setHeight(this.hoehe);
   } 
}


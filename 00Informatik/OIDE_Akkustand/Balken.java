public class Balken extends Rectangle {
   
   private Rahmen rahmen;
   private Color farbe;
   private int nr;

   public Balken(Rahmen rahmen, int nr, Color farbe) {
      super(0, 0, 0, 0);
      int x = rahmen.getX() + rahmen.getBreite() * 1 / 11 + rahmen.getBreite() * nr * 3 / 11;
      int y = rahmen.getY() + rahmen.getHoehe() * 1 / 10;
      int breite = rahmen.getBreite() * 3 / 12;
      int hoehe = rahmen.getHoehe() * 8 / 10;
      this.moveTo(x, y);
      this.setWidth(breite);
      this.setHeight(hoehe);
      this.setFillColor(farbe);
      this.farbe = farbe;
   }
   
   public void setColor(Color farbe) {
      this.farbe = farbe;

   }

}
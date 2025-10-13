public class Balken extends Rectangle {
   
   public Balken(World hintergrund, int nr, int hoehe, int xMax, int yMax) {
      super(0, 0, 0, 0);
      int breite = (hintergrund.getWidth() - 30) / xMax;
      int x = nr * breite + 20;
      hoehe = hoehe * (hintergrund.getHeight() - 20) / yMax;
      int y = hintergrund.getHeight() - hoehe;
      this.setWidth(breite * 9 / 10);
      this.setHeight(hoehe);
      this.move(x, y - 10); 
         
      this.setFillColor(Color.red);
      this.setBorderColor(Color.black);
      this.setBorderWidth(1);
   }
}
   



public class Rahmen {
   
   private int x, y, breite, hoehe;

   public Rahmen(int x, int y, int breite) {
      this.x = x; this.y = y; this.breite = breite;
      this.hoehe = breite / 2;
      Rectangle r1 = new Rectangle(x, y, breite, hoehe);
      r1.setFillColor(Color.white);
      Rectangle r2 = new Rectangle(x - breite * 9 / 10, y + hoehe * 2 / 10, breite * 9 / 10, hoehe * 6 / 10);
      r2.setFillColor(Color.white);
   }
   
   public int getX() {
      return x;
   }

   public int getY() {
      return y;
   }

   public int getHoehe() {
      return hoehe;
   }

   public int getBreite() {
      return breite;
   }
}



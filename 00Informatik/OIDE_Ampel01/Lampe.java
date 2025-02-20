public class Lampe extends Circle {

   Color farbe;

   public Lampe(int x, int y, int radius, Color farbe) {
      super(x, y, radius);
      this.farbe = farbe;
      this.aus();
   }

   public void an() {
      this.setFillColor(this.farbe);
   }

   public void aus() {
      this.setFillColor(Color.black);
   } 

}

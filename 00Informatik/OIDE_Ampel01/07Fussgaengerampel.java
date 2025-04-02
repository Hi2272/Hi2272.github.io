public class Fussgaengerampel extends Ampel {

   public Fussgaengerampel(int x, int y, int b, int h, Color[] farbe) {
      super(x, y, b, h, farbe);
      
      rot();
   }
   public void rot() {
      schalten(0);
   }
   public void gruen() {
      schalten(1);
   }
}


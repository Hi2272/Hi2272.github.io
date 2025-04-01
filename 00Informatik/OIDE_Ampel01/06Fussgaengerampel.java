public class Fussgaengerampel extends Ampel {

   public Fussgaengerampel(int x, int y, int b, int h, Color[] farbe) {
      super(x, y, b, h, farbe);
     
      lampe[0].an();
   }
 public void rot() {
      schalten(0);
   }
   public void gruen() {
      schalten(0);
   }
  

}

Fussgaengerampel f = new Fussgaengerampel(10, 10, 100, 200, new Color[] { Color.red, Color.green });

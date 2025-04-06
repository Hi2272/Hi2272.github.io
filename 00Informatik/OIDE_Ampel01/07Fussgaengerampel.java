public class Fussgaengerampel extends Ampel {

   public Fussgaengerampel(int x, int y, int b, int h, Color[] farbe) {
      super(x, y, b, h, farbe);
       for (int i = 0; i < lampe.length; i++) {
         lampe[i] = new Lampe(x + b / 2, y + h / 4 + i * h / 2, b / 2 - 5, farbe[i]);
      }
      rot();
   }
 
   public void gruen() {
      schalten(1);
   }
}


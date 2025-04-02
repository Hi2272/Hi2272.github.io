public class Fussgaengerampel extends Ampel {

   public Fussgaengerampel(int x, int y, int b, int h, Color[] farbe) {
      super(x, y, b, h, farbe);
<<<<<<< HEAD
     
      lampe[0].an();
=======
      for (int i = 0; i < lampe.length; i++) {
         lampe[i] = new Lampe(x + b / 2, y + h / 4 + i * h / 2, b / 2 - 5, farbe[i]);
      }
      rot();
>>>>>>> b98343fd2694d0e97d1c217bf032d2dcb49effc0
   }
   public void rot() {
      schalten(0);
   }
   public void gruen() {
      schalten(1);
   }
}


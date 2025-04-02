public class Verkehrsampel extends Ampel {

   public Verkehrsampel(int x, int y, int b, int h, Color[] farbe) {
      super(x, y, b, h, farbe);
<<<<<<< HEAD
   
      lampe[0].an();
=======
      for (int i = 0; i < lampe.length; i++) {
         lampe[i] = new Lampe(x + b / 2, y + h / 6 + i * h / 3, h / 8, farbe[i]);
      }
      gruen();
   }

   public void gelb() {
      schalten(1);
   }

   public void gruen() {
      schalten(2);
>>>>>>> b98343fd2694d0e97d1c217bf032d2dcb49effc0
   }

}

Verkehrsampel v = new Verkehrsampel(10, 10, 200, 600, new Color[] { Color.red, Color.yellow, Color.green });

public class Verkehrsampel extends Ampel {

   public Verkehrsampel(int x, int y, int b, int h, Color[] farbe) {
      super(x, y, b, h, farbe);
      for (int i = 0; i < lampe.length; i++) {
         lampe[i] = new Lampe(x + b / 2, y + h / 6 + i * h / 3, h / 8, farbe[i]);
      }
      lampe[0].an();
   }
 
   public void gruen() {
      schalten(1);
   }
}

Fussgaengerampel f = new Fussgaengerampel(10, 10, 100,200,new Color[] { Color.red, Color.green });
f.wirdRot();
f.wirdGruen();

public class Verkehrsampel extends Ampel {

   public Verkehrsampel(int x, int y, int b, int h, Color[] farbe) {
      super(x, y, b, h, farbe);
     
      gruen();
   }

   public void gelb() {
      schalten(1);
   }

   public void gruen() {
      schalten(2);
   }

}

Verkehrsampel v = new Verkehrsampel(10, 10, 200, 600, new Color[] { Color.red, Color.yellow, Color.green });

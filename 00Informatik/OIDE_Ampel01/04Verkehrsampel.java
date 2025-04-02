public class Verkehrsampel extends Rectangle {

   private Lampe[] lampe;

   public Verkehrsampel(int x, int y, int b, int h, Color[] farbe) {
      super(x, y, b, h);
      setFillColor(Color.darkcyan);
      this.schaltet = false;
      this.lampe = new Lampe[farbe.length];
      for (int i = 0; i < lampe.length; i++) {
         lampe[i] = new Lampe(x + b/2, y + h / 6 + i * h / 3, h / 10, farbe[i]);
      }
      lampe[0].an();
   }

   public void allesAus() {
      for (int i = 0; i < lampe.length; i++) {
         lampe[i].aus();
      }
   }	

   public void schalten(int i) {
      allesAus();
      lampe[i].an();
   }

  public void gelb() {
      schalten(1);
   }
  public void gruen() {
      schalten(2);
   }

}

Verkehrsampel v = new Verkehrsampel(10, 10, 200,600, new Color[] { Color.red, Color.yellow, Color.green });
v.rot();
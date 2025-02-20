public class Ampel extends Rectangle {
   
   private Lampe[] lampe;
   private boolean schaltet = false;
   
   public Ampel(int x, int y, int h) {
  
      super(x, y, h / 3, h);
      setFillColor(Color.darkcyan);
      lampe = new Lampe[3];
      Color[] farbe = { Color.red, Color.yellow, Color.green };
      for (int i = 0; i < lampe.length; i++) {
         lampe[i] = new Lampe(x + h / 6, y + h / 8 + i * h / 3, (h * 1) / 10, farbe[i]);
      }
      lampe[2].an();
   }

   public void allesAus() {
      for (int i = 0; i < lampe.length; i++) {
         lampe[i].aus();
      }
   }
   
   public void raufschalten() {
      this.schaltet = true;
      for (int i = lampe.length - 1; i >= 0; i--) {
         allesAus();
         lampe[i].an();
         SystemTools.pause(1000);
      }
      this.schaltet = false;
   } 

   public void runterschalten() {
      this.schaltet = true;
      for (int i = 0; i < lampe.length; i++) {
         allesAus();
         lampe[i].an();
         SystemTools.pause(1000);
      }
      this.schaltet = false;
   }
   
   public boolean isSchaltend() {
      return schaltet;
   }
}



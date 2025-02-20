public class Ampel extends Rectangle {
   
   private Lampe[] lampe;
   private boolean schaltet = false;
   
   public Ampel(int x, int y, int h, Color[] farben) {
  
      super(x, y, h / 3, h);
      setFillColor(Color.darkcyan);
      lampe = new Lampe[farben.length];
      for (int i = 0; i < lampe.length; i++) {
         lampe[i] = new Lampe(x + h / 6, y + h / 8 + i * h / 3, (h * 1) / 10, farben[i]);
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
      SystemTools.pause(1000);
   }

   public void wirdGruen() {
      this.schaltet = true;
      for (int i = lampe.length - 1; i >= 0; i--) {
         schalten(i);
      }
      this.schaltet = false;
   } 

   public void wirdRot() {
      this.schaltet = true;
      for (int i = 0; i < lampe.length; i++) {
         schalten(i);
      }
      this.schaltet = false;
   }
   
   public boolean isSchaltend() {
      return schaltet;
   }
}



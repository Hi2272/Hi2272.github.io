public abstract class Ampel extends Rectangle {
   
   protected Lampe[] lampe;
   private boolean schaltet = false;
   
   public Ampel(int x, int y, int h, int b, Color[] farbe) {
      super(x,y,h,b);
      setFillColor(Color.darkcyan);
      this.lampe = new Lampe[farbe.length];
      this.schaltet=false;
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



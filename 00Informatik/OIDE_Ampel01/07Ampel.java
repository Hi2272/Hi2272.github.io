public abstract class Ampel extends RoundedRectangle {
   
   protected Lampe[] lampe;
   
   public Ampel(int x, int y, int h, int b, Color[] farbe) {
      super(x, y, h, b, 10);
      setFillColor(Color.lightgray);
      this.lampe = new Lampe[farbe.length];
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

   public void rot() {
      schalten(0);
   }
   
}



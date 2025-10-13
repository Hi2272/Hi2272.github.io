public abstract class Ampel extends Rectangle {
   
   protected Lampe[] lampe;
   
   public Ampel(int x, int y, int h, int b, Color[] farbe) {
      super(x,y,h,b);
      setFillColor(Color.darkcyan);
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
      SystemTools.pause(1000);
   }

    public void rot() {
      schalten(0);
   }
   
   public void wirdGruen(){
      for (int i=0;i<lampe.length;i++){
         schalten(i);
      }
   }

   public void wirdRot(){
      for (int i=lampe.length-1;i>=0;i--){
         schalten(i);
      }
   }
   
}



public class Platte extends Kachel {

   private int nachbarn;
   private boolean aufgedeckt;
   
   public Platte(Spielfeld feld, int x, int y, int b, int h) {
      super(feld, x, y, b, h);
      this.nachbarn = 0;
      aufgedeckt = false; 

   }

   public void setNachbarn(int i) {
      this.nachbarn = i;
   }
   public int getNachbarn() {
      return nachbarn;
   }

    
}
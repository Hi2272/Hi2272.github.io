public abstract class Kachel extends Rectangle {
  
   protected int x, y, breite, hoehe;
   protected Spielfeld feld; 
   protected boolean markiert;

    
   public Kachel(Spielfeld feld, int x, int y, int b, int h) {
      super(x * b, y * h, b, h);
      this.x = x;
      this.y = y;
      this.breite = b;
      this.hoehe = h;
      this.feld = feld;
      this.markiert=false;
      
      setFillColor(Color.lightgray);
      setBorderColor(Color.black);
   }

   public void setNachbarn(int i) {
   }
   public int getNachbarn() {
      return 9;
   }
   public void aufdecken() {
      
   }
}
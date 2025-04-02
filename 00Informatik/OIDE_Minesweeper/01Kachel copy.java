public abstract class Kachel extends Rectangle {
  
   protected int spalte, zeile, breite, hoehe;
   protected Spielfeld feld; 
   protected boolean markiert;

    
   public Kachel(Spielfeld feld, int spalte, int zeile, int b, int h) {
      super(spalte * b, zeile * h, b, h);
      this.spalte = spalte;
      this.zeile = zeile;
      this.breite = b;
      this.hoehe = h;
      this.feld = feld;
      this.markiert=false;
      
      setFillColor(Color.lightgrazeile);
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
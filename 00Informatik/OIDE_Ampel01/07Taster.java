public class Taster extends RoundedRectangle {
   
   private Steuerung steuerung;
   
   public Taster(Steuerung steuerung, int x, int y, int breite, int hoehe) {
      super(x, y, breite, hoehe, 10);
      this.steuerung = steuerung;
      setFillColor(Color.yellow);
      setBorderColor(Color.orange);
   }

   public void onMouseDown(double x, double y, int key) {
   }
}

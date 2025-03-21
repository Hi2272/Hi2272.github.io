public class Taster extends Rectangle{
   
   private Steuerung steuerung;
   
   public Taster(int x, int y, int breite, int hoehe) {
      super(x,y,breite,hoehe);
   }

  public void onMouseDown(double x, double y, int key) {
      steuerung.schalten();
  }



}

// Die Klasse StartBtn erweitert die Klasse Btn
public class StartBtn extends Btn {

// Konstruktor der Klasse mit den Paramtern
// x,y vom Typ double
// schriftgroesse vom Typ int
// text vom Typ String  
   public StartBtn(double x, double y, int schriftgroesse, String text, Welt welt) {
      super(x, y, schriftgroesse, text, welt);
   }

// Ereignismethode onMouseDown(...)
// ruft die Methode start des Attributs welt auf
   public void onMouseDown(double x, double y, int key) {
      this.welt.start();
   }
}
// Die Klasse WuerfelBtn erweitert die Klasse Btn
public class WuerfelBtn extends Btn {
// Konstruktor der Klasse mit den Paramtern
// x,y vom Typ double
// schriftgroesse vom Typ int
// text vom Typ String  
   public WuerfelBtn(double x, double y, int schriftgroesse, String text, Welt welt) {
      super(x, y, schriftgroesse, text, welt);
   }
// Ereignismethode onMouseDown
// ruft die Methode wuerfeln des Attributs welt auf
   public void onMouseDown(double x, double y, int key) {
      this.welt.wuerfeln();
   }
// Methode setNummer mit dem Parameter 
// nr vom Typ int
// setzt den Text auf den Wert
// String.valueOf(nr) + ". x würfeln"   
   public void setNummer(int nr) {
      this.setText(String.valueOf(nr) + ". x würfeln");
   }
}
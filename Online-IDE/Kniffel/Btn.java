// Die Klasse Btn erweitert die Klasse Button
public class Btn extends Button {
// Deklaration des Attributs welt vom Typ Welt   
   protected Welt welt;
// Konstruktor der Klasse mit den Paramtern
// x,y vom Typ double
// schriftgroesse vom Typ int
// text vom Typ String  
   public Btn(double x, double y, int schriftgroesse, String text, Welt welt) {
      // Aufruf des Konstruktors der Oberklasse
      super(x, y, schriftgroesse, text);
      // Initialisierung des Attributs welt
      // mit dem Wert des Parameters
      this.welt = welt;
   }

}
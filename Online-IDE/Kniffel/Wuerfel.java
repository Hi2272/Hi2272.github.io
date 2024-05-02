public class Wuerfel extends RoundedRectangle {

   private double x, y, breite;
   private int zahl;
   private Auge linksOben, rechtsOben, linksMitte, mitteMitte, rechtsMitte, linksUnten, rechtsUnten;
   // Deklaration eines Attributs aktiv
   // vom Datentyp boolean 
   // = Wahrheitswert: true / false
   private boolean aktiv;

   public Wuerfel(double x, double y, double breite, Color farbe, Color augenFarbe) {
      super(x, y, breite, breite, breite / 10);
      this.setFillColor(farbe);
      this.setBorderColor(Color.black);
      this.setBorderWidth(breite / 30 + 1);
      this.x = x;
      this.y = y;
      this.breite = breite;
      this.linksOben = new Auge(x + breite / 5, y + breite / 5, breite / 10, augenFarbe);
      this.rechtsOben = new Auge(x + breite * 4 / 5, y + breite / 5, breite / 10, augenFarbe);
      this.linksMitte = new Auge(x + breite / 5, y + breite / 2, breite / 10, augenFarbe);
      this.mitteMitte = new Auge(x + breite / 2, y + breite / 2, breite / 10, augenFarbe);
      this.rechtsMitte = new Auge(x + breite * 4 / 5, y + breite / 2, breite / 10, augenFarbe);
      this.linksUnten = new Auge(x + breite / 5, y + breite * 4 / 5, breite / 10, augenFarbe);
      this.rechtsUnten = new Auge(x + breite * 4 / 5, y + breite * 4 / 5, breite / 10, augenFarbe);
      // Initialisierung des Attributs aktiv 
      // mit dem Wert true
      this.aktiv = true;
      // Aufruf der Methode wuerfeln();
      this.wuerfeln();
   }

// set-Methode für das Attribut aktiv
   public void setAktiv(boolean aktiv) {
      this.aktiv = aktiv;
      // Wenn nicht aktiv, dann 
      // setze den Alpha-Wert auf 0.1
      // = Aufruf der entsprechenden set-Methode
      // sonst
      // setze den Alpha-Wert auf 1.0
      if(!this.aktiv) {
         this.setAlpha(0.1);
      } else {
         this.setAlpha(1.0); ;
      }
   }
   // Methode wuerfeln()
   public void wuerfeln() {
      // wenn aktiv
      // dann setze zahl auf einen Zufallswert
      // zwischen 1 und 6
      // Random.randint(1, 6)
      // und rufe die Methode displayzahl() auf
      if(this.aktiv) {
         zahl = Random.randint(1, 6);
         this.displayzahl();
      }
   }
      
   // Ereignismethode onMouseDown(...)
   // ruft die setAktiv-Methode mit dem Parameter
   // !this.aktiv auf
   // Erklärung:
   // -> Der Wert von aktiv wird automatisch umgekehrt:
   // aktiv == true -> !aktiv = false
   // aktiv == false -> !aktiv = true
   public void onMouseDown(double x, double y, int key) {
      this.setAktiv(!this.aktiv);
   }
  
   // diese Methode werden nicht verändert.

   public void allesAus() {
      this.rechtsMitte.aus();
      this.rechtsOben.aus();
      this.rechtsUnten.aus();
      this.mitteMitte.aus();
      this.linksMitte.aus();
      this.linksOben.aus();
      this.linksUnten.aus();
   }
   public void displayzahl() {
      this.allesAus();
      if(zahl == 1 || zahl == 3 || zahl == 5) {
         mitteMitte.an();
      }
      if(zahl > 1) {
         linksOben.an();
         rechtsUnten.an();
      }
      if(zahl > 4) {
         rechtsOben.an();
         linksUnten.an();
      }
      if(zahl == 6) {
         linksMitte.an();
         rechtsMitte.an();
      }
   }

   
}

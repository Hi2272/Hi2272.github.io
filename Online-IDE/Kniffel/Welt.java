public class Welt extends World {
   // Deklariere 5 Attribute w1,w2,w3,w4,w5 der Klasse Wuerfel
   private Wuerfel w1, w2, w3, w4, w5;
   // Deklariere ein Attribut wuerfelBtn der Klasse WuerfelBtn
   private WuerfelBtn wuerfelBtn;
   // Deklariere ein Attribut startBtn der Klasse StartBtn
   private StartBtn startBtn;
   // Deklarirer ein integer Attribut spielzug
   private int spielzug;

   public Welt() {
      // Rufe der Konstruktor der Oberklasse mit den Parametern 500,200 auf.
      super(500, 200);
      // Setze die Hintergrundfarbe auf weiß
      this.setBackgroundColor(Color.white);
      // Initialisiere die Wuerfel-Attribute mit 5 Objekten,
      // die im Abstand von 100 Pixel auf der y-Koordinate 10
      // stehen, jeweils 80 Pixel breit sind.
      // Die Farbe der Würfel soll darkslateblue und 
      // die farbe der Augen gelb sein.
      this.w1 = new Wuerfel(10, 10, 80, Color.darkslateblue, Color.yellow);
      this.w2 = new Wuerfel(110, 10, 80, Color.darkslateblue, Color.yellow);
      this.w3 = new Wuerfel(210, 10, 80, Color.darkslateblue, Color.yellow);
      this.w4 = new Wuerfel(310, 10, 80, Color.darkslateblue, Color.yellow);
      this.w5 = new Wuerfel(410, 10, 80, Color.darkslateblue, Color.yellow);
      // Initialisiere den WuerfelBtn mit den Attribut-Werten
      // 210,110,30,"",this
      this.wuerfelBtn = new WuerfelBtn(210, 110, 30,"", this);
      // Initialisiere den StartBtn mit den Attribut-Werten
      // 210,110,30,"Start",this
      this.startBtn = new StartBtn(210, 110, 30, "Start", this);
      // Mache den wuerfelBtn unsichtbar
      // setVisible(false)
      this.wuerfelBtn.setVisible(false);
   }

   public void wuerfeln() {
      // rufe für alle Wuerfel-Attribute
      // die Methode wuerfeln() auf
      this.w1.wuerfeln();
      this.w2.wuerfeln();
      this.w3.wuerfeln();
      this.w4.wuerfeln();
      this.w5.wuerfeln();
      // erhöhe das Attribut spielzug um 1
      this.spielzug = this.spielzug + 1;
      // wenn spielzug kleiner 4 ist
      // dann rufe die Methode setNummer 
      // des wuerfelBtn mit dem Attribut-Wert
      // spielzug auf.
      // sonst
      // mache den wuerfelBtn unsichtbar
      // und mache den startBtn sichtbar
      if(this.spielzug < 4) {
         this.wuerfelBtn.setNummer(this.spielzug);
      } else {
         this.wuerfelBtn.setVisible(false);
         this.startBtn.setVisible(true);
      }
   }

   public void start() {
      // Setze das Attribut spielzug auf den Wert 2
      this.spielzug = 2;
      // mache den startBtn unsichtbar
      this.startBtn.setVisible(false);
      // Setze die Nummer beim wuerfelBtn auf den
      // Wert des Attributs spielzug
      this.wuerfelBtn.setNummer(this.spielzug);
      // mache den wuerfelBtn sichtbar
      this.wuerfelBtn.setVisible(true);
      // setze alle wuerfel aktiv
      this.w1.setAktiv(true);
      this.w2.setAktiv(true);
      this.w3.setAktiv(true);
      this.w4.setAktiv(true);
      this.w5.setAktiv(true);
      // rufe für alle wuerfel die Methode
      // wuerfeln auf.
      this.w1.wuerfeln();
      this.w2.wuerfeln();
      this.w3.wuerfeln();
      this.w4.wuerfeln();
      this.w5.wuerfeln();
   } 
}

// Erzeuge eines neuen Objekts der Klasse Welt
new Welt();

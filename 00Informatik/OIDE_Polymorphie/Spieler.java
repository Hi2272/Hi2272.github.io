public class Spieler extends Mitglied {
   public Spieler(int i) {
      super(i);
   }

   public void spielen() {
      println("Spieler " + String.valueOf(this.nr) + ": Toll, ich darf spielen!");
   }
}
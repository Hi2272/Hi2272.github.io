public abstract class Mitglied {

   protected int nr;

   public Mitglied(int nr) {
      this.nr = nr;
   }

   public void trainieren() {
      println("Ich bin kein Trainer!");
   }
   public void spielen() {
      println("Ich bin kein Spieler!");
   }

}
public class Verein {

   private Mitglied[] mitglieder;

   public Verein(int anz) {
      this.mitglieder = new Mitglied[anz];
      mitglieder[0] = new Trainer(0);
      for (int i = 1; i < anz; i++) {
         mitglieder[i] = new Spieler(i);
      }
   }

   public Mitglied[] getMitglieder() {
      return mitglieder;
   }

}

Verein v = new Verein(12);
v.getMitglieder()[0].trainieren();
v.getMitglieder()[1].spielen();
public class Mannschaft {

   private Mitglied[] mitglieder;

   public Mannschaft(int anz) {
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

Mannschaft m = new Mannschaft(12);
m.getMitglieder()[0].trainieren();
m.getMitglieder()[1].spielen();
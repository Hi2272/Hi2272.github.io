public class Mannschaft {

   private Mitglied[] mitglieder;

   public Mannschaft(int anz) {
      this.mitglieder = new Mitglied[anz];
      mitglieder[0] = new Trainer(0);
      mitglieder[1] = new Manager(1);
      for (int i = 2; i < anz; i++) {
         mitglieder[i] = new Spieler(i);
      }
   }

   public Mitglied[] getMitglieder() {
      return mitglieder;
   }

}

Mannschaft m = new Mannschaft(12);
m.getMitglieder()[0].trainieren();
m.getMitglieder()[1].kaufen();
m.getMitglieder()[2].spielen();

m.getMitglieder()[0].kaufen();
m.getMitglieder()[2].kaufen();

m.getMitglieder()[0].spielen();
m.getMitglieder()[1].spielen();

m.getMitglieder()[1].trainieren();
m.getMitglieder()[2].trainieren();



public class Schueler {

   private String vorname, nachname;
   private Fach[] faecher;

   public Schueler(String vorname, String nachname) {
      String[] fachNamen = { "Deutsch", "Mathematik", "Englisch", "Chemie", "Informatik" };
      String[] fachKuerzel = { "D", "M", "E", "C", "Inf" };
      int[] gewichtung = { 2, 2, 2, 1, 1 };
      this.vorname = vorname;
      this.nachname=nachname;      
      this.faecher = new Fach[fachNamen.length];
      for (int i = 0; i < fachNamen.length; i++) {
         this.faecher[i] = new Fach(fachNamen[i], fachKuerzel[i], gewichtung[i]);
      }
   }

   public void drucken() {
      println(this.vorname + " " + this.nachname);
      for (int i = 0; i < this.faecher.length; i++) {
         println(this.faecher[i].toString());
      }
   }
}

Schueler s = new Schueler("Max", "Mustermann");
s.drucken();

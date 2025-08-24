public class Schueler {

   public void drucken() {
      println(this.vorname + " " + this.nachname);
      for (int i = 0; i < this.faecher.length; i++) {
         println(this.faecher[i].toString());
      }
   }
}

Schueler s = new Schueler("Max", "Mustermann");
s.drucken();

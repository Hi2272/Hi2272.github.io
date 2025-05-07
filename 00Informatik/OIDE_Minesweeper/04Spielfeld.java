public class Spielfeld {

   private Kachel[] kachel; // Referenzen auf die Kacheln
   private int spalten, zeilen, hoehe, breite; // Größe des Spielfelds
   private int anzMinen; // Anzahl der Minen im Spielfeld

   public Spielfeld(int spalten, int zeilen, int breite, int hoehe, int anzMinen) {
      this.spalten = spalten;
      this.zeilen = zeilen;
      this.breite = breite;
      this.hoehe = hoehe;
      this.anzMinen = anzMinen;
      this.kachel = new Kachel[spalten * zeilen]; 
      for (int i = 0; i < anzMinen; i++) {
         int nr = Random.randint(0, kachel.length - 1);
         while (kachel[nr] instanceof Mine) {
            nr = Random.randint(0, kachel.length - 1);
         }
         kachel[nr] = new Mine(this, getSpalte(nr), getZeile(nr), breite, hoehe);
      }
   }

   public int getZeile(int nr) {
      return nr / spalten;
   }
   
   public int getSpalte(int nr) {
      return nr % spalten;
   }
}

Spielfeld s = new Spielfeld(5, 10, 30, 30, 10);
 
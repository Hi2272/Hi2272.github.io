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
      for (int i = 0; i < kachel.length; i++) {
         if(kachel[i] == null) {
            kachel[i] = new Platte(this, getSpalte(i), getZeile(i), breite, hoehe);
         }
      }
      for (int i = 0; i < kachel.length; i++) {
         if(kachel[i] instanceof Platte) {
            kachel[i].setNachbarn(anzNachbarn(i));
         }
      }
   }
   
   public Kachel getKachel(int nr) {
      return kachel[nr];
   }
   public Kachel getKachel(int x, int y) {
      return kachel[y * spalten + x];
   }
   public Kachel[] getKachel() {
      return kachel;
   }
   public boolean isMine(int x, int y) {
      if(isInGrid(x, y)) {
         return getKachel(x, y) instanceof Mine;
      } else {
         print("Koordinaten nicht im Gitter!");
         return false;
      }
   }

   public boolean isInGrid(int x, int y) {
      return(x >= 0 && x < spalten && y >= 0 && y < zeilen);
   }

   public int getZeile(int nr) {
      return nr / spalten;
   }
   
   public int getSpalte(int nr) {
      return nr % spalten;
   }
}
Spielfeld s = new Spielfeld(5, 10, 30, 30, 10);
 
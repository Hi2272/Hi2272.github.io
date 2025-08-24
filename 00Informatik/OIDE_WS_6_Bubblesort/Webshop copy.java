public class Webshop {

   private Artikel[] art;

   public Webshop() {
      this.art = new Artikel[10];
      for (int i = 0; i < art.length-3; i++) {
         this.art[i] = new Artikel(i, "Turnschuh", Math.round(59.95 + Math.random() * 100) + 0.95);
      }
   }

   public int getLaenge() {
      int i = 0;
      while (art[i] != null) {
         i = i + 1;
         if(i == art.length) {
            return i;
         }
      }
      return i;
   }
   
   public void printAlles() {
      for (int i = 0; i < getLaenge(); i++) {
         this.art[i].drucken();
      }
   }

  public void sortiere() {
      for (int a = getLaenge() - 1; a > 0; a--) {
         for (int i = 0; i < a; i++) {
            if(art[i + 1].getPreis() < art[i].getPreis()) {
               swap(i, i + 1);
            }
         }
      }
   }
  
   public void swap(int index1, int index2) {
      Artikel a = art[index1];
      art[index1] = art[index2];
      art[index2] = a;
   }

}

Webshop w = new Webshop();
w.printAlles();
println("--------------");
w.sortiere();
w.printAlles();
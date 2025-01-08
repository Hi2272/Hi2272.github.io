public class Webshop {

   private Artikel[] art;


   public Webshop() {
      this.art = new Artikel[10];
      for (int i = 0; i < art.length; i++) {
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


   public int getIndexOfCheapest(int start, int ende) {
      int index = 0;
      for (int i = start; i < ende; i++) {
         if(art[i].getPreis() < art[index].getPreis()) {
            index = i;
         }
      }
      return index;
   }

   public void printCheapest() {
      art[getIndexOfCheapest(0, getLaenge())].drucken();
   }

   public void swap(int index1, int index2){
      Artikel a=art[index1];
      art[index1]=art[index2];
      art[index2]=a;
   }

}

Webshop w = new Webshop();
w.printAlles();
println("--------------");
w.swap(1,2);
w.printAlles();
public class Webshop {

   private Artikel[] art;

   public Webshop() {
      
      String[] artikelName = { "Basketballstiefel", "Handballstiefel", "Bergschuhe", "Kletterschuhe", "Laufschuhe Adidas", "Laufschuhe Nike",
         "Fußballschuhe","Bergschuhe"
      };
   
      this.art = new Artikel[artikelName.length + 3];
      for (int i = 0; i < artikelName.length; i++) {
         this.art[i] = new Artikel(345 + i, artikelName[i], Math.round(59.95 + Math.random() * 100) + 0.95);
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

  
   public void swap(int index1, int index2) {
      Artikel a = art[index1];
      art[index1] = art[index2];
      art[index2] = a;
   }

}

Webshop w = new Webshop();
w.printAlles();
println("--------------");
w.tauscheNamen("Bergschuhe", "Bergschuhe Meindl");
w.printAlles();
   

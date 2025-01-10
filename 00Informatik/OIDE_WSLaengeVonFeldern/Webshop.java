public class Webshop {

   private Artikel[] art;


   public Webshop() {
      this.art = new Artikel[100];
      for (int i = 0; i < 5; i++) {
         this.art[i] = new Artikel(i, "Turnschuh", Math.round(59.95 + Math.random() * 100) + 0.95);
      }
   }

   public void printAlles() {
      for (int i = 0; i < art.length; i++) {
         this.art[i].drucken();
      }
       
   }
}

Webshop w = new Webshop();
w.printAlles();

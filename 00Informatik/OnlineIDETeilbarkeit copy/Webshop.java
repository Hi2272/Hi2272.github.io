public class Webshop {

   private Artikel[] art;

   public Webshop() {
      this.art = new Artikel[100];
      for (int i = 0; i < 5; i++) {
         this.art[i] = new Artikel(i, "Nike Turnschuh", 99.95);
      }
   }

   public int getLastIndex(){
      int i=0;
      while (art[i]!=null && i<art.length){
         i=i+1;
      }
      return i-1;
   }

   public void printAlles(){
      for (int i=0;i<getLastIndex();i++){
         art[i].drucken();
      }
   }
}

Webshop w=new Webshop();
w.printAlles();

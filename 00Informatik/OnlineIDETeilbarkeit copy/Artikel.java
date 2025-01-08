public class Artikel {

   private String name;
   private double preis;
   private int nr;

   public Artikel(int nr, String name, double preis) {
      this.preis = preis;
      this.nr = nr;
      this.name = name;
   }

   public void drucken(){
      print("Artikel-Nr.: "+this.nr+" "+this.name+" "+this.preis+" EUR");
   }
}
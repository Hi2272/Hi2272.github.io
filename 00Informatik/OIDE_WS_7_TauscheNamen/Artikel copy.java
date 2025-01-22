public class Artikel {

   private int nr;
   private String name;
   private float preis;
 
   public Artikel(int nr, String name, float preis) {
      this.nr = nr;
      this.name = name;
      this.preis = preis;
   }

   public void setName(String name) {
      this.name = name;
   }
 
   public float getPreis() {
      return preis;
   }

   public int getNr() {
      return nr;
   }

   public String getName() {
      return name;
   }
 
   public void drucken() {
      println("Nr. " + this.nr + ": " + this.name + " " + this.preis + " EUR");
   }
}
public class Bild extends World {
   
   Turtle2 t;
   
   public Bild() {
      t = new Turtle2(this);
      t.forward(100);
      t.right(90);
      t.forward(100);
      t.right(90);
      t.forward(100);
      t.right(90);
      t.forward(100);
      t.right(90);
   }
}

new Bild();
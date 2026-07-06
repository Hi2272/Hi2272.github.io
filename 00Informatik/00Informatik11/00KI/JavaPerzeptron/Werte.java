public class Werte {
   float[] x;
   boolean label;
   
   public Werte(float[] x, boolean label) {
      this.x = x;
      this.label = label;
   }
   
   public void draw() {
      Circle c = new Circle(x[0] * 200, x[1] * 200, 5);
      if(label) {
         c.setFillColor(Color.green);
      } else {
         c.setFillColor(Color.red);
      }
   }
   public float[] getX() {
      return this.x;
   }

   public boolean getLabel() {
      return this.label;
   }
}





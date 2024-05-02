public class Turtle2 extends Turtle {
   
   public Turtle2(World welt) {
      super(welt.getWidth() / 2, welt.getHeight() / 2);
      this.left(90);
      this.setBorderWidth(1);
      this.setBorderColor(Color.red);
   }
   public void right(int winkel) {
      turn(-1 * winkel);
   }
   public void left(int winkel) {
      turn(winkel);
   }
}
new Pong().main();

class Pong extends PApplet {

   double ballX = 400;
   double ballY = 300;

   double vxBall = 10;
   double vyBall = 10;


   public void setup() {
      createCanvas(800, 600);
   }

   public void draw() {
      background(0);
      
      ballX += vxBall;
      ballY += vyBall;

      if(ballX > 790) vxBall *= -1;
      if(ballY < 10 || ballY > 590) vyBall *= -1;

      if(ballX < 30 ) {
         vxBall *= -1;
      }

      
      fill("red");
      circle(ballX, ballY, 20);
   }


}
/*public class Akkustand {
   
   int ladung;
   Balken[] balken;
   Rahmen rahmen;

   public Akkustand(int ladung) {
      rahmen = new Rahmen(10, 10, 300);
      balken = new Balken[3];
      this.ladung = ladung;
      for (int i = 0; i < 3; i++) {
         balken[i] = new Balken(this.rahmen, i, Color.green);
      }
      anzeigen();
   }
   
   public void anzeigen() {
      if(ladung >= 50) {
         for (int i = 0; i < 3; i++) {
            balken[i].setColor(Color.green);
         }
      } else if(ladung >= 20) {
         balken[0].setColor(Color.white);
         balken[1].setColor(Color.yellow);
         balken[2].setColor(Color.yellow);
      } else {
         balken[0].setColor(Color.white);
         balken[1].setColor(Color.white);
         balken[2].setColor(Color.red);
         
      }

   }


   public void act() {
      anzeigen();
   }
}

new Akkustand(30);

*/

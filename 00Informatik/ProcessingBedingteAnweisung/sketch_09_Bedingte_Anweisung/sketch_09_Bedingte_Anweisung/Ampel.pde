public class Ampel extends Rechteck {
  private Lampe rot, gelb, gruen;

  public Ampel(int x, int y, int b, Farbe farbe) {
    super(x, y, b, 3*b, farbe);
    rot=new Lampe(x+b/2, y+h/5, b*3/4, new Farbe(255, 0, 0));
    gelb=new Lampe(x+b/2, y+h/2, b*3/4, new Farbe(255, 255, 0));
    gruen = new Lampe(x+b/2, y+h*4/5, b*3/4, new Farbe(0, 255, 0));
  }
  
  public void allesAus() {
    rot.aus();
    gelb.aus();
    gruen.aus();
  }

  public void rot() {
    super.show();
    allesAus();
    rot.an();
  }

  public void gelb() {
    super.show();
    allesAus();
    gelb.an();
  }

  public void gruen() {
    super.show();
    allesAus();
    gruen.an();
  }

}

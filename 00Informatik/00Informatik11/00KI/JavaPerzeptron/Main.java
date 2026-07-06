Perzeptron p = new Perzeptron(2, 1.0, 0.5);

Werte[] w = new Werte[10];

w[0] = new Werte(new float[] { 0.1, 0.1 }, true);
w[1] = new Werte(new float[] { 0.2, 0.2 }, true);
w[2] = new Werte(new float[] { 0.3, 0.3 }, true);
w[3] = new Werte(new float[] { 0.4, 0.4 }, true);
w[4] = new Werte(new float[] { 0.45, 0.45 }, true);

w[5] = new Werte(new float[] { 0.6, 0.6 }, false);
w[6] = new Werte(new float[] { 0.7, 0.7 }, false);
w[7] = new Werte(new float[] { 0.8, 0.8 }, false);
w[8] = new Werte(new float[] { 0.9, 0.9 }, false);
w[9] = new Werte(new float[] { 1.0, 1.0 }, false);

World welt = new World(300, 300);
welt.setBackgroundColor(Color.white);

for (int i = 0; i < 10; i++) {
   w[i].draw();
}

for (int i = 0; i < 7; i++) {
   p.lerne(w[i].getX(), w[i].getLabel());
   println(p);
   p.drawLine();
  
}


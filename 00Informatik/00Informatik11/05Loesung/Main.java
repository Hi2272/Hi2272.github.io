World w = new World(500, 800);
w.setBackgroundColor(Color.white);

Graph g = new Graph(7);

g.addKnoten(new Knoten("M", 100, 300));
g.addKnoten(new Knoten("MÜ", 440, 450));
g.addKnoten(new Knoten("Wkb", 290, 500));
g.addKnoten(new Knoten("RO", 110, 730));
g.addKnoten(new Knoten("LA", 300, 200));
g.addKnoten(new Knoten("N", 70, 70));
g.addKnoten(new Knoten("W",200,600));
g.drawKanten();
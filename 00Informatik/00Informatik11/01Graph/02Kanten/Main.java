
World w = new World(500, 650);
w.setBackgroundColor(Color.white);

Graph g = new Graph(5);

g.addKnoten(new Knoten("M", 100, 200));
g.addKnoten(new Knoten("MÜ", 440, 350));
g.addKnoten(new Knoten("Wkb", 270, 400));
g.addKnoten(new Knoten("RO", 150, 550));
g.addKnoten(new Knoten("LA", 300, 100));

g.drawKanten();
public class Zahlen{

    public Zahlen(){
        rechnen();
    }

    public void rechnen(){
        int zahl=Input.readInt("Geben Sie eine Zahl ein:");
        int rest=zahl%2;
        String teilbar="";
        String nichtteilbar="";
        if (rest==0){
           teilbar=teilbar+"2";
        } else {
            nichtteilbar=nichtteilbar+"2";
        }
        println(zahl+" ist teilbar durch "+teilbar);
        println(zahl+" ist nicht teilbar durch "+nichtteilbar);
        
    }


}






new Zahlen();

public class Caesar { 

   public String verschlüsseln(String s, int verschiebung) {
      String result = "";
      s = s.toUpperCase();
      for (int i = 0; i < s.length(); i++) {
         char c = s.charAt(i);
         int asc = (int)c - (int)'A';
         asc = (asc + verschiebung) % 26;
         asc = asc + (int)'A';
         c = (char)asc;
         result = result + c;
      }
      return result;
   }

   public String entschlüsseln(String s, int verschiebung) {
      String result = "";
      s = s.toUpperCase();
      for (int i = 0; i < s.length(); i++) {
         char c = s.charAt(i);
         int asc = (int)c - (int)'A';
         asc = (asc + 26 - verschiebung) % 26;
         asc = asc + (int)'A';
         c = (char)asc;
         result = result + c;
      }
      return result;
   }
} 
      



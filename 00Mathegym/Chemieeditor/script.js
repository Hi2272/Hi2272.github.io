function umwandeln(){
    
    let o1=document.getElementById("o1")
    o1.value="Entscheide um welchen Reaktionstyp es sich hierbei handelt:<br>▇ Stoff A reagiert zu Stoff B und Stoff C.<br>▇ Stoff A und Stoff B reagieren zu Stoff C.<br>▇ Stoff A und Stoff B reagieren zu Stoff C und Stoff D.<br>▇ Stoff A reagiert zu Stoff B." 
    let o2=document.getElementById("o2")
    let o3=document.getElementById("o3")
    let o4=document.getElementById("o4")
    
    
    var elem=["k1","f1","k2","f2","k3","f3","k4","f4"];
    var s=[];
    for (var i=0;i<elem.length;i++){
        s[i]=document.getElementById(elem[i]).value;
    }
    var loesung="<formel>";
    var felder="<formel>";
    var koeff="<formel>";
    var auswahl="´(slc~ ¦1¦2¦3¦4¦5¦6¦7¦8¦9¦10)_";
    loesung=loesung+s[0]; // Koeffizient
    koeff=koeff+auswahl;
    
    var s1=convert(s[1]);
    loesung=loesung+s1;  // 1. Formel
    koeff=koeff+s1;
    felder=felder+"▇";
    
    if (s[3]!=""){  // Gibt es 2. Formel?
            loesung=loesung+"+"+s[2];
            s1=convert(s[3]);
            loesung=loesung+s1;
            koeff=koeff+"+"+auswahl+s1;
            felder=felder+"+▇";

    }
    loesung=loesung+"_´(→)_";
    felder=felder+"_´(→)_";
    koeff=koeff+"_´(→)_";
    loesung=loesung+s[4]; // Koeffizient
    s1=convert(s[5]);
    loesung=loesung+s1;  // 1. Formel
    koeff=koeff+auswahl+s1;
    felder=felder+"▇";
    if (s[7]!=""){  // Gibt es 2. Formel?
        loesung=loesung+"+"+s[6];
        s1=convert(s[7]);
        loesung=loesung+s1;
        felder=felder+"+▇";
        koeff=koeff+"+"+auswahl+s1;
    
    }
 
    o2.value=felder+"</formel>";
    o3.value=koeff+"</formel>";
    o4.value=loesung+"</formel>";

}

function convert(s1) {
    s1=s1.replaceAll("-","−");

    var s = "";
    var i = 0;
    var c = s1.charAt(i);
    var cVor='';
    while (i < s1.length) { // Buchstaben + Zahlen
        c = s1.charAt(i);
        if (c=="^"){
            s=s+"^´(";
            i++;
            while (i < s1.length) {
                c = s1.charAt(i);
                s=s+c;
                i++;
            }
            s=s+")";             
        } else if (c > "0" && c < "9") { // Zahlen werden in der Regel tiefgestellt
            s = s + "↓" + c ;
            if (i<s1.length-1){
                s=s+ "¯";
            }
        } else {
            s = s + c;
        }
        i++;
    }
    return s;

}

function anzeige(title, msg, dauer, type) {
    VanillaToasts.create({
        title: title,
        text: msg,
        timeout: dauer,
        type: type,
    });
}

function copy(id){
    let loesung=id.value;
    navigator.clipboard.writeText(loesung);
    anzeige("Meldung","Die Formel wurde in die Zwischenablage kopiert.",2000,"success");
   
    }



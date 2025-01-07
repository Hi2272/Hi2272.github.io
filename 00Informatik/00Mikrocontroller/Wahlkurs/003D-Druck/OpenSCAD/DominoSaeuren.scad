formel=[
"H3PO4","H2SO4","H2SO3","HNO3","HNO2","H2CO3","HCl"
];

namen1=[ "Phos-","Schwe-","Schwef-","Salpe-","Salpe-","Koh-","Salz-"];
namen2=["phor-","fel-","lige","ter-","trige","len-",""];
namen3=["säure","säure","Säure","säure","Säure","säure","säure"];

    
groesse=7;        // Schriftgrösse
breite=70;        // Breite des Plättchens
hoehe=breite/2;   // Höhe des Plättchens
tiefe=5.4;        // Tiefe des unteren Teils
schriftTiefe=0.6; // Tiefe der Schrift 
trennlinie=0.47;  // Position der Trennlinie bei Wörtern, die mehr als 6 Buchstaben in der 1. Zeile haben

spalten=5;        // Zahl der Plättchen nebeneinander auf Druckplatte
abstand=2;          // Abstand zwischen Plättchen auf Druckplatte

druckerBreite=235;  // Breite der Druckplatte
druckerHoehe=225;   // Tiefe der Druckplatte

anzahl=len(formel)*len(formel);
zeilen=floor(anzahl/spalten)+1;

gesHoehe=zeilen*(hoehe+abstand);
gesBreite=spalten*(breite+abstand);  

scale([druckerBreite/gesBreite,druckerHoehe/gesHoehe,1]){

for (nrFormel=[0:len(formel)-1]){
    for (nrName=[0:len(namen1)-1]){
//for (nrFormel=[0:0]){
  // for (nrName=[0:0]){


        nr=nrFormel*len(formel)+nrName;
        translate([(nr%spalten)*(breite+abstand),floor(nr/spalten)*(hoehe+abstand),0]){
        cube([breite,hoehe,tiefe]);
        translate([5,hoehe/2,tiefe]){
            s=formel[nrFormel];
            for(i=[0:len(s)-1]){
                translate([i*groesse*0.85,0,0]){
                if (ord(s[i])<58&&ord(s[i])>47){
                    if (ord(s[i-1])>=58){
                        translate([0,-1*groesse/2,0]){
                            linear_extrude(schriftTiefe)    
                            text(s[i],size=groesse,halign="center",valign="center");
                        }
                    } else {
                        translate([0,groesse/2,0]){
                            linear_extrude(schriftTiefe)    
                            text(s[i],size=groesse,halign="center",valign="center");
                        }
                    }
                } else if (s[i]=="+"||s[i]=="-"){
                    translate([0,groesse/2,0]){
                        linear_extrude(schriftTiefe)
                        text(s[i],size=groesse,halign="center",valign="center");
                    }
                } else {
                    linear_extrude(schriftTiefe)
                    text(s[i],size=groesse,halign="center",valign="center");
                }
            }
            
 
        }
    }
    translate([breite-2,hoehe-2,tiefe]){
        linear_extrude(schriftTiefe)    
        text(namen1[nrName],size=groesse,halign="right",valign="top");
    }
    translate([breite-2,hoehe/2,tiefe]){
        linear_extrude(schriftTiefe)    
        text(namen2[nrName],size=groesse,halign="right",valign="center");
    }
    translate([breite-2,2,tiefe]){
        linear_extrude(schriftTiefe)    
        text(namen3[nrName],size=groesse,halign="right",valign="bottom");
    }
    
    translate([0,0,tiefe]){cube([1,hoehe,schriftTiefe]);}

    if (len(namen1[nrName])<7){
        translate([breite/2-0.5,0,tiefe]){cube([1,hoehe,schriftTiefe]);}
    }else{
        translate([breite*trennlinie-0.5,0,tiefe]){cube([1,hoehe,schriftTiefe]);}
    }
    translate([0,hoehe-1,tiefe]){cube([breite,1,schriftTiefe]);}
    translate([breite-1,0,tiefe]){cube([1,hoehe,schriftTiefe]);}
    translate([0,0,tiefe]){cube([breite,1,schriftTiefe]);}
    translate([0,hoehe-1,tiefe]){cube([breite,1,schriftTiefe]);}
    translate([0,hoehe-1,tiefe]){cube([breite,1,schriftTiefe]);}
    }
}
}

}
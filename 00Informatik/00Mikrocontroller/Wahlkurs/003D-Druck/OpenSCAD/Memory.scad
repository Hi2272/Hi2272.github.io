formel=[
"PO43-",    "SO42-","SO32-","NO3-","NO2-","CO32-","NH4+",
"H3PO4","H2SO4","H2SO3","HNO3","HNO2","H2CO3","NH3"
];

namen1=[ "Phos-","Sulfat-","Sulfit-","Nitrat-","Nitrit-","Carbo-","Ammo-",
         "Phos-",  "Schwe-",  "Schwef-","Salpe-","Salpe-","Koh-","Am-"];
namen2=["phat-","","","","","nat-","nium-",
        "phor-","fel-","flige","ter-","trige","len-","mo-"];

namen3=["Ion","Ion","Ion","Ion","Ion","Ion","Ion",
        "säure","säure","Säure","säure","Säure","säure","niak"];

    
groesse=9;    // Schriftgrösse
breite=50;        // Breite des Plättchens
hoehe=50;   // Höhe des Plättchens
linienBreite=2; // Breite der Rahmenlinien

tiefe=1.4;        // Tiefe des unteren Teils
schriftTiefe=0.6; // Tiefe der Schrift 
trennlinie=0.47;  // Position der Trennlinie bei Wörtern, die mehr als 6 Buchstaben in der 1. Zeile haben

spalten=7;        // Zahl der Plättchen nebeneinander auf Druckplatte
abstand=2;          // Abstand zwischen Plättchen auf Druckplatte

druckerBreite=235;  // Breite der Druckplatte
druckerHoehe=225;   // Tiefe der Druckplatte

anzahl=len(formel)*len(formel);
zeilen=floor(anzahl/spalten)+1;

gesHoehe=zeilen*(hoehe+abstand);
gesBreite=spalten*(breite+abstand);  

scale([druckerBreite/gesBreite,druckerBreite/gesBreite,1]){

for (nrFormel=[0:len(formel)-1]){
        nr=nrFormel;
    for (zeilen=[0:1]){
        translate([(nr%spalten)*(breite+abstand),(zeilen*2+floor(nr/spalten))*(hoehe+abstand),0]){
        cube([breite,hoehe,tiefe]);
            if (zeilen%2==0){
                translate([10,hoehe/2,tiefe]){
        
                s=formel[nrFormel];
            for(i=[0:len(s)-1])
                {
                translate([i*groesse,0,0]){
                if (ord(s[i])<58&&ord(s[i])>47){
                    if (ord(s[i-1])>=58){
                        translate([0,-1*groesse*0.7,0]){
                            linear_extrude(schriftTiefe)    
                            text(s[i],size=groesse+0.5,halign="center",valign="center");
                        }
                    } else {
                        translate([-1*groesse,groesse*0.7,0]){
                            linear_extrude(schriftTiefe)    
                            text(s[i],size=groesse,halign="center",valign="center");
                        }
                    }
                } else if (s[i]=="+"||s[i]=="-"){
                    translate([-1.3*groesse,groesse*0.6,0]){
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
       }else{
// Textkarte
           if (namen2[nr]!=""){
           
         translate([breite/2,hoehe-4,tiefe]){
        linear_extrude(schriftTiefe)    
        text(namen1[nr],size=groesse,halign="center",valign="top");
    }
    translate([breite/2,hoehe/2,tiefe]){
        linear_extrude(schriftTiefe)    
        text(namen2[nr],size=groesse,halign="center",valign="center");
    }
    translate([breite/2,4,tiefe]){
        linear_extrude(schriftTiefe)    
        text(namen3[nr],size=groesse,halign="center",valign="bottom");
    }
}else {
          
         translate([breite/2,hoehe*0.66,tiefe]){
        linear_extrude(schriftTiefe)    
        text(namen1[nr],size=groesse,halign="center",valign="center");
    }
    translate([breite/2,hoehe*0.33,tiefe]){
        linear_extrude(schriftTiefe)    
        text(namen3[nr],size=groesse,halign="center",valign="center");
    }
    
}

           
       }
// Kanten    
    translate([0,hoehe-linienBreite,tiefe]){cube([breite,linienBreite,schriftTiefe]);}
    translate([breite-linienBreite,0,tiefe]){cube([linienBreite,hoehe,schriftTiefe]);}
    translate([0,0,tiefe]){cube([linienBreite,hoehe,schriftTiefe]);}
    
    translate([0,0,tiefe]){cube([breite,linienBreite,schriftTiefe]);}
    translate([0,hoehe-linienBreite,tiefe]){cube([breite,linienBreite,schriftTiefe]);}
    translate([0,hoehe-linienBreite,tiefe]){cube([breite,linienBreite,schriftTiefe]);}
    
}
}
}
}



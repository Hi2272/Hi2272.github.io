let bsp = "<h1>Beispielcode</h1>";
bsp += "Dieser Code ist ein typischer <b>HTML</b>-Code.<br>";
bsp += "Untersuche, wie die Zeilen umgebrochen und der Text <b>fett</b> gesetzt wird.";


let ausg = document.getElementById("HTML");
let eing = document.getElementById("Code");

document.getElementById("btn").onclick = function () {
    codeToText();
}

document.getElementById("btn2").onclick = function () {
    var txt = ausg.innerHTML;
    console.log(txt);
    eing.value = txt;
}

document.getElementById("btn3").onclick = function () {
    eing.value = "";
    ausg.innerHTML = "";
}


function codeToText() {
    var txt = eing.value;
    ausg.innerHTML = txt;

}

document.getElementById("btn4").onclick = function () {
    eing.value = bsp;;
    ausg.innerHTML = "";
}


window.onload = function () {
// Versucht im gleichen Verzeichnis die Datei code.txt zu laden
    fetch('code.txt')
        .then(response => {
            if (!response.ok) {
                throw new Error('Die Datei konnte nicht geladen werden.');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('Code').value = data;
            bsp = data;
        })
        .catch(error => {
            // Keine Datei gefunden -> Code aus URL
            const url = window.location.href;
            console.log(url);
            let pos = url.indexOf("code");
            console.log(pos);
            if (pos > 0) {
                let txt = "";
                for (var i = pos + 5; i < url.length; i++) {
                    txt = txt + url.charAt(i);
                }
                console.log(txt);
                txt = txt.replaceAll("%3C", "<");
                txt = txt.replaceAll("%3E", ">");
                txt = txt.replaceAll("%20", " ");
                txt = txt.replaceAll("%27", "'");
                bsp = txt;

                document.getElementById('Code').value = txt;


                console.error('Es gab ein Problem mit dem Fetch-Vorgang:', error);
            }
        });
};







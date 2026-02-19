document.getElementById('saveButton').addEventListener('click', function() {
    const videoName = document.getElementById('videoName').value;
    const filmQuestions = document.getElementById('filmQuestions').value;

    // Daten im localStorage speichern
    const data = {
        videoName: videoName,
        filmQuestions: filmQuestions
    };

    localStorage.setItem('filmData', JSON.stringify(data));

    // HTML-Inhalt für die neue Datei erstellen
    const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Video und Textbereich</title>
<style>
    body {
        margin: 10;
        display: flex;
        height: 100vh;
    }

    #video-container {
        flex: 0 0 75%; /* Setzt die Breite auf 75% */
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: black;
    }

    #video {
        width: 100%;
        height: auto;
    }

    #text-container {
        flex: 0 0 25%; /* Setzt die Breite auf 25% */
        padding: 20px;
        overflow-y: auto;
        background-color: #f0f0f0;
        display: flex;
        align-items: flex-start;
        font-size: 1.5em; /* Schriftgröße erhöhen */
        line-height: 1.6; /* Zeilenhöhe für bessere Lesbarkeit */
    }

</style>
</head>
<body>
    <div id="video-container">
        <video id="video" controls autoplay>
            <source id="video-source" src="${videoName}.mp4" type="video/mp4">
            Ihr Browser unterstützt das Video-Tag nicht.
        </video>
    </div>
    <div id="text-container">
        <ol>
            ${filmQuestions.split('\n').map(question => `<li>${question}</li>`).join('')}
        </ol>
    </div>
</body>
</html>
    `;

    // Blob für die HTML-Datei erstellen
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Link zum Herunterladen erstellen
    const a = document.createElement('a');
    a.href = url;
    a.download = `${videoName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // URL freigeben
    URL.revokeObjectURL(url);

    alert('Die HTML-Datei wurde im Download-Ordner gespeichert.\nKopiere sie in den Ordner mit dem Video, um sie zu verwenden.');
});

document.getElementById('loadButton').addEventListener('click', function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html, .mp4'; // HTML und MP4-Dateien akzeptieren

    input.addEventListener('change', function(event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            // Wenn die Datei eine HTML-Datei ist
            if (file.type === 'text/html') {
                reader.onload = function(e) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(e.target.result, 'text/html');

                    // Den Video-Namen und die Fragen extrahieren
                    const videoName = doc.querySelector('source').getAttribute('src').replace('.mp4', '');
                    const listItems = Array.from(doc.querySelectorAll('ol li')).map(li => li.textContent).join('\n');

                    // Die Eingabefelder aktualisieren
                    document.getElementById('videoName').value = videoName;
                    document.getElementById('filmQuestions').value = listItems;
                };
                reader.readAsText(file);
            } 
            // Wenn die Datei eine MP4-Datei ist
            else if (file.type === 'video/mp4') {
                const videoName = file.name.replace('.mp4', '');
                document.getElementById('videoName').value = videoName;
                document.getElementById('filmQuestions').value = '';
            } else {
                alert('Bitte eine gültige HTML- oder MP4-Datei auswählen.');
            }
        }
    });

    input.click(); // Öffne den File-Dialog
});

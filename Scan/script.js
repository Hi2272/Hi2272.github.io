document.getElementById('fileInput').addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);



    for (const file of files) {



        const img = await loadImage(file);



        const canvas = document.createElement('canvas');



        const ctx = canvas.getContext('2d');
        // Prüfen, ob Höhe > Breite → 90° nach rechts drehen
        let rotated = false;
        if (img.height > img.width) {
            rotated = true;
            canvas.width = img.height;
            canvas.height = img.width;
            ctx.translate(canvas.width, 0);
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(img, 0, 0);
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        }

        // Bild in der Mitte teilen (vertikal)
        const halfWidth = canvas.width / 2;

        // Linke Hälfte
        const leftCanvas = document.createElement('canvas');
        leftCanvas.width = halfWidth;
        leftCanvas.height = canvas.height;
        leftCanvas.getContext('2d').drawImage(
            canvas,
            0, 0, halfWidth, canvas.height,
            0, 0, halfWidth, canvas.height
        );

        // Rechte Hälfte
        const rightCanvas = document.createElement('canvas');
        rightCanvas.width = halfWidth;
        rightCanvas.height = canvas.height;
        rightCanvas.getContext('2d').drawImage(
            canvas,
            halfWidth, 0, halfWidth, canvas.height,
            0, 0, halfWidth, canvas.height
        );

        // Blob erzeugen und zum Download anbieten
        const baseName = file.name.replace(/\.[^/.]+$/, ''); // ohne Extension
        const ext = file.type.split('/')[1] || 'png';

        // Hilfsfunktion zum Download
        const downloadBlob = (blob, name) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = name;
            a.click();
            URL.revokeObjectURL(url);
        };

        // Links Bild speichern
        leftCanvas.toBlob((blob) => {
            const newName = `0_${baseName}_l.${ext}`;
            downloadBlob(blob, newName);
        }, file.type);

        // Rechts Bild speichern
        rightCanvas.toBlob((blob) => {
            const newName = `0_${baseName}_r.${ext}`;
            downloadBlob(blob, newName);
        }, file.type);
    }

});


/**

Lädt eine File‑Objekt‑Instanz in ein HTMLImageElement.
@param {File} file
@returns {Promise<HTMLImageElement>}
*/
function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = ev.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

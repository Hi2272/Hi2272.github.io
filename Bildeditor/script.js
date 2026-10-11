(function () {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const fileInput = document.getElementById('fileInput');
  const loadBtn = document.getElementById('loadBtn');
  const saveBtn = document.getElementById('saveBtn');
  const cvBtn = document.getElementById('cvBtn');
  const ivBtn = document.getElementById('ivBtn');
  const mBtn = document.getElementById('mBtn');
  const tBtn = document.getElementById('tBtn');

  /*
   * baseCanvas enthält den tatsächlichen Bildinhalt.
   * Alle Änderungen – auch Text – werden direkt hier hineingeschrieben.
   */
  const baseCanvas = document.createElement('canvas');
  const baseCtx = baseCanvas.getContext('2d');

  let currentImage = null;
  let mode = 'none'; // 'none', 'cv', 'iv', 'm', 't'

  let selection = null;
  let isDragging = false;

  /*
   * Aktueller Text im T-Modus
   */
  let textContent = '';

  /*
   * Zustand vor Beginn der aktuellen Texteingabe.
   * Wird für Backspace benötigt.
   */
  let textEditBackup = null;

  drawCheckerboard(ctx, canvas);

  /*
   * Aktiven Button setzen
   */
  function setActiveButton(button) {
    const buttons = [
      loadBtn,
      saveBtn,
      cvBtn,
      ivBtn,
      mBtn,
      tBtn
    ];

    buttons.forEach((item) => {
      if (!item) {
        return;
      }

      item.classList.toggle(
        'active',
        item === button
      );

      if (
        item === cvBtn ||
        item === ivBtn ||
        item === mBtn ||
        item === tBtn
      ) {
        item.setAttribute(
          'aria-pressed',
          item === button ? 'true' : 'false'
        );
      }
    });

    if (button === cvBtn) {
      mode = 'cv';
      canvas.classList.add('cv-cursor');
    } else if (button === ivBtn) {
      mode = 'iv';
      canvas.classList.add('cv-cursor');
    } else if (button === mBtn) {
      mode = 'm';
      canvas.classList.add('cv-cursor');
    } else if (button === tBtn) {
      mode = 't';
      canvas.classList.add('cv-cursor');
    } else {
      mode = 'none';
      canvas.classList.remove('cv-cursor');

      selection = null;
      isDragging = false;
      textContent = '';
      textEditBackup = null;

      redraw();
    }
  }

  /*
   * Laden
   */
  loadBtn.addEventListener('click', () => {
    setActiveButton(loadBtn);
    fileInput.click();
  });

  /*
   * Speichern
   */
  saveBtn.addEventListener('click', () => {
    try {
      const link = document.createElement('a');

      link.download = 'canvas-bild.png';
      link.href = canvas.toDataURL('image/png');

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert('Speichern nicht möglich.');
    }
  });

  /*
   * CV aktivieren
   */
  cvBtn.addEventListener('click', () => {
    setActiveButton(cvBtn);
  });

  /*
   * IV aktivieren
   */
  ivBtn.addEventListener('click', () => {
    setActiveButton(ivBtn);
  });

  /*
   * M aktivieren
   */
  mBtn.addEventListener('click', () => {
    setActiveButton(mBtn);
  });

  /*
   * T aktivieren
   */
  tBtn.addEventListener('click', () => {
    setActiveButton(tBtn);
  });

  /*
   * Bild laden
   */
  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files &&
      event.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Bitte eine Bilddatei auswählen.');
      fileInput.value = '';
      return;
    }

    let imageUrl = null;

    try {
      imageUrl = URL.createObjectURL(file);

      const image = await loadImage(imageUrl);

      currentImage = image;
      selection = null;
      isDragging = false;
      textContent = '';
      textEditBackup = null;

      const maxWidth = Math.max(
        600,
        Math.min(1200, image.width)
      );

      const scale = Math.min(
        maxWidth / image.width,
        1
      );

      canvas.width = Math.round(
        image.width * scale
      );

      canvas.height = Math.round(
        image.height * scale
      );

      baseCanvas.width = canvas.width;
      baseCanvas.height = canvas.height;

      drawImageCover(
        image,
        baseCanvas,
        baseCtx
      );

      redraw();
    } catch (error) {
      console.error(error);
      alert('Bild konnte nicht geladen werden.');
    } finally {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }

      fileInput.value = '';
    }
  });

  /*
   * Mausposition in Canvas-Koordinaten umrechnen
   */
  function getMousePosition(event) {
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: Math.max(
        0,
        Math.min(
          canvas.width,
          (event.clientX - rect.left) * scaleX
        )
      ),

      y: Math.max(
        0,
        Math.min(
          canvas.height,
          (event.clientY - rect.top) * scaleY
        )
      )
    };
  }

  /*
   * Linke Maustaste:
   * Rechteck aufziehen
   */
  canvas.addEventListener('mousedown', (event) => {
    if (
      mode !== 'cv' &&
      mode !== 'iv' &&
      mode !== 'm' &&
      mode !== 't'
    ) {
      return;
    }

    if (!currentImage) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    const position = getMousePosition(event);

    /*
     * Eine neue Auswahl im T-Modus beginnt
     * eine neue Texteingabe.
     *
     * Der bisherige Text bleibt bereits als Pixel
     * im baseCanvas erhalten.
     */
    textContent = '';
    textEditBackup = null;

    selection = {
      x0: position.x,
      y0: position.y,
      x1: position.x,
      y1: position.y
    };

    isDragging = true;

    redraw();
  });

  /*
   * Rechteck während des Ziehens aktualisieren
   */
  canvas.addEventListener('mousemove', (event) => {
    if (
      mode !== 'cv' &&
      mode !== 'iv' &&
      mode !== 'm' &&
      mode !== 't'
    ) {
      return;
    }

    if (
      !isDragging ||
      !selection
    ) {
      return;
    }

    const position = getMousePosition(event);

    selection.x1 = position.x;
    selection.y1 = position.y;

    redraw();
  });

  /*
   * Auswahl beenden
   */
  window.addEventListener('mouseup', () => {
    if (!isDragging) {
      return;
    }

    isDragging = false;
    redraw();
  });

  /*
   * Rechtsklick:
   * CV: markierte Zeilen löschen
   * IV: weißen Bereich einfügen
   */
  canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();

    if (
      mode !== 'cv' &&
      mode !== 'iv'
    ) {
      return;
    }

    if (!selection || !currentImage) {
      return;
    }

    const rectangle = normalizeSelection(selection);

    if (
      rectangle.width < 1 ||
      rectangle.height < 1
    ) {
      selection = null;
      redraw();
      return;
    }

    if (mode === 'cv') {
      deleteSelectedRows(rectangle);
    }

    if (mode === 'iv') {
      insertWhiteArea(rectangle);
    }

    selection = null;
    redraw();
  });

  /*
   * Rechteck normalisieren
   */
  function normalizeSelection(currentSelection) {
    const x = Math.min(
      currentSelection.x0,
      currentSelection.x1
    );

    const y = Math.min(
      currentSelection.y0,
      currentSelection.y1
    );

    const width = Math.abs(
      currentSelection.x1 -
      currentSelection.x0
    );

    const height = Math.abs(
      currentSelection.y1 -
      currentSelection.y0
    );

    return {
      x: Math.round(x),
      y: Math.round(y),
      width: Math.round(width),
      height: Math.round(height)
    };
  }

  /*
   * CV:
   * Markierte Zeilen über die gesamte Breite löschen
   */
  function deleteSelectedRows(rectangle) {
    const oldWidth = baseCanvas.width;
    const oldHeight = baseCanvas.height;

    const startY = Math.max(
      0,
      Math.min(oldHeight, rectangle.y)
    );

    const endY = Math.max(
      startY,
      Math.min(
        oldHeight,
        rectangle.y + rectangle.height
      )
    );

    const deleteHeight = endY - startY;

    if (deleteHeight <= 0) {
      return;
    }

    const newHeight = oldHeight - deleteHeight;

    const newCanvas = document.createElement('canvas');

    newCanvas.width = oldWidth;
    newCanvas.height = newHeight;

    const newCtx = newCanvas.getContext('2d');

    /*
     * Oberen Bildbereich übernehmen
     */
    if (startY > 0) {
      const topImageData = baseCtx.getImageData(
        0,
        0,
        oldWidth,
        startY
      );

      newCtx.putImageData(
        topImageData,
        0,
        0
      );
    }

    /*
     * Unteren Bereich nach oben verschieben
     */
    const bottomHeight = oldHeight - endY;

    if (bottomHeight > 0) {
      const bottomImageData = baseCtx.getImageData(
        0,
        endY,
        oldWidth,
        bottomHeight
      );

      newCtx.putImageData(
        bottomImageData,
        0,
        startY
      );
    }

    replaceBaseCanvas(
      newCanvas,
      oldWidth,
      newHeight
    );
  }

  /*
   * IV:
   * Weißen Bereich über die gesamte Breite einfügen
   */
  function insertWhiteArea(rectangle) {
    const oldWidth = baseCanvas.width;
    const oldHeight = baseCanvas.height;

    const insertY = Math.max(
      0,
      Math.min(oldHeight, rectangle.y)
    );

    const insertHeight = Math.max(
      1,
      rectangle.height
    );

    const newHeight = oldHeight + insertHeight;

    const newCanvas = document.createElement('canvas');

    newCanvas.width = oldWidth;
    newCanvas.height = newHeight;

    const newCtx = newCanvas.getContext('2d');

    /*
     * Oberen Bildbereich übernehmen
     */
    if (insertY > 0) {
      const topImageData = baseCtx.getImageData(
        0,
        0,
        oldWidth,
        insertY
      );

      newCtx.putImageData(
        topImageData,
        0,
        0
      );
    }

    /*
     * Weißen Bereich einfügen
     */
    newCtx.fillStyle = '#ffffff';

    newCtx.fillRect(
      0,
      insertY,
      oldWidth,
      insertHeight
    );

    /*
     * Unteren Bereich nach unten verschieben
     */
    const bottomHeight = oldHeight - insertY;

    if (bottomHeight > 0) {
      const bottomImageData = baseCtx.getImageData(
        0,
        insertY,
        oldWidth,
        bottomHeight
      );

      newCtx.putImageData(
        bottomImageData,
        0,
        insertY + insertHeight
      );
    }

    replaceBaseCanvas(
      newCanvas,
      oldWidth,
      newHeight
    );
  }

  /*
   * M:
   * Rechteck samt Pixelinhalt verschieben
   */
  function moveSelectedArea(
    rectangle,
    deltaX,
    deltaY
  ) {
    const x = rectangle.x;
    const y = rectangle.y;
    const width = rectangle.width;
    const height = rectangle.height;

    if (
      width <= 0 ||
      height <= 0
    ) {
      return;
    }

    /*
     * Pixel des Rechtecks sichern
     */
    const selectedImageData = baseCtx.getImageData(
      x,
      y,
      width,
      height
    );

    /*
     * Alte Position weiß füllen
     */
    baseCtx.fillStyle = '#ffffff';

    baseCtx.fillRect(
      x,
      y,
      width,
      height
    );

    /*
     * Gesicherte Pixel an der neuen Position einsetzen
     */
    baseCtx.putImageData(
      selectedImageData,
      x + deltaX,
      y + deltaY
    );
  }

  /*
   * M:
   * Auswahlbereich weiß füllen
   */
  function eraseSelectedArea(rectangle) {
    const x = Math.max(
      0,
      Math.min(baseCanvas.width, rectangle.x)
    );

    const y = Math.max(
      0,
      Math.min(baseCanvas.height, rectangle.y)
    );

    const width = Math.max(
      0,
      Math.min(
        baseCanvas.width - x,
        rectangle.width
      )
    );

    const height = Math.max(
      0,
      Math.min(
        baseCanvas.height - y,
        rectangle.height
      )
    );

    if (
      width <= 0 ||
      height <= 0
    ) {
      return;
    }

    baseCtx.fillStyle = '#ffffff';

    baseCtx.fillRect(
      x,
      y,
      width,
      height
    );

    redraw();
  }

  /*
   * T:
   * Schriftgröße anhand der Rechteckhöhe berechnen
   */
  function calculateFontSize(targetHeight) {
    let fontSize = Math.max(
      1,
      targetHeight
    );

    baseCtx.font = `${fontSize}px sans-serif`;

    let metrics = baseCtx.measureText('Hg');

    let actualHeight =
      metrics.actualBoundingBoxAscent +
      metrics.actualBoundingBoxDescent;

    if (actualHeight <= 0) {
      return fontSize;
    }

    fontSize *= targetHeight / actualHeight;

    for (let i = 0; i < 6; i += 1) {
      baseCtx.font = `${fontSize}px sans-serif`;

      metrics = baseCtx.measureText('Hg');

      actualHeight =
        metrics.actualBoundingBoxAscent +
        metrics.actualBoundingBoxDescent;

      if (actualHeight <= 0) {
        break;
      }

      fontSize *= targetHeight / actualHeight;
    }

    return Math.max(
      1,
      Math.floor(fontSize)
    );
  }

  /*
   * T:
   * Text als echte Pixel direkt in baseCanvas schreiben
   */
  function drawTextInCanvas(rectangle) {
    if (!textContent) {
      return;
    }

    const fontSize = calculateFontSize(
      rectangle.height
    );

    baseCtx.save();

    baseCtx.fillStyle = '#000000';
    baseCtx.font = `${fontSize}px sans-serif`;
    baseCtx.textBaseline = 'alphabetic';

    const metrics = baseCtx.measureText(
      textContent
    );

    const textHeight =
      metrics.actualBoundingBoxAscent +
      metrics.actualBoundingBoxDescent;

    const baseline =
      rectangle.y +
      (rectangle.height - textHeight) / 2 +
      metrics.actualBoundingBoxAscent;

    /*
     * Keine Begrenzung auf die Rechtecksbreite.
     * Der Text darf über den Rahmen hinausreichen.
     */
    baseCtx.fillText(
      textContent,
      rectangle.x,
      baseline
    );

    baseCtx.restore();

    redraw();
  }

  /*
   * Vor der ersten Texteingabe den aktuellen Zustand sichern.
   * Dadurch kann Backspace den zuletzt eingegebenen Text
   * korrekt neu aufbauen.
   */
  function createTextEditBackup() {
    if (textEditBackup) {
      return;
    }

    textEditBackup = document.createElement('canvas');

    textEditBackup.width = baseCanvas.width;
    textEditBackup.height = baseCanvas.height;

    const backupCtx = textEditBackup.getContext('2d');

    backupCtx.drawImage(
      baseCanvas,
      0,
      0
    );
  }

  /*
   * Textfläche aus dem Backup wiederherstellen
   */
  function restoreTextEditBackup() {
    if (!textEditBackup) {
      return;
    }

    baseCtx.clearRect(
      0,
      0,
      baseCanvas.width,
      baseCanvas.height
    );

    baseCtx.drawImage(
      textEditBackup,
      0,
      0
    );
  }

  /*
   * Tastatursteuerung
   */
  document.addEventListener('keydown', (event) => {
    /*
     * T-Modus
     */
    if (
      mode === 't' &&
      selection
    ) {
      const rectangle = normalizeSelection(
        selection
      );

      if (
        rectangle.width < 1 ||
        rectangle.height < 1
      ) {
        return;
      }

      /*
       * Rücktaste
       */
      if (event.key === 'Backspace') {
        event.preventDefault();

        if (textContent.length === 0) {
          return;
        }

        textContent = textContent.slice(
          0,
          -1
        );

        restoreTextEditBackup();

        if (textContent) {
          drawTextInCanvas(rectangle);
        } else {
          redraw();
        }

        return;
      }

      /*
       * Escape verwirft die aktuelle Texteingabe
       */
      if (event.key === 'Escape') {
        event.preventDefault();

        textContent = '';
        restoreTextEditBackup();

        textEditBackup = null;

        redraw();
        return;
      }

      /*
       * Einzelne Buchstaben und Zeichen verarbeiten
       */
      if (
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        event.preventDefault();

        createTextEditBackup();

        textContent += event.key;

        /*
         * Der Text wird direkt als Pixel
         * in baseCanvas integriert.
         */
        restoreTextEditBackup();
        drawTextInCanvas(rectangle);
      }

      return;
    }

    /*
     * M-Modus
     */
    if (
      mode !== 'm' ||
      !selection
    ) {
      return;
    }

    const rectangle = normalizeSelection(
      selection
    );

    if (
      rectangle.width < 1 ||
      rectangle.height < 1
    ) {
      return;
    }

    /*
     * Entf-Taste
     */
    if (
      event.key === 'Delete' ||
      event.key === 'Del'
    ) {
      event.preventDefault();

      eraseSelectedArea(rectangle);

      selection = null;
      redraw();

      return;
    }

    let deltaX = 0;
    let deltaY = 0;

    switch (event.key) {
      case 'ArrowLeft':
        deltaX = -1;
        break;

      case 'ArrowRight':
        deltaX = 1;
        break;

      case 'ArrowUp':
        deltaY = -1;
        break;

      case 'ArrowDown':
        deltaY = 1;
        break;

      default:
        return;
    }

    event.preventDefault();

    const nextX = Math.max(
      0,
      Math.min(
        baseCanvas.width - rectangle.width,
        rectangle.x + deltaX
      )
    );

    const nextY = Math.max(
      0,
      Math.min(
        baseCanvas.height - rectangle.height,
        rectangle.y + deltaY
      )
    );

    const actualDeltaX = nextX - rectangle.x;
    const actualDeltaY = nextY - rectangle.y;

    if (
      actualDeltaX === 0 &&
      actualDeltaY === 0
    ) {
      return;
    }

    /*
     * Der Pixelinhalt – einschließlich Text –
     * wird gemeinsam mit dem Rechteck verschoben.
     */
    moveSelectedArea(
      rectangle,
      actualDeltaX,
      actualDeltaY
    );

    selection.x0 += actualDeltaX;
    selection.x1 += actualDeltaX;
    selection.y0 += actualDeltaY;
    selection.y1 += actualDeltaY;

    redraw();
  });

  /*
   * Canvas-Inhalt ersetzen und Größe aktualisieren
   */
  function replaceBaseCanvas(
    sourceCanvas,
    width,
    height
  ) {
    canvas.width = width;
    canvas.height = height;

    baseCanvas.width = width;
    baseCanvas.height = height;

    baseCtx.clearRect(
      0,
      0,
      width,
      height
    );

    baseCtx.drawImage(
      sourceCanvas,
      0,
      0
    );

    textEditBackup = null;
    textContent = '';

    redraw();
  }

  /*
   * Sichtbares Canvas neu zeichnen
   */
  function redraw() {
    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    if (
      baseCanvas.width > 0 &&
      baseCanvas.height > 0
    ) {
      ctx.drawImage(
        baseCanvas,
        0,
        0
      );
    } else {
      drawCheckerboard(ctx, canvas);
    }

    /*
     * Auswahlrahmen nur als Anzeige zeichnen.
     * Er wird nicht in die Bildpixel geschrieben.
     */
    if (selection) {
      const rectangle = normalizeSelection(
        selection
      );

      if (
        rectangle.width > 0 &&
        rectangle.height > 0
      ) {
        ctx.save();

        ctx.fillStyle = 'rgba(255, 0, 0, 0.12)';

        ctx.fillRect(
          rectangle.x,
          rectangle.y,
          rectangle.width,
          rectangle.height
        );

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);

        ctx.strokeRect(
          rectangle.x + 0.5,
          rectangle.y + 0.5,
          rectangle.width,
          rectangle.height
        );

        ctx.restore();
      }
    }
  }

  /*
   * Bild laden
   */
  function loadImage(source) {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = source;
    });
  }

  /*
   * Bild passend in das Canvas zeichnen
   */
  function drawImageCover(
    image,
    targetCanvas,
    targetContext
  ) {
    const canvasWidth = targetCanvas.width;
    const canvasHeight = targetCanvas.height;

    const scale = Math.max(
      canvasWidth / image.width,
      canvasHeight / image.height
    );

    const imageWidth = image.width * scale;
    const imageHeight = image.height * scale;

    const offsetX = (
      canvasWidth - imageWidth
    ) / 2;

    const offsetY = (
      canvasHeight - imageHeight
    ) / 2;

    targetContext.clearRect(
      0,
      0,
      canvasWidth,
      canvasHeight
    );

    targetContext.imageSmoothingEnabled = true;
    targetContext.imageSmoothingQuality = 'high';

    targetContext.drawImage(
      image,
      offsetX,
      offsetY,
      imageWidth,
      imageHeight
    );
  }

  /*
   * Karierten Hintergrund zeichnen
   */
  function drawCheckerboard(
    targetContext,
    targetCanvas
  ) {
    const tileSize = 16;

    for (
      let y = 0;
      y < targetCanvas.height;
      y += tileSize
    ) {
      for (
        let x = 0;
        x < targetCanvas.width;
        x += tileSize
      ) {
        const isDarkTile = (
          (x / tileSize + y / tileSize) % 2 === 0
        );

        targetContext.fillStyle = isDarkTile
          ? '#eeeeee'
          : '#ffffff';

        targetContext.fillRect(
          x,
          y,
          tileSize,
          tileSize
        );
      }
    }
  }
})();

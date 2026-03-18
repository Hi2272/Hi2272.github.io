/* --------------------------------------------------------------
   1.  RDKit‑Modul laden (asynchron)
   -------------------------------------------------------------- */
   let RDKit;                     // wird später das eigentliche Modul sein

   // RDKitModule() liefert ein Promise. Wir speichern das fertige Modul
   // in der globalen Variable `RDKit`, sobald es bereit ist.
   RDKitModule().then(module => {
       RDKit = module;
       console.log('✅ RDKit.js ist geladen und bereit.');
       // Optional: UI‑Feedback, dass das System bereit ist
       document.getElementById('renderBtn').disabled = false;
   }).catch(err => {
       console.error('❌ Fehler beim Laden von RDKit.js:', err);
       alert('RDKit konnte nicht geladen werden – bitte prüfen Sie die Internetverbindung.');
   });
   
   /* --------------------------------------------------------------
      2. Hilfsfunktion: SMILES → RDKit‑Molekül
      -------------------------------------------------------------- */
   function molFromSmiles(smiles) {
       try {
           // `RDKit.get_mol` wirft bei ungültigem SMILES einen Fehler
           return RDKit.get_mol(smiles);
       } catch (e) {
           console.warn('SMILES‑Parsing‑Fehler:', e);
           return null;
       }
   }
   
   /* --------------------------------------------------------------
      3. Rendering‑Funktion (SVG)
      -------------------------------------------------------------- */
   function renderMolecule(smiles) {
       const display = document.getElementById('molDisplay');
       display.innerHTML = '';               // vorherige Darstellung entfernen
   
       const mol = molFromSmiles(smiles);
       if (!mol) {
           display.textContent = '❗ Ungültiger SMILES‑Code.';
           return;
       }
   
       // 2‑D‑Koordinaten erzeugen (falls das Molekül noch keine hat)
       mol.compute2DCoords();
   
       /* ---- 3.1  Optionen für die SVG‑Ausgabe ---- */
       const drawOpts = {
           // Linien‑ und Bond‑Stil
           bondLineWidth: 2,               // Pixel‑Breite
           bondColour: '#000000',          // Farbe der Bindungen
   
           // Atom‑Beschriftung (für eine reine Halbstrukturformel kann man das abschalten)
           atomLabelFontSize: 14,          // 0 → keine Beschriftung
           atomLabelColour: '#000000',
   
           // Hintergrund des SVG (transparent = "none")
           backgroundColour: '#fafafa',
   
           // Stereochemie‑Annotationen (Wedges, Dreiecke) – optional
           // addStereoAnnotation: true,
   
           // Kekulé‑Darstellung (alternierende Einfach‑/Doppel‑Bindungen)
           // kekulize: true
       };
   
       /* ---- 3.2  SVG erzeugen ---- */
       // `get_svg_with_highlights` akzeptiert das Options‑Objekt **direkt**.
       const svg = mol.get_svg_with_highlights(drawOpts);
   
       // Ergebnis in den Container schreiben
       display.innerHTML = svg;
   
       // Speicher freigeben (WASM‑Objekte müssen manuell gelöscht werden)
       mol.delete();
   }
   
   /* --------------------------------------------------------------
      4. Event‑Handler für den Button
      -------------------------------------------------------------- */
   document.getElementById('renderBtn').addEventListener('click', () => {
       // Sicherstellen, dass RDKit bereits geladen ist
       if (!RDKit) {
           alert('RDKit wird noch geladen – bitte einen Moment warten.');
           return;
       }
   
       const smiles = document.getElementById('smilesInput').value.trim();
       if (!smiles) {
           document.getElementById('molDisplay').textContent = 'Bitte einen SMILES‑Code eingeben.';
           return;
       }
   
       renderMolecule(smiles);
   });
   
   /* --------------------------------------------------------------
      5. UI‑Initialisierung (Button zunächst deaktivieren)
      -------------------------------------------------------------- */
   document.getElementById('renderBtn').disabled = true;
   
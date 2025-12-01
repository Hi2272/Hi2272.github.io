// Load MobileNet classifier and display an image inside <div id="Bild">.
// This script works without p5.js and will show the image immediately.
let classifier;
let _imgEl = null;
let _imageLoaded = false;

document.addEventListener('DOMContentLoaded', () => {
  // Insert image and results container immediately so the image shows
  setupImageAndResults();

  // Attempt to load ml5 model (if ml5 is available)
  if (window.ml5 && ml5.imageClassifier) {
    ml5.imageClassifier('MobileNet')
      .then(c => {
        classifier = c;
        console.log('Model loaded');
        tryClassifyIfReady();
      })
      .catch(err => {
        console.error('Failed to load model', err);
        const resultsBox = document.getElementById('BildResult');
        if (resultsBox) resultsBox.textContent = 'Modell konnte nicht geladen werden.';
      });
  } else {
    console.warn('ml5.js nicht gefunden. Die Klassifikation wird übersprungen.');
    const resultsBox = document.getElementById('BildResult');
    if (resultsBox) resultsBox.textContent = 'ml5.js nicht gefunden. Klassifikation nicht möglich.';
  }
});

function setupImageAndResults() {
  const container = document.getElementById('Bild') || document.body;

  // Create results box
  let resultsBox = document.getElementById('BildResult');
  if (!resultsBox) {
    resultsBox = document.createElement('div');
    resultsBox.id = 'BildResult';
    resultsBox.style.marginTop = '0.5rem';
    resultsBox.style.fontSize = '0.95rem';
    container.appendChild(resultsBox);
  }

  // Create image element and insert it before results
  _imgEl = document.getElementById('img');
  _imgEl.src = 'bild.jpg';
  _imgEl.alt = 'geladenes Bild';
  //_imgEl.style.maxWidth = '30%';
  _imgEl.style.height = 'auto';
  container.insertBefore(_imgEl, resultsBox);

  _imgEl.addEventListener('load', () => {
    console.log('Image loaded');
    _imageLoaded = true;
    const resultsBox = document.getElementById('BildResult');
    if (resultsBox && resultsBox.textContent && resultsBox.textContent.startsWith('Warte')) {
      resultsBox.textContent = '';
    }
    tryClassifyIfReady();
  });

  _imgEl.addEventListener('error', () => {
    const resultsBox = document.getElementById('BildResult');
    if (resultsBox) resultsBox.textContent = 'Bild konnte nicht geladen werden: ' + _imgEl.src;
  });
}

function tryClassifyIfReady() {
  const resultsBox = document.getElementById('BildResult');
  if (!_imgEl) {
    if (resultsBox) resultsBox.textContent = 'Kein Bild-Element vorhanden.';
    return;
  }
  if (!_imageLoaded) {
    if (resultsBox) resultsBox.textContent = 'Warte auf Bild...';
    return;
  }
  if (!classifier) {
    if (resultsBox) resultsBox.textContent = 'Warte auf Modell...';
    return;
  }

  if (classifier && typeof classifier.classify === 'function') {
    classifier.classify(_imgEl)
      .then(results => {
        console.log('Classification results', results);
        const resultsBox = document.getElementById('BildResult');
        showResults(resultsBox, results);
      })
      .catch(err => {
        console.error('Classification error', err);
        const resultsBox = document.getElementById('BildResult');
        if (resultsBox) resultsBox.textContent = 'Fehler bei der Klassifikation.';
      });
  }
}

function showResults(container, results) {
  if (!container) return;
  if (!results || !results.length) {
    container.textContent = 'Keine Ergebnisse.';
    return;
  }
  container.innerHTML = '<strong>Ergebnisse:</strong>';
  const ul = document.createElement('ul');
  results.slice(0, 5).forEach(r => {
    const li = document.createElement('li');
    li.textContent = `${r.label} — ${(r.confidence * 100).toFixed(1)}%`;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

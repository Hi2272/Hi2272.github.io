// ------------------------------------------------------------
// Konfiguration – Pfad zu den Bilddateien
// ------------------------------------------------------------
const images = [
  'Fisch (1).jpg',
  'Fisch (2).jpg',
  'Fisch (3).jpg',
  'Fisch (4).jpg',
  'Fisch (5).jpg',
  'Fisch (6).jpg'
];
const ASSET_PATH = './assets/';

// ------------------------------------------------------------
// Initialisierung
// ------------------------------------------------------------
const stage = document.getElementById('stage');

images.forEach(src => {
  const sprite = document.createElement('div');
  sprite.className = 'sprite';

  const img = document.createElement('img');
  img.src = ASSET_PATH + src;
  img.alt = src;

  sprite.appendChild(img);
  stage.appendChild(sprite);

  // zufällige Startposition innerhalb des Stage‑Elements
  const rect = stage.getBoundingClientRect();
  const maxX = rect.width  - 150;   // 150 ≈ max‑Bildbreite
  const maxY = rect.height - 150;
  sprite.style.left = `${Math.random() * maxX}px`;
  sprite.style.top  = `${Math.random() * maxY}px`;

  enableDrag(sprite);
});

// ------------------------------------------------------------
// Drag‑&‑Drop‑Logik (Maus + Touch)
// ------------------------------------------------------------
function enableDrag(el) {
  let offsetX = 0, offsetY = 0;
  let active = false;

  // ---------- Start ----------
  const start = (e) => {
    e.preventDefault();
    active = true;
    const rect = el.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
  };

  // ---------- Move ----------
  const move = (e) => {
    if (!active) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const stageRect = stage.getBoundingClientRect();
    const spriteRect = el.getBoundingClientRect();

    let left = clientX - stageRect.left - offsetX;
    let top  = clientY - stageRect.top  - offsetY;

    // Begrenzung auf den Stage‑Bereich
    left = Math.max(0, Math.min(left, stageRect.width  - spriteRect.width));
    top  = Math.max(0, Math.min(top,  stageRect.height - spriteRect.height));

    el.style.left = `${left}px`;
    el.style.top  = `${top}px`;
  };

  // ---------- Ende ----------
  const end = () => { active = false; };

  // Maus‑Events
  el.addEventListener('mousedown', start);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);

  // Touch‑Events
  el.addEventListener('touchstart', start, {passive:false});
  window.addEventListener('touchmove', move, {passive:false});
  window.addEventListener('touchend', end);
}

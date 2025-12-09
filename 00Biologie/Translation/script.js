/* -------------------------------------------------------------
   Canvas‑Setup
------------------------------------------------------------- */
const canvas = document.getElementById('myCanvas');
const ctx    = canvas.getContext('2d');

/* -------------------------------------------------------------
   Bild‑Objekt‑Struktur
------------------------------------------------------------- */
let images      = [];               // Alle Bild‑Objekte (inkl. mRNS)
let dragTarget  = null;            // Aktuell gezogenes Bild bzw. Gruppe
let lastX = 0, lastY = 0;          // Vorherige Koordinaten (Delta‑Berechnung)
let offsetX = 0, offsetY = 0;      // Abstand Maus ↔ Bild‑Ursprung (bei Einzel‑Drag)

/* -------------------------------------------------------------
   1️⃣ Liste aller PNG‑Dateien, die geladen werden sollen
------------------------------------------------------------- */
const imageFiles = [
    'AS1.png','AS2.png','AS3.png','AS4.png','AS5.png','AS6.png',
    't1.png','t2.png','t3.png','t4.png','t5.png','t6.png',
    'mRNS.png',          // fest am unteren Rand, nicht verschiebbar
    'Ribosom.png'        // links unten, verschiebbar
];

/* -------------------------------------------------------------
   2️⃣ Laden & Platzieren
------------------------------------------------------------- */
async function initCanvas() {
    const ribosom = await loadSingleImage('Ribosom.png', false);
    ribosom.x = 0;
    ribosom.y = Math.max(0, canvas.height - ribosom.h);
    images.push(ribosom);

    const mRNS = await loadSingleImage('mRNS.png', true);
    mRNS.x = Math.max(0, Math.floor((canvas.width - mRNS.w) / 2));
    mRNS.y = Math.max(0, canvas.height - mRNS.h - ribosom.h);
    images.push(mRNS);                     // Index 0 → bleibt unten

    const otherFiles = imageFiles.filter(f => f !== 'mRNS.png' && f !== 'Ribosom.png');
    const loadPromises = otherFiles.map(name => loadSingleImage(name, false));
    await Promise.all(loadPromises);

    drawScene();
}

/* -------------------------------------------------------------
   Hilfsfunktion: ein Bild laden und sofort positionieren
------------------------------------------------------------- */
function loadSingleImage(name, fixed) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const obj = {
                img,
                w: img.width,
                h: img.height,
                type:  name.startsWith('AS') ? 'AS' :
                       name.startsWith('t')  ? 't'  :
                       name.startsWith('R') ? 'R' : 'other',
                fixed,
                group: null,
                x: 0,
                y: 0,
                nr: name[name.length-5]
            };

            if (!fixed && name !== 'Ribosom.png') {
                const maxX = Math.max(0, canvas.width - obj.w);
                const maxY = Math.max(0,
                    canvas.height - images[0].h - images[1].h - 20 - obj.h);
                obj.x = Math.floor(Math.random() * maxX);
                obj.y = Math.floor(Math.random() * maxY);
            }
            console.log(`Geladen: ${name} (${obj.nr}×${obj.h})`);
            images.push(obj);
            resolve(obj);
        };
        img.onerror = () => reject(new Error(`Laden von ${name} fehlgeschlagen`));
        img.src = name;
    });
}

/* -------------------------------------------------------------
   3️⃣ Zeichenfunktion
------------------------------------------------------------- */
function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    images.filter(i => i.fixed).forEach(o => ctx.drawImage(o.img, o.x, o.y));
    images.filter(i => !i.fixed).forEach(o => ctx.drawImage(o.img, o.x, o.y));
}

/* -------------------------------------------------------------
   4️⃣ Hit‑Test
------------------------------------------------------------- */
function hitTest(x, y) {
    for (let i = images.length - 1; i >= 0; i--) {
        const o = images[i];
        if (x >= o.x && x <= o.x + o.w && y >= o.y && y <= o.y + o.h) {
            return {obj: o, index: i};
        }
    }
    return null;
}

/* -------------------------------------------------------------
   5️⃣ Gruppierung prüfen
------------------------------------------------------------- */
function tryToGroup() {
    const tolerance = 5;

    const asImages = images.filter(i => i.type === 'AS' && !i.group && !i.fixed);
    const tImages  = images.filter(i => i.type === 't'  && !i.group && !i.fixed);

    asImages.forEach(asImg => {
        tImages.forEach(tImg => {
            const horizontalOverlap = !(asImg.x + asImg.w < tImg.x ||
                                        tImg.x + tImg.w < asImg.x);
            const verticalClose = Math.abs((asImg.y + asImg.h) - tImg.y) <= tolerance;
            const sameNr = asImg.nr === tImg.nr;

            if (horizontalOverlap && verticalClose) {
                if (sameNr) {
                    const newX = tImg.x;
                    asImg.x = newX;
                    tImg.x  = newX;
                    tImg.y = asImg.y + asImg.h + 1;

                    const grp = [asImg, tImg];
                    asImg.group = grp;
                    tImg.group  = grp;
                } else {
                    tImg.y = asImg.y + asImg.h + 10;
                }
            }
        });
    });
}

/* -------------------------------------------------------------
   6️⃣ Drag‑&‑Drop – Maus‑Events
------------------------------------------------------------- */
canvas.addEventListener('mousedown', e => {
    const {mx, my} = getMousePos(e);
    startDrag(mx, my);
});

canvas.addEventListener('mousemove', e => {
    if (!dragTarget) return;
    const {mx, my} = getMousePos(e);
    moveDrag(mx, my);
});

canvas.addEventListener('mouseup',   endDrag);
canvas.addEventListener('mouseleave', endDrag);

/* -------------------------------------------------------------
   7️⃣ Drag‑&‑Drop – Touch‑Events
------------------------------------------------------------- */
canvas.addEventListener('touchstart', e => {
    e.preventDefault();                     // verhindert Scrollen/Zoomen
    const touch = e.touches[0];
    const {mx, my} = getTouchPos(touch);
    startDrag(mx, my);
});

canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (!dragTarget) return;
    const touch = e.touches[0];
    const {mx, my} = getTouchPos(touch);
    moveDrag(mx, my);
});

canvas.addEventListener('touchend',   endDrag);
canvas.addEventListener('touchcancel', endDrag);

/* -------------------------------------------------------------
   Hilfs‑Funktionen für Drag‑Logik (gemeinsam für Maus & Touch)
------------------------------------------------------------- */
function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        mx: e.clientX - rect.left,
        my: e.clientY - rect.top
    };
}

function getTouchPos(touch) {
    const rect = canvas.getBoundingClientRect();
    return {
        mx: touch.clientX - rect.left,
        my: touch.clientY - rect.top
    };
}

function startDrag(mx, my) {
    const hit = hitTest(mx, my);
    if (!hit) return;

    const candidate = hit.obj;
    if (candidate.fixed) return;               // mRNS darf nicht gezogen werden

    dragTarget = candidate;
    lastX = mx;
    lastY = my;

    // Offset für Einzel‑Drag (damit das Bild nicht springt)
    if (!dragTarget.group) {
        offsetX = mx - dragTarget.x;
        offsetY = my - dragTarget.y;
    }

    // Bild bzw. Gruppe nach vorne bringen
    if (dragTarget.group) {
        dragTarget.group.forEach(member => {
            const idx = images.indexOf(member);
            if (idx > -1) images.splice(idx, 1);
            images.push(member);
        });
    } else {
        images.splice(hit.index, 1);
        images.push(dragTarget);
    }
}

function moveDrag(mx, my) {
    const dx = mx - lastX;
    const dy = my - lastY;
    lastX = mx;
    lastY = my;

    if (dragTarget.group) {
        dragTarget.group.forEach(member => {
            member.x += dx;
            member.y += dy;
            member.x = Math.max(0, Math.min(canvas.width  - member.w, member.x));
            member.y = Math.max(0, Math.min(canvas.height - member.h, member.y));
        });
    } else {
        // Einzel‑Bild verschieben
        dragTarget.x = mx - offsetX;
        dragTarget.x = Math.max(0, Math.min(canvas.width  - dragTarget.w, dragTarget.x));

        if (dragTarget.type !== 'R') {   // Ribosom nur horizontal
            dragTarget.y = my - offsetY;
            dragTarget.y = Math.max(0, Math.min(canvas.height - dragTarget.h, dragTarget.y));
        }
    }

    drawScene();
}

function endDrag() {
    if (!dragTarget) return;
    tryToGroup();          // evtl. neues Duplett bilden
    dragTarget = null;
}

/* -------------------------------------------------------------
   8️⃣ Doppelklick → Gruppe lösen
------------------------------------------------------------- */
canvas.addEventListener('dblclick', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hit = hitTest(mx, my);
    if (!hit) return;

    const img = hit.obj;
    if (!img.group) return;

    const members = img.group;
    members.forEach(m => m.group = null);

    const offset = 12;
    if (members.length === 2) {
        const [a, b] = members;
        a.x = Math.min(canvas.width - a.w, a.x + offset);
        a.y = Math.max(0, a.y - offset);
        b.x = Math.max(0, b.x - offset);
        b.y = Math.min(canvas.height - b.h, b.y + offset);
    } else {
        members.forEach((m, i) => {
            const angle = (i / members.length) * 2 * Math.PI;
            m.x = Math.max(0, Math.min(canvas.width - m.w,
                m.x + Math.cos(angle) * offset));
            m.y = Math.max(0, Math.min(canvas.height - m.h,
                m.y + Math.sin(angle) * offset));
        });
    }

    drawScene();
});

/* -------------------------------------------------------------
   9️⃣ Initialisierung
------------------------------------------------------------- */
window.addEventListener('load', initCanvas);



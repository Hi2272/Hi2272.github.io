const video = document.getElementById("video");
const videoFile = document.getElementById("videoFile");
const startButton = document.getElementById("startButton");
const overlay = document.getElementById("overlay");
const context = overlay.getContext("2d");
const rgbRows = document.getElementById("rgbRows");
const statusText = document.getElementById("status");


const sampleCanvas = document.createElement("canvas");
const sampleContext = sampleCanvas.getContext("2d", {
    willReadFrequently: true
});

let objectUrl = null;
let lastTableUpdate = 0;

let hasStarted = false;
let dragMode = null;
let dragStart = null;
let initialRect = null;


function getRectangle() {
    return {
        x: Math.floor(Number(document.getElementById("coordX").value) || 0),
        y: Math.floor(Number(document.getElementById("coordY").value) || 0),
        b: Math.max(1, Math.floor(Number(document.getElementById("coordW").value) || 1)),
        h: Math.max(1, Math.floor(Number(document.getElementById("coordH").value) || 1))
    };
}

function drawRectangle() {
    if (!overlay.width || !overlay.height) return;

    const { x, y, b, h } = getRectangle();
    context.clearRect(0, 0, overlay.width, overlay.height);
    context.strokeStyle = "#ff3030";
    context.lineWidth = Math.max(2, overlay.width / 500);
    context.strokeRect(x, y, b, h);

    // Ziehpunkt zum Ändern der Rechteckgröße
    const handleSize = Math.max(8, overlay.width / 160);
    context.fillStyle = "#ff3030";
    context.fillRect(
        x + b - handleSize / 2,
        y + h - handleSize / 2,
        handleSize,
        handleSize
    );
}

function updateRgbTable() {
    if (video.readyState < 2 || !video.videoWidth || !video.videoHeight) return;

    const { x, y, b, h } = getRectangle();
    const left = Math.max(0, x);
    const top = Math.max(0, y);
    const right = Math.min(video.videoWidth, x + b);
    const bottom = Math.min(video.videoHeight, y + h);

    if (right <= left || bottom <= top) return;

    const width = right - left;
    const height = bottom - top;

    sampleCanvas.width = width;
    sampleCanvas.height = height;
    sampleContext.drawImage(video, left, top, width, height, 0, 0, width, height);

    const pixels = sampleContext.getImageData(0, 0, width, height).data;
    let red = 0;
    let green = 0;
    let blue = 0;
    const pixelCount = width * height;

    for (let i = 0; i < pixels.length; i += 4) {
        red += pixels[i];
        green += pixels[i + 1];
        blue += pixels[i + 2];
    }

    const timestamp = Math.round(video.currentTime * 1000);
    const row = document.createElement("tr");

    row.innerHTML = `
    <td>${timestamp}</td>
    <td>${Math.round(red / pixelCount)}</td>
    <td>${Math.round(green / pixelCount)}</td>
    <td>${Math.round(blue / pixelCount)}</td>
  `;

    const placeholder = rgbRows.querySelector("td[colspan]");
    if (placeholder) rgbRows.innerHTML = "";

    rgbRows.appendChild(row);
}

function renderFrame(timestamp) {
    drawRectangle();

    if (timestamp - lastTableUpdate >= getSampleInterval()) {

        try {
            updateRgbTable();
        } catch (error) {
            statusText.textContent = "Die RGB-Werte konnten nicht ausgelesen werden.";
            console.error(error);
        }
        lastTableUpdate = timestamp;
    }

    if (!video.paused && !video.ended) {
        requestAnimationFrame(renderFrame);
    }
}

videoFile.addEventListener("change", () => {
    rgbRows.innerHTML = "";

    const file = videoFile.files[0];
    if (!file) return;

    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;
    video.load();

    rgbRows.innerHTML = '<tr><td colspan="5">Video wird geladen …</td></tr>';
    statusText.textContent = `Geladen: ${file.name}`;
});

video.addEventListener("loadedmetadata", () => {
    overlay.width = video.videoWidth;
    overlay.height = video.videoHeight;
    sampleCanvas.width = video.videoWidth;
    sampleCanvas.height = video.videoHeight;
    drawRectangle();
});

startButton.addEventListener("click", async () => {
    if (!video.src) {
        statusText.textContent = "Bitte zuerst eine Videodatei laden.";
        return;
    }

    try {
        overlay.style.cursor = "default";
        await video.play();
        statusText.textContent = "Video wird abgespielt.";
        requestAnimationFrame(renderFrame);

    } catch (error) {
        statusText.textContent = "Das Video konnte nicht gestartet werden.";
        console.error(error);
    }
});

["coordX", "coordY", "coordW", "coordH"].forEach((id) => {
    document.getElementById(id).addEventListener("input", drawRectangle);
});

video.addEventListener("ended", () => {
    statusText.textContent = "Video beendet.";
});

function pointerPosition(event) {
    const bounds = overlay.getBoundingClientRect();

    return {
        x: (event.clientX - bounds.left) * (overlay.width / bounds.width),
        y: (event.clientY - bounds.top) * (overlay.height / bounds.height)
    };
}

overlay.addEventListener("pointerdown", (event) => {
    if ((!video.paused && !video.ended) || !video.videoWidth) return;

    event.preventDefault();
    overlay.setPointerCapture(event.pointerId);

    const point = pointerPosition(event);
    const rect = getRectangle();
    const handleSize = Math.max(12, overlay.width / 100);
    const nearHandle =
        Math.abs(point.x - (rect.x + rect.b)) <= handleSize &&
        Math.abs(point.y - (rect.y + rect.h)) <= handleSize;

    const insideRect =
        point.x >= rect.x &&
        point.x <= rect.x + rect.b &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.h;

    dragMode = nearHandle ? "resize" : insideRect ? "move" : "draw";
    dragStart = point;
    initialRect = rect;

    if (dragMode === "draw") {
        initialRect = { x: point.x, y: point.y, b: 1, h: 1 };
        setRectangle(initialRect);
    }
});

overlay.addEventListener("pointermove", (event) => {
    if (!dragMode || (!video.paused && !video.ended)) return;

    const point = pointerPosition(event);
    const dx = point.x - dragStart.x;
    const dy = point.y - dragStart.y;

    if (dragMode === "move") {
        setRectangle({
            ...initialRect,
            x: initialRect.x + dx,
            y: initialRect.y + dy
        });
    } else if (dragMode === "resize") {
        setRectangle({
            ...initialRect,
            b: Math.max(1, initialRect.b + dx),
            h: Math.max(1, initialRect.h + dy)
        });
    } else {
        setRectangle({
            x: Math.min(dragStart.x, point.x),
            y: Math.min(dragStart.y, point.y),
            b: Math.max(1, Math.abs(dx)),
            h: Math.max(1, Math.abs(dy))
        });
    }
});

function stopDragging() {
    dragMode = null;
    dragStart = null;
    initialRect = null;
}

overlay.addEventListener("pointerup", stopDragging);
overlay.addEventListener("pointercancel", stopDragging);

function setRectangle(rect) {
    document.getElementById("coordX").value = Math.round(rect.x);
    document.getElementById("coordY").value = Math.round(rect.y);
    document.getElementById("coordW").value = Math.round(rect.b);
    document.getElementById("coordH").value = Math.round(rect.h);
    drawRectangle();
}

function getSampleInterval() {
    const value = Number(document.getElementById("sampleInterval").value);
    return Number.isFinite(value) && value >= 1 ? value : 500;
}

function getTableText() {
  const table = document.querySelector(".results table");

  return Array.from(table.querySelectorAll("tr"))
    .filter((row) => !row.querySelector("[colspan]"))
    .map((row) =>
      Array.from(row.querySelectorAll("th, td"))
        .map((cell) => cell.innerText.trim())
        .join("\t")
    )
    .join("\n");
}

function clearTable() {
  rgbRows.innerHTML = '<tr><td colspan="4">Noch keine Werte vorhanden.</td></tr>';
}

async function copyTableContent() {
  const text = getTableText();

  if (!text) {
    statusText.textContent = "Die Tabelle enthält keine Messwerte zum Kopieren.";
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
 //   statusText.textContent = "Tabelleninhalt in die Zwischenablage kopiert.";
    return true;
  } catch (error) {
    statusText.textContent = "Kopieren nicht möglich. Bitte die Browser-Berechtigung prüfen.";
    return false;
  }
}

document.getElementById("copyButton").addEventListener("click", () => {
  copyTableContent();
  showToast("Tabelleninhalt kopiert.");

});

document.getElementById("cutButton").addEventListener("click", async () => {
  if (await copyTableContent()) {
    clearTable();
    showToast("Tabelleninhalt kopiert.");
}
});

document.getElementById("clearButton").addEventListener("click", () => {
  clearTable();
   showToast("Tabelleninhalt gelöscht.");
});

let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

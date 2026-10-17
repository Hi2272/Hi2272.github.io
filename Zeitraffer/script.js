const cameraSelect = document.querySelector("#cameraSelect");
const fpsInput = document.querySelector("#fpsInput");
const durationInput = document.querySelector("#durationInput");
const timestampInput = document.querySelector("#timestampInput");
const recordButton = document.querySelector("#recordButton");
const preview = document.querySelector("#preview");
const previewMessage = document.querySelector("#previewMessage");
const statusText = document.querySelector("#status");
const progress = document.querySelector("#progress");
const downloadLink = document.querySelector("#downloadLink");

let cameraStream = null;
let frames = [];
let recording = false;
let processing = false;
let captureTimer = null;
let progressTimer = null;
let captureInProgress = false;
let pendingCapture = Promise.resolve();
let recordingStartedAt = 0;
let recordingDurationMs = 0;
let outputUrl = null;

async function refreshCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device) => device.kind === "videoinput");
        const previousValue = cameraSelect.value;

        cameraSelect.replaceChildren();

        if (cameras.length === 0) {
            cameraSelect.add(new Option("Keine Kamera gefunden", ""));
            statusText.textContent = "Keine Kamera gefunden. Prüfe die Verbindung und Berechtigungen.";
            return;
        }

        cameras.forEach((camera, index) => {
            const label = camera.label || `Kamera ${index + 1}`;
            cameraSelect.add(new Option(label, camera.deviceId));
        });

        if (cameras.some((camera) => camera.deviceId === previousValue)) {
            cameraSelect.value = previousValue;
        }
    } catch (error) {
        cameraSelect.replaceChildren(new Option("Kamera konnte nicht gesucht werden", ""));
        statusText.textContent = "Kameraliste konnte nicht geladen werden.";
    }
}

async function openSelectedCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Dieser Browser unterstützt keinen Kamerazugriff.");
    }

    if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        cameraStream = null;
    }

    const selectedId = cameraSelect.value;
    const videoConstraint = selectedId
        ? { deviceId: { exact: selectedId } }
        : true;

    cameraStream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraint,
        audio: false
    });

    preview.srcObject = cameraStream;
    await preview.play();
    previewMessage.hidden = true;
    await refreshCameras();
}

function captureFrame() {
    return new Promise((resolve, reject) => {
        if (preview.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
            reject(new Error("Die Kamera ist noch nicht bereit."));
            return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = preview.videoWidth;
        canvas.height = preview.videoHeight;

        const context = canvas.getContext("2d");
        context.drawImage(preview, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Ein Kamerabild konnte nicht gespeichert werden."));
                return;
            }

            frames.push({
                blob,
                elapsedMs: Date.now() - recordingStartedAt
            });
            resolve();
        }, "image/jpeg", 0.92);
    });
}

function updateProgress() {
    const elapsed = Date.now() - recordingStartedAt;
    const percent = Math.min(100, (elapsed / recordingDurationMs) * 100);
    progress.value = percent;

    const elapsedSeconds = Math.floor(elapsed / 1000);
    const totalSeconds = Math.ceil(recordingDurationMs / 1000);
    statusText.textContent = `Aufnahme läuft: ${elapsedSeconds} / ${totalSeconds} Sekunden · ${frames.length} Bilder`;
}

async function startRecording() {
    const fps = Number(fpsInput.value);
    const durationSeconds = Number(durationInput.value);

    if (!Number.isFinite(fps) || fps <= 0 || fps > 30) {
        statusText.textContent = "Bitte gib eine Bildrate größer als 0 und höchstens 30 Bilder pro Sekunde ein.";
        return;
    }

    if (!Number.isFinite(durationSeconds) || durationSeconds < 1 || durationSeconds > 3600) {
        statusText.textContent = "Bitte gib eine Aufnahmelänge zwischen 1 und 3600 Sekunden ein.";
        return;
    }

    recordButton.disabled = true;
    statusText.textContent = "Kamera wird geöffnet …";

    try {
        if (!cameraStream || !cameraStream.active) {
            await openSelectedCamera();
        }

        if (preview.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
            await new Promise((resolve) => {
                preview.addEventListener("loadeddata", resolve, { once: true });
            });
        }

        frames = [];
        recordingDurationMs = durationSeconds * 1000;
        recordingStartedAt = Date.now();
        recording = true;
        processing = false;
        captureInProgress = false;
        progress.hidden = false;
        progress.value = 0;
        downloadLink.hidden = true;

        if (outputUrl) {
            URL.revokeObjectURL(outputUrl);
            outputUrl = null;
        }

        recordButton.textContent = "Stop";
        recordButton.disabled = false;

        pendingCapture = captureFrame();
        await pendingCapture;

        const intervalMs = 1000 / fps;
        captureTimer = window.setInterval(() => {
            if (!recording || captureInProgress) return;

            captureInProgress = true;
            pendingCapture = captureFrame()
                .catch((error) => {
                    statusText.textContent = error.message;
                    void finishRecording();
                })
                .finally(() => {
                    captureInProgress = false;
                });
        }, intervalMs);

        progressTimer = window.setInterval(updateProgress, 200);

        window.setTimeout(() => {
            if (recording) void finishRecording();
        }, recordingDurationMs);

        updateProgress();
    } catch (error) {
        recording = false;
        recordButton.disabled = false;
        recordButton.textContent = "Start";
        statusText.textContent = `Kamera konnte nicht gestartet werden: ${error.message}`;
    }
}

function formatTimestamp(elapsedMs) {
  return `${Math.round(elapsedMs)} ms`;
}


function sleep(milliseconds) {
    return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function createTimelapse() {
  if (frames.length === 0) {
    throw new Error("Es wurden keine Bilder aufgenommen.");
  }

  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) {
    throw new Error("Dieser Browser kann kein WebM-Video aus den Bildern erstellen.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = preview.videoWidth || 1280;
  canvas.height = preview.videoHeight || 720;

  const context = canvas.getContext("2d");
  const stream = canvas.captureStream(30);
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";

  const recorder = new MediaRecorder(stream, { mimeType });
  const videoParts = [];

  recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) videoParts.push(event.data);
  });

  const stopped = new Promise((resolve, reject) => {
    recorder.addEventListener("stop", resolve, { once: true });
    recorder.addEventListener(
      "error",
      () => reject(new Error("WebM-Video konnte nicht erstellt werden.")),
      { once: true }
    );
  });

  try {
    recorder.start();
    await sleep(150);

    for (const frame of frames) {
      const image = await createImageBitmap(frame.blob);

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      image.close();

      if (timestampInput.checked) {
        const text = formatTimestamp(frame.elapsedMs);
        const fontSize = Math.max(18, Math.round(canvas.width * 0.025));
        const padding = Math.round(fontSize * 0.55);

        context.font = `bold ${fontSize}px sans-serif`;
        const textWidth = context.measureText(text).width;
        const boxHeight = fontSize + padding;

        context.fillStyle = "rgba(0, 0, 0, 0.65)";
        context.fillRect(
          padding,
          canvas.height - boxHeight - padding,
          textWidth + padding * 2,
          boxHeight
        );

        context.fillStyle = "#ffffff";
        context.textBaseline = "middle";
        context.fillText(
          text,
          padding * 2,
          canvas.height - padding - fontSize / 2
        );
      }

      await sleep(1000 / 30);
    }

    await sleep(150);
    recorder.stop();
    await stopped;

    return new Blob(videoParts, { type: "video/webm" });
  } finally {
    if (recorder.state !== "inactive") recorder.stop();
    stream.getTracks().forEach((track) => track.stop());
  }
}


async function finishRecording() {
    if (!recording || processing) return;

    recording = false;
    processing = true;
    window.clearInterval(captureTimer);
    window.clearInterval(progressTimer);

    recordButton.disabled = true;
    recordButton.textContent = "Video wird erstellt …";
    statusText.textContent = "Aufnahme beendet. Das Zeitraffervideo wird erstellt …";

    try {
        if (captureInProgress) await pendingCapture;
        const videoBlob = await createTimelapse();

        outputUrl = URL.createObjectURL(videoBlob);
        downloadLink.href = outputUrl;
        downloadLink.download = `zeitraffer-${new Date().toISOString().replaceAll(":", "-")}.webm`;
        downloadLink.hidden = false;
        progress.value = 100;
        statusText.textContent = `Fertig: ${frames.length} Bilder wurden zum Zeitraffervideo zusammengesetzt.`;
    } catch (error) {
        statusText.textContent = `Fehler beim Erstellen des Videos: ${error.message}`;
    } finally {
        processing = false;
        recordButton.disabled = false;
        recordButton.textContent = "Start";
    }
}

recordButton.addEventListener("click", () => {
    if (recording) {
        void finishRecording();
    } else if (!processing) {
        void startRecording();
    }
});

cameraSelect.addEventListener("change", async () => {
    if (!cameraStream) return;

    try {
        await openSelectedCamera();
        statusText.textContent = "Kamera gewechselt. Du kannst die Aufnahme starten.";
    } catch (error) {
        statusText.textContent = `Kamera konnte nicht gewechselt werden: ${error.message}`;
    }
});

if (navigator.mediaDevices?.addEventListener) {
    navigator.mediaDevices.addEventListener("devicechange", refreshCameras);
}

refreshCameras();

// app.js

let selectedFile = null;

const fileInput = document.getElementById("file-input");
const preview = document.getElementById("preview");
const previewWrap = document.getElementById("preview-wrap");
const previewMeta = document.getElementById("preview-meta");
const analyzeBtn = document.getElementById("analyze-btn");

fileInput.addEventListener("change", function () {

    selectedFile = this.files[0];

    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        preview.src = e.target.result;

        previewWrap.style.display = "block";

        previewMeta.innerHTML =
            `${selectedFile.name} • ${(selectedFile.size / 1024).toFixed(2)} KB`;

        analyzeBtn.disabled = false;
    };

    reader.readAsDataURL(selectedFile);
});

async function runAnalysis() {

    if (!selectedFile) {
        alert("Please select an image first.");
        return;
    }

    show("loading-section");
    hide("upload-section");
    hide("result-section");
    hide("error-section");

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {

        const response = await fetch("/analyze", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Server Error");
        }

        const result = await response.json();

        renderResult(result);

        hide("loading-section");
        show("result-section");

    } catch (error) {

        hide("loading-section");
        show("error-section");
        show("upload-section");

        document.getElementById("error-msg").textContent =
            error.message;
    }
}

function renderResult(result) {

    document.getElementById("direction-badge").innerText =
        result.direction;

    document.getElementById("verdict-title").innerText =
        result.summary;

    document.getElementById("verdict-conf").innerText =
        `Confidence: ${result.confidence}%`;

    document.getElementById("conf-bar").style.width =
        result.confidence + "%";

    const grid =
        document.getElementById("signals-grid");

    grid.innerHTML = "";

    result.signals.forEach(signal => {

        const card = document.createElement("div");

        card.className = "signal-card";

        card.innerHTML = `
            <h3>${signal.label}</h3>
            <p>${signal.value}</p>
            <small>${signal.note}</small>
        `;

        grid.appendChild(card);
    });

    document.getElementById("analysis-text").innerText =
        result.analysis;
}

function resetTool() {

    selectedFile = null;

    fileInput.value = "";

    preview.src = "";

    previewWrap.style.display = "none";

    analyzeBtn.disabled = true;

    show("upload-section");

    hide("loading-section");
    hide("result-section");
    hide("error-section");
}

function show(id) {
    document.getElementById(id).style.display = "block";
}

function hide(id) {
    document.getElementById(id).style.display = "none";
}
from flask import Flask
from flask import render_template
from flask import request
from flask import jsonify
from services.ocr import extract_text
from services.analyzer import analyze_text
import os

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():

    if "image" not in request.files:

        return jsonify({
            "error": "No image uploaded"
        }), 400

    image = request.files["image"]

    image_path = os.path.join(
        UPLOAD_FOLDER,
        image.filename
    )

    image.save(image_path)

    # OCR
    text = extract_text(image_path)

    # Analysis
    result = analyze_text(text)

    return jsonify(result)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
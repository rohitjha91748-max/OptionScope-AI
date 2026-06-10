def analyze_text(text):

    return {
        "direction": "Neutral",
        "confidence": 50,
        "summary": "OCR Extraction Complete",

        "signals": [
            {
                "label": "OCR",
                "value": str(len(text)),
                "note": "Detected text items"
            }
        ],

        "analysis": "\n".join(text[:30])
    }
def extract_text(image_path):
    return ["OCR disabled for deployment test"]

def extract_text(image_path):

    result = reader.readtext(image_path)

    text = []

    for item in result:
        text.append(item[1])

    return text
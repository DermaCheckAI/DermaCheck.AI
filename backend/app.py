from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image

app = Flask(__name__)
CORS(app)  # allow requests from frontend

# Define classes with symptoms and advice
classes_info = {
    "Acne": {
        "symptoms": "Whiteheads, blackheads, pimples on skin",
        "advice": "Cleanse daily, avoid touching face, use acne treatment products"
    },
    "Atopic Dermatitis": {
        "symptoms": "Itchy, red patches on skin",
        "advice": "Apply moisturizer and consult dermatologist if persists"
    },
    "Benign Tumor": {
        "symptoms": "Small, painless lumps under the skin",
        "advice": "Monitor growth and consult a doctor if changes occur"
    },
    "Fungal Infection": {
        "symptoms": "Red, itchy, scaly patches on skin",
        "advice": "Keep area dry, use antifungal creams as advised by doctor"
    },
    "Skin Cancer": {
        "symptoms": "Unusual moles, sores that don’t heal, color changes",
        "advice": "See a dermatologist immediately for evaluation"
    }
}

# load model
model = tf.keras.models.load_model(
    r"C:\Users\kisan\DermaCheck.AI\backend\efficientnet_v3.keras",
    compile=False
)

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    # convert to PIL Image
    img = Image.open(file).convert("RGB")
    img = img.resize((224, 224))

    # preprocess
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # predict
    predictions = model.predict(img_array)
    predicted_class = list(classes_info.keys())[np.argmax(predictions)]
    confidence = float(np.max(predictions) * 100)

    # fetch symptoms and advice
    info = classes_info[predicted_class]

    return jsonify({
        "prediction": predicted_class,
        "confidence": round(confidence, 2),
        "symptoms": info["symptoms"],
        "advice": info["advice"]
    })

if __name__ == "__main__":
    app.run(debug=True)
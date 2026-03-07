from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image
import io
from flask import render_template

app = Flask(__name__)

model = tf.keras.models.load_model("efficientnet_v3.keras")

CLASS_NAMES = [
    "Acne",
    "Atopic Dermatitis",
    "Benign_tumors",
    "Fungal Infection",
    "Skin Cancer"
]

IMG_SIZE = 224

@app.route("/test")
def test_page():
    return render_template("test.html")
    
def preprocess_image(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((IMG_SIZE, IMG_SIZE))
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img

@app.route("/")
def home():
    return "Model loaded successfully!"

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]
    image_bytes = image_file.read()

    img = preprocess_image(image_bytes)
    preds = model.predict(img)

    predicted_index = int(np.argmax(preds))
    confidence = float(np.max(preds))

    return jsonify({
        "prediction": CLASS_NAMES[predicted_index],
        "confidence": confidence
    })

@app.route("/predict-test", methods=["GET"])
def predict_test():
    return "POST endpoint is alive"

if __name__ == "__main__":
    app.run(debug=True)
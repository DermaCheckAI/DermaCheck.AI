from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from PIL import Image
import io

app = Flask(__name__)
CORS(app)  # allow requests from frontend

classes = [
    "Acne",
    "Atopic Dermatitis",
    "Benign Tumor",
    "Fungal Infection",
    "Skin Cancer"
]

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
    predicted_class = classes[np.argmax(predictions)]
    confidence = float(np.max(predictions) * 100)

    return jsonify({
        "prediction": predicted_class,
        "confidence": round(confidence, 2)
    })

if __name__ == "__main__":
    app.run(debug=True)
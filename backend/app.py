import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

# Classes for prediction
CLASSES = [
    "Acne",
    "Atopic Dermatitis",
    "Benign Tumor",
    "Fungal Infection",
    "Skin Cancer"
]

# Path to exported model
MODEL_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\skin_model_export"

# Load the model
try:
    model = tf.saved_model.load(MODEL_PATH)
    infer = model.signatures["serving_default"]
    print("✅ Model loaded successfully")
except Exception as e:
    print("❌ Model loading failed:", e)


@app.route("/predict", methods=["POST"])
def predict():

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    try:
        # Open image
        img = Image.open(file).convert("RGB")

        # Resize for EfficientNetB3
        img = img.resize((300, 300))

        # Convert to numpy
        img_array = np.array(img).astype("float32")

        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)

        # EfficientNet preprocessing
        img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)

        # Convert to tensor
        input_tensor = tf.convert_to_tensor(img_array)

        # Run inference
        preds = infer(input_tensor)

        # Get prediction tensor
        preds = list(preds.values())[0].numpy()

        print("Raw prediction:", preds[0])

        # Get class index
        idx = np.argmax(preds[0])

        prediction = CLASSES[idx]
        confidence = float(preds[0][idx]) * 100

        return jsonify({
            "prediction": prediction,
            "confidence": round(confidence, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)

# --- UPDATE THIS LINE ---
# This allows your specific Vercel frontend to access this API.
# Replace the URL with your actual Vercel project URL.


CORS(app, resources={r"/*": {"origins": "https://derma-check-ai-nine.vercel.app"}})


@app.route("/")
def home():
    return "DermaCheck AI is live!"

# Classes for prediction
CLASSES = [
    "Acne",
    "Atopic Dermatitis",
    "Benign Tumor",
    "Fungal Infection",
    "Skin Cancer"
]

# Symptoms and Advice Data
DISEASE_DETAILS = {
    "Acne": {
        "symptoms": "Red bumps (pimples), whiteheads, blackheads, and painful cysts typically on the face, back, or shoulders.",
        "advice": "Keep skin clean, avoid popping pimples, and use non-comedogenic products. Consult a dermatologist for persistent cases."
    },
    "Atopic Dermatitis": {
        "symptoms": "Dry, itchy skin, red to brownish-gray patches, and small raised bumps that may leak fluid when scratched.",
        "advice": "Moisturize frequently, avoid harsh soaps, and identify triggers like allergens or stress. Topical steroids may be needed."
    },
    "Benign Tumor": {
        "symptoms": "Non-cancerous growths like moles or seborrheic keratosis. Usually have smooth borders and slow growth.",
        "advice": "Generally harmless, but monitor for changes in size, shape, or color. If it becomes irritated, see a professional."
    },
    "Fungal Infection": {
        "symptoms": "Red, itchy, scaly patches often in a ring shape (ringworm). May cause peeling or cracking of the skin.",
        "advice": "Keep the area dry and clean. Use over-the-counter antifungal creams. Do not share towels or personal items."
    },
    "Skin Cancer": {
        "symptoms": "Irregularly shaped moles, sores that don't heal, or new growths that change rapidly in color or size.",
        "advice": "CRITICAL: Please consult an oncologist or dermatologist immediately for a professional biopsy and screening."
    }
}

# Path to exported model
MODEL_PATH = "skin_model_export"

# Load the model
try:
    model = tf.saved_model.load(MODEL_PATH)
    infer = model.signatures["serving_default"]
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Model loading failed: {e}")


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
        preds_list = list(preds.values())[0].numpy()

        # Get class index
        idx = np.argmax(preds_list[0])

        prediction = CLASSES[idx]
        confidence = float(preds_list[0][idx]) * 100

        # Fetch symptoms and advice
        details = DISEASE_DETAILS.get(prediction, {
            "symptoms": "Details not found.",
            "advice": "Consult a professional."
        })

        return jsonify({
            "prediction": prediction,
            "confidence": round(confidence, 2),
            "symptoms": details["symptoms"],
            "advice": details["advice"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    # Render uses the PORT environment variable
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
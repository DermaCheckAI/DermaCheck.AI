from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image

# Initialize Flask
app = Flask(__name__)
CORS(app)

# Class names in the SAME order used during training
CLASS_NAMES = [
    "Acne",
    "Atopic Dermatitis",
    "Benign Tumor",
    "Fungal Infection",
    "Skin Cancer"
]

# Symptoms and advice dictionary
classes_info = {
    "Acne": {
        "symptoms": "Whiteheads, blackheads, pimples on skin",
        "advice": "Cleanse your face regularly, avoid touching your face, and use dermatologist-approved acne treatment products."
    },
    "Atopic Dermatitis": {
        "symptoms": "Dry, itchy, red patches on skin",
        "advice": "Apply moisturizer frequently and consult a dermatologist if irritation persists."
    },
    "Benign Tumor": {
        "symptoms": "Small painless lumps under the skin",
        "advice": "Usually harmless but monitor size changes and consult a doctor if growth occurs."
    },
    "Fungal Infection": {
        "symptoms": "Red itchy scaly skin patches",
        "advice": "Keep the affected area dry and use antifungal medication recommended by a doctor."
    },
    "Skin Cancer": {
        "symptoms": "Unusual mole shape, color changes, sores that do not heal",
        "advice": "Consult a dermatologist immediately for medical examination."
    }
}

# Load trained CNN model
model = tf.keras.models.load_model("model_v3.keras", compile=False)

print("Model loaded successfully")
print("Model input shape:", model.input_shape)


@app.route("/predict", methods=["POST"])
def predict():

    # Check if file exists in request
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    try:
        # Open image
        img = Image.open(file).convert("RGB")

        # Resize to model input size
        img = img.resize((200, 200))

        # Convert to numpy array
        img_array = np.array(img)

        # Normalize (same as training)
        img_array = img_array / 255.0

        # Add batch dimension
        img_array = np.expand_dims(img_array, axis=0)

        # Model prediction
        predictions = model.predict(img_array, verbose=0)

        predicted_index = np.argmax(predictions)
        predicted_class = CLASS_NAMES[predicted_index]
        confidence = float(np.max(predictions) * 100)

        # Get symptoms and advice
        info = classes_info[predicted_class]

        result = {
            "prediction": predicted_class,
            "confidence": round(confidence, 2),
            "symptoms": info["symptoms"],
            "advice": info["advice"]
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run Flask server
if __name__ == "__main__":
    app.run(debug=True)
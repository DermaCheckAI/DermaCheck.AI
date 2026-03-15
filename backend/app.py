import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

# Must match the order used in your college project training
CLASSES = ["Acne", "Atopic Dermatitis", "Benign Tumor", "Fungal Infection", "Skin Cancer"]

INFO_DETAILS = {
    "Acne": {"symptoms": "Pimples, blackheads.", "advice": "Avoid picking; use gentle cleansers."},
    "Atopic Dermatitis": {"symptoms": "Itchy, red, dry skin.", "advice": "Moisturize and avoid allergens."},
    "Benign Tumor": {"symptoms": "Non-cancerous growths.", "advice": "Monitor for changes."},
    "Fungal Infection": {"symptoms": "Red, scaly rings.", "advice": "Keep dry; use antifungal cream."},
    "Skin Cancer": {"symptoms": "Irregular moles.", "advice": "Consult a dermatologist immediately!"}
}

# Use the new rescued file
MODEL_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\final_model.h5"
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files.get('file')
    if not file: return jsonify({"error": "No file"}), 400
    
    try:
        # 1. Processing
        img = Image.open(file).convert("RGB").resize((300,300))
        img_array = np.array(img).astype('float32')
        img_array = np.expand_dims(img_array, axis=0)
        
        # 2. Scaling (EfficientNet scaling)
        img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)

        # 3. Prediction
        predictions = model.predict(img_array)
        
        # IMPORTANT: Check your terminal for these numbers!
        print(f"--- DEBUG ---")
        print(f"Raw Output: {predictions[0]}")
        
        class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][class_idx] * 100)
        result_name = CLASSES[class_idx]

        return jsonify({
            "prediction": result_name,
            "confidence": round(confidence, 2),
            "symptoms": INFO_DETAILS[result_name]["symptoms"],
            "advice": INFO_DETAILS[result_name]["advice"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
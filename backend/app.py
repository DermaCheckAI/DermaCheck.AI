import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

# 1. Configuration - MUST MATCH YOUR TRAINING ORDER
CLASSES = ["Acne", "Atopic Dermatitis", "Benign Tumor", "Fungal Infection", "Skin Cancer"]

INFO_DETAILS = {
    "Acne": {"symptoms": "Pimples, blackheads, or whiteheads.", "advice": "Avoid picking; use gentle cleansers."},
    "Atopic Dermatitis": {"symptoms": "Itchy, red, and dry skin patches.", "advice": "Keep skin moisturized and avoid allergens."},
    "Benign Tumor": {"symptoms": "Non-cancerous growths or lumps.", "advice": "Monitor for changes in size or color."},
    "Fungal Infection": {"symptoms": "Red, scaly, or itchy rings.", "advice": "Keep the area dry and use antifungal creams."},
    "Skin Cancer": {"symptoms": "Irregular moles or sores that won't heal.", "advice": "Consult a dermatologist immediately!"}
}

# 2. Load the Rescued Model
MODEL_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\final_model.h5"
model = None

try:
    # Load with compile=False to avoid metadata/optimizer version conflicts
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("✅ Flask Server: final_model.h5 loaded successfully!")
except Exception as e:
    print(f"❌ Flask Server: Load failed: {e}")

# 3. Prediction Logic
@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    file = request.files.get('file')
    if not file:
        return jsonify({"error": "No file uploaded"}), 400
    
    try:
        # A. Load and Resize
        img = Image.open(file).convert("RGB")
        img = img.resize((224, 224))
        
        # B. Convert to Array
        img_array = np.array(img).astype('float32')
        img_array = np.expand_dims(img_array, axis=0)
        
        # C. PREPROCESSING (Choose ONE of the two below)
        # Option 1: Standard EfficientNet scaling (Use this first)
        img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)
        
        # Option 2: Manual 0-1 scaling (Uncomment this and comment Option 1 if results stay 'stuck')
        # img_array = img_array / 255.0

        # D. Run Inference
        predictions = model.predict(img_array)
        
        # DEBUG: Look at these numbers in your VS Code terminal!
        print(f"--- Prediction Debug ---")
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
        print(f"Prediction Error: {e}")
        return jsonify({"error": "Internal processing error"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
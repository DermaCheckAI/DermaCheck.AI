import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

# 1. Initialize Flask and CORS
app = Flask(__name__)
CORS(app)

# 2. Configuration & Class Mapping
# Ensure these classes match the order they were in during your model training
CLASSES = ["Acne", "Atopic Dermatitis", "Benign Tumor", "Fungal Infection", "Skin Cancer"]

INFO_DETAILS = {
    "Acne": {"symptoms": "Pimples, blackheads, or whiteheads.", "advice": "Avoid picking; use gentle cleansers."},
    "Atopic Dermatitis": {"symptoms": "Itchy, red, and dry skin patches.", "advice": "Keep skin moisturized and avoid allergens."},
    "Benign Tumor": {"symptoms": "Non-cancerous growths or lumps.", "advice": "Monitor for changes in size or color."},
    "Fungal Infection": {"symptoms": "Red, scaly, or itchy rings.", "advice": "Keep the area dry and use antifungal creams."},
    "Skin Cancer": {"symptoms": "Irregular moles or sores that won't heal.", "advice": "Consult a dermatologist immediately for a biopsy."}
}

# 3. Load the Rescued Model
MODEL_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\final_model.h5"
model = None

try:
    # Load without compiling for faster inference and fewer errors
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("✅ Model loaded successfully from final_model.h5")
except Exception as e:
    print(f"❌ Error loading model: {e}")

# 4. Prediction Route
@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not initialized on server"}), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    
    try:
        # Preprocessing: Resize to 224x224 as required by EfficientNetB3
        img = Image.open(file).convert("RGB")
        img = img.resize((224, 224))
        
        # Convert to array and add batch dimension
        img_array = np.array(img).astype('float32')
        img_array = np.expand_dims(img_array, axis=0)
        
        # EfficientNet specific preprocessing (scales pixels correctly)
        img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)

        # Run Inference
        predictions = model.predict(img_array)
        score = tf.nn.softmax(predictions[0]) # Use softmax if model output is logits
        
        # Get result
        class_idx = np.argmax(predictions[0])
        confidence = float(np.max(predictions[0]) * 100)
        result_name = CLASSES[class_idx]

        return jsonify({
            "prediction": result_name,
            "confidence": round(confidence, 2),
            "symptoms": INFO_DETAILS[result_name]["symptoms"],
            "advice": INFO_DETAILS[result_name]["advice"]
        })

    except Exception as e:
        return jsonify({"error": f"Inference failed: {str(e)}"}), 500

# 5. Run the Server
if __name__ == "__main__":
    # Ensure port 5000 is open
    app.run(debug=True, port=5000)
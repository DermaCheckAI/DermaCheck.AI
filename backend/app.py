from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image

app = Flask(__name__)
CORS(app)

# Classes mapping
classes_info = {
    "Acne": {"symptoms": "Whiteheads, blackheads, pimples", "advice": "Cleanse daily, avoid touching face."},
    "Atopic Dermatitis": {"symptoms": "Itchy, red patches", "advice": "Apply moisturizer, see a doctor."},
    "Benign Tumor": {"symptoms": "Small, painless lumps", "advice": "Monitor for changes."},
    "Fungal Infection": {"symptoms": "Red, itchy, scaly patches", "advice": "Keep area dry, use antifungal cream."},
    "Skin Cancer": {"symptoms": "Unusual moles, sores that don’t heal", "advice": "See a dermatologist immediately!"}
}

MODEL_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\efficientnet_b3_new.keras"
model = None

try:
    # In TF 2.15, this usually works perfectly without custom_objects
    print("--- Loading Model on Stable Environment ---")
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("✅ SUCCESS: Model loaded!")
except Exception as e:
    print(f"❌ Load failed: {e}")
    # Final fallback for Keras 3 models in Keras 2 environment
    try:
        import keras
        model = keras.models.load_model(MODEL_PATH, compile=False)
        print("✅ SUCCESS: Loaded via direct Keras import!")
    except:
        print("❌ Still failing. Checking file...")

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file"}), 400

    img = Image.open(file).convert("RGB")
    img = img.resize((224, 224))
    img_array = np.array(img).astype('float32')
    img_array = np.expand_dims(img_array, axis=0)

    # EfficientNet specific preprocessing (Crucial for accuracy)
    img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)

    predictions = model.predict(img_array)
    class_idx = np.argmax(predictions[0])
    
    class_names = list(classes_info.keys())
    result = class_names[class_idx]
    
    return jsonify({
        "prediction": result,
        "confidence": round(float(np.max(predictions) * 100), 2),
        "symptoms": classes_info[result]["symptoms"],
        "advice": classes_info[result]["advice"]
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
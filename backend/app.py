from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image

# 1. Setup the Custom Layer with a robust config cleaner
class CleanDense(tf.keras.layers.Dense):
    def __init__(self, *args, **kwargs):
        kwargs.pop("quantization_config", None)
        super().__init__(*args, **kwargs)

    @classmethod
    def from_config(cls, config):
        config.pop("quantization_config", None)
        return super().from_config(config)

# 2. THE GLOBAL HOOK: Force Keras to use our version for all known paths
tf.keras.utils.get_custom_objects().update({
    'Dense': CleanDense,
    'KDense': CleanDense,
    'keras.layers.Dense': CleanDense,
    'keras.src.layers.core.dense.Dense': CleanDense
})

app = Flask(__name__)
CORS(app)

classes_info = {
    "Acne": {"symptoms": "Whiteheads, blackheads, pimples on skin", "advice": "Cleanse daily, avoid touching face, use acne treatment products"},
    "Atopic Dermatitis": {"symptoms": "Itchy, red patches on skin", "advice": "Apply moisturizer and consult dermatologist if persists"},
    "Benign Tumor": {"symptoms": "Small, painless lumps under the skin", "advice": "Monitor growth and consult a doctor if changes occur"},
    "Fungal Infection": {"symptoms": "Red, itchy, scaly patches on skin", "advice": "Keep area dry, use antifungal creams as advised by doctor"},
    "Skin Cancer": {"symptoms": "Unusual moles, sores that don’t heal, color changes", "advice": "See a dermatologist immediately for evaluation"}
}

model = None
MODEL_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\efficientnet_b3_new.keras"

print("--- Attempting Global Hook Load ---")
try:
    # compile=False is vital to ignore training/quantization metadata
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    print("✅ SUCCESS: Model loaded successfully!")
except Exception as e:
    print(f"❌ Load failed: {e}")

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded. Check server console."}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        file = request.files["file"]
        img = Image.open(file).convert("RGB")
        img = img.resize((224, 224))
        
        # Preprocessing
        img_array = np.array(img).astype('float32')
        img_array = np.expand_dims(img_array, axis=0)

        # Make Prediction
        predictions = model.predict(img_array)
        
        # Ensure we're getting a flat array for argmax
        if len(predictions.shape) > 1:
            pred_probs = predictions[0]
        else:
            pred_probs = predictions

        class_idx = np.argmax(pred_probs)
        class_names = list(classes_info.keys())
        
        # Safety check for class index
        if class_idx >= len(class_names):
            return jsonify({"error": "Model output classes do not match classes_info"}), 500
            
        predicted_class = class_names[class_idx]
        confidence = float(np.max(pred_probs) * 100)

        return jsonify({
            "prediction": predicted_class,
            "confidence": round(confidence, 2),
            "symptoms": classes_info[predicted_class]["symptoms"],
            "advice": classes_info[predicted_class]["advice"]
        })
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import tensorflow.keras.layers as layers

# 1. THE FIX: Define the custom layer
class CleanDense(layers.Dense):
    def __init__(self, *args, **kwargs):
        kwargs.pop("quantization_config", None)
        super().__init__(*args, **kwargs)

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

print("--- Attempting Deep-Mapping Model Load ---")
try:
    # 2. THE DEEP MAP: We map BOTH the short name and the internal Keras path
    model = tf.keras.models.load_model(
        MODEL_PATH,
        compile=False,
        custom_objects={
            "Dense": CleanDense,
            "keras.src.layers.core.dense.Dense": CleanDense,
            "keras.layers.Dense": CleanDense
        }
    )
    print("SUCCESS: Model loaded successfully!")
except Exception as e:
    print(f"FAILED AGAIN: {e}")
    print("\n--- EMERGENCY FALLBACK ---")
    try:
        # 3. EMERGENCY FALLBACK: If .keras fails, try loading just the weights 
        # (This only works if you have the model architecture defined in code, 
        # but let's try one more loading trick first)
        import keras
        model = keras.models.load_model(MODEL_PATH, compile=False, safe_mode=False)
        print("SUCCESS: Loaded using safe_mode=False!")
    except Exception as e2:
        print(f"Fallback failed: {e2}")

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not initialized. Check server logs for the Traceback."}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        file = request.files["file"]
        img = Image.open(file).convert("RGB")
        img = img.resize((224, 224))
        
        # Preprocessing for EfficientNetB3
        img_array = np.array(img).astype('float32')
        img_array = np.expand_dims(img_array, axis=0)

        predictions = model.predict(img_array)
        class_idx = np.argmax(predictions)
        class_names = list(classes_info.keys())
        
        predicted_class = class_names[class_idx]
        confidence = float(np.max(predictions) * 100)

        return jsonify({
            "prediction": predicted_class,
            "confidence": round(confidence, 2),
            "symptoms": classes_info[predicted_class]["symptoms"],
            "advice": classes_info[predicted_class]["advice"]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
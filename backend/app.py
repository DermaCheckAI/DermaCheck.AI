from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import tensorflow.keras.layers as layers

# 1. THE FIX: Create a custom Dense layer that ignores 'quantization_config'
@tf.keras.utils.register_keras_serializable(package="Custom", name="Dense")
class CleanDense(layers.Dense):
    def __init__(self, *args, **kwargs):
        kwargs.pop("quantization_config", None)
        super().__init__(*args, **kwargs)

# 2. THE MONKEY PATCH: Forcibly replace the internal Keras Dense with our fix
# This prevents Keras from using the broken internal version during deserialization.
layers.Dense = CleanDense

app = Flask(__name__)
CORS(app)

# Define classes with symptoms and advice
classes_info = {
    "Acne": {
        "symptoms": "Whiteheads, blackheads, pimples on skin",
        "advice": "Cleanse daily, avoid touching face, use acne treatment products"
    },
    "Atopic Dermatitis": {
        "symptoms": "Itchy, red patches on skin",
        "advice": "Apply moisturizer and consult dermatologist if persists"
    },
    "Benign Tumor": {
        "symptoms": "Small, painless lumps under the skin",
        "advice": "Monitor growth and consult a doctor if changes occur"
    },
    "Fungal Infection": {
        "symptoms": "Red, itchy, scaly patches on skin",
        "advice": "Keep area dry, use antifungal creams as advised by doctor"
    },
    "Skin Cancer": {
        "symptoms": "Unusual moles, sores that don’t heal, color changes",
        "advice": "See a dermatologist immediately for evaluation"
    }
}

# Initialize model as None to avoid NameError if loading fails
model = None
MODEL_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\efficientnet_b3_new.keras"

print("--- Starting Server ---")
try:
    # We pass the custom object mapping as a backup
    model = tf.keras.models.load_model(
        MODEL_PATH,
        compile=False,
        custom_objects={"Dense": CleanDense}
    )
    print("SUCCESS: Model loaded successfully!")
except Exception as e:
    print(f"CRITICAL ERROR: Could not load model. Error: {e}")

@app.route("/predict", methods=["POST"])
def predict():
    # Safety check if model failed to load at startup
    if model is None:
        return jsonify({"error": "Model not initialized on server. Check console logs."}), 500

    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        file = request.files["file"]

        # Convert to PIL Image
        img = Image.open(file).convert("RGB")
        img = img.resize((224, 224))

        # Preprocess
        # Note: EfficientNetB3 usually scales internally. 
        # If your model was trained on 0-1, add ' / 255.0' back to img_array.
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)

        # Predict
        predictions = model.predict(img_array)
        class_idx = np.argmax(predictions)
        class_names = list(classes_info.keys())
        
        predicted_class = class_names[class_idx]
        confidence = float(np.max(predictions) * 100)

        # Fetch symptoms and advice
        info = classes_info[predicted_class]

        return jsonify({
            "prediction": predicted_class,
            "confidence": round(confidence, 2),
            "symptoms": info["symptoms"],
            "advice": info["advice"]
        })
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

if __name__ == "__main__":
    # debug=False is sometimes better when troubleshooting model loads to avoid double-loading
    app.run(debug=True, port=5000)
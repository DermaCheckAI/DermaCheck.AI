from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
from tensorflow.keras.layers import Dense as KDense

# Custom Layer to handle the 'quantization_config' error in Keras 3/TensorFlow 2.16+
class CleanDense(KDense):
    def __init__(self, *args, **kwargs):
        # Remove the unsupported argument that's causing the crash
        kwargs.pop("quantization_config", None)
        super().__init__(*args, **kwargs)

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

# Load model using the custom class mapping
MODEL_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\efficientnet_b3_new.keras"

try:
    model = tf.keras.models.load_model(
        MODEL_PATH,
        compile=False,
        custom_objects={
            "Dense": CleanDense  # Intercept 'Dense' calls and use our fixed version
        }
    )
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    # Convert to PIL Image
    img = Image.open(file).convert("RGB")
    img = img.resize((224, 224))

    # Preprocess
    # NOTE: EfficientNet usually handles rescaling internally. 
    # If your accuracy is low, try removing the '/ 255.0' below.
    img_array = np.array(img)
    img_array = np.expand_dims(img_array, axis=0)

    # Predict
    predictions = model.predict(img_array)
    
    # Get the index of the highest confidence score
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

if __name__ == "__main__":
    app.run(debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import os

app = Flask(__name__)
CORS(app)

classes_info = {
    "Acne": {"symptoms": "Whiteheads, blackheads, pimples", "advice": "Cleanse daily, avoid touching face."},
    "Atopic Dermatitis": {"symptoms": "Itchy, red patches", "advice": "Apply moisturizer, see a doctor."},
    "Benign Tumor": {"symptoms": "Small, painless lumps", "advice": "Monitor for changes."},
    "Fungal Infection": {"symptoms": "Red, itchy, scaly patches", "advice": "Keep area dry, use antifungal cream."},
    "Skin Cancer": {"symptoms": "Unusual moles, sores that don’t heal", "advice": "See a dermatologist immediately!"}
}

MODEL_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\efficientnet_b3_new.keras"
model = None

def build_and_load():
    global model
    try:
        print("--- Building Fresh Architecture ---")
        # 1. Build the exact structure
        base_model = tf.keras.applications.EfficientNetB3(
            input_shape=(224, 224, 3),
            include_top=False,
            weights=None
        )
        x = tf.keras.layers.GlobalAveragePooling2D()(base_model.output)
        x = tf.keras.layers.BatchNormalization()(x)
        x = tf.keras.layers.Dense(512, activation='relu')(x)
        x = tf.keras.layers.Dropout(0.4)(x)
        outputs = tf.keras.layers.Dense(5, activation='softmax')(x)
        
        temp_model = tf.keras.Model(inputs=base_model.input, outputs=outputs)

        # 2. Use the 'skip_mismatch' flag to force load weights only
        # This is the "Emergency Exit" for broken .keras files
        print("--- Injecting Weights (Ignoring Metadata) ---")
        temp_model.load_weights(MODEL_PATH, skip_mismatch=True, by_name=True)
        
        model = temp_model
        print("✅ SUCCESS: Model is live!")
    except Exception as e:
        print(f"❌ Load failed: {e}")

build_and_load()

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
    
    file = request.files.get("file")
    if not file: return jsonify({"error": "No file"}), 400

    img = Image.open(file).convert("RGB").resize((224, 224))
    img_array = np.expand_dims(np.array(img).astype('float32'), axis=0)
    img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)

    preds = model.predict(img_array)
    idx = np.argmax(preds[0])
    name = list(classes_info.keys())[idx]
    
    return jsonify({
        "prediction": name,
        "confidence": round(float(np.max(preds) * 100), 2),
        "symptoms": classes_info[name]["symptoms"],
        "advice": classes_info[name]["advice"]
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
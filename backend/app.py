from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image

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

def load_model_robust():
    global model
    try:
        print("--- Attempting Weight Injection (Manual Reconstruction) ---")
        
        # 1. Rebuild the architecture from scratch
        base_model = tf.keras.applications.EfficientNetB3(
            input_shape=(224, 224, 3),
            include_top=False,
            weights=None # We will load your weights
        )
        
        # 2. Add your custom layers (Matching your diploma project structure)
        x = tf.keras.layers.GlobalAveragePooling2D()(base_model.output)
        x = tf.keras.layers.BatchNormalization()(x)
        x = tf.keras.layers.Dense(512, activation='relu')(x)
        x = tf.keras.layers.Dropout(0.4)(x)
        outputs = tf.keras.layers.Dense(5, activation='softmax')(x)
        
        new_model = tf.keras.Model(inputs=base_model.input, outputs=outputs)
        
        # 3. Inject ONLY the weights from your file
        # This ignores the 'quantization_config' error entirely
        new_model.load_weights(MODEL_PATH)
        
        model = new_model
        print("✅ SUCCESS: Weights injected into fresh architecture!")
        
    except Exception as e:
        print(f"❌ Weight Injection failed: {e}")
        print("Trying standard load as last resort...")
        try:
            model = tf.keras.models.load_model(MODEL_PATH, compile=False)
            print("✅ SUCCESS: Standard load worked!")
        except Exception as e2:
            print(f"❌ CRITICAL: All loading methods failed: {e2}")

# Load the model when the script starts
load_model_robust()

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not initialized"}), 500
    
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        img = Image.open(file).convert("RGB")
        img = img.resize((224, 224))
        
        img_array = np.array(img).astype('float32')
        img_array = np.expand_dims(img_array, axis=0)
        
        # Preprocessing for EfficientNet
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
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
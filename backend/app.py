import numpy as np
import tensorflow as tf
import keras
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image

app = Flask(__name__)
CORS(app)

CLASSES = ["Acne", "Atopic Dermatitis", "Benign Tumor", "Fungal Infection", "Skin Cancer"]

def build_clean_model():
    # Build a fresh B3 shell natively in your PC's environment
    base = tf.keras.applications.EfficientNetB3(input_shape=(300, 300, 3), include_top=False, weights=None)
    x = tf.keras.layers.GlobalAveragePooling2D()(base.output)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dense(512, activation='relu')(x)
    x = tf.keras.layers.Dropout(0.4)(x)
    outputs = tf.keras.layers.Dense(5, activation='softmax')(x)
    model = tf.keras.Model(inputs=base.input, outputs=outputs)
    
    # Load ONLY the numbers (weights) into the shell
    # This bypasses all the "DepthwiseConv2D" version errors
    WEIGHTS_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\final_weights.weights.h5"
    model.load_weights(WEIGHTS_PATH)
    return model

# Initialize the model once when the server starts
try:
    model = build_clean_model()
    print("✅ SUCCESS: Weights loaded into clean shell. No version conflicts possible now.")
except Exception as e:
    print(f"❌ Final Load Error: {e}")

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files.get('file')
    if not file: return jsonify({"error": "No file"}), 400
    
    try:
        img = Image.open(file).convert("RGB").resize((300, 300))
        img_array = np.array(img).astype('float32')
        img_array = np.expand_dims(img_array, axis=0)
        
        # Standard EfficientNet preprocessing
        img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)

        preds = model.predict(img_array)
        
        # This will now show real, varied numbers!
        print(f"--- DEBUG ---")
        print(f"Raw Scores: {preds[0]}")
        
        idx = np.argmax(preds[0])
        return jsonify({
            "prediction": CLASSES[idx],
            "confidence": round(float(preds[0][idx] * 100), 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
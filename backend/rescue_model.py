import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import os

app = Flask(__name__)
CORS(app)

CLASSES = ["Acne", "Atopic Dermatitis", "Benign Tumor", "Fungal Infection", "Skin Cancer"]

def load_model_weights_only():
    # 1. Build a fresh, clean B3 shell
    base_model = tf.keras.applications.EfficientNetB3(
        input_shape=(300, 300, 3), 
        include_top=False, 
        weights=None
    )
    x = tf.keras.layers.GlobalAveragePooling2D()(base_model.output)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dense(512, activation='relu')(x)
    x = tf.keras.layers.Dropout(0.4)(x)
    outputs = tf.keras.layers.Dense(5, activation='softmax')(x)
    
    full_model = tf.keras.Model(inputs=base_model.input, outputs=outputs)

    # 2. Use your rescued .h5 file or the .keras weights
    # We use the final_model.h5 we created earlier because it's a weights-compatible format
    WEIGHTS_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\final_model.h5"
    
    if os.path.exists(WEIGHTS_PATH):
        full_model.load_weights(WEIGHTS_PATH, by_name=True, skip_mismatch=True)
        print("✅ Weights injected into clean B3 shell!")
    else:
        print("❌ Could not find final_model.h5. Please run the rescue script once more.")
        
    return full_model

model = load_model_weights_only()

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files.get('file')
    if not file: return jsonify({"error": "No file"}), 400
    
    try:
        img = Image.open(file).convert("RGB").resize((300, 300))
        img_array = np.array(img).astype('float32')
        img_array = np.expand_dims(img_array, axis=0)
        img_array = tf.keras.applications.efficientnet.preprocess_input(img_array)

        predictions = model.predict(img_array)
        print(f"Raw Scores: {predictions[0]}") # We need to see these numbers!
        
        class_idx = np.argmax(predictions[0])
        return jsonify({
            "prediction": CLASSES[class_idx],
            "confidence": round(float(predictions[0][class_idx] * 100), 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
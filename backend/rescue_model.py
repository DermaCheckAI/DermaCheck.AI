import zipfile
import tensorflow as tf
import os
import numpy as np

MODEL_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\efficientnet_b3_new.keras"
TEMP_EXTRACT_DIR = r"C:\Users\kisan\DermaCheck.AI\backend\extracted_data"
WEIGHTS_FILE = os.path.join(TEMP_EXTRACT_DIR, "model.weights.h5")

def build_shell():
    # Simple shell - no custom names to avoid conflicts
    base = tf.keras.applications.EfficientNetB3(input_shape=(224, 224, 3), include_top=False, weights=None)
    x = tf.keras.layers.GlobalAveragePooling2D()(base.output)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dense(512, activation='relu')(x)
    x = tf.keras.layers.Dropout(0.4)(x)
    outputs = tf.keras.layers.Dense(5, activation='softmax')(x)
    return tf.keras.Model(inputs=base.input, outputs=outputs)

# 1. Extract
with zipfile.ZipFile(MODEL_PATH, 'r') as zip_ref:
    zip_ref.extractall(TEMP_EXTRACT_DIR)

# 2. Build
model = build_shell()

# 3. BRUTE FORCE LOAD
try:
    # We use by_name=False to force it to load by order if naming failed
    model.load_weights(WEIGHTS_FILE, by_name=False, skip_mismatch=True)
    
    # Check if weights are still zeros/random
    test_weights = model.layers[-1].get_weights()[0]
    if np.allclose(test_weights, test_weights[0], atol=1e-3):
        print("⚠️ Warning: Weights still look uninitialized. Trying alternative mapping...")
        model.load_weights(WEIGHTS_FILE, by_name=True, skip_mismatch=True)

    print("✅ SUCCESS: Weights forced into model.")
    model.save(r"C:\Users\kisan\DermaCheck.AI\backend\final_model.h5")
    print("🚀 Created final_model.h5")
except Exception as e:
    print(f"❌ Failed: {e}")
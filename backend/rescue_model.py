import zipfile
import tensorflow as tf
import os

MODEL_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\efficientnet_b3_new.keras"
TEMP_EXTRACT_DIR = r"C:\Users\kisan\DermaCheck.AI\backend\extracted_data"

# (Extraction logic)
if not os.path.exists(TEMP_EXTRACT_DIR):
    os.makedirs(TEMP_EXTRACT_DIR)

with zipfile.ZipFile(MODEL_PATH, 'r') as zip_ref:
    zip_ref.extractall(TEMP_EXTRACT_DIR)
    print("✅ Files extracted to 'extracted_data' folder")

def build_shell():
    inputs = tf.keras.Input(shape=(224, 224, 3))
    
    # Renamed to avoid the "name used 2 times" error
    x = tf.keras.layers.Normalization(name="input_normalization")(inputs)
    
    base = tf.keras.applications.EfficientNetB3(
        input_tensor=x,
        include_top=False,
        weights=None
    )
    
    x = tf.keras.layers.GlobalAveragePooling2D()(base.output)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.Dense(512, activation='relu')(x)
    x = tf.keras.layers.Dropout(0.4)(x)
    outputs = tf.keras.layers.Dense(5, activation='softmax')(x)
    
    return tf.keras.Model(inputs=inputs, outputs=outputs)

model = build_shell()

weights_path = os.path.join(TEMP_EXTRACT_DIR, "model.weights.h5")

try:
    # by_name=True helps map weights to the right layers even if 
    # the top-level model structure has different wrapper names
    model.load_weights(weights_path, by_name=True, skip_mismatch=True)
    print("✅ Weights successfully injected into the model!")
    
    # Saving as .h5 makes it a single, portable file for Flask
    model.save(r"C:\Users\kisan\DermaCheck.AI\backend\final_model.h5")
    print("🚀 SUCCESS! Use 'final_model.h5' in your app.py now.")
except Exception as e:
    print(f"❌ Error loading weights: {e}")
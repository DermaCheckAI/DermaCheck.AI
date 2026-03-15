import tensorflow as tf

# This script will strip the "bad" metadata and save just the weights/layers
MODEL_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\efficientnet_b3_new.keras"
SAVE_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\fixed_model.h5"

try:
    # Use the 'safe_mode=False' which is sometimes the only way to bypass the error
    model = tf.keras.models.load_model(MODEL_PATH, safe_mode=False, compile=False)
    model.save(SAVE_PATH)
    print(f"✅ Conversion successful! Saved to: {SAVE_PATH}")
except Exception as e:
    print(f"❌ Conversion failed: {e}")
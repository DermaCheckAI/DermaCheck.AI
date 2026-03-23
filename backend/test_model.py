import tensorflow as tf

classes = [
    "Acne",
    "Atopic Dermatitis",
    "Benign Tumor",
    "Fungal Infection",
    "Skin Cancer"
]

print("Loading model...")

model = tf.keras.models.load_model(
    r"C:\Users\kisan\DermaCheck.AI\backend\efficientnet_v3.keras",
    compile=False
)

print("Model loaded successfully")
print("Output classes:", classes)

model.summary()
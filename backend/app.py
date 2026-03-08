import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image

classes = [
    "Acne",
    "Atopic Dermatitis",
    "Benign Tumor",
    "Fungal Infection",
    "Skin Cancer"
]

# load model
model = tf.keras.models.load_model(
    r"C:\Users\kisan\DermaCheck.AI\backend\efficientnet_v3.keras",
    compile=False
)

# image path
img_path = r"C:\Users\kisan\DermaCheck.AI\backend\sn7_atopicdermatitis2.webp"

# load image
img = image.load_img(img_path, target_size=(224, 224))

# convert to array
img_array = image.img_to_array(img)

# expand dimension
img_array = np.expand_dims(img_array, axis=0)

# normalize
img_array = img_array / 255.0

# prediction
predictions = model.predict(img_array)

# get class
predicted_class = classes[np.argmax(predictions)]

# confidence
confidence = np.max(predictions) * 100

print("Prediction:", predicted_class)
print("Confidence:", round(confidence, 2), "%")
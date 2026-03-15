import tensorflow as tf
from tensorflow.keras.layers import Dense as KDense
from tensorflow.keras.utils import register_keras_serializable

# Register custom Dense so keras uses it during loading
@register_keras_serializable()
class Dense(KDense):
    def __init__(self, *args, **kwargs):
        kwargs.pop("quantization_config", None)
        super().__init__(*args, **kwargs)

print("Loading model...")

model = tf.keras.models.load_model(
    "efficientnet_b3_best.keras",
    compile=False,
    custom_objects={"Dense": Dense}
)

print("Model loaded successfully")

model.save("efficientnet_b3_clean.keras")

print("Clean model saved as efficientnet_b3_clean.keras")
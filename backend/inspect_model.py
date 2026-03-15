# import h5py

# MODEL_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\efficientnet_b3_new.keras"

# with h5py.File(MODEL_PATH, 'r') as f:
#     # Look into the layers group
#     if 'layers' in f:
#         print("--- Layers found in file ---")
#         for layer in f['layers']:
#             print(layer)
#     else:
#         # Keras 3 often hides them in 'model_layers' or 'vars'
#         print("--- Groups in file ---")
#         print(f.keys())

import zipfile
import os

MODEL_PATH = r"C:\Users\kisan\DermaCheck.AI\backend\efficientnet_b3_new.keras"

try:
    with zipfile.ZipFile(MODEL_PATH, 'r') as zip_ref:
        print("--- Internal Files Found ---")
        print(zip_ref.namelist())
except zipfile.BadZipFile:
    print("❌ This is not a Keras 3 zip archive.")
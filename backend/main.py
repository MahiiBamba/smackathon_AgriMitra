# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# import uuid
# import cv2
# import numpy as np
# import tensorflow as tf

# # ------------------- MODEL LOGIC -------------------
# MODEL_PATH = "trained_model.h5"
# model = tf.keras.models.load_model(MODEL_PATH)

# CLASS_NAMES = [
#     'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
#     'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
#     'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight',
#     'Corn_(maize)___healthy', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
#     'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
#     'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___Late_blight',
#     'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch',
#     'Strawberry___healthy', 'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
#     'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite',
#     'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
# ]

# def load_and_preprocess_image(image_path, target_size=(128, 128)):
#     image = tf.keras.preprocessing.image.load_img(image_path, target_size=target_size)
#     input_arr = tf.keras.preprocessing.image.img_to_array(image)
#     input_arr = np.expand_dims(input_arr, axis=0)
#     return input_arr

# def predict_disease(image_path):
#     input_arr = load_and_preprocess_image(image_path)
#     prediction = model.predict(input_arr)
#     result_index = np.argmax(prediction)
#     confidence = float(np.max(prediction))
#     predicted_class = CLASS_NAMES[result_index]
    
#     if "healthy" in predicted_class.lower():
#         severity = "Healthy"
#     else:
#         if confidence >= 0.85:
#             severity = "Severe"
#         elif confidence >= 0.60:
#             severity = "Moderate"
#         else:
#             severity = "Low"
    
#     return {
#         "predicted_class": predicted_class,
#         "confidence": confidence,
#         "severity": severity
#     }

# # ------------------- FLASK SETUP -------------------
# app = Flask(__name__)
# CORS(app)  # Enable cross-origin requests

# UPLOAD_FOLDER = "uploads"
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# @app.route("/predict", methods=["POST"])
# def predict():

#     location = request.form.to_dict()

#     if "file" not in request.files:
#         return jsonify({"error": "No file part in request"}), 400

#     file = request.files["file"]
#     if file.filename == "":
#         return jsonify({"error": "No selected file"}), 400

#     # Save the uploaded image temporarily
#     filename = str(uuid.uuid4()) + ".jpg"
#     file_path = os.path.join(UPLOAD_FOLDER, filename)
#     file.save(file_path)

#     # Make prediction
#     result = predict_disease(file_path)

#     # Optionally remove the image after prediction
#     os.remove(file_path)

#     return jsonify(result)

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)









from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import os
import uuid
import sqlite3
import datetime
import numpy as np
import tensorflow as tf
from concurrent.futures import ThreadPoolExecutor

# ------------------- MODEL LOGIC -------------------
MODEL_PATH = "trained_model.h5"
model = tf.keras.models.load_model(MODEL_PATH)

CLASS_NAMES = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___Late_blight',
    'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch',
    'Strawberry___healthy', 'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight',
    'Tomato___Leaf_Mold', 'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]

def load_and_preprocess_image(image_path, target_size=(128, 128)):
    image = tf.keras.preprocessing.image.load_img(image_path, target_size=target_size)
    input_arr = tf.keras.preprocessing.image.img_to_array(image)
    input_arr = np.expand_dims(input_arr, axis=0)
    return input_arr

def predict_disease(image_path):
    input_arr = load_and_preprocess_image(image_path)
    prediction = model.predict(input_arr)
    result_index = np.argmax(prediction)
    confidence = float(np.max(prediction))
    predicted_class = CLASS_NAMES[result_index]

    if "healthy" in predicted_class.lower():
        severity = "Healthy"
    else:
        if confidence >= 0.85:
            severity = "Severe"
        elif confidence >= 0.60:
            severity = "Moderate"
        else:
            severity = "Low"

    return {
        "predicted_class": predicted_class,
        "confidence": confidence,
        "severity": severity
    }


# configure API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# function to generate explanation
def generate_explanation_gemini(predicted_class, severity, lat, lon):
    prompt = f"""
    You are an agricultural expert.
    Explain the plant disease '{predicted_class}' with severity '{severity}'
    in a simple, farmer-friendly way in the regional language of location latitude: {lat} and longitude: {lon}.
    Also provide practical steps to manage and treat the disease and best pesticide recommendations.
    Keep it short, clear, and easy to understand.
    """

    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)

    return response.text.strip()


executor = ThreadPoolExecutor(max_workers=2)

def save_explanation_async(pred_id, predicted_class, severity, lat, lon):
    explanation = generate_explanation_gemini(predicted_class, severity, lat, lon)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("UPDATE predictions SET explanation=? WHERE id=?", (explanation, pred_id))
    conn.commit()
    conn.close()
    print(f"Explanation saved for prediction ID {pred_id}")


# ------------------- FLASK SETUP -------------------
app = Flask(__name__)
CORS(app)  # Enable cross-origin requests

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ------------------- DATABASE SETUP -------------------
DB_PATH = "predictions.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            latitude REAL,
            longitude REAL,
            predicted_class TEXT,
            confidence REAL,
            severity TEXT,
            timestamp TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def save_prediction_to_db(latitude, longitude, result):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO predictions (latitude, longitude, predicted_class, confidence, severity, timestamp)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
    """, (
        latitude,
        longitude,
        result["predicted_class"],
        result["confidence"],
        result["severity"]
    ))
    conn.commit()
    row_id = cursor.lastrowid
    conn.close()
    return row_id


@app.route("/predict", methods=["POST", "GET"])
def predict():
    if request.method == "POST":
        location = request.form.to_dict()

        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        # Save uploaded image
        filename = str(uuid.uuid4()) + ".jpg"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        # --- Step 1: Run ML prediction ---
        result = predict_disease(file_path)
        predicted_class = result["predicted_class"]
        severity = result.get("severity", "Moderate")

        # --- Step 2: Save prediction to DB ---
        lat = float(location.get("latitude", 0))
        lon = float(location.get("longitude", 0))
        pred_id = save_prediction_to_db(lat, lon, result)  # store explanation as NULL initially
        print("Saved prediction to DB with ID:", pred_id)

        # --- Step 3: Run Gemini explanation in background ---
        executor.submit(save_explanation_async, pred_id, predicted_class, severity, lat, lon)

        # --- Step 4: Remove temp image ---
        os.remove(file_path)

        # --- Step 5: Return prediction immediately ---
        response_data = {
            "id": pred_id,  # return this so frontend can later fetch explanation
            "predicted_class": predicted_class,
            "confidence": result["confidence"],
            "severity": severity,
            "latitude": lat,
            "longitude": lon,
            "explanation": "Generating explanation, please wait..."
        }

        return jsonify(response_data)

    elif request.method == "GET":
        # --- Fetch explanation by ID ---
        pred_id = request.args.get("id")
        if not pred_id:
            return jsonify({"error": "Missing id parameter"}), 400

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT prediction, explanation FROM predictions WHERE id=?", (pred_id,))
        row = cursor.fetchone()
        conn.close()

        if not row:
            return jsonify({"error": "Invalid prediction id"}), 404

        prediction, explanation = row
        return jsonify({
            "id": pred_id,
            "prediction": prediction,
            "explanation": explanation if explanation else "Generating explanation..."
        })



# ------------------- FETCH API -------------------
@app.route("/heatmap", methods=["GET"])
def get_results():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, latitude, longitude, predicted_class, confidence, severity, timestamp FROM predictions")
    rows = cursor.fetchall()
    conn.close()

    results = [
        {
            "id": row[0],
            "latitude": row[1],
            "longitude": row[2],
            "predicted_class": row[3],
            "confidence": row[4],
            "severity": row[5],
            "timestamp": row[6]
        }
        for row in rows
    ]

    return jsonify(results)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

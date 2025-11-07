from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from pydantic import BaseModel
import os

# ✅ Initialize FastAPI app
app = FastAPI(
    title="CropBot API",
    description="🌾 Smart crop recommendation API based on soil and climate conditions",
    version="2.0"
)

# ✅ Allow frontend connection (Vite React on localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for security, replace with ["http://localhost:5173"] in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ✅ Locate dataset (works regardless of where server runs from)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, "Crop_recommendation.csv")

# ✅ Load dataset safely
try:
    data = pd.read_csv(csv_path)
except FileNotFoundError:
    raise RuntimeError(f"❌ Could not find Crop_recommendation.csv in: {csv_path}")

# ✅ Prepare features and labels
X = data[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = data['label']

# ✅ Train RandomForest model
model = RandomForestClassifier(random_state=42)
model.fit(X, y)

# ✅ Define input schema
class SoilInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

# ✅ Root route (sanity check)
@app.get("/")
def home():
    return {
        "message": "✅ CropBot API is running successfully!",
        "info": "Use /docs to test or POST soil data to /predict for recommendations."
    }

# ✅ Predict route with error handling & validation
@app.post("/predict")
def predict_crop(soil: SoilInput):
    # Step 1 — Validate soil input ranges
    if not (0 <= soil.N <= 300 and 0 <= soil.P <= 300 and 0 <= soil.K <= 300):
        return {"error": "⚠️ N, P, or K values seem invalid. Please enter between 0 and 300."}

    if not (0 <= soil.temperature <= 60):
        return {"error": "⚠️ Temperature value seems invalid. Please enter between 0°C and 60°C."}

    if not (0 <= soil.humidity <= 100):
        return {"error": "⚠️ Humidity must be between 0% and 100%."}

    if not (0 <= soil.ph <= 14):
        return {"error": "⚠️ pH value must be between 0 and 14."}

    if not (0 <= soil.rainfall <= 1000):
        return {"error": "⚠️ Rainfall value seems unrealistic. Please enter between 0mm and 1000mm."}

    # Step 2 — Make prediction
    try:
        features = [[
            soil.N, soil.P, soil.K,
            soil.temperature, soil.humidity, soil.ph, soil.rainfall
        ]]
        prediction = model.predict(features)[0]

        # Step 3 — Return with confidence (top prediction probability)
        confidence = max(model.predict_proba(features)[0]) * 100
        confidence = round(confidence, 2)

        return {
            "recommended_crop": prediction,
            "confidence": f"{confidence}%",
            "message": f"🌾 Based on your soil and climate conditions, I recommend growing **{prediction}**."
        }

    except Exception as e:
        return {"error": f"⚠️ Unable to make prediction due to an internal error: {str(e)}"}

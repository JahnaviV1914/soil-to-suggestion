import streamlit as st
import pickle
import numpy as np
import os

st.set_page_config(page_title="Crop Recommendation System", page_icon="🌾", layout="centered")

st.title("🌾 Crop Recommendation Chatbot 🌾")
st.write("Enter your soil and climate details to get the best crop recommendation!")

# --- Input fields ---
N = st.number_input("Nitrogen (N)", min_value=0, max_value=300, value=90)
P = st.number_input("Phosphorous (P)", min_value=0, max_value=300, value=42)
K = st.number_input("Potassium (K)", min_value=0, max_value=300, value=43)
temperature = st.number_input("Temperature (°C)", min_value=0.0, max_value=60.0, value=25.0)
humidity = st.number_input("Humidity (%)", min_value=0.0, max_value=100.0, value=70.0)
ph = st.number_input("pH value", min_value=0.0, max_value=14.0, value=6.5)
rainfall = st.number_input("Rainfall (mm)", min_value=0.0, max_value=1000.0, value=200.0)

# --- Prediction Section ---
if st.button("🌱 Predict Crop"):
    try:
        # Load trained model
        model_path = os.path.join(os.path.dirname(__file__), "crop_model.pkl")

        if not os.path.exists(model_path):
            st.error("❌ Model file not found. Please ensure crop_model.pkl is uploaded correctly.")
        else:
            with open(model_path, "rb") as file:
                model = pickle.load(file)

            # Predict the best crop
            features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
            result = model.predict(features)[0]
            st.success(f"✅ Recommended Crop: **{result}** 🌿")
    except Exception as e:
        st.error(f"⚠️ Error: {e}")

# --- Chatbot Section ---
st.markdown("---")
st.subheader("💬 Chatbot Assistant")

user_input = st.text_input("Ask something about crop farming:")
if user_input:
    st.write("🤖 Chatbot:", "I'm learning to assist you with crop and soil insights! 🌾")

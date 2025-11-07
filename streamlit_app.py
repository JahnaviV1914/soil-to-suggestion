import streamlit as st
import pickle
import numpy as np

st.title("🌾 Crop Recommendation Chatbot 🌾")

st.write("Enter soil details to get the best crop suggestion!")

# Example input fields
N = st.number_input("Nitrogen (N)", min_value=0)
P = st.number_input("Phosphorous (P)", min_value=0)
K = st.number_input("Potassium (K)", min_value=0)
temperature = st.number_input("Temperature (°C)")
humidity = st.number_input("Humidity (%)")
ph = st.number_input("pH value")
rainfall = st.number_input("Rainfall (mm)")

if st.button("Predict Crop"):
    # Load your trained ML model
    model = pickle.load(open("crop_model.pkl", "rb"))
    result = model.predict([[N, P, K, temperature, humidity, ph, rainfall]])
    st.success(f"Recommended Crop: 🌱 {result[0]}")

st.markdown("---")
st.subheader("💬 Chatbot Assistant")

user_input = st.text_input("Ask something about crop farming:")
if user_input:
    st.write("🤖 Chatbot:", "I'm learning to assist you with crop suggestions!")

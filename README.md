
# Run and deploy my app

This contains everything you need to run your app locally.

View my app : (https://ai.studio/apps/drive/1Tt8waSM9MKa8CYvQpXvLRx4LQ4qT0ASq?fullscreenApplet=true)
---
IngrediSense AI Chatbot 🍽️🤖

IngredientSense is an AI-powered chatbot designed to analyze food ingredients and nutrition facts to provide clear, user-friendly health insights. The project helps users understand whether a packaged food or snack is healthy by breaking down fats, sugar, sodium, calories, and key nutrients, along with practical cautions and trade-offs.

🚀 Features

🧠 AI-based ingredient and nutrition analysis

📊 Interprets nutrition facts (calories, fats, sugar, sodium, vitamins, minerals)

✅ Highlights positives (healthy fats, minerals, low sugar, etc.)

⚠️ Flags potential concerns (high sodium, calorie density, additives)

📝 Simple, human-readable explanations (not just raw numbers)

💬 Chatbot-style interaction for easy use


🛠️ Tech Stack

Frontend: Streamlit / Web UI (HTML, CSS, JS – if integrated)

Backend: Python

AI/NLP: Rule-based logic + ML/NLP models (optional integration)

Libraries: Pandas, NumPy, scikit-learn (as applicable)


📂 Project Structure

ingredisense/
│── app.py                # Main application file
│── models/               # ML models (if used)
│── data/                 # Nutrition or ingredient datasets
│── utils/                # Helper functions
│── requirements.txt      # Dependencies
│── README.md             # Project documentation

▶️ How to Run

1. Clone the repository:



git clone (https://github.com/rohitkorpal/Ingredisense/tree/main)
cd ingredisense

2. Install dependencies:



pip install -r requirements.txt

3. Run the app:



streamlit run app.py

📌 Use Case Examples

Analyze packaged snacks using nutrition labels

Compare healthy vs unhealthy food options

Educational tool for nutrition awareness

Base system for diet, fitness, or health-tech apps


⚠️ Disclaimer

IngredientSense provides informational insights only. It is not a medical or dietary substitute. Always consult a healthcare or nutrition professional for personalized advice.

🌱 Future Improvements

Barcode scanning & image-based label extraction

Personalized recommendations based on age/fitness goals

Multi-language support

Integration with food databases (USDA, FSSAI, etc.)


👤 Author

Rohit Korpal And Jatin Nagarwal


---

⭐ If you like this project, don’t forget to star the repository!
## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

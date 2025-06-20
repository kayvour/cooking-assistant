# Cooking Assistant 

A Flask-based web app that scrapes recipes from URLs and guides you hands-free through cooking with voice-controlled, step-by-step instructions.

![image](https://github.com/user-attachments/assets/a7f5116b-03c1-466e-8127-6ada6a3f4879)

🌐 [Live Demo](https://cooking-assistant-phi.vercel.app/)
📖 [View Changelog](./changelog.md)

---

## 📝 What It Does
Cooking Assistant helps you cook smarter by:

- Scraping recipes from user-provided URLs using [`recipe_scrapers`](https://pypi.org/project/recipe-scrapers/)
- Displaying ingredient lists and instructions.
- Offering a **Focus Mode** with voice navigation so you can cook hands-free.
- Using the **Web Speech API** for speech recognition and text-to-speech

---

## 🚀 Features
- Enter any recipe URL to automatically extract:
  - Title  
  - Ingredients  
  - Step-by-step instructions
- Focus Mode:
  - Narrates one instruction at a time
  - Responds to voice commands:  
    - **"next"** – go to the next step  
    - **"previous"** – go back one step  
    - **"repeat"** – repeat current step  
    - **"exit"** – leave Focus Mode
- Automatic Timer from recipes: When a recipe step includes durations (e.g. “Bake for 20 minutes”):
   - Timer is automatically detected and displayed on screen.
   - Alerts you when the time is up.
- Runs entirely in the browser with no extensions required.

---

## ⚙️ Getting Started
1. Clone the repository:
git clone https://github.com/kayvour/cooking-assistant.git cd cooking-assistant

3. Install dependencies:
pip install -r requirements.txt

4. Run the application:
python app.py

5. Open your browser and go to:
http://127.0.0.1:5000/

## 🧑‍🍳 How to Use
- Paste a recipe URL into the input field on the homepage.
- Click **Start Cooking** to fetch and view the recipe details.
- Enter Focus Mode to hear steps read aloud.
- Activate and navigate through steps using voice commands:  
  - **"next"** — move to the next step  
  - **"previous"** — go back a step  
  - **"repeat"** — repeat the current step  
  - **"exit"** — leave Focus Mode  
- For best results, use Chrome and grant microphone access when prompted.

## 🧰 Tech Stack
- 🐍 Python 3.10
- ⚗️ Flask Web Framework
- 📄 recipe-scrapers
- 🗣️ Web Speech API
- 🎨 HTML, CSS, JavaScript
- ☁️ Vercel

## 📌 Notes
- Speech recognition works best in Chrome due to Web Speech API support.
- Microphone permissions are required for voice commands.
- Focus Mode requires modern browsers with Web Speech API and JavaScript enabled.

## 🔮 Future Improvements
- Add user accounts and recipe saving functionality.
- Expand community features for recipe sharing.
- Add mobile support.
- Ingredient scaling with automatic measurement conversion.
- Add ability to search previously viewed recipes.

## 🤝 Contributing
Contributions are welcome! feel free to fork the repository and submit a pull request. For major changes, open an issue to discuss first.

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

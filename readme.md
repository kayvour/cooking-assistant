# Cooking Assistant 🍳

A Flask-based web app that scrapes recipes from URLs and guides you hands-free through cooking with voice-controlled, step-by-step instructions.

🌐 [Live Demo](https://cooking-assistant-phi.vercel.app/)

---

## 📝 What It Does

Cooking Assistant helps you cook smarter by:

- Scraping recipes from user-provided URLs using [`recipe_scrapers`](https://pypi.org/project/recipe-scrapers/)
- Displaying clear, structured ingredient lists and instructions
- Offering a **Focus Mode** with voice navigation so you can cook without touching your screen
- Using the **Web Speech API** for speech recognition and text-to-speech
- Planning future features like a **community page** for recipe sharing and interaction

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
   - Timer is automatically detected
   - Countdown is displayed on-screen
   - Alerts you when the time is up
- Clean, responsive interface powered by custom CSS and JavaScript
- Runs entirely in the browser with no extensions required

---

## 📁 Project Structure

```
cooking-assistant/
├── app.py                        # Flask backend
├── requirements.txt              # Python dependencies
├── vercel.json                   # Vercel deployment configuration
├── changelog.md                  # Project changelog
├── LICENSE                       # License info
├── readme.md                     # Project documentation
├── index.html                    # Landing page (static)
├── .gitattributes                # Git configuration

├── static/                       # Static files (served directly)
│   ├── css/
│   │   ├── focus_mode.css        # Styles for focus mode
│   │   └── style.css             # General styles
│   ├── images/
│   │   └── bg.jpg                # Background image
│   └── js/
│       ├── focus_mode.js         # JS for focus mode narration & controls
│       └── script.js             # General interaction scripts

├── templates/                    # Flask Jinja2 templates
│   ├── assistant.html            # Assistant interface page
│   ├── community.html           # Community recipe page
│   └── focus_mode.html          # Voice/narration mode interface

```


---

## ⚙️ Getting Started

1. Clone the repository:

git clone https://github.com/kayvour/cooking-assistant.git
cd cooking-assistant

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
- Navigate through steps using voice commands:  
  - **"next"** — move to the next step  
  - **"previous"** — go back a step  
  - **"repeat"** — repeat the current step  
  - **"exit"** — leave Focus Mode  
- For best results, use Chrome and grant microphone access when prompted.

## 📌 Notes

- Speech recognition works best in Chrome due to Web Speech API support.
- Microphone permissions are required for voice commands.
- If recipe scraping fails, an error message will be shown.
- Focus Mode requires modern browsers with Web Speech API and JavaScript enabled.

## 🔮 Future Improvements

- Add user accounts and recipe saving functionality.
- Expand community features for recipe sharing and feedback.
- Enhance voice recognition robustness and add multi-language support.
- Add mobile support
- Enhance navigation and bookmark specific steps
- Ingredient scaling with automatic measurement conversion
- Add ability to search previously viewed recipes

## 🤝 Contributing

Contributions are welcome! If you have suggestions, improvements, or bug fixes, please fork the repository and submit a pull request. For major changes, feel free to open an issue to discuss first.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📬 Contact

For questions, feedback, or collaboration, open an issue or reach out via the repo.

Cooking Assistant aims to make cooking more accessible and enjoyable by integrating voice technology into your kitchen experience — whether you’re a beginner or a seasoned chef!

# Cooking Assistant 🍳

A Flask-based web app that scrapes recipes from URLs and guides you hands-free through cooking with voice-controlled, step-by-step instructions.

---

## Overview

- Scrapes recipes from user-provided URLs using the [`recipe_scrapers`](https://pypi.org/project/recipe-scrapers/) library.
- Provides a detailed view with ingredients and step-by-step instructions.
- Includes a Focus Mode for guided cooking steps with voice control and speech synthesis.
- Community page planned for future user engagement features.

---

## Features

- Input any recipe URL to fetch recipe details: title, ingredients, and instructions.
- Focus Mode presents instructions one step at a time with voice narration.
- Voice commands supported in Focus Mode: **"next"**, **"previous"**, **"repeat"**, and **"exit"**.
- Responsive UI with custom CSS and JavaScript for smooth interaction.
- Utilizes Web Speech API for speech synthesis and recognition.

---

## Folder Structure

- `app.py` — Flask backend application  
- `requirements.txt` — Python dependencies  
- `static/css/style.css` — Stylesheet  
- `static/js/script.js` — JavaScript for recipe extraction UI  
- `static/js/focus_mode.js` — JavaScript handling Focus Mode and voice commands  
- `static/images/bg.jpg` — Background image asset  
- `templates/` — HTML templates (`home.html`, `assistant.html`, `focus_mode.html`, `community.html`)

---

## Installation & Running

1. Clone the repository:

   ```bash
   git clone https://github.com/kayvour/cooking-assistant.git
   cd cooking-assistant

2. Install dependencies:
pip install -r requirements.txt

3. Run the application:
python app.py

4. Open your browser and go to:
http://127.0.0.1:5000/

## Usage

- Paste a recipe URL into the input field on the homepage.
- Click **Start Cooking** to fetch and view the recipe details.
- Enter Focus Mode to hear steps read aloud.
- Navigate through steps using voice commands:  
  - **"next"** — move to the next step  
  - **"previous"** — go back a step  
  - **"repeat"** — repeat the current step  
  - **"exit"** — leave Focus Mode  
- For best results, use Chrome and grant microphone access when prompted.

## Notes

- Speech recognition works best in Chrome due to Web Speech API support.
- Microphone permissions are required for voice commands.
- If recipe scraping fails, an error message will be shown.
- Focus Mode requires modern browsers with Web Speech API.

## Future Improvements

- Add user accounts and recipe saving functionality.
- Expand community features for recipe sharing and feedback.
- Enhance voice recognition robustness and add multi-language support.

## Contributing

Contributions are welcome! If you have suggestions, improvements, or bug fixes, please fork the repository and submit a pull request. For major changes, feel free to open an issue to discuss first.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For inquiries or feedback, open an issue in the repository or reach out to the maintainer.


Cooking Assistant aims to make cooking more accessible and enjoyable by integrating voice technology into your kitchen experience — whether you’re a beginner or a seasoned chef!

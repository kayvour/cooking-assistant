Recipe Assistant Web App
========================

- Overview:
  - A Flask-based web application that scrapes recipes from user-provided URLs.
  - Provides a detailed view with ingredients and step-by-step instructions.
  - Includes a Focus Mode for guided cooking steps with voice control and speech synthesis.
  - Community page for future user engagement features.

- Features:
  - URL input to fetch recipe details using the 'recipe_scrapers' library.
  - Displays recipe title, ingredients list, and instructions.
  - Focus Mode presents instructions one step at a time with voice narration.
  - Voice commands in Focus Mode: "next", "previous", "repeat", and "exit".
  - Responsive UI with custom CSS and JavaScript for smooth interaction.

- Folder Structure:
  - app.py                : Flask application backend.
  - requirements.txt      : Python dependencies.
  - static/css/style.css  : Stylesheet.
  - static/js/script.js   : JavaScript for recipe extraction UI.
  - static/js/focus_mode.js : JavaScript handling Focus Mode and voice commands.
  - static/images/bg.jpg  : Background image asset.
  - templates/            : HTML templates including home.html, assistant.html, focus_mode.html, community.html.

- How to Run:
  1. Install dependencies using:
     pip install -r requirements.txt
  2. Run the app:
     python app.py
  3. Open your browser at:
     http://127.0.0.1:5000/

- Notes:
  - Speech recognition works best in Chrome and may require microphone permissions.
  - Focus Mode requires Web Speech API support.
  - If scraping fails, an error message will be shown.

- Future Improvements:
  - Add user accounts and recipe saving.
  - Expand community features.
  - Improve voice recognition robustness and multi-language support.


# Changelog

All notable changes to this project will be documented in this file.

This changelog follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format and adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] – 2025-06-18

### Added
- **Automatic Timer Detection**  
  When recipe steps include durations (e.g., “Bake for 20 minutes”), the app now automatically:
  - Starts a countdown timer
  - Displays the timer in Focus Mode
  - Alerts the user when the timer ends (via audio + visual)

### Changed
- Enhanced `focus_mode.js` to parse time-related phrases and manage timers.
- UI updated to display countdowns inline with step instructions in Focus Mode.

---

## [1.0.1] – 2025-06-05

### Added
- Dark mode support across all pages.
- GitHub repository link in the navigation/header.

### Changed
- Minor CSS tweaks to improve appearance in dark mode.

---

## [1.0.0] – 2025-06-01

### Initial Release
- Flask-based Cooking Assistant web app.
- Recipe scraping from user-provided URLs using `recipe_scrapers`.
- Step-by-step cooking instructions with ingredient lists.
- Focus Mode with voice narration using the Web Speech API.
- Voice command support: `next`, `previous`, `repeat`, `exit`.
- Responsive frontend using HTML, CSS, and vanilla JavaScript.

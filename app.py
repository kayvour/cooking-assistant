from flask import Flask, render_template, request, redirect, url_for, session
from recipe_scrapers import scrape_me

app = Flask(__name__)
app.secret_key = 'supersecretkey'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/assistant', methods=['GET', 'POST'])
def assistant():
    error = None
    title = None
    ingredients = []
    instructions = []
    url = None

    if request.method == 'POST':
        url = request.form.get('url')
        try:
            scraper = scrape_me(url)
            title = scraper.title()
            ingredients = scraper.ingredients()

            raw_instructions = scraper.instructions()
            if raw_instructions and isinstance(raw_instructions, str):
                instructions = [step.strip() for step in raw_instructions.split('\n') if step.strip()]
            else:
                instructions = []

            # Store for Focus Mode
            session['focus_title'] = title
            session['focus_instructions'] = instructions

        except Exception:
            error = "Sorry, couldn't fetch recipe from the URL."

    return render_template(
        'assistant.html',
        title=title,
        ingredients=ingredients,
        instructions=instructions,
        error=error,
        url=url
    )

@app.route('/focus-mode')
def focus_mode():
    title = session.get('focus_title', "Recipe")
    instructions = session.get('focus_instructions', [])

    if not instructions:
        return redirect(url_for('assistant'))

    return render_template(
        'focus_mode.html',
        title=title,
        instructions=instructions
    )

@app.route('/community')
def community():
    return render_template('community.html')

if __name__ == '__main__':
    app.run(debug=True)

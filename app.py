import os
from flask import Flask, request, redirect, url_for, session, send_file, render_template
from recipe_scrapers import scrape_me

app = Flask(__name__)
app.secret_key = 'supersecretkey'

@app.route('/')
def index():
    return send_file('index.html')

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
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)

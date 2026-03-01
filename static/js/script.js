
// Dark mode toggle function
function toggleTheme() {
  const body = document.body;
  const icon = document.getElementById('theme-icon');
  const currentTheme = body.getAttribute('data-theme');

  if (currentTheme === 'dark') {
    body.removeAttribute('data-theme');
    icon.textContent = '🌙';
    localStorage.setItem('theme', 'light');  // ← persist
  } else {
    body.setAttribute('data-theme', 'dark');
    icon.textContent = '☀️';
    localStorage.setItem('theme', 'dark');   // ← persist
  }
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
  const icon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('theme');  // ← restore

  if (savedTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    icon.textContent = '☀️';
  } else {
    icon.textContent = '🌙';
  }
});

// Existing recipe extraction code
document.addEventListener('DOMContentLoaded', function() {
  const extractBtn = document.getElementById('extract-btn');
  
  if (extractBtn) {
    extractBtn.addEventListener('click', () => {
      const url = document.getElementById('url-input').value.trim();
      const errorDiv = document.getElementById('error-msg');
      const ingredientsSection = document.getElementById('ingredients-section');
      const instructionsSection = document.getElementById('instructions-section');
      const ingredientsList = document.getElementById('ingredients-list');
      const instructionsList = document.getElementById('instructions-list');

      errorDiv.textContent = '';
      ingredientsSection.style.display = 'none';
      instructionsSection.style.display = 'none';
      ingredientsList.innerHTML = '';
      instructionsList.innerHTML = '';

      if (!url) {
        errorDiv.textContent = 'Please enter a valid URL.';
        return;
      }

      fetch('/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            errorDiv.textContent = data.error;
            return;
          }

          // Show ingredients
          ingredientsSection.style.display = 'block';
          data.ingredients.forEach(ingredient => {
            const li = document.createElement('li');
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
          });

          // Show instructions
          instructionsSection.style.display = 'block';
          data.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            instructionsList.appendChild(li);
          });
        })
        .catch(err => {
          errorDiv.textContent = 'Failed to fetch recipe. Please try again later.';
          console.error(err);
        });
    });
  }
});

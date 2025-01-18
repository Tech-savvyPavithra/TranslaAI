document.addEventListener('DOMContentLoaded', function () {
    const translateButton = document.getElementById('translate-button');
    const translatedTextElement = document.getElementById('translated-text');

    translateButton.addEventListener('click', () => {
        const text = document.getElementById('user-input').value;
        const targetLanguage = document.getElementById('language-select').value;

        fetch('/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, target_language: targetLanguage })
        })
            .then(response => response.json())
            .then(data => {
                if (data.translated_text) {
                    translatedTextElement.textContent = data.translated_text;
                } else {
                    translatedTextElement.textContent = `Error: ${data.error}`;
                }
            })
            .catch(error => {
                translatedTextElement.textContent = `Error: ${error.message}`;
            });
    });
});

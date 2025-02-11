from flask import Flask, render_template, request, jsonify
from googletrans import Translator

app = Flask(__name__)

translator = Translator()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
    data = request.get_json()
    text = data.get('text')
    target_language = data.get('target_language')

    if not text or not target_language:
        return jsonify({'error': 'Invalid input'}), 400

    try:
        translation = translator.translate(text, dest=target_language)
        return jsonify({'translated_text': translation.text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
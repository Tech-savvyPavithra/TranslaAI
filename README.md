TranslaAI - Multilingual Translation Web App
TranslaAI is a Flask-based web application that allows users to translate text between multiple languages. It uses Google Translate API to offer real-time text translation, 
making it a useful tool for language learning, communication, and global interaction.

Features:
● Multilingual Support: Choose from a wide variety of languages for both source and target.
● Real-Time Translation: Enter text and select the target language to get an instant translation.
● Responsive Design: The app is designed to work on desktops and mobile devices.

Technologies Used:
● Flask: A lightweight Python web framework to handle the backend.
● Google Translate API: For translating the text to the target language.
● HTML/CSS: For the front-end user interface.
● JavaScript: For handling API calls and dynamic updates.

Installation:
Prerequisites:
Before you begin, make sure you have Python 3.x and pip installed on your system.

Steps:
Clone this repository:
git clone https://github.com/yourusername/TranslaAI.git

Navigate to the project directory:
cd TranslaAI

Create a virtual environment:
python3 -m venv venv

Activate the virtual environment:
On macOS/Linux:
source venv/bin/activate

On Windows:
.\venv\Scripts\activate

Install the required dependencies:
pip install -r requirements.txt

Run the Flask app:
python app.py

The app should now be running at http://127.0.0.1:8080.

Usage:
● Open the app in your browser (http://127.0.0.1:8080).
● Type the text you want to translate in the text area.
● Select the target language from the dropdown list.
● Click the "Translate" button to get the translated text.

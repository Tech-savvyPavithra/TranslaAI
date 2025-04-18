document.addEventListener('DOMContentLoaded', function () {
    const translateButton = document.getElementById('translate-button');
    const translatedTextElement = document.getElementById('translated-text');
    const speakButton = document.getElementById('speak-button');
    const languageSelect = document.getElementById('language-select');

    // Store the last translation result
    let lastTranslation = null;
    
    // Check speech synthesis support immediately
    const speechSynthesisSupported = ('speechSynthesis' in window);
    if (!speechSynthesisSupported) {
        speakButton.disabled = true;
        speakButton.title = 'Text-to-speech not supported in your browser';
        speakButton.classList.add('tts-disabled');
    }

    translateButton.addEventListener('click', () => {
        const text = document.getElementById('user-input').value;
        const targetLanguage = languageSelect.value;

        if (!text.trim()) {
            translatedTextElement.textContent = 'Please enter text to translate';
            return;
        }

        translateButton.disabled = true;
        translateButton.textContent = 'Translating...';

        fetch('/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, target_language: targetLanguage })
        })
            .then(response => response.json())
            .then(data => {
                if (data.translated_text) {
                    translatedTextElement.textContent = data.translated_text;
                    lastTranslation = {
                        text: data.translated_text,
                        language: targetLanguage
                    };
                    
                    // Check if speech is available for this language
                    const langCode = getSpeechSynthesisLangCode(targetLanguage);
                    const isSpeechAvailable = checkIfVoiceAvailable(langCode);
                    
                    if (speechSynthesisSupported && isSpeechAvailable) {
                        speakButton.disabled = false;
                        speakButton.classList.remove('tts-disabled');
                        speakButton.classList.add('tts-enabled');
                    } else {
                        speakButton.disabled = true;
                        speakButton.classList.remove('tts-enabled');
                        speakButton.classList.add('tts-disabled');
                        if (speechSynthesisSupported) {
                            speakButton.title = 'Text-to-speech not available for this language';
                        }
                    }
                } else {
                    translatedTextElement.textContent = `Error: ${data.error || 'Unknown error'}`;
                    speakButton.disabled = true;
                    speakButton.classList.remove('tts-enabled');
                    speakButton.classList.add('tts-disabled');
                }
            })
            .catch(error => {
                translatedTextElement.textContent = `Error: ${error.message}`;
                speakButton.disabled = true;
                speakButton.classList.remove('tts-enabled');
                speakButton.classList.add('tts-disabled');
            })
            .finally(() => {
                translateButton.disabled = false;
                translateButton.textContent = 'Translate';
            });
    });

    // Check if a voice is available for the given language code
    function checkIfVoiceAvailable(langCode) {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) return false;
        
        // Check if any voice supports this language
        return voices.some(voice => {
            return voice.lang === langCode || 
                   voice.lang.startsWith(langCode.split('-')[0] + '-');
        });
    }

    // Speak functionality
    speakButton.addEventListener('click', () => {
        if (!lastTranslation) {
            alert('No translated text available to speak');
            return;
        }

        speakButton.disabled = true;
        speakButton.textContent = 'Speaking...';

        const utterance = new SpeechSynthesisUtterance(lastTranslation.text);
        utterance.lang = getSpeechSynthesisLangCode(lastTranslation.language);
        
        utterance.onend = () => {
            speakButton.disabled = false;
            speakButton.textContent = 'Speak Translation';
        };

        utterance.onerror = (event) => {
            console.error('SpeechSynthesis error:', event);
            alert('Error speaking text. This language might not be supported for speech in your browser.');
            speakButton.disabled = false;
            speakButton.textContent = 'Speak Translation';
        };

        window.speechSynthesis.speak(utterance);
    });

    // Comprehensive language code mapping with availability check
    function getSpeechSynthesisLangCode(googleLangCode) {
        const langMap = {
            'af': 'af-ZA',    // Afrikaans
            'sq': 'sq-AL',    // Albanian
            'am': 'am-ET',    // Amharic
            'ar': 'ar-SA',    // Arabic
            'hy': 'hy-AM',    // Armenian
            'az': 'az-AZ',    // Azerbaijani
            'eu': 'eu-ES',    // Basque
            'be': 'be-BY',    // Belarusian
            'bn': 'bn-BD',    // Bengali
            'bs': 'bs-BA',    // Bosnian
            'bg': 'bg-BG',    // Bulgarian
            'ca': 'ca-ES',    // Catalan
            'ceb': 'fil-PH',  // Cebuano (using Filipino)
            'ny': 'ny-MW',    // Chichewa (Nyanja)
            'zh-cn': 'zh-CN', // Chinese (Simplified)
            'zh-tw': 'zh-TW', // Chinese (Traditional)
            'co': 'co-FR',    // Corsican
            'hr': 'hr-HR',    // Croatian
            'cs': 'cs-CZ',    // Czech
            'da': 'da-DK',    // Danish
            'nl': 'nl-NL',    // Dutch
            'en': 'en-US',    // English
            'eo': 'eo',       // Esperanto (no country code)
            'et': 'et-EE',    // Estonian
            'tl': 'fil-PH',   // Filipino
            'fi': 'fi-FI',    // Finnish
            'fr': 'fr-FR',    // French
            'fy': 'fy-NL',    // Frisian
            'gl': 'gl-ES',    // Galician
            'ka': 'ka-GE',    // Georgian
            'de': 'de-DE',    // German
            'el': 'el-GR',    // Greek
            'gu': 'gu-IN',    // Gujarati
            'ht': 'ht-HT',    // Haitian Creole
            'ha': 'ha-NG',    // Hausa
            'haw': 'haw-US',  // Hawaiian
            'iw': 'he-IL',    // Hebrew
            'hi': 'hi-IN',    // Hindi
            'hmn': 'hmn',     // Hmong (no country code)
            'hu': 'hu-HU',    // Hungarian
            'is': 'is-IS',    // Icelandic
            'ig': 'ig-NG',    // Igbo
            'id': 'id-ID',    // Indonesian
            'ga': 'ga-IE',    // Irish
            'it': 'it-IT',    // Italian
            'ja': 'ja-JP',    // Japanese
            'jw': 'jv-ID',    // Javanese
            'kn': 'kn-IN',    // Kannada
            'kk': 'kk-KZ',    // Kazakh
            'km': 'km-KH',    // Khmer
            'rw': 'rw-RW',    // Kinyarwanda
            'ko': 'ko-KR',    // Korean
            'ku': 'ku-TR',    // Kurdish (Turkey)
            'ky': 'ky-KG',    // Kyrgyz
            'lo': 'lo-LA',    // Lao
            'la': 'la',       // Latin (no country code)
            'lv': 'lv-LV',    // Latvian
            'lt': 'lt-LT',    // Lithuanian
            'lb': 'lb-LU',    // Luxembourgish
            'mk': 'mk-MK',    // Macedonian
            'mg': 'mg-MG',    // Malagasy
            'ms': 'ms-MY',    // Malay
            'ml': 'ml-IN',    // Malayalam
            'mt': 'mt-MT',    // Maltese
            'mi': 'mi-NZ',    // Maori
            'mr': 'mr-IN',    // Marathi
            'mn': 'mn-MN',    // Mongolian
            'my': 'my-MM',    // Myanmar (Burmese)
            'ne': 'ne-NP',    // Nepali
            'no': 'nb-NO',    // Norwegian Bokmål
            'or': 'or-IN',    // Odia
            'ps': 'ps-AF',    // Pashto
            'fa': 'fa-IR',    // Persian
            'pl': 'pl-PL',    // Polish
            'pt': 'pt-PT',    // Portuguese
            'pa': 'pa-IN',    // Punjabi
            'ro': 'ro-RO',    // Romanian
            'ru': 'ru-RU',    // Russian
            'sm': 'sm-WS',    // Samoan
            'gd': 'gd-GB',    // Scots Gaelic
            'sr': 'sr-RS',    // Serbian
            'st': 'st-LS',    // Sesotho
            'sn': 'sn-ZW',    // Shona
            'sd': 'sd-PK',    // Sindhi
            'si': 'si-LK',    // Sinhala
            'sk': 'sk-SK',    // Slovak
            'sl': 'sl-SI',    // Slovenian
            'so': 'so-SO',    // Somali
            'es': 'es-ES',    // Spanish
            'su': 'su-ID',    // Sundanese
            'sw': 'sw-KE',    // Swahili
            'sv': 'sv-SE',    // Swedish
            'tg': 'tg-TJ',    // Tajik
            'ta': 'ta-IN',    // Tamil
            'tt': 'tt-RU',    // Tatar
            'te': 'te-IN',    // Telugu
            'th': 'th-TH',    // Thai
            'tr': 'tr-TR',    // Turkish
            'tk': 'tk-TM',    // Turkmen
            'uk': 'uk-UA',    // Ukrainian
            'ur': 'ur-PK',    // Urdu
            'ug': 'ug-CN',    // Uyghur
            'uz': 'uz-UZ',    // Uzbek
            'vi': 'vi-VN',    // Vietnamese
            'cy': 'cy-GB',    // Welsh
            'xh': 'xh-ZA',    // Xhosa
            'yi': 'yi',      // Yiddish (no country code)
            'yo': 'yo-NG',    // Yoruba
            'zu': 'zu-ZA'     // Zulu
        };

        // Return the mapped code or try with just the language code
        return langMap[googleLangCode] || googleLangCode;
    }

    // Check for speech synthesis support on page load
    function checkSpeechSupport() {
        if (!speechSynthesisSupported) {
            console.log('Speech synthesis not supported in this browser.');
            return;
        }

        // Additional check for specific language support
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
            window.speechSynthesis.onvoiceschanged = function() {
                const updatedVoices = window.speechSynthesis.getVoices();
                if (updatedVoices.length > 0) {
                    console.log('Available voices:', updatedVoices);
                }
            };
        } else {
            console.log('Available voices:', voices);
        }
    }

    // Initial check
    checkSpeechSupport();
});
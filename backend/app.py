from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
import google.generativeai as genai
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configure Gemini
try:
    GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
    if not GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")
    genai.configure(api_key=GOOGLE_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
except Exception as e:
    logger.error(f"Failed to configure Gemini: {str(e)}")
    raise

class WebsiteAnalyzer:
    def scrape_website(self, url: str) -> str:
        """Scrape website content safely."""
        try:
            if not url.startswith(('http://', 'https://')):
                url = 'https://' + url
            
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            return response.text
        except requests.exceptions.RequestException as e:
            logger.error(f"Failed to scrape website {url}: {str(e)}")
            raise ValueError(f"Failed to access website: {str(e)}")

    def extract_content(self, html: str) -> str:
        """Extract and clean content from HTML."""
        try:
            soup = BeautifulSoup(html, 'html.parser')
            
            # Remove script and style elements
            for element in soup(['script', 'style']):
                element.decompose()
            
            # Get text and clean it
            text = ' '.join(soup.stripped_strings)
            # Limit content length for Gemini
            return text[:1500]  # Limit to first 1500 characters
        except Exception as e:
            logger.error(f"Failed to extract content: {str(e)}")
            raise ValueError("Failed to process website content")

    def analyze_with_gemini(self, content: str) -> dict:
        """Analyze content using Gemini."""
        try:
            prompt = f"""
            Analyze this website content and create 4 relevant categories or topics.
            Content: {content}

            Respond with only 4 options labeled A through D.
            Format your response exactly like this example:
            {{
                "question": "What information are you looking for?",
                "options": [
                    "A. Product Information",
                    "B. Technical Support",
                    "C. Company Overview",
                    "D. Contact Details"
                ]
            }}
            """

            response = model.generate_content(prompt)
            # Convert response to proper format
            result = eval(response.text)
            
            # Validate response format
            if not isinstance(result, dict) or 'question' not in result or 'options' not in result:
                raise ValueError("Invalid response format from Gemini")
            
            return result
        except Exception as e:
            logger.error(f"Gemini analysis failed: {str(e)}")
            # Return default options if analysis fails
            return {
                "question": "What would you like to know about this website?",
                "options": [
                    "A. General Information",
                    "B. Products and Services",
                    "C. Support and Help",
                    "D. Contact Information"
                ]
            }

    def analyze_website(self, url: str) -> dict:
        """Complete website analysis process."""
        try:
            html = self.scrape_website(url)
            content = self.extract_content(html)
            return self.analyze_with_gemini(content)
        except Exception as e:
            logger.error(f"Website analysis failed: {str(e)}")
            raise

analyzer = WebsiteAnalyzer()

@app.route('/api/analyze', methods=['POST'])
def analyze_website():
    """Handle website analysis requests."""
    try:
        data = request.get_json()
        if not data or 'url' not in data:
            return jsonify({'error': 'URL is required'}), 400

        url = data['url'].strip()
        if not url:
            return jsonify({'error': 'Empty URL provided'}), 400

        result = analyzer.analyze_website(url)
        return jsonify(result)

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({'error': 'Failed to analyze website'}), 500

@app.route('/api/respond', methods=['POST'])
def generate_response():
    """Handle response generation for selected options."""
    try:
        data = request.get_json()
        if not data or 'option' not in data or 'context' not in data:
            return jsonify({'error': 'Option and context are required'}), 400

        prompt = f"""
        The user selected "{data['option']}" on the website: {data['context']}
        Provide a helpful response and ask a relevant follow-up question.
        Keep the response concise and natural.
        """

        response = model.generate_content(prompt)
        return jsonify({'response': response.text.strip()})

    except Exception as e:
        logger.error(f"Response generation failed: {str(e)}")
        return jsonify({'error': 'Failed to generate response'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
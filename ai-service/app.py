# ai-service/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

app = Flask(__name__)
CORS(app)

# Configuration logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "IA Service Online", "port": 5001})

@app.route('/analyze-content', methods=['POST'])
def analyze_content():
    try:
        data = request.get_json()
        content = data.get('content', '')
        
        # Analyse simplifiée pour commencer
        analysis = {
            "sentiment": "POSITIVE",
            "difficulty": 0.6,
            "keywords": content.split()[:5],
            "word_count": len(content.split())
        }
        
        logger.info(f"Content analyzed: {len(content)} characters")
        return jsonify(analysis)
        
    except Exception as e:
        logger.error(f"Analysis error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 CBTC AI Service Starting...")
    app.run(host='0.0.0.0', port=5001, debug=True)

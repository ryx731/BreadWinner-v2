import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI

# 1. Load environment configurations from your local .env file
load_dotenv()

# 2. Local database structure imports
from app.models import db, Receipt, MenuItem

def create_app():
    app = Flask(__name__)
    
    # Configure CORS explicitly so Vite on port 5173 can send files safely
    CORS(app, resources={r"/api/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["POST", "GET", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }})
    
    # SQLite Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///celiac_app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    db.init_app(app)
    
    # ------------------------------------------------------------------
    # STANDALONE ROUTE HANDLER
    # ------------------------------------------------------------------
    @app.route('/api/receipts/upload', methods=['POST'])
    def upload_receipt():
        if 'file' not in request.files:
            return jsonify({"error": "No file part found in request payload"}), 400
            
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "Selected image file name is completely empty"}), 400

        try:
            # Mock OCR extraction data mimicking your grocery receipt layout
            sample_ocr_text = (
                "GIANT STORE\n"
                "1x Ore-Ida Crispy Straight Cut French Fried Potatoes $5.99\n"
                "2x Wholly Wholesome Gluten Free Pizza Dough Frozen $14.18\n"
                "1x Lundberg Sustainable Gourmet Wild Blend Rice $5.49"
            )
            
            # Commit entry to master Receipt table
            new_receipt = Receipt(raw_text=sample_ocr_text.strip())
            db.session.add(new_receipt)
            db.session.commit()
            
            # Send text over to our light Groq processing engine
            ai_response = process_receipt_text(sample_ocr_text)
            
            parsed_items = []
            items_list = ai_response.get('items', [])
            
            for item in items_list:
                item_name = item.get('name', 'Unknown Product')
                
                # Check for gluten-free indicators
                is_gluten_free = False
                if "gluten free" in item_name.lower() or "ore-ida" in item_name.lower():
                    is_gluten_free = True
                
                menu_item = MenuItem(
                    receipt_id=new_receipt.id,
                    name=item_name,
                    quantity=int(item.get('quantity', 1)),
                    unit_price=float(item.get('unit_price', 0.00)),
                    gluten_free=is_gluten_free
                )
                db.session.add(menu_item)
                parsed_items.append({
                    "name": menu_item.name,
                    "quantity": menu_item.quantity,
                    "unit_price": menu_item.unit_price,
                    "gluten_free": menu_item.gluten_free
                })
                
            db.session.commit()
            
            return jsonify({
                "receipt_id": new_receipt.id,
                "text": sample_ocr_text.strip(),
                "items": parsed_items
            }), 200

        except Exception as e:
            db.session.rollback()
            print(f"Server exception logged during invoice parsing loop: {e}")
            return jsonify({"error": f"Internal process crash occurred: {str(e)}"}), 500

    return app

# ------------------------------------------------------------------
# STANDALONE LIGHTWEIGHT GROQ ENGINE BLOCK
# ------------------------------------------------------------------
def process_receipt_text(receipt_text):
    if not receipt_text or not receipt_text.strip():
        return {"items": []}

    groq_api_token = os.getenv("OPENAI_API_KEY")
    
    # Point the OpenAI client instance wrapper straight to Groq's cloud endpoint
    local_client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=groq_api_token
    )

    prompt = (
        f"Analyze this grocery receipt text and transform it into a strict structured JSON format. "
        f"Return an object containing a single root key called 'items' containing an array of entities. "
        f"Each inner object must match this schema structure exactly: 'name' (string), 'quantity' (integer), 'unit_price' (float). "
        f"Do not write markdown notes or conversational responses outside of the raw JSON dictionary:\n\n"
        f"{receipt_text}"
    )

    try:
        # LIGHTEST ACTIVE MODEL VARIANT: gemma2-9b-it handles parsing blazingly fast on free tier
        response = local_client.chat.completions.create(
            model="gemma2-9b-it",
            messages=[
                {"role": "system", "content": "You are a precise parsing engine. Respond only with raw structural JSON data blocks."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error handling network traffic with Groq API layers: {e}")
        raise e

# ------------------------------------------------------------------
# STARTUP RUNTIME CONTROLLER
# ------------------------------------------------------------------
if __name__ == '__main__':
    app = create_app()
    
    with app.app_context():
        print("Synchronizing database structures...")
        db.create_all()
        print("Database schema generation confirmed fully active!")
        
    app.run(debug=True, host='0.0.0.0', port=5000)
    
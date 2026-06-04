import os
import json
from dotenv import load_dotenv
from openai import OpenAI

# Explicitly pull variables out of your local .env file
load_dotenv()

def process_receipt_text(receipt_text):
    """
    Extract structured items from receipt OCR raw text using Groq
    """
    if not receipt_text or not receipt_text.strip():
        return {"items": []}

    # Bypasses local context caching by building a clean instance inside the route execution call
    groq_key = os.getenv("OPENAI_API_KEY")
    
    local_client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key=groq_key
    )

    prompt = (
        f"Analyze this receipt text and return a strict JSON object with an 'items' array. "
        f"Each item must contain fields 'name' (string), 'quantity' (integer), and 'unit_price' (float):\n\n"
        f"{receipt_text}"
    )

    try:
        response = local_client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a precise receipt formatting engine. Respond only with raw, structural JSON code blocks."
                },
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error communicating with Groq backend service: {e}")
        raise e
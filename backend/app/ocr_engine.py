# backend/app/ocr_engine.py

import pytesseract
from PIL import Image
import io
from werkzeug.datastructures import FileStorage

def extract_text_from_image(file_obj):
    """
    Extract text from receipt image using OCR (Tesseract)
    
    Args:
        file_obj: FileStorage object from Flask request
        
    Returns:
        str: Extracted text from the image
    """
    try:
        # Read the uploaded file
        if isinstance(file_obj, FileStorage):
            image_bytes = file_obj.read()
        else:
            with open(file_obj, 'rb') as f:
                image_bytes = f.read()
        
        # Open image
        image = Image.open(io.BytesIO(image_bytes))
        
        # Preprocess image for better OCR
        image = preprocess_image(image)
        
        # Extract text using Tesseract
        text = pytesseract.image_to_string(image)
        
        if not text or len(text.strip()) == 0:
            raise ValueError("No text detected in image. Please provide a clear receipt image.")
        
        return text
        
    except Exception as e:
        raise Exception(f"OCR processing failed: {str(e)}")

def preprocess_image(image):
    """
    Preprocess image for better OCR accuracy
    
    Args:
        image: PIL Image object
        
    Returns:
        PIL Image: Preprocessed image
    """
    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Increase size if too small
    if image.width < 300 or image.height < 300:
        scale_factor = max(300 / image.width, 300 / image.height)
        new_size = (int(image.width * scale_factor), int(image.height * scale_factor))
        image = image.resize(new_size, Image.Resampling.LANCZOS)
    
    # Enhance contrast (optional - can help with poor quality images)
    # from PIL import ImageEnhance
    # enhancer = ImageEnhance.Contrast(image)
    # image = enhancer.enhance(1.5)
    
    return image

def extract_text_with_confidence(file_obj):
    """
    Extract text and confidence scores from receipt image
    
    Args:
        file_obj: FileStorage object from Flask request
        
    Returns:
        dict: Text and confidence data
    """
    try:
        if isinstance(file_obj, FileStorage):
            image_bytes = file_obj.read()
        else:
            with open(file_obj, 'rb') as f:
                image_bytes = f.read()
        
        image = Image.open(io.BytesIO(image_bytes))
        image = preprocess_image(image)
        
        # Get detailed output including confidence
        data = pytesseract.image_to_data(image, output_type='dict')
        
        text = pytesseract.image_to_string(image)
        
        return {
            "text": text,
            "confidence": data,
            "success": True
        }
        
    except Exception as e:
        return {
            "text": "",
            "confidence": {},
            "success": False,
            "error": str(e)
        }

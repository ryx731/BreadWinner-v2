# Celiac App - Gluten-Free Receipt Analyzer

A full-stack web application that analyzes shopping receipts using OCR and AI to identify gluten-free products.

## Features

- 📸 Receipt image upload and processing
- 🤖 AI-powered product analysis using OpenAI GPT-4
- 🧠 OCR text extraction using Tesseract
- 📊 Receipt history and tracking
- ✅ Gluten-free product identification
- 👤 User profile management
- 📱 Responsive web interface

## Project Structure

```
celiac/
├── backend/                 # Python Flask API
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py         # Flask application
│   │   ├── models.py       # Database models
│   │   ├── database.py     # Database setup
│   │   ├── llm_processor.py# OpenAI integration
│   │   ├── ocr_engine.py   # Tesseract OCR
│   │   └── scraper.py      # Web scraping utilities
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── main.jsx       # Entry point
│   │   ├── App.jsx        # Main component
│   │   ├── components/
│   │   │   └── pages/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Upload.jsx
│   │   │       ├── History.jsx
│   │   │       └── Profile.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 16+
- OpenAI API key
- Tesseract OCR (for image text extraction)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd celiac
   ```

2. **Configure environment variables**
   ```bash
   # Edit .env file with your settings
   cp .env.example .env
   nano .env
   ```
   Update `OPENAI_API_KEY` with your OpenAI API key.

3. **Setup Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   
   # Start the server
   python -m app.main
   ```
   Backend should be running on `http://localhost:5000`

4. **Setup Frontend (in a new terminal)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend should be running on `http://localhost:5173`

### Docker Compose Setup

1. **Install Docker and Docker Compose**
   
2. **Configure .env file**
   ```bash
   OPENAI_API_KEY=your_key_here
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Receipts
- `POST /api/receipts/upload` - Upload and process a receipt
- `GET /api/receipts` - Get all receipts
- `GET /api/receipts/<id>` - Get receipt details

### Health
- `GET /health` - Health check

## Environment Variables

```
# Flask
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000

# Database
DATABASE_URL=sqlite:///celiac.db

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:5000
```

## Dependencies

### Backend
- Flask 2.3+
- OpenAI 1.0+
- Pillow 10.0+ (Image processing)
- pytesseract 0.3.10 (OCR)
- SQLAlchemy 2.0+ (Database ORM)

### Frontend
- React 18.2+
- React Router DOM 6.11+
- Axios 1.4+ (HTTP client)
- Vite 4.3+ (Build tool)

## Troubleshooting

### Backend won't start
- Ensure Python 3.9+ is installed
- Check that `OPENAI_API_KEY` is set in `.env`
- Verify port 5000 is not in use

### Frontend won't start
- Ensure Node.js 16+ is installed
- Run `npm install` in the frontend directory
- Clear node_modules and reinstall if needed

### OCR not working
- Install Tesseract OCR:
  - Ubuntu: `sudo apt-get install tesseract-ocr`
  - macOS: `brew install tesseract`
  - Windows: Download from https://github.com/UB-Mannheim/tesseract/wiki

### OpenAI API errors
- Verify API key is valid and has available credits
- Check that model name is correct (gpt-4-mini)
- Review rate limits and quota

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Database persistence improvements
- [ ] Advanced filtering and search
- [ ] Export receipt data
- [ ] Mobile app
- [ ] Nutritional information integration
- [ ] Barcode scanning
- [ ] Community ratings for products

## License

MIT License

## Support

For issues or questions, please open an issue on GitHub or contact support.

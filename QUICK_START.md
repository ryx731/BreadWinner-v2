# Quick Start Guide - Celiac App

Get the Celiac App running locally in minutes!

## ⚡ TL;DR - 5 Minutes Setup

### Mac/Linux

```bash
# 1. Install Tesseract OCR
sudo apt-get install tesseract-ocr  # Ubuntu
# OR
brew install tesseract               # macOS

# 2. Clone/navigate to project
cd celiac

# 3. Setup environment
echo "OPENAI_API_KEY=sk-..." > .env

# 4. Backend (Terminal 1)
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m app.main

# 5. Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Windows

```bash
# 1. Install Tesseract OCR
# Download from: https://github.com/UB-Mannheim/tesseract/wiki

# 2. Clone/navigate to project
cd celiac

# 3. Setup environment
echo OPENAI_API_KEY=sk-... > .env

# 4. Backend (Terminal 1)
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m app.main

# 5. Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## 🐳 Docker Setup (Even Easier!)

```bash
# 1. Install Docker Desktop
# https://www.docker.com/products/docker-desktop

# 2. Add your OpenAI API key to .env
echo "OPENAI_API_KEY=sk-..." > .env

# 3. Start everything
docker-compose up -d

# 4. Wait 30 seconds then open
open http://localhost:3000
```

---

## ✅ Verify Everything Works

### Backend Test
```bash
curl http://localhost:5000/health
# Should return: {"status": "healthy"}
```

### Frontend Test
- Open http://localhost:5173
- Should see the Celiac App interface

### Full Test
1. Go to "Upload Receipt"
2. Upload a receipt image
3. Should show extracted items and gluten-free status

---

## 🔑 Getting Your OpenAI API Key

1. Go to https://platform.openai.com
2. Sign up or login
3. Go to API keys section
4. Create a new API key
5. Copy and add to `.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```

---

## 📋 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError: No module named 'openai'` | Run `pip install -r requirements.txt` in backend |
| `npm ERR! not found: vite` | Run `npm install` in frontend directory |
| `OPENAI_API_KEY not found` | Make sure `.env` file exists in root with your key |
| `Port 5000 already in use` | Change PORT in `.env` or kill process using port |
| `No module named 'pytesseract'` | Run `pip install pytesseract` |
| `Tesseract not found` | Install Tesseract OCR (see instructions above) |
| `Cannot connect to backend` | Make sure backend is running on port 5000 |

---

## 🚀 Next Steps

### After Getting It Running

1. **Explore the Dashboard**
   - View statistics
   - See feature overview

2. **Test Upload**
   - Upload a receipt image
   - Check extracted text
   - Review gluten-free analysis

3. **View History**
   - See all processed receipts
   - Check detailed results

4. **Customize Profile**
   - Update user information
   - Set preferences

### For Production

1. Add user authentication
2. Set up PostgreSQL database
3. Configure SSL/HTTPS
4. Add rate limiting
5. Set up proper error logging
6. Deploy to cloud (AWS, Azure, Heroku, etc.)

---

## 📚 Project Structure Reminder

- `backend/` - Python Flask API
- `frontend/` - React with Vite
- `docker-compose.yml` - Docker configuration
- `.env` - Environment variables
- `README.md` - Full documentation

---

## 🆘 Need More Help?

Check the main `README.md` for:
- Detailed API documentation
- Environment variable reference
- Troubleshooting guide
- Technology stack info
- Future enhancements

---

## 🎉 You're All Set!

Your Celiac App is now running. Happy gluten-free shopping! 🍞✨

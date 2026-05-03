# ✦ UX Layout AI Generator

An AI-powered UX design tool that generates **2 completely different layout designs** from a single text prompt.
Built with **React + Python FastAPI + Groq**.

---

## 🎯 What It Does

- You type a prompt describing your app idea
- GPT-4o generates **2 unique UX layouts** side by side
- Each layout includes:
  - 🖼️ **Live HTML Preview** (rendered in browser)
  - 🎨 **Full Color Palette** (7 colors with hex codes, click to copy)
  - ✍️ **Typography System** (fonts, sizes, weights)
  - 📐 **Section Breakdown** (navbar, hero, features, CTA, footer, etc.)
  - 🧠 **Design Principles & Target Audience**

---

## 🗂️ Project Structure

```
ux-layout-ai/
├── backend/
│   ├── main.py              ← FastAPI + OpenAI integration
│   ├── requirements.txt     ← Python dependencies
│   └── .env.example         ← Copy this to .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── PromptInput.jsx
│   │       ├── LoadingScreen.jsx
│   │       ├── LayoutResults.jsx
│   │       └── LayoutCard.jsx
│   ├── public/index.html
│   └── package.json
├── start_backend.sh
├── start_frontend.sh
└── README.md
```

---

## ⚙️ Setup Instructions

### Step 1: Get Your OpenAI API Key
1. Go to https://console.groq.com/keys
2. Create an account and add credits (~$5 minimum)
3. Create a new API key and copy it

### Step 2: Configure the Backend
```bash
cd backend
cp .env.example .env
```
Open `.env` and paste your key:
```
OPENAI_API_KEY=sk-your-key-here
```

### Step 3: Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```
> Requires Python 3.9+

### Step 4: Start the Backend
```bash
# From the backend folder:
uvicorn main:app --reload --port 8000
```
Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

### Step 5: Install & Start Frontend
Open a NEW terminal:
```bash
cd frontend
npm install
npm start
```
> Requires Node.js 18+

Frontend runs at: http://localhost:3000

---

## 🚀 Quick Start (After Setup)

**Terminal 1 - Backend:**
```bash
cd ux-layout-ai/backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd ux-layout-ai/frontend
npm start
```

Then open http://localhost:3000 in your browser.

---

## 💡 Example Prompts

- "E-commerce fashion store with dark luxury feel"
- "SaaS dashboard for analytics and data visualization"
- "Healthcare appointment booking platform"
- "Social media app for creative professionals"
- "AI-powered learning management system"
- "Food delivery app with warm vibrant colors"

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, CSS3, Framer Motion |
| Backend | Python, FastAPI, Uvicorn |
| AI Model | GPT-4o (OpenAI) |
| API | REST (JSON) |

---

## ❗ Troubleshooting

**Backend won't start:**
- Make sure Python 3.9+ is installed: `python --version`
- Make sure `.env` file exists in backend folder with your API key

**Frontend won't start:**
- Make sure Node.js 18+ is installed: `node --version`
- Delete `node_modules` and run `npm install` again

**Generation fails:**
- Check your OpenAI API key is valid and has credits
- Check backend terminal for error messages
- Make sure backend is running on port 8000

**CORS error:**
- Make sure both frontend (3000) and backend (8000) are running
- Check the `proxy` field in frontend/package.json is set to `http://localhost:8000`

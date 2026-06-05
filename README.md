# 🎓 InternMatch — NLP-Based Internship Recommendation System

An intelligent web platform where students upload their resume and get AI-powered internship recommendations using **BERT embeddings** and **NLP**.

## 🏗️ Architecture

```
┌──────────────┐     ┌──────────────────┐     ┌────────────────────┐
│   React +    │────▶│  Node.js/Express │────▶│  Python Flask      │
│   Tailwind   │     │  REST API        │     │  NLP Engine (BERT) │
│   (Vite)     │◀────│  + MongoDB       │◀────│  + Resume Parser   │
│   Port 5173  │     │  Port 5000       │     │  Port 5001         │
└──────────────┘     └──────────────────┘     └────────────────────┘
```

## ✨ Features

- **Smart Resume Parsing** — Upload PDF resumes, extract skills using NLP
- **BERT-Powered Matching** — Semantic similarity using sentence-transformers
- **Weighted Scoring** — 60% skill match + 20% department + 20% location
- **Skill Gap Feedback** — Shows missing skills per internship
- **Application Tracking** — Apply and track status (applied/shortlisted/accepted/rejected)
- **50+ Internships** — Across CSE, ECE, EE, ME, BioTech, MBA departments
- **JWT Authentication** — Secure signup/login system
- **Premium UI** — Glassmorphism, gradients, micro-animations

## 📋 Prerequisites

- **Node.js** v18+
- **Python** 3.9+
- **MongoDB** running locally on port 27017

## 🚀 Setup & Run

### 1. Backend (Node.js)

```bash
cd backend
npm install
```

### 2. Seed the Database

```bash
cd backend
npm run seed
```

### 3. Start the Backend

```bash
cd backend
npm run dev
```

Server runs on: http://localhost:5000

### 4. Python NLP Engine

```bash
cd nlp-engine
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app.py
```

NLP engine runs on: http://localhost:5001

> **Note:** First run will download the BERT model (`all-MiniLM-L6-v2`, ~80MB). This is cached for subsequent runs.

### 5. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## 📁 Project Structure

```
internship-recommendation-system/
├── backend/                    # Node.js + Express
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Route handlers
│   ├── middleware/auth.js     # JWT middleware
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── seed.js                # Database seeder
│   └── server.js              # Entry point
├── nlp-engine/                # Python Flask API
│   ├── app.py                 # Flask server
│   ├── resume_parser.py       # PDF text → skills
│   ├── recommendation_model.py # BERT similarity engine
│   └── requirements.txt       # Python dependencies
├── frontend/                  # React + Vite + Tailwind
│   └── src/
│       ├── components/        # Navbar, ProtectedRoute
│       ├── context/           # AuthContext
│       ├── pages/             # 7 pages
│       └── services/          # API client
├── database/
│   └── seed_data.json         # 54 internship records
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user profile |
| POST | `/api/resume/upload` | Upload and parse PDF resume |
| GET | `/api/internships` | List all internships |
| GET | `/api/internships/:id` | Get internship details |
| GET | `/api/recommendations/:userId` | Get AI-ranked recommendations |
| POST | `/api/applications` | Apply to an internship |
| GET | `/api/applications/user/:userId` | Get user's applications |

## 🧠 Recommendation Algorithm

1. User skills are encoded using **BERT** (`all-MiniLM-L6-v2`)
2. Each internship's required skills are similarly encoded
3. **Cosine similarity** is computed between embeddings
4. Final score: `0.6 × skill_similarity + 0.2 × department_match + 0.2 × location_match`
5. Top 10 internships are returned with match percentage and skill gap analysis

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Tailwind CSS 4, Vite |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB |
| NLP Engine | Python, Flask, sentence-transformers, pdfplumber |
| ML | BERT (all-MiniLM-L6-v2), scikit-learn, cosine similarity |
| Auth | JWT (jsonwebtoken, bcryptjs) |

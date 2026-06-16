# NOVA CLASS — Node.js Backend API
> Part of the NOVA CLASS AI Education Platform

This is the main REST API server. See `nova-class-frontend/CLAUDE.md` for the full project overview.

## Quick Start
```bash
npm install
node src/index.js
# → http://localhost:3000
```

## .env required
```
PORT=3000
GEMINI_API_KEY=your_key
MYSQL_HOST=217.142.136.244
MYSQL_PORT=3307
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=nova_class
CHROMA_HOST=217.142.136.244
CHROMA_PORT=8001
JWT_SECRET=your_secret
```

## API Endpoints
```
POST /api/auth/register         → { name, email, password }
POST /api/auth/login            → { email, password } → { token, name }

POST /api/kmate/ask             → { question } → { answer }          [JWT]
GET  /api/kmate/history         → chat history last 20               [JWT]
POST /api/kmate/quiz/generate   → { topic, count } → { questions[] } [JWT]
POST /api/kmate/quiz/check      → { questions, answers, language }    [JWT]

GET  /api/progress/summary      → dashboard stats                     [JWT]
```

## Structure
```
src/
├── config/db.js           ← MySQL pool (mysql2/promise)
├── middleware/auth.js     ← JWT verify → req.user = { id, email }
├── controllers/
│   ├── authController.js  ← register (bcrypt hash) / login (JWT sign)
│   ├── kmateController.js ← proxies to Python localhost:8082
│   ├── progressController.js
│   └── quizController.js
└── routes/
    ├── auth.js / kmate.js / progress.js / quiz.js
```

## Depends on
- Python AI Service running on `localhost:8082`
- MySQL on `217.142.136.244:3307`

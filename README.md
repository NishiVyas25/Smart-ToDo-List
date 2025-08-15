# 🧠 Smart Todo List with AI

A full-stack web application for intelligent task management, built as part of the **Full Stack Developer Assignment**.  
The system allows users to manage tasks, add daily context (messages, emails, notes), and leverage AI features for **task prioritization, deadline suggestions, and context-aware recommendations**.

---

## 📌 Features

### Backend (Django REST Framework)
- **Task APIs**
  - `GET /api/tasks/` – Retrieve all tasks
  - `POST /api/tasks/` – Create a new task
- **Category APIs**
  - `GET /api/categories/` – Retrieve task categories/tags
- **Context APIs**
  - `GET /api/context/` – Fetch daily context entries
  - `POST /api/context/` – Add daily context (WhatsApp, email, note)
- **AI Suggestions API**
  - `POST /api/ai/suggestions/` – Generate AI-powered task suggestions and prioritization

### AI Module
- Context processing: Analyzes WhatsApp messages, emails, and notes
- Task prioritization: Assigns priority scores based on urgency & context
- Deadline suggestions: Suggests realistic deadlines based on workload
- Smart categorization: Auto-suggests task categories/tags
- Task enhancement: Improves descriptions using context

### Frontend (Next.js + Tailwind CSS)
- **Dashboard / Task List**
  - Displays all tasks with priority indicators
  - Filter by category, status, and priority
  - Quick add task functionality
- **Task Management**
  - Create / edit tasks
  - AI-powered deadline recommendations
  - Context-aware descriptions
- **Context Input**
  - Input daily context
  - View history of context entries

---

## 🛠 Tech Stack

**Backend**
- Python 3.x
- Django REST Framework
- PostgreSQL

**Frontend**
- Next.js 14+
- Tailwind CSS

**AI Integration**
- LM Studio (local LLM hosting) **or** OpenAI / Claude / Gemini APIs

---

## 📂 Project Structure

```
smart-todo/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── core/                # Django settings, URLs
│   ├── tasks/               # Task models, serializers, views
│   ├── categories/          # Category models, serializers, views
│   ├── context/             # Context models, serializers, views
│   └── ai_module/           # AI processing logic
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Dashboard
│   │   ├── task/            # Task management UI
│   │   ├── context/         # Context input UI
│   ├── lib/                 # API calls & type definitions
│   ├── public/
│   ├── styles/
│   │   └── globals.css
│   ├── .env.local
│   └── package.json
└── README.md
```

---

## 🚀 Setup Instructions

### 1️⃣ Clone the repo
```bash
git clone https://github.com/<your-username>/smart-todo.git
cd smart-todo
```

### 2️⃣ Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Setup environment variables in .env (DB credentials, AI config)
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend will run on: **http://127.0.0.1:8000/**

---

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install

# Create .env.local
echo "NEXT_PUBLIC_API=http://127.0.0.1:8000/api" > .env.local

npm run dev
```

Frontend will run on: **http://localhost:3000/**

---

## 📡 API Documentation

### **Tasks**
- `GET /api/tasks/` → List tasks
- `POST /api/tasks/` → Create task  
  **Body:**
  ```json
  {
    "title": "Finish report",
    "description": "Complete Q3 financial report",
    "status": "todo",
    "priority_score": 4,
    "deadline": "2025-08-20T17:00:00Z",
    "category": 1
  }
  ```

### **Categories**
- `GET /api/categories/` → List categories

### **Context**
- `GET /api/context/` → List context entries
- `POST /api/context/` → Create context  
  **Body:**
  ```json
  {
    "content": "Meeting with client tomorrow at 10am",
    "source": "email"
  }
  ```

### **AI Suggestions**
- `POST /api/ai/suggestions/`  
  **Body:**
  ```json
  {
    "task_details": {...},
    "daily_context": [...],
    "user_preferences": {}
  }
  ```

---

## 📅 Submission Info
- **Deadline:** 15 August 2025, 11:55 PM
- **Submission Form:** [https://forms.gle/CUv48PxFwG59RCEt9](https://forms.gle/CUv48PxFwG59RCEt9)

---

## 📊 Evaluation Criteria
- Functionality – 40%
- Code Quality – 25%
- UI/UX – 20%
- Innovation – 15%

---

## 📜 License
This project is for **assignment purposes** only.

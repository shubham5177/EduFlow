# EduFlow - Quick Start Guide

## 🚀 Local Setup (5 minutes)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run Backend Server
```bash
python app.py
```
Server runs at `http://localhost:5000`

### 3. Serve Frontend
```bash
# In a new terminal
cd path/to/Eduflow
python -m http.server 8000
```
Frontend available at `http://localhost:8000`

### 4. Create Your Account
- Go to http://localhost:8000
- Click "Sign Up" on login page
- Choose role (Student/Teacher)
- Fill registration form
- Redirects to dashboard after signup

## 📦 Vercel Deployment (10 minutes)

### 1. Prepare Your Repository
```bash
git add .
git commit -m "Complete EduFlow with Flask backend"
git push origin main
```

### 2. Add Database URL
For production, use PostgreSQL:
- Supabase (free): https://supabase.com
- Vercel Postgres: Through Vercel dashboard
- Get connection string

### 3. Deploy on Vercel

**Option A: CLI**
```bash
npm install -g vercel
vercel login
vercel deploy
```

**Option B: GitHub Integration**
1. Go to https://vercel.com/import
2. Select your GitHub repository
3. Add environment variables:
   - `DATABASE_URL` (PostgreSQL connection)
   - `JWT_SECRET_KEY` (random string)
4. Deploy

### 4. Update Frontend API URL

Edit `api-client.js`:
```javascript
// Change this line
const API_URL = 'https://your-vercel-app.vercel.app/api';
```

## 🔐 Key Features Implemented

✅ **Authentication**
- User registration (Student & Teacher)
- Login with JWT tokens
- Persistent sessions via localStorage
- Password hashing with Werkzeug

✅ **Student Dashboard**
- View enrolled courses
- Take quizzes with auto-grading
- Create/edit/delete personal notes
- View marks and performance
- Access teacher notices and resources

✅ **Teacher Dashboard**
- Create courses with details
- Design quizzes with multiple questions
- Manage enrolled students
- Post notices to all students
- Create study materials
- Share resource links
- View detailed student performance analytics

✅ **Backend API**
- RESTful endpoints for all operations
- JWT-based authentication
- Role-based access control
- Database relationships and constraints
- Error handling and validation

✅ **Vercel Compatible**
- No serverless function wrappers needed (standard Flask)
- Works with Vercel Python runtime
- Uses PostgreSQL for persistence
- Environment-based configuration

## 📝 API Documentation

### Base URL: `/api`

### Registration
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",  // or "teacher"
  "subject": "Mathematics"  // optional, for teachers
}

Response: 201 Created
{
  "access_token": "jwt_token_here",
  "user": {...}
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "access_token": "jwt_token_here",
  "user": {...}
}
```

### All Other Requests
Add JWT token to header:
```
Authorization: Bearer <your_access_token>
```

## 🎓 Student Endpoints

- `GET /api/student/dashboard` - Dashboard overview
- `GET /api/student/courses` - List enrolled courses
- `GET /api/student/quizzes/<course_id>` - Course quizzes
- `POST /api/student/quiz/<quiz_id>/submit` - Submit answers
- `GET/POST /api/student/notes` - Manage notes

## 👨‍🏫 Teacher Endpoints

- `GET /api/teacher/dashboard` - Dashboard overview
- `GET/POST /api/teacher/courses` - Create/view courses
- `GET/POST /api/teacher/quizzes` - Create/view quizzes
- `POST /api/teacher/notices` - Post announcements
- `GET/POST /api/teacher/notes` - Study materials
- `GET /api/teacher/students` - View all students
- `GET /api/teacher/marks` - Student performance

## 🔑 Important Notes

1. **Change JWT_SECRET_KEY** in `.env` before production
2. **Use PostgreSQL** for production (not SQLite)
3. **CORS is enabled** for all origins in development
4. **Database auto-initializes** - just run the app
5. **No demo accounts** - users must register

## 📚 Database

SQLite for development (auto-created):
- File: `eduflow.db`
- Tables auto-created on first run

PostgreSQL for production:
- Update `DATABASE_URL` in environment
- Run Flask app to initialize tables

## 🐛 Debugging

**Terminal 1 - Backend:**
```bash
python app.py
# Runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
python -m http.server 8000
# Runs on http://localhost:8000
```

**Check API calls:**
- Open browser DevTools (F12)
- Network tab shows all API requests
- Console shows any JavaScript errors

## 🎯 Next Steps

1. Test user registration/login
2. Create sample courses as teacher
3. Enroll students in courses
4. Take quizzes and check scores
5. Create notes and notices
6. Deploy to Vercel when ready

---

For detailed documentation, see **README.md**

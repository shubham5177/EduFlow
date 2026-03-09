# EduFlow - Smart Learning Platform

A full-stack learning management system with separate interfaces for students and teachers. Built with Flask backend and vanilla HTML/CSS/JavaScript frontend.

## Features

### Student Features
- 📚 Access enrolled courses with progress tracking
- 📝 Take quizzes and view scores
- 📖 Create and manage personal notes
- 📢 Receive teacher notices
- 🔗 Access shared resource links
- 📊 View marks and performance metrics

### Teacher Features
- 🎓 Create and manage courses
- ❓ Design quizzes with multiple questions
- 👥 Manage enrolled students
- 📢 Post notices to students
- 📚 Create and share study materials
- 🔗 Share resource links
- 📈 Track student performance

## Tech Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Bootstrap 5.3.3 for UI components
- Bootstrap Icons 1.11.3
- Google Fonts (Syne, DM Sans)

### Backend
- Python 3.8+
- Flask 2.3.3
- Flask-SQLAlchemy (ORM)
- Flask-JWT-Extended (Authentication)
- Flask-CORS
- SQLite (Development) / PostgreSQL (Production)

## Project Structure

```
/
├── Frontend Files
│   ├── index.html              # Landing page
│   ├── login.html              # Login/Registration page
│   ├── student.html            # Student dashboard
│   ├── teacher.html            # Teacher dashboard
│   ├── styles.css              # Global styles
│   ├── api-client.js           # API client library
│   ├── auth-new.js             # Auth page logic
│   ├── student.js              # Student dashboard logic
│   └── teacher.js              # Teacher dashboard logic
│
├── Backend Files
│   ├── app.py                  # Flask application with all routes
│   ├── requirements.txt         # Python dependencies
│   ├── .env                    # Environment variables
│   └── vercel.json             # Vercel deployment config
│
└── Configuration
    ├── .gitignore              # Git ignore rules
    └── README.md               # This file
```

## Installation

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Git

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Eduflow
```

2. **Create a virtual environment**
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
# Copy .env file and update if needed
cp .env .env.local
```

5. **Initialize the database**
```bash
python app.py
# The database will be created automatically on first run
```

6. **Run the Flask server**
```bash
python app.py
```

The application will be available at `http://localhost:5000`

### Frontend Setup

1. **Serve the frontend files**
```bash
# Using Python's built-in server
cd path/to/Eduflow
python -m http.server 8000

# Or use any other static server
```

2. **Open in browser**
```
http://localhost:8000
```

3. **Update API URL in `api-client.js`**
If your backend is on a different port, update the API_URL in api-client.js:
```javascript
const API_URL = 'http://localhost:5000/api';
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Student Routes
- `GET /api/student/dashboard` - Get dashboard data
- `GET /api/student/courses` - Get enrolled courses
- `GET /api/student/quizzes/<course_id>` - Get course quizzes
- `GET /api/student/quiz/<quiz_id>` - Get quiz questions
- `POST /api/student/quiz/<quiz_id>/submit` - Submit quiz
- `GET /api/student/notes` - Get student notes
- `POST /api/student/notes` - Create note
- `PUT /api/student/notes/<note_id>` - Update note
- `DELETE /api/student/notes/<note_id>` - Delete note
- `GET /api/notices` - Get all notices
- `GET /api/resource-links` - Get resource links

### Teacher Routes
- `GET /api/teacher/dashboard` - Get dashboard data
- `GET /api/teacher/courses` - Get teacher's courses
- `POST /api/teacher/courses` - Create course
- `DELETE /api/teacher/courses/<course_id>` - Delete course
- `GET /api/teacher/quizzes` - Get teacher's quizzes
- `POST /api/teacher/quizzes` - Create quiz
- `DELETE /api/teacher/quizzes/<quiz_id>` - Delete quiz
- `GET /api/teacher/notices` - Get notices
- `POST /api/teacher/notices` - Create notice
- `DELETE /api/teacher/notices/<notice_id>` - Delete notice
- `GET /api/teacher/notes` - Get teacher notes
- `POST /api/teacher/notes` - Create note
- `DELETE /api/teacher/notes/<note_id>` - Delete note
- `GET /api/teacher/links` - Get shared links
- `POST /api/teacher/links` - Create link
- `DELETE /api/teacher/links/<link_id>` - Delete link
- `GET /api/teacher/students` - Get enrolled students
- `GET /api/teacher/marks` - Get student marks

## Deployment on Vercel

### Prerequisites
- Vercel account (free at vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)
- PostgreSQL database (Vercel Postgres, Supabase, or external)

### Step 1: Prepare Database
Use PostgreSQL instead of SQLite for production:

```bash
# Install PostgreSQL driver
pip install psycopg2-binary

# Update requirements.txt
pip freeze > requirements.txt
```

### Step 2: Set Environment Variables on Vercel

Go to your Vercel project settings and add:
```
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET_KEY=your-super-secret-key-change-this
```

### Step 3: Deploy

Option A: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel deploy
```

Option B: Connect GitHub
1. Push code to GitHub
2. Go to vercel.com and import your GitHub repository
3. Vercel will automatically detect the Flask app
4. Set environment variables in Vercel dashboard
5. Deploy with single click

### Step 4: Point Frontend to Backend

In `api-client.js`, update API_URL:
```javascript
const API_URL = 'https://your-vercel-app.vercel.app/api';
```

### Step 5: Deploy Frontend (Optional)

Host the static frontend files on Vercel as well:
1. Create a `public` folder with all HTML, CSS, JS files
2. Vercel will serve static files at root

Or use a separate static hosting service (Netlify, GitHub Pages, etc.)

## Database Schema

### Users Table
- id, name, email, password_hash, role, subject, avatar, created_at, updated_at

### Courses Table
- id, title, description, category, teacher_id, lessons, duration, image_url, color, created_at

### Enrollments Table
- id, student_id, course_id, progress, enrolled_at

### Quizzes Table
- id, title, course_id, due_date, total_questions, created_at

### Questions Table
- id, quiz_id, question_text, option_a, option_b, option_c, option_d, correct_answer

### QuizScores Table
- id, student_id, quiz_id, score, percentage, submitted_at

### Notes Table
- id, title, body, author_id, is_public, created_at, updated_at

### Notices Table
- id, title, body, author_id, created_at

### ResourceLinks Table
- id, title, url, description, shared_by_id, created_at

## Testing

### Login/Register Test Accounts

You can create test accounts through the registration form:

**Student Account:**
- Email: student@test.com
- Password: Student@123
- Role: Student

**Teacher Account:**
- Email: teacher@test.com
- Password: Teacher@123
- Role: Teacher
- Subject: Computer Science

## Troubleshooting

### CORS Errors
If you see CORS errors, ensure the Flask backend has CORS enabled. The configuration in `app.py` already includes `CORS(app)`.

### Database Errors
1. Delete `eduflow.db` if it's corrupted
2. Restart Flask server - it will create a new database
3. For PostgreSQL, check your connection string

### JWT Token Errors
- Ensure the JWT_SECRET_KEY is set in .env
- Change SECRET_KEY to a strong random string in production
- Clear browser localStorage and re-login if tokens are corrupted

### API Not Connecting
1. Check if Flask server is running
2. Verify API_URL in api-client.js matches your backend URL
3. Check browser console (F12) for error messages
4. Verify CORS settings in app.py

## Security Considerations

⚠️ **Before Production Deployment:**

1. Change `JWT_SECRET_KEY` in .env to a strong random string
2. Set `FLASK_ENV=production`
3. Use PostgreSQL instead of SQLite
4. Enable HTTPS only
5. Implement rate limiting
6. Add email verification for registration
7. Implement password reset functionality
8. Add input validation and sanitization
9. Enable CSRF protection
10. Set secure cookie flags

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please create an issue in the repository.

---

**Built with ❤️ by EduFlow Team**

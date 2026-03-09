import os
from datetime import datetime, timedelta
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///eduflow.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {"origins": ["*"]}})

# ==================== MODELS ====================

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'student' or 'teacher'
    subject = db.Column(db.String(100))  # For teachers
    avatar = db.Column(db.String(20), default='A')  # Avatar initials
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    courses = db.relationship('Course', backref='instructor', lazy=True, foreign_keys='Course.teacher_id')
    enrollments = db.relationship('Enrollment', backref='student', lazy=True)
    quiz_scores = db.relationship('QuizScore', backref='student', lazy=True)
    notes = db.relationship('Note', backref='author', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'subject': self.subject,
            'avatar': self.avatar,
            'created_at': self.created_at.isoformat()
        }


class Course(db.Model):
    __tablename__ = 'courses'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    lessons = db.Column(db.Integer, default=0)
    duration = db.Column(db.String(50))
    image_url = db.Column(db.String(500))
    color = db.Column(db.String(20), default='#6c63ff')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    enrollments = db.relationship('Enrollment', backref='course', lazy=True, cascade='all, delete-orphan')
    quizzes = db.relationship('Quiz', backref='course', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_teacher=True):
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'lessons': self.lessons,
            'duration': self.duration,
            'image_url': self.image_url,
            'color': self.color,
            'created_at': self.created_at.isoformat(),
            'teacher_id': self.teacher_id
        }
        if include_teacher:
            data['instructor'] = self.instructor.name
        return data


class Enrollment(db.Model):
    __tablename__ = 'enrollments'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    progress = db.Column(db.Integer, default=0)
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('student_id', 'course_id', name='unique_enrollment'),)


class Quiz(db.Model):
    __tablename__ = 'quizzes'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    due_date = db.Column(db.DateTime)
    total_questions = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    questions = db.relationship('Question', backref='quiz', lazy=True, cascade='all, delete-orphan')
    scores = db.relationship('QuizScore', backref='quiz', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'course_id': self.course_id,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'total_questions': self.total_questions,
            'created_at': self.created_at.isoformat()
        }


class Question(db.Model):
    __tablename__ = 'questions'
    
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    option_a = db.Column(db.String(500))
    option_b = db.Column(db.String(500))
    option_c = db.Column(db.String(500))
    option_d = db.Column(db.String(500))
    correct_answer = db.Column(db.String(10))  # 'a', 'b', 'c', or 'd'
    
    def to_dict(self):
        return {
            'id': self.id,
            'quiz_id': self.quiz_id,
            'question_text': self.question_text,
            'option_a': self.option_a,
            'option_b': self.option_b,
            'option_c': self.option_c,
            'option_d': self.option_d,
            'correct_answer': self.correct_answer  # Only returned for teacher/admin
        }


class QuizScore(db.Model):
    __tablename__ = 'quiz_scores'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quizzes.id'), nullable=False)
    score = db.Column(db.Integer)
    percentage = db.Column(db.Float)
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    answer_a_selected = db.Column(db.String(10))  # Track student answers
    answer_b_selected = db.Column(db.String(10))
    answer_c_selected = db.Column(db.String(10))
    answer_d_selected = db.Column(db.String(10))


class Note(db.Model):
    __tablename__ = 'notes'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_public = db.Column(db.Boolean, default=False)  # Can be shared with students
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'body': self.body,
            'author_id': self.author_id,
            'author': self.author.name,
            'is_public': self.is_public,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Notice(db.Model):
    __tablename__ = 'notices'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    author = db.relationship('User', backref='notices')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'body': self.body,
            'author_id': self.author_id,
            'author': self.author.name,
            'created_at': self.created_at.isoformat()
        }


class ResourceLink(db.Model):
    __tablename__ = 'resource_links'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    description = db.Column(db.Text)
    shared_by_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    shared_by = db.relationship('User', backref='shared_links')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'url': self.url,
            'description': self.description,
            'shared_by_id': self.shared_by_id,
            'shared_by': self.shared_by.name,
            'created_at': self.created_at.isoformat()
        }


# ==================== AUTH ROUTES ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user (student or teacher)"""
    data = request.get_json()
    
    # Validate input
    if not data or not all(k in data for k in ['name', 'email', 'password', 'role']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if data['role'] not in ['student', 'teacher']:
        return jsonify({'error': 'Invalid role'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409
    
    # Create new user
    user = User(
        name=data['name'],
        email=data['email'],
        role=data['role'],
        subject=data.get('subject', ''),
        avatar=data['name'][0].upper() if data['name'] else 'A'
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Create JWT token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'user': user.to_dict()
    }), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login"""
    data = request.get_json()
    
    if not data or not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200


@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current authenticated user"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200


# ==================== STUDENT ROUTES ====================

@app.route('/api/student/dashboard', methods=['GET'])
@jwt_required()
def student_dashboard():
    """Get student dashboard data"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.role != 'student':
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Get enrolled courses
    enrollments = Enrollment.query.filter_by(student_id=user_id).all()
    courses = [Course.query.get(e.course_id).to_dict() for e in enrollments]
    
    # Get quiz scores
    quiz_scores = QuizScore.query.filter_by(student_id=user_id).all()
    
    # Get statistics
    stats = {
        'total_courses': len(courses),
        'quizzes_completed': len(quiz_scores),
        'average_score': round(sum([q.percentage for q in quiz_scores]) / len(quiz_scores)) if quiz_scores else 0,
        'total_notes': len(user.notes)
    }
    
    return jsonify({
        'user': user.to_dict(),
        'stats': stats,
        'courses': courses,
        'quiz_scores': [{'quiz_id': q.quiz_id, 'score': q.score, 'percentage': q.percentage, 'submitted_at': q.submitted_at.isoformat()} for q in quiz_scores]
    }), 200


@app.route('/api/student/courses', methods=['GET'])
@jwt_required()
def get_student_courses():
    """Get all courses enrolled by student"""
    user_id = get_jwt_identity()
    
    enrollments = Enrollment.query.filter_by(student_id=user_id).all()
    courses = []
    
    for enrollment in enrollments:
        course = Course.query.get(enrollment.course_id)
        course_data = course.to_dict()
        course_data['progress'] = enrollment.progress
        courses.append(course_data)
    
    return jsonify(courses), 200


@app.route('/api/student/quizzes/<int:course_id>', methods=['GET'])
@jwt_required()
def get_course_quizzes(course_id):
    """Get quizzes for a specific course"""
    user_id = get_jwt_identity()
    
    # Verify enrollment
    enrollment = Enrollment.query.filter_by(student_id=user_id, course_id=course_id).first()
    if not enrollment:
        return jsonify({'error': 'Not enrolled in this course'}), 403
    
    quizzes = Quiz.query.filter_by(course_id=course_id).all()
    
    quiz_data = []
    for quiz in quizzes:
        q = quiz.to_dict()
        # Check if student completed this quiz
        score = QuizScore.query.filter_by(student_id=user_id, quiz_id=quiz.id).first()
        q['completed'] = score is not None
        q['student_score'] = score.percentage if score else None
        quiz_data.append(q)
    
    return jsonify(quiz_data), 200


@app.route('/api/student/quiz/<int:quiz_id>', methods=['GET'])
@jwt_required()
def get_quiz(quiz_id):
    """Get quiz questions"""
    quiz = Quiz.query.get(quiz_id)
    
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    
    # Verify student is enrolled in course
    user_id = get_jwt_identity()
    enrollment = Enrollment.query.filter_by(student_id=user_id, course_id=quiz.course_id).first()
    if not enrollment:
        return jsonify({'error': 'Not enrolled in this course'}), 403
    
    questions = Question.query.filter_by(quiz_id=quiz_id).all()
    
    return jsonify({
        'quiz': quiz.to_dict(),
        'questions': [q.to_dict() for q in questions]
    }), 200


@app.route('/api/student/quiz/<int:quiz_id>/submit', methods=['POST'])
@jwt_required()
def submit_quiz(quiz_id):
    """Submit quiz answers"""
    user_id = get_jwt_identity()
    data = request.get_json()
    answers = data.get('answers', {})  # {question_id: 'a'/'b'/'c'/'d'}
    
    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    
    # Calculate score
    score = 0
    total = 0
    
    for question_id, answer in answers.items():
        question = Question.query.get(int(question_id))
        if question:
            total += 1
            if answer.lower() == question.correct_answer.lower():
                score += 1
    
    percentage = (score / total * 100) if total > 0 else 0
    
    # Create quiz score record
    quiz_score = QuizScore(
        student_id=user_id,
        quiz_id=quiz_id,
        score=score,
        percentage=percentage
    )
    
    db.session.add(quiz_score)
    db.session.commit()
    
    return jsonify({
        'score': score,
        'total': total,
        'percentage': percentage,
        'message': 'Quiz submitted successfully'
    }), 201


@app.route('/api/student/notes', methods=['GET', 'POST'])
@jwt_required()
def student_notes():
    """Get or create student notes"""
    user_id = get_jwt_identity()
    
    if request.method == 'GET':
        notes = Note.query.filter_by(author_id=user_id).order_by(Note.created_at.desc()).all()
        return jsonify([note.to_dict() for note in notes]), 200
    
    # POST
    data = request.get_json()
    
    note = Note(
        title=data.get('title', ''),
        body=data.get('body', ''),
        author_id=user_id,
        is_public=False
    )
    
    db.session.add(note)
    db.session.commit()
    
    return jsonify(note.to_dict()), 201


@app.route('/api/student/notes/<int:note_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def manage_note(note_id):
    """Manage individual note"""
    user_id = get_jwt_identity()
    note = Note.query.get(note_id)
    
    if not note:
        return jsonify({'error': 'Note not found'}), 404
    
    if note.author_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if request.method == 'GET':
        return jsonify(note.to_dict()), 200
    
    elif request.method == 'PUT':
        data = request.get_json()
        note.title = data.get('title', note.title)
        note.body = data.get('body', note.body)
        note.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify(note.to_dict()), 200
    
    elif request.method == 'DELETE':
        db.session.delete(note)
        db.session.commit()
        return jsonify({'message': 'Note deleted'}), 200


@app.route('/api/notices', methods=['GET'])
@jwt_required()
def get_notices():
    """Get all notices"""
    notices = Notice.query.order_by(Notice.created_at.desc()).all()
    return jsonify([notice.to_dict() for notice in notices]), 200


@app.route('/api/resource-links', methods=['GET'])
@jwt_required()
def get_resource_links():
    """Get all shared resource links"""
    links = ResourceLink.query.order_by(ResourceLink.created_at.desc()).all()
    return jsonify([link.to_dict() for link in links]), 200


# ==================== TEACHER ROUTES ====================

@app.route('/api/teacher/dashboard', methods=['GET'])
@jwt_required()
def teacher_dashboard():
    """Get teacher dashboard data"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user or user.role != 'teacher':
        return jsonify({'error': 'Unauthorized'}), 403
    
    courses = Course.query.filter_by(teacher_id=user_id).all()
    
    # Count students enrolled in any course
    student_ids = set()
    for course in courses:
        enrollments = Enrollment.query.filter_by(course_id=course.id).all()
        for e in enrollments:
            student_ids.add(e.student_id)
    
    stats = {
        'total_students': len(student_ids),
        'total_courses': len(courses),
        'total_quizzes': sum([len(Quiz.query.filter_by(course_id=c.id).all()) for c in courses]),
        'total_notices': len(user.notices)
    }
    
    return jsonify({
        'user': user.to_dict(),
        'stats': stats,
        'courses': [c.to_dict(include_teacher=False) for c in courses]
    }), 200


@app.route('/api/teacher/courses', methods=['GET', 'POST'])
@jwt_required()
def manage_courses():
    """Get or create courses"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'teacher':
        return jsonify({'error': 'Unauthorized'}), 403
    
    if request.method == 'GET':
        courses = Course.query.filter_by(teacher_id=user_id).all()
        return jsonify([c.to_dict(include_teacher=False) for c in courses]), 200
    
    # POST
    data = request.get_json()
    
    course = Course(
        title=data.get('title', ''),
        description=data.get('description', ''),
        category=data.get('category', ''),
        teacher_id=user_id,
        lessons=data.get('lessons', 0),
        duration=data.get('duration', ''),
        image_url=data.get('image_url', ''),
        color=data.get('color', '#6c63ff')
    )
    
    db.session.add(course)
    db.session.commit()
    
    return jsonify(course.to_dict(include_teacher=False)), 201


@app.route('/api/teacher/courses/<int:course_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def manage_course(course_id):
    """Manage individual course"""
    user_id = get_jwt_identity()
    course = Course.query.get(course_id)
    
    if not course or course.teacher_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if request.method == 'GET':
        return jsonify(course.to_dict(include_teacher=False)), 200
    
    elif request.method == 'PUT':
        data = request.get_json()
        course.title = data.get('title', course.title)
        course.description = data.get('description', course.description)
        course.category = data.get('category', course.category)
        course.lessons = data.get('lessons', course.lessons)
        course.duration = data.get('duration', course.duration)
        course.image_url = data.get('image_url', course.image_url)
        course.color = data.get('color', course.color)
        
        db.session.commit()
        return jsonify(course.to_dict(include_teacher=False)), 200
    
    elif request.method == 'DELETE':
        db.session.delete(course)
        db.session.commit()
        return jsonify({'message': 'Course deleted'}), 200


@app.route('/api/teacher/courses/<int:course_id>/enroll', methods=['POST'])
@jwt_required()
def enroll_student(course_id):
    """Enroll a student in a course"""
    user_id = get_jwt_identity()
    course = Course.query.get(course_id)
    
    if not course or course.teacher_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    student_id = data.get('student_id')
    
    student = User.query.get(student_id)
    if not student or student.role != 'student':
        return jsonify({'error': 'Invalid student'}), 400
    
    # Check if already enrolled
    existing = Enrollment.query.filter_by(student_id=student_id, course_id=course_id).first()
    if existing:
        return jsonify({'error': 'Student already enrolled'}), 409
    
    enrollment = Enrollment(student_id=student_id, course_id=course_id)
    db.session.add(enrollment)
    db.session.commit()
    
    return jsonify({'message': 'Student enrolled successfully'}), 201


@app.route('/api/teacher/quizzes', methods=['GET', 'POST'])
@jwt_required()
def manage_quizzes():
    """Get or create quizzes"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'teacher':
        return jsonify({'error': 'Unauthorized'}), 403
    
    if request.method == 'GET':
        courses = Course.query.filter_by(teacher_id=user_id).all()
        course_ids = [c.id for c in courses]
        quizzes = Quiz.query.filter(Quiz.course_id.in_(course_ids)).all()
        return jsonify([q.to_dict() for q in quizzes]), 200
    
    # POST
    data = request.get_json()
    
    # Verify course ownership
    course = Course.query.get(data.get('course_id'))
    if not course or course.teacher_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    quiz = Quiz(
        title=data.get('title', ''),
        course_id=data.get('course_id'),
        due_date=datetime.fromisoformat(data['due_date']) if data.get('due_date') else None,
        total_questions=len(data.get('questions', []))
    )
    
    db.session.add(quiz)
    db.session.flush()
    
    # Add questions
    for q in data.get('questions', []):
        question = Question(
            quiz_id=quiz.id,
            question_text=q.get('text', ''),
            option_a=q.get('a', ''),
            option_b=q.get('b', ''),
            option_c=q.get('c', ''),
            option_d=q.get('d', ''),
            correct_answer=q.get('correct', '')
        )
        db.session.add(question)
    
    db.session.commit()
    
    return jsonify(quiz.to_dict()), 201


@app.route('/api/teacher/quizzes/<int:quiz_id>', methods=['DELETE'])
@jwt_required()
def delete_quiz(quiz_id):
    """Delete a quiz"""
    user_id = get_jwt_identity()
    quiz = Quiz.query.get(quiz_id)
    
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404
    
    course = Course.query.get(quiz.course_id)
    if not course or course.teacher_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(quiz)
    db.session.commit()
    
    return jsonify({'message': 'Quiz deleted'}), 200


@app.route('/api/teacher/notices', methods=['GET', 'POST'])
@jwt_required()
def manage_notices():
    """Get or create notices"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'teacher':
        return jsonify({'error': 'Unauthorized'}), 403
    
    if request.method == 'GET':
        notices = Notice.query.order_by(Notice.created_at.desc()).all()
        return jsonify([n.to_dict() for n in notices]), 200
    
    # POST
    data = request.get_json()
    
    notice = Notice(
        title=data.get('title', ''),
        body=data.get('body', ''),
        author_id=user_id
    )
    
    db.session.add(notice)
    db.session.commit()
    
    return jsonify(notice.to_dict()), 201


@app.route('/api/teacher/notices/<int:notice_id>', methods=['DELETE'])
@jwt_required()
def delete_notice(notice_id):
    """Delete a notice"""
    user_id = get_jwt_identity()
    notice = Notice.query.get(notice_id)
    
    if not notice or notice.author_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(notice)
    db.session.commit()
    
    return jsonify({'message': 'Notice deleted'}), 200


@app.route('/api/teacher/notes', methods=['GET', 'POST'])
@jwt_required()
def manage_teacher_notes():
    """Get or create teacher notes"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'teacher':
        return jsonify({'error': 'Unauthorized'}), 403
    
    if request.method == 'GET':
        notes = Note.query.filter_by(author_id=user_id).order_by(Note.created_at.desc()).all()
        return jsonify([n.to_dict() for n in notes]), 200
    
    # POST
    data = request.get_json()
    
    note = Note(
        title=data.get('title', ''),
        body=data.get('body', ''),
        author_id=user_id,
        is_public=data.get('is_public', False)
    )
    
    db.session.add(note)
    db.session.commit()
    
    return jsonify(note.to_dict()), 201


@app.route('/api/teacher/notes/<int:note_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def manage_teacher_note(note_id):
    """Manage individual teacher note"""
    user_id = get_jwt_identity()
    note = Note.query.get(note_id)
    
    if not note or note.author_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if request.method == 'GET':
        return jsonify(note.to_dict()), 200
    
    elif request.method == 'PUT':
        data = request.get_json()
        note.title = data.get('title', note.title)
        note.body = data.get('body', note.body)
        note.is_public = data.get('is_public', note.is_public)
        note.updated_at = datetime.utcnow()
        
        db.session.commit()
        return jsonify(note.to_dict()), 200
    
    elif request.method == 'DELETE':
        db.session.delete(note)
        db.session.commit()
        return jsonify({'message': 'Note deleted'}), 200


@app.route('/api/teacher/links', methods=['GET', 'POST'])
@jwt_required()
def manage_links():
    """Get or create resource links"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'teacher':
        return jsonify({'error': 'Unauthorized'}), 403
    
    if request.method == 'GET':
        links = ResourceLink.query.filter_by(shared_by_id=user_id).order_by(ResourceLink.created_at.desc()).all()
        return jsonify([l.to_dict() for l in links]), 200
    
    # POST
    data = request.get_json()
    
    link = ResourceLink(
        title=data.get('title', ''),
        url=data.get('url', ''),
        description=data.get('description', ''),
        shared_by_id=user_id
    )
    
    db.session.add(link)
    db.session.commit()
    
    return jsonify(link.to_dict()), 201


@app.route('/api/teacher/links/<int:link_id>', methods=['DELETE'])
@jwt_required()
def delete_link(link_id):
    """Delete a resource link"""
    user_id = get_jwt_identity()
    link = ResourceLink.query.get(link_id)
    
    if not link or link.shared_by_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(link)
    db.session.commit()
    
    return jsonify({'message': 'Link deleted'}), 200


@app.route('/api/teacher/students', methods=['GET'])
@jwt_required()
def get_students():
    """Get all students for teacher"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'teacher':
        return jsonify({'error': 'Unauthorized'}), 403
    
    courses = Course.query.filter_by(teacher_id=user_id).all()
    course_ids = [c.id for c in courses]
    
    enrollments = Enrollment.query.filter(Enrollment.course_id.in_(course_ids)).all()
    student_ids = set([e.student_id for e in enrollments])
    
    students = []
    for student_id in student_ids:
        student = User.query.get(student_id)
        if student:
            students.append(student.to_dict())
    
    return jsonify(students), 200


@app.route('/api/teacher/marks', methods=['GET'])
@jwt_required()
def get_marks():
    """Get student marks/scores"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if user.role != 'teacher':
        return jsonify({'error': 'Unauthorized'}), 403
    
    courses = Course.query.filter_by(teacher_id=user_id).all()
    course_ids = [c.id for c in courses]
    quizzes = Quiz.query.filter(Quiz.course_id.in_(course_ids)).all()
    quiz_ids = [q.id for q in quizzes]
    
    scores = QuizScore.query.filter(QuizScore.quiz_id.in_(quiz_ids)).all()
    
    return jsonify([{
        'student_id': s.student_id,
        'quiz_id': s.quiz_id,
        'score': s.score,
        'percentage': s.percentage,
        'submitted_at': s.submitted_at.isoformat()
    } for s in scores]), 200


# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': 'Internal server error'}), 500


# ==================== CREATE TABLES ====================

with app.app_context():
    db.create_all()


if __name__ == '__main__':
    app.run(debug=True, port=5000)

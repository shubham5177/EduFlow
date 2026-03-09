'use strict';

// ══════════════════════════════════════════
//  DATA
// ══════════════════════════════════════════
const USERS = [{
    id: 1,
    name: 'Arjun Sharma',
    email: 'arjun@student.com',
    pw: 'student123',
    role: 'student',
    avatar: 'AS',
    subject: ''
}, {
    id: 2,
    name: 'Priya Patel',
    email: 'priya@student.com',
    pw: 'student123',
    role: 'student',
    avatar: 'PP',
    subject: ''
}, {
    id: 3,
    name: 'Rahul Singh',
    email: 'rahul@student.com',
    pw: 'student123',
    role: 'student',
    avatar: 'RS',
    subject: ''
}, {
    id: 10,
    name: 'Dr. Sarah Johnson',
    email: 'sarah@teacher.com',
    pw: 'teacher123',
    role: 'teacher',
    avatar: 'SJ',
    subject: 'Web Development'
}, {
    id: 11,
    name: 'Prof. Michael Chen',
    email: 'michael@teacher.com',
    pw: 'teacher123',
    role: 'teacher',
    avatar: 'MC',
    subject: 'Data Science'
}];

let COURSES = [{
    id: 1,
    title: 'Complete Web Development Bootcamp',
    instructor: 'Dr. Sarah Johnson',
    category: 'Development',
    lessons: 42,
    duration: '40h 30m',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    color: '#6c63ff'
}, {
    id: 2,
    title: 'Data Science & Machine Learning A-Z',
    instructor: 'Prof. Michael Chen',
    category: 'Data Science',
    lessons: 38,
    duration: '36h 15m',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    color: '#fbbf24'
}, {
    id: 3,
    title: 'Digital Marketing Mastery',
    instructor: 'Dr. Sarah Johnson',
    category: 'Marketing',
    lessons: 28,
    duration: '22h 10m',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    color: '#06d6a0'
}];

let QUIZZES = [{
    id: 1,
    courseId: 1,
    title: 'HTML & CSS Fundamentals',
    dueDate: '2026-03-20',
    questions: [{
        q: 'What does HTML stand for?',
        options: ['HyperText Markup Language', 'High Text Markup Language', 'Hyper Transfer Markup Language', 'None of these'],
        answer: 0
    }, {
        q: 'Which tag is used for the largest heading?',
        options: ['<h6>', '<heading>', '<h1>', '<head>'],
        answer: 2
    }, {
        q: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'],
        answer: 1
    }, {
        q: 'Which CSS property changes text color?',
        options: ['text-color', 'font-color', 'color', 'foreground'],
        answer: 2
    }]
}, {
    id: 2,
    courseId: 2,
    title: 'Python Basics',
    dueDate: '2026-03-22',
    questions: [{
        q: 'Which keyword defines a function in Python?',
        options: ['func', 'define', 'def', 'function'],
        answer: 2
    }, {
        q: 'Output of print(2**3)?',
        options: ['6', '8', '9', '5'],
        answer: 1
    }, {
        q: 'Which data type is mutable?',
        options: ['tuple', 'string', 'list', 'int'],
        answer: 2
    }, {
        q: 'How do you start a comment in Python?',
        options: ['//', '/*', '#', '--'],
        answer: 2
    }]
}];

let NOTICES = [{
    id: 1,
    title: 'Mid-term Exam Schedule Released',
    body: 'Mid-term exams will be held from March 20–25. Please check the timetable on the portal.',
    date: '2026-03-09',
    author: 'Admin'
}, {
    id: 2,
    title: 'New Course: UI/UX Design Fundamentals',
    body: 'We are excited to announce a new course starting April 1st. Early enrollment is now open!',
    date: '2026-03-07',
    author: 'Dr. Sarah Johnson'
}];

let NOTES = [{
    id: 1,
    title: 'React Hooks Summary',
    body: 'useState, useEffect, useContext, useRef — core hooks to master. Remember: hooks cannot be called conditionally.',
    date: '2026-03-08'
}, {
    id: 2,
    title: 'ML Terminology',
    body: 'Overfitting: model memorizes training data. Underfitting: model is too simple. Regularization helps balance.',
    date: '2026-03-06'
}];

let LINKS = [{
    id: 1,
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: 'Best reference for HTML, CSS, JavaScript.',
    date: '2026-03-08'
}, {
    id: 2,
    title: 'Kaggle Datasets',
    url: 'https://kaggle.com/datasets',
    description: 'Free datasets for ML practice.',
    date: '2026-03-07'
}];

let STUDENT_RECORDS = [{
    id: 1,
    name: 'Arjun Sharma',
    email: 'arjun@student.com',
    avatar: 'AS',
    progress: 72,
    enrolled: [1, 2]
}, {
    id: 2,
    name: 'Priya Patel',
    email: 'priya@student.com',
    avatar: 'PP',
    progress: 88,
    enrolled: [1, 3]
}, {
    id: 3,
    name: 'Rahul Singh',
    email: 'rahul@student.com',
    avatar: 'RS',
    progress: 45,
    enrolled: [2, 3]
}];

const QUIZ_SCORES = {
    1: { 1: 88, 2: 92, 3: 70 },
    2: { 1: 75, 2: 95, 3: 60 }
};

const COURSE_PROGRESS = {
    1: 65,
    2: 30,
    3: 85
};

let QUIZ_RESULTS = [{
    quizId: 1,
    score: 88,
    date: '2026-03-07'
}];

// ══════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════
let currentUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')) : null;
let currentRole = null;

// ══════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════
function showPage(id) {
    window.location.href = id === 'landing' ? 'index.html' : id + '.html';
}

function openModal(id) {
    document.getElementById(id).classList.add('open');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

function openSidebar(role) {
    document.getElementById('sidebar-' + role).classList.add('open');
    document.getElementById('sidebar-overlay-' + role).classList.add('open');
}

function closeSidebar(role) {
    document.getElementById('sidebar-' + role).classList.remove('open');
    document.getElementById('sidebar-overlay-' + role).classList.remove('open');
}

function switchTab(btn, role) {
    const tabId = btn.getAttribute('data-tab');
    const pageId = role === 's' ? 'student' : 'teacher';
    document.querySelectorAll('#page-' + pageId + ' .sidebar-nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#page-' + pageId + ' .tab-content-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(tabId);
    if (panel) panel.classList.add('active');

    const titles = {
        's-home': 'Dashboard',
        's-courses': 'My Courses',
        's-quizzes': 'Quizzes',
        's-marks': 'My Marks',
        's-notes': 'Notes',
        's-notices': 'Notices',
        's-links': 'Resources',
        't-home': 'Dashboard',
        't-students': 'Students',
        't-courses': 'Courses',
        't-quizzes': 'Quizzes',
        't-marks': 'Marks',
        't-notes': 'Notes',
        't-notices': 'Notices',
        't-links': 'Links'
    };
    const titleEl = document.getElementById((role === 's' ? 's' : 't') + '-tab-title');
    if (titleEl) titleEl.textContent = titles[tabId] || '';
    closeSidebar(role);
}

function avatarGrad(role) {
    return role === 'teacher' ? 'linear-gradient(135deg,#4f46e5,#2563eb)' : 'linear-gradient(135deg,#6c63ff,#a78bfa)';
}

function badge(text, color) {
    return `<span class="edu-badge" style="background:${color}22;color:${color};border:1px solid ${color}44;">${text}</span>`;
}

function progressBar(val, color) {
    return `<div class="edu-progress"><div class="edu-progress-bar" style="width:${val}%;background:${color};"></div></div>`;
}

function avatarHtml(initials, size = 'sm', grad = '') {
    const g = grad || 'linear-gradient(135deg,#6c63ff,#a78bfa)';
    return `<div class="edu-avatar edu-avatar-${size}" style="background:${g};">${initials}</div>`;
}

function today() {
    return new Date().toISOString().split('T')[0];
}

function doLogout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    currentRole = null;
    window.location.href = 'login.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Close modals on overlay click
    document.querySelectorAll('.edu-modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('open');
        });
    });
});
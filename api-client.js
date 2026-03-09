// API Configuration
const API_URL = localStorage.getItem('API_URL') || 'http://localhost:5000/api';

class EduFlowAPI {
    constructor() {
        this.token = localStorage.getItem('access_token');
    }

    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('access_token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('access_token');
    }

    // ==================== AUTH ====================

    async register(name, email, password, role, subject = '') {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role,
                    subject
                })
            });

            const data = await response.json();

            if (response.ok) {
                this.setToken(data.access_token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                return { success: true, data };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                this.setToken(data.access_token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                return { success: true, data };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getCurrentUser() {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, data };
            } else {
                return { success: false, error: 'Unauthorized' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    logout() {
        this.clearToken();
        localStorage.removeItem('currentUser');
    }

    // ==================== STUDENT ====================

    async getStudentDashboard() {
        try {
            const response = await fetch(`${API_URL}/student/dashboard`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getStudentCourses() {
        try {
            const response = await fetch(`${API_URL}/student/courses`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getCourseQuizzes(courseId) {
        try {
            const response = await fetch(`${API_URL}/student/quizzes/${courseId}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getQuiz(quizId) {
        try {
            const response = await fetch(`${API_URL}/student/quiz/${quizId}`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async submitQuiz(quizId, answers) {
        try {
            const response = await fetch(`${API_URL}/student/quiz/${quizId}/submit`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ answers })
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getStudentNotes() {
        try {
            const response = await fetch(`${API_URL}/student/notes`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async createStudentNote(title, body) {
        try {
            const response = await fetch(`${API_URL}/student/notes`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ title, body })
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updateStudentNote(noteId, title, body) {
        try {
            const response = await fetch(`${API_URL}/student/notes/${noteId}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify({ title, body })
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteStudentNote(noteId) {
        try {
            const response = await fetch(`${API_URL}/student/notes/${noteId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getNotices() {
        try {
            const response = await fetch(`${API_URL}/notices`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getResourceLinks() {
        try {
            const response = await fetch(`${API_URL}/resource-links`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // ==================== TEACHER ====================

    async getTeacherDashboard() {
        try {
            const response = await fetch(`${API_URL}/teacher/dashboard`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getTeacherCourses() {
        try {
            const response = await fetch(`${API_URL}/teacher/courses`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async createCourse(title, description, category, lessons, duration, imageUrl, color) {
        try {
            const response = await fetch(`${API_URL}/teacher/courses`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    title,
                    description,
                    category,
                    lessons,
                    duration,
                    image_url: imageUrl,
                    color
                })
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteCourse(courseId) {
        try {
            const response = await fetch(`${API_URL}/teacher/courses/${courseId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getTeacherQuizzes() {
        try {
            const response = await fetch(`${API_URL}/teacher/quizzes`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async createQuiz(title, courseId, dueDate, questions) {
        try {
            const response = await fetch(`${API_URL}/teacher/quizzes`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    title,
                    course_id: courseId,
                    due_date: dueDate,
                    questions
                })
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteQuiz(quizId) {
        try {
            const response = await fetch(`${API_URL}/teacher/quizzes/${quizId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getTeacherNotices() {
        try {
            const response = await fetch(`${API_URL}/teacher/notices`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async createNotice(title, body) {
        try {
            const response = await fetch(`${API_URL}/teacher/notices`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ title, body })
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteNotice(noticeId) {
        try {
            const response = await fetch(`${API_URL}/teacher/notices/${noticeId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getTeacherNotes() {
        try {
            const response = await fetch(`${API_URL}/teacher/notes`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async createTeacherNote(title, body, isPublic = false) {
        try {
            const response = await fetch(`${API_URL}/teacher/notes`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ title, body, is_public: isPublic })
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteTeacherNote(noteId) {
        try {
            const response = await fetch(`${API_URL}/teacher/notes/${noteId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getTeacherLinks() {
        try {
            const response = await fetch(`${API_URL}/teacher/links`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async createLink(title, url, description) {
        try {
            const response = await fetch(`${API_URL}/teacher/links`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ title, url, description })
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async deleteLink(linkId) {
        try {
            const response = await fetch(`${API_URL}/teacher/links/${linkId}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getStudents() {
        try {
            const response = await fetch(`${API_URL}/teacher/students`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getTeacherMarks() {
        try {
            const response = await fetch(`${API_URL}/teacher/marks`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            const data = await response.json();
            return response.ok ? { success: true, data } : { success: false, error: data.error };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Create global API instance
const api = new EduFlowAPI();
// Global state
let signupRole = 'student';

// Password visibility toggle
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const iconId = inputId.includes('login') ? 'login-eye-icon' :
        inputId.includes('signup') ? 'signup-eye-icon' : 'eye-icon';
    const icon = document.getElementById(iconId);

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

// Select signup role
function selectSignupRole(role) {
    signupRole = role;

    const studentBtn = document.getElementById('student-role-btn');
    const teacherBtn = document.getElementById('teacher-role-btn');
    const subjectField = document.getElementById('signup-subject-field');

    if (role === 'student') {
        studentBtn.style.background = 'rgba(108,99,255,.15)';
        studentBtn.style.border = '2px solid #6c63ff';
        teacherBtn.style.background = 'transparent';
        teacherBtn.style.border = '2px solid var(--border)';
        subjectField.style.display = 'none';
    } else {
        teacherBtn.style.background = 'rgba(108,99,255,.15)';
        teacherBtn.style.border = '2px solid #6c63ff';
        studentBtn.style.background = 'transparent';
        studentBtn.style.border = '2px solid var(--border)';
        subjectField.style.display = 'block';
    }
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error-message');
    const btnText = document.getElementById('login-btn-text');
    const btnLoader = document.getElementById('login-btn-loader');

    if (!email || !password) {
        errorDiv.textContent = 'Please fill in all fields';
        errorDiv.style.display = 'block';
        return;
    }

    // Show loader
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';

    const result = await api.login(email, password);

    if (result.success) {
        const user = result.data.user;

        // Redirect based on role
        if (user.role === 'student') {
            window.location.href = 'student.html';
        } else if (user.role === 'teacher') {
            window.location.href = 'teacher.html';
        }
    } else {
        errorDiv.textContent = result.error || 'Login failed';
        errorDiv.style.display = 'block';
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Handle signup
async function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const subject = document.getElementById('signup-subject').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const errorDiv = document.getElementById('signup-error-message');
    const btnText = document.getElementById('signup-btn-text');
    const btnLoader = document.getElementById('signup-btn-loader');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        errorDiv.textContent = 'Please fill in all fields';
        errorDiv.style.display = 'block';
        return;
    }

    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.style.display = 'block';
        return;
    }

    if (password.length < 6) {
        errorDiv.textContent = 'Password must be at least 6 characters';
        errorDiv.style.display = 'block';
        return;
    }

    if (signupRole === 'teacher' && !subject) {
        errorDiv.textContent = 'Please enter your subject for teacher role';
        errorDiv.style.display = 'block';
        return;
    }

    // Show loader
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline';
    errorDiv.style.display = 'none';

    const result = await api.register(name, email, password, signupRole, subject);

    if (result.success) {
        const user = result.data.user;

        // Redirect based on role
        if (user.role === 'student') {
            window.location.href = 'student.html';
        } else if (user.role === 'teacher') {
            window.location.href = 'teacher.html';
        }
    } else {
        errorDiv.textContent = result.error || 'Registration failed';
        errorDiv.style.display = 'block';
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const token = localStorage.getItem('access_token');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (token && currentUser) {
        if (currentUser.role === 'student') {
            window.location.href = 'student.html';
        } else if (currentUser.role === 'teacher') {
            window.location.href = 'teacher.html';
        }
    }

    // Default to student role on signup
    selectSignupRole('student');

    // Allow Enter key on password fields
    document.getElementById('login-password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('login-form').dispatchEvent(new Event('submit'));
        }
    });

    document.getElementById('signup-confirm-password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('signup-form').dispatchEvent(new Event('submit'));
        }
    });
});
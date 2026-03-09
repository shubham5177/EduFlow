// ══════════════════════════════════════════
//  LOGIN LOGIC
// ══════════════════════════════════════════

function selectRole(role) {
    currentRole = role;
    document.getElementById('login-step-role').style.display = 'none';
    document.getElementById('login-step-creds').style.display = 'block';
    document.getElementById('login-role-badge').textContent = role === 'student' ? 'Student' : 'Teacher';
    document.getElementById('login-role-badge').style.background = role === 'student' ? '#6c63ff' : '#4f46e5';

    const demos = role === 'student' ? [{
        n: 'Arjun Sharma',
        e: 'arjun@student.com',
        p: 'student123'
    }, {
        n: 'Priya Patel',
        e: 'priya@student.com',
        p: 'student123'
    }] : [{
        n: 'Dr. Sarah Johnson',
        e: 'sarah@teacher.com',
        p: 'teacher123'
    }, {
        n: 'Prof. Michael Chen',
        e: 'michael@teacher.com',
        p: 'teacher123'
    }];

    document.getElementById('demo-accounts').innerHTML = demos.map(d =>
        `<div class="demo-item d-flex align-items-center gap-2" onclick="fillDemo('${d.e}','${d.p}')">
      ${avatarHtml(d.n.split(' ').map(x=>x[0]).join('').slice(0,2),'sm',avatarGrad(role))}
      <div>
        <div class="text-white" style="font-size:.85rem;font-weight:600;">${d.n}</div>
        <div style="color:var(--text-muted);font-size:.76rem;">${d.e}</div>
      </div>
    </div>`
    ).join('');
}

function fillDemo(email, pw) {
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').value = pw;
}

function backToRole() {
    currentRole = null;
    document.getElementById('login-step-role').style.display = 'block';
    document.getElementById('login-step-creds').style.display = 'none';
    document.getElementById('login-error').classList.add('d-none');
}

function togglePw() {
    const inp = document.getElementById('login-password');
    const ico = document.getElementById('pw-eye');
    if (inp.type === 'password') {
        inp.type = 'text';
        ico.className = 'bi bi-eye-slash';
    } else {
        inp.type = 'password';
        ico.className = 'bi bi-eye';
    }
}

function doLogin() {
    const email = document.getElementById('login-email').value.trim();
    const pw = document.getElementById('login-password').value;
    const err = document.getElementById('login-error');
    const errMsg = document.getElementById('login-error-msg');

    const user = USERS.find(u => u.email === email && u.pw === pw && u.role === currentRole);
    if (!user) {
        err.classList.remove('d-none');
        errMsg.textContent = 'Invalid email or password for this role.';
        return;
    }
    err.classList.add('d-none');
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));

    if (user.role === 'student') {
        window.location.href = 'student.html';
    } else {
        window.location.href = 'teacher.html';
    }
}

// Initialize password field to submit on Enter
document.addEventListener('DOMContentLoaded', () => {
    const pwField = document.getElementById('login-password');
    if (pwField) {
        pwField.addEventListener('keydown', e => {
            if (e.key === 'Enter') doLogin();
        });
    }
});
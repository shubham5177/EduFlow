// ══════════════════════════════════════════
//  TEACHER DASHBOARD
// ══════════════════════════════════════════

let quizQCount = 1;

// Check if user is logged in and is a teacher
document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser || currentUser.role !== 'teacher') {
        window.location.href = 'login.html';
        return;
    }
    setupTeacherDash();
    addQuizQuestion();
});

function setupTeacherDash() {
    const u = currentUser;
    document.getElementById('t-sidebar-avatar').textContent = u.avatar;
    document.getElementById('t-sidebar-name').textContent = u.name;
    document.getElementById('t-sidebar-sub').textContent = 'Teacher · ' + u.subject;
    document.getElementById('t-top-avatar').textContent = u.avatar;
    document.getElementById('t-home-avatar').textContent = u.avatar;
    document.getElementById('t-home-name').textContent = u.name;
    document.getElementById('t-home-sub').textContent = `${u.subject} · ${STUDENT_RECORDS.length} students enrolled`;

    renderTeacherStats();
    renderTeacherQuickActions();
    renderTeacherHomeStudents();
    renderTeacherStudents();
    renderTeacherCourses();
    renderTeacherQuizzes();
    renderTeacherMarks();
    renderTeacherNotes();
    renderTeacherNotices();
    renderTeacherLinks();
    populateQuizCourseSelect();
}

function renderTeacherStats() {
    const stats = [{
            l: 'Total Students',
            v: STUDENT_RECORDS.length,
            icon: 'bi-people-fill',
            c: '#6c63ff'
        },
        {
            l: 'Courses',
            v: COURSES.length,
            icon: 'bi-book-fill',
            c: '#3b82f6'
        },
        {
            l: 'Quizzes',
            v: QUIZZES.length,
            icon: 'bi-patch-check-fill',
            c: '#06d6a0'
        },
        {
            l: 'Notices',
            v: NOTICES.length,
            icon: 'bi-bell-fill',
            c: '#fbbf24'
        },
    ];
    document.getElementById('t-home-stats').innerHTML = stats.map(s =>
        `<div class="col-6 col-lg-3">
      <div class="edu-card p-4">
        <div style="width:38px;height:38px;border-radius:12px;background:${s.c}22;display:flex;align-items:center;justify-content:center;margin-bottom:.75rem;">
          <i class="bi ${s.icon}" style="color:${s.c};font-size:1rem;"></i>
        </div>
        <div class="font-display text-white fw-bold fs-4">${s.v}</div>
        <div style="color:var(--text-muted);font-size:.8rem;">${s.l}</div>
      </div>
    </div>`).join('');
}

function renderTeacherQuickActions() {
    const actions = [{
            l: 'Add Course',
            icon: 'bi-book-fill',
            c: '#6c63ff',
            fn: "openModal('modal-add-course')"
        },
        {
            l: 'Add Quiz',
            icon: 'bi-patch-check-fill',
            c: '#06d6a0',
            fn: "openModal('modal-add-quiz')"
        },
        {
            l: 'Post Notice',
            icon: 'bi-bell-fill',
            c: '#fbbf24',
            fn: "openModal('modal-add-notice')"
        },
        {
            l: 'Share Link',
            icon: 'bi-link-45deg',
            c: '#f43f5e',
            fn: "openModal('modal-add-link')"
        },
    ];
    document.getElementById('t-quick-actions').innerHTML = actions.map(a =>
        `<div class="col-6 col-md-3">
      <div class="edu-card p-4" style="cursor:pointer;" onclick="${a.fn}">
        <div style="width:38px;height:38px;border-radius:12px;background:${a.c}22;display:flex;align-items:center;justify-content:center;margin-bottom:.75rem;">
          <i class="bi ${a.icon}" style="color:${a.c};font-size:1rem;"></i>
        </div>
        <div style="color:#bbbbd0;font-size:.85rem;font-weight:600;">${a.l}</div>
      </div>
    </div>`).join('');
}

function renderTeacherHomeStudents() {
    document.getElementById('t-home-students').innerHTML = `<table class="edu-table">
    <thead><tr><th>Student</th><th>Courses</th><th>Progress</th></tr></thead>
    <tbody>
      ${STUDENT_RECORDS.slice(0, 4).map(s => `
        <tr>
          <td><div class="d-flex align-items-center gap-2">${avatarHtml(s.avatar, 'sm', avatarGrad('student'))}<div><div class="text-white fw-semibold" style="font-size:.88rem;">${s.name}</div><div style="color:var(--text-muted);font-size:.76rem;">${s.email}</div></div></div></td>
          <td>${s.enrolled.map(cid => {
            const c = COURSES.find(x => x.id === cid);
            return c ? badge(c.category, c.color) : '';
        }).join(' ')}</td>
          <td><div style="min-width:100px;">${progressBar(s.progress, '#6c63ff')}<div style="font-size:.76rem;color:var(--text-muted);margin-top:2px;">${s.progress}%</div></div></td>
        </tr>`).join('')}
    </tbody>
  </table>`;
}

function renderTeacherStudents() {
    document.getElementById('t-students-count').textContent = `${STUDENT_RECORDS.length} enrolled students`;
    document.getElementById('t-students-table').innerHTML = `<table class="edu-table">
    <thead><tr><th>Student</th><th>Enrolled Courses</th><th>Progress</th><th>Quiz Avg</th></tr></thead>
    <tbody>
      ${STUDENT_RECORDS.map(s => {
        const scores = Object.values(QUIZ_SCORES).map(v => v[s.id]).filter(Boolean);
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
        return `<tr>
          <td><div class="d-flex align-items-center gap-2">${avatarHtml(s.avatar, 'sm', avatarGrad('student'))}<div><div class="text-white fw-semibold" style="font-size:.88rem;">${s.name}</div><div style="color:var(--text-muted);font-size:.76rem;">${s.email}</div></div></div></td>
          <td>${s.enrolled.map(cid => {
            const c = COURSES.find(x => x.id === cid);
            return c ? badge(c.category, c.color) : '';
        }).join(' ')}</td>
          <td><div style="min-width:90px;">${progressBar(s.progress, '#6c63ff')}<span style="font-size:.76rem;color:var(--text-muted);">${s.progress}%</span></div></td>
          <td>${avg !== null ? `<span style="font-family:'Syne',sans-serif;font-weight:800;color:${avg >= 70 ? '#06d6a0' : '#f43f5e'};">${avg}%</span>` : `<span style="color:var(--text-muted);">N/A</span>`}</td>
        </tr>`;
    }).join('')}
    </tbody>
  </table>`;
}

function renderTeacherCourses() {
    document.getElementById('t-courses-grid').innerHTML = COURSES.map(c => `
    <div class="col-sm-6 col-lg-4">
      <div class="edu-card edu-card-hover overflow-hidden">
        <img src="${c.image}" class="course-thumb" />
        <div class="course-card-inner">
          ${badge(c.category, c.color)}
          <div class="text-white fw-bold mt-2 mb-1">${c.title}</div>
          <div style="color:var(--text-muted);font-size:.8rem;">${c.instructor}</div>
          <div class="d-flex gap-3 my-2" style="font-size:.78rem;color:var(--text-muted);">
            <span><i class="bi bi-book me-1"></i>${c.lessons} lessons</span>
            <span><i class="bi bi-clock me-1"></i>${c.duration}</span>
          </div>
          <button onclick="deleteCourse(${c.id})" class="btn-edu-danger btn w-100 mt-1 py-2"><i class="bi bi-trash me-1"></i>Delete Course</button>
        </div>
      </div>
    </div>`).join('');
}

function deleteCourse(id) {
    COURSES = COURSES.filter(c => c.id !== id);
    renderTeacherCourses();
    renderTeacherStats();
    populateQuizCourseSelect();
}

function saveCourse() {
    const title = document.getElementById('c-title').value.trim();
    if (!title) return;
    const newCourse = {
        id: Date.now(),
        title,
        instructor: currentUser.name,
        category: document.getElementById('c-cat').value,
        lessons: parseInt(document.getElementById('c-lessons').value) || 10,
        duration: document.getElementById('c-duration').value || '10h',
        image: document.getElementById('c-image').value || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
        color: '#6c63ff'
    };
    COURSES.push(newCourse);
    document.getElementById('c-title').value = '';
    document.getElementById('c-lessons').value = '';
    document.getElementById('c-duration').value = '';
    document.getElementById('c-image').value = '';
    closeModal('modal-add-course');
    renderTeacherCourses();
    renderTeacherStats();
    populateQuizCourseSelect();
}

function renderTeacherQuizzes() {
    document.getElementById('t-quiz-grid').innerHTML = QUIZZES.map(q => {
        const course = COURSES.find(c => c.id === q.courseId);
        return `<div class="col-sm-6 col-lg-4">
      <div class="edu-card p-4">
        <div class="d-flex align-items-start justify-content-between mb-3">
          <div>
            ${course ? badge(course.category, course.color) : ''}
            <div class="text-white fw-bold mt-2">${q.title}</div>
            <div style="color:var(--text-muted);font-size:.78rem;margin-top:.2rem;">${q.questions.length} questions · Due ${q.dueDate}</div>
          </div>
          <button onclick="deleteQuiz(${q.id})" class="btn" style="padding:4px 7px;font-size:.8rem;color:#f43f5e;"><i class="bi bi-trash"></i></button>
        </div>
        <div style="border-top:1px solid var(--border);padding-top:.75rem;">
          <div style="color:var(--text-muted);font-size:.76rem;font-weight:700;margin-bottom:.5rem;text-transform:uppercase;letter-spacing:.04em;">Student Scores</div>
          <div class="d-flex gap-3 flex-wrap">
            ${STUDENT_RECORDS.map(s => {
            const sc = QUIZ_SCORES[q.id]?.[s.id];
            return `<div class="text-center">
                ${avatarHtml(s.avatar, 'sm', avatarGrad('student'))}
                <div style="font-size:.72rem;font-weight:700;margin-top:2px;color:${sc ? (sc >= 70 ? '#06d6a0' : '#f43f5e') : 'var(--text-muted)'};">${sc ? sc + '%' : '–'}</div>
              </div>`;
        }).join('')}
          </div>
        </div>
      </div>
    </div>`;
    }).join('');
}

function deleteQuiz(id) {
    QUIZZES = QUIZZES.filter(q => q.id !== id);
    renderTeacherQuizzes();
    renderTeacherStats();
    renderTeacherMarks();
}

function populateQuizCourseSelect() {
    const sel = document.getElementById('q-course');
    if (!sel) return;
    sel.innerHTML = COURSES.map(c => `<option value="${c.id}">${c.title}</option>`).join('');
}

function addQuizQuestion() {
    quizQCount++;
    const container = document.getElementById('quiz-questions-container');
    if (!container) return;
    const div = document.createElement('div');
    div.style.cssText = 'border:1px solid #e5e7eb;border-radius:12px;padding:.75rem;margin-bottom:.75rem;';
    div.id = `q-question-${quizQCount}`;
    div.innerHTML = `
    <div style="font-size:.8rem;font-weight:700;color:#444;margin-bottom:.5rem;">Question ${quizQCount}</div>
    <input type="text" id="q-q-${quizQCount}" placeholder="Question text..." style="width:100%;border:1.5px solid #e5e7eb;border-radius:8px;padding:.5rem .75rem;font-size:.85rem;margin-bottom:.5rem;outline:none;" />
    ${[0, 1, 2, 3].map(i => `
      <div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.35rem;">
        <input type="radio" name="ans-${quizQCount}" value="${i}" />
        <input type="text" id="q-opt-${quizQCount}-${i}" placeholder="Option ${String.fromCharCode(65 + i)}" style="flex:1;border:1.5px solid #e5e7eb;border-radius:8px;padding:.4rem .75rem;font-size:.82rem;outline:none;" />
      </div>`).join('')}
    <div style="font-size:.75rem;color:#888;margin-top:.25rem;">Select the correct answer above</div>`;
    container.appendChild(div);
}

function saveQuiz() {
    const title = document.getElementById('q-title').value.trim();
    if (!title) return;
    const courseId = parseInt(document.getElementById('q-course').value);
    const dueDate = document.getElementById('q-due').value;
    const questions = [];

    for (let i = 1; i <= quizQCount; i++) {
        const qEl = document.getElementById(`q-q-${i}`);
        if (!qEl || !qEl.value.trim()) continue;
        const opts = [0, 1, 2, 3].map(j => {
            const el = document.getElementById(`q-opt-${i}-${j}`);
            return el ? el.value : '';
        });
        const ansEl = document.querySelector(`input[name="ans-${i}"]:checked`);
        questions.push({
            q: qEl.value,
            options: opts,
            answer: ansEl ? parseInt(ansEl.value) : 0
        });
    }

    if (questions.length === 0) questions.push({
        q: 'Sample Question',
        options: ['A', 'B', 'C', 'D'],
        answer: 0
    });

    QUIZZES.push({
        id: Date.now(),
        courseId,
        title,
        dueDate,
        questions
    });
    quizQCount = 0;
    document.getElementById('quiz-questions-container').innerHTML = '';
    document.getElementById('q-title').value = '';
    document.getElementById('q-due').value = '';
    closeModal('modal-add-quiz');
    renderTeacherQuizzes();
    renderTeacherStats();
    renderTeacherMarks();
    addQuizQuestion();
}

function renderTeacherMarks() {
    document.getElementById('t-marks-table').innerHTML = `<table class="edu-table">
    <thead><tr>
      <th>Student</th>
      ${QUIZZES.map(q => `<th style="text-align:center;">${q.title}</th>`).join('')}
      <th style="text-align:center;">Avg</th>
    </tr></thead>
    <tbody>
      ${STUDENT_RECORDS.map(s => {
        const scores = QUIZZES.map(q => QUIZ_SCORES[q.id]?.[s.id] ?? null);
        const valid = scores.filter(x => x !== null);
        const avg = valid.length ? Math.round(valid.reduce((a, b) => a + b, 0) / valid.length) : null;
        return `<tr>
          <td><div class="d-flex align-items-center gap-2">${avatarHtml(s.avatar, 'sm', avatarGrad('student'))}<span class="text-white fw-semibold" style="font-size:.88rem;">${s.name}</span></div></td>
          ${scores.map(sc => `<td style="text-align:center;">${sc !== null ? `<span style="font-family:'Syne',sans-serif;font-weight:800;color:${sc >= 70 ? '#06d6a0' : '#f43f5e'};">${sc}%</span>` : `<span style="color:var(--text-muted);">–</span>`}</td>`).join('')}
          <td style="text-align:center;">${avg !== null ? `<span style="font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;color:${avg >= 70 ? '#06d6a0' : '#f43f5e'};">${avg}%</span>` : `<span style="color:var(--text-muted);">–</span>`}</td>
        </tr>`;
    }).join('')}
    </tbody>
  </table>`;
}

function renderTeacherNotes() {
    const el = document.getElementById('t-notes-grid');
    el.innerHTML = NOTES.map(n => `
    <div class="col-sm-6 col-lg-4">
      <div class="edu-card p-4 h-100">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div class="text-white fw-bold" style="font-size:.9rem;">${n.title}</div>
          <button onclick="deleteTeacherNote(${n.id})" class="btn" style="padding:3px 7px;font-size:.8rem;color:#f43f5e;"><i class="bi bi-trash"></i></button>
        </div>
        <div style="color:var(--text-muted);font-size:.83rem;line-height:1.6;">${n.body.substring(0, 130)}${n.body.length > 130 ? '...' : ''}</div>
        <div style="color:#44445566;font-size:.76rem;margin-top:.75rem;">${n.date}</div>
      </div>
    </div>`).join('');
}

function saveTeacherNote() {
    const title = document.getElementById('tn-title').value.trim();
    const body = document.getElementById('tn-body').value.trim();
    if (!title) return;
    NOTES.push({
        id: Date.now(),
        title,
        body,
        date: today()
    });
    document.getElementById('tn-title').value = '';
    document.getElementById('tn-body').value = '';
    closeModal('modal-add-note');
    renderTeacherNotes();
}

function deleteTeacherNote(id) {
    NOTES = NOTES.filter(n => n.id !== id);
    renderTeacherNotes();
}

function renderTeacherNotices() {
    document.getElementById('t-notices-list').innerHTML = NOTICES.map(n => `
    <div class="notice-card d-flex gap-3 mb-3">
      <div class="notice-icon" style="background:rgba(251,191,36,.15);"><i class="bi bi-bell-fill" style="color:#fbbf24;"></i></div>
      <div class="flex-1">
        <div class="text-white fw-bold mb-1">${n.title}</div>
        <div style="color:var(--text-muted);font-size:.85rem;line-height:1.6;">${n.body}</div>
        <div class="d-flex gap-2 mt-2" style="color:#44445599;font-size:.76rem;">
          <span>${n.date}</span><span>·</span><span>${n.author}</span>
        </div>
      </div>
      <button onclick="deleteNotice(${n.id})" class="btn align-self-start" style="padding:4px 7px;font-size:.8rem;color:#f43f5e;"><i class="bi bi-trash"></i></button>
    </div>`).join('');
}

function saveNotice() {
    const title = document.getElementById('n-title').value.trim();
    const body = document.getElementById('n-body').value.trim();
    if (!title) return;
    NOTICES.unshift({
        id: Date.now(),
        title,
        body,
        date: today(),
        author: currentUser.name
    });
    document.getElementById('n-title').value = '';
    document.getElementById('n-body').value = '';
    closeModal('modal-add-notice');
    renderTeacherNotices();
    renderTeacherStats();
}

function deleteNotice(id) {
    NOTICES = NOTICES.filter(n => n.id !== id);
    renderTeacherNotices();
    renderTeacherStats();
}

function renderTeacherLinks() {
    document.getElementById('t-links-grid').innerHTML = LINKS.map(l => `
    <div class="col-sm-6 col-lg-4">
      <div class="link-card">
        <div class="d-flex align-items-start gap-3">
          <div class="notice-icon" style="background:rgba(79,70,229,.15);"><i class="bi bi-link-45deg" style="color:#818cf8;font-size:1.2rem;"></i></div>
          <div class="flex-1 overflow-hidden">
            <div class="text-white fw-bold" style="font-size:.9rem;">${l.title}</div>
            <div style="color:var(--text-muted);font-size:.8rem;margin:.2rem 0;">${l.description}</div>
            <a href="${l.url}" target="_blank" rel="noreferrer" style="color:#4f46e5;font-size:.76rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;">${l.url}</a>
            <div style="color:#44445566;font-size:.74rem;margin-top:.4rem;">${l.date}</div>
          </div>
          <button onclick="deleteLink(${l.id})" class="btn" style="padding:4px 7px;font-size:.8rem;color:#f43f5e;"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    </div>`).join('');
}

function saveLink() {
    const title = document.getElementById('l-title').value.trim();
    const url = document.getElementById('l-url').value.trim();
    const desc = document.getElementById('l-desc').value.trim();
    if (!title || !url) return;
    LINKS.unshift({
        id: Date.now(),
        title,
        url,
        description: desc,
        date: today()
    });
    document.getElementById('l-title').value = '';
    document.getElementById('l-url').value = '';
    document.getElementById('l-desc').value = '';
    closeModal('modal-add-link');
    renderTeacherLinks();
}

function deleteLink(id) {
    LINKS = LINKS.filter(l => l.id !== id);
    renderTeacherLinks();
}
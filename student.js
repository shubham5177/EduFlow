// ══════════════════════════════════════════
//  STUDENT DASHBOARD
// ══════════════════════════════════════════

let currentQuiz = null;
let quizAnswers = [];

// Check if user is logged in and is a student
document.addEventListener('DOMContentLoaded', () => {
    if (!currentUser || currentUser.role !== 'student') {
        window.location.href = 'login.html';
        return;
    }
    setupStudentDash();
});

function setupStudentDash() {
    const u = currentUser;
    document.getElementById('s-sidebar-avatar').textContent = u.avatar;
    document.getElementById('s-sidebar-name').textContent = u.name;
    document.getElementById('s-top-avatar').textContent = u.avatar;
    document.getElementById('s-home-avatar').textContent = u.avatar;
    document.getElementById('s-home-name').textContent = u.name;
    document.getElementById('s-home-sub').textContent = `${COURSES.length} courses enrolled · Keep going!`;

    renderStudentStats();
    renderStudentHomeCourses();
    renderStudentHomeNotices();
    renderStudentCourses();
    renderStudentQuizGrid();
    renderStudentMarks();
    renderStudentNotes();
    renderStudentNotices();
    renderStudentLinks();
}

function renderStudentStats() {
    const avg = QUIZ_RESULTS.length ? Math.round(QUIZ_RESULTS.reduce((a, b) => a + b.score, 0) / QUIZ_RESULTS.length) : 0;
    const stats = [{
        l: 'Courses',
        v: COURSES.length,
        icon: 'bi-book-fill',
        c: '#6c63ff'
    }, {
        l: 'Quizzes Done',
        v: QUIZ_RESULTS.length,
        icon: 'bi-patch-check-fill',
        c: '#06d6a0'
    }, {
        l: 'Avg Score',
        v: QUIZ_RESULTS.length ? avg + '%' : 'N/A',
        icon: 'bi-trophy-fill',
        c: '#fbbf24'
    }, {
        l: 'Notes',
        v: NOTES.length,
        icon: 'bi-journal-text',
        c: '#f43f5e'
    }];
    document.getElementById('s-home-stats').innerHTML = stats.map(s =>
        `<div class="col-6 col-lg-3">
      <div class="edu-card p-4">
        <div style="width:38px;height:38px;border-radius:12px;background:${s.c}22;display:flex;align-items:center;justify-content:center;margin-bottom:.75rem;">
          <i class="bi ${s.icon}" style="color:${s.c};font-size:1rem;"></i>
        </div>
        <div class="font-display text-white fw-bold fs-4">${s.v}</div>
        <div style="color:var(--text-muted);font-size:.8rem;">${s.l}</div>
      </div>
    </div>`
    ).join('');
}

function renderStudentHomeCourses() {
    document.getElementById('s-home-courses').innerHTML = COURSES.slice(0, 3).map(c =>
        `<div class="col-sm-6 col-lg-4">
      <div class="edu-card edu-card-hover overflow-hidden">
        <img src="${c.image}" class="course-thumb" />
        <div class="course-card-inner">
          ${badge(c.category, c.color)}
          <div class="text-white fw-bold mt-2" style="font-size:.9rem;">${c.title}</div>
          <div style="color:var(--text-muted);font-size:.78rem;margin:.25rem 0 .75rem;">${c.instructor}</div>
          ${progressBar(COURSE_PROGRESS[c.id] || 0, c.color)}
          <div class="d-flex justify-content-between mt-1" style="font-size:.75rem;">
            <span style="color:var(--text-muted);">Progress</span>
            <span style="color:${c.color};font-weight:700;">${COURSE_PROGRESS[c.id] || 0}%</span>
          </div>
        </div>
      </div>
    </div>`
    ).join('');
}

function renderStudentHomeNotices() {
    document.getElementById('s-home-notices').innerHTML = NOTICES.slice(0, 2).map(n =>
        `<div class="notice-card d-flex gap-3 mb-3">
      <div class="notice-icon" style="background:rgba(108,99,255,.15)"><i class="bi bi-bell-fill" style="color:#a78bfa;"></i></div>
      <div>
        <div class="text-white fw-semibold">${n.title}</div>
        <div style="color:var(--text-muted);font-size:.82rem;margin:.2rem 0 .4rem;">${n.body.substring(0, 80)}...</div>
        <div style="color:#555577;font-size:.76rem;">${n.date} · ${n.author}</div>
      </div>
    </div>`
    ).join('');
}

function renderStudentCourses() {
    document.getElementById('s-courses-grid').innerHTML = COURSES.map(c =>
        `<div class="col-sm-6 col-lg-4">
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
          ${progressBar(COURSE_PROGRESS[c.id] || 0, c.color)}
          <div class="d-flex justify-content-between mt-1" style="font-size:.75rem;">
            <span style="color:var(--text-muted);">Completion</span>
            <span style="color:${c.color};font-weight:700;">${COURSE_PROGRESS[c.id] || 0}%</span>
          </div>
        </div>
      </div>
    </div>`
    ).join('');
}

function renderStudentQuizGrid() {
    document.getElementById('s-quiz-grid').innerHTML = QUIZZES.map(q => {
        const course = COURSES.find(c => c.id === q.courseId);
        const result = QUIZ_RESULTS.find(r => r.quizId === q.id);
        const scoreHtml = result ?
            `<div class="score-circle ms-auto" style="background:${result.score >= 70 ? 'rgba(6,214,160,.15)' : 'rgba(244,63,94,.12)'};">
          <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:1.2rem;color:${result.score >= 70 ? '#06d6a0' : '#f43f5e'};">${result.score}%</div>
          <div style="font-size:.65rem;color:var(--text-muted);">Score</div>
        </div>` : '';
        return `<div class="col-sm-6 col-lg-4">
      <div class="edu-card p-4">
        <div class="d-flex align-items-start gap-2 mb-3">
          <div class="flex-1">
            ${course ? badge(course.category, course.color) : ''}
            <div class="text-white fw-bold mt-2">${q.title}</div>
            <div style="color:var(--text-muted);font-size:.8rem;margin-top:.2rem;">${q.questions.length} questions · Due ${q.dueDate}</div>
          </div>
          ${scoreHtml}
        </div>
        <button class="btn w-100 py-2" style="border-radius:12px;font-weight:700;font-size:.88rem;background:${result ? 'rgba(255,255,255,.05)' : 'linear-gradient(135deg,' + (course ? course.color : '#6c63ff') + ',' + (course ? course.color + 'cc' : '#4f46e5') + ')'};color:#fff;border:${result ? '1px solid rgba(255,255,255,.1)' : 'none'};"
          onclick="startQuiz(${q.id})">${result ? 'Retake Quiz' : 'Start Quiz'}</button>
      </div>
    </div>`;
    }).join('');
}

function startQuiz(quizId) {
    currentQuiz = QUIZZES.find(q => q.id === quizId);
    if (!currentQuiz) return;
    quizAnswers = new Array(currentQuiz.questions.length).fill(-1);

    document.getElementById('quiz-list-view').style.display = 'none';
    document.getElementById('quiz-result-view').style.display = 'none';
    document.getElementById('quiz-take-view').style.display = 'block';
    renderQuizTake();
}

function renderQuizTake() {
    const q = currentQuiz;
    document.getElementById('quiz-take-view').innerHTML = `
    <div style="max-width:640px;margin:0 auto;">
      <div class="d-flex align-items-center gap-3 mb-4">
        <button onclick="backToQuizList()" class="btn" style="color:var(--text-muted);padding:6px 10px;border:1px solid var(--border);border-radius:10px;font-size:.85rem;">
          <i class="bi bi-arrow-left"></i> Back
        </button>
        <div>
          <div class="font-display text-white fw-bold">${q.title}</div>
          <div style="color:var(--text-muted);font-size:.82rem;">${q.questions.length} questions</div>
        </div>
      </div>
      ${q.questions.map((ques, qi) => `
        <div class="edu-card p-4 mb-4">
          <div class="text-white fw-semibold mb-3">Q${qi + 1}. ${ques.q}</div>
          <div class="d-flex flex-column gap-2">
            ${ques.options.map((opt, oi) => `
              <button class="quiz-option ${quizAnswers[qi] === oi ? 'selected' : ''}" onclick="selectAnswer(${qi},${oi})">
                <span style="font-weight:700;margin-right:.5rem;">${String.fromCharCode(65 + oi)}.</span>${opt}
              </button>`).join('')}
          </div>
        </div>`).join('')}
      <button class="btn-edu-primary btn w-100 py-3 mt-2" onclick="submitQuiz()" ${quizAnswers.includes(-1) ? 'disabled style="opacity:.4;"' : ''}>
        Submit Quiz <i class="bi bi-check-lg ms-2"></i>
      </button>
    </div>`;
}

function selectAnswer(qi, oi) {
    quizAnswers[qi] = oi;
    renderQuizTake();
}

function submitQuiz() {
    if (!currentQuiz) return;
    let correct = 0;
    currentQuiz.questions.forEach((q, i) => {
        if (quizAnswers[i] === q.answer) correct++;
    });
    const score = Math.round((correct / currentQuiz.questions.length) * 100);
    QUIZ_RESULTS = QUIZ_RESULTS.filter(r => r.quizId !== currentQuiz.id);
    QUIZ_RESULTS.push({
        quizId: currentQuiz.id,
        score,
        date: today()
    });

    document.getElementById('quiz-take-view').style.display = 'none';
    document.getElementById('quiz-result-view').style.display = 'block';
    document.getElementById('quiz-result-view').innerHTML = `
    <div style="max-width:480px;margin:0 auto;">
      <div class="edu-card p-5 text-center">
        <div class="result-score mb-2" style="color:${score >= 70 ? '#06d6a0' : '#f43f5e'}">${score}%</div>
        <div class="font-display text-white fw-bold fs-5 mb-2">${score >= 70 ? '🎉 Great Job!' : '😕 Keep Practicing'}</div>
        <div style="color:var(--text-muted);" class="mb-4">You scored ${score}% on ${currentQuiz.title}</div>
        <div class="row g-3 mb-4">
          <div class="col-4"><div class="edu-card p-3 text-center"><div class="text-white fw-bold fs-4" style="color:#06d6a0;">${correct}</div><div style="color:var(--text-muted);font-size:.8rem;">Correct</div></div></div>
          <div class="col-4"><div class="edu-card p-3 text-center"><div class="fw-bold fs-4" style="color:#f43f5e;">${currentQuiz.questions.length - correct}</div><div style="color:var(--text-muted);font-size:.8rem;">Wrong</div></div></div>
          <div class="col-4"><div class="edu-card p-3 text-center"><div class="text-white fw-bold fs-4">${currentQuiz.questions.length}</div><div style="color:var(--text-muted);font-size:.8rem;">Total</div></div></div>
        </div>
        <button class="btn-edu-primary btn px-5 py-3" onclick="backToQuizList()">Back to Quizzes</button>
      </div>
    </div>`;
    renderStudentStats();
    renderStudentMarks();
}

function backToQuizList() {
    document.getElementById('quiz-list-view').style.display = 'block';
    document.getElementById('quiz-take-view').style.display = 'none';
    document.getElementById('quiz-result-view').style.display = 'none';
    renderStudentQuizGrid();
}

function renderStudentMarks() {
    const statsEl = document.getElementById('s-marks-stats');
    const tableEl = document.getElementById('s-marks-table-wrap');
    if (QUIZ_RESULTS.length === 0) {
        statsEl.innerHTML = '';
        tableEl.innerHTML = `<div class="text-center py-5" style="color:var(--text-muted);">No quiz results yet. Take a quiz to see your marks!</div>`;
        return;
    }
    const avg = Math.round(QUIZ_RESULTS.reduce((a, b) => a + b.score, 0) / QUIZ_RESULTS.length);
    const best = Math.max(...QUIZ_RESULTS.map(r => r.score));
    statsEl.innerHTML = [
        {
            l: 'Quizzes Taken',
            v: QUIZ_RESULTS.length,
            c: '#6c63ff'
        },
        {
            l: 'Average Score',
            v: avg + '%',
            c: '#06d6a0'
        },
        {
            l: 'Best Score',
            v: best + '%',
            c: '#fbbf24'
        },
    ].map(s => `<div class="col-6 col-md-4">
    <div class="edu-card p-4 text-center">
      <div class="font-display fw-bold fs-2 mb-1" style="color:${s.c};">${s.v}</div>
      <div style="color:var(--text-muted);font-size:.82rem;">${s.l}</div>
    </div></div>`).join('');

    tableEl.innerHTML = `<table class="edu-table">
    <thead><tr>
      <th>Quiz</th><th>Course</th><th>Date</th><th style="text-align:right;">Score</th>
    </tr></thead>
    <tbody>
      ${QUIZ_RESULTS.map(r => {
        const quiz = QUIZZES.find(q => q.id === r.quizId);
        const course = quiz ? COURSES.find(c => c.id === quiz.courseId) : null;
        return `<tr>
          <td class="text-white fw-semibold">${quiz ? quiz.title : '—'}</td>
          <td>${course ? badge(course.category, course.color) : '—'}</td>
          <td style="color:var(--text-muted);">${r.date}</td>
          <td style="text-align:right;"><span style="font-family:'Syne',sans-serif;font-weight:800;font-size:1rem;color:${r.score >= 70 ? '#06d6a0' : '#f43f5e'};">${r.score}%</span></td>
        </tr>`;
    }).join('')}
    </tbody>
  </table>`;
}

function renderStudentNotes() {
    const el = document.getElementById('s-notes-grid');
    if (NOTES.length === 0) {
        el.innerHTML = `<div class="col-12 text-center py-5" style="color:var(--text-muted);">No notes yet. Create your first note!</div>`;
        return;
    }
    el.innerHTML = NOTES.map(n => `
    <div class="col-sm-6 col-lg-4">
      <div class="edu-card p-4 h-100" style="position:relative;">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div class="text-white fw-bold" style="font-size:.9rem;">${n.title}</div>
          <div class="d-flex gap-1">
            <button onclick="editNote(${n.id})" class="btn" style="padding:3px 6px;font-size:.75rem;color:var(--text-muted);"><i class="bi bi-pencil"></i></button>
            <button onclick="deleteNote(${n.id})" class="btn" style="padding:3px 6px;font-size:.75rem;color:#f43f5e;"><i class="bi bi-trash"></i></button>
          </div>
        </div>
        <div style="color:var(--text-muted);font-size:.83rem;line-height:1.6;">${n.body.substring(0, 120)}${n.body.length > 120 ? '...' : ''}</div>
        <div style="color:#44445566;font-size:.76rem;margin-top:.75rem;">${n.date}</div>
      </div>
    </div>`).join('');
}

function openNoteModal(id) {
    const note = id ? NOTES.find(n => n.id === id) : null;
    document.getElementById('note-modal-title').textContent = note ? 'Edit Note' : 'New Note';
    document.getElementById('note-edit-id').value = note ? note.id : '';
    document.getElementById('note-title-input').value = note ? note.title : '';
    document.getElementById('note-body-input').value = note ? note.body : '';
    openModal('modal-student-note');
}

function editNote(id) {
    openNoteModal(id);
}

function saveNote() {
    const title = document.getElementById('note-title-input').value.trim();
    const body = document.getElementById('note-body-input').value.trim();
    const editId = document.getElementById('note-edit-id').value;
    if (!title) return;
    if (editId) {
        const idx = NOTES.findIndex(n => n.id === parseInt(editId));
        if (idx > -1) NOTES[idx] = {
            ...NOTES[idx],
            title,
            body
        };
    } else {
        NOTES.push({
            id: Date.now(),
            title,
            body,
            date: today()
        });
    }
    closeModal('modal-student-note');
    renderStudentNotes();
    renderStudentStats();
}

function deleteNote(id) {
    NOTES = NOTES.filter(n => n.id !== id);
    renderStudentNotes();
    renderStudentStats();
}

function renderStudentNotices() {
    document.getElementById('s-notices-list').innerHTML = NOTICES.map(n => `
    <div class="notice-card d-flex gap-3 mb-3">
      <div class="notice-icon" style="background:rgba(108,99,255,.15);"><i class="bi bi-bell-fill" style="color:#a78bfa;"></i></div>
      <div class="flex-1">
        <div class="text-white fw-bold mb-1">${n.title}</div>
        <div style="color:var(--text-muted);font-size:.85rem;line-height:1.6;">${n.body}</div>
        <div class="d-flex gap-2 mt-2" style="color:#44445599;font-size:.76rem;">
          <span>${n.date}</span><span>·</span><span>${n.author}</span>
        </div>
      </div>
    </div>`).join('');
}

function renderStudentLinks() {
    document.getElementById('s-links-grid').innerHTML = LINKS.map(l => `
    <div class="col-sm-6 col-lg-4">
      <a href="${l.url}" target="_blank" rel="noreferrer" style="text-decoration:none;">
        <div class="link-card">
          <div class="d-flex align-items-start gap-3">
            <div class="notice-icon" style="background:rgba(79,70,229,.15);"><i class="bi bi-link-45deg" style="color:#818cf8;font-size:1.2rem;"></i></div>
            <div class="flex-1 overflow-hidden">
              <div class="text-white fw-bold" style="font-size:.9rem;">${l.title}</div>
              <div style="color:var(--text-muted);font-size:.8rem;margin:.2rem 0;">${l.description}</div>
              <div style="color:#4f46e5;font-size:.76rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${l.url}</div>
              <div style="color:#44445566;font-size:.74rem;margin-top:.5rem;">${l.date}</div>
            </div>
            <i class="bi bi-arrow-up-right" style="color:var(--text-muted);font-size:.9rem;margin-top:2px;"></i>
          </div>
        </div>
      </a>
    </div>`).join('');
}
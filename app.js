'use strict';

// ═══════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════
// TODO: Replace with actual deployed Apps Script URL after setup
const SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw3ATlLEwsD3mFFhbpVJ0gq35nHwk_vjd1mwyx9H5FE90EXjKzDRGu8dKDwP-O1FDjUzg/exec';

// ═══════════════════════════════════════════════════
//  NPI-16 QUESTIONS  (A = 1pt narcissistic, B = 0pt)
// ═══════════════════════════════════════════════════
const QUESTIONS = [
  { a: '나는 꽤 특별한 사람이라고 생각한다.', b: '나는 다른 사람들과 크게 다르지 않다.' },
  { a: '나는 항상 내가 원하는 것을 안다.', b: '무엇을 원하는지 잘 모를 때가 많다.' },
  { a: '나는 칭찬받는 것을 즐긴다.', b: '칭찬은 나를 어색하게 만든다.' },
  { a: '나는 군중을 이끄는 타입이다.', b: '나는 관찰하는 것을 선호한다.' },
  { a: '나는 권위 있는 사람이라고 생각한다.', b: '권위는 별로 중요하지 않다.' },
  { a: '나는 내 목표를 달성하기 위해 다른 사람을 이용하는 편이다.', b: '나는 다른 사람을 이용하는 것이 불편하다.' },
  { a: '나는 주목받는 것을 좋아한다.', b: '주목받는 것이 불편하다.' },
  { a: '나는 원하는 것은 무엇이든 할 수 있다.', b: '한계를 인정하는 것이 중요하다.' },
  { a: '나는 내 외모에 자부심이 있다.', b: '외모에 대해 크게 신경 쓰지 않는다.' },
  { a: '나는 좋은 리더이다.', b: '나는 뛰어난 리더가 아니다.' },
  { a: '나는 내 삶을 통제하고 있다.', b: '삶이 나를 통제하는 것 같다.' },
  { a: '나는 다른 사람보다 더 나은 능력을 가지고 있다.', b: '다른 사람과 비슷한 수준이라고 생각한다.' },
  { a: '나는 없어서는 안 될 존재이다.', b: '나는 대체 가능한 사람이다.' },
  { a: '내가 원하는 것을 얻기 위해 무엇이든 할 것이다.', b: '일부 목표는 포기하기도 한다.' },
  { a: '나는 특별 대우를 받아야 한다.', b: '나는 다른 사람과 같은 대우로 충분하다.' },
  { a: '나는 뛰어난 사람이다.', b: '나는 그렇게 특별하지 않다.' },
];

// ═══════════════════════════════════════════════════
//  GRADE DEFINITIONS
// ═══════════════════════════════════════════════════
const GRADES = {
  LOW: {
    key: 'LOW', range: [0, 4], label: '낮음',
    badge: '🌿 자기애 낮음',
    desc: '자기애 성향이 낮습니다. 타인의 감정에 공감하며 협력적인 관계를 중시하는 편입니다. 자신보다 타인을 먼저 배려하는 경향이 있어, 자기 자신을 돌보는 시간도 필요합니다.',
    rec: '건강한 자기존중감을 유지하고 자신의 필요도 존중하는 연습을 해보세요. 타인에 대한 배려만큼 자신에 대한 배려도 중요합니다.',
  },
  MODERATE: {
    key: 'MODERATE', range: [5, 8], label: '보통',
    badge: '✅ 일반적 수준',
    desc: '일반적인 자기애 수준입니다. 자신감과 타인에 대한 배려가 균형을 이루고 있습니다. 대부분의 사람들이 이 범위에 속합니다.',
    rec: '현재의 균형을 유지하면서 타인의 관점에 더 귀를 기울여 보세요. 자기계발과 관계 유지 모두에 관심을 두는 것이 좋습니다.',
  },
  HIGH: {
    key: 'HIGH', range: [9, 12], label: '높음',
    badge: '⚡ 자기애 높음',
    desc: '자기애 성향이 다소 높습니다. 자신의 능력과 가치를 강하게 확신하는 편이며, 때로는 타인 관계에서 갈등이 생길 수 있습니다. 자신의 관점이 절대적이라고 느껴질 때 특히 주의가 필요합니다.',
    rec: '가까운 사람들의 피드백을 열린 마음으로 들어보고, 전문 상담을 통해 관계 패턴을 점검해보세요.',
  },
  VERY_HIGH: {
    key: 'VERY_HIGH', range: [13, 16], label: '매우 높음',
    badge: '🔴 자기애 매우 높음',
    desc: '자기애 성향이 매우 높습니다. 관계에서 반복적인 갈등이나 어려움을 겪고 있을 수 있습니다. 이는 자가진단 결과이므로 정확한 평가를 위해 전문가의 도움을 받으시길 권장합니다.',
    rec: '정신건강의학과 전문의 또는 심리상담사와 상담을 받아보실 것을 강력히 권장합니다. 치료를 통해 더 건강한 관계를 만들어갈 수 있습니다.',
  },
};

// ═══════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════
let current = 0;
let answers = new Array(QUESTIONS.length).fill(null); // null | 'a' | 'b'
let sessionId = crypto.randomUUID();

// ═══════════════════════════════════════════════════
//  SCREEN MANAGEMENT
// ═══════════════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  el.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════════════════════
//  QUIZ ENGINE
// ═══════════════════════════════════════════════════
function startQuiz() {
  current = 0;
  answers = new Array(QUESTIONS.length).fill(null);
  sessionId = crypto.randomUUID();
  showScreen('quiz');
  renderQuestion();
}

function renderQuestion() {
  const q = QUESTIONS[current];
  const idx = current + 1;
  const total = QUESTIONS.length;
  const pct = Math.round((idx / total) * 100);

  // Progress
  document.getElementById('progress-text').textContent = `${idx} / ${total}`;
  document.getElementById('progress-pct').textContent = `${pct}%`;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-region').setAttribute('aria-valuenow', idx);

  // Question
  document.getElementById('question-num').textContent = `문항 ${idx}`;
  document.getElementById('question-text').textContent = '다음 중 나를 더 잘 설명하는 것은?';

  // Answers
  const container = document.getElementById('answers');
  container.innerHTML = '';

  ['a', 'b'].forEach((opt, i) => {
    const card = document.createElement('div');
    card.className = 'answer-card' + (answers[current] === opt ? ' selected' : '');
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', answers[current] === opt ? 'true' : 'false');
    card.setAttribute('tabindex', '0');
    card.setAttribute('data-opt', opt);
    card.innerHTML = `
      <div class="answer-label">${opt.toUpperCase()}</div>
      <div class="answer-text">${q[opt]}</div>
    `;
    card.addEventListener('click', () => selectAnswer(opt));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectAnswer(opt); }
    });
    container.appendChild(card);
  });

  // Nav
  document.getElementById('btn-prev').style.visibility = current > 0 ? 'visible' : 'hidden';
  const nextBtn = document.getElementById('btn-next');
  nextBtn.style.display = answers[current] !== null ? 'block' : 'none';
}

function selectAnswer(opt) {
  answers[current] = opt;

  // Update UI
  document.querySelectorAll('.answer-card').forEach(card => {
    const isSelected = card.dataset.opt === opt;
    card.classList.toggle('selected', isSelected);
    card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
  });
  document.getElementById('btn-next').style.display = 'block';

  // Auto-advance after short delay
  setTimeout(() => {
    if (current < QUESTIONS.length - 1) {
      nextQuestion();
    } else {
      showResults();
    }
  }, 420);
}

function nextQuestion() {
  if (answers[current] === null) return;
  if (current < QUESTIONS.length - 1) {
    current++;
    renderQuestion();
  } else {
    showResults();
  }
}

function prevQuestion() {
  if (current > 0) {
    current--;
    renderQuestion();
  }
}

// Keyboard A/B shortcuts
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('screen-quiz').classList.contains('active')) return;
  if (e.key === 'a' || e.key === 'A') selectAnswer('a');
  if (e.key === 'b' || e.key === 'B') selectAnswer('b');
  if (e.key === 'ArrowLeft') prevQuestion();
});

// ═══════════════════════════════════════════════════
//  RESULTS
// ═══════════════════════════════════════════════════
function calcScore() {
  return answers.reduce((sum, a) => sum + (a === 'a' ? 1 : 0), 0);
}

function getGrade(score) {
  if (score <= 4) return GRADES.LOW;
  if (score <= 8) return GRADES.MODERATE;
  if (score <= 12) return GRADES.HIGH;
  return GRADES.VERY_HIGH;
}

function showResults() {
  const score = calcScore();
  const grade = getGrade(score);
  showScreen('result');

  // Badge
  const badge = document.getElementById('result-badge');
  badge.textContent = grade.badge;
  badge.className = `result-grade-badge grade-${grade.key}`;

  // Score
  document.getElementById('result-score').textContent = score;
  document.getElementById('result-grade-label').textContent = `자기애 수준: ${grade.label}`;

  // Gauge arc animation
  // Arc total length ≈ 251.2 (π × r where r=80, half circle)
  const arcLen = 251.2;
  const offset = arcLen - (score / 16) * arcLen;
  // Color by grade
  const colors = { LOW: '#5BB87B', MODERATE: '#5B8ED6', HIGH: '#F0A050', VERY_HIGH: '#E05070' };
  const gaugeFill = document.getElementById('gauge-fill');
  gaugeFill.style.stroke = colors[grade.key];
  setTimeout(() => { gaugeFill.style.strokeDashoffset = offset; }, 100);

  // Text
  document.getElementById('result-desc').textContent = grade.desc;
  document.getElementById('result-recommend').textContent = grade.rec;

  // Submit to Google Sheets (silent)
  submitResult(score, grade.key);
}

function restartQuiz() {
  showScreen('start');
}

// ═══════════════════════════════════════════════════
//  SHARE
// ═══════════════════════════════════════════════════
function copyResult() {
  const score = calcScore();
  const grade = getGrade(score);
  const text = `[NPD Self-Check 자기애 자가진단 결과]\n점수: ${score}/16점 (${grade.label})\n${grade.badge}\n\n${grade.desc}\n\n지금 나도 테스트해보기 → https://mental-health-diagnosis.vercel.app`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('btn-share');
    const orig = btn.textContent;
    btn.textContent = '✅ 복사 완료!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  }).catch(() => {
    alert('복사에 실패했습니다. 직접 결과를 선택하여 복사해주세요.');
  });
}

// ═══════════════════════════════════════════════════
//  GOOGLE SHEETS DATA COLLECTION
// ═══════════════════════════════════════════════════
async function submitResult(score, gradeKey) {
  const payload = {
    type: 'result',
    timestamp: new Date().toISOString(),
    score,
    grade: gradeKey,
    userAgent: navigator.userAgent,
    language: navigator.language,
    referrer: document.referrer || 'direct',
    sessionId,
  };
  try {
    await fetch(SHEETS_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (_) { /* silent fail */ }
}

async function recordVisit() {
  const payload = {
    type: 'visit',
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().slice(0, 10),
    sessionId,
    userAgent: navigator.userAgent,
  };
  try {
    // Use GET with query params to get counts back (no-cors blocks response body on POST)
    const params = new URLSearchParams({ type: 'visit', sessionId, date: payload.date });
    const res = await fetch(`${SHEETS_ENDPOINT}?${params}`, { mode: 'cors' });
    if (res.ok) {
      const data = await res.json();
      const el = document.getElementById('visitor-counter');
      if (el && data.today !== undefined) {
        el.textContent = `오늘 방문자: ${data.today.toLocaleString()}명 · 누적 방문자: ${data.total.toLocaleString()}명`;
      }
    }
  } catch (_) { /* silent fail — counter stays hidden */ }
}

// ═══════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Record visit and update counter async (non-blocking)
  recordVisit();
});

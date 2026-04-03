'use strict';

// ═══════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════
const SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw3ATlLEwsD3mFFhbpVJ0gq35nHwk_vjd1mwyx9H5FE90EXjKzDRGu8dKDwP-O1FDjUzg/exec';
const SITE_URL = 'https://mental-health-diagnosis.vercel.app';

// ═══════════════════════════════════════════════════
//  i18n TRANSLATIONS
// ═══════════════════════════════════════════════════
const T = {
  ko: {
    pageTitle: '자기애 성격 자가진단 테스트 | NPD Self-Check',
    heroBadge: 'NPI-16 기반 자가진단',
    heroTitle: '나의 <span>자기애 성향</span>은<br>어느 정도일까?',
    heroDesc: '자기애성 성격장애(NPD)는 자신에 대한 과도한 자부심과 타인에 대한 공감 능력 부족이 특징입니다. 임상적으로 검증된 NPI-16 척도로 나의 성향을 점검해보세요.',
    metaQ: '16문항', metaT: '약 5분', metaA: '익명 처리',
    btnStart: '테스트 시작하기 →',
    disclaimerTitle: '면책 고지:',
    disclaimerText: '이 도구는 의학적 진단을 대체하지 않습니다. 결과는 참고용이며, 전문 정신건강의학과 상담을 권장합니다.',
    faqTitle: '자주 묻는 질문',
    faqs: [
      { q: '자기애성 성격장애(NPD)란 무엇인가요?', a: '자기애성 성격장애(NPD)는 과도한 자기중요감, 공감 능력 부족, 찬사에 대한 강한 욕구가 특징인 성격장애입니다. DSM-5에서 공식 진단 기준으로 인정됩니다.' },
      { q: 'NPI-16이란 무엇인가요?', a: 'NPI-16(Narcissistic Personality Inventory-16)은 자기애 성향을 측정하는 임상적으로 검증된 16문항 자기보고식 척도입니다. 원본 NPI-40의 단축형으로 연구에서 널리 사용됩니다.' },
      { q: '점수가 높으면 무조건 성격장애인가요?', a: '아닙니다. 이 테스트는 자가진단 도구일 뿐입니다. 높은 점수가 반드시 임상적 진단을 의미하지 않습니다. 정확한 진단은 정신건강의학과 전문의만이 할 수 있습니다.' },
      { q: '결과는 어디에 저장되나요?', a: '개인정보(이름, 연락처 등)는 수집하지 않습니다. 점수와 등급 등 익명의 통계 데이터만 분석 목적으로 수집됩니다.' },
    ],
    questionHeader: '다음 중 나를 더 잘 설명하는 것은?',
    questionNum: (n) => `문항 ${n}`,
    btnPrev: '← 이전', kbHint: 'A / B 키로도 선택 가능', btnNext: '다음 →',
    resultInterpTitle: '진단 결과 해석',
    resultRecTitle: '권고 사항',
    gradeLabel: (label) => `자기애 수준: ${label}`,
    shareTitle: '결과 공유하기',
    shareDesc: '친구에게 공유해서 서로 결과를 비교해보세요!',
    btnKakao: '카카오', btnShare: '공유', btnCopy: '📋 복사',
    btnRestart: '다시 테스트하기',
    footerDisclaimer: '의학적 진단 아님',
    feedbackLink: '💌 개선 의견 보내기',
    visitorToday: (n) => `오늘 방문자: ${n.toLocaleString()}명`,
    visitorTotal: (n) => `누적: ${n.toLocaleString()}명`,
    copyText: (score, label, desc) => `[NPD Self-Check 자기애 자가진단 결과]\n점수: ${score}/16점 (${label})\n\n${desc}\n\n나도 테스트 → ${SITE_URL}`,
    shareTextX: (score, label) => `나의 자기애 점수: ${score}/16점 (${label}) #NPD자가진단 #자기애테스트`,
    langToggle: 'EN',
    grades: {
      LOW:       { label: '낮음',      badge: '자기애 낮음',      color: 'grade-LOW',       desc: '자기애 성향이 낮습니다. 타인의 감정에 공감하며 협력적인 관계를 중시하는 편입니다. 자신보다 타인을 먼저 배려하는 경향이 있어, 자기 자신을 돌보는 시간도 필요합니다.', rec: '건강한 자기존중감을 유지하고 자신의 필요도 존중하는 연습을 해보세요. 타인에 대한 배려만큼 자신에 대한 배려도 중요합니다.' },
      MODERATE:  { label: '보통',      badge: '일반적 수준',      color: 'grade-MODERATE',  desc: '일반적인 자기애 수준입니다. 자신감과 타인에 대한 배려가 균형을 이루고 있습니다. 대부분의 사람들이 이 범위에 속합니다.', rec: '현재의 균형을 유지하면서 타인의 관점에 더 귀를 기울여 보세요. 자기계발과 관계 유지 모두에 관심을 두세요.' },
      HIGH:      { label: '높음',      badge: '자기애 높음',      color: 'grade-HIGH',      desc: '자기애 성향이 다소 높습니다. 자신의 능력과 가치를 강하게 확신하는 편이며, 때로는 타인 관계에서 갈등이 생길 수 있습니다.', rec: '가까운 사람들의 피드백을 열린 마음으로 들어보고, 전문 상담을 통해 관계 패턴을 점검해보세요.' },
      VERY_HIGH: { label: '매우 높음', badge: '자기애 매우 높음', color: 'grade-VERY_HIGH', desc: '자기애 성향이 매우 높습니다. 관계에서 반복적인 갈등이나 어려움을 겪고 있을 수 있습니다.', rec: '정신건강의학과 전문의 또는 심리상담사와 상담을 받아보실 것을 강력히 권장합니다.' },
    },
    questions: [
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
    ],
  },

  en: {
    pageTitle: 'Narcissism Self-Test (NPI-16) | NPD Self-Check',
    heroBadge: 'Based on NPI-16 Scale',
    heroTitle: 'How <span>Narcissistic</span><br>Are You Really?',
    heroDesc: 'Narcissistic Personality Disorder (NPD) is characterized by an inflated sense of self-importance and lack of empathy. Take this clinically validated NPI-16 assessment to check your tendencies.',
    metaQ: '16 Questions', metaT: '~5 Minutes', metaA: 'Anonymous',
    btnStart: 'Start the Test →',
    disclaimerTitle: 'Disclaimer:',
    disclaimerText: 'This tool is not a substitute for medical diagnosis. Results are for reference only. Please consult a licensed mental health professional if concerned.',
    faqTitle: 'Frequently Asked Questions',
    faqs: [
      { q: 'What is Narcissistic Personality Disorder (NPD)?', a: 'NPD is a personality disorder characterized by an inflated sense of self-importance, lack of empathy, and a strong need for admiration. It is recognized in DSM-5 as an official clinical diagnosis.' },
      { q: 'What is the NPI-16?', a: 'The NPI-16 (Narcissistic Personality Inventory-16) is a clinically validated 16-item self-report scale that measures narcissistic traits. It is a short form of the original NPI-40 widely used in research.' },
      { q: 'Does a high score mean I have NPD?', a: 'Not necessarily. This is a self-assessment tool only. A high score does not indicate a clinical diagnosis. Only a licensed psychiatrist or psychologist can make an official diagnosis.' },
      { q: 'Where is my data stored?', a: 'No personal information (name, contact details) is collected. Only anonymous statistical data such as score and grade is collected for analysis purposes.' },
    ],
    questionHeader: 'Which statement describes you better?',
    questionNum: (n) => `Question ${n}`,
    btnPrev: '← Back', kbHint: 'Press A or B to select', btnNext: 'Next →',
    resultInterpTitle: 'Result Interpretation',
    resultRecTitle: 'Recommendation',
    gradeLabel: (label) => `Narcissism Level: ${label}`,
    shareTitle: 'Share Your Result',
    shareDesc: 'Share with friends and compare your results!',
    btnKakao: 'KakaoTalk', btnShare: 'Share', btnCopy: '📋 Copy',
    btnRestart: 'Retake the Test',
    footerDisclaimer: 'Not a medical diagnosis',
    feedbackLink: '💌 Send Feedback',
    visitorToday: (n) => `Today: ${n.toLocaleString()} visitors`,
    visitorTotal: (n) => `Total: ${n.toLocaleString()}`,
    copyText: (score, label, desc) => `[NPD Self-Check Result]\nScore: ${score}/16 (${label})\n\n${desc}\n\nTake the test → ${SITE_URL}`,
    shareTextX: (score, label) => `My narcissism score: ${score}/16 (${label}) #NPDtest #NarcissismTest`,
    langToggle: '한국어',
    grades: {
      LOW:       { label: 'Low',       badge: 'Low Narcissism',      color: 'grade-LOW',       desc: 'You show low narcissistic traits. You tend to be empathetic and value cooperative relationships. You often prioritize others, so remember to take care of yourself too.', rec: 'Maintain a healthy sense of self-worth and practice honoring your own needs alongside others.' },
      MODERATE:  { label: 'Moderate',  badge: 'Typical Level',       color: 'grade-MODERATE',  desc: 'You show a typical level of narcissism. You balance self-confidence with consideration for others. Most people fall into this range.', rec: 'Keep your current balance and practice listening more actively to others\' perspectives.' },
      HIGH:      { label: 'High',      badge: 'High Narcissism',     color: 'grade-HIGH',      desc: 'You show elevated narcissistic traits. You tend to have strong confidence in your abilities, which can sometimes lead to conflicts in relationships.', rec: 'Try to actively listen to feedback from close ones and consider speaking with a counselor to examine your relationship patterns.' },
      VERY_HIGH: { label: 'Very High', badge: 'Very High Narcissism', color: 'grade-VERY_HIGH', desc: 'You show very high narcissistic traits. You may be experiencing repeated difficulties in relationships.', rec: 'It is strongly recommended to consult a licensed psychiatrist or therapist. With professional support, healthier relationships are very achievable.' },
    },
    questions: [
      { a: 'I think I am a pretty special person.', b: 'I am not that different from most people.' },
      { a: 'I always know what I want.', b: 'I am not sure what I want a lot of the time.' },
      { a: 'I like having authority over other people.', b: 'I don\'t mind following orders.' },
      { a: 'I find it easy to manipulate people.', b: 'I don\'t like it when I find myself manipulating people.' },
      { a: 'I insist upon getting the respect that is due me.', b: 'I usually get the respect I deserve without insisting on it.' },
      { a: 'I like to take responsibility for making decisions.', b: 'I like to take responsibility for making decisions.' },
      { a: 'I like to be the center of attention.', b: 'I prefer to blend in with the crowd.' },
      { a: 'I will be a success.', b: 'I am not too concerned about success.' },
      { a: 'I think I am a great person.', b: 'I am much like everybody else.' },
      { a: 'I am an extraordinary person.', b: 'I am not sure if I would make a good leader.' },
      { a: 'I like to display my body.', b: 'I am not particularly interested in displaying my body.' },
      { a: 'I can read people like a book.', b: 'People are sometimes hard to understand.' },
      { a: 'I know that I am good because everybody keeps telling me so.', b: 'When people compliment me I sometimes get embarrassed.' },
      { a: 'I like to look at my body.', b: 'I do not particularly like to look at myself in the mirror.' },
      { a: 'I am more capable than other people.', b: 'There is a lot that I can learn from other people.' },
      { a: 'I am going to be a great person.', b: 'I hope I\'m going to be successful.' },
    ],
  },
};

// ═══════════════════════════════════════════════════
//  LANGUAGE DETECTION & i18n
// ═══════════════════════════════════════════════════
let LANG = 'ko';

function detectLanguage() {
  const navLang = (navigator.language || navigator.userLanguage || 'ko').toLowerCase();
  LANG = navLang.startsWith('ko') ? 'ko' : 'en';
}

function t() { return T[LANG]; }

function applyTranslations() {
  const tr = t();
  document.title = tr.pageTitle;
  document.documentElement.lang = LANG;

  // Text nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (tr[key] !== undefined && typeof tr[key] === 'string') el.textContent = tr[key];
  });

  // HTML nodes (for spans/br in titles)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (tr[key] !== undefined) el.innerHTML = tr[key];
  });

  // Lang toggle button
  const toggle = document.getElementById('lang-toggle');
  if (toggle) toggle.textContent = tr.langToggle;

  // Rebuild FAQ
  renderFAQ();
}

function toggleLang() {
  LANG = LANG === 'ko' ? 'en' : 'ko';
  applyTranslations();
}

// ═══════════════════════════════════════════════════
//  FAQ SECTION
// ═══════════════════════════════════════════════════
function renderFAQ() {
  // Korean FAQ is static in HTML for SEO; only replace content when switching to English
  const container = document.getElementById('faq-list');
  if (!container) return;
  if (LANG === 'ko') return; // static HTML already has Korean content
  container.innerHTML = '';
  t().faqs.forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'faq-item';
    el.innerHTML = `
      <button class="faq-q" aria-expanded="false" aria-controls="faq-a-${i}" onclick="toggleFAQ(this,${i})">
        <span>${item.q}</span>
        <svg class="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="faq-a" id="faq-a-${i}" hidden>${item.a}</div>
    `;
    container.appendChild(el);
  });
}

function toggleFAQ(btn, idx) {
  const answer = document.getElementById(`faq-a-${idx}`);
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', !expanded);
  btn.querySelector('.faq-chevron').style.transform = expanded ? '' : 'rotate(180deg)';
  if (expanded) answer.hidden = true;
  else answer.hidden = false;
}

// ═══════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════
let current = 0;
let answers = [];
let sessionId = crypto.randomUUID();

// ═══════════════════════════════════════════════════
//  SCREEN MANAGEMENT
// ═══════════════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════════════════════
//  QUIZ ENGINE
// ═══════════════════════════════════════════════════
function startQuiz() {
  current = 0;
  answers = new Array(t().questions.length).fill(null);
  sessionId = crypto.randomUUID();
  showScreen('quiz');
  renderQuestion();
}

function renderQuestion() {
  const tr = t();
  const q = tr.questions[current];
  const idx = current + 1;
  const total = tr.questions.length;
  const pct = Math.round((idx / total) * 100);

  document.getElementById('progress-text').textContent = `${idx} / ${total}`;
  document.getElementById('progress-pct').textContent = `${pct}%`;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-region').setAttribute('aria-valuenow', idx);
  document.getElementById('question-num').textContent = tr.questionNum(idx);
  document.getElementById('question-text').textContent = tr.questionHeader;

  const container = document.getElementById('answers');
  container.innerHTML = '';
  ['a', 'b'].forEach(opt => {
    const card = document.createElement('div');
    card.className = 'answer-card' + (answers[current] === opt ? ' selected' : '');
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', answers[current] === opt ? 'true' : 'false');
    card.setAttribute('tabindex', '0');
    card.dataset.opt = opt;
    card.innerHTML = `<div class="answer-label">${opt.toUpperCase()}</div><div class="answer-text">${q[opt]}</div>`;
    card.addEventListener('click', () => selectAnswer(opt));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectAnswer(opt); } });
    container.appendChild(card);
  });

  document.getElementById('btn-prev').style.visibility = current > 0 ? 'visible' : 'hidden';
  document.getElementById('btn-next').style.display = answers[current] !== null ? 'block' : 'none';
}

function selectAnswer(opt) {
  answers[current] = opt;
  document.querySelectorAll('.answer-card').forEach(card => {
    const sel = card.dataset.opt === opt;
    card.classList.toggle('selected', sel);
    card.setAttribute('aria-checked', sel ? 'true' : 'false');
  });
  document.getElementById('btn-next').style.display = 'block';
  setTimeout(() => {
    if (current < t().questions.length - 1) nextQuestion();
    else showResults();
  }, 450);
}

function nextQuestion() {
  if (answers[current] === null) return;
  if (current < t().questions.length - 1) { current++; renderQuestion(); }
  else showResults();
}

function prevQuestion() {
  if (current > 0) { current--; renderQuestion(); }
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('screen-quiz').classList.contains('active')) return;
  if (e.key === 'a' || e.key === 'A') selectAnswer('a');
  if (e.key === 'b' || e.key === 'B') selectAnswer('b');
  if (e.key === 'ArrowLeft') prevQuestion();
});

// ═══════════════════════════════════════════════════
//  RESULTS
// ═══════════════════════════════════════════════════
function calcScore() {
  return answers.reduce((s, a) => s + (a === 'a' ? 1 : 0), 0);
}

function getGrade(score) {
  if (score <= 4)  return { key: 'LOW',       ...t().grades.LOW };
  if (score <= 8)  return { key: 'MODERATE',  ...t().grades.MODERATE };
  if (score <= 12) return { key: 'HIGH',       ...t().grades.HIGH };
  return              { key: 'VERY_HIGH',  ...t().grades.VERY_HIGH };
}

let _lastScore = 0;
let _lastGrade = null;

function showResults() {
  _lastScore = calcScore();
  _lastGrade = getGrade(_lastScore);
  showScreen('result');

  const badge = document.getElementById('result-badge');
  badge.textContent = _lastGrade.badge;
  badge.className = `result-grade-badge ${_lastGrade.color}`;

  document.getElementById('result-score').textContent = _lastScore;
  document.getElementById('result-grade-label').textContent = t().gradeLabel(_lastGrade.label);

  const arcLen = 251.2;
  const colors = { LOW: '#5BB87B', MODERATE: '#5B8ED6', HIGH: '#F0A050', VERY_HIGH: '#E05070' };
  const fill = document.getElementById('gauge-fill');
  fill.style.stroke = colors[_lastGrade.key];
  setTimeout(() => { fill.style.strokeDashoffset = arcLen - (_lastScore / 16) * arcLen; }, 100);

  document.getElementById('result-desc').textContent = _lastGrade.desc;
  document.getElementById('result-recommend').textContent = _lastGrade.rec;

  // Show native share button if supported
  if (navigator.share) {
    document.getElementById('btn-native-share').style.display = 'inline-flex';
  }

  submitResult(_lastScore, _lastGrade.key);
}

function restartQuiz() { showScreen('start'); }

// ═══════════════════════════════════════════════════
//  SOCIAL SHARING
// ═══════════════════════════════════════════════════
function getShareText() {
  return t().shareTextX(_lastScore, _lastGrade ? _lastGrade.label : '');
}

function shareKakao() {
  // KakaoTalk URL share (works on mobile via URI scheme, web fallback via KakaoStory)
  const url = encodeURIComponent(SITE_URL);
  const text = encodeURIComponent(getShareText());
  // Try Web Share API first on mobile
  if (/Android|iPhone|iPad/i.test(navigator.userAgent) && navigator.share) {
    navigator.share({ title: t().pageTitle, text: getShareText(), url: SITE_URL }).catch(() => {});
    return;
  }
  // Fallback: KakaoStory web share
  window.open(`https://story.kakao.com/share?url=${url}`, '_blank', 'width=600,height=500');
}

function shareX() {
  const text = encodeURIComponent(getShareText());
  const url = encodeURIComponent(SITE_URL);
  window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'width=600,height=400');
}

function shareNative() {
  if (navigator.share) {
    navigator.share({ title: t().pageTitle, text: getShareText(), url: SITE_URL }).catch(() => {});
  }
}

function copyResult() {
  const text = t().copyText(_lastScore, _lastGrade ? _lastGrade.label : '', _lastGrade ? _lastGrade.desc : '');
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('btn-share');
    const orig = btn.innerHTML;
    btn.innerHTML = '✅ Done!';
    setTimeout(() => { btn.innerHTML = orig; }, 2000);
  }).catch(() => {
    alert('Copy failed. Please select and copy manually.');
  });
}

// ═══════════════════════════════════════════════════
//  GOOGLE SHEETS DATA COLLECTION
// ═══════════════════════════════════════════════════
async function fetchWithTimeout(url, options = {}, ms = 8000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function submitResult(score, gradeKey) {
  const payload = {
    type: 'result',
    timestamp: new Date().toISOString(),
    score, grade: gradeKey,
    userAgent: navigator.userAgent,
    language: navigator.language,
    referrer: document.referrer || 'direct',
    sessionId,
  };
  try {
    await fetchWithTimeout(SHEETS_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (_) {}
}

async function recordVisit() {
  const date = new Date().toISOString().slice(0, 10);
  const params = new URLSearchParams({ type: 'visit', sessionId, date });
  try {
    const res = await fetchWithTimeout(`${SHEETS_ENDPOINT}?${params}`, { mode: 'cors' });
    if (res.ok) {
      const data = await res.json();
      const el = document.getElementById('visitor-counter');
      if (el && data.today !== undefined) {
        el.textContent = `${t().visitorToday(data.today)} · ${t().visitorTotal(data.total)}`;
      }
    }
  } catch (_) {}
}

// ═══════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  detectLanguage();
  applyTranslations();
  recordVisit();
});

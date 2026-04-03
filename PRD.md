# PRD: Narcissistic Personality Disorder Self-Diagnosis Web App

> **IMPORTANT FOR CLAUDE CODE:** This PRD is your single source of truth. Read it fully at the start of every session. Follow the harness design strictly: check progress files, run tests, implement one feature at a time, commit, update progress, repeat. Never skip milestone git pushes.

---

## 0. Harness Bootstrap Instructions (Run Once on First Session)

When starting the very first session, before writing any app code:

1. **Create GitHub repo via gh CLI:**
   ```bash
   gh repo create mental-health-diagnosis --public --description "Narcissistic Personality Disorder Self-Diagnosis Web App" --confirm
   git init
   git remote add origin $(gh repo view mental-health-diagnosis --json sshUrl -q .sshUrl)
   ```

2. **Create these three handoff files immediately:**
   - `feature_list.json` — full feature checklist with `done: false` for each
   - `claude-progress.txt` — current session notes, last completed feature, next target
   - `init.sh` — how to serve the project locally (e.g., `npx serve .` or `python -m http.server 8080`)

3. **Create Vercel project via CLI:**
   ```bash
   npx vercel --yes
   ```
   Link the GitHub repo to Vercel for automatic deploys on push to `main`.

4. **Deploy to Vercel and record the public URL** (e.g., `https://mental-health-diagnosis.vercel.app`) — this is the only public-facing URL. Never expose the GitHub repo URL to end users.

---

## 1. Session Start Routine (Every Session)

At the start of **every** Claude Code session, follow this exact order:
1. Read `claude-progress.txt`
2. Read `feature_list.json`
3. Run `init.sh` to verify the local server starts
4. Pick the next `done: false` feature
5. Implement → Test → Commit → Update `claude-progress.txt` → Mark feature `done: true` in `feature_list.json`
6. Repeat until all features done or session ends

---

## 2. Agent Team Roles

| Agent | Role | Responsibility |
|-------|------|----------------|
| **Agent 1 – Frontend** | UI/UX Developer | HTML structure, CSS styling, responsive layout, animations |
| **Agent 2 – Logic** | App Developer | Quiz engine, scoring, result calculation, local state |
| **Agent 3 – Integrations** | Integration Engineer | Google Sheets webhook, Adsterra ads, visitor counter |
| **Agent 4 – QA** | Code Reviewer | Cross-browser testing, accessibility checks, bug fixes |

Each agent reads the shared `claude-progress.txt` before starting. After finishing, it writes a summary back to that file.

---

## 3. Product Overview

**Product Name:** NPD Self-Check  
**Purpose:** A web-based self-assessment tool for Narcissistic Personality Disorder traits using the NPI-16 scale  
**Target Users:** Korean-speaking adults curious about their personality traits  
**Tech Stack:** Vanilla HTML / CSS / JavaScript — no build tools, no frameworks, deployable as static files  
**Hosting:** Vercel (free tier) — auto-deploy from GitHub `main` branch  
**Backend (if needed):** Railway free tier  

> **Disclaimer notice must appear on screen:** "This tool is not a medical diagnosis. Results are for reference only. Consult a licensed mental health professional if concerned."

---

## 4. Core Requirements

### 4.1 Cost — Zero Infrastructure Cost
- Static site only (HTML/CSS/JS). No paid hosting.
- Vercel free tier for hosting.
- Google Apps Script (free) for data collection — no paid database.
- Railway free tier only if a backend endpoint is absolutely necessary.
- No paid APIs. No paid services.
- **If blocked by any step: solve it via CLI automation. Do not wait for manual action.**

### 4.2 SEO
- Add full `<meta>` tags in `<head>`:
  - `title`, `description`, `keywords`, `og:title`, `og:description`, `og:image`, `og:url`
  - `twitter:card`, `twitter:title`, `twitter:description`
- Add `sitemap.xml` and `robots.txt`
- Use semantic HTML: `<main>`, `<section>`, `<article>`, `<header>`, `<footer>`
- Page title: "자기애 성격 자가진단 테스트 | NPD Self-Check"
- Meta description (Korean): "자기애성 성격장애(NPD) 자가진단 테스트. NPI-16 기반 16문항으로 5분 만에 나의 자기애 성향을 확인해보세요."
- H1 must be present and keyword-rich
- Image `alt` attributes required on all images

### 4.3 Responsive Design
- Mobile-first. Primary breakpoints: 375px, 768px, 1024px
- Max content width: 600px, centered on desktop
- Touch-friendly buttons (min 48px tap target)
- No horizontal scroll at any viewport width

### 4.4 Visual Design
- **Background:** Soft, muted tones — use `#F4F0FB` (lavender white) as base background, `#EDE9F6` for card surfaces
- **Primary accent:** `#7C5CBF` (soft purple)
- **Text:** `#2D2D3A` (near-black, not pure black)
- **Font:** Noto Sans KR from Google Fonts for Korean text
- Smooth transitions (0.3s ease) on hover/focus states
- Card-based layout with soft box shadows (`box-shadow: 0 4px 20px rgba(0,0,0,0.08)`)
- Rounded corners: `border-radius: 16px` for cards, `12px` for buttons

### 4.5 Modern & Comfortable UI/UX
- Progress bar showing current question out of 16 (animated fill)
- Cards for A/B answer choices — highlight on hover, clear selection state
- Smooth slide/fade transitions between questions
- Result screen uses a visual gauge/arc chart for score display
- No jarring color contrasts; everything feels calm and trustworthy
- Micro-interactions: button press scale effect, selection checkmark animation

---

## 5. Visitor Counter

- Display **"Today: X visitors | Total: X visitors"** in the **footer** — small, unobtrusive, gray text
- Implementation using **localStorage + Google Apps Script**:
  - On each page load, POST to the Apps Script endpoint (same one used for data collection)
  - Apps Script increments counters in Google Sheets and returns `{ today: N, total: N }`
  - Display the returned counts in the footer
- Counter must not block page render — load asynchronously after DOMContentLoaded
- If the fetch fails, silently hide the counter (no error shown to user)

---

## 6. Data Collection — Google Sheets via Apps Script

**Goal:** Every time a user completes the test, auto-POST their result to Google Sheets.

### Setup Steps (Agent 3 must execute these):

1. **Create a Google Sheet** named `NPD-Self-Check-Results` with columns:
   `timestamp | score | grade | userAgent | language | referrer | sessionId`

2. **Create an Apps Script Web App** attached to that sheet:
   - Go to Extensions → Apps Script in the Sheet
   - Write a `doPost(e)` function that parses `e.postData.contents` and appends a row
   - Deploy as Web App: Execute as "Me", Access "Anyone"
   - Copy the deployment URL

3. **Hardcode the Apps Script URL** into `app.js` as `SHEETS_ENDPOINT`

4. **Auto-POST on quiz completion:**
   ```js
   // Called when user reaches result screen
   async function submitResult(score, grade) {
     const payload = {
       timestamp: new Date().toISOString(),
       score,
       grade,
       userAgent: navigator.userAgent,
       language: navigator.language,
       referrer: document.referrer,
       sessionId: crypto.randomUUID()
     };
     try {
       await fetch(SHEETS_ENDPOINT, {
         method: 'POST',
         body: JSON.stringify(payload)
       });
     } catch (e) { /* silent fail */ }
   }
   ```

5. **Also POST visitor count** on every page load (separate row type or separate sheet tab `Visitors`):
   - Columns: `timestamp | date | userAgent`
   - Apps Script counts rows for today's date to compute `today` count, total rows for `total` count
   - Return JSON `{ today: N, total: N }` from `doGet(e)` for the visitor display

**Do not leave this as a guide. Actually implement the Apps Script code and the fetch calls in app.js.**

---

## 7. Monetization — Adsterra Ads

- **Use Adsterra** as the primary ad network (faster approval than Google AdSense for new sites)
- Ad placements must not interrupt the quiz flow. Place ads:
  1. **Below the hero/intro section** on the start screen (banner or native)
  2. **On the result screen** below the result card (banner)
  3. **In the footer area** (native ad or small banner)

### Integration Steps:

1. Sign up at Adsterra and create ad units for this site
2. Adsterra provides a script tag and a `key` (publisher ID / zone ID) per unit
3. Add Adsterra script to `<head>` and place ad container `<div>` elements at the three locations above
4. Example integration (replace `YOUR_KEY` with actual key from Adsterra dashboard):
   ```html
   <!-- Adsterra Banner -->
   <script type="text/javascript">
     atOptions = {
       'key': 'YOUR_KEY',
       'format': 'iframe',
       'height': 90,
       'width': 728,
       'params': {}
     };
   </script>
   <script type="text/javascript" src="//www.highperformanceformat.com/YOUR_KEY/invoke.js"></script>
   ```
5. Add responsive ad containers with `max-width: 728px` and center-align
6. On mobile, switch to 320×50 banner format using a media query or Adsterra's responsive unit

**Adsterra key must be inserted into the code directly. Do not leave placeholder comments. If the key is not yet available, leave a clearly marked `TODO: INSERT_ADSTERRA_KEY` comment and note it in `claude-progress.txt`.**

---

## 8. Vercel Deployment

```bash
# Initial deploy
npx vercel --yes

# All subsequent deploys happen automatically via GitHub push
# Vercel is linked to the GitHub repo main branch
```

- Add `vercel.json` if any configuration is needed (e.g., custom headers for caching)
- The Vercel URL (e.g., `https://mental-health-diagnosis.vercel.app`) is the public URL
- **Never share or expose the GitHub repo URL** in the app's UI or meta tags

---

## 9. Git Milestone Push Rules

**MANDATORY:** After completing each milestone below, run:
```bash
git add -A
git commit -m "milestone: <description>"
git push origin main
```

| Milestone | Trigger |
|-----------|---------|
| M1 | Repo created, `feature_list.json`, `claude-progress.txt`, `init.sh` created |
| M2 | `index.html` + `style.css` skeleton complete (start screen renders) |
| M3 | Quiz engine complete (all 16 questions navigate correctly) |
| M4 | Result screen complete (score, grade, gauge chart render) |
| M5 | Google Apps Script endpoint created, data collection POST working |
| M6 | Visitor counter displaying in footer |
| M7 | Adsterra ad units placed in all three locations |
| M8 | SEO meta tags, sitemap.xml, robots.txt complete |
| M9 | Responsive design verified at 375px, 768px, 1024px |
| M10 | Final QA pass — all features working, Vercel deploy live |

---

## 10. Diagnosis Tool — NPI-16

### Scoring
- 16 forced-choice (A/B) questions
- A = narcissistic response = 1 point
- B = non-narcissistic response = 0 points
- Total score: 0–16

### Grade Table
| Score | Grade | Label (KO) |
|-------|-------|-----------|
| 0–4 | LOW | 낮음 |
| 5–8 | MODERATE | 보통 |
| 9–12 | HIGH | 높음 |
| 13–16 | VERY_HIGH | 매우 높음 |

### Questions (A = 1pt, B = 0pt)
| # | A (Narcissistic) | B (Non-narcissistic) |
|---|-----------------|----------------------|
| 1 | 나는 꽤 특별한 사람이라고 생각한다. | 나는 다른 사람들과 크게 다르지 않다. |
| 2 | 나는 항상 내가 원하는 것을 안다. | 무엇을 원하는지 잘 모를 때가 많다. |
| 3 | 나는 칭찬받는 것을 즐긴다. | 칭찬은 나를 어색하게 만든다. |
| 4 | 나는 군중을 이끄는 타입이다. | 나는 관찰하는 것을 선호한다. |
| 5 | 나는 권위 있는 사람이라고 생각한다. | 권위는 별로 중요하지 않다. |
| 6 | 나는 내 목표를 달성하기 위해 다른 사람을 이용하는 편이다. | 나는 다른 사람을 이용하는 것이 불편하다. |
| 7 | 나는 주목받는 것을 좋아한다. | 주목받는 것이 불편하다. |
| 8 | 나는 원하는 것은 무엇이든 할 수 있다. | 한계를 인정하는 것이 중요하다. |
| 9 | 나는 내 외모에 자부심이 있다. | 외모에 대해 크게 신경 쓰지 않는다. |
| 10 | 나는 좋은 리더이다. | 나는 뛰어난 리더가 아니다. |
| 11 | 나는 내 삶을 통제하고 있다. | 삶이 나를 통제하는 것 같다. |
| 12 | 나는 다른 사람보다 더 나은 능력을 가지고 있다. | 다른 사람과 비슷한 수준이라고 생각한다. |
| 13 | 나는 없어서는 안 될 존재이다. | 나는 대체 가능한 사람이다. |
| 14 | 내가 원하는 것을 얻기 위해 무엇이든 할 것이다. | 일부 목표는 포기하기도 한다. |
| 15 | 나는 특별 대우를 받아야 한다. | 나는 다른 사람과 같은 대우로 충분하다. |
| 16 | 나는 뛰어난 사람이다. | 나는 그렇게 특별하지 않다. |

### Result Descriptions (render on result screen based on grade)

**LOW (0–4):**  
자기애 성향이 낮습니다. 타인의 감정에 공감하며 협력적인 관계를 중시하는 편입니다. 자신보다 타인을 먼저 배려하는 경향이 있어 자기 자신을 돌보는 시간도 필요합니다.  
*Recommendation:* 건강한 자기존중감을 유지하고 자신의 필요도 존중하는 연습을 해보세요.

**MODERATE (5–8):**  
일반적인 자기애 수준입니다. 자신감과 타인에 대한 배려가 균형을 이루고 있습니다.  
*Recommendation:* 현재의 균형을 유지하면서 타인의 관점에 더 귀를 기울여 보세요.

**HIGH (9–12):**  
자기애 성향이 다소 높습니다. 자신의 능력과 가치를 강하게 확신하는 편이며, 타인 관계에서 갈등이 생길 수 있습니다.  
*Recommendation:* 가까운 사람들의 피드백을 열린 마음으로 들어보고, 전문 상담을 통해 관계 패턴을 점검해보세요.

**VERY_HIGH (13–16):**  
자기애 성향이 매우 높습니다. 관계에서 어려움을 겪고 있을 수 있습니다.  
*Recommendation:* 정신건강의학과 전문의 또는 심리상담사와 상담을 받아보실 것을 권장합니다.

---

## 11. File Structure

```
mental-health-diagnosis/
├── PRD.md
├── feature_list.json        # Harness: feature checklist
├── claude-progress.txt      # Harness: session handoff notes
├── init.sh                  # Harness: local server start script
├── index.html               # Main app (single page)
├── style.css                # All styles
├── app.js                   # Quiz logic, scoring, integrations
├── sitemap.xml
├── robots.txt
└── vercel.json              # Vercel config (if needed)
```

---

## 12. Non-Functional Requirements

- **No user data stored locally beyond session** — no cookies, no localStorage for PII
- **Privacy-first:** Only anonymous metadata (score, grade, userAgent) sent to Sheets
- **Offline-capable:** App works without network (except ads and analytics)
- **Initial render < 2 seconds** on 4G mobile
- **No external JS frameworks** — vanilla JS only
- **All CLI blockers must be solved via CLI automation** — no manual browser steps if avoidable (use `gh`, `gcloud`, `npx vercel`, etc.)

---

## 13. CLI Automation Cheatsheet (Use These Instead of Manual Steps)

```bash
# GitHub
gh repo create <name> --public
gh repo view --web

# Vercel
npx vercel --yes          # initial deploy
npx vercel --prod         # deploy to production

# Serve locally
npx serve .               # or python -m http.server 8080

# Google Apps Script (if gcloud available)
gcloud auth login
# Use clasp for Apps Script CLI deployment
npm install -g @google/clasp
clasp login
clasp create --type sheets --title "NPD-Tracker"
clasp push

# Git milestone push
git add -A && git commit -m "milestone: M<N> - <description>" && git push origin main
```

---

## 14. QA Checklist (Agent 4 runs before each milestone push)

- [ ] All 16 questions render correctly
- [ ] Score calculation is accurate (A=1, B=0)
- [ ] All 4 grade results display correct text
- [ ] Gauge chart fills correctly proportional to score
- [ ] Google Sheets receives POST on quiz completion
- [ ] Visitor counter updates and displays in footer
- [ ] Adsterra ad containers present in DOM (even if key is placeholder)
- [ ] No console errors on load
- [ ] Responsive at 375px (iPhone SE), 768px (iPad), 1024px (laptop)
- [ ] Meta tags present and correct
- [ ] sitemap.xml and robots.txt accessible
- [ ] Vercel URL loads and app is fully functional

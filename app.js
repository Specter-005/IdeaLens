/**
 * app.js — Main Application Controller
 *
 * Handles form submission, loading animation, result rendering,
 * score animations, verdict SVG icons, download report, and user interactions.
 */

(function () {
  'use strict';

  /* ===== DOM References ===== */
  const $ = (sel) => document.querySelector(sel);
  const particlesContainer = $('#particles');
  const ideaForm = $('#ideaForm');
  const inputSection = $('#inputSection');
  const heroSection = $('#heroSection');
  const loadingSection = $('#loadingSection');
  const resultsSection = $('#resultsSection');
  const loaderStatusText = $('#loaderStatusText');
  const loaderProgressFill = $('#loaderProgressFill');
  const analyzeBtn = $('#analyzeBtn');
  const ideaCharCount = $('#ideaCharCount');

  // Result elements
  const scoreFill = $('#scoreFill');
  const scoreValue = $('#scoreValue');
  const liftDesc = $('#liftDesc');
  const verdictCard = $('#verdictCard');
  const verdictIcon = $('#verdictIcon');
  const verdictLabel = $('#verdictLabel');
  const verdictText = $('#verdictText');
  const slidersGrid = $('#slidersGrid');
  const competitionContent = $('#competitionContent');
  const strengthsList = $('#strengthsList');
  const weaknessesList = $('#weaknessesList');
  const suggestionsList = $('#suggestionsList');
  const improveBtn = $('#improveBtn');
  const downloadBtn = $('#downloadBtn');
  const newIdeaBtn = $('#newIdeaBtn');

  /* ===== SVG Verdict Icons ===== */
  const VERDICT_ICONS = {
    rocket: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 3 0 3 0"/>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-3 0-3"/>
    </svg>`,
    scales: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="3" x2="12" y2="21"/>
      <path d="M5 8l7-5 7 5"/>
      <path d="M4 14a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1L7 8l-3 6z"/>
      <path d="M14 14a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1L17 8l-3 6z"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
    </svg>`,
    warning: `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
    'x-circle': `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>`
  };

  /* ===== SVG Gradient (injected into the score SVG) ===== */
  function injectSVGGradient() {
    const svg = $('.score-svg');
    if (!svg) return;
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'scoreGradient');
    gradient.setAttribute('x1', '0%');
    gradient.setAttribute('y1', '0%');
    gradient.setAttribute('x2', '100%');
    gradient.setAttribute('y2', '100%');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#6366f1');
    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '50%');
    stop2.setAttribute('stop-color', '#8b5cf6');
    const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.setAttribute('stop-color', '#a78bfa');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);
    defs.appendChild(gradient);
    svg.insertBefore(defs, svg.firstChild);
  }

  /* ===== Particles ===== */
  function createParticles() {
    for (let i = 0; i < 35; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (8 + Math.random() * 16) + 's';
      p.style.animationDelay = (Math.random() * 12) + 's';
      p.style.width = (2 + Math.random() * 3) + 'px';
      p.style.height = p.style.width;
      p.style.opacity = 0.1 + Math.random() * 0.3;
      particlesContainer.appendChild(p);
    }
  }

  /* ===== Character Counter ===== */
  const ideaTextarea = $('#startupIdea');
  if (ideaTextarea && ideaCharCount) {
    ideaTextarea.addEventListener('input', () => {
      ideaCharCount.textContent = ideaTextarea.value.length;
    });
  }

  /* ===== Loading Animation ===== */
  const LOADING_STEPS = [
    'Evaluating problem strength',
    'Analyzing solution clarity',
    'Checking technical feasibility',
    'Scanning competitor landscape',
    'Measuring innovation factor',
    'Assessing scalability potential',
    'Evaluating monetization paths',
    'Generating final report'
  ];

  function showLoading() {
    inputSection.style.display = 'none';
    heroSection.style.display = 'none';
    resultsSection.style.display = 'none';
    loadingSection.style.display = 'flex';

    let step = 0;
    if (loaderProgressFill) loaderProgressFill.style.width = '0%';

    const interval = setInterval(() => {
      step++;
      if (step < LOADING_STEPS.length) {
        loaderStatusText.textContent = LOADING_STEPS[step];
        if (loaderProgressFill) {
          loaderProgressFill.style.width = ((step + 1) / LOADING_STEPS.length * 100) + '%';
        }
      } else {
        clearInterval(interval);
        if (loaderProgressFill) loaderProgressFill.style.width = '100%';
      }
    }, 320);

    return interval;
  }

  function hideLoading() {
    loadingSection.style.display = 'none';
  }

  /* ===== Render Results ===== */
  let lastResult = null;

  function renderResults(result) {
    lastResult = result;

    // Lift Score Ring
    const circumference = 2 * Math.PI * 85;
    const offset = circumference - (result.liftScore / 100) * circumference;
    scoreFill.style.strokeDasharray = circumference;
    scoreFill.style.strokeDashoffset = circumference;

    // Animate score counter
    animateCounter(scoreValue, 0, result.liftScore, 1200);

    // Trigger ring animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scoreFill.style.strokeDashoffset = offset;
      });
    });

    liftDesc.textContent = result.verdict.text.split('.')[0] + '.';

    // Verdict with SVG icon
    verdictCard.setAttribute('data-verdict', result.verdict.key);
    if (verdictIcon && VERDICT_ICONS[result.verdict.icon]) {
      verdictIcon.innerHTML = VERDICT_ICONS[result.verdict.icon];
    }
    verdictLabel.textContent = result.verdict.label;
    verdictText.textContent = result.verdict.text;

    // Sliders
    renderSliders(result.scores);

    // Competition
    renderCompetition(result.competitors, result.comparison);

    // Lists
    renderList(strengthsList, result.strengths, 'check');
    renderList(weaknessesList, result.weaknesses, 'alert');
    renderList(suggestionsList, result.suggestions, 'lightbulb');

    // Show results
    resultsSection.style.display = 'flex';

    // Scroll to results
    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  /* ===== Animate Counter ===== */
  function animateCounter(el, from, to, duration) {
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ===== Render Sliders ===== */
  function renderSliders(scores) {
    slidersGrid.innerHTML = '';
    const sliderData = [
      { label: 'Problem Strength', value: scores.problemStrength, max: 10, color: 'green' },
      { label: 'Solution Clarity', value: scores.solutionClarity, max: 10, color: 'blue' },
      { label: 'Feasibility', value: scores.feasibility, max: 10, color: 'purple' },
      { label: 'Innovation', value: scores.innovation, max: 10, color: 'warm' },
      { label: 'Scalability', value: scores.scalability, max: 10, color: 'green' },
      { label: 'Monetization', value: scores.monetization, max: 10, color: 'blue' },
    ];

    sliderData.forEach((s, i) => {
      const valueClass = s.value >= 7 ? 'high' : s.value >= 5 ? 'mid' : 'low';
      const pct = (s.value / s.max) * 100;

      const row = document.createElement('div');
      row.className = 'slider-row';
      row.innerHTML = `
        <span class="slider-label">${s.label}</span>
        <div class="slider-bar-container">
          <div class="slider-bar-fill ${s.color}" id="sliderFill${i}"></div>
        </div>
        <span class="slider-value ${valueClass}">${s.value}/10</span>
      `;
      slidersGrid.appendChild(row);

      setTimeout(() => {
        document.getElementById(`sliderFill${i}`).style.width = pct + '%';
      }, 300 + i * 120);
    });

    // Competition Level tag
    const compRow = document.createElement('div');
    compRow.className = 'slider-row';
    const compClass = scores.competitionLevel.toLowerCase();
    compRow.innerHTML = `
      <span class="slider-label">Competition Level</span>
      <div style="flex:1;">
        <span class="competition-tag ${compClass}">
          ${scores.competitionLevel}
        </span>
      </div>
      <span class="slider-value" style="visibility:hidden">—</span>
    `;
    slidersGrid.appendChild(compRow);
  }

  /* ===== Render Competition ===== */
  function renderCompetition(competitors, comparison) {
    let html = '';
    competitors.forEach(c => {
      html += `
        <div class="competitor-item">
          <span class="competitor-dot"></span>
          <div class="competitor-info">
            <h4>${c.name}</h4>
            <p>${c.desc}</p>
          </div>
        </div>
      `;
    });
    html += `<div class="comparison-note">${comparison}</div>`;
    competitionContent.innerHTML = html;
  }

  /* ===== Render List ===== */
  const LIST_ICONS = {
    check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    alert: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    lightbulb: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>`
  };

  function renderList(container, items, iconType) {
    container.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="list-icon">${LIST_ICONS[iconType] || ''}</span><span>${item}</span>`;
      container.appendChild(li);
    });
  }

  /* ===== Store last inputs for "Improve Again" ===== */
  let lastInputs = { idea: '', audience: '', problem: '', model: '' };

  /* ===== Form Submit ===== */
  ideaForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const idea = $('#startupIdea').value.trim();
    const audience = $('#targetAudience').value.trim();
    const problem = $('#problemStatement').value.trim();
    const model = $('#businessModel').value.trim();

    if (!idea) return;

    lastInputs = { idea, audience, problem, model };
    analyzeBtn.disabled = true;

    const loadingInterval = showLoading();

    setTimeout(() => {
      clearInterval(loadingInterval);
      hideLoading();

      const result = Evaluator.evaluate(idea, audience, problem, model);
      renderResults(result);
      analyzeBtn.disabled = false;
    }, 2800);
  });

  /* ===== Improve Again Button ===== */
  improveBtn.addEventListener('click', function () {
    resultsSection.style.display = 'none';
    const loadingInterval = showLoading();

    setTimeout(() => {
      clearInterval(loadingInterval);
      hideLoading();

      const result = Evaluator.evaluate(
        lastInputs.idea,
        lastInputs.audience,
        lastInputs.problem,
        lastInputs.model
      );
      renderResults(result);
    }, 2000);
  });

  /* ===== Download Report ===== */
  downloadBtn.addEventListener('click', function () {
    if (!lastResult) return;
    const r = lastResult;
    const s = r.scores;

    let report = `IDEALENS STARTUP EVALUATION REPORT\n`;
    report += `${'='.repeat(50)}\n`;
    report += `Generated: ${new Date().toLocaleString()}\n\n`;

    report += `IDEA: ${lastInputs.idea}\n`;
    if (lastInputs.audience) report += `TARGET AUDIENCE: ${lastInputs.audience}\n`;
    if (lastInputs.problem) report += `PROBLEM: ${lastInputs.problem}\n`;
    if (lastInputs.model) report += `BUSINESS MODEL: ${lastInputs.model}\n`;
    report += `\n${'='.repeat(50)}\n\n`;

    report += `LIFT SCORE: ${r.liftScore}/100\n\n`;

    report += `DETAILED BREAKDOWN\n${'-'.repeat(30)}\n`;
    report += `  Problem Strength:    ${s.problemStrength}/10\n`;
    report += `  Solution Clarity:    ${s.solutionClarity}/10\n`;
    report += `  Feasibility:         ${s.feasibility}/10\n`;
    report += `  Competition Level:   ${s.competitionLevel}\n`;
    report += `  Innovation:          ${s.innovation}/10\n`;
    report += `  Scalability:         ${s.scalability}/10\n`;
    report += `  Monetization:        ${s.monetization}/10\n\n`;

    report += `FINAL VERDICT: ${r.verdict.label}\n`;
    report += `${r.verdict.text}\n\n`;

    report += `COMPETITION ANALYSIS\n${'-'.repeat(30)}\n`;
    r.competitors.forEach(c => {
      report += `  - ${c.name}: ${c.desc}\n`;
    });
    report += `\n${r.comparison}\n\n`;

    report += `STRENGTHS\n${'-'.repeat(30)}\n`;
    r.strengths.forEach(s => report += `  + ${s}\n`);
    report += '\n';

    report += `WEAKNESSES\n${'-'.repeat(30)}\n`;
    r.weaknesses.forEach(w => report += `  ! ${w}\n`);
    report += '\n';

    report += `IMPROVEMENT SUGGESTIONS\n${'-'.repeat(30)}\n`;
    r.suggestions.forEach(s => report += `  * ${s}\n`);
    report += `\n${'='.repeat(50)}\n`;
    report += `Report generated by IdeaLens — Your startup co-pilot.\n`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `idealens-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  /* ===== New Idea Button ===== */
  newIdeaBtn.addEventListener('click', function () {
    resultsSection.style.display = 'none';
    heroSection.style.display = 'block';
    inputSection.style.display = 'block';
    inputSection.style.animation = 'none';
    inputSection.offsetHeight;
    inputSection.style.animation = 'fadeSlideUp 0.6s ease both';
    ideaForm.reset();
    if (ideaCharCount) ideaCharCount.textContent = '0';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ===== Init ===== */
  injectSVGGradient();
  createParticles();

})();

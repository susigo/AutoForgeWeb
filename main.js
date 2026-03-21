/**
 * AutoForge v3 — Enterprise Sales Landing Page
 * Interactions: navbar scroll, MES code typing, scroll reveals,
 *               workflow steps activation, puzzle piece fitting
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide SVG icons
  if (window.lucide) {
    lucide.createIcons();
  }

  initNavbar();
  initScrollReveal();
  initPuzzlePieces();
  initMesCodeTyping();
  initWorkflowSteps();
  initCountUp();
});

/* ========================
   NAVBAR
   ======================== */
function initNavbar() {
  const nav = document.getElementById('navbar');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(link.getAttribute('href'));
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ========================
   SCROLL REVEAL
   ======================== */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

/* ========================
   PUZZLE PIECES — Fit animation on scroll
   ======================== */
function initPuzzlePieces() {
  const pieces = document.querySelectorAll('.puzzle-piece');
  if (!pieces.length) return;

  // After puzzle animation completes, add "fitted" glow
  pieces.forEach((piece, i) => {
    const delay = 1200 + i * 400 + 1200; // animation-delay + duration
    setTimeout(() => piece.classList.add('fitted'), delay);
  });
}

/* ========================
   MES CODE TYPING
   ======================== */
function initMesCodeTyping() {
  const terminal = document.getElementById('mes-terminal');
  if (!terminal) return;

  const lines = [
    { t: '// AutoForge 从 Swagger 文档自动生成', c: 'cm' },
    { t: 'public class MesAsyncClient', c: 'kw' },
    { t: '{', c: '' },
    { t: '    private readonly HttpClient _client;', c: 'tp' },
    { t: '    private readonly SQLiteCache _cache;', c: 'tp' },
    { t: '', c: '' },
    { t: '    // ✅ 鉴权 + Token 自动刷新', c: 'cm' },
    { t: '    public async Task<bool> AuthAsync()', c: 'fn' },
    { t: '    {', c: '' },
    { t: '        var token = await RefreshToken();', c: '' },
    { t: '        _client.SetBearer(token);', c: 'safe' },
    { t: '        return true;', c: 'safe' },
    { t: '    }', c: '' },
    { t: '', c: '' },
    { t: '    // ✅ IT/OT 异步隔离', c: 'cm' },
    { t: '    public async Task ReportAsync(data)', c: 'fn' },
    { t: '    {', c: '' },
    { t: '        try {', c: '' },
    { t: '            await _client.PostAsync(data);', c: '' },
    { t: '        } catch (NetworkException) {', c: '' },
    { t: '            _cache.Enqueue(data);', c: 'safe' },
    { t: '            // 断网自动落盘 ✅', c: 'cm' },
    { t: '        }', c: '' },
    { t: '    }', c: '' },
    { t: '}', c: '' },
  ];

  // Create line elements
  const lineEls = lines.map(line => {
    const span = document.createElement('span');
    span.className = 'code-line';
    span.textContent = line.t || '\u00A0';
    if (line.c) span.classList.add(line.c);
    terminal.appendChild(span);
    return span;
  });

  // Cursor
  const cursor = document.createElement('span');
  cursor.className = 'code-cursor';
  terminal.appendChild(cursor);

  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        startTyping();
      }
    });
  }, { threshold: 0.25 });

  observer.observe(terminal.closest('.mes-code-panel'));

  function startTyping() {
    let idx = 0;
    function next() {
      if (idx >= lineEls.length) {
        // Loop after pause
        setTimeout(() => {
          lineEls.forEach(el => el.classList.remove('typed'));
          idx = 0;
          next();
        }, 5000);
        return;
      }
      const el = lineEls[idx];
      el.classList.add('typed');
      terminal.appendChild(cursor);
      idx++;

      const text = el.textContent.trim();
      let delay = 65;
      if (!text || text === '\u00A0') delay = 30;
      else if (text.startsWith('//')) delay = 55;
      else delay = 40 + Math.min(text.length * 2.5, 100);

      setTimeout(next, delay);
    }
    setTimeout(next, 400);
  }
}

/* ========================
   WORKFLOW STEPS — Sequential activation
   ======================== */
function initWorkflowSteps() {
  const wrapper = document.getElementById('workflow-steps');
  const fill = document.getElementById('wf-fill');
  const steps = document.querySelectorAll('.step-card');
  if (!wrapper || !fill || !steps.length) return;

  let done = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !done) {
        done = true;
        activate();
      }
    });
  }, { threshold: 0.25 });

  observer.observe(wrapper);

  function activate() {
    steps.forEach((step, i) => {
      setTimeout(() => {
        step.classList.add('active');
        fill.style.width = ((i + 1) / steps.length * 100) + '%';
      }, i * 550);
    });
  }
}

/* ========================
   COUNT UP — Hero stats
   ======================== */
function initCountUp() {
  const statEls = document.querySelectorAll('.stat-value[data-target]');
  if (!statEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCount(el, 0, target, 1200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => observer.observe(el));

  function animateCount(el, start, end, duration) {
    const unit = el.querySelector('.stat-unit');
    const unitText = unit ? unit.outerHTML : '';
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(start + (end - start) * eased);
      el.innerHTML = current + unitText;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
}

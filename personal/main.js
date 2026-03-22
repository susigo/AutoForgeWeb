/* ============================================================
   AutoForge Landing Page — Interactions & Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- Navbar scroll effect ----------
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // ---------- Scroll reveal (Intersection Observer) ----------
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- Hero code typing effect ----------
  const codeOutput = document.getElementById('hero-code-output');
  if (codeOutput) {
    const lines = codeOutput.querySelectorAll('.line');
    let currentLine = 0;

    function typeNextLine() {
      if (currentLine < lines.length) {
        lines[currentLine].classList.add('typed');
        currentLine++;
        const delay = currentLine <= 3 ? 120 : (80 + Math.random() * 100);
        setTimeout(typeNextLine, delay);
      }
    }

    // Start typing after a short delay
    setTimeout(typeNextLine, 800);
  }

  // ---------- Bento card sequential highlight ----------
  const bentoCards = document.querySelectorAll('.bento-card');

  const bentoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Activate cards sequentially
        bentoCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('active');
            // Deactivate after a while, keep cycling
            setTimeout(() => {
              card.classList.remove('active');
            }, 2000);
          }, index * 1200);
        });

        // Set up cycling
        let cycleIndex = 0;
        const cycleInterval = setInterval(() => {
          bentoCards.forEach(c => c.classList.remove('active'));
          bentoCards[cycleIndex].classList.add('active');
          cycleIndex = (cycleIndex + 1) % bentoCards.length;
        }, 3000);

        // Clear interval when section leaves viewport
        const clearOnLeave = new IntersectionObserver((es) => {
          if (!es[0].isIntersecting) {
            clearInterval(cycleInterval);
            bentoCards.forEach(c => c.classList.remove('active'));
          }
        });
        clearOnLeave.observe(entry.target);

        bentoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const magicSection = document.querySelector('.magic-section');
  if (magicSection) bentoObserver.observe(magicSection);

  // ---------- Defense section — squiggly underline + alarm ----------
  const defenseSection = document.querySelector('.defense-section');
  const dangerCode = document.getElementById('danger-code');
  const alarmBox = document.getElementById('alarm-box');

  if (defenseSection && dangerCode && alarmBox) {
    const defenseObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger squiggly underline after a pause
          setTimeout(() => {
            dangerCode.classList.add('active');
          }, 800);

          // Then show the alarm box
          setTimeout(() => {
            alarmBox.classList.add('active');
          }, 1600);

          defenseObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    defenseObserver.observe(defenseSection);
  }

  // ---------- Smooth scroll for anchor links ----------
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------- Hero particle network ----------
  initHeroParticles();
});

// ---------- Particle constellation network ----------
function initHeroParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const PARTICLE_COUNT = 70;
  const CONNECT_DIST = 140;
  const MOUSE_RADIUS = 200;
  let mouse = { x: -9999, y: -9999 };
  let particles = [];
  let animId;

  function resize() {
    const hero = canvas.parentElement;
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.8 + 0.5;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.alpha = this.baseAlpha;
      // Slight color variation between blue shades
      const hue = 200 + Math.random() * 20;
      const sat = 80 + Math.random() * 20;
      const light = 55 + Math.random() * 20;
      this.color = `hsla(${hue}, ${sat}%, ${light}%, `;
    }
    update() {
      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS && dist > 0) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.015;
        this.vx += dx / dist * force;
        this.vy += dy / dist * force;
      }

      // Damping
      this.vx *= 0.998;
      this.vy *= 0.998;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap around
      if (this.x < -20) this.x = canvas.width + 20;
      if (this.x > canvas.width + 20) this.x = -20;
      if (this.y < -20) this.y = canvas.height + 20;
      if (this.y > canvas.height + 20) this.y = -20;

      // Pulse alpha
      this.alpha = this.baseAlpha + Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.15;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = this.color + (this.alpha * 0.15) + ')';
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 112, 243, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    animId = requestAnimationFrame(animate);
  }

  // Mouse tracking (relative to hero section)
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
    }, { passive: true });
  }

  resize();
  init();
  animate();

  window.addEventListener('resize', () => {
    resize();
    // Re-distribute particles on resize
    particles.forEach(p => {
      if (p.x > canvas.width) p.x = Math.random() * canvas.width;
      if (p.y > canvas.height) p.y = Math.random() * canvas.height;
    });
  }, { passive: true });
}

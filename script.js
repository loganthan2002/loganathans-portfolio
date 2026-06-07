/* ===== CANVAS PARTICLE BACKGROUND ===== */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const PARTICLE_COUNT = 60;
  const MAX_DIST = 140;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59,130,246,${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
  animate();
})();

/* ===== NAVBAR SCROLL ===== */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ===== MOBILE MENU ===== */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-close');

hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ===== SCROLL REVEAL ===== */
const revealEls = document.querySelectorAll('.reveal, .timeline-item');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObs.observe(el));

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.style.color = '#60a5fa';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObs.observe(s));

/* ===== CONTACT FORM ===== */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('.form-submit');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  setTimeout(() => {
    status.textContent = '✓ Message sent! I\'ll get back to you soon.';
    status.className = 'form-status success';
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Send Message';
    setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
  }, 1500);
});

/* ===== 3D TILT on Project Cards ===== */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ===== TYPED HERO ROLE ===== */
const roleEl = document.getElementById('heroRole');
const roles = ['Full Stack Java Developer', 'MCA Cloud Computing Student', 'Problem Solver', 'Tech Enthusiast'];
let ri = 0, ci = 0, deleting = false;

function typeRole() {
  const cur = roles[ri];
  if (!deleting) {
    roleEl.textContent = cur.substring(0, ci + 1);
    ci++;
    if (ci === cur.length) {
      deleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
  } else {
    roleEl.textContent = cur.substring(0, ci - 1);
    ci--;
    if (ci === 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 45 : 85);
}
setTimeout(typeRole, 1500);

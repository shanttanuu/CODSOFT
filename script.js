// ===================== Navbar scroll & active link =====================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');

function onScroll(){
  const scrollY = window.scrollY;

  // Navbar background
  navbar.classList.toggle('scrolled', scrollY > 40);

  // Scroll progress bar
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
  scrollProgress.style.width = progress + '%';

  // Back to top button visibility
  backToTop.classList.toggle('show', scrollY > 500);

  // Active nav link based on section in view
  let current = sections[0]?.id;
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 120 && rect.bottom > 120) {
      current = section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===================== Mobile menu =====================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

// ===================== Back to top =====================
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================== Scroll reveal animations =====================
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

// Stagger index for grid children
['.skills-grid .skill-card', '.projects-grid .project-card', '.certs-grid .cert-card']
  .forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.setProperty('--i', i);
    });
  });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ===================== Contact form =====================
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();

  formStatus.textContent = `Thanks ${name || 'there'}! Your message has been noted. I'll get back to you soon.`;
  formStatus.style.color = 'var(--cyan)';
  contactForm.reset();

  setTimeout(() => { formStatus.textContent = ''; }, 6000);
});

// ===================== Smooth scroll offset fix for fixed navbar =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    const targetId = this.getAttribute('href');
    if (targetId.length > 1) {
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 70;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  });
});

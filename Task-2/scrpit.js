document.addEventListener('DOMContentLoaded', () => {

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile nav toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // Navbar background on scroll + back to top button
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 40;
    navbar.style.boxShadow = scrolled ? '0 10px 30px rgba(0,0,0,0.35)' : 'none';
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Scroll reveal animations
  const revealTargets = document.querySelectorAll(
    '.feature-card, .testimonial-card, .benefit-list li, .section-head, .cta-inner, .benefits-visual, .stat-item'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));

  // Animated stat counters
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1600;
      const startTime = performance.now();

      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = formatNumber(value, target);
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = formatNumber(target, target);
        }
      }
      requestAnimationFrame(update);
    });
  }

  function formatNumber(value, target) {
    if (target === 95) return value + '%';
    return value.toLocaleString() + '+';
  }

  const statsSection = document.getElementById('stats');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.4 });

  statsObserver.observe(statsSection);

});
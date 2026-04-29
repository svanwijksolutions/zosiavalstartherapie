/* ============================================================
   script.js — Zosia Valstar Therapie
   S. van Wijk Solutions © 2026
============================================================ */

/* --- Component Loader (header & footer) --- */
async function loadComponents() {
  const headerEl = document.getElementById('header-placeholder');
  const footerEl = document.getElementById('footer-placeholder');

  try {
    if (headerEl) {
      const res = await fetch('components/header.html');
      headerEl.innerHTML = await res.text();
      initMobileNav();
      initHeaderScroll();
      initActiveNav();
    }
    if (footerEl) {
      const res = await fetch('components/footer.html');
      footerEl.innerHTML = await res.text();
    }
  } catch (e) {
    console.warn('Component laden mislukt:', e);
  }

  initAnimations();
}

/* --- Mobile Nav --- */
function initMobileNav() {
  const btn     = document.getElementById('hamburger-btn');
  const overlay = document.getElementById('nav-overlay');
  if (!btn || !overlay) return;

  btn.addEventListener('click', () => {
    const isOpen = overlay.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Sluit menu bij klik op een link
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      overlay.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });
}

/* --- Header Scroll Effect --- */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Active Nav Link --- */
function initActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#site-header a[href]').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* --- Scroll Reveal Animaties --- */
function initAnimations() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}

/* --- Contact Formulier Succesbericht --- */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Verzenden…';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.innerHTML = `
          <div class="form-success">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--dark)" stroke-width="1.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3>Bericht ontvangen!</h3>
            <p>Ik neem zo snel mogelijk contact met je op.</p>
          </div>`;
      } else {
        btn.disabled = false;
        btn.textContent = 'Verstuur bericht';
        alert('Er ging iets mis. Probeer het opnieuw of mail naar info@zosiavalstar.nl');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Verstuur bericht';
      alert('Geen verbinding. Probeer het opnieuw.');
    }
  });
}

/* --- Init --- */
document.addEventListener('DOMContentLoaded', () => {
  loadComponents();
  initContactForm();
});
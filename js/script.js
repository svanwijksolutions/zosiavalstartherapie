document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
        loadComponent('header', 'header-placeholder'),
        loadComponent('footer', 'footer-placeholder')
    ]).then(() => {
        initMobileMenu();
        initAnimations();
        highlightActiveNav();
    });
});

/* ── Component loader ─────────────────────────────────────── */
async function loadComponent(name, id) {
    try {
        const res = await fetch(`components/${name}.html`);
        if (!res.ok) throw new Error(`Fout bij laden: ${name}`);
        const html = await res.text();
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    } catch (err) {
        console.error(err);
    }
}

/* ── Mobile menu ─────────────────────────────────────────── */
function initMobileMenu() {
    const btn     = document.getElementById('hamburger-btn');
    const overlay = document.getElementById('nav-overlay');

    if (!btn || !overlay) {
        // DOM nog niet klaar, probeer opnieuw
        setTimeout(initMobileMenu, 100);
        return;
    }

    const links = overlay.querySelectorAll('.mobile-nav-links a');

    btn.addEventListener('click', () => {
        const isOpen = overlay.classList.toggle('open');
        btn.classList.toggle('open', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            overlay.classList.remove('open');
            btn.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ── Scroll reveal ───────────────────────────────────────── */
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Actieve nav-link markeren ───────────────────────────── */
function highlightActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === path || (path === '' && href === 'index.html')) {
            link.style.fontWeight = '800';
            link.style.opacity = '1';
        }
    });
}
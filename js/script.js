document.addEventListener('DOMContentLoaded', () => {
    // We laden de componenten en voeren de rest pas uit als ze er zijn
    Promise.all([
        loadComponent('header', 'header-placeholder'),
        loadComponent('footer', 'footer-placeholder')
    ]).then(() => {
        initMobileMenu();
        initAnimations();
    });
});

async function loadComponent(name, id) {
    try {
        const res = await fetch(`components/${name}.html`);
        if (!res.ok) throw new Error(`Fout bij laden: ${name}`);
        const html = await res.text();
        document.getElementById(id).innerHTML = html;
    } catch (err) {
        console.error(err);
    }
}

function initMobileMenu() {
    const btn = document.getElementById('hamburger-btn');
    const overlay = document.getElementById('nav-overlay');
    const links = document.querySelectorAll('.mobile-nav-links a');

    if (btn && overlay) {
        btn.onclick = () => {
            btn.classList.toggle('open');
            overlay.classList.toggle('open');
            document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : 'auto';
        };

        links.forEach(link => {
            link.onclick = () => {
                btn.classList.remove('open');
                overlay.classList.remove('open');
                document.body.style.overflow = 'auto';
            };
        });
    } else {
        // Fallback: probeer het over 100ms nog een keer als de DOM traag is
        setTimeout(initMobileMenu, 100);
    }
}

function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
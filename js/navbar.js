export async function loadNavbar() {
    const root = document.getElementById('navbar-root');
    if (!root) return;

    const response = await fetch('components/navbar/navbar.html');
    root.innerHTML = await response.text();

    const menuToggle = document.getElementById('menuToggle');
    const siteNav = document.getElementById('siteNav');
    const siteHeader = document.getElementById('siteHeader');
    const navLinks = [...document.querySelectorAll('[data-scroll]')];

    function closeMenu() {
        siteNav.classList.remove('is-open');
        menuToggle?.setAttribute('aria-expanded', 'false');
    }

    menuToggle?.addEventListener('click', () => {
        const nextState = !siteNav.classList.contains('is-open');
        siteNav.classList.toggle('is-open', nextState);
        menuToggle.setAttribute('aria-expanded', String(nextState));
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            if (!targetId?.startsWith('#')) return;
            event.preventDefault();
            document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            closeMenu();
        });
    });

    window.addEventListener('scroll', () => {
        siteHeader?.classList.toggle('is-scrolled', window.scrollY > 24);
    });

    const sections = [...document.querySelectorAll('main section[id]')];
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`));
        });
    }, { threshold: 0.55 });

    sections.forEach((section) => observer.observe(section));
}

import { COMPANY_INFO, SERVICES } from './fallback-data.js';
import { getProjects } from './project-store.js';
import { loadNavbar } from './navbar.js';

const projectsGrid = document.getElementById('projectsGrid');
const servicesGrid = document.getElementById('servicesGrid');
const contactList = document.getElementById('contactList');
const contactForm = document.getElementById('contactForm');
const projectsToolbar = document.querySelector('.projects-toolbar');
let allProjects = [];

function escapeAttribute(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function getImageButton(imageUrl, altText, extraClass = '') {
    const safeImageUrl = escapeAttribute(imageUrl);
    const safeAltText = escapeAttribute(altText);

    return `
        <button class="image-lightbox-trigger ${extraClass}" type="button" data-full-image="${safeImageUrl}" data-image-alt="${safeAltText}">
            <img src="${safeImageUrl}" alt="${safeAltText}" loading="lazy">
        </button>
    `;
}

function renderServices() {
    servicesGrid.innerHTML = SERVICES.map((service, index) => `
        <article class="product-card">
            <figure>
                ${getImageButton(service.imageUrl || 'img/projetos/Box Elegance com roldanas aparente - 01.jpeg', service.title)}
            </figure>
            <div class="product-card-text">
                <h3>${service.title}</h3>
                <p>${service.description}</p>
            </div>
        </article>
    `).join('');
}

function renderContact() {
    contactList.innerHTML = `
        <a href="https://wa.me/${COMPANY_INFO.whatsapp}" target="_blank" rel="noreferrer">WhatsApp: ${COMPANY_INFO.phone}</a>
        <a href="mailto:${COMPANY_INFO.email}">E-mail: ${COMPANY_INFO.email}</a>
        <a href="https://instagram.com/${COMPANY_INFO.instagram.replace('@', '')}" target="_blank" rel="noreferrer">Instagram: ${COMPANY_INFO.instagram}</a>
        <span>Atendimento base: ${COMPANY_INFO.city}</span>
    `;
}

function renderProjects(filter = 'todos') {
    const filtered = filter === 'todos' ? allProjects : allProjects.filter((project) => project.category === filter);
    projectsGrid.innerHTML = filtered.map((project) => `
        <article class="project-card ${project.featured ? 'is-featured' : ''}">
            <figure class="project-image-wrap">${getImageButton(project.imageUrl, project.title)}</figure>
            <div class="project-content">
                <h3>${project.title}</h3>
                ${project.location ? `<span>${project.location}</span>` : ''}
                <p>${project.description}</p>
            </div>
        </article>
    `).join('');
}

function setupFilters() {
    if (!projectsToolbar) return;

    const categories = allProjects.reduce((items, project) => {
        if (!items.some((item) => item.value === project.category)) {
            items.push({ value: project.category, label: project.categoryLabel || project.title || project.category });
        }

        return items;
    }, []);

    projectsToolbar.innerHTML = [
        '<button class="filter-chip is-active" data-filter="todos" type="button">Todos</button>',
        ...categories.map((category) => `<button class="filter-chip" data-filter="${category.value}" type="button">${category.label}</button>`)
    ].join('');

    projectsToolbar.querySelectorAll('.filter-chip').forEach((button) => {
        button.addEventListener('click', () => {
            projectsToolbar.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.remove('is-active'));
            button.classList.add('is-active');
            renderProjects(button.dataset.filter);
        });
    });
}

function setupContactForm() {
    contactForm?.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const text = [
            'Olá, vim pelo site da D\'Paz Glass.',
            `Nome: ${formData.get('nome')}`,
            `Telefone: ${formData.get('telefone')}`,
            `Tipo de projeto: ${formData.get('tipo')}`,
            `Mensagem: ${formData.get('mensagem') || 'Não informada'}`
        ].join('\n');
        window.open(`https://wa.me/${COMPANY_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    });
}

function setupBannerSlider() {
    const slides = [...document.querySelectorAll('.banner-slide')];
    const dotsRoot = document.getElementById('bannerDots');
    const prevButton = document.getElementById('bannerPrev');
    const nextButton = document.getElementById('bannerNext');
    let currentIndex = 0;
    let timerId = null;

    if (!slides.length || !dotsRoot) return;

    slides.forEach((slide) => {
        slide.style.backgroundImage = `url("${slide.dataset.bg}")`;
    });

    dotsRoot.innerHTML = slides.map((_, index) => `<button type="button" aria-label="Ir para banner ${index + 1}"></button>`).join('');
    const dots = [...dotsRoot.querySelectorAll('button')];

    function showSlide(index) {
        currentIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === currentIndex));
        dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === currentIndex));
    }

    function startAutoPlay() {
        clearInterval(timerId);
        timerId = setInterval(() => showSlide(currentIndex + 1), 6500);
    }

    dots.forEach((dot, index) => dot.addEventListener('click', () => {
        showSlide(index);
        startAutoPlay();
    }));

    prevButton?.addEventListener('click', () => {
        showSlide(currentIndex - 1);
        startAutoPlay();
    });

    nextButton?.addEventListener('click', () => {
        showSlide(currentIndex + 1);
        startAutoPlay();
    });

    showSlide(0);
    startAutoPlay();
}

function setupContactFocus() {
    document.getElementById('openContactFocus')?.addEventListener('click', () => {
        document.querySelector('#contato')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => contactForm?.elements.nome?.focus(), 500);
    });
}

function setupImageLightbox() {
    const modal = document.createElement('div');
    modal.className = 'image-lightbox';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="image-lightbox-dialog" role="dialog" aria-modal="true" aria-label="Imagem ampliada">
            <button class="image-lightbox-close" type="button" aria-label="Fechar imagem">×</button>
            <img src="" alt="">
        </div>
    `;
    document.body.appendChild(modal);

    const modalImage = modal.querySelector('img');
    const closeButton = modal.querySelector('.image-lightbox-close');

    function openLightbox(imageUrl, altText) {
        modalImage.src = imageUrl;
        modalImage.alt = altText || 'Imagem ampliada';
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('has-open-lightbox');
        closeButton.focus();
    }

    function closeLightbox() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('has-open-lightbox');
        modalImage.removeAttribute('src');
    }

    document.addEventListener('click', (event) => {
        const trigger = event.target.closest('.image-lightbox-trigger, .front-introduction-image img, .front-distributor-image img');
        if (!trigger) return;

        const image = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
        const imageUrl = trigger.dataset.fullImage || image?.currentSrc || image?.src;
        if (!imageUrl) return;

        openLightbox(imageUrl, trigger.dataset.imageAlt || image?.alt);
    });

    closeButton.addEventListener('click', closeLightbox);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) {
            closeLightbox();
        }
    });
}

function setupScrollReveal() {
    const revealItems = [
        ...document.querySelectorAll('.section-title, .front-introduction-text, .front-introduction-image, .front-distributor-image, .front-distributor-content, .contact-info, .contact-card, .process-list article'),
        ...document.querySelectorAll('.product-card, .project-card')
    ];

    if (!revealItems.length) return;

    revealItems.forEach((item, index) => {
        item.classList.add('reveal-on-scroll');
        item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.16 });

    revealItems.forEach((item) => observer.observe(item));
}

async function init() {
    await loadNavbar();
    setupBannerSlider();
    renderServices();
    renderContact();
    allProjects = await getProjects();
    renderProjects();
    setupFilters();
    setupImageLightbox();
    setupScrollReveal();
    setupContactForm();
    setupContactFocus();
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

init();

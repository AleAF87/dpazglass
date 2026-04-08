import { COMPANY_INFO, SERVICES } from './fallback-data.js';
import { getProjects } from './project-store.js';
import { loadNavbar } from './navbar.js';

const projectsGrid = document.getElementById('projectsGrid');
const servicesGrid = document.getElementById('servicesGrid');
const contactList = document.getElementById('contactList');
const contactForm = document.getElementById('contactForm');
let allProjects = [];

function renderServices() {
    servicesGrid.innerHTML = SERVICES.map((service, index) => `
        <article class="product-card">
            <figure>
                <img src="${service.imageUrl || `img/projetos/projeto-0${(index % 4) + 1}.svg`}" alt="${service.title}" loading="lazy">
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
            <figure class="project-image-wrap"><img src="${project.imageUrl}" alt="${project.title}" loading="lazy"></figure>
            <div class="project-content">
                <h3>${project.title}</h3>
                <span>${project.location}</span>
                <p>${project.description}</p>
            </div>
        </article>
    `).join('');
}

function setupFilters() {
    document.querySelectorAll('.filter-chip').forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.remove('is-active'));
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

async function init() {
    await loadNavbar();
    setupBannerSlider();
    renderServices();
    renderContact();
    allProjects = await getProjects();
    renderProjects();
    setupFilters();
    setupContactForm();
    setupContactFocus();
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

init();

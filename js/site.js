import { COMPANY_INFO, HERO_METRICS, SERVICES, TESTIMONIALS } from './fallback-data.js';
import { getProjects } from './project-store.js';
import { loadNavbar } from './navbar.js';

const projectsGrid = document.getElementById('projectsGrid');
const heroMetrics = document.getElementById('heroMetrics');
const servicesGrid = document.getElementById('servicesGrid');
const testimonialGrid = document.getElementById('testimonialGrid');
const contactList = document.getElementById('contactList');
const contactForm = document.getElementById('contactForm');
let allProjects = [];

function renderHeroMetrics() {
    heroMetrics.innerHTML = HERO_METRICS.map((metric) => `<li><strong>${metric.value}</strong><span>${metric.label}</span></li>`).join('');
}

function renderServices() {
    servicesGrid.innerHTML = SERVICES.map((service) => `<article class="service-card"><h3>${service.title}</h3><p>${service.description}</p></article>`).join('');
}

function renderTestimonials() {
    testimonialGrid.innerHTML = TESTIMONIALS.map((item) => `<article class="testimonial-card"><h3>${item.title}</h3><p>${item.text}</p></article>`).join('');
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
            <div class="project-image-wrap"><img src="${project.imageUrl}" alt="${project.title}" loading="lazy"></div>
            <div class="project-content">
                <div class="project-meta"><span>${project.category}</span><small>${project.location}</small></div>
                <h3>${project.title}</h3>
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

async function init() {
    await loadNavbar();
    renderHeroMetrics();
    renderServices();
    renderTestimonials();
    renderContact();
    allProjects = await getProjects();
    renderProjects();
    setupFilters();
    setupContactForm();
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

init();

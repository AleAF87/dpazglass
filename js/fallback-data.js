export const COMPANY_INFO = {
    whatsapp: '5516991470086',
    phone: '(16) 99147-0086',
    email: 'contato@dpazglass.com.br',
    instagram: '@dpazglass',
    city: 'Ribeirão Preto / SP'
};

export const HERO_METRICS = [
    { value: 'Sob medida', label: 'Projetos pensados para o ambiente real' },
    { value: 'Visual premium', label: 'Recorte limpo e acabamento elegante' },
    { value: 'Atendimento ágil', label: 'Contato fácil e proposta objetiva' }
];

const PROJECT_SECTIONS = [
    'Box Elegance com roldanas aparente',
    'Box linha tradicional padrão',
    'Box Mini Max design minimalista',
    'Box Tradicional padrão vidro verde',
    'Fachada em vidro “Pele de Vidro” conjugado com vitro Maxiar e porta em alumínio Esquadria linha Gold Black',
    'Guarda corpo e fachada em vidro',
    'Porta em alumínio para ambientes internos',
    'Porta em Esquadria Alumínio Madeirado linha Gold',
    'Vitro Basculante linha Vidro Temperado'
];

function slugifyProjectSection(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const SERVICES = [
    { title: 'Boxes de vidro', description: 'Soluções funcionais e sofisticadas para banheiros com ferragens e acabamento alinhados ao projeto.', imageUrl: 'img/projetos/Box Elegance com roldanas aparente - 01.jpeg' },
    { title: 'Fachadas e portas', description: 'Aplicações para frentes comerciais e acessos com transparência, presença e melhor percepção de valor.', imageUrl: 'img/projetos/Fachada em vidro “Pele de Vidro” conjugado com vitro Maxiar e porta em alumínio Esquadria linha Gold Black - 01.jpeg' },
    { title: 'Guarda-corpos', description: 'Instalações em vidro que protegem, integram o visual e mantêm a leveza do ambiente.', imageUrl: 'img/projetos/Guarda corpo e fachada em vidro - 01.jpeg' },
    { title: 'Portas e esquadrias', description: 'Portas em alumínio e vidro para ambientes internos, fachadas e projetos sob medida.', imageUrl: 'img/projetos/Porta em Esquadria Alumínio Madeirado linha Gold - 01.jpeg' }
];

export const TESTIMONIALS = [
    { title: 'Apresentação profissional', text: 'O site foi desenhado para transmitir uma imagem mais sólida da empresa e facilitar o fechamento pelo online.' },
    { title: 'Galeria administrável', text: 'A vitrine de projetos pode ser atualizada sem alterar manualmente o HTML da página.' },
    { title: 'Estrutura pronta para crescer', text: 'A base suporta integração com Firebase, Cloudinary, GitHub e deploy simples no Netlify.' }
];

export const FALLBACK_PROJECTS = PROJECT_SECTIONS.map((title, index) => ({
    id: `${slugifyProjectSection(title)}-01`,
    title,
    location: '',
    category: slugifyProjectSection(title),
    categoryLabel: title,
    description: 'Projeto executado sob medida com acabamento profissional em vidro e alumínio.',
    imageUrl: `img/projetos/${title} - 01.jpeg`,
    featured: index === 0 || index === 4,
    order: index + 1
}));

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

function slugifyProjectSection(value) {
    return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const SERVICES = [
    { title: 'Janelas', description: 'Janelas em vidro e alumínio que ampliam a iluminação natural, valorizam a fachada e mantêm o ambiente mais confortável.', imageUrl: 'img/projetos/janelas/Vitro Basculante linha Vidro Temperado.jpeg' },
    { title: 'Fachadas', description: 'Aplicações para frentes comerciais e acessos com transparência, presença e melhor percepção de valor.', imageUrl: 'img/projetos/fachadas_portas/Fachada em vidro “Pele de Vidro” conjugado com vitro Maxiar e porta em alumínio Esquadria linha Gold Black.jpeg' },
    { title: 'Guarda-corpos', description: 'Instalações em vidro que protegem, integram o visual e mantêm a leveza do ambiente.', imageUrl: 'img/projetos/guarda_corpos/Guarda corpo e fachada em vidro.jpeg' },
    { title: 'Portas e esquadrias', description: 'Portas em alumínio e vidro para ambientes internos, fachadas e projetos sob medida.', imageUrl: 'img/projetos/portas_esquadrias/Porta em Esquadria Alumínio Madeirado linha Gold.jpeg' }
];

export const TESTIMONIALS = [
    { title: 'Apresentação profissional', text: 'O site foi desenhado para transmitir uma imagem mais sólida da empresa e facilitar o fechamento pelo online.' },
    { title: 'Galeria administrável', text: 'A vitrine de projetos pode ser atualizada sem alterar manualmente o HTML da página.' },
    { title: 'Estrutura pronta para crescer', text: 'A base suporta integração com Firebase, Cloudinary, GitHub e deploy simples no Netlify.' }
];

export const FALLBACK_PROJECTS = [
    {
        title: 'Elegance com roldanas aparente',
        imageUrl: 'img/projetos/boxes_vidro/elegance_roldanas_aparente/Box Elegance com roldanas aparente.jpeg'
    },
    {
        title: 'Mini Max design minimalista',
        imageUrl: 'img/projetos/boxes_vidro/mini_max_minimalista/Box Mini Max design minimalista.jpeg'
    },
    {
        title: 'Tradicional padrão',
        imageUrl: 'img/projetos/boxes_vidro/tradicional_padrão/Box linha tradicional padrão.jpeg'
    },
    {
        title: 'Tradicional vidro verde',
        imageUrl: 'img/projetos/boxes_vidro/tradicional_vidro_verde/Box Tradicional padrão vidro verde.jpeg'
    }
].map((project, index) => ({
    id: `${slugifyProjectSection(project.title)}-01`,
    title: project.title,
    location: '',
    category: slugifyProjectSection(project.title),
    categoryLabel: project.title,
    description: 'Box de vidro sob medida com ferragens bem escolhidas, acabamento limpo e visual pensado para deixar o banheiro mais bonito, seguro e fácil de usar no dia a dia.',
    imageUrl: project.imageUrl,
    featured: index === 0,
    order: index + 1
}));

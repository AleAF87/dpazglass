export const COMPANY_INFO = {
    whatsapp: '5544999999999',
    phone: '(44) 99999-9999',
    email: 'contato@dpazglass.com.br',
    instagram: '@dpazglass',
    city: 'Maringá - PR'
};

export const HERO_METRICS = [
    { value: 'Sob medida', label: 'Projetos pensados para o ambiente real' },
    { value: 'Visual premium', label: 'Recorte limpo e acabamento elegante' },
    { value: 'Atendimento ágil', label: 'Contato fácil e proposta objetiva' }
];

export const SERVICES = [
    { title: 'Boxes de vidro', description: 'Soluções funcionais e sofisticadas para banheiros com ferragens e acabamento alinhados ao projeto.', imageUrl: 'img/projetos/projeto-01.svg' },
    { title: 'Fachadas e portas', description: 'Aplicações para frentes comerciais e acessos com transparência, presença e melhor percepção de valor.', imageUrl: 'img/projetos/projeto-02.svg' },
    { title: 'Espelhos e painéis', description: 'Instalações que ampliam visualmente o ambiente e ajudam a compor interiores contemporâneos.', imageUrl: 'img/projetos/projeto-03.svg' },
    { title: 'Divisórias e fechamento', description: 'Separação de ambientes com leveza estética e aproveitamento inteligente da iluminação.', imageUrl: 'img/projetos/projeto-04.svg' }
];

export const TESTIMONIALS = [
    { title: 'Apresentação profissional', text: 'O site foi desenhado para transmitir uma imagem mais sólida da empresa e facilitar o fechamento pelo online.' },
    { title: 'Galeria administrável', text: 'A vitrine de projetos pode ser atualizada sem alterar manualmente o HTML da página.' },
    { title: 'Estrutura pronta para crescer', text: 'A base suporta integração com Firebase, Cloudinary, GitHub e deploy simples no Netlify.' }
];

export const FALLBACK_PROJECTS = [
    {
        id: 'projeto-01',
        title: 'Box Elegance',
        location: 'Maringá - PR',
        category: 'box',
        description: 'Box com composição clean e ferragens discretas para banheiro contemporâneo.',
        imageUrl: 'img/projetos/projeto-01.svg',
        featured: true,
        order: 1
    },
    {
        id: 'projeto-02',
        title: 'Fachada Prime',
        location: 'Paiçandu - PR',
        category: 'fachada',
        description: 'Frente comercial com painéis de vidro valorizando a entrada e a iluminação.',
        imageUrl: 'img/projetos/projeto-02.svg',
        featured: false,
        order: 2
    },
    {
        id: 'projeto-03',
        title: 'Espelho Soft Line',
        location: 'Sarandi - PR',
        category: 'espelho',
        description: 'Espelho sob medida para ampliar o ambiente e reforçar a elegância do espaço.',
        imageUrl: 'img/projetos/projeto-03.svg',
        featured: false,
        order: 3
    },
    {
        id: 'projeto-04',
        title: 'Divisória Office',
        location: 'Maringá - PR',
        category: 'divisoria',
        description: 'Divisória de vidro para escritório com leitura visual limpa e contemporânea.',
        imageUrl: 'img/projetos/projeto-04.svg',
        featured: true,
        order: 4
    }
];

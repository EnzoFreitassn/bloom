const seedData = {
  categories: [
    { name: 'Vestidos', slug: 'vestidos', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600' },
    { name: 'Blusas', slug: 'blusas', image: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=600' },
    { name: 'Calças', slug: 'calcas', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600' },
    { name: 'Saias', slug: 'saias', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600' },
    { name: 'Bodys', slug: 'bodys', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600' },
  ],
  products: [
    // PEÇAS EM DESTAQUE
    {
      name: 'Calça Cargo Alfaiataria Preto',
      slug: 'calca-cargo-alfaiataria-preto',
      description: 'Tendência máxima, a calça cargo em alfaiataria une conforto e elegância. Bolsos laterais e caimento impecável.',
      price: 209.90,
      salePrice: null,
      category: 'calcas',
      sizes: ['P', 'M', 'G'],
      images: ['/images/calca-cargo-preto.png'],
      featured: true,
      isNew: true,
      stock: 10
    },
    {
      name: 'Vestido Longo Sereia Drapeado Tule Verde Oliva',
      slug: 'vestido-longo-sereia-drapeado-verde-oliva',
      description: 'Modelagem sereia que valoriza as curvas. Tecido em tule drapeado que confere sofisticação.',
      price: 279.90,
      salePrice: null,
      category: 'vestidos',
      sizes: ['P', 'M', 'G'],
      images: ['/images/vestido-oliva.png'],
      featured: true,
      isNew: true,
      stock: 5
    },
    {
      name: 'Vestido Longo Renda c/ Guipir Entremeio Verde Esmeralda',
      slug: 'vestido-longo-renda-verde-esmeralda',
      description: 'Lindo vestido em renda esmeralda com detalhes em guipir. Um sonho para ocasiões especiais.',
      price: 349.90,
      salePrice: null,
      category: 'vestidos',
      sizes: ['M', 'G'],
      images: ['/images/vestido-esmeralda.png'],
      featured: true,
      isNew: true,
      stock: 3
    },
    {
      name: 'Body Transpassado c/ Manga Bufante',
      slug: 'body-transpassado-manga-bufante',
      description: 'Body elegante com decote transpassado e mangas bufantes em chiffon. Sofisticação imediata.',
      price: 189.90,
      salePrice: null,
      category: 'bodys',
      sizes: ['P', 'M', 'G'],
      images: ['/images/body-bufante.png'],
      featured: true,
      isNew: true,
      stock: 8
    },
    {
      name: 'Saia Midi Transpassada Lurex',
      slug: 'saia-midi-transpassada-lurex',
      description: 'Saia midi com brilho discreto do lurex e fenda lateral poderosa.',
      price: 239.90,
      salePrice: null,
      category: 'saias',
      sizes: ['P', 'M'],
      images: ['/images/saia-lurex.png'],
      featured: true,
      isNew: true,
      stock: 4
    },
    // BEST SELLERS
    {
      name: 'Vestido Longo Sereia Drapeado',
      slug: 'vestido-longo-sereia-laranja',
      description: 'Nossa peça mais vendida agora em novas cores. Drapeado estratégico que modela o corpo.',
      price: 369.90,
      salePrice: null,
      category: 'vestidos',
      sizes: ['P', 'M', 'G'],
      images: ['/images/vestido-laranja.png'],
      featured: false,
      isNew: true,
      stock: 12
    },
    {
       name: 'Body Poliamida Premium Gola Alta Básico Amarelo',
       slug: 'body-poliamida-amarelo',
       description: 'Conforto e versatilidade em poliamida de alta qualidade.',
       price: 99.90,
       salePrice: null,
       category: 'bodys',
       sizes: ['PP', 'P', 'M', 'G'],
       images: ['/images/top-amarelo.png'],
       featured: false,
       isNew: true,
       stock: 20
    },
    {
       name: 'Body Basic Regata Decote Quadrado Preto',
       slug: 'body-regata-preto',
       description: 'Básico essencial no seu guarda-roupa. Recorte que valoriza os ombros.',
       price: 99.90,
       salePrice: null,
       category: 'bodys',
       sizes: ['P', 'M', 'G'],
       images: ['/images/body-preto.png'],
       featured: false,
       isNew: true,
       stock: 15
    },
    {
       name: 'Calça Pantalona Alfaiataria c/ Fenda Frontal',
       slug: 'calca-pantalona-fenda-preto',
       description: 'Moderna e fluida. A fenda frontal dá um toque especial à clássica pantalona.',
       price: 199.90,
       salePrice: null,
       category: 'calcas',
       sizes: ['36', '38', '40', '42'],
       images: ['/images/calca-fenda.png'],
       featured: false,
       isNew: true,
       stock: 7
    }
  ]
};

module.exports = seedData;

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

dotenv.config();

const categories = [
  { name: 'Vestidos', slug: 'vestidos', description: 'Vestidos elegantes para todas as ocasiões', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600' },
  { name: 'Blusas', slug: 'blusas', description: 'Blusas modernas e versáteis', image: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=600' },
  { name: 'Calças', slug: 'calcas', description: 'Calças para o dia a dia e ocasiões especiais', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600' },
  { name: 'Saias', slug: 'saias', description: 'Saias leves e estilosas', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600' },
  { name: 'Conjuntos', slug: 'conjuntos', description: 'Conjuntos coordenados para looks completos', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600' },
];

const productImages = {
  vestidos: [
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800',
    'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800',
  ],
  blusas: [
    'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=800',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800',
  ],
  calcas: [
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
    'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=800',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800',
  ],
  saias: [
    'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800',
    'https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=800',
    'https://images.unsplash.com/photo-1570976447640-ac859083963f?w=800',
    'https://images.unsplash.com/photo-1511883040705-6011fad9edfc?w=800',
  ],
  conjuntos: [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800',
  ],
};

const seed = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bloom-ecommerce';
    try {
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to local MongoDB');
    } catch (err) {
      console.log('❌ Local MongoDB connection failed. Starting In-Memory MongoDB for seeding...');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`✅ Connected to In-Memory MongoDB at ${mongoUri}`);
    }

    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin BLOOM',
      email: 'admin@bloom.com',
      password: 'bloom123',
      role: 'admin',
    });
    await User.create({ name: 'Maria Silva', email: 'maria@email.com', password: '123456', role: 'user' });
    console.log('👤 Users created');

    // Create categories
    const cats = await Category.insertMany(categories);
    const catMap = {};
    cats.forEach((c) => { catMap[c.slug] = c._id; });
    console.log('📂 Categories created');

    // Create products
    const products = [
      // VESTIDOS
      { name: 'Vestido Floral Sofia', slug: 'vestido-floral-sofia', description: 'Vestido leve com estampa floral delicada, perfeito para dias ensolarados. Tecido 100% viscose com caimento impecável.', price: 189.90, salePrice: null, category: catMap['vestidos'], sizes: ['P', 'M', 'G', 'GG'], images: productImages.vestidos.slice(0, 2), stock: 15, featured: true, isNew: true, rating: 4.8, numReviews: 24 },
      { name: 'Vestido Midi Elegance', slug: 'vestido-midi-elegance', description: 'Vestido midi com decote V e fenda lateral. Ideal para jantares e eventos sociais.', price: 259.90, salePrice: 209.90, category: catMap['vestidos'], sizes: ['PP', 'P', 'M', 'G'], images: [productImages.vestidos[1], productImages.vestidos[2]], stock: 8, featured: true, isNew: false, rating: 4.9, numReviews: 41 },
      { name: 'Vestido Boho Chic', slug: 'vestido-boho-chic', description: 'Vestido longo com bordados étnicos e alças finas. Estilo boho para festivais e viagens.', price: 219.90, salePrice: null, category: catMap['vestidos'], sizes: ['P', 'M', 'G'], images: [productImages.vestidos[2], productImages.vestidos[0]], stock: 12, featured: false, isNew: true, rating: 4.6, numReviews: 18 },
      { name: 'Vestido Slip Satinado', slug: 'vestido-slip-satinado', description: 'Vestido slip dress em cetim acetinado, minimalista e sofisticado. Ideal para noite.', price: 299.90, salePrice: 239.90, category: catMap['vestidos'], sizes: ['P', 'M', 'G', 'GG'], images: [productImages.vestidos[3], productImages.vestidos[1]], stock: 6, featured: true, isNew: false, rating: 4.7, numReviews: 33 },
      { name: 'Vestido Sundress Branco', slug: 'vestido-sundress-branco', description: 'Vestido curto branco fresquinho, perfeito para o verão. Tecido leve com estampa mínima.', price: 149.90, salePrice: null, category: catMap['vestidos'], sizes: ['PP', 'P', 'M', 'G', 'GG'], images: productImages.vestidos.slice(0, 2), stock: 20, featured: false, isNew: true, rating: 4.5, numReviews: 12 },

      // BLUSAS
      { name: 'Blusa Azul Twist', slug: 'blusa-azul-twist', description: 'Blusa azul com detalhe twist no decote e alças finas. Modelagem ajustada e perfeita para o verão.', price: 119.90, salePrice: null, category: catMap['blusas'], sizes: ['PP', 'P', 'M', 'G'], images: ['/images/blusa-azul-twist.png'], stock: 20, featured: true, isNew: true, rating: 5.0, numReviews: 12 },
      { name: 'Top Laranja Cut Out', slug: 'top-laranja-cut-out', description: 'Top laranja vibrante com detalhe cut out frontal e alcinhas. Estilo ousado e moderno.', price: 99.90, salePrice: null, category: catMap['blusas'], sizes: ['P', 'M', 'G'], images: ['/images/top-laranja-cutout.png'], stock: 15, featured: true, isNew: true, rating: 4.8, numReviews: 8 },
      { name: 'Top Tomara que Caia Amarelo', slug: 'top-tomara-que-caia-amarelo', description: 'Top amarelo sem alças com detalhe drapeado/twist no busto. Peça chave para dias quentes.', price: 89.90, salePrice: null, category: catMap['blusas'], sizes: ['P', 'M', 'G'], images: ['/images/top-amarelo.png'], stock: 25, featured: false, isNew: true, rating: 4.9, numReviews: 5 },
      { name: 'Blusa Cropped Bloom', slug: 'blusa-cropped-bloom', description: 'Blusa cropped em malha canelada com bordado sutil. Combinação perfeita com calças e saias.', price: 89.90, salePrice: null, category: catMap['blusas'], sizes: ['PP', 'P', 'M', 'G'], images: productImages.blusas.slice(0, 2), stock: 30, featured: true, isNew: true, rating: 4.7, numReviews: 52 },
      { name: 'Blusa Transparente Floral', slug: 'blusa-transparente-floral', description: 'Blusa de tule com bordados florais delicados. Elegante e feminina para diversas ocasiões.', price: 129.90, salePrice: 109.90, category: catMap['blusas'], sizes: ['P', 'M', 'G', 'GG'], images: [productImages.blusas[1], productImages.blusas[2]], stock: 18, featured: false, isNew: false, rating: 4.6, numReviews: 29 },
      { name: 'Blusa Muscle Tee Premium', slug: 'blusa-muscle-tee-premium', description: 'Camiseta muscle de algodão premium com lavagem especial. Estilo casual com toque fashion.', price: 79.90, salePrice: null, category: catMap['blusas'], sizes: ['PP', 'P', 'M', 'G', 'GG'], images: [productImages.blusas[2], productImages.blusas[0]], stock: 40, featured: false, isNew: true, rating: 4.4, numReviews: 67 },
      { name: 'Blusa Ombro a Ombro', slug: 'blusa-ombro-a-ombro', description: 'Blusa ombro a ombro em viscose com drapeado frontal. Romântica e versátil.', price: 109.90, salePrice: 89.90, category: catMap['blusas'], sizes: ['P', 'M', 'G'], images: [productImages.blusas[3], productImages.blusas[1]], stock: 22, featured: true, isNew: false, rating: 4.8, numReviews: 38 },

      // CALÇAS
      { name: 'Calça Wide Leg Elegance', slug: 'calca-wide-leg-elegance', description: 'Calça pantalona de alfaiataria em tecido de alta qualidade. Cintura alta e caimento perfeito.', price: 199.90, salePrice: null, category: catMap['calcas'], sizes: ['36', '38', '40', '42', '44'], images: productImages.calcas.slice(0, 2), stock: 14, featured: true, isNew: true, rating: 4.9, numReviews: 45 },
      { name: 'Calça Jeans Mom', slug: 'calca-jeans-mom', description: 'Jeans mom fit cintura alta com lavagem clara. Clássico revival dos anos 90 com toque moderno.', price: 169.90, salePrice: 139.90, category: catMap['calcas'], sizes: ['36', '38', '40', '42'], images: [productImages.calcas[1], productImages.calcas[2]], stock: 25, featured: false, isNew: false, rating: 4.6, numReviews: 73 },
      { name: 'Calça Couro Sintético', slug: 'calca-couro-sintetico', description: 'Calça de couro ecológico skinny. Poderosa e fashionista para looks de dia ou noite.', price: 229.90, salePrice: null, category: catMap['calcas'], sizes: ['36', '38', '40', '42', '44'], images: [productImages.calcas[2], productImages.calcas[0]], stock: 10, featured: true, isNew: false, rating: 4.7, numReviews: 31 },
      { name: 'Calça Linho Palazzo', slug: 'calca-linho-palazzo', description: 'Calça palazzo em linho natural. Leve, confortável e elegante para o verão.', price: 179.90, salePrice: 149.90, category: catMap['calcas'], sizes: ['38', '40', '42', '44'], images: [productImages.calcas[3], productImages.calcas[1]], stock: 16, featured: false, isNew: true, rating: 4.5, numReviews: 23 },

      // SAIAS
      { name: 'Saia Midi Plissada', slug: 'saia-midi-plissada', description: 'Saia midi plissada em tecido fluido. Movimento gracioso e elegância em cada passo.', price: 149.90, salePrice: null, category: catMap['saias'], sizes: ['P', 'M', 'G', 'GG'], images: productImages.saias.slice(0, 2), stock: 18, featured: true, isNew: true, rating: 4.8, numReviews: 36 },
      { name: 'Saia Jeans A-Line', slug: 'saia-jeans-a-line', description: 'Saia jeans A-line midi com fenda frontal. Casual chic para o dia a dia.', price: 129.90, salePrice: 109.90, category: catMap['saias'], sizes: ['36', '38', '40', '42', '44'], images: [productImages.saias[1], productImages.saias[2]], stock: 22, featured: false, isNew: false, rating: 4.5, numReviews: 48 },
      { name: 'Saia Longa Floral', slug: 'saia-longa-floral', description: 'Saia longa com estampa floral vibrante e elástico na cintura. Romantismo e leveza.', price: 139.90, salePrice: null, category: catMap['saias'], sizes: ['P', 'M', 'G'], images: [productImages.saias[2], productImages.saias[0]], stock: 14, featured: false, isNew: true, rating: 4.6, numReviews: 19 },

      // CONJUNTOS
      { name: 'Conjunto Linho Bege', slug: 'conjunto-linho-bege', description: 'Conjunto de blusa e calça em linho bege. Minimalismo sofisticado para qualquer ocasião.', price: 319.90, salePrice: 269.90, category: catMap['conjuntos'], sizes: ['P', 'M', 'G', 'GG'], images: productImages.conjuntos.slice(0, 2), stock: 8, featured: true, isNew: true, rating: 4.9, numReviews: 27 },
      { name: 'Conjunto Cropped + Calça', slug: 'conjunto-cropped-calca', description: 'Conjunto coordenado de cropped e calça pantalona. Look completo e trendy.', price: 269.90, salePrice: null, category: catMap['conjuntos'], sizes: ['PP', 'P', 'M', 'G'], images: [productImages.conjuntos[1], productImages.conjuntos[2]], stock: 12, featured: true, isNew: false, rating: 4.7, numReviews: 41 },
      { name: 'Conjunto Saia + Blusa Floral', slug: 'conjunto-saia-blusa-floral', description: 'Conjunto de saia midi e blusa com estampa floral coordenada. Feminino e charmoso.', price: 249.90, salePrice: 199.90, category: catMap['conjuntos'], sizes: ['P', 'M', 'G', 'GG'], images: [productImages.conjuntos[2], productImages.conjuntos[0]], stock: 10, featured: false, isNew: true, rating: 4.6, numReviews: 33 },
      { name: 'Conjunto Alfaiataria Premium', slug: 'conjunto-alfaiataria-premium', description: 'Blazer e calça de alfaiataria em tecido premium. Poder e elegância para reuniões e eventos.', price: 499.90, salePrice: 399.90, category: catMap['conjuntos'], sizes: ['36', '38', '40', '42', '44'], images: [productImages.conjuntos[3], productImages.conjuntos[1]], stock: 6, featured: true, isNew: false, rating: 5.0, numReviews: 15 },
    ];

    await Product.insertMany(products);
    console.log(`🛍️  ${products.length} products created`);
    console.log('\n✅ Seed complete!');
    console.log('👤 Admin: admin@bloom.com / bloom123');
    console.log('👤 User: maria@email.com / 123456');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();

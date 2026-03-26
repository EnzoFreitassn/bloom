import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import ProductCard from '../components/ProductCard';
import ProductCarousel from '../components/ProductCarousel';
import Loader, { ProductSkeleton } from '../components/Loader';

const heroImage = "/fotos/hero-premium-v4.png";
const promoImage = "/fotos/promo-banner.png";

export default function Home() {
  const { products, isLoading, error, fetchProducts, fetchCategories, categories, setFilter } = useProductStore();

  useEffect(() => {
    fetchCategories();
    // Default fetch for featured
    fetchProducts();
  }, []);

  const featured = products.filter(p => p.featured).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero Banner - Split Layout */}
      <section className="relative h-[calc(100vh-80px)] w-full overflow-hidden flex flex-col lg:grid lg:grid-cols-2">
        {/* Left Side: Text and Content */}
        <div className="flex-1 bg-gradient-to-br from-[#4A1D5B] to-[#2B1038] px-8 sm:px-12 lg:px-20 flex flex-col justify-center relative overflow-hidden order-2 lg:order-1">
          {/* Subtle floral pattern overlay could go here, but I'll stick to a clean look */}
          <div className="max-w-xl animate-in fade-in slide-in-from-left duration-1000">
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
              Elegância <br/>
              <span className="text-brand-gold italic font-light drop-shadow-xl inline-block mt-2">que Floresce</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-md font-light">
              Descubra a nova coleção Outono/Inverno da Bloom. Peças que elevam sua essência com sofisticação e o conforto que você merece.
            </p>
            <Link 
              to="/catalogo" 
              className="inline-block px-12 py-5 bg-white text-brand-dark text-sm font-bold uppercase tracking-widest transition-all hover:bg-brand-gold hover:text-white"
              onClick={() => setFilter('category', '')}
            >
              Comprar Agora
            </Link>
          </div>
          
          {/* Decorative element */}
          <div className="absolute top-0 right-0 h-full w-32 bg-white/5 skew-x-12 translate-x-16 pointer-events-none" />
        </div>

        {/* Right Side: High Quality Photography */}
        <div className="flex-1 h-[40vh] lg:h-full order-1 lg:order-2 relative">
          <img 
            src={heroImage} 
            alt="Coleção Bloom" 
            className="absolute inset-0 w-full h-full object-cover object-top" 
          />
          {/* Subtle dark gradient overlay to blend into the left side slightly on desktop */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#2B1038] to-transparent" />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-brand-dark mb-2">Compre por Categoria</h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-8">
          {categories.map((cat) => (
            <Link 
              to={`/catalogo?category=${cat.slug}`} 
              key={cat._id}
              className="group relative h-64 md:h-80 overflow-hidden cursor-pointer bg-brand-gray"
            >
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl md:text-2xl font-serif font-medium tracking-wide drop-shadow-md">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-20">
              {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="col-span-full py-10 text-center text-red-500">{error}</div>
          ) : (
            <ProductCarousel 
              title="PEÇAS EM DESTAQUE" 
              products={featured} 
              showThumbnails={false} 
              showBuyButton={false} 
            />
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark flex flex-col md:flex-row overflow-hidden rounded-sm">
          <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
            <span className="text-brand-gold uppercase tracking-widest text-sm font-bold mb-4 block">Oferta Especial</span>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">Frete grátis em compras acima de R$ 300</h2>
            <p className="text-gray-300 mb-8 font-light leading-relaxed">
              Renove seu guarda-roupa com as peças mais elegantes da coleção Bloom. Válido para todas as regiões do Brasil por tempo limitado.
            </p>
            <div>
              <Link to="/catalogo" className="btn-primary !bg-brand-gold hover:!bg-brand-goldDark !text-brand-dark font-bold">
                Aproveitar Agora
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 h-64 md:h-auto">
            <img 
              src={promoImage} 
              alt="Promoção BLOOM" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 py-20">
               {Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)}
             </div>
          ) : (
            <ProductCarousel 
              title="BEST SELLERS" 
              products={newArrivals} 
              showThumbnails={true} 
              showBuyButton={true} 
            />
          )}
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-20 bg-brand-gray border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-dark mb-4">Inscreva-se na nossa Newsletter</h2>
          <p className="text-gray-600 mb-8">Receba novidades, inspirações e ofertas exclusivas direto no seu e-mail.</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Seu melhor e-mail" 
              className="input-field flex-grow"
              required
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Cadastrar
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}

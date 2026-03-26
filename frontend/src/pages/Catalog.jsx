import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX } from 'react-icons/fi';
import { useProductStore } from '../store/productStore';
import ProductCard from '../components/ProductCard';
import Loader, { ProductSkeleton } from '../components/Loader';

const SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG', '36', '38', '40', '42', '44', 'Único'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Mais Recentes' },
  { value: 'popular', label: 'Mais Populares' },
  { value: 'price-asc', label: 'Menor Preço' },
  { value: 'price-desc', label: 'Maior Preço' },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const { 
    products, total, page, pages, isLoading, error,
    fetchProducts, fetchCategories, categories,
    filters, setFilter, clearFilters, setPage
  } = useProductStore();

  // Sync URL params to store
  useEffect(() => {
    fetchCategories();
    
    // Read from URL on mount
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest';
    const size = searchParams.get('size') || '';
    const p = searchParams.get('page') || 1;
    
    setFilter('category', category);
    setFilter('sort', sort);
    setFilter('size', size);
    setPage(Number(p));
    
  }, [searchParams]);

  // Fetch products when filters or page changes
  useEffect(() => {
    fetchProducts();
    
    // Update URL
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.sort !== 'newest') params.set('sort', filters.sort);
    if (filters.size) params.set('size', filters.size);
    if (page > 1) params.set('page', page);
    
    setSearchParams(params, { replace: true });
    
  }, [filters, page]);

  const handleFilterChange = (key, value) => {
    setFilter(key, value === filters[key] ? '' : value);
  };

  const handleClear = () => {
    clearFilters();
    setSearchParams({});
    setIsMobileFilterOpen(false);
  };

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal mb-4">Categorias</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat._id} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.category === cat.slug}
                onChange={() => handleFilterChange('category', cat.slug)}
                className="w-4 h-4 text-brand focus:ring-brand border-gray-300 rounded cursor-pointer"
              />
              <span className={`text-sm group-hover:text-brand transition-colors ${filters.category === cat.slug ? 'font-medium text-brand' : 'text-gray-600'}`}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal mb-4">Tamanhos</h3>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => handleFilterChange('size', s)}
              className={`py-2 text-xs font-medium border transition-colors ${
                filters.size === s
                  ? 'bg-brand border-brand text-white'
                  : 'bg-white border-gray-300 text-gray-600 hover:border-brand'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleClear} className="w-full py-2 text-sm font-medium text-gray-500 hover:text-brand underline decoration-gray-300 hover:decoration-brand underline-offset-4 transition-colors">
        Limpar Filtros
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-gray pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-dark mb-2">
            {filters.category ? categories.find(c => c.slug === filters.category)?.name || 'Catálogo' : 'Todas as Roupas'}
          </h1>
          <p className="text-sm text-gray-500">
            {isLoading ? 'Carregando...' : `${total} produtos encontrados`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 text-sm font-medium px-4 py-2 border border-gray-300 rounded-sm"
          >
            <FiFilter className="h-4 w-4" /> Filtros
          </button>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <label htmlFor="sort" className="text-sm text-gray-500 whitespace-nowrap">Ordenar por:</label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => setFilter('sort', e.target.value)}
              className="text-sm border border-gray-300 px-3 py-2 w-full md:w-48 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <FilterSidebar />
        </div>

        {/* Mobile Filter Drawer */}
        <div className={`fixed inset-0 z-50 md:hidden ${isMobileFilterOpen ? '' : 'pointer-events-none'}`}>
          <div 
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0'}`} 
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className={`absolute top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white p-6 shadow-xl transform transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
              <h2 className="text-lg font-bold font-serif uppercase">Filtros</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-gray-500 hover:text-brand">
                <FiX className="h-6 w-6" />
              </button>
            </div>
            <FilterSidebar />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {error ? (
            <div className="bg-red-50 text-red-600 p-4 border border-red-200 text-sm">
              Erro ao carregar produtos: {error}
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
              {Array.from({ length: 9 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-serif text-gray-500 mb-4">Nenhum produto encontrado.</h3>
              <button onClick={handleClear} className="btn-secondary">Limpar Filtros</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex justify-center mt-16 space-x-2">
                  {Array.from({ length: pages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => {
                        setPage(i + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 border transition-colors flex items-center justify-center font-medium ${
                        page === i + 1 
                          ? 'bg-brand text-white border-brand' 
                          : 'bg-white text-gray-600 border-gray-300 hover:border-brand hover:text-brand'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

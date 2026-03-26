import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiTruck, FiRefreshCcw, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';
import Loader from '../components/Loader';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, isLoading, error, fetchProductBySlug } = useProductStore();
  const { addItem } = useCartStore();
  
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductBySlug(slug);
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (product?.images?.length > 0) setActiveImage(0);
    setSelectedSize('');
    setQuantity(1);
  }, [product]);

  if (isLoading) return <Loader fullScreen />;
  
  if (error || !product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-serif text-brand-dark mb-4">Produto não encontrado</h2>
        <button onClick={() => navigate('/catalogo')} className="btn-primary">Voltar ao Catálogo</button>
      </div>
    );
  }

  const isSale = product.salePrice && product.salePrice < product.price;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Selecione um tamanho');
      return;
    }
    addItem(product, selectedSize, quantity);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-16">
        
        {/* Images Gallery */}
        <div className="w-full md:w-1/2 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:w-24 flex-shrink-0 no-scrollbar">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-20 md:w-full aspect-[3/4] flex-shrink-0 border-2 transition-all ${
                  activeImage === idx ? 'border-brand opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img 
                  src={img?.startsWith('http') || img?.startsWith('/images') || img?.startsWith('/fotos') ? img : (import.meta.env.VITE_API_URL?.replace('/api', '') + img || img)} 
                  alt={`${product.name} - imagem ${idx + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-grow bg-brand-gray relative aspect-[3/4] overflow-hidden group">
            <img 
              src={product.images[activeImage]?.startsWith('http') || product.images[activeImage]?.startsWith('/images') || product.images[activeImage]?.startsWith('/fotos') ? product.images[activeImage] : (import.meta.env.VITE_API_URL?.replace('/api', '') + product.images[activeImage] || product.images[activeImage])} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {product.isNew && <span className="bg-brand text-white text-xs font-bold uppercase tracking-wider px-3 py-1">Novo</span>}
              {isSale && <span className="bg-brand-gold text-white text-xs font-bold uppercase tracking-wider px-3 py-1">{Math.round((1 - product.salePrice / product.price) * 100)}% OFF</span>}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col">
          <nav className="text-sm text-gray-500 mb-4 flex items-center gap-2">
            <span onClick={() => navigate('/')} className="hover:text-brand cursor-pointer">Home</span>
            <span>/</span>
            <span onClick={() => navigate(`/catalogo?category=${product.category?.slug}`)} className="hover:text-brand cursor-pointer truncate">
              {product.category?.name}
            </span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-end gap-4 mb-6">
            {isSale ? (
              <>
                <span className="text-3xl font-bold text-brand">R$ {product.salePrice.toFixed(2)}</span>
                <span className="text-xl text-gray-400 line-through pb-1">R$ {product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-3xl font-bold text-brand-charcoal">R$ {product.price.toFixed(2)}</span>
            )}
            <span className="text-sm text-gray-500 ml-auto pb-1">
              Em até 6x s/ juros ou 5% desc. no PIX
            </span>
          </div>

          <div className="prose prose-sm text-gray-600 mb-8 max-w-none">
            <p>{product.description}</p>
          </div>

          <div className="h-px w-full bg-brand-gray mb-8"></div>

          {/* Sizes */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-charcoal">Selecione o Tamanho</h3>
              <button className="text-xs text-brand underline underline-offset-4 pointer-events-none opacity-50">Guia de Medidas</button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 border flex items-center justify-center text-sm font-medium transition-colors ${
                    selectedSize === size 
                      ? 'bg-brand text-white border-brand shadow-md' 
                      : 'bg-white text-gray-600 border-gray-300 hover:border-brand hover:text-brand'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex border border-gray-300 h-14 w-32 items-center justify-between px-3">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-gray-500 hover:text-brand p-2"
              >
                -
              </button>
              <span className="font-medium text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="text-gray-500 hover:text-brand p-2"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 h-14 flex items-center justify-center uppercase tracking-widest font-medium text-sm transition-colors ${
                isOutOfStock 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-brand text-white hover:bg-brand-light'
              }`}
            >
              <FiShoppingBag className="mr-2 h-5 w-5" />
              {isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
            </button>

            <button className="h-14 w-14 border border-gray-300 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500 transition-colors">
              <FiHeart className="h-6 w-6" />
            </button>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-6 border-t border-brand-gray">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FiTruck className="h-5 w-5 text-brand" />
              <span>Frete fixo <span className="font-bold text-brand-charcoal">R$ 15,00</span> BR</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FiRefreshCcw className="h-5 w-5 text-brand" />
              <span>1ª Troca <span className="font-bold text-brand-charcoal">Grátis</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <FiShield className="h-5 w-5 text-brand" />
              <span>Compra 100% Segura</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

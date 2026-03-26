import { Link } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

export default function ProductCard({ product, showThumbnails = false, showBuyButton = false }) {
  const isSale = product.salePrice && product.salePrice < product.price;
  const currentPrice = isSale ? product.salePrice : product.price;
  const installmentPrice = currentPrice / 6;

  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="group flex flex-col relative w-full h-full">
      <Link to={`/produto/${product.slug}`} className="relative overflow-hidden aspect-[3/4] mb-3 bg-gray-100 flex-shrink-0">
        {/* Images */}
        <img
          src={product.images?.[0]?.startsWith('http') || product.images?.[0]?.startsWith('/images') || product.images?.[0]?.startsWith('/fotos') ? product.images[0] : (import.meta.env.VITE_API_URL?.replace('/api', '') + product.images?.[0] || product.images?.[0])}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Heart Icon */}
        <button className="absolute top-3 right-3 text-[#F06260] hover:text-red-600 transition-colors z-20" onClick={(e) => { e.preventDefault(); }}>
          <FiHeart size={24} className="stroke-[1.5]" />
        </button>
      </Link>

      <div className="flex flex-col flex-grow">
        <Link to={`/produto/${product.slug}`}>
          <h3 className="text-sm font-bold text-black hover:text-gray-700 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex flex-col mt-2">
          <span className="text-[15px] font-bold text-[#F06260]">
            R$ {formatPrice(currentPrice)}
          </span>
          <span className="text-xs text-gray-500 font-medium">
            ou 6x de R$ {formatPrice(installmentPrice)}
          </span>
        </div>

        {/* Thumbnails (optional) */}
        {showThumbnails && product.images && product.images.length > 0 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-1 no-scrollbar flex-shrink-0">
            {product.images.slice(0, 5).map((img, idx) => (
              <div key={idx} className={`w-[30px] h-[40px] flex-shrink-0 cursor-pointer ${idx === 0 ? 'border-2 border-black' : 'border border-gray-300'}`}>
                <img src={img.startsWith('http') || img.startsWith('/images') || img.startsWith('/fotos') ? img : import.meta.env.VITE_API_URL?.replace('/api', '') + img} alt="thumb" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4">
          {/* Buy Button (optional) */}
          {showBuyButton && (
            <button className="w-full bg-black text-white py-3 text-xs font-bold tracking-widest hover:bg-gray-800 transition-colors">
              COMPRAR
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

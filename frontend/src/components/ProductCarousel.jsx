import { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from './ProductCard';

export default function ProductCarousel({ title, products, showThumbnails, showBuyButton }) {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col py-10 relative">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-black uppercase tracking-wide">
        {title}
      </h2>
      
      <div className="relative group/carousel max-w-[1400px] mx-auto w-full px-4 md:px-12">
        {/* Left Arrow */}
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-[40%] -translate-y-1/2 z-10 bg-white/80 p-2 text-black hover:bg-white transition-colors cursor-pointer opacity-0 group-hover/carousel:opacity-100 hidden md:block"
        >
          <FiChevronLeft size={36} />
        </button>

        {/* Scroll Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory no-scrollbar pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product._id || product.id} className="snap-start shrink-0 w-[60vw] md:w-[280px] lg:w-[300px]">
              <ProductCard 
                product={product} 
                showThumbnails={showThumbnails} 
                showBuyButton={showBuyButton} 
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-[40%] -translate-y-1/2 z-10 bg-white/80 p-2 text-black hover:bg-white transition-colors cursor-pointer opacity-0 group-hover/carousel:opacity-100 hidden md:block"
        >
          <FiChevronRight size={36} />
        </button>
      </div>
      
      {/* Hide scrollbar styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}

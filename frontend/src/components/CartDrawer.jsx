import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, updateQuantity, removeItem, getTotal } = useCartStore();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-brand-gray">
          <h2 className="text-lg font-serif font-bold uppercase tracking-widest flex items-center gap-2">
            <FiShoppingBag className="h-5 w-5" />
            Seu Carrinho
          </h2>
          <button 
            onClick={closeCart}
            className="p-2 text-brand-charcoal hover:text-brand transition-colors rounded-full hover:bg-brand-gray"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-20 h-20 bg-brand-gray rounded-full flex items-center justify-center text-brand mb-4">
                <FiShoppingBag className="h-10 w-10" />
              </div>
              <p className="text-gray-500 mb-4">Seu carrinho está vazio.</p>
              <Link 
                to="/catalogo" 
                onClick={closeCart}
                className="btn-primary w-full max-w-xs block"
              >
                Continuar Comprando
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.product}-${item.size}`} className="flex gap-4 group">
                {/* Image */}
                <div className="w-20 h-24 bg-brand-gray flex-shrink-0 relative overflow-hidden">
                  <img 
                    src={item.image?.startsWith('http') || item.image?.startsWith('/images') || item.image?.startsWith('/fotos') ? item.image : (import.meta.env.VITE_API_URL?.replace('/api', '') + item.image || item.image)} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link 
                        to={`/produto/${item.product}`} 
                        onClick={closeCart}
                        className="font-medium text-sm line-clamp-2 hover:text-brand transition-colors flex-1 pr-2"
                      >
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => removeItem(item.product, item.size)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Tamanho: {item.size}</p>
                    <p className="font-medium text-brand mt-1">R$ {item.price.toFixed(2)}</p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-gray-300">
                      <button 
                        onClick={() => updateQuantity(item.product, item.size, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-brand-gray transition-colors text-gray-600"
                      >
                        <FiMinus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product, item.size, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-brand-gray transition-colors text-gray-600"
                      >
                        <FiPlus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-brand-gray p-4 space-y-4 bg-gray-50">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium">R$ {getTotal().toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500">Frete e impostos calculados no checkout.</p>
            <Link 
              to="/carrinho" 
              onClick={closeCart}
              className="btn-primary block w-full text-center"
            >
              Finalizar Compra
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

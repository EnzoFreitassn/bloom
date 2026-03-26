import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag, FiShield } from 'react-icons/fi';
import { useCartStore } from '../store/cartStore';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-brand-gray rounded-full flex items-center justify-center text-brand mx-auto mb-6">
          <FiShoppingBag className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-brand-dark mb-4">Seu carrinho está vazio</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Parece que você ainda não adicionou nenhum produto ao carrinho. Descubra nossas novidades e promoções.
        </p>
        <Link to="/catalogo" className="btn-primary inline-flex items-center gap-2">
          <FiArrowLeft /> Voltar para a loja
        </Link>
      </div>
    );
  }

  const subtotal = getTotal();
  const shipping = subtotal > 300 ? 0 : 15.0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-serif font-bold text-brand-dark mb-8">Meu Carrinho</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items list */}
        <div className="flex-grow">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-brand-gray text-xs font-bold uppercase tracking-wider text-gray-500">
            <div className="col-span-6">Produto</div>
            <div className="col-span-2 text-center">Preço</div>
            <div className="col-span-2 text-center">Quantidade</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="divide-y divide-brand-gray">
            {items.map((item) => (
              <div key={`${item.product}-${item.size}`} className="py-6 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 group">
                {/* Product Info */}
                <div className="col-span-6 flex gap-4">
                  <Link to={`/produto/${item.product}`} className="w-24 h-32 bg-brand-gray flex-shrink-0">
                    <img 
                      src={item.image?.startsWith('http') || item.image?.startsWith('/images') || item.image?.startsWith('/fotos') ? item.image : (import.meta.env.VITE_API_URL?.replace('/api', '') + item.image || item.image)} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </Link>
                  <div className="flex flex-col justify-center">
                    <Link to={`/produto/${item.product}`} className="font-medium text-brand-charcoal hover:text-brand transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">Tamanho: {item.size}</p>
                    <button 
                      onClick={() => removeItem(item.product, item.size)}
                      className="text-xs text-brand hover:text-red-500 font-medium mt-3 uppercase tracking-wide flex items-center gap-1 w-max transition-colors"
                    >
                      <FiTrash2 className="h-3 w-3" /> Remover
                    </button>
                  </div>
                </div>

                {/* Price (desktop) */}
                <div className="hidden md:block col-span-2 text-center text-gray-600">
                  R$ {item.price.toFixed(2)}
                </div>

                {/* Quantity */}
                <div className="col-span-2 md:text-center mt-2 md:mt-0 flex justify-between items-center md:block">
                  <div className="md:hidden font-medium text-gray-600">R$ {item.price.toFixed(2)}</div>
                  <div className="inline-flex items-center border border-gray-300 bg-white">
                    <button 
                      onClick={() => updateQuantity(item.product, item.size, item.quantity - 1)}
                      className="px-2 py-1.5 hover:bg-brand-gray transition-colors text-gray-600"
                    >
                      <FiMinus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product, item.size, item.quantity + 1)}
                      className="px-2 py-1.5 hover:bg-brand-gray transition-colors text-gray-600"
                    >
                      <FiPlus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="col-span-2 text-right font-medium text-brand-dark flex justify-between md:block mt-2 md:mt-0 pt-4 md:pt-0 border-t border-brand-gray md:border-0">
                  <span className="md:hidden text-gray-500 uppercase text-xs font-bold tracking-wider">Subtotal:</span>
                  R$ {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link to="/catalogo" className="text-sm font-medium text-brand-charcoal hover:text-brand inline-flex items-center gap-2 transition-colors">
              <FiArrowLeft /> Continuar Comprando
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-brand-gray p-6">
            <h2 className="text-lg font-serif font-bold uppercase tracking-wider border-b border-gray-300 pb-4 mb-6">
              Resumo do Pedido
            </h2>

            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                {shipping === 0 ? (
                  <span className="text-green-600 uppercase font-bold text-xs">Grátis</span>
                ) : (
                  <span>R$ {shipping.toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-300 pt-4 mb-8">
              <span className="font-bold text-brand-charcoal uppercase tracking-wider text-sm">Total</span>
              <span className="font-bold text-xl text-brand">R$ {total.toFixed(2)}</span>
            </div>

            <button 
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full"
            >
              Finalizar Compra
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
              <FiShield className="h-4 w-4" />
              <span>Checkout Seguro e Criptografado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

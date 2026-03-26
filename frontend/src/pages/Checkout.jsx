import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiShield, FiLock, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    // If not logged in, redirect to login
    if (!token && step === 1) {
      toast('Faça login para continuar', { icon: '🔒' });
      navigate('/login');
    }
  }, [token, navigate, step]);

  if (items.length === 0 && !successOrder) {
    navigate('/carrinho');
    return null;
  }

  const subtotal = getTotal();
  const shippingPrice = subtotal > 300 ? 0 : 15.0;
  const total = subtotal + shippingPrice;

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) setStep(2);
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    try {
      // Create order in backend
      const orderData = {
        orderItems: items,
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice,
        totalPrice: total,
      };

      // Simulating API call since it's a mock
      const { data } = await api.post('/orders', {
        items,
        shippingAddress,
        paymentMethod,
        subtotal,
        shippingPrice,
        total,
      });

      // Simulate payment processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark as paid
      await api.put(`/orders/${data._id}/pay`, {
        id: 'mock_payment_' + Date.now(),
        status: 'COMPLETED',
        update_time: new Date().toISOString()
      });

      setSuccessOrder(data._id);
      clearCart();
      setStep(3);
      toast.success('Pedido realizado com sucesso!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao processar pedido');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-brand-cream">
        <div className="max-w-md w-full bg-white p-10 text-center shadow-lg border border-brand-gray">
          <FiCheckCircle className="h-20 w-20 text-brand-gold mx-auto mb-6" />
          <h2 className="text-3xl font-serif font-bold text-brand-dark mb-4">Pedido Confirmado!</h2>
          <p className="text-gray-600 mb-2">Obrigado por comprar na BLOOM.</p>
          <p className="text-sm text-gray-500 mb-8 border-b border-brand-gray pb-8">
            Número do pedido: <strong className="text-brand-charcoal">{successOrder}</strong>
          </p>
          <div className="space-y-4">
            <Link to="/catalogo" className="btn-primary w-full block">Continuar Comprando</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Progress Bar */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center max-w-xl w-full">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-brand' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 1 ? 'border-brand bg-brand-cream' : 'border-gray-300 bg-white'}`}>1</span>
            <span className="text-xs font-bold uppercase tracking-wider mt-2">Endereço</span>
          </div>
          <div className={`flex-auto h-0.5 mx-4 ${step >= 2 ? 'bg-brand' : 'bg-gray-300'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-brand' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 2 ? 'border-brand bg-brand-cream' : 'border-gray-300 bg-white'}`}>2</span>
            <span className="text-xs font-bold uppercase tracking-wider mt-2">Pagamento</span>
          </div>
          <div className={`flex-auto h-0.5 mx-4 ${step >= 3 ? 'bg-brand' : 'bg-gray-300'}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-brand' : 'text-gray-400'}`}>
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step >= 3 ? 'border-brand bg-brand-cream' : 'border-gray-300 bg-white'}`}>3</span>
            <span className="text-xs font-bold uppercase tracking-wider mt-2">Conclusão</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Forms */}
        <div className="flex-grow order-2 lg:order-1">
          {step === 1 && (
            <form onSubmit={handleNextStep} className="bg-white p-8 border border-brand-gray shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6">Endereço de Entrega</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Recebedor</label>
                  <input
                    type="text" required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                  <input
                    type="text" required placeholder="00000-000"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logradouro (Rua, Av, etc)</label>
                  <input
                    type="text" required
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                  <input
                    type="text" required
                    value={shippingAddress.number}
                    onChange={(e) => setShippingAddress({...shippingAddress, number: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                  <input
                    type="text"
                    value={shippingAddress.complement}
                    onChange={(e) => setShippingAddress({...shippingAddress, complement: e.target.value})}
                    className="input-field" placeholder="Apto, Bloco (Opcional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                  <input
                    type="text" required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <input
                    type="text" required placeholder="SP" maxLength={2}
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value.toUpperCase()})}
                    className="input-field uppercase"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-brand-gray mt-8">
                <Link to="/carrinho" className="text-sm text-gray-500 hover:text-brand transition-colors">Voltar ao Carrinho</Link>
                <button type="submit" className="btn-primary">Continuar para o Pagamento</button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="bg-white p-8 border border-brand-gray shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-brand-dark mb-6 flex items-center gap-2">
                <FiLock className="text-brand" /> Pagamento Seguro
              </h2>

              <div className="space-y-4 mb-8">
                <label className={`block p-4 border rounded-sm cursor-pointer transition-colors ${paymentMethod === 'credit_card' ? 'border-brand bg-brand-cream' : 'border-gray-300 hover:border-gray-400'}`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-brand focus:ring-brand"
                    />
                    <span className="ml-3 font-medium text-brand-charcoal">Cartão de Crédito</span>
                  </div>
                  {paymentMethod === 'credit_card' && (
                    <div className="mt-4 pl-7 text-xs text-gray-500">
                      Integração de pagamento simulada neste ambiente de teste.
                    </div>
                  )}
                </label>

                <label className={`block p-4 border rounded-sm cursor-pointer transition-colors ${paymentMethod === 'pix' ? 'border-brand bg-brand-cream' : 'border-gray-300 hover:border-gray-400'}`}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="pix"
                      checked={paymentMethod === 'pix'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-brand focus:ring-brand"
                    />
                    <span className="ml-3 font-medium text-brand-charcoal">PIX (5% de desconto)</span>
                  </div>
                </label>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                <div className="flex items-start">
                  <FiAlertCircle className="text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <p className="text-sm text-blue-700 text-justify">
                    Este é um ambiente de simulação de e-commerce. Nenhum cartão de crédito real será cobrado ou processado.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-brand-gray mt-8">
                <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-brand transition-colors">Voltar para Endereço</button>
                <button 
                  onClick={handlePlaceOrder} 
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? 'Processando...' : 'Finalizar Pedido'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary sidebar */}
        <div className="w-full lg:w-96 flex-shrink-0 order-1 lg:order-2">
          <div className="bg-brand-gray p-6 sticky top-24">
            <h3 className="text-lg font-serif font-bold uppercase tracking-wider border-b border-gray-300 pb-4 mb-6">
              Resumo da Compra
            </h3>

            <div className="space-y-4 max-h-64 overflow-y-auto no-scrollbar mb-6">
              {items.map((item) => (
                <div key={`${item.product}-${item.size}`} className="flex justify-between text-sm">
                  <div className="flex-1 pr-4">
                    <p className="font-medium text-brand-charcoal line-clamp-1">{item.name}</p>
                    <p className="text-gray-500 text-xs mt-1">Tam: {item.size} • Qtd: {item.quantity}</p>
                  </div>
                  <div className="font-medium">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-gray-300 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} itens)</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete</span>
                {shippingPrice === 0 ? (
                  <span className="text-green-600 uppercase font-bold text-xs">Grátis</span>
                ) : (
                  <span>R$ {shippingPrice.toFixed(2)}</span>
                )}
              </div>
              {paymentMethod === 'pix' && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>Desconto PIX (5%)</span>
                  <span>- R$ {(total * 0.05).toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-300">
              <span className="font-bold text-brand-charcoal uppercase tracking-wider text-sm">Total</span>
              <span className="font-bold text-2xl text-brand">
                R$ {(paymentMethod === 'pix' ? total * 0.95 : total).toFixed(2)}
              </span>
            </div>

            <div className="mt-8 flex flex-col items-center gap-2 text-xs text-gray-500 bg-white p-3 rounded-sm border border-gray-200">
              <FiShield className="h-5 w-5 text-gray-400" />
              <span className="text-center">Ambiente 100% seguro. Seus dados são criptografados.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiMapPin, FiCheckCircle, FiEdit2, FiX, FiInfo } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

export default function Addresses() {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingInProcess, setIsAddingInProcess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    recipient_name: '',
    zip_code: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    is_default: false
  });

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data);
    } catch (error) {
      toast.error('Erro ao carregar endereços');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCepLookup = async (cep) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData(prev => ({
            ...prev,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf
          }));
        }
      } catch (error) {
        console.error('CEP lookup failed', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsAddingInProcess(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Sessão expirada. Faça login novamente.');
        return;
      }
      
      const userId = session.user.id;

      // If set as default, unset others first
      if (formData.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId);
      }

      const { error } = await supabase
        .from('addresses')
        .insert([{ ...formData, user_id: userId }]);

      if (error) throw error;
      
      toast.success('Endereço adicionado!');
      setShowForm(false);
      setFormData({
        title: '',
        recipient_name: '',
        zip_code: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        is_default: false
      });
      fetchAddresses();
    } catch (error) {
      toast.error('Erro ao salvar endereço');
      console.error(error);
    } finally {
      setIsAddingInProcess(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
      try {
        const { error } = await supabase
          .from('addresses')
          .delete()
          .eq('id', id);

        if (error) throw error;
        toast.success('Endereço removido');
        fetchAddresses();
      } catch (error) {
        toast.error('Erro ao excluir endereço');
        console.error(error);
      }
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Unset all
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id);

      // Set this one
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      fetchAddresses();
    } catch (error) {
      toast.error('Erro ao atualizar endereço padrão');
    }
  };

  if (isLoading && addresses.length === 0) return <Loader fullScreen />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-dark mb-2">Meus Endereços</h1>
          <p className="text-gray-500 text-sm">Gerencie seus locais de entrega para agilizar suas compras.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Novo Endereço
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white border-2 border-brand-gray p-6 mb-12 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif font-bold text-brand-dark uppercase tracking-widest">Novo Endereço</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-brand"><FiX size={24} /></button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Título (Ex: Casa, Trabalho)</label>
              <input 
                required
                className="input-field" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Minha Casa"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nome do Destinatário</label>
              <input 
                required
                className="input-field"
                value={formData.recipient_name}
                onChange={e => setFormData({...formData, recipient_name: e.target.value})}
                placeholder="Quem receberá a encomenda?"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">CEP</label>
              <input 
                required
                className="input-field"
                value={formData.zip_code}
                onChange={e => {
                  setFormData({...formData, zip_code: e.target.value});
                  handleCepLookup(e.target.value);
                }}
                placeholder="00000-000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Rua / Logradouro</label>
              <input 
                required
                className="input-field"
                value={formData.street}
                onChange={e => setFormData({...formData, street: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Número</label>
                <input 
                  required
                  className="input-field"
                  value={formData.number}
                  onChange={e => setFormData({...formData, number: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Complemento</label>
                <input 
                  className="input-field"
                  value={formData.complement}
                  onChange={e => setFormData({...formData, complement: e.target.value})}
                  placeholder="Apto, Bloco..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Bairro</label>
              <input 
                required
                className="input-field"
                value={formData.neighborhood}
                onChange={e => setFormData({...formData, neighborhood: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Cidade</label>
              <input 
                required
                className="input-field"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Estado (UF)</label>
              <input 
                required
                maxLength="2"
                className="input-field uppercase"
                value={formData.state}
                onChange={e => setFormData({...formData, state: e.target.value.toUpperCase()})}
                placeholder="RJ"
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3 py-2">
              <input 
                type="checkbox" 
                id="is_default"
                className="w-5 h-5 text-brand border-gray-300 rounded focus:ring-brand"
                checked={formData.is_default}
                onChange={e => setFormData({...formData, is_default: e.target.checked})}
              />
              <label htmlFor="is_default" className="text-sm text-gray-600 cursor-pointer">Definir como endereço padrão</label>
            </div>

            <div className="md:col-span-2 flex gap-4 mt-4">
              <button 
                type="submit" 
                disabled={isAddingInProcess}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {isAddingInProcess ? 'Salvando...' : 'Salvar Endereço'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="btn-secondary px-8"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="bg-brand-gray p-12 text-center rounded-sm">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <FiMapPin size={32} />
          </div>
          <h3 className="text-lg font-serif font-bold text-brand-dark mb-2">Nenhum endereço cadastrado</h3>
          <p className="text-gray-500 mb-8 max-w-xs mx-auto">Adicione um endereço para realizar suas compras com mais rapidez e segurança.</p>
          <button 
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Cadastrar Primeiro Endereço
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className={`p-6 border-2 transition-all relative group ${
                address.is_default ? 'border-brand bg-white shadow-md' : 'border-brand-gray bg-white'
              }`}
            >
              {address.is_default && (
                <div className="absolute top-0 right-0 bg-brand text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-1">
                  <FiCheckCircle size={10} /> Padrão
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-serif font-bold text-brand-dark uppercase tracking-widest text-sm flex items-center gap-2">
                  <FiMapPin className="text-brand" /> {address.title}
                </h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!address.is_default && (
                    <button 
                      onClick={() => handleSetDefault(address.id)}
                      title="Tornar Padrão"
                      className="p-2 text-gray-400 hover:text-brand transition-colors"
                    >
                      <FiCheckCircle />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(address.id)}
                    title="Excluir"
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600">
                <p className="font-bold text-brand-charcoal">{address.recipient_name}</p>
                <p>{address.street}, {address.number}{address.complement ? ` - ${address.complement}` : ''}</p>
                <p>{address.neighborhood}</p>
                <p>{address.city} - {address.state}</p>
                <p className="pt-2 text-xs text-gray-400">CEP: {address.zip_code}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 p-6 bg-brand-gray rounded-sm flex items-start gap-4 border-l-4 border-brand-gold">
         <FiInfo className="text-brand-gold mt-1 flex-shrink-0" size={20} />
         <p className="text-xs text-gray-600 leading-relaxed">
           Suas informações de endereço são salvas de forma segura e utilizadas apenas para o cálculo de frete e envio das suas encomendas. 
           Você pode gerenciar ou excluir seus dados a qualquer momento de acordo com a nossa Política de Privacidade.
         </p>
      </div>
    </div>
  );
}

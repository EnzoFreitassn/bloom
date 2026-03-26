import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiUser, FiMapPin, FiShoppingBag, FiCreditCard, 
  FiLock, FiHeart, FiLogOut, FiEdit2, FiCheckCircle 
} from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import Addresses from './Addresses';
import { supabase } from '../services/supabase';
import toast from 'react-hot-toast';
import { maskCPF, maskPhone, validateCPF, validatePhone } from '../utils/validation';

export default function Profile() {
  const { user, profile, logout, fetchProfile } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dados');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    toast.success('Logout realizado com sucesso');
  };

  const tabs = [
    { id: 'dados', label: 'Dados pessoais', icon: FiUser },
    { id: 'enderecos', label: 'Endereços', icon: FiMapPin },
    { id: 'pedidos', label: 'Pedidos', icon: FiShoppingBag },
    { id: 'cartoes', label: 'Cartões', icon: FiCreditCard },
    { id: 'autenticacao', label: 'Autenticação', icon: FiLock },
    { id: 'favoritos', label: 'Favoritos', icon: FiHeart },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'enderecos':
        return <Addresses />;
      case 'dados':
        return <PersonalInfo user={user} profile={profile} onUpdate={fetchProfile} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <FiCheckCircle size={48} className="mb-4 opacity-20" />
            <p className="text-lg">Esta seção estará disponível em breve.</p>
          </div>
        );
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="flex items-center gap-4 mb-8 px-4">
            <div className="w-16 h-16 bg-brand-gray rounded-full flex items-center justify-center text-brand-dark text-2xl font-bold">
              {profile?.name?.[0].toUpperCase() || user.email[0].toUpperCase()}
            </div>
            <div>
              <p className="text-gray-400 text-sm">Olá!</p>
              <p className="font-bold text-brand-dark">{profile?.name || 'Usuário'}</p>
            </div>
          </div>

          <nav className="flex flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium border-l-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-brand-dark text-brand-dark bg-brand-gray/50'
                    : 'border-transparent text-gray-500 hover:text-brand-dark hover:bg-brand-gray/30'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium border-l-2 border-transparent text-red-500 hover:bg-red-50 mt-4 transition-all"
            >
              <FiLogOut className="h-5 w-5" />
              Sair
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-6 md:p-10 border border-brand-gray min-h-[500px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function PersonalInfo({ user, profile, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    cpf: profile?.cpf || '',
    gender: profile?.gender || '',
    birth_date: profile?.birth_date || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validations
    if (formData.cpf && !validateCPF(formData.cpf)) {
      toast.error('CPF Inválido');
      return;
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      toast.error('Telefone Inválido');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Perfil atualizado!');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast.error('Erro ao atualizar perfil');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
        <h2 className="text-2xl font-serif font-bold text-brand-dark mb-8">Editar Dados Pessoais</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nome Completo</label>
            <input 
              required
              className="input-field"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">CPF</label>
            <input 
              className="input-field"
              value={formData.cpf}
              onChange={e => setFormData({...formData, cpf: maskCPF(e.target.value)})}
              placeholder="000.000.000-00"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Telefone</label>
            <input 
              className="input-field"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: maskPhone(e.target.value)})}
              placeholder="(00) 00000-0000"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Gênero</label>
            <select 
              className="input-field"
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value})}
            >
              <option value="">Selecione</option>
              <option value="Feminino">Feminino</option>
              <option value="Masculino">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Data de Nascimento</label>
            <input 
              type="date"
              className="input-field"
              value={formData.birth_date}
              onChange={e => setFormData({...formData, birth_date: e.target.value})}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button type="submit" disabled={isLoading} className="btn-primary flex-1">
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary px-8">
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-serif font-bold text-brand-dark">Dados pessoais</h2>
        <button 
          onClick={() => setIsEditing(true)}
          className="text-xs font-bold uppercase tracking-widest text-brand-dark hover:underline flex items-center gap-2"
        >
          <FiEdit2 /> Editar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nome</label>
          <p className="text-brand-charcoal text-lg font-medium">{profile?.name || '-'}</p>
        </div>
        <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</label>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">CPF</label>
          <p className="text-brand-charcoal">{profile?.cpf ? maskCPF(profile.cpf) : '-'}</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Gênero</label>
          <p className="text-brand-charcoal">{profile?.gender || '-'}</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Data de nascimento</label>
          <p className="text-brand-charcoal">{profile?.birth_date ? new Date(profile.birth_date).toLocaleDateString() : '-'}</p>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Telefone</label>
          <p className="text-brand-charcoal">{profile?.phone ? maskPhone(profile.phone) : '-'}</p>
        </div>
      </div>

      <div className="mt-16 pt-10 border-t border-brand-gray grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand-dark mb-2">Newsletter</h3>
          <p className="text-xs text-gray-500">Deseja receber e-mails com promoções?</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="news" className="w-5 h-5 text-brand rounded" />
          <label htmlFor="news" className="text-xs text-gray-600 font-medium">Quero receber e-mails com promoções.</label>
        </div>
      </div>
    </div>
  );
}

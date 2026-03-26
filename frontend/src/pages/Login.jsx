import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  
  const { login, register, isLoading, error, clearError } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;
    
    if (isLogin) {
      result = await login(formData.email, formData.password);
    } else {
      result = await register(formData.name, formData.email, formData.password);
    }

    if (result.success) {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-cream">
      <div className="max-w-md w-full bg-white p-8 md:p-10 shadow-sm border border-brand-gray">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-brand-dark mb-2">
            {isLogin ? 'Bem-vinda de volta' : 'Criar Conta'}
          </h2>
          <p className="text-sm text-gray-500">
            {isLogin 
              ? 'Faça login para acompanhar seus pedidos e finalizar compras mais rápido.' 
              : 'Cadastre-se para aproveitar ofertas exclusivas da Bloom.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Maria Silva"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="maria@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <span className="text-sm text-brand-dark hover:text-brand cursor-pointer">
                Esqueceu a senha?
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex justify-center"
          >
            {isLoading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm border-t border-brand-gray pt-6">
          <span className="text-gray-500">
            {isLogin ? 'Ainda não tem conta? ' : 'Já possui conta? '}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              clearError();
            }}
            className="text-brand font-medium hover:underline focus:outline-none"
          >
            {isLogin ? 'Cadastre-se' : 'Faça Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

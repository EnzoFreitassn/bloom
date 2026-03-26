import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, profile, logout } = useAuthStore();
    const { toggleCart, getItemCount } = useCartStore();
    const navigate = useNavigate();

    const handleLogout = () => {
      logout();
      navigate('/');
    };

    return (
      <nav className="bg-gradient-to-r from-[#4A1D5B] to-[#2B1038] sticky top-0 z-40 shadow-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-brand-gold"
              >
                <FiMenu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center justify-center lg:justify-start w-full lg:w-auto absolute lg:relative left-0 pointer-events-none lg:pointer-events-auto">
              <Link to="/" className="pointer-events-auto text-2xl font-serif font-bold text-white tracking-widest uppercase hover:text-brand-gold transition-colors duration-300">
                BLOOM
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              <Link to="/catalogo?category=novidades" className="text-sm font-medium text-white hover:text-brand-gold transition-colors uppercase tracking-widest px-2 py-1">
                Novidades
              </Link>
              <Link to="/catalogo" className="text-sm font-medium text-white hover:text-brand-gold transition-colors uppercase tracking-widest px-2 py-1">
                Roupas
              </Link>
              <Link to="/catalogo?category=vestidos" className="text-sm font-medium text-white hover:text-brand-gold transition-colors uppercase tracking-widest px-2 py-1">
                Vestidos
              </Link>
              <Link to="/sobre" className="text-sm font-medium text-white hover:text-brand-gold transition-colors uppercase tracking-widest px-2 py-1">
                Sobre a Marca
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-6">
              <button className="text-white hover:text-brand-gold transition-colors hidden sm:block">
                <FiSearch className="h-5 w-5" />
              </button>

              <div className="relative group">
                <Link to={user ? "/perfil" : "/login"}>
                  <button className="text-white hover:text-brand-gold transition-colors flex items-center">
                    <FiUser className="h-5 w-5" />
                  </button>
                </Link>
                
                {user && (
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white border border-brand-gray shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="px-4 py-2 border-b border-brand-gray">
                      <p className="text-sm font-medium text-brand-charcoal truncate">
                        Olá, {profile?.name?.split(' ')[0] || user.email.split('@')[0]}
                      </p>
                    </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-gray hover:text-brand">
                      Painel Admin
                    </Link>
                  )}
                  <Link to="/perfil" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-gray hover:text-brand">
                    Meu Perfil
                  </Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-gray hover:text-brand">
                    Sair
                  </button>
                </div>
              )}
            </div>

            <button onClick={toggleCart} className="text-white hover:text-brand-gold transition-colors relative flex items-center">
              <FiShoppingBag className="h-5 w-5" />
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#4A1D5B] text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity z-40 lg:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div className={`fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-4 border-b border-brand-gray bg-gradient-to-r from-[#4A1D5B] to-[#2B1038]">
          <span className="text-xl font-serif font-bold text-white tracking-widest uppercase">BLOOM</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-brand-gold">
            <FiX className="h-6 w-6" />
          </button>
        </div>
        <div className="px-4 py-6 space-y-6">
          <div className="flex flex-col space-y-4">
            <Link to="/catalogo?category=novidades" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-brand-charcoal border-b border-gray-100 pb-2">
              Novidades
            </Link>
            <Link to="/catalogo" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-brand-charcoal border-b border-gray-100 pb-2">
              Roupas
            </Link>
            <Link to="/catalogo?category=vestidos" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-brand-charcoal border-b border-gray-100 pb-2">
              Vestidos
            </Link>
            <Link to="/catalogo?category=blusas" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-brand-charcoal border-b border-gray-100 pb-2">
              Blusas
            </Link>
            <Link to="/catalogo?category=calcas" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-brand-charcoal border-b border-gray-100 pb-2">
              Calças
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

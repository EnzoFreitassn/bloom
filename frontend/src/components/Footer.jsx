import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMail, FiPhone } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-serif font-bold text-brand-gold tracking-widest uppercase mb-4 block">
              BLOOM
            </Link>
            <p className="text-sm text-gray-400 mb-6 italic font-serif text-lg">
              "Elegance That Blooms"
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                <FiInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">
                <FiFacebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-brand-gold">Navegação</h4>
            <ul className="space-y-3">
              <li><Link to="/catalogo?category=novidades" className="text-sm text-gray-400 hover:text-white transition-colors">Novidades</Link></li>
              <li><Link to="/catalogo" className="text-sm text-gray-400 hover:text-white transition-colors">Todas as Roupas</Link></li>
              <li><Link to="/catalogo?category=vestidos" className="text-sm text-gray-400 hover:text-white transition-colors">Vestidos</Link></li>
              <li><Link to="/sobre" className="text-sm text-gray-400 hover:text-white transition-colors">Sobre Nós</Link></li>
              <li><Link to="/contato" className="text-sm text-gray-400 hover:text-white transition-colors">Contato</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-brand-gold">Central de Ajuda</h4>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">Perguntas Frequentes</Link></li>
              <li><Link to="/trocas" className="text-sm text-gray-400 hover:text-white transition-colors">Trocas e Devoluções</Link></li>
              <li><Link to="/prazos" className="text-sm text-gray-400 hover:text-white transition-colors">Prazos de Entrega</Link></li>
              <li><Link to="/rastreio" className="text-sm text-gray-400 hover:text-white transition-colors">Rastreie seu Pedido</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-brand-gold">Atendimento</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-400">
                <FiPhone className="h-4 w-4 mr-2" />
                (11) 99999-9999
              </li>
              <li className="flex items-center text-sm text-gray-400">
                <FiMail className="h-4 w-4 mr-2" />
                contato@bloom.com.br
              </li>
              <li className="text-sm text-gray-400 mt-4">
                Segunda a Sexta<br />das 09h às 18h
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} BLOOM Moda Feminina. Todos os direitos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link to="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
